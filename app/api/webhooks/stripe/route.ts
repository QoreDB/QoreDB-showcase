import { NextResponse } from "next/server";
import Stripe from "stripe";

import { sendLicenseEmail } from "@/actions/send-license-email";
import { generateLicenseKey } from "@/lib/license/generate";
import {
	getStripeClient,
	LICENSE_EMAIL_METADATA_KEY,
	LICENSE_METADATA_KEY,
	LICENSE_STATUS_METADATA_KEY,
	normalizeEmail,
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
			const reason = error instanceof Error ? error.message : "unknown email error";
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
				await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
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
