"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
} | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export function Accordion({
  children,
  className,
  type = "single",
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    if (defaultValue) return [defaultValue];
    return [];
  });

  const toggleItem = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        let next: string[];
        if (type === "single") {
          next = prev.includes(value) ? [] : [value];
        } else {
          next = prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
        }

        if (onValueChange) {
          onValueChange(type === "single" ? next[0] || "" : next);
        }
        return next;
      });
    },
    [type, onValueChange],
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  children,
  className,
  value,
  ...props
}: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(value);

  return (
    <div
      className={cn(
        "border border-(--q-border) rounded-lg bg-(--q-bg-1)/50 overflow-hidden transition-colors",
        isOpen && "border-(--q-accent)/30 bg-(--q-bg-1)",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            isOpen,
          }); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  value?: string;
  onToggle?: () => void;
}

export function AccordionTrigger({
  children,
  className,
  isOpen, // Injected by Item
  value, // Injected by Item
  ...props
}: AccordionTriggerProps) {
  const { toggleItem } = useAccordion();

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => value && toggleItem(value)}
      className={cn(
        "group flex w-full items-start justify-between gap-4 p-6 text-left transition-colors hover:bg-(--q-bg-2)/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--q-accent)",
        className,
      )}
      {...props}
    >
      <div className="flex-1 font-semibold text-lg text-(--q-text-0)">
        {children}
      </div>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--q-bg-2) text-(--q-text-2) transition-[transform,color,background-color] duration-300 ease-out motion-reduce:transition-none group-hover:text-(--q-text-0)",
          isOpen && "rotate-180 bg-(--q-accent)/15 text-(--q-accent)",
        )}
      >
        <ChevronDown className="h-4 w-4" />
      </span>
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export function AccordionContent({
  children,
  className,
  isOpen, // Injected by Item
  ...props
}: AccordionContentProps) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
      inert={!isOpen}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "p-6 pt-0 text-(--q-text-1) leading-relaxed text-base",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
