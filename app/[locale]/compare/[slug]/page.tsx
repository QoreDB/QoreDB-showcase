import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import {
  COMPARE_CHECKED_AT,
  COMPARE_ROWS,
  COMPETITOR_SLUGS,
  COMPETITORS,
  getCompetitor,
} from "@/lib/compare";
import { DATABASE_COUNT } from "@/lib/databases";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { buildPageMetadata, getAbsoluteUrl } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

type Point = { title: string; body: string };

const REPORT_URL = "https://github.com/QoreDB/QoreDB-showcase/issues/new";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    COMPETITOR_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const competitor = getCompetitor(slug);
  if (!competitor) return {};

  const { t } = await getTranslation(locale, "compare");

  return buildPageMetadata({
    locale,
    pathname: `/compare/${slug}`,
    title: t("page.meta_title", { name: competitor.name }),
    description: t(`competitors.${slug}.description`),
  });
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function formatDate(locale: string, isoDate: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export default async function ComparePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const competitor = getCompetitor(slug);
  if (!competitor) notFound();

  const { t } = await getTranslation(locale, "compare");
  const { t: tCommon } = await getTranslation(locale, "common");
  const name = competitor.name;
  const base = `competitors.${slug}`;
  const counts = { count: DATABASE_COUNT, others: DATABASE_COUNT - 1 };
  const qoredbValues = {
    ...counts,
    proPrice: tCommon("pricing_page.pro.price"),
  };
  const stronger = asArray<Point>(
    t(`${base}.stronger`, { returnObjects: true }),
  );
  const different = asArray<Point>(
    t(`${base}.different`, { returnObjects: true, ...counts }),
  );
  const switchNotes = asArray<string>(
    t(`${base}.switch`, { returnObjects: true }),
  );
  const others = COMPETITORS.filter((other) => other.slug !== slug);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("page.breadcrumb"),
        item: getAbsoluteUrl(`/${locale}/compare`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("page.title", { name }),
        item: getAbsoluteUrl(`/${locale}/compare/${slug}`),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <JsonLd id={`compare-jsonld-${locale}-${slug}`} data={breadcrumbData} />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-28 pb-20 lg:pt-36"
      >
        <div className="mb-6">
          <Link
            href={`/${locale}/compare`}
            className="inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-accent) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("page.back")}
          </Link>
        </div>

        <header className="q-page-header mb-14 !pt-6">
          <p className="relative text-sm font-medium text-(--q-accent) mb-3">
            {t("page.eyebrow")}
          </p>
          <h1 className="mb-5 max-w-4xl">{t("page.title", { name })}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-(--q-text-1)">
            {t(`${base}.intro`, counts)}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={`/${locale}/download`}>
                {t("page.cta_download")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/pricing`}>{t("page.cta_pricing")}</Link>
            </Button>
          </div>
        </header>

        <section className="mb-14" aria-labelledby="compare-glance">
          <h2
            id="compare-glance"
            className="text-2xl font-semibold mb-6 text-(--q-text-0)"
          >
            {t("page.glance_title")}
          </h2>
          <table className="w-full border-collapse text-left">
            <thead className="sr-only md:not-sr-only">
              <tr className="border-b border-(--q-border) text-sm text-(--q-text-2)">
                <th scope="col" className="py-3 pr-6 font-medium md:w-44">
                  {t("page.column_topic")}
                </th>
                <th
                  scope="col"
                  className="py-3 pr-6 font-semibold text-(--q-accent)"
                >
                  QoreDB
                </th>
                <th
                  scope="col"
                  className="py-3 font-semibold text-(--q-text-0)"
                >
                  {name}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr
                  key={row}
                  className="block border-b border-(--q-border) py-4 md:table-row md:py-0"
                >
                  <th
                    scope="row"
                    className="block pb-2 text-sm font-medium text-(--q-text-2) md:table-cell md:py-4 md:pr-6 md:align-top"
                  >
                    {t(`page.rows.${row}`)}
                  </th>
                  <td className="block pb-2 leading-relaxed text-(--q-text-0) md:table-cell md:py-4 md:pr-6 md:align-top">
                    <span className="mb-0.5 block text-xs font-semibold text-(--q-accent) md:hidden">
                      QoreDB
                    </span>
                    {t(`qoredb.${row}`, qoredbValues)}
                  </td>
                  <td className="block leading-relaxed text-(--q-text-1) md:table-cell md:py-4 md:align-top">
                    <span className="mb-0.5 block text-xs font-semibold text-(--q-text-0) md:hidden">
                      {name}
                    </span>
                    {t(`${base}.values.${row}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 max-w-3xl text-sm leading-relaxed text-(--q-text-2)">
            <p className="mb-3">
              {t("page.checked", {
                name,
                date: formatDate(locale, COMPARE_CHECKED_AT),
              })}{" "}
              <a
                href={REPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-(--q-accent) hover:underline"
              >
                {t("page.report")}
              </a>
            </p>
            <details>
              <summary className="cursor-pointer font-medium text-(--q-text-1)">
                {t("page.sources_title", { name })}
              </summary>
              <ul className="mt-3 space-y-1.5">
                {competitor.sources.map((source) => (
                  <li key={source} className="break-all">
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="hover:text-(--q-accent) hover:underline"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </section>

        <div className="mb-14 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
              {t("page.stronger_title", { name })}
            </h2>
            <ul className="space-y-4">
              {stronger.map((point) => (
                <li
                  key={point.title}
                  className="rounded-lg border border-(--q-border) bg-(--q-bg-1) p-5"
                >
                  <h3 className="font-semibold text-(--q-text-0) mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-(--q-text-1)">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
              {t("page.different_title")}
            </h2>
            <ul className="space-y-4">
              {different.map((point) => (
                <li
                  key={point.title}
                  className="rounded-lg border border-(--q-border) bg-(--q-bg-1) p-5"
                >
                  <h3 className="flex items-center gap-2 font-semibold text-(--q-text-0) mb-1.5">
                    <Check className="w-4 h-4 text-(--q-accent) shrink-0" />
                    {point.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-(--q-text-1)">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mb-14 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-(--q-text-0)">
            {t("page.switch_title", { name })}
          </h2>
          <div className="space-y-3 text-(--q-text-1) leading-relaxed">
            {switchNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
            {t("page.other_title")}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/${locale}/compare/${other.slug}`}
                  prefetch={false}
                  className="inline-flex items-center rounded-lg border border-(--q-border) bg-(--q-bg-1) px-4 py-2.5 text-sm font-medium text-(--q-text-0) transition-colors hover:bg-(--q-bg-2)"
                >
                  {t("page.title", { name: other.name })}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-(--q-border) pt-12">
          <h2 className="text-2xl font-semibold mb-3 text-(--q-text-0)">
            {t("page.cta_title", { name })}
          </h2>
          <p className="text-(--q-text-1) leading-relaxed max-w-xl mb-6">
            {t("page.cta_body")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={`/${locale}/download`}>
                {t("page.cta_download")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/pricing`}>{t("page.cta_pricing")}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
