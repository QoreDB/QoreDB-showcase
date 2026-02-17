import { NextResponse } from "next/server";

import { sendLicenseEmail } from "@/actions/send-license-email";
import { generateLicenseKey } from "@/lib/license/generate";
import {
	findLatestPaymentIntentByEmail,
	getStripeClient,
	LICENSE_EMAIL_METADATA_KEY,
	LICENSE_METADATA_KEY,
	LICENSE_STATUS_METADATA_KEY,
	normalizeEmail,
	readLicenseFromPaymentIntent,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

type ResendRequest = {
	email?: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json().catch(() => ({}))) as ResendRequest;
		const email = body.email?.trim();
		if (!email) {
			return NextResponse.json({ error: "email is required" }, { status: 400 });
		}

		const normalizedEmail = normalizeEmail(email);
		const paymentIntent = await findLatestPaymentIntentByEmail(normalizedEmail);
		if (!paymentIntent) {
			return NextResponse.json({ status: "not_found" }, { status: 404 });
		}

		if (paymentIntent.status !== "succeeded") {
			return NextResponse.json(
				{ error: "Payment is not in a succeeded state" },
				{ status: 400 },
			);
		}

		let licenseKey = readLicenseFromPaymentIntent(paymentIntent);
		if (!licenseKey) {
			licenseKey = await generateLicenseKey({
				email: normalizedEmail,
				paymentId: paymentIntent.id,
			});

			const stripe = getStripeClient();
			await stripe.paymentIntents.update(paymentIntent.id, {
				metadata: {
					...paymentIntent.metadata,
					[LICENSE_METADATA_KEY]: licenseKey,
					[LICENSE_EMAIL_METADATA_KEY]: normalizedEmail,
					[LICENSE_STATUS_METADATA_KEY]: "active",
				},
			});
		}

		await sendLicenseEmail({ email: normalizedEmail, licenseKey });

		return NextResponse.json({ status: "sent" });
	} catch (error) {
		console.error("License resend failed", error);
		return NextResponse.json(
			{ error: "Unable to resend license" },
			{ status: 500 },
		);
	}
}
