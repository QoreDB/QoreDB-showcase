import { ArrowLeft, Download, FileJson } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManifestDetail } from "@/components/marketplace/manifest-detail";
import TranslationsProvider from "@/components/TranslationsProvider";
import { Button } from "@/components/ui/button";
import {
  findPlugin,
  findVersion,
  isValidPluginId,
  RegistryUnavailableError,
} from "@/lib/marketplace/registry";
import { buildPageMetadata } from "@/lib/seo";

const i18nNamespaces = ["common"];

export const revalidate = 300;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const { t } = await getTranslation(locale, "common");
  if (!isValidPluginId(id)) {
    return buildPageMetadata({
      locale,
      pathname: `/marketplace/${id}`,
      title: t("marketplace.detail.not_found_title"),
      description: t("marketplace.detail.not_found_subtitle"),
    });
  }
  try {
    const plugin = await findPlugin(id);
    if (!plugin) {
      return buildPageMetadata({
        locale,
        pathname: `/marketplace/${id}`,
        title: t("marketplace.detail.not_found_title"),
        description: t("marketplace.detail.not_found_subtitle"),
      });
    }
    return buildPageMetadata({
      locale,
      pathname: `/marketplace/${plugin.id}`,
      title: `${plugin.name} — ${t("marketplace.page_title")}`,
      description: plugin.description ?? t("marketplace.page_subtitle"),
    });
  } catch {
    return buildPageMetadata({
      locale,
      pathname: `/marketplace/${id}`,
      title: t("marketplace.page_title"),
      description: t("marketplace.registry_unavailable"),
    });
  }
}

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { resources, t } = await getTranslation(locale, "common");
  if (!isValidPluginId(id)) notFound();

  let plugin;
  try {
    plugin = await findPlugin(id);
  } catch (error) {
    if (error instanceof RegistryUnavailableError) {
      return (
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <main className="min-h-screen bg-background">
            <Header />
            <section className="mx-auto max-w-3xl px-4 pt-32 pb-16">
              <p className="text-(--q-text-1)">
                {t("marketplace.registry_unavailable")}
              </p>
            </section>
            <Footer />
          </main>
        </TranslationsProvider>
      );
    }
    throw error;
  }

  if (!plugin) notFound();

  const version = findVersion(plugin);
  if (!version) notFound();

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-4xl px-4 pt-32 pb-16 sm:px-6 lg:px-12">
          <Link
            href={`/${locale}/marketplace`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-text-0)"
          >
            <ArrowLeft size={14} />
            {t("marketplace.detail.back")}
          </Link>

          <header className="mb-10 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-(--q-text-0) sm:text-4xl">
              {plugin.name}
            </h1>
            <p className="font-mono text-sm text-(--q-text-2)">
              {plugin.id} · v{version.version}
            </p>
            {plugin.description ? (
              <p className="max-w-2xl text-base text-(--q-text-1)">
                {plugin.description}
              </p>
            ) : null}
          </header>

          <section className="mb-10 space-y-3 rounded-xl border border-(--q-border) bg-(--q-bg-1) p-6">
            <h2 className="text-lg font-medium text-(--q-text-0)">
              {t("marketplace.detail.install_title")}
            </h2>
            <p className="text-sm text-(--q-text-1)">
              {t("marketplace.detail.install_step_1")}
            </p>
            <p className="text-sm text-(--q-text-1)">
              {t("marketplace.detail.install_step_2")}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <a href={version.archive.url} className="gap-1.5">
                  <Download size={14} />
                  {t("marketplace.detail.download_archive", {
                    size: formatSize(version.archive.sizeBytes),
                  })}
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={version.manifestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  <FileJson size={14} />
                  {t("marketplace.detail.view_manifest")}
                </a>
              </Button>
            </div>
          </section>

          <h2 className="mb-4 text-lg font-medium text-(--q-text-0)">
            {t("marketplace.detail.manifest_heading")}
          </h2>
          <ManifestDetail plugin={plugin} version={version} />
        </section>
        <Footer />
      </main>
    </TranslationsProvider>
  );
}
