import fs from "node:fs";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { DocFrontmatter, DocHeading } from "./types";

export type LoadedDoc = {
  source: string;
  frontmatter: DocFrontmatter;
  headings: DocHeading[];
};

const headingRegex = /^(#{1,4})\s+(.+?)\s*$/gm;

const PLACEHOLDER_MARKERS = [
  "This page is a placeholder",
  "Cette page est un brouillon",
];

export function isPlaceholderBody(body: string): boolean {
  return PLACEHOLDER_MARKERS.some((m) => body.includes(m));
}

export function isDraft(
  frontmatter: DocFrontmatter,
  body: string,
): boolean {
  if (frontmatter.draft === true) return true;
  return isPlaceholderBody(body);
}

function extractHeadings(markdown: string): DocHeading[] {
  const slugger = new GithubSlugger();
  const out: DocHeading[] = [];
  let match: RegExpExecArray | null;
  headingRegex.lastIndex = 0;
  while ((match = headingRegex.exec(markdown))) {
    const depth = match[1].length;
    const text = match[2].replace(/`([^`]+)`/g, "$1").trim();
    if (depth === 1) continue;
    out.push({ id: slugger.slug(text), text, depth });
  }
  return out;
}

/**
 * Remove a leading top-level heading (`# …`) from the MDX source.
 *
 * The page layout already renders the frontmatter `title` as the page's
 * `<h1>`, so a body that starts with `# Title` produces a duplicate
 * heading. We strip exactly one leading H1 (allowing optional blank lines
 * and MDX components above it) and leave deeper headings (`##`, `###`)
 * untouched.
 */
function stripLeadingH1(source: string): string {
  // Skip optional leading whitespace/blank lines before the H1.
  const match = source.match(/^[ \t]*\n*#[ \t]+[^\n]*(\r?\n)+/);
  if (!match) return source;
  return source.slice(match[0].length);
}

export function loadDoc(filePath: string): LoadedDoc {
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  const frontmatter: DocFrontmatter = {
    title: typeof data.title === "string" ? data.title : "Untitled",
    description: typeof data.description === "string" ? data.description : "",
    order: typeof data.order === "number" ? data.order : undefined,
    premium: data.premium === true,
    draft: data.draft === true,
  };
  return {
    source: stripLeadingH1(content),
    frontmatter,
    headings: extractHeadings(content),
  };
}

export function isFileDraft(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return true;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  if (data.draft === true) return true;
  return isPlaceholderBody(content);
}
