import Stripe from "stripe";

export const LICENSE_METADATA_KEY = "qoredb_license_key";
export const LICENSE_EMAIL_METADATA_KEY = "qoredb_customer_email";
export const LICENSE_STATUS_METADATA_KEY = "qoredb_payment_status";

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

export const readLicenseFromPaymentIntent = (paymentIntent: Stripe.PaymentIntent) =>
	paymentIntent.metadata?.[LICENSE_METADATA_KEY] ?? null;

export const readLicenseFromCheckoutSession = (
	session: Stripe.Checkout.Session,
) => session.metadata?.[LICENSE_METADATA_KEY] ?? null;

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
		console.warn("Stripe payment_intent search failed, fallback to list", error);
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
