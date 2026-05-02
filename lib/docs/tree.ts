import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isFileDraft } from "./mdx";
import { humanize, readMeta } from "./meta";
import { buildDocHref, getLocaleRoot } from "./paths";
import {
  type DocFrontmatter,
  type DocPage,
  type DocsLocale,
  type DocsTreeNode,
  DEFAULT_DOCS_LOCALE,
} from "./types";

function listEntries(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true });
}

function readFrontmatter(filePath: string): DocFrontmatter {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    title: typeof data.title === "string" ? data.title : humanize(path.basename(filePath)),
    description: typeof data.description === "string" ? data.description : "",
    order: typeof data.order === "number" ? data.order : undefined,
    premium: data.premium === true,
    draft: data.draft === true,
  };
}

function orderItems(
  entries: Array<{ name: string; isDir: boolean }>,
  metaItems?: string[],
) {
  if (!metaItems || metaItems.length === 0) {
    return [...entries].sort((a, b) => a.name.localeCompare(b.name));
  }

  const indexOf = (name: string) => {
    const i = metaItems.indexOf(name);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  return [...entries].sort((a, b) => {
    const ai = indexOf(a.name);
    const bi = indexOf(b.name);
    if (ai === bi) return a.name.localeCompare(b.name);
    return ai - bi;
  });
}

/**
 * In production we hide pages and sections that are still placeholders
 * (frontmatter `draft: true` or a known placeholder marker in the body).
 * In dev they remain visible so writers can iterate on them.
 */
const HIDE_DRAFTS = process.env.NODE_ENV === "production";

function buildNode(
  dir: string,
  locale: DocsLocale,
  slug: string[],
): DocsTreeNode[] {
  const entries = listEntries(dir);
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, isDir: true }));
  const files = entries
    .filter((e) => e.isFile() && /\.mdx?$/.test(e.name) && !e.name.startsWith("_"))
    .map((e) => ({ name: e.name.replace(/\.mdx?$/, ""), isDir: false }));

  const meta = readMeta(dir);
  const ordered = orderItems([...dirs, ...files], meta?.items);

  const children: DocsTreeNode[] = [];
  for (const entry of ordered) {
    const childSlug = [...slug, entry.name];
    if (entry.isDir) {
      const childDir = path.join(dir, entry.name);
      const childMeta = readMeta(childDir);
      const childKids = buildNode(childDir, locale, childSlug);
      const indexFile = ["index.mdx", "index.md"]
        .map((f) => path.join(childDir, f))
        .find((p) => fs.existsSync(p));
      const label = childMeta?.label ?? humanize(entry.name);
      if (indexFile && childKids.length === 0) {
        if (HIDE_DRAFTS && isFileDraft(indexFile)) continue;
        const fm = readFrontmatter(indexFile);
        children.push({
          kind: "page",
          label: fm.title || label,
          slug: childSlug,
          href: buildDocHref(locale, childSlug),
          premium: fm.premium,
        });
      } else {
        // A section is hidden if it has no surviving children after filtering.
        if (HIDE_DRAFTS && childKids.length === 0) continue;
        children.push({
          kind: "section",
          label,
          slug: childSlug,
          children: childKids,
        });
      }
    } else {
      const filePath = path.join(dir, `${entry.name}.mdx`);
      const realPath = fs.existsSync(filePath)
        ? filePath
        : path.join(dir, `${entry.name}.md`);
      if (HIDE_DRAFTS && isFileDraft(realPath)) continue;
      const fm = readFrontmatter(realPath);
      children.push({
        kind: "page",
        label: fm.title || humanize(entry.name),
        slug: childSlug,
        href: buildDocHref(locale, childSlug),
        premium: fm.premium,
      });
    }
  }
  return children;
}

export function getDocsTree(
  hrefLocale: DocsLocale,
  contentLocale: DocsLocale = hrefLocale,
): DocsTreeNode[] {
  const root = getLocaleRoot(contentLocale);
  if (!fs.existsSync(root)) return [];
  return buildNode(root, hrefLocale, []);
}

export function flattenPages(
  nodes: DocsTreeNode[],
): Array<Extract<DocsTreeNode, { kind: "page" }>> {
  const out: Array<Extract<DocsTreeNode, { kind: "page" }>> = [];
  for (const node of nodes) {
    if (node.kind === "page") out.push(node);
    else out.push(...flattenPages(node.children));
  }
  return out;
}

export function getAllPages(locale: DocsLocale): DocPage[] {
  const root = getLocaleRoot(locale);
  if (!fs.existsSync(root)) return [];
  const out: DocPage[] = [];

  const walk = (dir: string, slug: string[]) => {
    const entries = listEntries(dir);
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...slug, entry.name]);
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name) && !entry.name.startsWith("_")) {
        const name = entry.name.replace(/\.mdx?$/, "");
        const fullSlug = name === "index" ? slug : [...slug, name];
        const filePath = path.join(dir, entry.name);
        const fm = readFrontmatter(filePath);
        out.push({
          locale,
          slug: fullSlug,
          href: buildDocHref(locale, fullSlug),
          filePath,
          frontmatter: fm,
        });
      }
    }
  };

  walk(root, []);
  return out;
}

export function findPage(locale: DocsLocale, slug: string[]): DocPage | null {
  const pages = getAllPages(locale);
  const target = slug.join("/");
  return pages.find((p) => p.slug.join("/") === target) ?? null;
}

/**
 * Resolve a documentation page with English fallback.
 *
 * When the page in the requested locale is missing or marked as draft
 * (either by frontmatter `draft: true` or by a known placeholder marker
 * in the body), this returns the English version instead and signals
 * that the fallback was applied.
 *
 * The returned `page.locale` reflects where the content was actually
 * read from, so callers can use `page.filePath` directly with `loadDoc`.
 */
export function findPageWithFallback(
  locale: DocsLocale,
  slug: string[],
): { page: DocPage | null; fellBack: boolean } {
  const local = findPage(locale, slug);
  if (local && !isFileDraft(local.filePath)) {
    return { page: local, fellBack: false };
  }
  if (locale !== DEFAULT_DOCS_LOCALE) {
    const fallback = findPage(DEFAULT_DOCS_LOCALE, slug);
    if (fallback && !isFileDraft(fallback.filePath)) {
      return { page: fallback, fellBack: true };
    }
  }
  return { page: local, fellBack: false };
}

export function getAdjacentPages(
  hrefLocale: DocsLocale,
  slug: string[],
  contentLocale: DocsLocale = hrefLocale,
) {
  const tree = getDocsTree(hrefLocale, contentLocale);
  const flat = flattenPages(tree);
  const idx = flat.findIndex((p) => p.slug.join("/") === slug.join("/"));
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
