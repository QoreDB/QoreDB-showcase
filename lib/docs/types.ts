export type DocsLocale = "en" | "fr";

export const DOCS_LOCALES: DocsLocale[] = ["en", "fr"];
export const DEFAULT_DOCS_LOCALE: DocsLocale = "en";

export function isDocsLocale(locale: string): locale is DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(locale);
}

export function getDocsAlternates(pathname: string) {
  return {
    alternatePaths: Object.fromEntries(
      DOCS_LOCALES.map((locale) => [locale, pathname]),
    ),
  };
}

export type DocFrontmatter = {
  title: string;
  description: string;
  order?: number;
  premium?: boolean;
  draft?: boolean;
};

export type DocHeading = {
  id: string;
  text: string;
  depth: number;
};

export type DocPage = {
  locale: DocsLocale;
  slug: string[];
  href: string;
  filePath: string;
  frontmatter: DocFrontmatter;
};

export type DocsTreeNode =
  | {
      kind: "section";
      label: string;
      slug: string[];
      premium?: boolean;
      children: DocsTreeNode[];
    }
  | {
      kind: "page";
      label: string;
      slug: string[];
      href: string;
      premium?: boolean;
    };
