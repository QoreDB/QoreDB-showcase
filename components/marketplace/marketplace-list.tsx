"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PluginCard } from "@/components/marketplace/plugin-card";
import { Input } from "@/components/ui/input";
import {
  PLUGIN_CATEGORIES,
  type PluginCategory,
  type RegistryPlugin,
} from "@/lib/marketplace/registry";

interface MarketplaceListProps {
  plugins: RegistryPlugin[];
  locale: string;
}

type CategoryFilter = "all" | PluginCategory;

export function MarketplaceList({ plugins, locale }: MarketplaceListProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plugins.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.author?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [plugins, query, category]);

  const filters: CategoryFilter[] = ["all", ...PLUGIN_CATEGORIES];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--q-text-3)"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("marketplace.search_placeholder")}
            className="h-10 pl-9 bg-(--q-bg-1)"
            aria-label={t("marketplace.search_placeholder")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((c) => {
            const isActive = category === c;
            const label =
              c === "all"
                ? t("marketplace.filter_all")
                : t(`marketplace.categories.${c}`);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-(--q-accent) text-white"
                    : "border border-(--q-border) bg-(--q-bg-1) text-(--q-text-1) hover:border-(--q-accent)/30 hover:text-(--q-text-0)"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--q-border) bg-(--q-bg-1) py-16 text-center text-sm text-(--q-text-2)">
          {t("marketplace.empty")}
        </div>
      ) : (
        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {filtered.map((plugin, i) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              locale={locale}
              t={t}
              index={i}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
