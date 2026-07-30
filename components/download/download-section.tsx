"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppleIcon, LinuxIcon, WindowsIcon } from "@/components/icons/os-icons";
import { useDownload } from "@/contexts/DownloadProvider";
import { getIntlLocale } from "@/lib/locale";
import { Button } from "../ui/button";

export function DownloadSection() {
  const { t, i18n } = useTranslation();
  const { os, arch, release, loading, getDownloadLink, getOsDisplayName } =
    useDownload();
  const [showOtherPlatforms, setShowOtherPlatforms] = useState(false);

  const openDownloadLink = (url?: string) => {
    if (url) {
      window.location.href = url;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      getIntlLocale(i18n.language),
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const getOsIcon = (targetOs: string, className: string = "w-8 h-8") => {
    switch (targetOs) {
      case "mac":
        return <AppleIcon className={className} />;
      case "windows":
        return <WindowsIcon className={className} />;
      case "linux":
        return <LinuxIcon className={className} />;
      default:
        return <Download className={className} />;
    }
  };

  const mainLink = getDownloadLink(os);
  const allPlatforms = ["mac", "windows", "linux"] as const;
  const otherPlatforms = allPlatforms.filter((p) => p !== os);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Download options for each platform
  const getPlatformOptions = (platform: string) => {
    if (platform === "windows") {
      return [
        {
          label: t("download.microsoft_store", "Microsoft Store"),
          url: getDownloadLink("windows") ?? undefined,
          recommended: true,
        },
      ];
    }

    if (!release) return [];

    switch (platform) {
      case "mac":
        return [
          {
            label: t("download.apple_silicon", "Apple Silicon (M1/M2/M3/M4)"),
            url: release.platforms["darwin-aarch64"]?.url,
            recommended: arch === "arm64",
          },
          {
            label: t("download.intel_mac", "Intel Mac"),
            url: release.platforms["darwin-x86_64"]?.url,
            recommended: arch === "x86_64",
          },
        ];
      case "linux":
        return [
          {
            label: t("download.linux_appimage", "AppImage (Universal)"),
            url: release.platforms["linux-x86_64-appimage"]?.url,
            recommended: true,
          },
          {
            label: t("download.linux_deb", "Debian / Ubuntu (.deb)"),
            url: release.platforms["linux-x86_64-deb"]?.url,
            recommended: false,
          },
          {
            label: t("download.linux_rpm", "Fedora / RHEL (.rpm)"),
            url: release.platforms["linux-x86_64-rpm"]?.url,
            recommended: false,
          },
          {
            label: t("download.linux_aur", "Arch Linux (AUR)"),
            url: "https://aur.archlinux.org/packages/qoredb-bin",
            recommended: false,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          {/* Header */}
          <motion.div variants={item} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("download.title", "Download QoreDB")}
            </h1>
            <p className="text-xl text-(--q-text-2) max-w-2xl mx-auto">
              {t(
                "download.subtitle",
                "Get the latest version of QoreDB for your operating system.",
              )}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : release ? (
            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Detected Platform - Primary Card */}
              <div className="relative p-8 rounded-3xl border-2 border-primary/20 bg-linear-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {t(
                      "download.detected_platform",
                      "We detected you're on {{platform}}",
                    ).replace("{{platform}}", getOsDisplayName(os))}
                  </div>

                  {/* OS Icon & Info */}
                  <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/10">
                      {getOsIcon(os, "w-16 h-16 text-primary")}
                    </div>
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">
                        {getOsDisplayName(os)}
                      </h2>
                      <p className="text-(--q-text-2)">
                        Version {release.version} •{" "}
                        {formatDate(release.pub_date)}
                      </p>
                    </div>
                  </div>

                  {/* Main Download Button */}
                  {mainLink && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size="lg"
                        className="w-full max-w-md h-14 text-lg gap-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                        onClick={() => openDownloadLink(mainLink)}
                      >
                        <Download className="w-5 h-5" />
                        {t("download.download_now", "Download Now")}
                      </Button>
                    </motion.div>
                  )}

                  {/* Platform-specific options */}
                  {os !== "unknown" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {getPlatformOptions(os).map((option) => (
                        <Button
                          key={`${os}-${option.label}`}
                          variant="outline"
                          size="sm"
                          className={`gap-2 ${option.recommended ? "border-primary/30 bg-primary/5" : ""}`}
                          onClick={() => openDownloadLink(option.url)}
                          disabled={!option.url}
                        >
                          {option.label}
                          {option.recommended && (
                            <span className="text-[10px] uppercase font-bold text-primary">
                              {t("download.recommended", "Recommended")}
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Other Platforms - Collapsible */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOtherPlatforms(!showOtherPlatforms)}
                  className="group flex items-center justify-center gap-2 w-full py-4 text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
                >
                  <span className="text-sm font-medium">
                    {t("download.other_platforms", "Other platforms")}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showOtherPlatforms ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showOtherPlatforms && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {otherPlatforms.map((platform) => (
                          <div
                            key={platform}
                            className="p-5 rounded-xl border bg-card/30 hover:bg-card/50 transition-all text-left space-y-4"
                          >
                            <div className="flex items-center gap-3">
                              {getOsIcon(platform, "w-5 h-5")}
                              <h3 className="font-semibold">
                                {getOsDisplayName(platform)}
                              </h3>
                            </div>
                            <div className="space-y-2">
                              {getPlatformOptions(platform).map((option) => (
                                <Button
                                  key={`${platform}-${option.label}`}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start gap-2 h-9 text-sm"
                                  onClick={() => openDownloadLink(option.url)}
                                  disabled={!option.url}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* GitHub Link */}
              <motion.div variants={item} className="pt-4">
                <a
                  href="https://github.com/QoreDB/QoreDB/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t(
                    "download.view_all_releases",
                    "View all releases on GitHub",
                  )}
                </a>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center text-(--q-text-2)">
              {t("download.error", "Unable to load version information.")}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
