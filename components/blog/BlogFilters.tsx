"use client";

import { LoaderCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFiltersProps {
  categories: { _id: string; title: string }[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
  translations: {
    search: string;
    searchLabel: string;
    filters: string;
    allCategories: string;
    sort: string;
    relevance: string;
    newest: string;
    oldest: string;
    titleAsc: string;
    titleDesc: string;
    clear: string;
  };
}

export function BlogFilters({
  categories,
  currentCategory = "all",
  currentSort = "date-desc",
  currentSearch = "",
  translations,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => setSearchTerm(currentSearch), [currentSearch]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.key === "/" &&
        target?.tagName !== "INPUT" &&
        target?.tagName !== "TEXTAREA" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [name, value] of Object.entries(updates)) {
        if (
          !value ||
          value === "all" ||
          (name === "sort" && value === "date-desc")
        ) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      }

      params.delete("page");
      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      const nextSort =
        term && !searchParams.has("sort") ? "relevance" : undefined;
      router.replace(
        createQueryString({ q: term, ...(nextSort ? { sort: nextSort } : {}) }),
        { scroll: false },
      );
    });
  }, 350);

  const setCategory = (value: string) => {
    startTransition(() => {
      router.push(createQueryString({ category: value }), { scroll: false });
    });
  };

  const clearSearch = () => {
    handleSearch.cancel();
    setSearchTerm("");
    startTransition(() => {
      router.replace(createQueryString({ q: undefined, sort: "date-desc" }), {
        scroll: false,
      });
    });
    searchInputRef.current?.focus();
  };

  const resetFilters = () => {
    handleSearch.cancel();
    setSearchTerm("");
    startTransition(() => router.push(pathname, { scroll: false }));
  };

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentCategory !== "all" ||
    currentSort !== "date-desc";

  return (
    <section
      aria-label={translations.filters}
      className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-4 sm:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative min-w-0">
          <label htmlFor="blog-search" className="sr-only">
            {translations.searchLabel}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-(--q-text-2)" />
          <Input
            ref={searchInputRef}
            id="blog-search"
            type="search"
            placeholder={translations.search}
            className="h-11 rounded-lg bg-(--q-bg-0) pr-20 pl-10"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              handleSearch(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && searchTerm) clearSearch();
            }}
          />
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
            {isPending && (
              <LoaderCircle className="size-4 animate-spin text-(--q-accent)" />
            )}
            {searchTerm ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={translations.clear}
                className="rounded-md p-1 text-(--q-text-2) hover:bg-(--q-bg-2) hover:text-(--q-text-0)"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="hidden rounded border border-(--q-border) bg-(--q-bg-1) px-1.5 py-0.5 font-mono text-[10px] text-(--q-text-2) sm:block">
                /
              </kbd>
            )}
          </div>
        </div>

        <Select
          value={currentSort}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(createQueryString({ sort: value }), {
                scroll: false,
              });
            });
          }}
        >
          <SelectTrigger
            aria-label={translations.sort}
            className="h-11 w-full rounded-lg bg-(--q-bg-0) px-3"
          >
            <span className="flex min-w-0 items-center gap-2">
              <SlidersHorizontal className="size-4 shrink-0 text-(--q-text-2)" />
              <SelectValue placeholder={translations.sort} />
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            {currentSearch && (
              <SelectItem value="relevance">
                {translations.relevance}
              </SelectItem>
            )}
            <SelectItem value="date-desc">{translations.newest}</SelectItem>
            <SelectItem value="date-asc">{translations.oldest}</SelectItem>
            <SelectItem value="title-asc">{translations.titleAsc}</SelectItem>
            <SelectItem value="title-desc">{translations.titleDesc}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-(--q-border) pt-4">
        <fieldset className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <legend className="sr-only">{translations.filters}</legend>
          <button
            type="button"
            aria-pressed={currentCategory === "all"}
            onClick={() => setCategory("all")}
            className="shrink-0 rounded-md border border-(--q-border) px-3 py-1.5 text-sm font-medium transition-colors aria-pressed:border-(--q-accent)/50 aria-pressed:bg-(--q-accent-soft) aria-pressed:text-(--q-accent-strong) hover:bg-(--q-bg-2)"
          >
            {translations.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              aria-pressed={currentCategory === category.title}
              onClick={() => setCategory(category.title)}
              className="shrink-0 rounded-md border border-(--q-border) px-3 py-1.5 text-sm font-medium transition-colors aria-pressed:border-(--q-accent)/50 aria-pressed:bg-(--q-accent-soft) aria-pressed:text-(--q-accent-strong) hover:bg-(--q-bg-2)"
            >
              {category.title}
            </button>
          ))}
        </fieldset>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="hidden shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-(--q-text-2) hover:bg-(--q-bg-2) hover:text-(--q-text-0) sm:inline-flex"
          >
            <X className="size-3.5" />
            {translations.clear}
          </button>
        )}
      </div>
    </section>
  );
}
