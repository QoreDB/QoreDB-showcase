import { NextResponse } from "next/server";

import {
	getStripeClient,
	LICENSE_STATUS_METADATA_KEY,
	normalizeEmail,
	readPaymentIntentEmail,
	readLicenseFromPaymentIntent,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

type StatusRequest = {
	email?: string;
	paymentId?: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json().catch(() => ({}))) as StatusRequest;
		const email = body.email?.trim();
		const paymentId = body.paymentId?.trim();

		if (!email || !paymentId) {
			return NextResponse.json(
				{ error: "email and paymentId are required" },
				{ status: 400 },
			);
		}

		const stripe = getStripeClient();
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
		const normalizedEmail = normalizeEmail(email);
		const paymentEmail = readPaymentIntentEmail(paymentIntent);

		if (!paymentEmail || paymentEmail !== normalizedEmail) {
			return NextResponse.json({ status: "not_found" }, { status: 404 });
		}

		const metadataStatus = paymentIntent.metadata?.[LICENSE_STATUS_METADATA_KEY];
		const status = metadataStatus || (paymentIntent.status === "succeeded" ? "active" : "failed");

		return NextResponse.json({
			status,
			paymentId: paymentIntent.id,
			licenseKey: readLicenseFromPaymentIntent(paymentIntent),
			amount: paymentIntent.amount_received,
			currency: paymentIntent.currency,
			createdAt: new Date(paymentIntent.created * 1000).toISOString(),
		});
	} catch (error) {
		console.error("License status lookup failed", error);
		return NextResponse.json(
			{ error: "Unable to verify license status" },
			{ status: 500 },
		);
	}
}
