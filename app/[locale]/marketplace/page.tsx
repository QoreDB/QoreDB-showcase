import { ExternalLink, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { MarketplaceList } from "@/components/marketplace/marketplace-list";
import TranslationsProvider from "@/components/TranslationsProvider";
import { Button } from "@/components/ui/button";
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
    pathname: "/marketplace",
    title: t("marketplace.page_title"),
    description: t("marketplace.page_subtitle"),
  });
}

export default async function MarketplacePage({
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
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight text-(--q-text-0) sm:text-4xl">
                {t("marketplace.page_title")}
              </h1>
              <p className="mt-3 text-base text-(--q-text-1)">
                {t("marketplace.page_subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/${locale}/marketplace/submit`} className="gap-1.5">
                  <Plus size={14} />
                  {t("marketplace.submit_cta")}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://github.com/qoredb/qoredb-plugins-registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  <ExternalLink size={14} />
                  {t("marketplace.registry_link_label")}
                </a>
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-(--q-text-0)">
              {t("marketplace.section_title")}
            </h2>
            <p className="mt-1 text-sm text-(--q-text-2)">
              {t("marketplace.section_subtitle")}
            </p>
          </div>

          {unavailable ? (
            <div className="rounded-xl border border-(--q-border) bg-(--q-bg-1) p-6 text-sm text-(--q-text-2)">
              {t("marketplace.registry_unavailable")}
            </div>
          ) : (
            <MarketplaceList plugins={plugins} locale={locale} />
          )}
        </section>
        <Footer />
      </main>
    </TranslationsProvider>
  );
}
