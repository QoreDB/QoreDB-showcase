import fs from "node:fs";
import path from "node:path";

export type DocsMeta = {
  label?: string;
  order?: number;
  items?: string[];
};

export function readMeta(dir: string): DocsMeta | null {
  const file = path.join(dir, "_meta.json");
  if (!fs.existsSync(file)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function humanize(slug: string) {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\.mdx?$/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
