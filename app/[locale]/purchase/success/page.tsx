import Link from "next/link";
import Stripe from "stripe";
import { CheckCircle2 } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { CopyLicenseButton } from "@/components/license/copy-license-button";
import { getStripeClient, readLicenseFromPaymentIntent } from "@/lib/stripe/server";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

type PageProps = {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ session_id?: string }>;
};

async function readPaymentIntent(
	session: Stripe.Checkout.Session,
): Promise<Stripe.PaymentIntent | null> {
	if (!session.payment_intent) {
		return null;
	}

	if (typeof session.payment_intent !== "string") {
		return session.payment_intent;
	}

	const stripe = getStripeClient();
	return stripe.paymentIntents.retrieve(session.payment_intent);
}

export default async function PurchaseSuccessPage({
	params,
	searchParams,
}: PageProps) {
	const { locale } = await params;
	const { t } = await getTranslation(locale, "common");
	const { session_id: sessionId } = await searchParams;

	let paymentIntent: Stripe.PaymentIntent | null = null;
	let error: string | null = null;

	if (sessionId) {
		try {
			const stripe = getStripeClient();
			const session = await stripe.checkout.sessions.retrieve(sessionId, {
				expand: ["payment_intent"],
			});
			paymentIntent = await readPaymentIntent(session);
		} catch (caught) {
			error = t("purchase_success.session_error");
			console.error("Failed to load Stripe session", caught);
		}
	}

	const licenseKey = paymentIntent ? readLicenseFromPaymentIntent(paymentIntent) : null;

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 px-4 sm:px-6 lg:px-12 pt-32 pb-20">
				<div className="mx-auto w-full max-w-3xl rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-8 sm:p-10">
					<div className="mb-8 flex items-center gap-3 text-green-500">
						<CheckCircle2 className="h-7 w-7" />
						<h1 className="text-2xl sm:text-3xl font-bold text-(--q-text-0)">
							{t("purchase_success.title")}
						</h1>
					</div>

					<p className="text-(--q-text-1)">
						{t("purchase_success.subtitle")}
					</p>

					{licenseKey ? (
						<div className="mt-8 space-y-4">
							<p className="text-sm text-(--q-text-2)">
								{t("purchase_success.license_label")}
							</p>
							<pre className="rounded-xl bg-[#0f172a] p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-all">
								{licenseKey}
							</pre>
							<CopyLicenseButton
								licenseKey={licenseKey}
								copyLabel={t("purchase_success.copy")}
								copiedLabel={t("purchase_success.copied")}
							/>
						</div>
					) : (
						<div className="mt-8 rounded-xl border border-amber-400/40 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
							{error
								? error
								: t("purchase_success.pending_license")}
						</div>
					)}

					<div className="mt-8">
						<h2 className="text-lg font-semibold">
							{t("purchase_success.activation_title")}
						</h2>
						<ol className="mt-3 list-decimal pl-5 text-(--q-text-1) space-y-1">
							<li>{t("purchase_success.steps.1")}</li>
							<li>{t("purchase_success.steps.2")}</li>
							<li>{t("purchase_success.steps.3")}</li>
							<li>{t("purchase_success.steps.4")}</li>
							<li>{t("purchase_success.steps.5")}</li>
						</ol>
					</div>

					<div className="mt-10 flex flex-wrap gap-3">
						<Link
							href={`/${locale}/download`}
							className="rounded-xl bg-(--q-accent) text-white px-5 py-3 font-medium hover:bg-(--q-accent-strong)"
						>
							{t("purchase_success.download_cta")}
						</Link>
						<Link
							href={`/${locale}`}
							className="rounded-xl border border-(--q-border) px-5 py-3 font-medium text-(--q-text-0) hover:border-(--q-accent)/40"
						>
							{t("purchase_success.home_cta")}
						</Link>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
