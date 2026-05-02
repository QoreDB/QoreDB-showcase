"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
        className={cn(
          "group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
          active
            ? "bg-(--q-accent-soft) font-medium text-(--q-accent-strong)"
            : "text-(--q-text-1) hover:bg-(--q-bg-1) hover:text-(--q-text-0)",
        )}
      >
        <span className="truncate">{node.label}</span>
        {node.premium ? (
          <PremiumBadge className="ml-2 shrink-0" />
        ) : null}
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

  return (
    <nav
      aria-label="Docs navigation"
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 text-sm"
    >
      {tree.map((node) => (
        <NodeLink
          key={node.slug.join("/") || "root"}
          node={node}
          locale={locale}
          pathname={pathname}
          depth={0}
        />
      ))}
    </nav>
  );
}
