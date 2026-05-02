import path from "node:path";
import type { DocsLocale } from "./types";

export const DOCS_CONTENT_ROOT = path.join(process.cwd(), "content", "docs");

export function getLocaleRoot(locale: DocsLocale) {
  return path.join(DOCS_CONTENT_ROOT, locale);
}

export function buildDocHref(locale: string, slug: string[]) {
  if (slug.length === 0) {
    return `/${locale}/docs`;
  }
  return `/${locale}/docs/${slug.join("/")}`;
}
