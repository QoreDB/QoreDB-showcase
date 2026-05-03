const ALIASES: Record<string, { label: string }> = {
  cmd: { label: "Cmd" },
  ctrl: { label: "Ctrl" },
  meta: { label: "Win" },
  alt: { label: "Alt" },
  option: { label: "Alt" },
  shift: { label: "Shift" },
  enter: { label: "Enter" },
  esc: { label: "Esc" },
};

function resolveKeyServer(key: string) {
  const lower = key.toLowerCase();
  if (lower in ALIASES) return ALIASES[lower].label;
  return key.length === 1 ? key.toUpperCase() : key;
}

type Props = { keys?: string[]; shortcut?: string };

export function KeyboardShortcut(props: Props = {}) {
  const keys =
    props.keys ??
    (props.shortcut
      ? props.shortcut.split("+").map((k) => k.trim()).filter(Boolean)
      : []);
  if (keys.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {keys.map((key, i) => (
        <span key={key} className="inline-flex items-center gap-1">
          <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-(--q-border) bg-(--q-bg-1) px-1.5 font-mono text-[11px] font-medium text-(--q-text-0) shadow-sm">
            {resolveKeyServer(key)}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-(--q-text-2) text-xs">+</span>
          )}
        </span>
      ))}
    </span>
  );
}
