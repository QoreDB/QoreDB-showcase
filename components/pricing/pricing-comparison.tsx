"use client";

import { motion } from "framer-motion";
import { Check, Infinity as InfinityIcon, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const TCO_YEARS = 3;

type Competitor = {
  id: "dbeaver" | "tableplus" | "qoredb";
  /** Annual subscription price in EUR (null = perpetual). */
  yearlyPrice: number | null;
  highlight: boolean;
};

const competitors: Competitor[] = [
  { id: "dbeaver", yearlyPrice: 199, highlight: false },
  { id: "tableplus", yearlyPrice: 89, highlight: false },
  { id: "qoredb", yearlyPrice: null, highlight: true },
];

function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingComparison({
  qoredbPrice,
}: {
  qoredbPrice: string | null;
}) {
  const { t } = useTranslation();
  const fallbackPrice = t("pricing_page.pro.price");
  const qoredbDisplay = qoredbPrice ?? fallbackPrice;

  return (
    <section className="max-w-5xl mx-auto mt-20">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("pricing_comparison.title")}
        </h2>
        <p className="mt-3 text-(--q-text-1)">
          {t("pricing_comparison.subtitle")}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        {competitors.map((c) => {
          const isQoreDb = c.id === "qoredb";
          const yearlyDisplay =
            c.yearlyPrice != null ? formatEuro(c.yearlyPrice) : qoredbDisplay;
          const tcoDisplay =
            c.yearlyPrice != null
              ? formatEuro(c.yearlyPrice * TCO_YEARS)
              : qoredbDisplay;
          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-6 flex flex-col ${
                c.highlight
                  ? "border-(--q-accent) bg-(--q-accent)/5 shadow-[0_30px_70px_-40px_var(--q-accent)]"
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
                    {isQoreDb
                      ? t("pricing_comparison.perpetual_label")
                      : t("pricing_comparison.year_label")}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      isQoreDb ? "text-(--q-accent)" : "text-(--q-text-0)"
                    }`}
                  >
                    {yearlyDisplay}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-(--q-border)/50">
                  <span className="text-(--q-text-2)">
                    {t("pricing_comparison.tco_label", { years: TCO_YEARS })}
                  </span>
                  <span
                    className={`font-semibold ${
                      isQoreDb ? "text-emerald-500" : "text-(--q-text-1)"
                    }`}
                  >
                    {tcoDisplay}
                  </span>
                </div>
              </div>

              {isQoreDb ? (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {t("pricing_comparison.lifetime_perk")}
                </p>
              ) : null}
            </div>
          );
        })}
      </motion.div>

      <p className="text-center mt-6 text-xs text-(--q-text-2) italic">
        {t("pricing_comparison.note")}
      </p>
    </section>
  );
}
