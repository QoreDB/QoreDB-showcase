"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { DocsTreeNode } from "@/lib/docs/types";
import { cn } from "@/lib/utils";
import { PremiumBadge } from "./PremiumBadge";

function NodeLink({
  node,
  locale,
  pathname,
  depth,
}: {
  node: DocsTreeNode;
  locale: string;
  pathname: string;
  depth: number;
}) {
  if (node.kind === "page") {
    const active = pathname === node.href;
    return (
      <Link
        href={node.href}
        prefetch={false}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
          active
            ? "bg-(--q-accent-soft) font-medium text-(--q-accent-strong)"
            : "text-(--q-text-1) hover:bg-(--q-bg-1) hover:text-(--q-text-0)",
        )}
      >
        <span className="min-w-0">{node.label}</span>
        {node.premium ? <PremiumBadge className="ml-2 shrink-0" /> : null}
      </Link>
    );
  }

  return (
    <div className="mt-4 first:mt-0">
      <p
        className={cn(
          "px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-(--q-text-2)",
          depth > 0 && "mt-2",
        )}
      >
        {node.label}
      </p>
      <ul className="space-y-0.5">
        {node.children.map((child) => (
          <li key={child.slug.join("/")}>
            <NodeLink
              node={child}
              locale={locale}
              pathname={pathname}
              depth={depth + 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DocsSidebar({
  tree,
  locale,
}: {
  tree: DocsTreeNode[];
  locale: string;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const links = tree.map((node) => (
    <NodeLink
      key={node.slug.join("/") || "root"}
      node={node}
      locale={locale}
      pathname={pathname}
      depth={0}
    />
  ));

  return (
    <>
      <details
        ref={detailsRef}
        className="q-docs-mobile-nav lg:hidden"
        onKeyDown={(event) => {
          if (event.key === "Escape" && detailsRef.current?.open) {
            detailsRef.current.open = false;
            detailsRef.current.querySelector("summary")?.focus();
          }
        }}
      >
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 py-3 text-sm font-medium">
          {t("docs.navigation_label")}
          <ChevronDown className="size-4" aria-hidden="true" />
        </summary>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Delegated link activation includes native keyboard clicks. */}
        <nav
          aria-label={t("docs.navigation_label")}
          data-pagefind-ignore
          className="max-h-[60vh] overflow-y-auto border-t border-(--q-border) py-4"
          onClick={(event) => {
            if (
              (event.target as HTMLElement).closest("a") &&
              detailsRef.current
            )
              detailsRef.current.open = false;
          }}
        >
          {links}
        </nav>
      </details>
      <nav
        aria-label={t("docs.navigation_label")}
        data-pagefind-ignore
        className="hidden max-h-[calc(100dvh-13rem)] overflow-y-auto pr-4 lg:block"
      >
        {links}
      </nav>
    </>
  );
}
