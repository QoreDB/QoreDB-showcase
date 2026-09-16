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
  getDocsAlternates,
  isDocsLocale,
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
    ...getDocsAlternates("/docs"),
    title: t("docs.landing_title"),
    description: t("docs.landing_subtitle"),
    noIndex: !isDocsLocale(locale),
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
  const tree = getDocsTree(docsLocale, DEFAULT_DOCS_LOCALE);

  return (
    <article className="docs-prose">
      <header className="not-prose mb-10 border-b border-(--q-border) pb-10">
        <div className="flex flex-col gap-6">
          <div>
            <span className="q-eyebrow mb-4 inline-block">
              {t("docs.learning_hub")}
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-[-0.04em] text-(--q-text-0) sm:text-5xl">
              {t("docs.landing_title")}
            </h1>
            <p className="mt-3 text-base text-(--q-text-1) max-w-2xl leading-relaxed">
              {t("docs.landing_subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/docs/getting-started/installation`}
              className="inline-flex items-center justify-center min-h-11 rounded-md bg-(--q-action) px-4 py-2.5 text-sm font-semibold text-(--q-on-action) hover:bg-(--q-action-hover) transition-colors"
            >
              <Rocket className="mr-2 size-4" />
              {t("docs.quick_start_cta")}
            </Link>
            <Link
              href={`/${locale}/docs/connections/postgresql`}
              className="inline-flex items-center justify-center min-h-11 rounded-md border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 text-sm font-semibold text-(--q-text-0) hover:bg-(--q-bg-1) hover:text-(--q-accent) transition-colors"
            >
              <Database className="mr-2 size-4" />
              {t("docs.databases_cta")}
            </Link>
          </div>
        </div>
      </header>

      <div className="not-prose grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {tree.map((node) => {
          if (node.kind !== "section") return null;
          const leafPages = getLeafPages(node);
          if (leafPages.length === 0) return null;
          const firstLeaf = leafPages[0];
          const IconComponent = SECTION_ICONS[node.slug[0]] || BookOpen;

          const remaining = leafPages.length - 4;
          const moreText = t("docs.more_pages", { remaining });

          return (
            <div
              key={node.slug.join("/")}
              className="flex min-w-0 flex-col border-t border-(--q-border) pt-6"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="flex size-6 shrink-0 items-center justify-center text-(--q-accent)">
                  <IconComponent className="size-5.5" />
                </div>
                <Link
                  href={firstLeaf.href}
                  prefetch={false}
                  className="font-heading text-lg font-bold text-(--q-text-0) hover:text-(--q-accent) transition-colors leading-snug"
                >
                  {node.label}
                </Link>
              </div>

              <ul className="space-y-2.5 mb-6 pl-0.5">
                {leafPages.slice(0, 4).map((page) => (
                  <li key={page.href} className="flex items-center">
                    <Link
                      href={page.href}
                      prefetch={false}
                      className="inline-flex items-center text-sm text-(--q-text-1) hover:text-(--q-accent) transition-colors group/link"
                    >
                      <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--q-text-2)/40 transition-colors group-hover/link:bg-(--q-accent)" />
                      <span className="min-w-0">{page.label}</span>
                      {page.premium && (
                        <span className="ml-2 rounded bg-(--q-accent-soft) px-1.5 py-0.25 shrink-0 text-[10px] font-bold tracking-wide uppercase text-(--q-accent-strong)">
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

              <Link
                href={firstLeaf.href}
                prefetch={false}
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-(--q-accent) hover:text-(--q-accent-strong) transition-colors"
              >
                {t("docs.explore_section")}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
      <NewsletterCard locale={locale} source="docs-landing" />
    </article>
  );
}
