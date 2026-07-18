import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { NewsletterCard } from "@/components/newsletter-card";
import { resolveBlogLocale } from "@/lib/sanity/blog";
import { client } from "@/lib/sanity/client";
import { CATEGORIES_QUERY, getFilteredPostsQuery } from "@/lib/sanity/queries";
import { buildPageMetadata } from "@/lib/seo";
import type { PostDocument } from "@/types/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const blogLocale = await resolveBlogLocale(locale);

  return buildPageMetadata({
    locale,
    pathname: "/blog",
    title: t("metadata.blog_title"),
    description: t("metadata.blog_description"),
    // Locales served English fallback content are not indexed (avoids duplicate content).
    noIndex: blogLocale !== locale,
  });
}

const POSTS_PER_PAGE = 9;

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const { t } = await getTranslation(locale, "common");

  const q =
    typeof resolvedSearchParams.q === "string"
      ? resolvedSearchParams.q.trim()
      : "";
  const category =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : "all";
  const explicitSort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : undefined;
  const sort = explicitSort ?? (q ? "relevance" : "date-desc");
  const parsedPage =
    typeof resolvedSearchParams.page === "string"
      ? Number.parseInt(resolvedSearchParams.page, 10)
      : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const searchQuery = q ? `*${q}*` : "";
  const blogLocale = await resolveBlogLocale(locale);

  const [categories, { posts, total }] = await Promise.all([
    client.fetch<Array<{ _id: string; title: string }>>(CATEGORIES_QUERY),
    client.fetch<{ posts: PostDocument[]; total: number }>(
      getFilteredPostsQuery(sort),
      {
        language: blogLocale,
        searchQuery,
        category,
        start,
        end,
      },
    ),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const isEditorialView =
    page === 1 && !q && category === "all" && sort === "date-desc";
  const featuredPost = isEditorialView ? posts[0] : undefined;
  const archivePosts = featuredPost ? posts.slice(1) : posts;
  const hasDiscoveryFilters = !isEditorialView;

  const filterTranslations = {
    search: t("blog_page.search_placeholder"),
    searchLabel: t("blog_page.search_label"),
    filters: t("blog_page.filters"),
    allCategories: t("blog_page.all_categories"),
    sort: t("blog_page.sort_by"),
    relevance: t("blog_page.relevance"),
    newest: t("blog_page.newest"),
    oldest: t("blog_page.oldest"),
    titleAsc: t("blog_page.title_asc"),
    titleDesc: t("blog_page.title_desc"),
    clear: t("blog_page.clear_filters"),
  };

  const archiveTitle = q
    ? t("blog_page.search_results", { query: q })
    : category !== "all"
      ? category
      : t("blog_page.latest_articles");

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 pb-20 pt-28 sm:pt-32">
        <div className="container mx-auto max-w-7xl px-5 sm:px-6">
          <header className="grid items-end gap-8 border-b border-(--q-border) pb-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:pb-12">
            <div className="max-w-3xl">
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-(--q-accent-strong)">
                {t("blog_page.eyebrow")}
              </p>
              <h1 className="text-5xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {t("blog_page.title")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-(--q-text-1) sm:text-xl">
                {t("blog_page.subtitle")}
              </p>
            </div>

            <div className="flex items-end justify-between gap-6 border-l-2 border-(--q-accent) pl-5 lg:block">
              <div>
                <p className="font-mono text-3xl font-semibold tracking-tight text-(--q-text-0)">
                  {total}
                </p>
                <p className="mt-1 text-sm text-(--q-text-2)">
                  {t(
                    hasDiscoveryFilters
                      ? "blog_page.matching_articles"
                      : "blog_page.published_articles",
                  )}
                </p>
              </div>
              <ArrowDown className="size-5 text-(--q-text-2) lg:mt-8" />
            </div>
          </header>

          <div className="mt-8">
            <BlogFilters
              categories={categories}
              currentCategory={category}
              currentSearch={q}
              currentSort={sort}
              translations={filterTranslations}
            />
          </div>

          {featuredPost && (
            <section className="mt-12" aria-labelledby="featured-article-title">
              <h2 id="featured-article-title" className="sr-only">
                {t("blog_page.featured")}
              </h2>
              <FeaturedArticle
                post={featuredPost}
                locale={locale}
                label={t("blog_page.featured")}
                readLabel={t("blog_page.read_article")}
              />
            </section>
          )}

          <section className="mt-14" aria-labelledby="articles-heading">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-(--q-border) pb-5">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-(--q-text-2)">
                  {t("blog_page.archive")}
                </p>
                <h2
                  id="articles-heading"
                  className="text-3xl font-bold tracking-tight sm:text-4xl"
                >
                  {archiveTitle}
                </h2>
              </div>
              <p className="text-sm text-(--q-text-2)">
                {t("blog_page.articles_count", { count: total })}
              </p>
            </div>

            {archivePosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {archivePosts.map((post, index) => (
                  <ArticleCard
                    key={post._id ?? post.slug.current}
                    post={post}
                    locale={locale}
                    compact
                    priority={hasDiscoveryFilters && index < 2}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-(--q-border) bg-(--q-bg-1) px-6 text-center">
                <p className="text-xl font-semibold text-(--q-text-0)">
                  {t("blog_page.no_results")}
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-(--q-text-2)">
                  {t("blog_page.try_adjusting")}
                </p>
              </div>
            )}
          </section>

          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            translations={{
              previous: t("blog_page.previous"),
              next: t("blog_page.next"),
            }}
          />

          {isEditorialView && (
            <div className="mt-16">
              <NewsletterCard locale={locale} source="blog-index" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
