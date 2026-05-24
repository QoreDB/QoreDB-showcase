import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RegistryPlugin } from "@/lib/marketplace/registry";

interface PluginCardProps {
  plugin: RegistryPlugin;
  locale: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export function PluginCard({ plugin, locale, t }: PluginCardProps) {
  const latest = plugin.versions.find(
    (v) => v.version === plugin.latestVersion,
  );
  const kindLabel = t(`marketplace.kind.${plugin.kind}`);

  return (
    <Link
      href={`/${locale}/marketplace/${plugin.id}`}
      className="group flex h-full flex-col gap-3 rounded-xl border border-(--q-border) bg-(--q-bg-1) p-5 transition hover:border-(--q-accent) hover:bg-(--q-bg-2)"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-(--q-text-0)">
            {plugin.name}
          </h3>
          <p className="truncate text-xs text-(--q-text-2)">{plugin.id}</p>
        </div>
        <Badge variant={plugin.kind === "executable" ? "default" : "secondary"}>
          {kindLabel}
        </Badge>
      </div>

      {plugin.description ? (
        <p className="line-clamp-3 text-sm text-(--q-text-1)">
          {plugin.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-(--q-text-2)">
        <span>{t("marketplace.card.version", { version: plugin.latestVersion })}</span>
        {plugin.author ? (
          <span className="truncate">
            {t("marketplace.card.by", { author: plugin.author })}
          </span>
        ) : null}
      </div>

      {latest?.runtime ? (
        <div className="flex flex-wrap gap-1.5">
          {latest.runtime.hooks.map((hook) => (
            <Badge key={hook} variant="outline" className="font-mono text-[10px]">
              {hook}
            </Badge>
          ))}
          {latest.runtime.capabilities.map((cap) => (
            <Badge key={cap} variant="outline" className="font-mono text-[10px]">
              {cap}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
