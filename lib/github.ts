import socialStatsFallback from "@/lib/data/social-stats.json";

export interface GithubRelease {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: GithubAuthor;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: GithubAsset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

export interface GithubAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface GithubAsset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string | null;
  uploader: GithubAuthor;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

export interface SocialStats {
  fetched_at: string;
  downloads_raw: number;
  downloads_display: string;
  stars: number;
  releases_total: number;
  releases_months_active: number;
}

interface GithubRepoResponse {
  stargazers_count: number;
}

const GITHUB_REPO = "QoreDB/QoreDB";

function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "QoreDB-Website",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function githubFetchInit(revalidate?: number): RequestInit {
  if (revalidate === undefined) {
    return { headers: getGithubHeaders() };
  }
  return {
    headers: getGithubHeaders(),
    next: { revalidate },
  };
}

export async function getReleases(): Promise<GithubRelease[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      githubFetchInit(3600),
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch GitHub releases:", error);
    return [];
  }
}

async function fetchRepo(revalidate?: number): Promise<GithubRepoResponse> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}`,
    githubFetchInit(revalidate),
  );
  if (!res.ok) throw new Error(`GET /repos: ${res.status} ${res.statusText}`);
  return res.json() as Promise<GithubRepoResponse>;
}

async function fetchAllReleases(revalidate?: number): Promise<GithubRelease[]> {
  const out: GithubRelease[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=100&page=${page}`,
      githubFetchInit(revalidate),
    );
    if (!res.ok) {
      throw new Error(
        `GET /releases p${page}: ${res.status} ${res.statusText}`,
      );
    }
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

/**
 * Fetch live GitHub stats (stars, cumulative release asset downloads, release count).
 * Used both at build time (`scripts/fetch-stats.ts`) and at runtime via Next.js ISR.
 */
export async function fetchGithubSocialStats(options?: {
  revalidate?: number;
}): Promise<SocialStats> {
  const [repo, releases] = await Promise.all([
    fetchRepo(options?.revalidate),
    fetchAllReleases(options?.revalidate),
  ]);
  const published = releases.filter((r) => !r.draft);
  const downloads_raw = sumDownloads(published);
  return {
    fetched_at: new Date().toISOString(),
    downloads_raw,
    downloads_display: formatRoundedDownloads(downloads_raw),
    stars: repo.stargazers_count,
    releases_total: published.length,
    releases_months_active: monthsSinceFirstRelease(published),
  };
}

/**
 * Fetch GitHub social stats with a 1-hour ISR cache, falling back to the
 * build-time snapshot (`lib/data/social-stats.json`) if GitHub is unreachable.
 */
export async function getSocialStats(): Promise<SocialStats> {
  try {
    return await fetchGithubSocialStats({ revalidate: 3600 });
  } catch (err) {
    console.warn(
      "[getSocialStats] fetch failed, using fallback snapshot:",
      err instanceof Error ? err.message : err,
    );
    return socialStatsFallback;
  }
}
