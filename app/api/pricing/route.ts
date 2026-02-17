import { NextResponse } from "next/server";

import { getStripeClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

type PricingPayload = {
	formattedPrice: string;
	currency: string;
	unitAmount: number;
};

const getIntlLocale = (locale: string | null) =>
	locale === "en" ? "en-US" : "fr-FR";

export async function GET(request: Request) {
	try {
		const stripePriceId = process.env.STRIPE_PRICE_ID;
		if (!stripePriceId) {
			return NextResponse.json(
				{ error: "STRIPE_PRICE_ID is missing" },
				{ status: 500 },
			);
		}

		const { searchParams } = new URL(request.url);
		const locale = getIntlLocale(searchParams.get("locale"));

		const stripe = getStripeClient();
		const price = await stripe.prices.retrieve(stripePriceId);

		if (price.unit_amount == null) {
			return NextResponse.json(
				{ error: "Stripe price has no unit_amount" },
				{ status: 500 },
			);
		}

		const currency = price.currency.toUpperCase();
		const unitAmount = price.unit_amount;
		const formattedPrice = new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(unitAmount / 100);

		const payload: PricingPayload = {
			formattedPrice,
			currency,
			unitAmount,
		};

		return NextResponse.json(payload);
	} catch (error) {
		console.error("Failed to fetch Stripe price", error);
		return NextResponse.json(
			{ error: "Unable to fetch Stripe price" },
			{ status: 500 },
		);
	}
}
