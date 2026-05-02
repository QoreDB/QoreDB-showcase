import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import path from "node:path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { EditOnGithub } from "@/components/docs/EditOnGithub";
import { FallbackBanner } from "@/components/docs/FallbackBanner";
import { LastUpdated } from "@/components/docs/LastUpdated";
import { docsMdxComponents } from "@/components/docs/mdx";
import { PremiumBadge } from "@/components/docs/PremiumBadge";
import { PrevNextNav } from "@/components/docs/PrevNextNav";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { getLastUpdated } from "@/lib/docs/git";
import { loadDoc } from "@/lib/docs/mdx";
import { humanize, readMeta } from "@/lib/docs/meta";
import {
  findPageWithFallback,
  getAdjacentPages,
  getAllPages,
  getDocsTree,
} from "@/lib/docs/tree";
import {
  type DocsLocale,
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
} from "@/lib/docs/types";
import { buildPageMetadata } from "@/lib/seo";

const PRETTY_CODE_OPTIONS = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

function resolveDocsLocale(locale: string): DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(locale)
    ? (locale as DocsLocale)
    : DEFAULT_DOCS_LOCALE;
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];
  for (const locale of DOCS_LOCALES) {
    const pages = getAllPages(locale);
    for (const page of pages) {
      if (page.slug.length === 0) continue;
      params.push({ locale, slug: page.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const docsLocale = resolveDocsLocale(locale);
  const { page } = findPageWithFallback(docsLocale, slug);
  if (!page) {
    return buildPageMetadata({
      locale,
      pathname: `/docs/${slug.join("/")}`,
      title: "Not found",
      description: "Documentation page not found.",
      noIndex: true,
    });
  }
  return buildPageMetadata({
    locale,
    pathname: `/docs/${slug.join("/")}`,
    title: page.frontmatter.title,
    description: page.frontmatter.description,
  });
}

function buildBreadcrumbs(
  locale: string,
  metaSourceLocale: DocsLocale,
  slug: string[],
  title: string,
  tDocsLanding: string,
) {
  const items: Array<{ label: string; href?: string }> = [
    { label: tDocsLanding, href: `/${locale}/docs` },
  ];
  let acc: string[] = [];
  for (let i = 0; i < slug.length - 1; i++) {
    acc = [...acc, slug[i]];
    const dirPath = path.join(
      process.cwd(),
      "content",
      "docs",
      metaSourceLocale,
      ...acc,
    );
    const meta = readMeta(dirPath);
    items.push({
      label: meta?.label ?? humanize(slug[i]),
      href: `/${locale}/docs/${acc.join("/")}`,
    });
  }
  items.push({ label: title });
  return items;
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  const docsLocale = resolveDocsLocale(locale);
  const { t } = await getTranslation(locale, "common");

  const { page, fellBack } = findPageWithFallback(docsLocale, slug);
  if (!page) notFound();

  const { source, frontmatter, headings } = loadDoc(page.filePath);
  const lastUpdated = getLastUpdated(page.filePath);
  // Hrefs in URL locale, sibling list built from English (the source of truth).
  const adjacent = getAdjacentPages(docsLocale, slug, DEFAULT_DOCS_LOCALE);
  // Touch tree to ensure caching consistency on incremental builds
  getDocsTree(docsLocale, DEFAULT_DOCS_LOCALE);

  // Breadcrumb section labels come from the locale we actually rendered from,
  // so they stay in sync with the rendered content.
  const breadcrumbs = buildBreadcrumbs(
    locale,
    page.locale,
    slug,
    frontmatter.title,
    t("docs.landing_title"),
  );

  const repoRelPath = path
    .relative(process.cwd(), page.filePath)
    .replace(/\\/g, "/");

  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_14rem]">
      <article className="docs-prose min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <header className="not-prose mb-8">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-(--q-text-0)">
              {frontmatter.title}
            </h1>
            {frontmatter.premium ? (
              <PremiumBadge locale={locale} />
            ) : null}
          </div>
          {frontmatter.description ? (
            <p className="mt-2 text-lg text-(--q-text-2)">
              {frontmatter.description}
            </p>
          ) : null}
          <LastUpdated iso={lastUpdated} locale={locale} />
        </header>

        {fellBack ? <FallbackBanner /> : null}

        <MDXRemote
          source={source}
          components={docsMdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypePrettyCode, PRETTY_CODE_OPTIONS],
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: "append",
                    properties: { className: ["docs-anchor"], ariaHidden: true, tabIndex: -1 },
                  },
                ],
              ],
            },
          }}
        />

        <div className="mt-10 flex items-center justify-end">
          <EditOnGithub relativePath={repoRelPath} />
        </div>

        <PrevNextNav
          prev={
            adjacent.prev
              ? { label: adjacent.prev.label, href: adjacent.prev.href }
              : null
          }
          next={
            adjacent.next
              ? { label: adjacent.next.label, href: adjacent.next.href }
              : null
          }
        />
      </article>

      <aside className="hidden xl:block">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
