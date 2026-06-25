import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { sendLicenseEmail } from "@/actions/send-license-email";
import {
  sendSeatsRemovedEmail,
  sendTeamAdminWelcomeEmail,
} from "@/actions/send-team-emails";
import { generateLicenseKey } from "@/lib/license/generate";
import { claimSeat, issueSeatKey } from "@/lib/seats/issue";
import { currentAdminLink, currentJoinLink } from "@/lib/seats/links";
import {
  computeTrimToCap,
  getAssignments,
  getCap,
  setAssignments,
} from "@/lib/seats/store";
import {
  getBaseUrl,
  getStripeClient,
  getSubscriptionPeriodEnd,
  LICENSE_EMAIL_METADATA_KEY,
  LICENSE_METADATA_KEY,
  LICENSE_PERIOD_METADATA_KEY,
  LICENSE_SEATS_METADATA_KEY,
  LICENSE_STATUS_METADATA_KEY,
  LICENSE_TIER_METADATA_KEY,
  normalizeEmail,
  readSubscriptionEmail,
} from "@/lib/stripe/server";

export const runtime = "nodejs";
const LICENSE_SENT_AT_METADATA_KEY = "qoredb_license_sent_at";
const LICENSE_EMAIL_LAST_ERROR_METADATA_KEY = "qoredb_license_email_last_error";

type LicenseStorage =
  | {
      type: "payment_intent";
      id: string;
      metadata: Stripe.Metadata;
    }
  | {
      type: "checkout_session";
      id: string;
      metadata: Stripe.Metadata;
    };

async function resolveLicenseStorage(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<LicenseStorage> {
  if (session.payment_intent) {
    const paymentIntent =
      typeof session.payment_intent === "string"
        ? await stripe.paymentIntents.retrieve(session.payment_intent)
        : session.payment_intent;

    return {
      type: "payment_intent",
      id: paymentIntent.id,
      metadata: paymentIntent.metadata ?? {},
    };
  }

  return {
    type: "checkout_session",
    id: session.id,
    metadata: session.metadata ?? {},
  };
}

async function updateLicenseStorage(
  stripe: Stripe,
  storage: LicenseStorage,
  metadata: Stripe.MetadataParam,
) {
  if (storage.type === "payment_intent") {
    await stripe.paymentIntents.update(storage.id, { metadata });
    return;
  }

  await stripe.checkout.sessions.update(storage.id, { metadata });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Les abonnements Team sont livrés via `customer.subscription.created`.
  // Ce handler reste dédié au one-shot Pro (mode payment).
  if (
    session.mode === "subscription" ||
    session.metadata?.[LICENSE_TIER_METADATA_KEY] === "team"
  ) {
    console.info(
      "checkout.session.completed for subscription, handled by subscription events",
      {
        sessionId: session.id,
        mode: session.mode,
      },
    );
    return;
  }

  if (session.payment_status !== "paid") {
    console.info("checkout.session.completed received but payment not paid", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
    });
    return;
  }

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    throw new Error("Missing customer email on checkout session");
  }

  const normalizedEmail = normalizeEmail(email);
  const stripe = getStripeClient();
  const storage = await resolveLicenseStorage(stripe, session);
  let metadata = storage.metadata;
  const existingLicense = metadata[LICENSE_METADATA_KEY];
  const alreadySentAt = metadata[LICENSE_SENT_AT_METADATA_KEY];
  const licenseKey =
    existingLicense ??
    (await generateLicenseKey({
      email: normalizedEmail,
      paymentId: storage.id,
    }));
  metadata = {
    ...metadata,
    [LICENSE_METADATA_KEY]: licenseKey,
    [LICENSE_EMAIL_METADATA_KEY]: normalizedEmail,
    [LICENSE_STATUS_METADATA_KEY]: "active",
  };
  await updateLicenseStorage(stripe, storage, metadata);

  if (!alreadySentAt) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing, skip license email send");
      } else {
        await sendLicenseEmail({ email: normalizedEmail, licenseKey });
        metadata = {
          ...metadata,
          [LICENSE_SENT_AT_METADATA_KEY]: new Date().toISOString(),
          [LICENSE_EMAIL_LAST_ERROR_METADATA_KEY]: "",
        };
        await updateLicenseStorage(stripe, storage, metadata);
      }
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "unknown email error";
      console.error("License email send failed, license remains generated", {
        paymentReferenceId: storage.id,
        reason,
      });
      metadata = {
        ...metadata,
        [LICENSE_EMAIL_LAST_ERROR_METADATA_KEY]: reason.slice(0, 400),
      };
      await updateLicenseStorage(stripe, storage, metadata);
    }
  }
  console.info("License delivered", {
    sessionId: session.id,
    paymentReferenceId: storage.id,
    paymentReferenceType: storage.type,
    email: normalizedEmail,
  });
}

