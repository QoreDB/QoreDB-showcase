"use client";

import { Check, Loader2 } from "lucide-react";
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
  priceNote,
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
  priceNote: string;
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
      className={`rounded-lg border p-6 sm:p-7 h-full flex flex-col ${
        highlighted
          ? "border-(--q-accent) bg-(--q-bg-1)"
          : "border-(--q-border) bg-(--q-bg-0)"
      }`}
    >
      <div className="mb-5">
        {badge ? (
          <span className="inline-flex font-mono text-(--q-accent) text-xs mb-5">
            {badge}
          </span>
        ) : null}
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-(--q-text-0)">
          {title}
        </h2>
        {tagline ? (
          <p className="text-sm font-medium text-(--q-accent) mt-1">
            {tagline}
          </p>
        ) : null}
        <p className="text-sm text-(--q-text-2) mt-2">{description}</p>
        <div className="mt-7 flex items-baseline gap-2 flex-wrap">
          <span className="font-heading text-4xl font-semibold tracking-tight text-(--q-text-0)">
            {price}
          </span>
        </div>
        <p className="mt-2 text-sm text-(--q-text-1)">{priceNote}</p>
      </div>

      {customCta ? (
        customCta
      ) : href ? (
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center rounded-md min-h-12 px-4 py-3 font-semibold transition ${
            disabled
              ? "pointer-events-none opacity-50 border border-(--q-border)"
              : highlighted
                ? "bg-(--q-action) text-(--q-on-action) hover:bg-(--q-action-hover)"
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
          aria-busy={loading}
          className={`inline-flex w-full items-center justify-center rounded-md min-h-12 px-4 py-3 font-semibold transition ${
            highlighted
              ? "bg-(--q-action) text-(--q-on-action) hover:bg-(--q-action-hover)"
              : "border border-(--q-border) hover:border-(--q-accent)/40"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading && (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin mr-2" />
          )}
          {ctaLabel}
        </button>
      )}
      {footerNote ? <div className="mt-3">{footerNote}</div> : null}
      <ul className="space-y-3 mt-7 border-t border-(--q-border) pt-6">
        {features.map((feature) => (
          <li
            key={feature.id ?? feature.label}
            id={feature.id}
            className="flex items-start gap-2.5 text-(--q-text-1) scroll-mt-32 target:bg-(--q-accent)/10 target:rounded-md target:-mx-1 target:px-1 transition-colors"
          >
            <span className="mt-0.5 shrink-0">
              <Check className="h-4 w-4 text-(--q-accent)" />
            </span>
            <span className="text-sm leading-relaxed">{feature.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PricingPageClientProps = {
  locale: string;
  initialProStripePrice: string | null;
  initialTeamSeatPrice: string | null;
};

export default function PricingPageClient({
  locale,
  initialProStripePrice,
  initialTeamSeatPrice,
}: PricingPageClientProps) {
  const { t } = useTranslation();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Team est « disponible » dès que son prix Stripe est chargé ; sinon on
  // retombe sur le formulaire de liste d'attente.
  const teamAvailable = initialTeamSeatPrice != null;

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

  const coreFeatures: PlanFeature[] = [
    "drivers",
    "mcp",
    "trends",
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
    "masking",
    "ai",
    "export_advanced",
    "security_rules",
    "library_advanced",
    "virtual_relations",
  ].map((key) => ({
    id: key,
    label: t(`pricing_page.pro.features.${key}`),
  }));

  // Teaser : 3 puces clés (le détail complet est sur /pricing/team).
  const teamTeaserFeatures: PlanFeature[] = [
    "everything_pro",
    "seat_management",
    "central_billing",
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
    "team_sharing",
    "pro_source_code",
  ].map((key) => ({
    question: t(`pricing_page.faq.${key}.question`),
    answer: t(`pricing_page.faq.${key}.answer`),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-32 pb-20 lg:pt-44"
      >
        <section className="">
          <div className="max-w-3xl">
            <h1 className="font-heading text-5xl leading-[1.05] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.045em]">
              {t("pricing_page.title")}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-(--q-text-1)">
              {t("pricing_page.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="h-full">
              <PlanCard
                title={t("pricing_page.core.title")}
                tagline={t("pricing_page.core.tagline")}
                description={t("pricing_page.core.description")}
                price={t("pricing_page.core.price")}
                priceNote={t("pricing_page.core.billing")}
                badge={t("pricing_page.core.badge")}
                features={coreFeatures}
                ctaLabel={t("pricing_page.core.cta")}
                href={`/${locale}/download`}
                highlighted
              />
            </div>

            <div className="h-full">
              <PlanCard
                title={t("pricing_page.pro.title")}
                tagline={t("pricing_page.pro.tagline")}
                description={t("pricing_page.pro.description")}
                price={initialProStripePrice ?? t("pricing_page.pro.price")}
                priceNote={t("pricing_page.pro.billing")}
                badge={t("pricing_page.pro.badge")}
                features={proFeatures}
                ctaLabel={t("pricing_page.pro.cta")}
                onClick={startCheckout}
                loading={loadingCheckout}
                footerNote={
                  <>
                    {checkoutError && (
                      <p role="alert" className="text-sm text-(--q-error)">
                        {checkoutError}
                      </p>
                    )}
                    <p className="text-center text-xs text-(--q-text-2) mt-3">
                      {t("pricing_page.pro.individual_use")}
                    </p>
                    <a
                      href={getContactMailtoHref()}
                      className="mt-1.5 flex min-h-11 items-center justify-center text-center text-xs text-(--q-text-2) underline underline-offset-4 hover:text-(--q-accent)"
                    >
                      {t("pricing_page.pro.student_note")}
                    </a>
                  </>
                }
              />
            </div>

            <div className="h-full">
              <PlanCard
                title={t("pricing_page.team.title")}
                tagline={t("pricing_page.team.tagline")}
                description={t("pricing_page.team.description")}
                price={
                  teamAvailable && initialTeamSeatPrice
                    ? t("pricing_page.team.from_price", {
                        price: initialTeamSeatPrice,
                      })
                    : t("pricing_page.team.price")
                }
                priceNote={t("pricing_page.team.per_seat_note")}
                badge={t("pricing_page.team.badge")}
                features={teamTeaserFeatures}
                ctaLabel={
                  teamAvailable
                    ? t("pricing_page.team.discover_cta")
                    : t("pricing_page.team.cta")
                }
                href={teamAvailable ? `/${locale}/pricing/team` : undefined}
                customCta={teamAvailable ? undefined : <TeamWaitlistForm />}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-lg border border-(--q-border) p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {t("pricing_page.enterprise.badge") ? (
                    <span className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) text-xs font-semibold px-2.5 py-1">
                      {t("pricing_page.enterprise.badge")}
                    </span>
                  ) : null}
                  <h2 className="font-heading text-3xl font-semibold tracking-tight text-(--q-text-0)">
                    {t("pricing_page.enterprise.title")}
                  </h2>
                  <span className="font-heading text-3xl font-semibold tracking-tight text-(--q-text-0)">
                    · {t("pricing_page.enterprise.price")}
                  </span>
                </div>
                <p className="text-sm text-(--q-text-2) mt-2 max-w-2xl">
                  {t("pricing_page.enterprise.description")}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {enterpriseFeatures.map((feature) => (
                    <li
                      key={feature.id ?? feature.label}
                      className="flex items-center gap-2 text-sm text-(--q-text-1)"
                    >
                      <span className="rounded-full bg-(--q-accent)/10 p-1 shrink-0">
                        <Check className="h-3 w-3 text-(--q-accent)" />
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-72 shrink-0">
                <TeamWaitlistForm />
              </div>
            </div>
          </div>
        </section>

        <PricingComparison qoredbPrice={initialProStripePrice ?? null} />

        <section className="max-w-4xl mx-auto mt-20">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
            {t("pricing_page.faq_title")}
          </h2>
          <div className="divide-y divide-(--q-border) border-y border-(--q-border)">
            {faqItems.map((item) => (
              <details key={item.question} className="py-5">
                <summary className="cursor-pointer font-medium leading-relaxed text-(--q-text-0)">
                  {item.question}
                </summary>
                <p className="pt-4 text-sm leading-relaxed text-(--q-text-1)">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
