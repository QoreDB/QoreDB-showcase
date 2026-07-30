"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const result: PageItem[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous && page - previous > 1) {
      result.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
    }
    result.push(page);
  });

  return result;
}

export function BlogPagination({
  currentPage,
  totalPages,
  translations,
}: {
  currentPage: number;
  totalPages: number;
  translations: { previous: string; next: string };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-14 border-t border-(--q-border) pt-8">
      <PaginationContent className="justify-center">
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationLink
              href={createPageURL(currentPage - 1)}
              size="default"
              aria-label={translations.previous}
              className="gap-1.5 px-2 sm:px-3"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">{translations.previous}</span>
            </PaginationLink>
          ) : (
            <span className="block size-9 sm:w-24" aria-hidden="true" />
          )}
        </PaginationItem>

        {getVisiblePages(currentPage, totalPages).map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink
                href={createPageURL(item)}
                isActive={currentPage === item}
                aria-label={`${item}`}
              >
                {item}
              </PaginationLink>
            ) : (
              <span
                className="flex size-9 items-center justify-center text-(--q-text-2)"
                aria-hidden="true"
              >
                <MoreHorizontal className="size-4" />
              </span>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationLink
              href={createPageURL(currentPage + 1)}
              size="default"
              aria-label={translations.next}
              className="gap-1.5 px-2 sm:px-3"
            >
              <span className="hidden sm:inline">{translations.next}</span>
              <ChevronRight className="size-4" />
            </PaginationLink>
          ) : (
            <span className="block size-9 sm:w-24" aria-hidden="true" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