function isTeamSubscription(subscription: Stripe.Subscription): boolean {
  if (subscription.metadata?.[LICENSE_TIER_METADATA_KEY] === "team") {
    return true;
  }
  const teamPriceId = process.env.STRIPE_TEAM_PRICE_ID;
  if (!teamPriceId) {
    return false;
  }
  return (
    subscription.items?.data?.some((item) => item.price?.id === teamPriceId) ??
    false
  );
}

/** Signature de période (idempotence) : la fin de période courante. */
function teamPeriodSignature(subscription: Stripe.Subscription): string {
  return String(getSubscriptionPeriodEnd(subscription) ?? "none");
}

/** Email best-effort de la clé nominative d'un siège. */
async function emailSeatKey(email: string, licenseKey: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing, skip seat license email");
    return;
  }
  try {
    await sendLicenseEmail({ email, licenseKey, tier: "team", seats: 1 });
  } catch (error) {
    console.error("Seat license email failed, key remains valid", {
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
}

/**
 * `customer.subscription.created` → initialise le ledger, auto-claim le siège
 * ADMIN (email de facturation = siège 1, clé émise + emailée), puis email à
 * l'admin le join-link + l'admin-link. Idempotent : si le ledger est déjà
 * initialisé (created rejoué), on ne fait rien.
 */
async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  baseUrl: string,
) {
  if (!isTeamSubscription(subscription)) {
    return;
  }
  if (getAssignments(subscription).length > 0) {
    console.info("Team subscription already initialized, skip", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const billingEmail = await readSubscriptionEmail(subscription);
  if (!billingEmail) {
    console.warn("Team subscription without resolvable billing email", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const stripe = getStripeClient();
  const cap = getCap(subscription);

  // Siège admin (siège 1) : claim + email de sa clé nominative.
  const claim = await claimSeat(stripe, subscription, billingEmail);
  if (claim.status !== "cap_reached") {
    await emailSeatKey(claim.email, claim.licenseKey);
  }

  // Liens : invitation (join) + gestion (admin).
  const joinUrl = await currentJoinLink(stripe, subscription, baseUrl);
  const adminUrl = currentAdminLink(subscription, baseUrl);

  // Metadata org-level : rétro-compat (success page lit LICENSE_METADATA_KEY),
  // statut, compteur de sièges et garde d'idempotence de période.
  const adminKey = claim.status === "cap_reached" ? "" : claim.licenseKey;
  await stripe.subscriptions.update(subscription.id, {
    metadata: {
      [LICENSE_METADATA_KEY]: adminKey,
      [LICENSE_EMAIL_METADATA_KEY]: billingEmail,
      [LICENSE_SEATS_METADATA_KEY]: String(cap),
      [LICENSE_TIER_METADATA_KEY]: "team",
      [LICENSE_STATUS_METADATA_KEY]: "active",
      [LICENSE_PERIOD_METADATA_KEY]: teamPeriodSignature(subscription),
    },
  });

  if (process.env.RESEND_API_KEY) {
    try {
      await sendTeamAdminWelcomeEmail({
        email: billingEmail,
        joinUrl,
        adminUrl,
        seats: cap,
      });
    } catch (error) {
      console.error("Team admin welcome email failed", {
        subscriptionId: subscription.id,
        reason: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  console.info("Team subscription initialized", {
    subscriptionId: subscription.id,
    billingEmail,
    cap,
  });
}

/**
 * `customer.subscription.updated` → réconcilie le plafond. Si le nombre de
 * sièges ACTIFS dépasse le nouveau cap (quantité baissée), on marque les sièges
 * les plus RÉCENTS `removed` (révocation douce) et on notifie l'admin.
 * No-op si le ledger est équilibré → évite toute boucle (nos propres writes
 * redéclenchent `updated`).
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  if (!isTeamSubscription(subscription)) {
    return;
  }
  const assignments = getAssignments(subscription);
  if (assignments.length === 0) {
    return; // pas encore initialisé (created s'en charge)
  }

  const cap = getCap(subscription);
  const { next, removed } = computeTrimToCap(assignments, cap);
  if (removed.length === 0) {
    return; // équilibré → rien à faire (évite la boucle de re-write)
  }

  const stripe = getStripeClient();
  await setAssignments(stripe, subscription.id, next);

  const billingEmail = await readSubscriptionEmail(subscription);
  if (billingEmail && process.env.RESEND_API_KEY) {
    try {
      await sendSeatsRemovedEmail({
        email: billingEmail,
        removedEmails: removed,
      });
    } catch (error) {
      console.error("Seats removed notification failed", {
        subscriptionId: subscription.id,
        reason: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  console.warn("Team seats trimmed to cap", {
    subscriptionId: subscription.id,
    removed,
    cap,
  });
}

async function getSubscriptionFromInvoice(
  invoice: Stripe.Invoice,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripeClient();
  const readId = (value: unknown): string | null => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "id" in value) {
      const id = (value as { id?: unknown }).id;
      return typeof id === "string" ? id : null;
    }
    return null;
  };

  const direct = (invoice as unknown as { subscription?: unknown })
    .subscription;
  let subscriptionId = readId(direct);

  if (!subscriptionId) {
    const parent = (
      invoice as unknown as {
        parent?: { subscription_details?: { subscription?: unknown } };
      }
    ).parent;
    subscriptionId = readId(parent?.subscription_details?.subscription);
  }

  if (!subscriptionId) {
    const line = invoice.lines?.data?.find(
      (entry) => (entry as unknown as { subscription?: unknown }).subscription,
    );
    subscriptionId = readId(
      (line as unknown as { subscription?: unknown })?.subscription,
    );
  }

  if (!subscriptionId) {
    return null;
  }
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * `invoice.paid` → renouvellement. Réémet la clé de CHAQUE siège actif avec un
 * `expires_at` repoussé et l'email à son porteur. La facture de création
 * (même période que celle initialisée par `created`) est ignorée via la garde
 * d'idempotence de période.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscription = await getSubscriptionFromInvoice(invoice);
  if (!subscription || !isTeamSubscription(subscription)) {
    return;
  }

  const stripe = getStripeClient();
  const signature = teamPeriodSignature(subscription);
  if (subscription.metadata?.[LICENSE_PERIOD_METADATA_KEY] === signature) {
    return; // période déjà traitée (création ou évènement rejoué)
  }

  const active = getAssignments(subscription).filter(
    (seat) => seat.status === "active",
  );
  if (active.length === 0) {
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        [LICENSE_PERIOD_METADATA_KEY]: signature,
        [LICENSE_STATUS_METADATA_KEY]: "active",
      },
    });
    return;
  }

  const billingEmail = subscription.metadata?.[LICENSE_EMAIL_METADATA_KEY];
  let adminKey = subscription.metadata?.[LICENSE_METADATA_KEY] ?? "";
  for (const seat of active) {
    const key = await issueSeatKey(subscription, seat.email);
    await emailSeatKey(seat.email, key);
    if (billingEmail && seat.email === billingEmail) {
      adminKey = key;
    }
  }

  await stripe.subscriptions.update(subscription.id, {
    metadata: {
      [LICENSE_METADATA_KEY]: adminKey,
      [LICENSE_PERIOD_METADATA_KEY]: signature,
      [LICENSE_STATUS_METADATA_KEY]: "active",
    },
  });

  console.info("Team seats reissued at renewal", {
    subscriptionId: subscription.id,
    count: active.length,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  if (!isTeamSubscription(subscription)) {
    return;
  }
  // On NE réémet pas : la clé courante expire naturellement (fin de période +
  // grâce). On se contente de tracer l'état pour les endpoints self-service.
  const stripe = getStripeClient();
  try {
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        ...subscription.metadata,
        [LICENSE_STATUS_METADATA_KEY]: "canceled",
      },
    });
  } catch (error) {
    console.warn("Unable to flag canceled subscription metadata", {
      subscriptionId: subscription.id,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
  console.info("Team subscription canceled", {
    subscriptionId: subscription.id,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await getSubscriptionFromInvoice(invoice);
  if (!subscription || !isTeamSubscription(subscription)) {
    return;
  }
  const stripe = getStripeClient();
  try {
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        ...subscription.metadata,
        [LICENSE_STATUS_METADATA_KEY]: "past_due",
      },
    });
  } catch (error) {
    console.warn("Unable to flag past_due subscription metadata", {
      subscriptionId: subscription.id,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }
  console.warn("Team subscription payment failed", {
    subscriptionId: subscription.id,
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const stripe = getStripeClient();
  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: {
      ...paymentIntent.metadata,
      [LICENSE_STATUS_METADATA_KEY]: "failed",
    },
  });

  console.warn("Payment failed", {
    paymentIntentId: paymentIntent.id,
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) {
    return;
  }

  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: {
      ...paymentIntent.metadata,
      [LICENSE_STATUS_METADATA_KEY]: "refunded",
    },
  });

  console.info("Charge refunded", { paymentIntentId });
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "STRIPE_WEBHOOK_SECRET is missing" },
        { status: 500 },
      );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const payload = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
          getBaseUrl(request),
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        console.info("Unhandled Stripe event", { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook failed", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
