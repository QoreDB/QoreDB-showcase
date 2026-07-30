import type { MetadataRoute } from "next";
import { getLastUpdated } from "@/lib/docs/git";
import { getAllPages } from "@/lib/docs/tree";
import { DOCS_LOCALES } from "@/lib/docs/types";
import { FEATURE_SLUGS } from "@/lib/features";
import {
  type AppLocale,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from "@/lib/locale";
import { client } from "@/lib/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/lib/sanity/queries";
import {
  getAbsoluteUrl,
  getLanguageAlternates,
  getLanguageAlternatesFromPaths,
  getLocalizedUrl,
  INDEXABLE_PATHS,
} from "@/lib/seo";
import type { SitemapPost } from "@/types/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const posts = await client.fetch<SitemapPost[]>(
    SITEMAP_POSTS_QUERY,
    {},
    { next: { revalidate: 3600 } },
  );

  const localesWithPosts = new Set<AppLocale>(
    posts.flatMap((post) =>
      isSupportedLocale(post.language) ? [post.language] : [],
    ),
  );

  const staticRoutes: MetadataRoute.Sitemap = INDEXABLE_PATHS.flatMap(
    (pathname) => {
      const locales =
        pathname === "/blog"
          ? SUPPORTED_LOCALES.filter((locale) => localesWithPosts.has(locale))
          : SUPPORTED_LOCALES;

      const languages =
        pathname === "/blog"
          ? getLanguageAlternatesFromPaths(
              Object.fromEntries(locales.map((locale) => [locale, "/blog"])),
            )
          : getLanguageAlternates(pathname);

      return locales.map((locale) => ({
        url: getLocalizedUrl(locale, pathname),
        changeFrequency: (pathname === "/" ? "weekly" : "monthly") as
          | "weekly"
          | "monthly",
        priority: pathname === "/" ? 1 : pathname === "/pricing" ? 0.9 : 0.8,
        alternates: { languages },
      }));
    },
  );

  const blogRoutes: MetadataRoute.Sitemap = posts.flatMap((post) => {
    if (!post.slug || !isSupportedLocale(post.language)) {
      return [];
    }

    const alternatePaths = Object.fromEntries(
      (post.translations ?? []).flatMap((translation) =>
        translation.slug && isSupportedLocale(translation.language)
          ? [[translation.language, `/blog/${translation.slug}`] as const]
          : [],
      ),
    ) as Partial<Record<AppLocale, string>>;

    return [
      {
        url: getLocalizedUrl(post.language, `/blog/${post.slug}`),
        lastModified: post.publishedAt
          ? new Date(post.publishedAt)
          : post._updatedAt
            ? new Date(post._updatedAt)
            : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: getLanguageAlternatesFromPaths(
            Object.keys(alternatePaths).length > 0
              ? alternatePaths
              : { [post.language]: `/blog/${post.slug}` },
          ),
        },
        images: post.hasImage
          ? [getAbsoluteUrl("/images/screenshots/query-screen.png")]
          : undefined,
      },
    ];
  });

  const docsLanguages = (pathname: string) =>
    getLanguageAlternatesFromPaths(
      Object.fromEntries(DOCS_LOCALES.map((locale) => [locale, pathname])),
    );

  const docsRoutes: MetadataRoute.Sitemap = [];
  for (const locale of DOCS_LOCALES) {
    docsRoutes.push({
      url: getLocalizedUrl(locale, "/docs"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: docsLanguages("/docs") },
    });
    for (const page of getAllPages(locale)) {
      if (page.slug.length === 0) continue;
      const pathname = `/docs/${page.slug.join("/")}`;
      const lastUpdated = getLastUpdated(page.filePath);
      docsRoutes.push({
        url: getLocalizedUrl(locale, pathname),
        ...(lastUpdated ? { lastModified: new Date(lastUpdated) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: docsLanguages(pathname) },
      });
    }
  }

  const featureRoutes: MetadataRoute.Sitemap = FEATURE_SLUGS.flatMap((slug) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: getLocalizedUrl(locale, `/features/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: getLanguageAlternates(`/features/${slug}`),
      },
    })),
  );

  return [...staticRoutes, ...docsRoutes, ...blogRoutes, ...featureRoutes];
}
