import {
  Activity,
  ArrowLeft,
  Download,
  FileJson,
  type LucideIcon,
  Palette,
  Plug,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManifestDetail } from "@/components/marketplace/manifest-detail";
import TranslationsProvider from "@/components/TranslationsProvider";
import {
  findPlugin,
  findVersion,
  isValidPluginId,
  type PluginCategory,
  RegistryUnavailableError,
} from "@/lib/marketplace/registry";
import { buildPageMetadata } from "@/lib/seo";

const i18nNamespaces = ["common"];

export const revalidate = 3600;

const CATEGORY_ICONS: Record<PluginCategory, LucideIcon> = {
  safety: Shield,
  observability: Activity,
  productivity: Zap,
  theming: Palette,
  integrations: Plug,
};

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
      pathname: `/plugins/${id}`,
      title: t("marketplace.detail.not_found_title"),
      description: t("marketplace.detail.not_found_subtitle"),
    });
  }
  try {
    const plugin = await findPlugin(id);
    if (!plugin) {
      return buildPageMetadata({
        locale,
        pathname: `/plugins/${id}`,
        title: t("marketplace.detail.not_found_title"),
        description: t("marketplace.detail.not_found_subtitle"),
      });
    }
    return buildPageMetadata({
      locale,
      pathname: `/plugins/${plugin.id}`,
      title: `${plugin.name} — ${t("marketplace.page_title")}`,
      description: plugin.description ?? t("marketplace.page_subtitle"),
    });
  } catch {
    return buildPageMetadata({
      locale,
      pathname: `/plugins/${id}`,
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
          <main className="min-h-screen bg-background overflow-hidden">
            <Header />
            <section className="mx-auto max-w-3xl px-6 pt-40 pb-16">
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

  const CategoryIcon = plugin.category
    ? CATEGORY_ICONS[plugin.category]
    : Puzzle;

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />

        {/* HERO with floating orbs, eyebrow, plugin identity, badges */}
        <section className="relative z-10 px-6 pt-40 pb-12 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-(--q-accent)/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-(--q-accent)/5 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl">
            <Link
              href={`/${locale}/plugins`}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-(--q-text-2) transition-colors hover:text-(--q-text-0)"
            >
              <ArrowLeft size={14} />
              {t("marketplace.detail.back")}
            </Link>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-(--q-accent)/10 ring-1 ring-(--q-accent)/20">
                <CategoryIcon className="h-8 w-8 text-(--q-accent)" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {plugin.category ? (
                    <span className="rounded-full bg-(--q-accent)/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-(--q-accent)">
                      {t(`marketplace.categories.${plugin.category}`)}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-(--q-border) bg-(--q-bg-1) px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-(--q-text-2)">
                    {t(`marketplace.kind.${plugin.kind}`)}
                  </span>
                </div>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-(--q-text-0) sm:text-4xl lg:text-5xl">
                  {plugin.name}
                </h1>
                <p className="mt-2 font-mono text-sm text-(--q-text-2)">
                  {plugin.id} · v{version.version}
                  {plugin.author ? (
                    <span>
                      {" · "}
                      {t("marketplace.card.by", { author: plugin.author })}
                    </span>
                  ) : null}
                </p>
                {plugin.description ? (
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
                    {plugin.description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* INSTALL CTA card — primary action, with shimmer */}
        <section className="relative z-10 px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-8">
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-(--q-accent)/10 blur-3xl" />

              <div className="relative">
                <h2 className="font-heading mb-3 text-xl font-semibold text-(--q-text-0)">
                  {t("marketplace.detail.install_title")}
                </h2>
                <ol className="mb-6 space-y-2 text-sm leading-relaxed text-(--q-text-1)">
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--q-accent)/15 text-[10px] font-bold text-(--q-accent)">
                      1
                    </span>
                    {t("marketplace.detail.install_step_1")}
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--q-accent)/15 text-[10px] font-bold text-(--q-accent)">
                      2
                    </span>
                    {t("marketplace.detail.install_step_2")}
                  </li>
                </ol>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={version.archive.url}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-br from-(--q-accent) to-(--q-accent-strong) px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)] transition-all hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]"
                  >
                    <Download size={16} />
                    {t("marketplace.detail.download_archive", {
                      size: formatSize(version.archive.sizeBytes),
                    })}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </a>
                  <a
                    href={version.manifestUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-(--q-border) bg-(--q-bg-0)/50 px-6 py-3 text-sm font-semibold text-(--q-text-0) backdrop-blur-sm transition-colors hover:border-(--q-text-2)"
                  >
                    <FileJson size={16} />
                    {t("marketplace.detail.view_manifest")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MANIFEST DETAILS */}
        <section className="relative z-10 bg-(--q-bg-0) px-6 pb-24">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
          <div className="mx-auto max-w-4xl pt-16">
            <h2 className="font-heading mb-8 text-2xl font-semibold tracking-tight text-(--q-text-0)">
              {t("marketplace.detail.manifest_heading")}
            </h2>
            <ManifestDetail plugin={plugin} version={version} />
          </div>
        </section>

        <Footer />
      </main>
    </TranslationsProvider>
  );
}
