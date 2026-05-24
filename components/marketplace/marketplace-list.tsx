"use client";

import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PluginCard } from "@/components/marketplace/plugin-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  PluginKind,
  RegistryPlugin,
} from "@/lib/marketplace/registry";

interface MarketplaceListProps {
  plugins: RegistryPlugin[];
  locale: string;
}

type KindFilter = "all" | PluginKind;

export function MarketplaceList({ plugins, locale }: MarketplaceListProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plugins.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (!q) return true;
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.author?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [plugins, query, kind]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--q-text-3)"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("marketplace.search_placeholder")}
            className="pl-9"
            aria-label={t("marketplace.search_placeholder")}
          />
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Filter size={14} className="text-(--q-text-3)" />
          {(["all", "declarative", "executable"] as KindFilter[]).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={kind === k ? "default" : "outline"}
              onClick={() => setKind(k)}
            >
              {t(`marketplace.filter_${k}`)}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--q-border) bg-(--q-bg-1) py-12 text-center text-sm text-(--q-text-2)">
          {t("marketplace.empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
