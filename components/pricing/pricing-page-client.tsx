"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

function PlanCard({
	title,
	description,
	price,
	originalPrice,
	badge,
	features,
	ctaLabel,
	onClick,
	href,
	disabled,
	highlighted,
	loading,
	footerNote,
}: {
	title: string;
	description: string;
	price: string;
	originalPrice?: string;
	badge?: string;
	features: string[];
	ctaLabel: string;
	onClick?: () => void;
	href?: string;
	disabled?: boolean;
	highlighted?: boolean;
	loading?: boolean;
	footerNote?: React.ReactNode;
}) {
	return (
		<div
			className={`rounded-3xl border p-6 sm:p-7 h-full flex flex-col ${
				highlighted
					? "border-(--q-accent) bg-(--q-accent)/5 shadow-[0_30px_70px_-40px_var(--q-accent)]"
					: "border-(--q-border) bg-(--q-bg-1)"
			}`}
		>
			<div className="mb-5">
				{badge ? (
					<span className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) text-xs font-semibold px-2.5 py-1 mb-3">
						{badge}
					</span>
				) : null}
				<h2 className="text-2xl font-bold text-(--q-text-0)">{title}</h2>
				<p className="text-sm text-(--q-text-2) mt-2">{description}</p>
				<div className="mt-4 flex items-baseline gap-2 flex-wrap">
					{originalPrice ? (
						<>
							<span className="text-lg text-(--q-text-2) line-through">{originalPrice}</span>
							<span className="text-3xl font-bold text-(--q-text-0)">{price}</span>
							<span className="inline-flex rounded-full bg-green-500/10 text-green-500 text-xs font-semibold px-2 py-0.5">
								-50%
							</span>
						</>
					) : (
						<span className="text-3xl font-bold text-(--q-text-0)">{price}</span>
					)}
				</div>
			</div>

			<ul className="space-y-3 mb-8 flex-1">
				{features.map((feature) => (
					<li key={feature} className="flex items-start gap-3 text-(--q-text-1)">
						<span className="mt-0.5 rounded-full bg-(--q-accent)/10 p-1 shrink-0">
							<Check className="h-3 w-3 text-(--q-accent)" />
						</span>
						<span className="text-sm leading-relaxed">{feature}</span>
					</li>
				))}
			</ul>

			{href ? (
				<Link
					href={href}
					className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition ${
						disabled
							? "pointer-events-none opacity-50 border border-(--q-border)"
							: highlighted
								? "bg-(--q-accent) text-white hover:bg-(--q-accent-strong)"
								: "border border-(--q-border) hover:border-(--q-accent)/40"
					}`}
				>
					{ctaLabel}
				</Link>
			) : (
				<button
					onClick={onClick}
					disabled={disabled || loading}
					className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition ${
						highlighted
							? "bg-(--q-accent) text-white hover:bg-(--q-accent-strong)"
							: "border border-(--q-border) hover:border-(--q-accent)/40"
					} disabled:opacity-60 disabled:cursor-not-allowed`}
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin mr-2" />
							<span>...</span>
						</>
					) : (
						ctaLabel
					)}
				</button>
			)}
			{footerNote}
		</div>
	);
}

type PricingPageClientProps = {
	locale: string;
	initialProStripePrice: string | null;
	initialProOriginalPrice: string | null;
};

