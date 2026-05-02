import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning" | "danger";

const STYLES: Record<
  CalloutType,
  { icon: typeof Info; container: string; iconClass: string; titleClass: string }
> = {
  info: {
    icon: Info,
    container: "border-(--q-info)/30 bg-(--q-info)/5",
    iconClass: "text-(--q-info)",
    titleClass: "text-(--q-info)",
  },
  tip: {
    icon: Lightbulb,
    container: "border-(--q-success)/30 bg-(--q-success)/5",
    iconClass: "text-(--q-success)",
    titleClass: "text-(--q-success)",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-(--q-warning)/30 bg-(--q-warning)/5",
    iconClass: "text-(--q-warning)",
    titleClass: "text-(--q-warning)",
  },
  danger: {
    icon: ShieldAlert,
    container: "border-(--q-error)/30 bg-(--q-error)/5",
    iconClass: "text-(--q-error)",
    titleClass: "text-(--q-error)",
  },
};

const DEFAULT_TITLES: Record<CalloutType, string> = {
  info: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const config = STYLES[type];
  const Icon = config.icon;
  const heading = title ?? DEFAULT_TITLES[type];

  return (
    <aside
      className={cn(
        "my-6 rounded-lg border px-4 py-3",
        config.container,
      )}
    >
      <div className="text-sm leading-relaxed text-(--q-text-1)">
        <p
          className={cn(
            "mb-2 inline-flex items-center gap-2 font-semibold tracking-tight leading-none",
            config.titleClass,
          )}
        >
          <Icon className={cn("size-4 shrink-0", config.iconClass)} />
          <span>{heading}</span>
        </p>
        <div className="[&>p]:m-0 [&>p+p]:mt-2">{children}</div>
      </div>
    </aside>
  );
}
