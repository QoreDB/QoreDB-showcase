"use client";

import { Trans, useTranslation } from "react-i18next";
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

function plural(
  t: ReturnType<typeof useTranslation>["t"],
  key: string,
  count: number,
) {
  if (count === 0) return null;
  const k =
    count === 1
      ? `marketplace.detail.${key}`
      : `marketplace.detail.${key}_plural`;
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
    <div className="space-y-6">
      {/* Identity card */}
      <Card>
        <div className="grid gap-5 sm:grid-cols-2">
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
        </div>
      </Card>

      {runtime ? (
        <Card>
          <SectionLabel>{t("marketplace.detail.manifest_hooks")}</SectionLabel>
          {runtime.hooks.length === 0 ? (
            <p className="mt-2 text-sm text-(--q-text-2)">
              {t("marketplace.detail.manifest_no_hooks")}
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {runtime.hooks.map((hook) => (
                <Chip key={hook} variant="accent">
                  {hook}
                </Chip>
              ))}
            </div>
          )}

          <SectionLabel className="mt-6">
            {t("marketplace.detail.manifest_capabilities")}
          </SectionLabel>
          {runtime.capabilities.length === 0 ? (
            <p className="mt-2 text-sm text-(--q-text-2)">
              {t("marketplace.detail.manifest_no_capabilities")}
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {runtime.capabilities.map((cap) => (
                <Chip key={cap}>{cap}</Chip>
              ))}
            </div>
          )}

          <SectionLabel className="mt-6">
            {t("marketplace.detail.manifest_integrity")}
          </SectionLabel>
          <p className="mt-2 break-all font-mono text-xs text-(--q-text-1)">
            {runtime.integrity ??
              t("marketplace.detail.manifest_no_integrity")}
          </p>
        </Card>
      ) : null}

      <Card>
        <SectionLabel>
          {t("marketplace.detail.manifest_contributes")}
        </SectionLabel>
        {contributionSummaries.length === 0 &&
        contributes.commands.length === 0 ? (
          <p className="mt-2 text-sm text-(--q-text-2)">
            {t("marketplace.detail.contributes_none")}
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5 text-sm text-(--q-text-1)">
            {contributionSummaries.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-(--q-accent)">•</span>
                <span>{s}</span>
              </li>
            ))}
            {contributes.commands.length > 0 ? (
              <li className="flex gap-2">
                <span className="text-(--q-accent)">•</span>
                <span>
                  <Trans
                    i18nKey="marketplace.detail.contributes_commands"
                    values={{ commands: contributes.commands.join(", ") }}
                  />
                </span>
              </li>
            ) : null}
          </ul>
        )}
      </Card>

      {plugin.versions.length > 1 ? (
        <Card>
          <SectionLabel>
            {t("marketplace.detail.versions_heading")}
          </SectionLabel>
          <ul className="mt-3 divide-y divide-(--q-border)/60">
            {[...plugin.versions].reverse().map((v) => (
              <li
                key={v.version}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="font-mono text-(--q-text-0)">
                  {t("marketplace.detail.version_label", {
                    version: v.version,
                  })}
                </span>
                <span className="text-xs text-(--q-text-2)">
                  {t("marketplace.detail.version_size", {
                    size: formatSize(v.archive.sizeBytes),
                  })}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6">
      <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-(--q-accent)/5 blur-2xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-widest text-(--q-text-3)">
        {label}
      </p>
      <p className="mt-1 text-sm text-(--q-text-0)">{value}</p>
    </div>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-medium uppercase tracking-widest text-(--q-text-3) ${className}`}
    >
      {children}
    </p>
  );
}

function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent";
}) {
  const styles =
    variant === "accent"
      ? "bg-(--q-accent)/10 text-(--q-accent) ring-1 ring-(--q-accent)/20"
      : "bg-(--q-bg-2) text-(--q-text-1) ring-1 ring-(--q-border)";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] ${styles}`}
    >
      {children}
    </span>
  );
}
