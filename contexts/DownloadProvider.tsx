"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type OS = "mac" | "windows" | "linux" | "unknown";
type Platform =
  | "windows-x86_64"
  | "windows-x86_64-msi"
  | "windows-x86_64-nsis"
  | "darwin-x86_64"
  | "darwin-x86_64-app"
  | "darwin-aarch64"
  | "darwin-aarch64-app"
  | "linux-x86_64"
  | "linux-x86_64-appimage"
  | "linux-x86_64-deb"
  | "linux-x86_64-rpm";

export interface LatestRelease {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Partial<Record<Platform, { signature: string; url: string }>>;
}

const MICROSOFT_STORE_URL = "https://apps.microsoft.com/detail/9NZLCGFWCHHG";

interface DownloadContextType {
  os: OS;
  release: LatestRelease | null;
  loading: boolean;
  error: boolean;
  retry: () => void;
  getDownloadLink: (targetOs: OS) => string | null;
}

const DownloadContext = createContext<DownloadContextType | undefined>(
  undefined,
);

function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  // Mobile browsers may identify as macOS or Linux but cannot run these desktop builds.
  if (
    /android|iphone|ipad|ipod/.test(ua) ||
    (ua.includes("mac") && navigator.maxTouchPoints > 1)
  )
    return "unknown";
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [os, setOs] = useState<OS>("unknown");
  const [release, setRelease] = useState<LatestRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    setOs(detectOS());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch("/api/latest-release", {
      signal: controller.signal,
      cache: attempt > 0 ? "no-store" : "default",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Release unavailable");
        const data = await response.json();
        if (
          typeof data?.version !== "string" ||
          !data.platforms ||
          typeof data.platforms !== "object"
        )
          throw new Error("Invalid release");
        if (!controller.signal.aborted) setRelease(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const getDownloadLink = useCallback(
    (targetOs: OS) => (targetOs === "windows" ? MICROSOFT_STORE_URL : null),
    [],
  );
  const value = useMemo(
    () => ({ os, release, loading, error, retry, getDownloadLink }),
    [os, release, loading, error, retry, getDownloadLink],
  );
  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownload() {
  const context = useContext(DownloadContext);
  if (!context)
    throw new Error("useDownload must be used within a DownloadProvider");
  return context;
}
