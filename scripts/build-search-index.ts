/**
 * Run after `next build` to index the static HTML output with Pagefind
 * and copy the resulting bundle into `public/pagefind` so the search
 * dialog can fetch `/pagefind/pagefind.js` at runtime.
 *
 * Usage: `pnpm tsx scripts/build-search-index.ts`
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();

function findSourceDir(): string | null {
  const candidates = [
    path.join(root, ".next", "server", "app"),
    path.join(root, ".next", "static"),
    path.join(root, "out"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const source = findSourceDir();
if (!source) {
  console.warn(
    "[pagefind] No build output found. Run `next build` (or `next build && next export`) first.",
  );
  process.exit(0);
}

const outDir = path.join(root, "public", "pagefind");
fs.mkdirSync(outDir, { recursive: true });

const result = spawnSync(
  "pnpm",
  [
    "exec",
    "pagefind",
    "--site",
    source,
    "--output-path",
    outDir,
    "--exclude-selectors",
    "header,footer,nav[aria-label='Docs navigation'],nav[aria-label='Table of contents'],nav[aria-label='Breadcrumb']",
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) {
  console.error("[pagefind] indexing failed");
  process.exit(result.status ?? 1);
}

console.log("[pagefind] index written to", outDir);
