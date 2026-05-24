import { ArrowRight, Github, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { MarketplaceList } from "@/components/marketplace/marketplace-list";
import TranslationsProvider from "@/components/TranslationsProvider";
import {
  fetchRegistryIndex,
  RegistryUnavailableError,
} from "@/lib/marketplace/registry";
import { buildPageMetadata } from "@/lib/seo";

const i18nNamespaces = ["common"];

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");
  return buildPageMetadata({
    locale,
    pathname: "/plugins",
    title: t("marketplace.page_title"),
    description: t("marketplace.page_subtitle"),
  });
}

export default async function PluginsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources, t } = await getTranslation(locale, "common");

  let plugins: Awaited<ReturnType<typeof fetchRegistryIndex>>["plugins"] = [];
  let unavailable = false;
  try {
    const index = await fetchRegistryIndex();
    plugins = index.plugins;
  } catch (error) {
    if (error instanceof RegistryUnavailableError) {
      unavailable = true;
    } else {
      throw error;
    }
  }

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />

        {/* HERO ─ landing-aligned section with floating orbs + eyebrow + bold heading */}
        <section className="relative z-10 px-6 pt-40 pb-16 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-(--q-accent)/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-(--q-accent)/5 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-purple-500/5 blur-[80px]" />

          <div className="relative mx-auto max-w-5xl text-center">
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-(--q-accent)">
              {t("marketplace.eyebrow", { defaultValue: "Plugin library" })}
            </span>
            <h1 className="font-heading mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight text-(--q-text-0) sm:text-5xl lg:text-6xl">
              {t("marketplace.page_title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
              {t("marketplace.page_subtitle")}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/plugins/submit`}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-br from-(--q-accent) to-(--q-accent-strong) px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)] transition-all hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]"
              >
                <Plus size={16} />
                {t("marketplace.submit_cta")}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </Link>
              <a
                href="https://github.com/qoredb/qoredb-plugins-registry"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-(--q-border) bg-(--q-bg-0)/50 px-6 py-3 text-sm font-semibold text-(--q-text-0) backdrop-blur-sm transition-colors hover:border-(--q-text-2)"
              >
                <Github size={16} />
                {t("marketplace.registry_link_label")}
              </a>
            </div>
          </div>
        </section>

        {/* LIST ─ aligned bg with the rest of the landing */}
        <section className="relative z-10 bg-(--q-bg-0) px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            {unavailable ? (
              <div className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-8 text-center text-sm text-(--q-text-2)">
                {t("marketplace.registry_unavailable")}
              </div>
            ) : (
              <MarketplaceList plugins={plugins} locale={locale} />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </TranslationsProvider>
  );
}
