import { NextResponse } from "next/server";

import { getBaseUrl, getStripeClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

type CheckoutBody = {
	locale?: string;
	email?: string;
};

export async function POST(request: Request) {
	try {
		const stripePriceId = process.env.STRIPE_PRICE_ID;
		if (!stripePriceId) {
			return NextResponse.json(
				{ error: "STRIPE_PRICE_ID is missing" },
				{ status: 500 },
			);
		}

		const body = (await request.json().catch(() => ({}))) as CheckoutBody;
		const locale = body.locale === "en" ? "en" : "fr";
		const baseUrl = getBaseUrl(request);
		const stripe = getStripeClient();

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
