"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function PricingPreview() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "fr";

  return (
    <section className="relative z-10 py-24 px-6 bg-(--q-bg-0)">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            {t("pricing_preview.title")}
          </h2>
          <p className="text-(--q-text-1) text-lg">
            {t("pricing_preview.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Free / Core */}
          <div className="p-6 rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-(--q-text-0)">
                {t("pricing_page.core.title")}
              </h3>
              <p className="text-xs font-medium text-(--q-accent) mt-1">
                {t("pricing_page.core.tagline")}
              </p>
              <p className="text-3xl font-bold text-(--q-text-0) mt-2">
                {t("pricing_preview.core_price")}
              </p>
            </div>
            <ul className="space-y-2">
              {["core_1", "core_2", "core_3", "core_4"].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-(--q-text-1)"
                >
                  <Check className="w-4 h-4 text-(--q-accent) shrink-0" />
                  {t(`pricing_preview.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="p-6 rounded-2xl border border-(--q-accent)/30 bg-(--q-accent)/5">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-(--q-text-0)">
                  {t("pricing_page.pro.title")}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-(--q-accent)/10 text-(--q-accent)">
                  {t("pricing_preview.pro_badge")}
                </span>
              </div>
              <p className="text-xs font-medium text-(--q-accent) mt-1">
                {t("pricing_page.pro.tagline")}
              </p>
              <p className="text-(--q-text-2) text-sm mt-2">
                {t("pricing_preview.pro_price_note")}
              </p>
            </div>
            <ul className="space-y-2">
              {["pro_1", "pro_2", "pro_3", "pro_4"].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-(--q-text-1)"
                >
                  <Check className="w-4 h-4 text-(--q-accent) shrink-0" />
                  {t(`pricing_preview.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 text-sm font-medium text-(--q-accent) hover:text-(--q-accent-strong) transition-colors"
          >
            {t("pricing_preview.cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
