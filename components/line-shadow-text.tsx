import type React from "react";
import { cn } from "@/lib/utils";

interface LineShadowTextProps extends React.HTMLAttributes<HTMLElement> {
  shadowColor?: string;
  as?: React.ElementType;
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const content =
    typeof children === "string"
      ? children
      : typeof children === "number"
        ? String(children)
        : Array.isArray(children)
          ? children
              .map((c) =>
                typeof c === "string" || typeof c === "number" ? c : "",
              )
              .join("")
          : null;

  if (!content) {
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      style={{ "--shadow-color": shadowColor } as React.CSSProperties}
      className={cn(
        "relative z-0 inline-flex",
        "after:absolute after:left-[0.04em] after:top-[0.04em] after:content-[attr(data-text)]",
        "after:bg-[linear-gradient(45deg,transparent_45%,var(--shadow-color)_45%,var(--shadow-color)_55%,transparent_0)]",
        "after:-z-10 after:bg-size-[0.06em_0.06em] after:bg-clip-text after:text-transparent",
        "after:animate-line-shadow",
        className,
      )}
      data-text={content}
      {...props}
    >
      {content}
    </Component>
  );
}
