/**
 * Fetch public GitHub stats (stars, total binary downloads, recent releases)
 * for the QoreDB repo and write them to `lib/data/social-stats.json` so the
 * landing page social-proof bar can render them at build time.
 *
 * Falls back to the previously-committed JSON when the GitHub API is
 * unreachable, so the build never breaks on an offline machine.
 *
 * Usage:
 *   pnpm tsx scripts/fetch-stats.ts
 *   GITHUB_TOKEN=ghp_xxx pnpm tsx scripts/fetch-stats.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { GithubRelease } from "@/lib/github";

const GITHUB_REPO = "QoreDB/QoreDB";
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

export interface SocialStats {
  fetched_at: string;
  downloads_raw: number;
  downloads_display: string;
  stars: number;
  releases_total: number;
  releases_months_active: number;
}

interface RepoResponse {
  stargazers_count: number;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "QoreDB-Website-Stats",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function fetchRepo(): Promise<RepoResponse> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GET /repos: ${res.status} ${res.statusText}`);
  return res.json() as Promise<RepoResponse>;
}

async function fetchAllReleases(): Promise<GithubRelease[]> {
  const out: GithubRelease[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100&page=${page}`,
      { headers: headers() },
    );
    if (!res.ok)
      throw new Error(
        `GET /releases p${page}: ${res.status} ${res.statusText}`,
      );
    const batch = (await res.json()) as GithubRelease[];
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

function sumDownloads(releases: GithubRelease[]): number {
  let total = 0;
  for (const r of releases) {
    for (const a of r.assets ?? []) {
      total += a.download_count ?? 0;
    }
  }
  return total;
}

function publishedReleases(releases: GithubRelease[]): GithubRelease[] {
  return releases.filter((r) => !r.draft);
}

/**
 * Months elapsed between the oldest published release and now, rounded
 * to the nearest whole month (min 1). Lets the social-proof bar honestly
 * say "N releases in M months" without ever lying about the window.
 */
function monthsSinceFirstRelease(releases: GithubRelease[]): number {
  if (releases.length === 0) return 1;
  const oldest = releases.reduce((acc, r) => {
    const t = new Date(r.published_at ?? r.created_at).getTime();
    return Number.isFinite(t) && t < acc ? t : acc;
  }, Date.now());
  const months = (Date.now() - oldest) / (30 * 24 * 60 * 60 * 1000);
  return Math.max(1, Math.round(months));
}

/**
 * Round down so the "+" suffix is honest: 5237 -> "5,000+", 1287 -> "1,000+",
 * 487 -> "400+", 73 -> "73" (no suffix once we drop below the bucket size).
 */
function formatRoundedDownloads(raw: number): string {
  if (raw < 100) return raw.toLocaleString("en-US");
  const bucket = raw >= 1000 ? 1000 : 100;
  const floored = Math.floor(raw / bucket) * bucket;
  return `${floored.toLocaleString("en-US")}+`;
}

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
    const [repo, releases] = await Promise.all([
      fetchRepo(),
      fetchAllReleases(),
    ]);
    const published = publishedReleases(releases);
    const downloads_raw = sumDownloads(published);
    stats = {
      fetched_at: new Date().toISOString(),
      downloads_raw,
      downloads_display: formatRoundedDownloads(downloads_raw),
      stars: repo.stargazers_count,
      releases_total: published.length,
      releases_months_active: monthsSinceFirstRelease(published),
    };
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
