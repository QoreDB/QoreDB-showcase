import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { NewsletterCard } from "@/components/newsletter-card";
import { getIntlLocale } from "@/lib/locale";
import { estimateReadingTime } from "@/lib/reading-time";
import { buildPageMetadata, getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo";
import type { PostDocument } from "@/types/posts";
import { ArticleCard } from "../../../../components/blog/ArticleCard";
import { RichTextRenderer } from "../../../../components/blog/RichTextRenderer";
import { client } from "../../../../lib/sanity/client";
import { urlForImage } from "../../../../lib/sanity/image";
import { POST_QUERY } from "../../../../lib/sanity/queries";
import { ShareButtons } from "./share-buttons";

function getPostDescription(post: PostDocument) {
  const plainText = (post.body ?? [])
    .filter((block) => block._type === "block")
    .flatMap((block) =>
      "children" in block && block.children
        ? block.children.map((span) => span.text)
        : [],
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return post.title ?? "QoreDB blog";
  }

  return plainText.slice(0, 180);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const post = await client.fetch<PostDocument | null>(POST_QUERY, {
    slug,
    language: locale,
  });
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
    title: `${post.title} - ${t("metadata.blog_title")}`,
    description: getPostDescription(post),
    imagePath: post.mainImage
      ? urlForImage(post.mainImage).width(1600).height(900).url()
      : undefined,
    imageAlt: post.title ?? "QoreDB blog post",
    type: "article",
    publishedTime: post.publishedAt ?? undefined,
    modifiedTime: post.publishedAt ?? undefined,
    authors:
      post.author && "name" in post.author && post.author.name
        ? [post.author.name]
        : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const post = await client.fetch<PostDocument | null>(
    POST_QUERY,
    { slug, language: locale },
    { next: { revalidate: 3600 } },
  );

  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.body);
  const articleUrl = getLocalizedUrl(locale, `/blog/${slug}`);
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
    dateModified: post.publishedAt ?? undefined,
    author:
      post.author && "name" in post.author && post.author.name
        ? {
            "@type": "Person",
            name: post.author.name,
          }
        : undefined,
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
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Script
        id={`blog-article-jsonld-${locale}-${slug}`}
        type="application/ld+json"
      >
        {JSON.stringify(articleStructuredData)}
      </Script>
      <Header />
      <main className="flex-1 pt-20">
        <article className="container py-24 max-w-4xl mx-auto space-y-12">
          <div className="space-y-6 text-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center text-sm text-(--q-text-2) hover:text-(--q-text-0) transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("blog_post.back_to_blog")}
            </Link>
            <div className="flex items-center justify-center gap-4 text-sm text-(--q-text-2)">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(
                      getIntlLocale(locale),
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </time>
                </span>
              )}
              <span className="w-1 h-1 rounded-full bg-(--q-text-2)/50" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {t("blog_post.reading_time", { minutes: readingTime })}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl leading-tight">
              {post.title}
            </h1>
            {post.author && "name" in post.author && (
              <div className="flex items-center justify-center gap-3 pt-4">
                {post.author.image && (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-(--q-border)">
                    <Image
                      src={urlForImage(post.author.image).url()}
                      alt={post.author.name || "Author Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">{post.author.name}</p>
                </div>
              </div>
            )}
          </div>

          {post.mainImage && (
            <div className="relative aspect-2/1 w-full overflow-hidden rounded-xl border border-(--q-border) bg-(--q-bg-1)">
              <Image
                src={urlForImage(post.mainImage).url()}
                alt={post.title || "Post Main Image"}
                fill
                className="object-cover"
                preload
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <RichTextRenderer content={post.body ?? []} />
          </div>

          <NewsletterCard locale={locale} source="blog-post" />

          {/* Share buttons */}
          <div className="border-t border-(--q-border) pt-8">
            <ShareButtons title={post.title ?? "QoreDB"} />
          </div>

          {post.related && post.related.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold">
                {t("blog_post.related_articles")}
              </h3>
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
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
