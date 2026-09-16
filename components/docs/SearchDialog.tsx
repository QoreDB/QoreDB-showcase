"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type SearchResult = {
  url: string;
  meta: Record<string, string>;
  excerpt: string;
};

type Pagefind = {
  init: () => Promise<void>;
  destroy: () => Promise<void>;
  mergeIndex: (path: string, options: { language: string }) => Promise<void>;
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<SearchResult> }>;
  }>;
};

type Result = { url: string; title: string; excerpt: string };
type SearchState = "idle" | "loading" | "ready" | "error";

export function SearchDialog({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [state, setState] = useState<SearchState>("idle");
  const [attempt, setAttempt] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const statusId = useId();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // showModal supplies inert background, focus containment and native Escape.
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
    dialog.showModal();
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  const engineRef = useRef<Promise<Pagefind> | null>(null);
  useEffect(() => {
    if (!open) return;
    let disposed = false;
    const url = attempt
      ? `/pagefind/pagefind.js?retry=${attempt}`
      : "/pagefind/pagefind.js";
    const pending = import(/* webpackIgnore: true */ url).then(
      async (module) => {
        const engine: Pagefind = module.createInstance();
        try {
          await engine.init();
          if (locale !== "en" && locale !== "fr") {
            // Explicit language merging is supported by Pagefind 1.5.2. Keep the
            // absolute bundle URL so the English index is distinct from the
            // worker’s relative primary path; no change to document language.
            // https://pagefind.app/docs/multisite/#merging-a-specific-language-index
            await engine.mergeIndex(
              new URL("/pagefind/", window.location.origin).href,
              { language: "en" },
            );
          }
          return engine;
        } catch (error) {
          await engine.destroy().catch(() => {});
          throw error;
        }
      },
    );
    engineRef.current = pending;
    // A failed import/init must be handled even before the first query.
    pending.catch(() => {
      if (!disposed) setState("error");
    });
    return () => {
      disposed = true;
      engineRef.current = null;
      void pending.then((engine) => engine.destroy()).catch(() => {});
    };
  }, [open, locale, attempt]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Retry reruns the same query against the replacement instance.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const normalizedQuery = query.trim();
    setResults([]);
    setState("loading");
    const timer = window.setTimeout(
      async () => {
        try {
          const engine = await engineRef.current;
          if (!engine || cancelled) return;
          if (!normalizedQuery) {
            setState("idle");
            return;
          }
          const search = await engine.search(normalizedQuery);
          const docsLocale = locale === "fr" ? "fr" : "en";
          const prefix = `/${docsLocale}/docs`;
          const matches: Result[] = [];
          // Pagefind indexes other routes too. Filter before limiting, and only
          // request another batch when the current one has too few docs matches.
          for (let offset = 0; offset < search.results.length; offset += 10) {
            if (cancelled) return;
            const batch = await Promise.all(
              search.results
                .slice(offset, offset + 10)
                .map((result) => result.data()),
            );
            for (const result of batch) {
              const url = new URL(result.url, window.location.origin);
              if (url.origin !== window.location.origin) continue;
              if (
                url.pathname !== prefix &&
                !url.pathname.startsWith(`${prefix}/`)
              )
                continue;
              matches.push({
                url: `/${locale}${url.pathname
                  .slice(docsLocale.length + 1)
                  .replace(/\.html$/, "")
                  .replace(/\/index$/, "")}${url.search}${url.hash}`,
                title: result.meta.title ?? result.url,
                excerpt: result.excerpt,
              });
              if (matches.length === 10) break;
            }
            if (matches.length === 10) break;
          }
          if (!cancelled) {
            setResults(matches);
            setState("ready");
          }
        } catch {
          if (!cancelled) setState("error");
        }
      },
      normalizedQuery ? 150 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, locale, open, attempt]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="q-docs-search-trigger"
        aria-label={t("docs.search_label")}
        aria-haspopup="dialog"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">{t("docs.search_placeholder")}</span>
        <kbd className="hidden sm:inline text-xs">⌘K</kbd>
      </button>
      <dialog
        ref={dialogRef}
        className="q-docs-search-dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
          if (event.key === "Tab") {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled]), input:not([disabled])",
            );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-(--q-border) px-5 py-3">
          <h2 id={titleId} className="text-base font-semibold">
            {t("docs.search_label")}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex size-11 items-center justify-center rounded-md hover:bg-(--q-bg-1)"
            aria-label={t("docs.search_close")}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-3 border-b border-(--q-border) px-5 py-4">
          <Search
            className="size-5 shrink-0 text-(--q-text-2)"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("docs.search_placeholder")}
            aria-label={t("docs.search_label")}
            aria-describedby={statusId}
            className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-(--q-text-2)"
          />
        </div>
        <div className="q-docs-search-results">
          <p
            id={statusId}
            role="status"
            aria-live="polite"
            className="px-5 py-4 text-sm text-(--q-text-2)"
          >
            {state === "loading"
              ? t("docs.search_loading")
              : state === "error"
                ? t("docs.search_error")
                : state === "idle"
                  ? t("docs.search_hint")
                  : results.length
                    ? t("docs.search_results", { count: results.length })
                    : t("docs.search_empty", { query: query.trim() })}
          </p>
          {state === "error" && (
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mx-5 mb-5 min-h-11 rounded-md border border-(--q-border) px-4 text-sm font-medium hover:bg-(--q-bg-1)"
            >
              {t("docs.search_retry")}
            </button>
          )}
          {state === "ready" && results.length > 0 && (
            <ul className="px-2 pb-2">
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    href={result.url}
                    className="block rounded-md px-3 py-4 hover:bg-(--q-bg-1)"
                    onClick={() => setOpen(false)}
                  >
                    <p className="font-medium text-(--q-text-0)">
                      {result.title}
                    </p>
                    <p
                      className="mt-1 line-clamp-2 text-sm leading-relaxed text-(--q-text-2) [&>mark]:bg-(--q-accent-soft) [&>mark]:text-(--q-accent-strong)"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Pagefind generates trusted local index excerpts with mark highlights.
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
