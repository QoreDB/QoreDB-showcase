import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PostDocument } from "@/types/posts";

export function ArticleNavigation({
  previous,
  next,
  locale,
  previousLabel,
  nextLabel,
}: {
  previous?: PostDocument | null;
  next?: PostDocument | null;
  locale: string;
  previousLabel: string;
  nextLabel: string;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={`${previousLabel} / ${nextLabel}`}
      className="grid gap-3 border-t border-(--q-border) pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/${locale}/blog/${previous.slug.current}`}
          className="group rounded-xl border border-(--q-border) p-4 transition-colors hover:border-(--q-accent)/45 hover:bg-(--q-bg-1)"
        >
          <span className="mb-2 flex items-center gap-1.5 text-xs font-medium text-(--q-text-2)">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {previousLabel}
          </span>
          <span className="line-clamp-2 text-sm font-semibold leading-5 text-(--q-text-0)">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          href={`/${locale}/blog/${next.slug.current}`}
          className="group rounded-xl border border-(--q-border) p-4 text-right transition-colors hover:border-(--q-accent)/45 hover:bg-(--q-bg-1)"
        >
          <span className="mb-2 flex items-center justify-end gap-1.5 text-xs font-medium text-(--q-text-2)">
            {nextLabel}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="line-clamp-2 text-sm font-semibold leading-5 text-(--q-text-0)">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