export default function PricingPageClient({
	locale,
	initialProStripePrice,
	initialProOriginalPrice,
}: PricingPageClientProps) {
	const { t } = useTranslation();
	const [loadingCheckout, setLoadingCheckout] = useState(false);
	const [checkoutError, setCheckoutError] = useState<string | null>(null);

	const startCheckout = async () => {
		setCheckoutError(null);
		setLoadingCheckout(true);
		try {
			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ locale }),
			});
			const data = (await response.json()) as { url?: string; error?: string };
			if (!response.ok || !data.url) {
				throw new Error(data.error ?? "Checkout unavailable");
			}
			window.location.href = data.url;
		} catch (error) {
			console.error(error);
			setCheckoutError(t("pricing_page.checkout_error"));
		} finally {
			setLoadingCheckout(false);
		}
	};

	const coreFeatures = [
		"drivers",
		"crud",
		"grid",
		"er_diagram",
		"history",
		"vault",
		"ssh",
		"safety",
		"audit_basic",
		"export_basic",
		"shortcuts",
	].map((key) => t(`pricing_page.core.features.${key}`));

	const proFeatures = [
		"everything_core",
		"sandbox",
		"visual_diff",
		"audit_advanced",
		"profiling",
		"ai",
		"export_advanced",
		"security_rules",
		"library_advanced",
		"virtual_relations",
	].map((key) => t(`pricing_page.pro.features.${key}`));

	const teamFeatures = [
		"everything_pro",
		"sync",
		"shared_queries",
		"permissions",
		"managed_ai",
	].map((key) => t(`pricing_page.team.features.${key}`));

	const faqItems = [
		"open_core_why",
		"data_sent",
		"stop_paying",
		"try_pro",
		"pro_source_code",
	].map((key) => ({
		question: t(`pricing_page.faq.${key}.question`),
		answer: t(`pricing_page.faq.${key}.answer`),
	}));

	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12">
				<section className="max-w-6xl mx-auto">
					<div className="text-center max-w-3xl mx-auto">
						<p className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) px-3 py-1 text-xs font-semibold uppercase tracking-wide">
							{t("pricing_page.badge")}
						</p>
						<h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
							{t("pricing_page.title")}
						</h1>
						<p className="mt-4 text-(--q-text-1)">{t("pricing_page.subtitle")}</p>
						<p className="mt-3 text-sm text-(--q-text-2)">
							{t("pricing_page.billing_note")}
						</p>
					</div>

					<div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
						<motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
							<PlanCard
								title={t("pricing_page.core.title")}
								description={t("pricing_page.core.description")}
								price={t("pricing_page.core.price")}
								badge={t("pricing_page.core.badge")}
								features={coreFeatures}
								ctaLabel={t("pricing_page.core.cta")}
								href={`/${locale}/download`}
								highlighted
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.05 }}
						>
							<PlanCard
								title={t("pricing_page.pro.title")}
								description={t("pricing_page.pro.description")}
								price={initialProStripePrice ?? t("pricing_page.pro.price")}
								originalPrice={initialProOriginalPrice ?? undefined}
								badge={t("pricing_page.pro.badge")}
								features={proFeatures}
								ctaLabel={t("pricing_page.pro.cta")}
								onClick={startCheckout}
								loading={loadingCheckout}
								footerNote={
									<a
										href="mailto:qoredb@gmail.com"
										className="block text-center text-xs text-(--q-text-2) mt-3 hover:text-(--q-accent) transition"
									>
										{t("pricing_page.pro.student_note")}
									</a>
								}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<PlanCard
								title={t("pricing_page.team.title")}
								description={t("pricing_page.team.description")}
								price={t("pricing_page.team.price")}
								badge={t("pricing_page.team.badge")}
								features={teamFeatures}
								ctaLabel={t("pricing_page.team.cta")}
								href={`/${locale}/#contact`}
							/>
						</motion.div>
					</div>

					{checkoutError ? (
						<p className="mt-4 text-sm text-red-500">{checkoutError}</p>
					) : null}
				</section>

				<section className="max-w-4xl mx-auto mt-20">
					<h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
						{t("pricing_page.faq_title")}
					</h2>
					<div className="space-y-4">
						{faqItems.map((item) => (
							<div
								key={item.question}
								className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6"
							>
								<h3 className="font-semibold text-(--q-text-0)">{item.question}</h3>
								<p className="mt-2 text-sm leading-relaxed text-(--q-text-1)">
									{item.answer}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
