import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import type { PostDocument } from "@/types/posts";
import { estimateReadingTime } from "@/lib/reading-time";
import { ArticleCard } from "../../../../components/blog/ArticleCard";
import { RichTextRenderer } from "../../../../components/blog/RichTextRenderer";
import { client } from "../../../../lib/sanity/client";
import { urlForImage } from "../../../../lib/sanity/image";
import { POST_QUERY } from "../../../../lib/sanity/queries";
import { ShareButtons } from "./share-buttons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<PostDocument | null>(POST_QUERY, { slug });
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.title} - QoreDB Blog`,
    description: post.title,
    openGraph: post.mainImage
      ? {
          images: [urlForImage(post.mainImage).url()],
        }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await client.fetch<PostDocument | null>(
    POST_QUERY,
    { slug },
    { next: { revalidate: 60 } },
  );

  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.body);

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 pt-20">
        <article className="container py-24 max-w-4xl mx-auto space-y-12">
          <div className="space-y-6 text-center">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center text-sm text-(--q-text-2) hover:text-(--q-text-0) transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {locale === "en" ? "Back to blog" : "Retour au blog"}
            </Link>
            <div className="flex items-center justify-center gap-4 text-sm text-(--q-text-2)">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(
                      locale === "en" ? "en-US" : "fr-FR",
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
                {readingTime} min {locale === "en" ? "read" : "de lecture"}
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
                priority
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <RichTextRenderer content={post.body ?? []} />
          </div>

          {/* Share buttons */}
          <div className="border-t border-(--q-border) pt-8">
            <ShareButtons title={post.title ?? "QoreDB"} locale={locale} />
          </div>

          {post.related && post.related.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-3xl font-bold">
                {locale === "en" ? "Related articles" : "Articles similaires"}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {post.related
                  .filter(
                    (relatedPost) => relatedPost && "slug" in relatedPost,
                  )
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
