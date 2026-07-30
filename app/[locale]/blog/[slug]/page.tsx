import { ArrowLeft, CalendarIcon, Clock3, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleNavigation } from "@/components/blog/ArticleNavigation";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { NewsletterCard } from "@/components/newsletter-card";
import {
  formatReadingTime,
  getArticleHeadings,
  getPostExcerpt,
  getPostReadingTime,
} from "@/lib/blog-content";
import { type AppLocale, getIntlLocale, isSupportedLocale } from "@/lib/locale";
import { resolveBlogLocale } from "@/lib/sanity/blog";
import { client } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import {
  ADJACENT_POSTS_QUERY,
  POST_QUERY,
  POST_TRANSLATIONS_QUERY,
} from "@/lib/sanity/queries";
import { buildPageMetadata, getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo";
import type { PostDocument, PostTranslation } from "@/types/posts";
import { ShareButtons } from "./share-buttons";

export const revalidate = 3600;

function getPostDescription(post: PostDocument) {
  return getPostExcerpt(post, 180) || post.title || "QoreDB blog";
}

async function getAlternatePaths(slug: string) {
  const translations = await client.fetch<PostTranslation[] | null>(
    POST_TRANSLATIONS_QUERY,
    { slug },
    { next: { revalidate: 3600 } },
  );

  const entries = (translations ?? []).flatMap((translation) =>
    translation.slug && isSupportedLocale(translation.language)
      ? [[translation.language, `/blog/${translation.slug}`] as const]
      : [],
  );

  return entries.length > 0
    ? (Object.fromEntries(entries) as Partial<Record<AppLocale, string>>)
    : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const blogLocale = await resolveBlogLocale(locale);
  let contentLanguage = blogLocale;
  let post = await client.fetch<PostDocument | null>(POST_QUERY, {
    slug,
    language: blogLocale,
  });

  if (!post && blogLocale !== "en") {
    post = await client.fetch<PostDocument | null>(POST_QUERY, {
      slug,
      language: "en",
    });
    contentLanguage = "en";
  }

  if (!post) {
    return buildPageMetadata({
      locale,
      pathname: `/blog/${slug}`,
      title: t("metadata.not_found_title"),
      description: t("metadata.blog_description"),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    locale,
    pathname: `/blog/${slug}`,
    alternatePaths: await getAlternatePaths(slug),
    title: `${post.title} - ${t("metadata.blog_title")}`,
    description: getPostDescription(post),
    imagePath: post.mainImage
      ? urlForImage(post.mainImage).width(1600).height(900).url()
      : undefined,
    imageAlt: post.title ?? "QoreDB blog post",
    type: "article",
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post._updatedAt ?? post.publishedAt ?? undefined,
    authors:
      post.author && "name" in post.author && post.author.name
        ? [post.author.name]
        : undefined,
    noIndex: contentLanguage !== locale,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const blogLocale = await resolveBlogLocale(locale);
  let contentLanguage = blogLocale;
  let post = await client.fetch<PostDocument | null>(
    POST_QUERY,
    { slug, language: blogLocale },
    { next: { revalidate: 3600 } },
  );

  if (!post && blogLocale !== "en") {
    post = await client.fetch<PostDocument | null>(
      POST_QUERY,
      { slug, language: "en" },
      { next: { revalidate: 3600 } },
    );
    contentLanguage = "en";
  }

  if (!post) notFound();

  const adjacent = post.publishedAt
    ? await client.fetch<{
        previous: PostDocument | null;
        next: PostDocument | null;
      }>(ADJACENT_POSTS_QUERY, {
        publishedAt: post.publishedAt,
        language: contentLanguage,
      })
    : { previous: null, next: null };

  const readingTime = getPostReadingTime(post);
  const headings = getArticleHeadings(post.body);
  const articleUrl = getLocalizedUrl(locale, `/blog/${slug}`);
  const category =
    post.categories?.[0] && "title" in post.categories[0]
      ? post.categories[0].title
      : undefined;
  const author = post.author && "name" in post.author ? post.author : undefined;
  const wasUpdated = Boolean(
    post._updatedAt &&
      post.publishedAt &&
      new Date(post._updatedAt).getTime() -
        new Date(post.publishedAt).getTime() >
        24 * 60 * 60 * 1000,
  );

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: getPostDescription(post),
    mainEntityOfPage: articleUrl,
    image: post.mainImage
      ? [urlForImage(post.mainImage).width(1600).height(900).url()]
      : [getAbsoluteUrl("/images/screenshots/query-screen.png")],
    datePublished: post.publishedAt ?? undefined,
    dateModified: post._updatedAt ?? post.publishedAt ?? undefined,
    author: author?.name ? { "@type": "Person", name: author.name } : undefined,
    publisher: {
      "@type": "Organization",
      name: "QoreDB",
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/logo.png"),
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-(--q-bg-0) text-(--q-text-0)">
      <JsonLd
        id={`blog-article-jsonld-${locale}-${slug}`}
        data={articleStructuredData}
      />
      <ReadingProgress
        targetId="article-body"
        label={t("blog_post.reading_progress")}
      />
      <Header />

      <main className="flex-1 pb-20 pt-24 sm:pt-28">
        <article>
          <header className="container mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
            <Link
              href={`/${locale}/blog`}
              className="mb-9 inline-flex items-center gap-2 text-sm font-medium text-(--q-text-2) transition-colors hover:text-(--q-text-0)"
            >
              <ArrowLeft className="size-4" />
              {t("blog_post.back_to_blog")}
            </Link>

            <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]">
              {category && (
                <span className="rounded-md bg-(--q-accent-soft) px-2.5 py-1.5 text-(--q-accent-strong)">
                  {category}
                </span>
              )}
              <span className="text-(--q-text-2)">
                {t("blog_page.eyebrow")}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-(--q-text-1) sm:text-xl">
              {getPostExcerpt(post, 280)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-(--q-border) pt-6 text-sm text-(--q-text-2)">
              {author?.name && (
                <div className="flex items-center gap-3 font-medium text-(--q-text-0)">
                  {author.image && (
                    <span className="relative size-9 overflow-hidden rounded-full border border-(--q-border)">
                      <Image
                        src={urlForImage(author.image).url()}
                        alt={author.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <span>{author.name}</span>
                </div>
              )}

              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="size-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(
                      getIntlLocale(locale),
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" />
                {formatReadingTime(readingTime, locale)}
              </span>
              {wasUpdated && post._updatedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="size-3.5" />
                  {t("blog_post.updated", {
                    date: new Date(post._updatedAt).toLocaleDateString(
                      getIntlLocale(locale),
                      { day: "numeric", month: "short", year: "numeric" },
                    ),
                  })}
                </span>
              )}
            </div>
          </header>

          {post.mainImage && (
            <div className="container mx-auto max-w-6xl px-5 sm:px-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
                <Image
                  src={urlForImage(post.mainImage).url()}
                  alt={post.title || "Article QoreDB"}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1200px) 100vw, 1152px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="container mx-auto mt-14 grid max-w-6xl gap-10 px-5 sm:px-6 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center lg:gap-14">
            <TableOfContents
              headings={headings}
              label={t("blog_post.table_of_contents")}
            />

            <div id="article-body" className="min-w-0">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <RichTextRenderer content={post.body ?? []} />
              </div>

              <NewsletterCard locale={locale} source="blog-post" />

              <div className="border-t border-(--q-border) py-8">
                <ShareButtons title={post.title ?? "QoreDB"} />
              </div>

              <ArticleNavigation
                previous={adjacent.previous}
                next={adjacent.next}
                locale={locale}
                previousLabel={t("blog_post.previous_article")}
                nextLabel={t("blog_post.next_article")}
              />
            </div>
          </div>
        </article>

        {post.related && post.related.length > 0 && (
          <section className="container mx-auto mt-20 max-w-6xl border-t border-(--q-border) px-5 pt-12 sm:px-6">
            <div className="mb-7 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-(--q-text-2)">
                  {t("blog_page.archive")}
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  {t("blog_post.related_articles")}
                </h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {post.related
                .filter((relatedPost) => relatedPost && "slug" in relatedPost)
                .map((relatedPost) => (
                  <ArticleCard
                    key={relatedPost._id}
                    post={relatedPost}
                    locale={locale}
                  />
                ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
