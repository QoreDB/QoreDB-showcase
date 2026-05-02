import Link from "next/link";
import type { ComponentProps } from "react";
import { Callout } from "./Callout";
import { CodeTabs, Tab } from "./CodeTabs";
import { KeyboardShortcut } from "./KeyboardShortcut";
import { Screenshot } from "./Screenshot";
import { Steps } from "./Steps";

// next-mdx-remote ships its own loose component map type; we use a permissive
// shape here to avoid pulling @types/mdx just for the static map.
// biome-ignore lint/suspicious/noExplicitAny: MDX component map is intentionally permissive
type MDXComponents = Record<string, React.ComponentType<any>>;

function DocsLink({
  href = "",
  children,
  ...rest
}: ComponentProps<"a">) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...(rest as Omit<ComponentProps<typeof Link>, "href">)}>
      {children}
    </Link>
  );
}

export const docsMdxComponents: MDXComponents = {
  Callout,
  CodeTabs,
  Tab,
  KeyboardShortcut,
  Screenshot,
  Steps,
  a: DocsLink,
};
