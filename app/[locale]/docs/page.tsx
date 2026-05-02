import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { getDocsTree } from "@/lib/docs/tree";
import {
  type DocsLocale,
  DOCS_LOCALES,
  DEFAULT_DOCS_LOCALE,
} from "@/lib/docs/types";
import { buildPageMetadata } from "@/lib/seo";

function resolveDocsLocale(locale: string): DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(locale)
    ? (locale as DocsLocale)
    : DEFAULT_DOCS_LOCALE;
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
      <header className="not-prose mb-10">
        <h1>{t("docs.landing_title")}</h1>
        <p className="mt-2 text-lg text-(--q-text-2)">
          {t("docs.landing_subtitle")}
        </p>
      </header>

      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {tree.map((node) => {
          if (node.kind !== "section") return null;
          const firstLeaf = (function findLeaf(n: typeof node): {
            href: string;
            label: string;
          } | null {
            for (const child of n.children) {
              if (child.kind === "page")
                return { href: child.href, label: child.label };
              const inner = findLeaf(child);
              if (inner) return inner;
            }
            return null;
          })(node);
          if (!firstLeaf) return null;
          return (
            <Link
              key={node.slug.join("/")}
              href={firstLeaf.href}
              className="group flex flex-col gap-2 rounded-xl border border-(--q-border) p-5 transition-all hover:-translate-y-0.5 hover:border-(--q-accent)/40 hover:shadow-md"
            >
              <h3 className="font-heading text-base font-semibold text-(--q-text-0)">
                {node.label}
              </h3>
              <p className="text-sm text-(--q-text-2)">{firstLeaf.label}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-(--q-accent) group-hover:text-(--q-accent-strong)">
                {t("docs.next")}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </article>
  );
}
