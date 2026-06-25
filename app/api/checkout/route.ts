import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { normalizeLocale } from "@/lib/locale";
import {
  getBaseUrl,
  getStripeClient,
  TEAM_MIN_SEATS,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

type CheckoutBody = {
  locale?: string;
  email?: string;
  tier?: "pro" | "team";
  seats?: number;
};

async function createTeamCheckout(
  stripe: Stripe,
  baseUrl: string,
  locale: string,
  seats: number,
  email?: string,
) {
  const teamPriceId = process.env.STRIPE_TEAM_PRICE_ID;
  if (!teamPriceId) {
    return NextResponse.json(
      { error: "STRIPE_TEAM_PRICE_ID is missing" },
      { status: 500 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: teamPriceId,
        quantity: seats,
        adjustable_quantity: { enabled: true, minimum: TEAM_MIN_SEATS },
      },
    ],
    success_url: `${baseUrl}/${locale}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${locale}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    automatic_tax: { enabled: true },
    metadata: {
      qoredb_tier: "team",
      qoredb_seats: String(seats),
      qoredb_locale: locale,
    },
    subscription_data: {
      metadata: {
        qoredb_tier: "team",
        qoredb_locale: locale,
      },
    },
    customer_email: email,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Unable to create checkout URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckoutBody;
    const locale = normalizeLocale(body.locale);
    const baseUrl = getBaseUrl(request);
    const stripe = getStripeClient();

    if (body.tier === "team") {
      const seats = Math.floor(Number(body.seats));
      if (!Number.isFinite(seats) || seats < TEAM_MIN_SEATS) {
        return NextResponse.json(
          { error: `seats must be an integer >= ${TEAM_MIN_SEATS}` },
          { status: 400 },
        );
      }
      return createTeamCheckout(stripe, baseUrl, locale, seats, body.email);
    }

    const stripePriceId = process.env.STRIPE_PRICE_ID;
    if (!stripePriceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is missing" },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${baseUrl}/${locale}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        qoredb_tier: "pro",
        qoredb_locale: locale,
      },
      customer_email: body.email,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation failed", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
