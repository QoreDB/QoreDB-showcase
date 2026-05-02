import dynamic from "next/dynamic";
import { Header } from "@/components/landing/header";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { SearchDialog } from "@/components/docs/SearchDialog";
import { getDocsTree } from "@/lib/docs/tree";
import {
  type DocsLocale,
  DOCS_LOCALES,
  DEFAULT_DOCS_LOCALE,
} from "@/lib/docs/types";
import "@/components/docs/docs-prose.css";

const Footer = dynamic(() =>
  import("@/components/landing/footer").then((m) => ({ default: m.Footer })),
);

function resolveDocsLocale(locale: string): DocsLocale {
  return (DOCS_LOCALES as readonly string[]).includes(locale)
    ? (locale as DocsLocale)
    : DEFAULT_DOCS_LOCALE;
}

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const docsLocale = resolveDocsLocale(locale);
  // Sidebar is always built from the English content (the source of truth),
  // but the hrefs keep the URL locale so the user stays in their UI language.
  const tree = getDocsTree(docsLocale, DEFAULT_DOCS_LOCALE);

  return (
    <div className="min-h-screen bg-(--q-bg-0)">
      <Header />
      <div className="mx-auto max-w-[96rem] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
          <aside className="hidden lg:block">
            <div className="mb-4">
              <SearchDialog locale={locale} />
            </div>
            <DocsSidebar tree={tree} locale={locale} />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
