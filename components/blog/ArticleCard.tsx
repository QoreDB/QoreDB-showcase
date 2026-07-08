"use client";

import Image from "next/image";
import Link from "next/link";
import { getIntlLocale } from "@/lib/locale";
import type { PostDocument } from "@/types/posts";
import { urlForImage } from "../../lib/sanity/image";

type ArticleCardProps = {
  post: PostDocument;
  locale?: string;
};

export function ArticleCard({ post, locale }: ArticleCardProps) {
  const slug = post.slug?.current ?? "";
  const basePath = locale ? `/${locale}` : "";

  return (
    <Link
      href={`${basePath}/blog/${slug}`}
      prefetch={false}
      className="group relative flex flex-col space-y-3"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-(--q-border) bg-(--q-bg-1) transition-colors">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).url()}
            alt={post.title || "Article Image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-(--q-text-2)">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-(--q-text-2)">
          {post.categories && post.categories.length > 0 && (
            <span className="font-medium text-(--q-text-0)">
              {"title" in post.categories[0]
                ? post.categories[0].title
                : undefined}
            </span>
          )}
          {post.categories && post.categories.length > 0 && <span>•</span>}
          {post.publishedAt && (
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
          )}
        </div>
        <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-(--q-accent) decoration-2 underline-offset-4">
          {post.title}
        </h3>
        {post.author && "name" in post.author && (
          <div className="flex items-center gap-2 text-sm text-(--q-text-2) pt-1">
            {post.author.image && (
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={urlForImage(post.author.image).url()}
                  alt={post.author?.name || "Author Image"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span>{post.author.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
