import { NextResponse } from "next/server";

import { generateLicenseKey } from "@/lib/license/generate";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { issueSeatKey, seatExpiresAt } from "@/lib/seats/issue";
import { findSubscriptionBySeatEmail } from "@/lib/seats/store";
import {
  computeTeamExpiresAt,
  findCurrentSubscriptionForCustomer,
  findCustomerByEmail,
  getStripeClient,
  getSubscriptionPeriodEnd,
  getSubscriptionSeats,
  LICENSE_METADATA_KEY,
  LICENSE_SEATS_METADATA_KEY,
  LICENSE_STATUS_METADATA_KEY,
  normalizeEmail,
  readSubscriptionEmail,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

type CurrentLicenseBody = {
  email?: string;
};

const notFound = () =>
  NextResponse.json({ error: "No active subscription found" }, { status: 404 });

/**
 * Renvoie la clé Team à jour pour un email donné. Deux cas :
 *  1. l'email est un SIÈGE nominatif actif → renvoie SA clé (seats:1) ;
 *  2. sinon, l'email est un contact de FACTURATION → renvoie la clé liée à
 *     l'abonnement (rétro-compat clé d'org Stage 1).
 *
 * Utilisé par l'app (commande `refresh_license`) et une éventuelle page
 * self-service après renouvellement.
 */
export async function POST(request: Request) {
  try {
    // Anti-énumération : 10 requêtes / minute par IP.
    const limit = rateLimit(
      `license-current:${getClientIp(request)}`,
      10,
      60_000,
    );
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json().catch(() => ({}))) as CurrentLicenseBody;
    const rawEmail = body.email?.trim();
    if (!rawEmail) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    const email = normalizeEmail(rawEmail);
    const stripe = getStripeClient();

    // 1) L'email est-il un siège nominatif actif ? → sa clé personnelle.
    const seatSubscription = await findSubscriptionBySeatEmail(stripe, email);
    if (seatSubscription) {
      const licenseKey = await issueSeatKey(seatSubscription, email);
      const status =
        seatSubscription.metadata?.[LICENSE_STATUS_METADATA_KEY] ??
        seatSubscription.status;
      return NextResponse.json({
        status,
        tier: "team",
        seats: 1,
        expiresAt: seatExpiresAt(seatSubscription),
        licenseKey,
      });
    }

    // 2) Fallback : email de facturation (clé d'abonnement / org Stage 1).
    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return notFound();
    }

    const subscription = await findCurrentSubscriptionForCustomer(customer.id);
    if (!subscription) {
      return notFound();
    }

    const seats = getSubscriptionSeats(subscription);
    const periodEnd = getSubscriptionPeriodEnd(subscription);
    const expiresAt = computeTeamExpiresAt(periodEnd);
    const status =
      subscription.metadata?.[LICENSE_STATUS_METADATA_KEY] ??
      subscription.status;

    // La clé est normalement déjà stockée par le webhook ; on la (re)génère en
    // secours si elle manque alors que l'abonnement est utilisable.
    let licenseKey = subscription.metadata?.[LICENSE_METADATA_KEY];
    if (!licenseKey) {
      const subscriptionEmail =
        (await readSubscriptionEmail(subscription)) ?? email;
      licenseKey = await generateLicenseKey({
        email: subscriptionEmail,
        paymentId: subscription.id,
        tier: "team",
        seats,
        expiresAt,
      });
    }

    const storedSeats = subscription.metadata?.[LICENSE_SEATS_METADATA_KEY];

    return NextResponse.json({
      status,
      tier: "team",
      seats: storedSeats ? Number(storedSeats) : seats,
      expiresAt,
      licenseKey,
    });
  } catch (error) {
    console.error("license/current failed", error);
    return NextResponse.json(
      { error: "Failed to resolve current license" },
      { status: 500 },
    );
  }
}
