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
    source: content,
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
