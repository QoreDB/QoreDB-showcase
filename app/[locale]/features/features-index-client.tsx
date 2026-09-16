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
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-20 pb-20 lg:pt-24"
      >
        <div className="q-page-header mb-8">
          <h1 className="mb-5 max-w-4xl">{t("features_index.title")}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
            {t("features_index.subtitle")}
          </p>
        </div>

        <div className="grid gap-x-12 sm:grid-cols-2">
          {FEATURE_PAGES.map((feature) => {
            const Icon = feature.icon;
            const base = `features_pages.${feature.slug}`;
            const isPro = feature.tier === "pro";
            return (
              <Link
                key={feature.slug}
                href={`/${locale}/features/${feature.slug}`}
                prefetch={false}
                className="group flex min-w-0 flex-col border-b border-(--q-border) py-8 transition-colors hover:border-(--q-accent)"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex size-8 items-center text-(--q-accent)">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span
                    className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${
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
                <h2 className="text-2xl font-semibold tracking-tight text-(--q-text-0) mb-2">
                  {t(`${base}.title`)}
                </h2>
                <p className="text-sm text-(--q-text-1) leading-relaxed flex-1">
                  {t(`${base}.teaser`)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--q-accent)">
                  {t("features_common.learn_more")}
                  <ArrowRight className="w-4 h-4" />
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
