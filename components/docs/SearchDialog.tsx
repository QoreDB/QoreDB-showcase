"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    pagefind?: {
      search: (query: string) => Promise<{
        results: Array<{
          id: string;
          data: () => Promise<{
            url: string;
            meta: Record<string, string>;
            excerpt: string;
          }>;
        }>;
      }>;
    };
  }
}

type Result = {
  id: string;
  url: string;
  title: string;
  excerpt: string;
};

export function SearchDialog({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    if (window.pagefind) return;
    const url = `/pagefind/pagefind.js`;
    import(/* webpackIgnore: true */ url)
      .then((mod) => {
        window.pagefind = mod;
      })
      .catch(() => {
        window.pagefind = undefined;
      });
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        if (!window.pagefind) {
          setResults([]);
          return;
        }
        const search = await window.pagefind.search(query);
        const sliced = search.results.slice(0, 10);
        const data = await Promise.all(sliced.map((r) => r.data()));
        if (cancelled) return;
        const filtered = data
          .filter((d) => d.url.includes(`/${locale}/docs`))
          .map<Result>((d) => ({
            id: d.url,
            url: d.url,
            title: d.meta.title ?? d.url,
            excerpt: d.excerpt,
          }));
        setResults(filtered);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, locale]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-(--q-border) bg-(--q-bg-1) px-3 py-1.5 text-sm text-(--q-text-2) hover:bg-(--q-bg-2) hover:text-(--q-text-1) transition-colors w-full max-w-xs"
        aria-label={t("docs.search_label")}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">{t("docs.search_placeholder")}</span>
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-(--q-border) bg-(--q-bg-0) px-1.5 font-mono text-[10px] text-(--q-text-2)">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-24 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-(--q-border) bg-(--q-bg-0) shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-(--q-border) p-3">
              <Search className="size-4 shrink-0 text-(--q-text-2)" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("docs.search_placeholder")}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-(--q-text-2)"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-(--q-text-2) hover:bg-(--q-bg-1) hover:text-(--q-text-0)"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 text-sm">
              {loading ? (
                <p className="px-3 py-4 text-(--q-text-2)">…</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-4 text-(--q-text-2)">
                  {query.trim()
                    ? `No results for "${query}"`
                    : t("docs.search_placeholder")}
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <a
                        href={r.url}
                        className="block rounded-md px-3 py-2 hover:bg-(--q-bg-1)"
                        onClick={() => setOpen(false)}
                      >
                        <p className="font-medium text-(--q-text-0)">
                          {r.title}
                        </p>
                        <p
                          className="mt-1 line-clamp-2 text-xs text-(--q-text-2) [&>mark]:bg-(--q-accent-soft) [&>mark]:text-(--q-accent-strong)"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind highlights via <mark>
                          dangerouslySetInnerHTML={{ __html: r.excerpt }}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
