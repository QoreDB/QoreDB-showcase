"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DocHeading } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto text-sm"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-(--q-text-2)">
        {t("docs.on_this_page")}
      </p>
      <ul className="space-y-1.5 border-l border-(--q-border)">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: `${(h.depth - 2) * 12 + 12}px` }}
          >
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l py-0.5 pl-3 text-[13px] leading-snug transition-colors",
                active === h.id
                  ? "border-(--q-accent) text-(--q-text-0)"
                  : "border-transparent text-(--q-text-2) hover:text-(--q-text-0)",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
