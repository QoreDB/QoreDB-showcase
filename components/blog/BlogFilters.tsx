"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";

interface BlogFiltersProps {
  categories: { _id: string; title: string }[];
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
  translations: {
    search: string;
    category: string;
    allCategories: string;
    sort: string;
    newest: string;
    oldest: string;
    titleAsc: string;
    titleDesc: string;
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
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "date-desc") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page when filters change
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString("q", term)}`);
    });
  }, 400);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-(--q-bg-1) p-4 rounded-xl border border-(--q-border) mb-8">
      <div className="relative flex-1 max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-(--q-text-2)">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder={translations.search}
          className="pl-10 bg-(--q-bg-0)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-4 items-center">
        <Select
          value={currentCategory}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(`${pathname}?${createQueryString("category", value)}`);
            });
          }}
        >
          <SelectTrigger className="w-[180px] bg-(--q-bg-0)">
            <SelectValue placeholder={translations.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translations.allCategories}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.title}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSort}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(`${pathname}?${createQueryString("sort", value)}`);
            });
          }}
        >
          <SelectTrigger className="w-[180px] bg-(--q-bg-0)">
            <SelectValue placeholder={translations.sort} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">{translations.newest}</SelectItem>
            <SelectItem value="date-asc">{translations.oldest}</SelectItem>
            <SelectItem value="title-asc">{translations.titleAsc}</SelectItem>
            <SelectItem value="title-desc">{translations.titleDesc}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
