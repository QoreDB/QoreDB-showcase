"use client";

import { Children, isValidElement, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type TabProps = {
  label: string;
  children: ReactNode;
};

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function CodeTabs({ children }: { children: ReactNode }) {
  type TabElementProps = {
    label?: unknown;
    children?: ReactNode;
  };

  const tabs = Children.toArray(children).filter(
    (c): c is React.ReactElement<TabElementProps> =>
      isValidElement(c) &&
      typeof (c.props as TabElementProps).label === "string",
  );

  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-(--q-border) bg-(--q-bg-1)">
      <div
        role="tablist"
        className="flex items-center gap-1 border-b border-(--q-border) bg-(--q-bg-0) px-2 pt-2"
      >
        {tabs.map((tab, i) => (
          <button
            key={String(tab.props.label)}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={cn(
              "rounded-t-md px-3 py-1.5 text-xs font-medium transition-colors",
              active === i
                ? "bg-(--q-bg-1) text-(--q-text-0)"
                : "text-(--q-text-2) hover:text-(--q-text-1)",
            )}
            onClick={() => setActive(i)}
          >
            {String(tab.props.label)}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="docs-codeblock-host">
        {tabs[active]}
      </div>
    </div>
  );
}
