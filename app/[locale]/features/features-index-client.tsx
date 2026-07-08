"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { FEATURE_PAGES } from "@/lib/features";

export function FeaturesIndexClient() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-(--q-accent) opacity-5 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="relative text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-(--q-text-0) to-(--q-text-1)">
            {t("features_index.title")}
          </h1>
          <p className="relative text-lg text-(--q-text-2) max-w-2xl mx-auto leading-relaxed">
            {t("features_index.subtitle")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURE_PAGES.map((feature) => {
            const Icon = feature.icon;
            const base = `features_pages.${feature.slug}`;
            const isPro = feature.tier === "pro";
            return (
              <Link
                key={feature.slug}
                href={`/${locale}/features/${feature.slug}`}
                prefetch={false}
                className="group relative flex flex-col rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6 transition-colors hover:border-(--q-accent)/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--q-accent)/10 text-(--q-accent)">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
                      isPro
                        ? "bg-(--q-accent)/10 text-(--q-accent) border border-(--q-accent)/30"
                        : "bg-(--q-bg-0) text-(--q-text-2) border border-(--q-border)"
                    }`}
                  >
                    {isPro
                      ? t("features_common.tier_pro")
                      : t("features_common.tier_core")}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-(--q-text-0) mb-2">
                  {t(`${base}.title`)}
                </h2>
                <p className="text-sm text-(--q-text-1) leading-relaxed flex-1">
                  {t(`${base}.teaser`)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--q-accent)">
                  {t("features_common.learn_more")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
