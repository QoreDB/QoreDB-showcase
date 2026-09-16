"use client";

import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

type TeamPlanClientProps = {
  locale: string;
  unitAmount: number;
  currency: string;
  minSeats: number;
  intlLocale: string;
};

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

  const features = [
    "everything_pro",
    "seat_management",
    "central_billing",
    "priority_support",
  ].map((key) => t(`pricing_page.team.features.${key}`));

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
        className="q-container flex-1 pt-32 pb-20 lg:pt-44"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-accent) transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("pricing_page.team.back")}
          </Link>

          <div className="mt-8 max-w-2xl">
            <span className="inline-flex font-mono text-(--q-accent) text-xs">
              {t("pricing_page.team.badge")}
            </span>
            <h1 className="mt-4 font-heading text-5xl md:text-6xl font-semibold tracking-[-0.045em]">
              {t("pricing_page.team.title")}
            </h1>
            <p className="mt-3 text-(--q-text-1)">
              {t("pricing_page.team.page_subtitle")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Features */}
            <div className="order-2 lg:order-1 rounded-lg border border-(--q-border) bg-(--q-bg-1) p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-(--q-text-0)">
                {t("pricing_page.team.tagline")}
              </h2>
              <ul className="mt-5 space-y-3">
                {features.map((label) => (
                  <li
                    key={label}
                    className="flex items-start gap-2.5 text-(--q-text-1)"
                  >
                    <span className="mt-0.5 rounded-full bg-(--q-accent)/10 p-1 shrink-0">
                      <Check className="h-3 w-3 text-(--q-accent)" />
                    </span>
                    <span className="text-sm leading-snug">{label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-(--q-text-2)">
                {t("pricing_page.team.nominative_note")}
              </p>
            </div>

            {/* Configurateur */}
            <div className="order-1 lg:order-2 rounded-lg border border-(--q-accent)/30 bg-(--q-accent)/5 p-6 sm:p-8 ">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-(--q-text-0)">
                  {unitLabel}
                </span>
                <span className="text-sm text-(--q-text-2)">
                  {t("pricing_page.team.per_seat_note")}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-md border border-(--q-border) bg-(--q-bg-0) px-3 py-2.5">
                <span className="text-sm text-(--q-text-1)">
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
                    className="h-11 w-11 inline-flex items-center justify-center rounded-lg border border-(--q-border) text-(--q-text-0) disabled:opacity-40 disabled:cursor-not-allowed hover:border-(--q-accent)/40 transition"
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    className="w-8 text-center text-base font-semibold text-(--q-text-0)"
                  >
                    {seats}
                  </span>
                  <button
                    type="button"
                    aria-label={t("pricing_page.team.seats_increase")}
                    onClick={() => setSeats((value) => value + 1)}
                    disabled={loading}
                    className="h-11 w-11 inline-flex items-center justify-center rounded-lg border border-(--q-border) text-(--q-text-0) hover:border-(--q-accent)/40 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-sm text-(--q-text-2)">
                  {t("pricing_page.team.total_label")}
                </span>
                <span className="text-2xl font-bold text-(--q-text-0)">
                  {totalLabel}
                  <span className="text-xs font-normal text-(--q-text-2)">
                    {" "}
                    {t("pricing_page.team.per_year")}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={startCheckout}
                disabled={loading}
                aria-busy={loading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-(--q-action) text-(--q-on-action) px-4 py-3 font-semibold transition hover:bg-(--q-action-hover) disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && (
                  <Loader2
                    aria-hidden="true"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                {t("pricing_page.team.cta")}
              </button>
              <p className="mt-3 text-center text-[11px] text-(--q-text-2)">
                {t("pricing_page.team.min_seats_note", { min: minSeats })}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
