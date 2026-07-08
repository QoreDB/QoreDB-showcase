"use client";

import { motion } from "framer-motion";
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
  index?: number;
}

const CATEGORY_ICONS: Record<PluginCategory, LucideIcon> = {
  safety: Shield,
  observability: Activity,
  productivity: Zap,
  theming: Palette,
  integrations: Plug,
};

export function PluginCard({ plugin, locale, t, index = 0 }: PluginCardProps) {
  const latest = plugin.versions.find(
    (v) => v.version === plugin.latestVersion,
  );
  const Icon = plugin.category
    ? CATEGORY_ICONS[plugin.category]
    : Puzzle;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
    >
      <Link
        href={`/${locale}/plugins/${plugin.id}`}
        prefetch={false}
        className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6 transition-colors duration-300 hover:border-(--q-accent)/30 hover:shadow-lg"
      >
        {/* Subtle accent glow on hover, same grammar as features-section */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-(--q-accent)/0 blur-2xl transition-all duration-500 group-hover:bg-(--q-accent)/10" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--q-accent)/10 transition-colors duration-300 group-hover:bg-(--q-accent)">
            <Icon className="h-5 w-5 text-(--q-accent) transition-colors duration-300 group-hover:text-white" />
          </div>
          {plugin.category ? (
            <span className="rounded-full bg-(--q-bg-2) px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-(--q-text-2)">
              {t(`marketplace.categories.${plugin.category}`)}
            </span>
          ) : null}
        </div>

        <div className="relative min-w-0">
          <h3 className="font-heading truncate text-base font-semibold text-(--q-text-0)">
            {plugin.name}
          </h3>
          <p className="truncate font-mono text-xs text-(--q-text-2)">
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
          <span className="inline-flex items-center gap-1 text-(--q-accent) opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {t("marketplace.card.view_details")}
            <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
