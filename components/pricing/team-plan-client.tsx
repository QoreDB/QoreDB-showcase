"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  EyeOff,
  GitCompare,
  Headphones,
  Link2,
  Loader2,
  Lock,
  Receipt,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getContactMailtoHref } from "@/lib/contact";

type TeamPlanClientProps = {
  locale: string;
  unitAmount: number;
  currency: string;
  minSeats: number;
  intlLocale: string;
};

type StepItem = {
  num: string;
  title: string;
  body: string;
};

type CapabilityItem = {
  title: string;
  body: string;
};

type FaqItem = {
  q: string;
  a: string;
};

const STEP_ICONS = [CreditCard, Link2, Users] as const;
const CAPABILITY_ICONS = [
  ShieldCheck,
  EyeOff,
  GitCompare,
  Activity,
  Lock,
  Headphones,
] as const;

export function TeamPlanClient({
  locale,
  unitAmount,
  currency,
  minSeats,
  intlLocale,
}: TeamPlanClientProps) {
  const { t } = useTranslation();
  const [seats, setSeats] = useState(minSeats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat(intlLocale, { style: "currency", currency }).format(
      cents / 100,
    );

  const unitLabel = formatCurrency(unitAmount);
  const totalLabel = formatCurrency(unitAmount * seats);

  const seatPresets = Array.from(new Set([minSeats, 5, 10, 20])).sort(
    (a, b) => a - b,
  );

  const coreFeatures = [
    "everything_pro",
    "seat_management",
    "central_billing",
    "priority_support",
  ].map((key) => t(`pricing_page.team.features.${key}`));

  const steps = t("pricing_page.team.landing.steps", {
    returnObjects: true,
  }) as StepItem[];

  const capabilities = t("pricing_page.team.landing.capabilities", {
    returnObjects: true,
  }) as CapabilityItem[];

  const faqItems = t("pricing_page.team.landing.faq", {
    returnObjects: true,
  }) as FaqItem[];

  const startCheckout = async () => {
    setError(null);
    setLoading(true);
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
    } catch (caught) {
      console.error(caught);
      setError(t("pricing_page.checkout_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-28 pb-20 lg:pt-36"
      >
        <div className="max-w-6xl mx-auto">
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-accent) transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("pricing_page.team.back")}
          </Link>

          {/* Hero + Interactive Configurator */}
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex font-mono text-(--q-accent) text-xs">
                  {t("pricing_page.team.badge")}
                </span>
                <span className="inline-flex items-center rounded-full border border-(--q-border) bg-(--q-bg-1) px-2.5 py-0.5 text-xs text-(--q-text-1)">
                  {t("pricing_page.team.landing.eyebrow_pill")}
                </span>
              </div>

              <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.06]">
                {t("pricing_page.team.title")} ·{" "}
                <span className="text-(--q-accent)">
                  {t("pricing_page.team.tagline")}
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-(--q-text-1) max-w-2xl">
                {t("pricing_page.team.page_subtitle")}
              </p>

              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {coreFeatures.map((label) => (
                  <li
                    key={label}
                    className="flex items-start gap-2.5 rounded-xl border border-(--q-border) bg-(--q-bg-1)/60 p-3.5 text-(--q-text-0)"
                  >
                    <span className="mt-0.5 rounded-full bg-(--q-accent)/15 p-1 shrink-0">
                      <Check className="h-3.5 w-3.5 text-(--q-accent)" />
                    </span>
                    <span className="text-sm font-medium leading-snug">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-(--q-text-2)">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-(--q-accent)" />
                  {t("pricing_page.team.landing.trust_stripe")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 text-(--q-accent)" />
                  {t("pricing_page.team.landing.trust_invoice")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-(--q-accent)" />
                  {t("pricing_page.team.landing.trust_instant")}
                </span>
              </div>
            </div>

            {/* Configurator Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-(--q-accent)/40 bg-(--q-bg-1) p-6 sm:p-8 shadow-[0_16px_48px_-20px_rgba(88,71,235,0.28)]">
                <div className="flex items-baseline justify-between gap-2 pb-5 border-b border-(--q-border)">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-(--q-accent)">
                      {t("pricing_page.team.title")}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-semibold tracking-tight text-(--q-text-0)">
                        {unitLabel}
                      </span>
                      <span className="text-sm text-(--q-text-2)">
                        {t("pricing_page.team.per_seat_note")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-5">
                  <p className="text-xs font-medium text-(--q-text-2) mb-2">
                    {t("pricing_page.team.landing.presets_label")}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {seatPresets.map((preset) => {
                      const active = seats === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={loading}
                          onClick={() => setSeats(preset)}
                          className={`rounded-lg border py-2 px-2 text-xs font-semibold transition ${
                            active
                              ? "border-(--q-accent) bg-(--q-accent)/15 text-(--q-accent)"
                              : "border-(--q-border) bg-(--q-bg-0) text-(--q-text-1) hover:border-(--q-accent)/40 hover:text-(--q-text-0)"
                          }`}
                        >
                          {t("pricing_page.team.landing.seats_unit", {
                            count: preset,
                          })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stepper */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3">
                  <span className="text-sm font-medium text-(--q-text-1)">
                    {t("pricing_page.team.seats_label")}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={t("pricing_page.team.seats_decrease")}
                      onClick={() =>
                        setSeats((value) => Math.max(minSeats, value - 1))
                      }
                      disabled={seats <= minSeats || loading}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-(--q-border) bg-(--q-bg-1) text-(--q-text-0) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--q-accent)/50 transition"
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      className="w-10 text-center text-lg font-semibold tabular-nums text-(--q-text-0)"
                    >
                      {seats}
                    </span>
                    <button
                      type="button"
                      aria-label={t("pricing_page.team.seats_increase")}
                      onClick={() => setSeats((value) => value + 1)}
                      disabled={loading}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-(--q-border) bg-(--q-bg-1) text-(--q-text-0) hover:border-(--q-accent)/50 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-5 rounded-xl bg-(--q-bg-0)/70 border border-(--q-border) px-4 py-3.5">
                  <div className="flex items-center justify-between text-xs text-(--q-text-2)">
                    <span>
                      {t("pricing_page.team.landing.breakdown", {
                        count: seats,
                        price: unitLabel,
                      })}
                    </span>
                    <span>{t("pricing_page.team.per_year")}</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-(--q-text-1)">
                      {t("pricing_page.team.total_label")}
                    </span>
                    <span className="font-heading text-3xl font-semibold tracking-tight text-(--q-text-0)">
                      {totalLabel}
                      <span className="text-xs font-sans font-normal text-(--q-text-2)">
                        {" "}
                        {t("pricing_page.team.per_year")}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={loading}
                  aria-busy={loading}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--q-action) text-(--q-on-action) px-5 py-3.5 text-base font-semibold transition hover:bg-(--q-action-hover) disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <Loader2
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                    />
                  ) : null}
                  <span>{t("pricing_page.team.cta")}</span>
                  {!loading ? (
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  ) : null}
                </button>

                <p className="mt-3 text-center text-xs text-(--q-text-2)">
                  {t("pricing_page.team.min_seats_note", { min: minSeats })} ·{" "}
                  {t("pricing_page.team.nominative_note")}
                </p>

                {error ? (
                  <p
                    role="alert"
                    className="mt-3 text-center text-sm text-(--q-error)"
                  >
                    {error}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mt-24 pt-16 border-t border-(--q-border)">
            <div className="max-w-2xl">
              <span className="inline-flex font-mono text-(--q-accent) text-xs uppercase tracking-wider">
                {t("pricing_page.team.landing.steps_eyebrow")}
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
                {t("pricing_page.team.landing.steps_title")}
              </h2>
              <p className="mt-3 text-(--q-text-1)">
                {t("pricing_page.team.landing.steps_subtitle")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.isArray(steps) &&
                steps.map((step, index) => {
                  const Icon = STEP_ICONS[index % STEP_ICONS.length];
                  return (
                    <div
                      key={step.num}
                      className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6 flex flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--q-accent)/10 text-(--q-accent)">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-xs text-(--q-text-2)">
                          {step.num}
                        </span>
                      </div>
                      <h3 className="mt-5 font-heading text-lg font-semibold text-(--q-text-0)">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-(--q-text-1)">
                        {step.body}
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* What Every Seat Unlocks */}
          <section className="mt-24">
            <div className="max-w-2xl">
              <span className="inline-flex font-mono text-(--q-accent) text-xs uppercase tracking-wider">
                {t("pricing_page.team.landing.pro_eyebrow")}
              </span>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
                {t("pricing_page.team.landing.pro_title")}
              </h2>
              <p className="mt-3 text-(--q-text-1)">
                {t("pricing_page.team.landing.pro_subtitle")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(capabilities) &&
                capabilities.map((item, index) => {
                  const Icon =
                    CAPABILITY_ICONS[index % CAPABILITY_ICONS.length];
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-(--q-border) bg-(--q-bg-1)/70 p-6"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-(--q-accent)/10 text-(--q-accent)">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="mt-4 font-heading text-base font-semibold text-(--q-text-0)">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-(--q-text-1)">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Enterprise / Large Team Callout */}
          <section className="mt-20">
            <div className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--q-accent)/10 text-(--q-accent)">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-(--q-text-0)">
                    {t("pricing_page.team.landing.enterprise_title")}
                  </h2>
                  <p className="mt-1.5 text-sm text-(--q-text-1) max-w-2xl">
                    {t("pricing_page.team.landing.enterprise_body")}
                  </p>
                </div>
              </div>
              <a
                href={getContactMailtoHref()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-(--q-border) bg-(--q-bg-0) px-5 py-3 text-sm font-semibold text-(--q-text-0) hover:border-(--q-accent)/50 hover:text-(--q-accent) transition"
              >
                {t("pricing_page.team.landing.enterprise_cta")}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </section>

          {/* Team FAQ */}
          <section className="max-w-4xl mx-auto mt-20">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
              {t("pricing_page.team.landing.faq_title")}
            </h2>
            <Accordion type="single" className="space-y-2">
              {Array.isArray(faqItems) &&
                faqItems.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger className="px-6 py-5 [&>div]:text-base">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-[15px]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
