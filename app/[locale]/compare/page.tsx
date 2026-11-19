import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { COMPETITORS } from "@/lib/compare";
import { buildPageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "compare");

  return buildPageMetadata({
    locale,
    pathname: "/compare",
    title: t("index.meta_title"),
    description: t("index.subtitle"),
  });
}

export default async function CompareIndexPage({ params }: { params: Params }) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "compare");

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-20 pb-20 lg:pt-24"
      >
        <div className="q-page-header mb-12">
          <h1 className="mb-5 max-w-4xl">{t("index.title")}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
            {t("index.subtitle")}
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPETITORS.map((competitor) => (
            <li key={competitor.slug} className="flex">
              <Link
                href={`/${locale}/compare/${competitor.slug}`}
                prefetch={false}
                className="flex w-full flex-col gap-3 rounded-2xl bg-(--q-bg-1) p-6 transition-colors hover:bg-(--q-bg-2)"
              >
                <span className="text-lg font-semibold text-(--q-text-0)">
                  {t("page.title", { name: competitor.name })}
                </span>
                <span className="flex-1 text-[15px] leading-relaxed text-(--q-text-1)">
                  {t(`competitors.${competitor.slug}.description`)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-(--q-accent)">
                  {t("index.card_cta")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
