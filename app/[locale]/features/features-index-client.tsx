"use client";

import Image from "next/image";
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
        <div className="q-page-header mb-12">
          <h1 className="mb-5 max-w-4xl">{t("features_index.title")}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
            {t("features_index.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURE_PAGES.map((feature) => {
            const Icon = feature.icon;
            const base = `features_pages.${feature.slug}`;
            const isPro = feature.tier === "pro";
            return (
              <Link
                key={feature.slug}
                href={`/${locale}/features/${feature.slug}`}
                prefetch={false}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-(--q-bg-1) transition-colors hover:bg-(--q-bg-2)"
              >
                {/* Real desktop captures; features without one fall back to their icon. */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0b0b0d]">
                  {feature.image ? (
                    <Image
                      src={feature.image}
                      alt=""
                      width={2000}
                      height={1310}
                      sizes="(max-width: 640px) 100vw, 650px"
                      loading="lazy"
                      className="absolute left-1/2 top-0 h-auto w-[112%] max-w-none -translate-x-1/2 -translate-y-[3%] transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(60%_80%_at_50%_0%,rgba(122,108,255,0.35),transparent_70%)] text-[#aa9fff]">
                      <Icon className="size-12" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 flex items-center gap-3 text-2xl font-semibold tracking-tight text-(--q-text-0)">
                    {t(`${base}.title`)}
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold tracking-normal ${
                        isPro
                          ? "bg-(--q-accent-soft) text-(--q-accent)"
                          : "bg-(--q-bg-0) text-(--q-text-0)"
                      }`}
                    >
                      {isPro
                        ? t("features_common.tier_pro")
                        : t("features_common.tier_core")}
                    </span>
                  </h2>
                  <p className="flex-1 text-[15px] leading-relaxed text-(--q-text-1)">
                    {t(`${base}.teaser`)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
