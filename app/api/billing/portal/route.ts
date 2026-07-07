import { NextResponse } from "next/server";

import { normalizeLocale } from "@/lib/locale";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  findCustomerByEmail,
  getBaseUrl,
  getStripeClient,
  normalizeEmail,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

type PortalBody = {
  email?: string;
  locale?: string;
};

/**
 * Ouvre une session du Stripe Customer Portal : l'admin y gère ses sièges,
 * ses factures et son annulation. Toute la gestion d'équipe est déléguée à
 * Stripe (zéro UI custom).
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(
      `billing-portal:${getClientIp(request)}`,
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

    const body = (await request.json().catch(() => ({}))) as PortalBody;
    const rawEmail = body.email?.trim();
    if (!rawEmail) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    const email = normalizeEmail(rawEmail);

    const customer = await findCustomerByEmail(email);
    if (!customer) {
      return NextResponse.json(
        { error: "No customer found for this email" },
        { status: 404 },
      );
    }

    const locale = normalizeLocale(body.locale);
    const baseUrl = getBaseUrl(request);
    const stripe = getStripeClient();

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${baseUrl}/${locale}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("billing/portal failed", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 },
    );
  }
}
