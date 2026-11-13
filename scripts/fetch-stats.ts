/**
 * Fetch public GitHub stats (stars, total binary downloads, recent releases)
 * for the QoreDB repo and write them to `lib/data/social-stats.json` as the
 * build-time / offline fallback snapshot.
 *
 * Usage:
 *   pnpm tsx scripts/fetch-stats.ts
 *   GITHUB_TOKEN=ghp_xxx pnpm tsx scripts/fetch-stats.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fetchGithubSocialStats, type SocialStats } from "@/lib/github";

export type { SocialStats };

const OUTPUT_PATH = path.join(
  process.cwd(),
  "lib",
  "data",
  "social-stats.json",
);

const FALLBACK: SocialStats = {
  fetched_at: "1970-01-01T00:00:00Z",
  downloads_raw: 5500,
  downloads_display: "5,500+",
  stars: 62,
  releases_total: 21,
  releases_months_active: 4,
};

function readFallback(): SocialStats {
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, "utf8");
    return JSON.parse(raw) as SocialStats;
  } catch {
    return FALLBACK;
  }
}

async function main() {
  let stats: SocialStats;
  try {
    stats = await fetchGithubSocialStats();
    console.log("[fetch-stats] fetched", stats);
  } catch (err) {
    stats = readFallback();
    console.warn(
      "[fetch-stats] fetch failed, keeping previous values:",
      err instanceof Error ? err.message : err,
    );
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(stats, null, 2)}\n`);
  console.log("[fetch-stats] wrote", path.relative(process.cwd(), OUTPUT_PATH));
}

main().catch((err) => {
  console.error("[fetch-stats] fatal:", err);
  process.exit(1);
});
