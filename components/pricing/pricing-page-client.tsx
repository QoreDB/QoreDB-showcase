"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { TeamWaitlistForm } from "@/components/pricing/team-waitlist-form";
import { getContactMailtoHref } from "@/lib/contact";

type PlanFeature = { id?: string; label: string };

function PlanCard({
  title,
  tagline,
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
  customCta,
}: {
  title: string;
  tagline?: string;
  description: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  features: PlanFeature[];
  ctaLabel: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  highlighted?: boolean;
  loading?: boolean;
  footerNote?: React.ReactNode;
  customCta?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        highlighted
          ? "border-(--q-accent) bg-(--q-accent)/5 shadow-[0_30px_70px_-40px_var(--q-accent)]"
          : "border-(--q-border) bg-(--q-bg-1) hover:border-(--q-accent)/30"
      }`}
    >
      <div className="mb-5">
        {badge ? (
          <span className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) text-xs font-semibold px-2.5 py-1 mb-3">
            {badge}
          </span>
        ) : null}
        <h2 className="text-2xl font-bold text-(--q-text-0)">{title}</h2>
        {tagline ? (
          <p className="text-sm font-medium text-(--q-accent) mt-1">
            {tagline}
          </p>
        ) : null}
        <p className="text-sm text-(--q-text-2) mt-2">{description}</p>
        <div className="mt-4 flex items-baseline gap-2 flex-wrap">
          {originalPrice ? (
            <>
              <span className="text-lg text-(--q-text-2) line-through">
                {originalPrice}
              </span>
              <span className="text-3xl font-bold text-(--q-text-0)">
                {price}
              </span>
              <span className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) text-xs font-semibold px-2 py-0.5">
                -50%
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-(--q-text-0)">
              {price}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((feature) => (
          <li
            key={feature.id ?? feature.label}
            id={feature.id}
            className="flex items-start gap-2.5 text-(--q-text-1) scroll-mt-32 target:bg-(--q-accent)/10 target:rounded-md target:-mx-1 target:px-1 transition-colors"
          >
            <span className="mt-0.5 rounded-full bg-(--q-accent)/10 p-1 shrink-0">
              <Check className="h-3 w-3 text-(--q-accent)" />
            </span>
            <span className="text-[13px] leading-snug">{feature.label}</span>
          </li>
        ))}
      </ul>

      {customCta ? (
        customCta
      ) : href ? (
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
          type="button"
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
  initialTeamSeatPrice: string | null;
  teamSeatUnitAmount: number | null;
  teamCurrency: string | null;
  teamMinSeats: number;
  intlLocale: string;
};

export default function PricingPageClient({
  locale,
  initialProStripePrice,
  initialProOriginalPrice,
  initialTeamSeatPrice,
  teamSeatUnitAmount,
  teamCurrency,
  teamMinSeats,
  intlLocale,
}: PricingPageClientProps) {
  const { t } = useTranslation();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingTeamCheckout, setLoadingTeamCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [seats, setSeats] = useState(teamMinSeats);

  const teamAvailable = teamSeatUnitAmount != null && teamCurrency != null;

  const formatCurrency = (amountInCents: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: teamCurrency ?? "EUR",
    }).format(amountInCents / 100);

  const teamTotalPrice =
    teamSeatUnitAmount != null
      ? formatCurrency(teamSeatUnitAmount * seats)
      : null;

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

  const startTeamCheckout = async () => {
    setCheckoutError(null);
    setLoadingTeamCheckout(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, tier: "team", seats }),
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
      setLoadingTeamCheckout(false);
    }
  };

  const coreFeatures: PlanFeature[] = [
    "drivers",
    "crud",
    "workspaces",
    "grid",
    "er_diagram",
    "ddl",
    "vault",
    "ssh",
    "safety",
    "export_basic",
    "shortcuts",
  ].map((key) => ({
    id: `core-${key}`,
    label: t(`pricing_page.core.features.${key}`),
  }));

  const proFeatures: PlanFeature[] = [
    "everything_core",
    "sandbox",
    "time_travel",
    "visual_diff",
    "audit_advanced",
    "profiling",
    "ai",
    "export_advanced",
    "security_rules",
    "library_advanced",
    "virtual_relations",
  ].map((key) => ({
    id: key,
    label: t(`pricing_page.pro.features.${key}`),
  }));

  const teamFeatures: PlanFeature[] = [
    "everything_pro",
    "seat_management",
    "central_billing",
    "priority_support",
  ].map((key) => ({
    id: `team-${key}`,
    label: t(`pricing_page.team.features.${key}`),
  }));

  const enterpriseFeatures: PlanFeature[] = [
    "everything_team",
    "sso",
    "managed_ai",
    "custom_contract",
  ].map((key) => ({
    id: `enterprise-${key}`,
    label: t(`pricing_page.enterprise.features.${key}`),
  }));

  const faqItems = [
    "open_core_why",
    "data_sent",
    "lifetime_updates",
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
            <p className="mt-4 text-(--q-text-1)">
              {t("pricing_page.subtitle")}
            </p>
            <p className="mt-3 text-sm text-(--q-text-2)">
              {t("pricing_page.billing_note")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PlanCard
                title={t("pricing_page.core.title")}
                tagline={t("pricing_page.core.tagline")}
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
                tagline={t("pricing_page.pro.tagline")}
                description={t("pricing_page.pro.description")}
                price={initialProStripePrice ?? t("pricing_page.pro.price")}
                originalPrice={initialProOriginalPrice ?? undefined}
                badge={t("pricing_page.pro.badge")}
                features={proFeatures}
                ctaLabel={t("pricing_page.pro.cta")}
                onClick={startCheckout}
                loading={loadingCheckout}
                footerNote={
                  <>
                    <p className="text-center text-xs text-(--q-text-2) mt-3">
                      {t("pricing_page.pro.individual_use")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = getContactMailtoHref();
                      }}
                      className="block w-full bg-transparent text-center text-xs text-(--q-text-2) mt-1.5 hover:text-(--q-accent) transition cursor-pointer"
                    >
                      {t("pricing_page.pro.student_note")}
                    </button>
                  </>
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
                tagline={t("pricing_page.team.tagline")}
                description={t("pricing_page.team.description")}
                price={
                  teamAvailable
                    ? (initialTeamSeatPrice ?? t("pricing_page.team.price"))
                    : t("pricing_page.team.price")
                }
                badge={t("pricing_page.team.badge")}
                features={teamFeatures}
                ctaLabel={t("pricing_page.team.cta")}
                customCta={
                  teamAvailable ? (
                    <div className="space-y-3">
                      <p className="text-xs text-(--q-text-2) -mt-3">
                        {t("pricing_page.team.per_seat_note")}
                      </p>
                      <div className="flex items-center justify-between rounded-xl border border-(--q-border) bg-(--q-bg-0) px-3 py-2">
                        <span className="text-sm text-(--q-text-1)">
                          {t("pricing_page.team.seats_label")}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={t("pricing_page.team.seats_decrease")}
                            onClick={() =>
                              setSeats((value) =>
                                Math.max(teamMinSeats, value - 1),
                              )
                            }
                            disabled={seats <= teamMinSeats}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-(--q-border) text-(--q-text-0) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--q-accent)/40 transition"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-(--q-text-0)">
                            {seats}
                          </span>
                          <button
                            type="button"
                            aria-label={t("pricing_page.team.seats_increase")}
                            onClick={() => setSeats((value) => value + 1)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-(--q-border) text-(--q-text-0) hover:border-(--q-accent)/40 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-(--q-text-2)">
                          {t("pricing_page.team.total_label")}
                        </span>
                        <span className="text-lg font-bold text-(--q-text-0)">
                          {teamTotalPrice}
                          <span className="text-xs font-normal text-(--q-text-2)">
                            {" "}
                            {t("pricing_page.team.per_year")}
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={startTeamCheckout}
                        disabled={loadingTeamCheckout}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-(--q-accent) text-white px-4 py-3 font-semibold transition hover:bg-(--q-accent-strong) disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loadingTeamCheckout ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t("pricing_page.team.cta")
                        )}
                      </button>
                      <p className="text-center text-[11px] text-(--q-text-2)">
                        {t("pricing_page.team.min_seats_note", {
                          min: teamMinSeats,
                        })}
                      </p>
                    </div>
                  ) : (
                    <TeamWaitlistForm />
                  )
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PlanCard
                title={t("pricing_page.enterprise.title")}
                tagline={t("pricing_page.enterprise.tagline")}
                description={t("pricing_page.enterprise.description")}
                price={t("pricing_page.enterprise.price")}
                badge={t("pricing_page.enterprise.badge")}
                features={enterpriseFeatures}
                ctaLabel={t("pricing_page.enterprise.cta")}
                customCta={<TeamWaitlistForm />}
              />
            </motion.div>
          </div>

          {checkoutError ? (
            <p className="mt-4 text-sm text-red-500">{checkoutError}</p>
          ) : null}
        </section>

        <PricingComparison qoredbPrice={initialProStripePrice ?? null} />

        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            {t("pricing_page.faq_title")}
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) overflow-hidden transition-colors hover:border-(--q-accent)/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <h3 className="font-semibold text-(--q-text-0) pr-4">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-(--q-text-2) shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-(--q-text-1)">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
