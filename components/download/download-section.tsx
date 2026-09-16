"use client";

import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/icons/os-icons";
import { useDownload } from "@/contexts/DownloadProvider";
import { getIntlLocale } from "@/lib/locale";

type Platform = "mac" | "windows" | "linux";
const platforms = [
  { id: "mac", label: "macOS", icon: AppleIcon },
  { id: "windows", label: "Windows", icon: WindowsIcon },
  { id: "linux", label: "Linux", icon: LinuxIcon },
] as const;

export function DownloadSection() {
  const { t, i18n } = useTranslation();
  const { os, release, loading, error, retry, getDownloadLink } = useDownload();
  const [selection, setSelection] = useState<Platform | null>(null);
  const selected = selection ?? os;
  const date = release?.pub_date ? new Date(release.pub_date) : null;
  const options =
    selected === "mac"
      ? [
          {
            label: t("download.apple_silicon"),
            detail: "ARM64",
            url: release?.platforms["darwin-aarch64"]?.url,
          },
          {
            label: t("download.intel_mac"),
            detail: "x86_64",
            url: release?.platforms["darwin-x86_64"]?.url,
          },
        ]
      : selected === "windows"
        ? [
            {
              label: t("download.microsoft_store"),
              detail: "Windows",
              url: getDownloadLink("windows"),
            },
          ]
        : selected === "linux"
          ? [
              {
                label: t("download.linux_appimage"),
                detail: "x86_64",
                url: release?.platforms["linux-x86_64-appimage"]?.url,
              },
              {
                label: t("download.linux_deb"),
                detail: "x86_64",
                url: release?.platforms["linux-x86_64-deb"]?.url,
              },
              {
                label: t("download.linux_rpm"),
                detail: "x86_64",
                url: release?.platforms["linux-x86_64-rpm"]?.url,
              },
              {
                label: t("download.linux_aur"),
                detail: "AUR",
                url: "https://aur.archlinux.org/packages/qoredb-bin",
              },
            ]
          : [];

  return (
    <section className="q-container pt-32 pb-16 lg:pt-44 lg:pb-24">
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <p className="font-mono text-xs text-(--q-accent)">
            QoreDB / Desktop
          </p>
          <h1 className="mt-6 font-heading text-5xl leading-[1.05] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {t("download.title")}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-(--q-text-1)">
            {t("download.subtitle")}
          </p>
          <p className="mt-8 border-t border-(--q-border) pt-5 text-sm text-(--q-text-1)">
            {t("download.install_note")}
          </p>
        </div>

        <div className="self-start rounded-lg border border-(--q-border) bg-(--q-bg-1) p-5 sm:p-8">
          <fieldset>
            <legend className="mb-5 text-sm font-medium">
              {t("download.select_platform")}
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border px-2 py-4 text-sm transition-colors ${selected === id ? "border-(--q-accent) bg-(--q-bg-0) text-(--q-accent)" : "border-(--q-border) hover:bg-(--q-bg-0)"}`}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={id}
                    checked={selected === id}
                    onChange={() => setSelection(id)}
                    className="peer sr-only"
                  />
                  <span className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-(--q-accent)" />
                  <Icon className="size-6" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {selected === "mac" && (
            <p className="mt-5 text-sm leading-relaxed text-(--q-text-1)">
              {t("download.mac_arch_hint")}
            </p>
          )}
          {selected === "unknown" && (
            <p className="mt-5 text-sm text-(--q-text-1)">
              {t("download.unknown_platform")}
            </p>
          )}
          <div className="mt-6 space-y-2">
            {options.map((option) =>
              option.url ? (
                <a
                  key={option.label}
                  href={option.url}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-md bg-(--q-action) px-4 py-3 text-sm font-medium text-(--q-on-action) transition-colors hover:bg-(--q-action-hover)"
                >
                  <span>
                    {option.label}
                    <span className="ml-2 font-mono text-xs">
                      {option.detail}
                    </span>
                  </span>
                  <ArrowDownToLine
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  />
                </a>
              ) : (
                <div
                  key={option.label}
                  className="flex min-h-14 flex-wrap items-center justify-between gap-2 rounded-md border border-(--q-border) px-4 py-3 text-sm text-(--q-text-1)"
                >
                  <span>
                    {option.label}{" "}
                    <span className="font-mono text-xs">{option.detail}</span>
                  </span>
                  <span className="text-xs">
                    {loading
                      ? t("download.loading")
                      : t("download.unavailable")}
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="mt-6 border-t border-(--q-border) pt-5 text-sm text-(--q-text-1)">
            {loading && <p role="status">{t("download.loading")}</p>}
            {error && (
              <div role="alert">
                <p>{t("download.error")}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 min-h-11 text-(--q-accent) underline underline-offset-4"
                >
                  {t("download.retry")}
                </button>
              </div>
            )}
            {!loading && !error && release && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono">v{release.version}</span>
                {date && !Number.isNaN(date.getTime()) && (
                  <time dateTime={release.pub_date}>
                    {date.toLocaleDateString(getIntlLocale(i18n.language), {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </p>
            )}
            <a
              href="https://github.com/QoreDB/QoreDB/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 underline underline-offset-4 hover:text-(--q-text-0)"
            >
              {t("download.view_all_releases")}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
