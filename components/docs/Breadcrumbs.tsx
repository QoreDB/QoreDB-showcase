import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs text-(--q-text-2)">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${item.href ?? "leaf"}`}
              className="inline-flex items-center gap-1"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-(--q-text-0) transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-(--q-text-1)" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight className="size-3 shrink-0 text-(--q-text-2)" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
