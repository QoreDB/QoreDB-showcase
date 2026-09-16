"use client";

import {
  Activity,
  ArrowRight,
  type LucideIcon,
  Palette,
  Plug,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type {
  PluginCategory,
  RegistryPlugin,
} from "@/lib/marketplace/registry";

interface PluginCardProps {
  plugin: RegistryPlugin;
  locale: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const CATEGORY_ICONS: Record<PluginCategory, LucideIcon> = {
  safety: Shield,
  observability: Activity,
  productivity: Zap,
  theming: Palette,
  integrations: Plug,
};

export function PluginCard({ plugin, locale, t }: PluginCardProps) {
  const Icon = plugin.category ? CATEGORY_ICONS[plugin.category] : Puzzle;

  return (
    <Link
      href={`/${locale}/plugins/${plugin.id}`}
      prefetch={false}
      className="group flex min-w-0 flex-col gap-4 border-b border-(--q-border) py-8 transition-colors hover:border-(--q-accent)"
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex size-8 items-center text-(--q-accent)">
          <Icon className="size-5" />
        </div>
        {plugin.category ? (
          <span className="rounded-sm bg-(--q-bg-2) px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-(--q-text-2)">
            {t(`marketplace.categories.${plugin.category}`)}
          </span>
        ) : null}
      </div>

      <div className="relative min-w-0">
        <h2 className="font-heading text-xl font-semibold text-(--q-text-0)">
          {plugin.name}
        </h2>
        <p className="break-words font-mono text-xs text-(--q-text-2)">
          {plugin.id}
        </p>
      </div>

      {plugin.description ? (
        <p className="relative line-clamp-3 text-sm leading-relaxed text-(--q-text-2)">
          {plugin.description}
        </p>
      ) : null}

      <div className="relative mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-(--q-text-2)">
        <span className="font-mono">
          {t("marketplace.card.version", { version: plugin.latestVersion })}
        </span>
        <span className="inline-flex items-center gap-1 text-(--q-accent) ">
          {t("marketplace.card.view_details")}
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
