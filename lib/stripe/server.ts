import Stripe from "stripe";

export const LICENSE_METADATA_KEY = "qoredb_license_key";
export const LICENSE_EMAIL_METADATA_KEY = "qoredb_customer_email";
export const LICENSE_STATUS_METADATA_KEY = "qoredb_payment_status";
export const LICENSE_TIER_METADATA_KEY = "qoredb_tier";
export const LICENSE_SEATS_METADATA_KEY = "qoredb_seats";
/**
 * Signature de la période + sièges déjà délivrée pour un abonnement Team.
 * Sert de garde d'idempotence : tant que cette valeur ne change pas, on ne
 * réémet pas la clé et on ne renvoie pas d'email.
 */
export const LICENSE_PERIOD_METADATA_KEY = "qoredb_license_period";

/** Nombre minimum de sièges facturables pour le plan Team (décision Stage 0). */
export const TEAM_MIN_SEATS = 3;

/** Délai de grâce appliqué après la fin de période avant expiration effective. */
export const TEAM_GRACE_PERIOD_DAYS = 14;

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getBaseUrl(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const host = request.headers.get("host");
  if (host) {
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function readPaymentIntentEmail(paymentIntent: Stripe.PaymentIntent) {
  const metadataEmail = paymentIntent.metadata?.[LICENSE_EMAIL_METADATA_KEY];
  if (metadataEmail) {
    return normalizeEmail(metadataEmail);
  }

  if (paymentIntent.receipt_email) {
    return normalizeEmail(paymentIntent.receipt_email);
  }

  const chargeEmail = paymentIntent.latest_charge;
  if (typeof chargeEmail === "object" && chargeEmail?.billing_details?.email) {
    return normalizeEmail(chargeEmail.billing_details.email);
  }

  return null;
}

export const readLicenseFromPaymentIntent = (
  paymentIntent: Stripe.PaymentIntent,
) => paymentIntent.metadata?.[LICENSE_METADATA_KEY] ?? null;

export const readLicenseFromCheckoutSession = (
  session: Stripe.Checkout.Session,
) => session.metadata?.[LICENSE_METADATA_KEY] ?? null;

export const readLicenseFromSubscription = (
  subscription: Stripe.Subscription,
) => subscription.metadata?.[LICENSE_METADATA_KEY] ?? null;

/**
 * Sièges facturés d'un abonnement Team = quantité de la première ligne.
 * Retourne `TEAM_MIN_SEATS` par défaut si la quantité est absente.
 */
export function getSubscriptionSeats(
  subscription: Stripe.Subscription,
): number {
  const quantity = subscription.items?.data?.[0]?.quantity;
  if (typeof quantity === "number" && quantity > 0) {
    return quantity;
  }
  return TEAM_MIN_SEATS;
}

/**
 * Fin de période courante (timestamp Unix en secondes). Selon la version de
 * l'API Stripe, ce champ vit sur l'item ou sur l'abonnement : on gère les deux.
 */
export function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): number | null {
  const item = subscription.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined;
  if (item && typeof item.current_period_end === "number") {
    return item.current_period_end;
  }

  const legacy = (subscription as unknown as { current_period_end?: number })
    .current_period_end;
  return typeof legacy === "number" ? legacy : null;
}

/**
 * `expires_at` d'une licence Team = fin de période + délai de grâce, au format
 * ISO. Renvoie `null` si la période est inconnue (perpétuel/dégradé).
 */
export function computeTeamExpiresAt(
  periodEndUnix: number | null,
): string | null {
  if (periodEndUnix == null) {
    return null;
  }
  const graceMs = TEAM_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  return new Date(periodEndUnix * 1000 + graceMs).toISOString();
}

/** Email du customer Stripe associé à un abonnement (retrieve si nécessaire). */
export async function readSubscriptionEmail(
  subscription: Stripe.Subscription,
): Promise<string | null> {
  const customer = subscription.customer;
  if (typeof customer === "object" && customer && !customer.deleted) {
    return customer.email ? normalizeEmail(customer.email) : null;
  }

  const customerId =
    typeof customer === "string" ? customer : (customer?.id ?? null);
  if (!customerId) {
    return null;
  }

  const stripe = getStripeClient();
  const fetched = await stripe.customers.retrieve(customerId);
  if (fetched.deleted) {
    return null;
  }
  return fetched.email ? normalizeEmail(fetched.email) : null;
}

/** Premier customer Stripe correspondant à un email (le plus récent). */
export async function findCustomerByEmail(
  email: string,
): Promise<Stripe.Customer | null> {
  const stripe = getStripeClient();
  const normalized = normalizeEmail(email);
  const result = await stripe.customers.list({ email: normalized, limit: 1 });
  return result.data[0] ?? null;
}

/**
 * Abonnement Team « courant » d'un customer : actif ou en grâce
 * (`active`, `trialing`, `past_due`), le plus récent en premier.
 */
export async function findCurrentSubscriptionForCustomer(
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripeClient();
  const result = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });

  const usable = result.data
    .filter((subscription) =>
      ["active", "trialing", "past_due"].includes(subscription.status),
    )
    .sort((a, b) => b.created - a.created);

  return usable[0] ?? null;
}

const escapeForSearch = (value: string) => value.replace(/'/g, "\\'");

export async function findLatestPaymentIntentByEmail(email: string) {
  const stripe = getStripeClient();
  const normalized = normalizeEmail(email);

  try {
    const result = await stripe.paymentIntents.search({
      query: `metadata['${LICENSE_EMAIL_METADATA_KEY}']:'${escapeForSearch(normalized)}'`,
      limit: 1,
    });
    if (result.data.length > 0) {
      return result.data[0];
    }
  } catch (error) {
    console.warn(
      "Stripe payment_intent search failed, fallback to list",
      error,
    );
  }

  const fallback = await stripe.paymentIntents.list({ limit: 100 });
  return (
    fallback.data.find(
      (paymentIntent) =>
        paymentIntent.metadata?.[LICENSE_EMAIL_METADATA_KEY] === normalized ||
        readPaymentIntentEmail(paymentIntent) === normalized,
    ) ?? null
  );
}
