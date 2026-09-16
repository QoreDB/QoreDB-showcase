import dynamic from "next/dynamic";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { SearchDialog } from "@/components/docs/SearchDialog";
import { Header } from "@/components/landing/header";
import { getDocsTree } from "@/lib/docs/tree";
import {
  DEFAULT_DOCS_LOCALE,
  DOCS_LOCALES,
  type DocsLocale,
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
      <div className="q-container pt-28 pb-16 lg:pt-36">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <aside
            data-pagefind-ignore
            className="self-start lg:sticky lg:top-32"
          >
            <div className="mb-3 lg:mb-6">
              <SearchDialog locale={locale} />
            </div>
            <DocsSidebar tree={tree} locale={locale} />
          </aside>
          <main id="main-content" tabIndex={-1} className="min-w-0">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
