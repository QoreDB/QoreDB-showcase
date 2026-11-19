import { ArrowLeft, ArrowRight, Check, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import {
  DATABASE_SLUGS,
  type Database,
  getDatabase,
  getDatabaseGroupKey,
} from "@/lib/databases";
import { DEFAULT_DOCS_LOCALE, isDocsLocale } from "@/lib/docs/types";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { buildPageMetadata, getAbsoluteUrl } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

type Highlight = { title: string; body: string };

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    DATABASE_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const database = getDatabase(slug);
  if (!database) return {};

  const { t } = await getTranslation(locale, "databases");

  return buildPageMetadata({
    locale,
    pathname: `/databases/${slug}`,
    title: t("page.meta_title", { name: database.name }),
    description: t(`databases.${slug}.description`),
  });
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function docsHref(locale: string, database: Database) {
  const docsLocale = isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE;
  return `/${docsLocale}${database.doc}`;
}

export default async function DatabasePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const database = getDatabase(slug);
  if (!database) notFound();

  const { t } = await getTranslation(locale, "databases");
  const { t: tCommon } = await getTranslation(locale, "common");
  const name = database.name;
  const base = `databases.${slug}`;
  const highlights = asArray<Highlight>(
    t(`${base}.highlights`, { returnObjects: true }),
  );
  const limits = asArray<string>(t(`${base}.limits`, { returnObjects: true }));
  const shared = asArray<string>(t("page.shared", { returnObjects: true }));
  const related = database.related.flatMap((relatedSlug) => {
    const relatedDatabase = getDatabase(relatedSlug);
    return relatedDatabase ? [relatedDatabase] : [];
  });

  const schemes =
    database.protocol === "embedded"
      ? t("page.file_path")
      : database.schemes.length > 0
        ? database.schemes.join("  ")
        : t("page.form_only");

  const facts = [
    { label: t("page.facts.port"), value: database.port ?? t("page.no_port") },
    {
      label: t("page.facts.protocol"),
      value: t(`page.protocols.${database.protocol}`),
    },
    {
      label: t("page.facts.schemes"),
      value: schemes,
      mono: database.schemes.length > 0,
    },
    { label: t("page.facts.tls"), value: t(`page.tls.${database.tls}`) },
    { label: t("page.facts.auth"), value: t(`page.auth.${database.auth}`) },
  ];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("page.breadcrumb"),
        item: getAbsoluteUrl(`/${locale}/databases`),
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: getAbsoluteUrl(`/${locale}/databases/${slug}`),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <JsonLd id={`database-jsonld-${locale}-${slug}`} data={breadcrumbData} />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-28 pb-20 lg:pt-36"
      >
        <div className="mb-6">
          <Link
            href={`/${locale}/databases`}
            className="inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-accent) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("page.back")}
          </Link>
        </div>

        <header className="q-page-header mb-14 !pt-6">
          <div className="relative flex flex-wrap items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-14 h-14 rounded-lg bg-(--q-bg-1) border border-(--q-border) shrink-0">
              <Image
                src={database.image}
                alt=""
                width={32}
                height={32}
                sizes="32px"
                className="h-8 w-8 object-contain"
              />
            </span>
            <span className="inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium bg-(--q-bg-1) text-(--q-text-2) border border-(--q-border)">
              {t("page.core_badge")}
            </span>
            {database.officialListing && (
              <a
                href={database.officialListing}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium bg-(--q-accent)/10 text-(--q-accent) border border-(--q-accent)/30 hover:bg-(--q-accent)/15 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {t("page.official_listing", { name })}
              </a>
            )}
          </div>
          <p className="relative text-sm font-medium text-(--q-accent) mb-3">
            {tCommon(`database_strip.groups.${getDatabaseGroupKey(slug)}`)}
          </p>
          <h1 className="mb-5 max-w-4xl">{t("page.title", { name })}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-(--q-text-1)">
            {t(`${base}.description`)}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href={`/${locale}/download`}>
                {t("page.cta_download")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-9 whitespace-normal py-2 text-left"
            >
              <Link href={docsHref(locale, database)}>
                {t("page.guide_link", { name })}
              </Link>
            </Button>
          </div>
        </header>

        <section className="mb-14 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-(--q-text-0)">
            {t("page.why_title", { name })}
          </h2>
          <p className="text-(--q-text-1) leading-relaxed">
            {t(`${base}.intro`)}
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-6 text-(--q-text-0)">
            {t("page.highlights_title", { name })}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <li
                key={highlight.title}
                className="rounded-lg border border-(--q-border) bg-(--q-bg-1) p-6"
              >
                <h3 className="font-semibold text-(--q-text-0) mb-2">
                  {highlight.title}
                </h3>
                <p className="text-(--q-text-1) leading-relaxed text-[15px]">
                  {highlight.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-14 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
              {t("page.connection_title")}
            </h2>
            <dl className="divide-y divide-(--q-border) border-y border-(--q-border)">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm text-(--q-text-2)">{fact.label}</dt>
                  <dd
                    className={`text-(--q-text-0) ${fact.mono ? "font-mono text-sm" : ""}`}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
              {t("page.shared_title", { name })}
            </h2>
            <ul className="space-y-3">
              {shared.map((item) => (
                <li key={item} className="flex gap-3 text-(--q-text-1)">
                  <Check className="w-4 h-4 mt-1 text-(--q-accent) shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {limits.length > 0 && (
          <section className="mb-14 max-w-3xl">
            <div className="rounded-lg border border-(--q-border) bg-(--q-bg-1) p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <TriangleAlert className="w-5 h-5 text-(--q-text-2)" />
                <h2 className="text-xl font-semibold text-(--q-text-0)">
                  {t("page.limits_title")}
                </h2>
              </div>
              <ul className="space-y-3 mb-5">
                {limits.map((item) => (
                  <li key={item} className="flex gap-3 text-(--q-text-1)">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 rounded-full bg-(--q-text-2) shrink-0"
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${isDocsLocale(locale) ? locale : DEFAULT_DOCS_LOCALE}/docs/reference/driver-limitations`}
                className="text-sm font-medium text-(--q-accent) hover:underline"
              >
                {t("page.limits_more")}
              </Link>
            </div>
          </section>
        )}

        <section className="mb-14 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-3 text-(--q-text-0)">
            {t("page.guide_title")}
          </h2>
          <p className="text-(--q-text-1) leading-relaxed mb-4">
            {t("page.guide_body", { name })}
          </p>
          <Link
            href={docsHref(locale, database)}
            className="inline-flex items-center gap-1.5 font-medium text-(--q-accent) hover:underline"
          >
            {t("page.guide_link", { name })}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-semibold mb-5 text-(--q-text-0)">
              {t("page.related_title")}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {related.map((relatedDatabase) => (
                <li key={relatedDatabase.slug}>
                  <Link
                    href={`/${locale}/databases/${relatedDatabase.slug}`}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-lg border border-(--q-border) bg-(--q-bg-1) px-4 py-2.5 text-sm font-medium text-(--q-text-0) transition-colors hover:bg-(--q-bg-2)"
                  >
                    <Image
                      src={relatedDatabase.image}
                      alt=""
                      width={20}
                      height={20}
                      sizes="20px"
                      loading="lazy"
                      className="h-5 w-5 object-contain"
                    />
                    {relatedDatabase.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
              <Link href={`/${locale}/pricing`}>{t("page.cta_compare")}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
