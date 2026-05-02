import { Sparkles } from "lucide-react";

export function PremiumBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-(--q-accent)/40 bg-(--q-accent-soft) px-2 py-0.5 text-[11px] font-medium text-(--q-accent-strong) ${className}`}
    >
      <Sparkles className="size-3" />
      Premium
    </span>
  );
}
