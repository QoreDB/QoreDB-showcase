import { ArrowRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  formatReadingTime,
  getPostExcerpt,
  getPostReadingTime,
} from "@/lib/blog-content";
import { getIntlLocale } from "@/lib/locale";
import { urlForImage } from "@/lib/sanity/image";
import type { PostDocument } from "@/types/posts";

export function FeaturedArticle({
  post,
  locale,
  label,
  readLabel,
}: {
  post: PostDocument;
  locale: string;
  label: string;
  readLabel: string;
}) {
  const category =
    post.categories?.[0] && "title" in post.categories[0]
      ? post.categories[0].title
      : undefined;
  const author = post.author && "name" in post.author ? post.author : undefined;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--q-accent) to-transparent opacity-70" />
      <Link
        href={`/${locale}/blog/${post.slug.current}`}
        prefetch={false}
        className="group grid lg:grid-cols-[1.18fr_0.82fr]"
      >
        <div className="relative aspect-[16/10] min-h-72 overflow-hidden border-b border-(--q-border) bg-(--q-bg-2) lg:aspect-auto lg:min-h-[430px] lg:border-r lg:border-b-0">
          {post.mainImage && (
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.title || "Article QoreDB"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
            <span className="rounded-md bg-(--q-accent-soft) px-2.5 py-1.5 text-(--q-accent-strong)">
              {label}
            </span>
            {category && (
              <span className="font-mono text-(--q-text-2)">{category}</span>
            )}
          </div>

          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-(--q-text-0) sm:text-4xl">
            {post.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-(--q-text-1)">
            {getPostExcerpt(post, 245)}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--q-text-2)">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(
                  getIntlLocale(locale),
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </time>
            )}
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" />
              {formatReadingTime(getPostReadingTime(post), locale)}
            </span>
          </div>

          <div className="mt-9 flex items-center justify-between gap-4 border-t border-(--q-border) pt-6">
            {author?.name ? (
              <div className="flex items-center gap-3 text-sm font-medium text-(--q-text-1)">
                {author.image && (
                  <span className="relative size-8 overflow-hidden rounded-full border border-(--q-border)">
                    <Image
                      src={urlForImage(author.image).url()}
                      alt={author.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                )}
                <span>{author.name}</span>
              </div>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--q-text-0)">
              {readLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
