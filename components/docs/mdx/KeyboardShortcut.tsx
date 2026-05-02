"use client";

import { useEffect, useState } from "react";

function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);
  return isMac;
}

const ALIASES: Record<string, { mac: string; other: string }> = {
  cmd: { mac: "⌘", other: "Ctrl" },
  ctrl: { mac: "⌃", other: "Ctrl" },
  meta: { mac: "⌘", other: "Win" },
  alt: { mac: "⌥", other: "Alt" },
  option: { mac: "⌥", other: "Alt" },
  shift: { mac: "⇧", other: "Shift" },
  enter: { mac: "↵", other: "Enter" },
  esc: { mac: "Esc", other: "Esc" },
};

function resolveKey(key: string, isMac: boolean) {
  const lower = key.toLowerCase();
  if (lower in ALIASES) {
    return isMac ? ALIASES[lower].mac : ALIASES[lower].other;
  }
  return key.length === 1 ? key.toUpperCase() : key;
}

export function KeyboardShortcut({ keys = [] }: { keys?: string[] } = {}) {
  const isMac = useIsMac();

  if (!keys || keys.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {keys.map((key, i) => (
        <span key={key} className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-(--q-border) bg-(--q-bg-1) px-1.5 font-mono text-[11px] font-medium text-(--q-text-0) shadow-sm">
            {resolveKey(key, isMac)}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-(--q-text-2) text-xs">+</span>
          )}
        </span>
      ))}
    </span>
  );
}
