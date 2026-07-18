import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  formatReadingTime,
  getPostExcerpt,
  getPostReadingTime,
} from "@/lib/blog-content";
import { getIntlLocale } from "@/lib/locale";
import type { PostDocument } from "@/types/posts";
import { urlForImage } from "../../lib/sanity/image";

type ArticleCardProps = {
  post: PostDocument;
  locale?: string;
  compact?: boolean;
  priority?: boolean;
};

export function ArticleCard({
  post,
  locale,
  compact = false,
  priority = false,
}: ArticleCardProps) {
  const slug = post.slug?.current ?? "";
  const basePath = locale ? `/${locale}` : "";
  const excerpt = getPostExcerpt(post, compact ? 105 : 165);
  const readingTime = getPostReadingTime(post);
  const category =
    post.categories?.[0] && "title" in post.categories[0]
      ? post.categories[0].title
      : undefined;

  return (
    <Link
      href={`${basePath}/blog/${slug}`}
      prefetch={false}
      className={`group grid h-full overflow-hidden rounded-xl border border-(--q-border) bg-(--q-bg-0) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--q-accent)/45 hover:shadow-md ${
        compact
          ? "sm:min-h-[205px] sm:grid-cols-[240px_minmax(0,1fr)] sm:items-center"
          : "grid-rows-[auto_1fr]"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-(--q-bg-1) ${
          compact
            ? "aspect-video sm:m-4 sm:mr-0 sm:rounded-lg"
            : "aspect-[16/9]"
        }`}
      >
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).url()}
            alt={post.title || "Article QoreDB"}
            fill
            priority={priority}
            sizes={
              compact
                ? "(max-width: 640px) 100vw, 224px"
                : "(max-width: 768px) 100vw, 50vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-(--q-text-2)">
            QoreDB
          </div>
        )}
      </div>

      <div className={`flex flex-col ${compact ? "p-5" : "p-5 sm:p-6"}`}>
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-(--q-text-2)">
          {category && (
            <span className="font-mono uppercase tracking-[0.12em] text-(--q-accent-strong)">
              {category}
            </span>
          )}
          {category && <span aria-hidden="true">/</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(
                getIntlLocale(locale),
                { day: "numeric", month: "short", year: "numeric" },
              )}
            </time>
          )}
        </div>

        <h3
          className={`font-bold leading-tight tracking-tight text-(--q-text-0) transition-colors group-hover:text-(--q-accent-strong) ${
            compact ? "text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          {post.title}
        </h3>

        {excerpt && (
          <p
            className={`mt-3 text-sm leading-6 text-(--q-text-1) ${compact ? "line-clamp-2" : "line-clamp-3"}`}
          >
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 pt-5 text-xs text-(--q-text-2)">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {formatReadingTime(readingTime, locale)}
          </span>
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
