import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { CompareTable } from "@/components/compare/compare-table";
import { ShotFrame, ThemeShot } from "@/components/compare/theme-shot";
import { UrlPasteDemo } from "@/components/compare/url-paste-demo";
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

type Stat = { value: string; label: string };

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
  const stats = asArray<Stat>(
    t("page.stats", { returnObjects: true, ...qoredbValues }),
  );
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
  const rows = COMPARE_ROWS.map((row) => ({
    key: row,
    label: t(`page.rows.${row}`),
    qoredb: t(`qoredb.${row}`, qoredbValues),
    competitor: t(`${base}.values.${row}`),
  }));

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

        <header className="q-page-header mb-16 !pt-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div>
              <p className="relative text-sm font-medium text-(--q-accent) mb-3">
                {t("page.eyebrow")}
              </p>
              <h1 className="mb-5">
                QoreDB <span className="text-(--q-text-2)">vs</span> {name}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
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
                  <Link href={`/${locale}/pricing`}>
                    {t("page.cta_pricing")}
                  </Link>
                </Button>
              </div>
            </div>
            <ShotFrame>
              <ThemeShot
                name="query-workspace"
                alt={tCommon("home.hero.alt")}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </ShotFrame>
          </div>

          {stats.length > 0 && (
            <dl className="mt-12 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-(--q-border) bg-(--q-bg-1) px-5 py-4"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-3xl font-semibold tracking-tight text-(--q-accent)">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-sm leading-snug text-(--q-text-1)">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <section className="mb-20" aria-labelledby="compare-glance">
          <h2
            id="compare-glance"
            className="text-2xl font-semibold mb-6 text-(--q-text-0)"
          >
            {t("page.glance_title")}
          </h2>
          <CompareTable
            topicLabel={t("page.column_topic")}
            competitorName={name}
            rows={rows}
          />

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
            <details className="group">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-medium text-(--q-text-1) hover:text-(--q-text-0) [&::-webkit-details-marker]:hidden">
                <Plus className="h-3.5 w-3.5 transition-transform group-open:rotate-45" />
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

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6 text-(--q-text-0)">
            {t("page.stronger_title", { name })}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {stronger.map((point, index) => (
              <li
                key={point.title}
                className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6"
              >
                <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-(--q-bg-2) font-mono text-sm text-(--q-text-1)">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-(--q-text-0) mb-2">
                  {point.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-(--q-text-1)">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6 text-(--q-text-0)">
            {t("page.different_title")}
          </h2>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <ul className="space-y-4">
              {different.map((point) => (
                <li
                  key={point.title}
                  className="flex gap-4 rounded-2xl border border-(--q-accent)/25 bg-(--q-accent)/5 p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--q-accent)/15 text-(--q-accent)">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-(--q-text-0) mb-1.5">
                      {point.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-(--q-text-1)">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <ShotFrame className="lg:sticky lg:top-28">
              <ThemeShot
                name="safety-confirm"
                alt={tCommon("home.workflows.safety.alt")}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </ShotFrame>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6 text-(--q-text-0)">
            {t("page.switch_title", { name })}
          </h2>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-(--q-text-1) leading-relaxed">
              {switchNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
            <UrlPasteDemo
              urlLabel={t("page.url_label")}
              resultLabel={t("page.url_result")}
              fieldLabels={{
                host: t("page.fields.host"),
                port: t("page.fields.port"),
                user: t("page.fields.user"),
                database: t("page.fields.database"),
              }}
            />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
            {t("page.other_title")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <li key={other.slug} className="flex">
                <Link
                  href={`/${locale}/compare/${other.slug}`}
                  prefetch={false}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-(--q-border) bg-(--q-bg-1) px-4 py-3.5 text-sm font-medium text-(--q-text-0) transition-colors hover:border-(--q-accent)/40 hover:bg-(--q-bg-2)"
                >
                  {t("page.title", { name: other.name })}
                  <ArrowRight className="h-4 w-4 shrink-0 text-(--q-text-2) transition-transform group-hover:translate-x-0.5 group-hover:text-(--q-accent)" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl bg-(--q-bg-1) bg-[radial-gradient(80%_140%_at_100%_0%,color-mix(in_srgb,var(--q-accent)_20%,transparent),transparent_70%)] p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-(--q-text-0)">
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
