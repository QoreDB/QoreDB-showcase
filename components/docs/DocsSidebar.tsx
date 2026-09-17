"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
          "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
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

  // Long groups (33 connectors) stay folded until one of their pages is open.
  const open = node.children.length <= 5 || containsPath(node, pathname);
  return (
    <details className="q-docs-group group/section mt-1 first:mt-0" open={open}>
      <summary
        className={cn(
          "flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 rounded-md px-3 py-2 text-[13px] font-semibold text-(--q-text-0) hover:bg-(--q-bg-1) [&::-webkit-details-marker]:hidden",
          depth > 0 && "font-medium",
        )}
      >
        {node.label}
        <ChevronDown
          className="size-3.5 shrink-0 text-(--q-text-2) transition-transform group-open/section:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="mb-2 ml-3 space-y-0.5 border-l border-(--q-border) pl-2">
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
    </details>
  );
}

function containsPath(node: DocsTreeNode, pathname: string): boolean {
  return node.kind === "page"
    ? node.href === pathname
    : node.children.some((child) => containsPath(child, pathname));
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
  const navRef = useRef<HTMLElement>(null);
  // Bring the current page into view inside the sidebar, without moving the page itself.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on navigation.
  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !current) return;
    const offset =
      current.getBoundingClientRect().top - nav.getBoundingClientRect().top;
    if (offset < 0 || offset > nav.clientHeight - 48)
      nav.scrollTop += offset - nav.clientHeight / 2;
  }, [pathname]);
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
        ref={navRef}
        aria-label={t("docs.navigation_label")}
        data-pagefind-ignore
        className="hidden max-h-[calc(100dvh-13rem)] overflow-y-auto pr-4 lg:block"
      >
        {links}
      </nav>
    </>
  );
}
