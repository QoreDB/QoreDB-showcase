import { Github, Plus } from "lucide-react";
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

export const revalidate = 3600;

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
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="q-container pt-20 lg:pt-24"
        >
          <section className="q-page-header mb-10">
            <div className="max-w-3xl">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-(--q-accent)">
                {t("marketplace.eyebrow", { defaultValue: "Plugin library" })}
              </span>
              <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight text-(--q-text-0) sm:text-5xl">
                {t("marketplace.page_title")}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
                {t("marketplace.page_subtitle")}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/plugins/submit`}
                  className="inline-flex items-center justify-center gap-2 min-h-11 rounded-md bg-(--q-action) px-5 py-2.5 text-sm font-semibold text-(--q-on-action) transition-colors hover:bg-(--q-action-hover)"
                >
                  <Plus size={16} />
                  {t("marketplace.submit_cta")}
                </Link>
                <a
                  href="https://github.com/qoredb/qoredb-plugins-registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-11 rounded-md border border-(--q-border) px-5 py-2.5 text-sm font-semibold text-(--q-text-0) transition-colors hover:border-(--q-accent)/40"
                >
                  <Github size={16} />
                  {t("marketplace.registry_link_label")}
                </a>
              </div>
            </div>
          </section>

          <section className="pb-24">
            <div className="w-full">
              {unavailable ? (
                <div className="rounded-lg border border-(--q-border) bg-(--q-bg-1) p-8 text-center text-sm text-(--q-text-2)">
                  {t("marketplace.registry_unavailable")}
                </div>
              ) : (
                <MarketplaceList plugins={plugins} locale={locale} />
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </TranslationsProvider>
  );
}
