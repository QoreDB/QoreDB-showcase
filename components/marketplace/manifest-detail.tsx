"use client";

import { Trans, useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type {
  RegistryPlugin,
  RegistryVersion,
} from "@/lib/marketplace/registry";

interface ManifestDetailProps {
  plugin: RegistryPlugin;
  version: RegistryVersion;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function plural(t: ReturnType<typeof useTranslation>["t"], key: string, count: number) {
  if (count === 0) return null;
  const k = count === 1 ? `marketplace.detail.${key}` : `marketplace.detail.${key}_plural`;
  return t(k, { count });
}

export function ManifestDetail({ plugin, version }: ManifestDetailProps) {
  const { t } = useTranslation();
  const kindLabel = t(`marketplace.kind.${version.kind}`);
  const runtime = version.runtime;
  const contributes = version.contributes;

  const contributionSummaries = [
    plural(t, "contributes_snippets", contributes.snippets),
    plural(t, "contributes_templates", contributes.connectionTemplates),
    plural(t, "contributes_themes", contributes.themes),
    plural(t, "contributes_viewers", contributes.resultViewers),
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <section className="grid gap-3 rounded-xl border border-(--q-border) bg-(--q-bg-1) p-6 sm:grid-cols-2">
        <Field
          label={t("marketplace.detail.manifest_id")}
          value={<span className="font-mono">{plugin.id}</span>}
        />
        <Field
          label={t("marketplace.detail.manifest_version")}
          value={<span className="font-mono">{version.version}</span>}
        />
        <Field
          label={t("marketplace.detail.manifest_qoredb")}
          value={<span className="font-mono">{version.qoredb ?? "—"}</span>}
        />
        <Field
          label={t("marketplace.detail.manifest_author")}
          value={plugin.author ?? "—"}
        />
        <Field
          label={t("marketplace.detail.manifest_kind")}
          value={kindLabel}
        />
        <Field
          label={t("marketplace.detail.manifest_archive_sha")}
          value={
            <span className="break-all font-mono text-xs">
              {version.archive.sha256}
            </span>
          }
        />
      </section>

      {runtime ? (
        <section className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-(--q-text-2)">
            {t("marketplace.detail.manifest_hooks")}
          </h3>
          {runtime.hooks.length === 0 ? (
            <p className="text-sm text-(--q-text-2)">
              {t("marketplace.detail.manifest_no_hooks")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {runtime.hooks.map((hook) => (
                <Badge key={hook} className="font-mono">
                  {hook}
                </Badge>
              ))}
            </div>
          )}

          <h3 className="pt-3 text-sm font-medium uppercase tracking-wide text-(--q-text-2)">
            {t("marketplace.detail.manifest_capabilities")}
          </h3>
          {runtime.capabilities.length === 0 ? (
            <p className="text-sm text-(--q-text-2)">
              {t("marketplace.detail.manifest_no_capabilities")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {runtime.capabilities.map((cap) => (
                <Badge key={cap} variant="outline" className="font-mono">
                  {cap}
                </Badge>
              ))}
            </div>
          )}

          <h3 className="pt-3 text-sm font-medium uppercase tracking-wide text-(--q-text-2)">
            {t("marketplace.detail.manifest_integrity")}
          </h3>
          <p className="break-all font-mono text-xs text-(--q-text-1)">
            {runtime.integrity ?? t("marketplace.detail.manifest_no_integrity")}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-(--q-text-2)">
          {t("marketplace.detail.manifest_contributes")}
        </h3>
        {contributionSummaries.length === 0 && contributes.commands.length === 0 ? (
          <p className="text-sm text-(--q-text-2)">
            {t("marketplace.detail.contributes_none")}
          </p>
        ) : (
          <ul className="space-y-1 text-sm text-(--q-text-1)">
            {contributionSummaries.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
            {contributes.commands.length > 0 ? (
              <li>
                <Trans
                  i18nKey="marketplace.detail.contributes_commands"
                  values={{ commands: contributes.commands.join(", ") }}
                />
              </li>
            ) : null}
          </ul>
        )}
      </section>

      {plugin.versions.length > 1 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-(--q-text-2)">
            {t("marketplace.detail.versions_heading")}
          </h3>
          <ul className="divide-y divide-(--q-border) rounded-xl border border-(--q-border) bg-(--q-bg-1)">
            {[...plugin.versions].reverse().map((v) => (
              <li key={v.version} className="flex items-center justify-between p-3 text-sm">
                <span className="font-mono text-(--q-text-0)">
                  {t("marketplace.detail.version_label", { version: v.version })}
                </span>
                <span className="text-xs text-(--q-text-2)">
                  {t("marketplace.detail.version_size", {
                    size: formatSize(v.archive.sizeBytes),
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-(--q-text-3)">{label}</p>
      <p className="mt-1 text-sm text-(--q-text-0)">{value}</p>
    </div>
  );
}
