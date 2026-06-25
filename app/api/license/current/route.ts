import { NextResponse } from "next/server";

import { generateLicenseKey } from "@/lib/license/generate";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  computeTeamExpiresAt,
  findCurrentSubscriptionForCustomer,
  findCustomerByEmail,
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

const NOT_FOUND = NextResponse.json(
  { error: "No active subscription found" },
  { status: 404 },
);

/**
 * Renvoie la clé Team à jour pour un email d'abonné actif. Utilisé par l'app
 * (commande refresh) et une éventuelle page self-service après renouvellement.
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

    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return NOT_FOUND;
    }

    const subscription = await findCurrentSubscriptionForCustomer(customer.id);
    if (!subscription) {
      return NOT_FOUND;
    }

    const seats = getSubscriptionSeats(subscription);
    const periodEnd = getSubscriptionPeriodEnd(subscription);
    const expiresAt = computeTeamExpiresAt(periodEnd);
    // Pro est un paiement unique (pas d'abonnement) : tout abonnement est Team.
    const tier = "team";
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
      tier,
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
