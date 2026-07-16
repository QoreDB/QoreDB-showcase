import {
  ArrowRight,
  BookOpen,
  Compass,
  Database,
  FileText,
  GitCompare,
  Network,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { NewsletterCard } from "@/components/newsletter-card";
import { getDocsTree } from "@/lib/docs/tree";
import {
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
  type DocsLocale,
  type DocsTreeNode,
} from "@/lib/docs/types";
import { buildPageMetadata } from "@/lib/seo";

const SECTION_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  introduction: BookOpen,
  "getting-started": Rocket,
  connections: Database,
  querying: Terminal,
  schema: Network,
  "diff-and-migrations": GitCompare,
  "ai-features": Sparkles,
  security: Shield,
  reference: FileText,
  resources: Compass,
};

function resolveDocsLocale(locale: string): DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(locale)
    ? (locale as DocsLocale)
    : DEFAULT_DOCS_LOCALE;
}

// Helper to recursively collect all leaf pages within a section node
function getLeafPages(
  node: DocsTreeNode,
): Array<{ label: string; href: string; premium?: boolean }> {
  const pages: Array<{ label: string; href: string; premium?: boolean }> = [];
  function traverse(n: DocsTreeNode) {
    if (n.kind === "page") {
      pages.push({ label: n.label, href: n.href, premium: n.premium });
    } else if (n.kind === "section" && n.children) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }
  traverse(node);
  return pages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");
  return buildPageMetadata({
    locale,
    pathname: "/docs",
    title: t("docs.landing_title"),
    description: t("docs.landing_subtitle"),
  });
}

export default async function DocsLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const docsLocale = resolveDocsLocale(locale);
  const { t } = await getTranslation(locale, "common");
  // Source of truth for content is English; hrefs keep the URL locale.
  const tree = getDocsTree(docsLocale, DEFAULT_DOCS_LOCALE);

  return (
    <article className="docs-prose">
      {/* Header Banner */}
      <header className="relative not-prose mb-12 overflow-hidden rounded-3xl border border-(--q-border)/60 bg-linear-to-br from-(--q-bg-1) to-(--q-bg-2)/45 p-8 sm:p-10">
        {/* Tech Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--q-border) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse at center, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black, transparent)",
          }}
        />

        {/* Ambient glows */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-linear-to-br from-(--q-accent)/20 to-transparent blur-3xl pointer-events-none opacity-60 animate-pulse duration-5000" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-linear-to-br from-(--q-accent-soft) to-transparent blur-3xl pointer-events-none opacity-45" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--q-accent-soft) px-3 py-1.5 text-xs font-semibold text-(--q-accent-strong) mb-4">
              <Sparkles className="size-3.5" />
              {locale === "fr" ? "Centre d'apprentissage" : "Learning Hub"}
            </span>
            <h1 className="font-heading text-3.5xl font-extrabold text-(--q-text-0) tracking-tight">
              {t("docs.landing_title")}
            </h1>
            <p className="mt-3 text-base text-(--q-text-1) max-w-2xl leading-relaxed">
              {t("docs.landing_subtitle")}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 shrink-0 self-start md:self-center">
            <Link
              href={`/${locale}/docs/getting-started/installation`}
              className="inline-flex items-center justify-center rounded-xl bg-(--q-accent) px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-(--q-accent-strong) transition-all duration-200"
            >
              <Rocket className="mr-2 size-4" />
              {locale === "fr" ? "Démarrer rapidement" : "Quick Start"}
            </Link>
            <Link
              href={`/${locale}/docs/connections/postgresql`}
              className="inline-flex items-center justify-center rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 text-sm font-semibold text-(--q-text-0) hover:bg-(--q-bg-1) hover:text-(--q-accent) transition-all duration-200"
            >
              <Database className="mr-2 size-4" />
              {locale === "fr" ? "Bases de données" : "Databases"}
            </Link>
          </div>
        </div>
      </header>

      {/* Grid of Sections */}
      <div className="not-prose grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tree.map((node) => {
          if (node.kind !== "section") return null;
          const leafPages = getLeafPages(node);
          if (leafPages.length === 0) return null;
          const firstLeaf = leafPages[0];
          const IconComponent = SECTION_ICONS[node.slug[0]] || BookOpen;

          const remaining = leafPages.length - 4;
          const moreText =
            locale === "fr" ? `+ ${remaining} autres` : `+ ${remaining} more`;

          return (
            <div
              key={node.slug.join("/")}
              className="group relative flex flex-col rounded-2xl border border-(--q-border)/60 bg-linear-to-b from-(--q-bg-0) to-(--q-bg-1)/35 p-6 transition-all duration-350 hover:-translate-y-1 hover:border-(--q-accent)/30 hover:shadow-md hover:shadow-(--q-accent-soft)/10"
            >
              {/* Top border accent line on hover */}
              <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-transparent to-transparent transition-all duration-500 group-hover:via-(--q-accent)/40" />

              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--q-accent-soft) text-(--q-accent) transition-all duration-300 group-hover:scale-105 group-hover:bg-(--q-accent) group-hover:text-white">
                  <IconComponent className="size-5.5" />
                </div>
                <Link
                  href={firstLeaf.href}
                  className="font-heading text-lg font-bold text-(--q-text-0) hover:text-(--q-accent) transition-colors leading-snug"
                >
                  {node.label}
                </Link>
              </div>

              {/* Sub-pages list */}
              <ul className="space-y-2.5 mb-6 pl-0.5">
                {leafPages.slice(0, 4).map((page) => (
                  <li key={page.href} className="flex items-center">
                    <Link
                      href={page.href}
                      className="inline-flex items-center text-sm text-(--q-text-1) hover:text-(--q-accent) transition-colors group/link"
                    >
                      <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--q-text-2)/40 transition-colors group-hover/link:bg-(--q-accent)" />
                      <span className="truncate max-w-[200px] sm:max-w-[240px] md:max-w-[180px] lg:max-w-[220px]">
                        {page.label}
                      </span>
                      {page.premium && (
                        <span className="ml-2 rounded bg-(--q-accent-soft) px-1.5 py-0.25 text-[9px] font-bold tracking-wide uppercase text-(--q-accent-strong)">
                          PRO
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                {leafPages.length > 4 && (
                  <li className="text-xs text-(--q-text-2) pl-3.5 italic font-medium">
                    {moreText}
                  </li>
                )}
              </ul>

              {/* Footer action link */}
              <Link
                href={firstLeaf.href}
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-(--q-accent) hover:text-(--q-accent-strong) transition-colors"
              >
                {locale === "fr" ? "Explorer la section" : "Explore section"}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
      <NewsletterCard locale={locale} source="docs-landing" />
    </article>
  );
}
