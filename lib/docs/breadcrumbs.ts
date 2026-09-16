import path from "node:path";
import { humanize, readMeta } from "./meta";
import { buildDocHref } from "./paths";
import { findPageWithFallback, flattenPages, getDocsTree } from "./tree";
import { DEFAULT_DOCS_LOCALE, type DocsLocale, isDocsLocale } from "./types";

export function buildBreadcrumbs(
  locale: string,
  metaSourceLocale: DocsLocale,
  slug: string[],
  title: string,
  tDocsLanding: string,
) {
  const items: Array<{ label: string; href?: string }> = [
    { label: tDocsLanding, href: `/${locale}/docs` },
  ];
  const docsLocale = isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE;
  const pages = flattenPages(getDocsTree(docsLocale, DEFAULT_DOCS_LOCALE));
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
    const localMeta = readMeta(
      path.join(process.cwd(), "content", "docs", docsLocale, ...acc),
    );
    const meta = localMeta ?? readMeta(dirPath);
    // A grouping directory is not a route: use its first article when no index exists.
    const index = findPageWithFallback(docsLocale, acc).page;
    const firstArticle = pages.find((page) =>
      acc.every((part, depth) => page.slug[depth] === part),
    );
    const destination = index?.slug ?? firstArticle?.slug;
    items.push({
      label: meta?.label ?? humanize(slug[i]),
      ...(destination ? { href: buildDocHref(locale, destination) } : {}),
    });
  }
  items.push({ label: title });
  return items;
}
