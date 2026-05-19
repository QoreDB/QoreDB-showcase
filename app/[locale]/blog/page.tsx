import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { buildPageMetadata } from "@/lib/seo";
import type { PostDocument } from "@/types/posts";
import { ArticleCard } from "../../../components/blog/ArticleCard";
import { BlogFilters } from "../../../components/blog/BlogFilters";
import { BlogPagination } from "../../../components/blog/BlogPagination";
import { client } from "../../../lib/sanity/client";
import { CATEGORIES_QUERY, getFilteredPostsQuery } from "../../../lib/sanity/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/blog",
    title: t("metadata.blog_title"),
    description: t("metadata.blog_description"),
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

  const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "all";
  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "date-desc";
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const searchQuery = q ? `*${q}*` : "";

  // Execute Sanity queries in parallel
  const [categories, { posts, total }] = await Promise.all([
    client.fetch(CATEGORIES_QUERY),
    client.fetch(getFilteredPostsQuery(sort), {
      language: locale,
      searchQuery: searchQuery,
      category: category,
      start,
      end,
    }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const filterTranslations = {
    search: t("blog_page.search_placeholder") || "Search articles...",
    category: t("blog_page.category") || "Category",
    allCategories: t("blog_page.all_categories") || "All Categories",
    sort: t("blog_page.sort_by") || "Sort by",
    newest: t("blog_page.newest") || "Newest",
    oldest: t("blog_page.oldest") || "Oldest",
    titleAsc: t("blog_page.title_asc") || "Title (A-Z)",
    titleDesc: t("blog_page.title_desc") || "Title (Z-A)",
  };

  const paginationTranslations = {
    previous: t("blog_page.previous") || "Previous",
    next: t("blog_page.next") || "Next",
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 container mx-auto pt-32 pb-20 px-6 space-y-12">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("blog_page.title")}
          </h1>
          <p className="text-(--q-text-1) text-lg">{t("blog_page.subtitle")}</p>
        </div>

        <BlogFilters
          categories={categories}
          currentCategory={category}
          currentSearch={q}
          currentSort={sort}
          translations={filterTranslations}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {posts && posts.length > 0 ? (
            posts.map((post: PostDocument) => (
              <div key={post._id}>
                <ArticleCard post={post} locale={locale} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-(--q-text-2) flex flex-col items-center justify-center">
              <p className="text-xl mb-2">{t("blog_page.no_results") || "No articles found."}</p>
              <p className="text-sm">{t("blog_page.try_adjusting") || "Try adjusting your filters or search term."}</p>
            </div>
          )}
        </div>

        <BlogPagination
          currentPage={page}
          totalPages={totalPages}
          translations={paginationTranslations}
        />
      </main>
      <Footer />
    </div>
  );
}
