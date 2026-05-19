import { getReleases } from "@/lib/github";
import { getAbsoluteUrl } from "@/lib/seo";

export const runtime = "nodejs";
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "" : d.toUTCString();
}

export async function GET() {
  const releases = await getReleases();
  const channelUrl = getAbsoluteUrl("/en/changelog");
  const feedUrl = getAbsoluteUrl("/changelog.rss");

  const items = releases
    .filter((r) => !r.draft)
    .slice(0, 50)
    .map((r) => {
      const link = r.html_url ?? getAbsoluteUrl(`/en/changelog#${r.tag_name}`);
      const title = `${r.name?.trim() || r.tag_name}`;
      const description = r.body?.trim() || `Release ${r.tag_name}`;
      const pubDate = toRfc822(r.published_at ?? r.created_at);
      return [
        "    <item>",
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        `      <description><![CDATA[${description}]]></description>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuildDate =
    releases[0]?.published_at && toRfc822(releases[0].published_at);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>QoreDB — Changelog</title>
    <link>${escapeXml(channelUrl)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>Releases, fixes and new capabilities for QoreDB.</description>
    <language>en</language>${lastBuildDate ? `\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
