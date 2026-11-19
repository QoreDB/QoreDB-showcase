"use client";

import { Check, Infinity as InfinityIcon, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const TCO_YEARS = 3;

type Competitor = {
  id: "dbeaver" | "tableplus" | "qoredb";
  /** Listed price in USD, without conversion; null uses the QoreDB Pro price. */
  price: number | null;
  /** Yearly cost after the first year to keep receiving updates. */
  renewal: number;
  highlight: boolean;
};

const competitors: Competitor[] = [
  { id: "dbeaver", price: 113, renewal: 113, highlight: false },
  { id: "tableplus", price: 99, renewal: 59, highlight: false },
  { id: "qoredb", price: null, renewal: 0, highlight: true },
];

function formatUsd(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingComparison({
  qoredbPrice,
}: {
  qoredbPrice: string | null;
}) {
  const { t, i18n } = useTranslation();
  const fallbackPrice = t("pricing_page.pro.price");
  const qoredbDisplay = qoredbPrice ?? fallbackPrice;

  return (
    <section className="max-w-5xl mx-auto mt-20">
      <div className="mb-10">
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">
          {t("pricing_comparison.title")}
        </h2>
        <p className="mt-3 text-(--q-text-1)">
          {t("pricing_comparison.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitors.map((c) => {
          const isQoreDb = c.id === "qoredb";
          const priceDisplay =
            c.price != null ? formatUsd(c.price, i18n.language) : qoredbDisplay;
          const tcoDisplay =
            c.price != null
              ? formatUsd(c.price + c.renewal * (TCO_YEARS - 1), i18n.language)
              : qoredbDisplay;
          return (
            <div
              key={c.id}
              className={`rounded-lg border p-6 flex flex-col ${
                c.highlight
                  ? "border-(--q-accent) bg-(--q-accent)/5 "
                  : "border-(--q-border) bg-(--q-bg-1)"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-(--q-text-0)">
                  {t(`pricing_comparison.tools.${c.id}.name`)}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isQoreDb
                      ? "bg-(--q-accent)/10 text-(--q-accent)"
                      : "bg-(--q-text-2)/10 text-(--q-text-2)"
                  }`}
                >
                  {isQoreDb ? (
                    <InfinityIcon className="w-3 h-3" />
                  ) : (
                    <RotateCw className="w-3 h-3" />
                  )}
                  {t(`pricing_comparison.tools.${c.id}.tagline`)}
                </span>
              </div>

              <div className="space-y-2 text-sm mt-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-(--q-text-2)">
                    {t(`pricing_comparison.tools.${c.id}.price_label`)}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      isQoreDb ? "text-(--q-accent)" : "text-(--q-text-0)"
                    }`}
                  >
                    {priceDisplay}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-(--q-border)/50">
                  <span className="text-(--q-text-2)">
                    {t("pricing_comparison.tco_label", { years: TCO_YEARS })}
                  </span>
                  <span
                    className={`font-semibold ${
                      isQoreDb ? "text-(--q-accent)" : "text-(--q-text-1)"
                    }`}
                  >
                    {tcoDisplay}
                  </span>
                </div>
              </div>

              {isQoreDb ? (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-(--q-accent) font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {t("pricing_comparison.lifetime_perk")}
                </p>
              ) : (
                <p className="mt-4 text-xs leading-relaxed text-(--q-text-2)">
                  {t(`pricing_comparison.tools.${c.id}.detail`)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center mt-6 text-xs text-(--q-text-2) italic">
        {t("pricing_comparison.note")}
      </p>
    </section>
  );
}
