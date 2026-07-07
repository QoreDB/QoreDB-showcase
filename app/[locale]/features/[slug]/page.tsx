import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { FEATURE_SLUGS, getFeaturePage } from "@/lib/features";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import { FeaturePageClient } from "./feature-page-client";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    FEATURE_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { t } = await getTranslation(locale, "common");

  if (!getFeaturePage(slug)) {
    return buildPageMetadata({
      locale,
      pathname: `/features/${slug}`,
      title: t("features_common.not_found_title"),
      description: t("features_common.not_found_subtitle"),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    locale,
    pathname: `/features/${slug}`,
    title: t(`features_pages.${slug}.title`),
    description: t(`features_pages.${slug}.subtitle`),
  });
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  if (!getFeaturePage(slug)) {
    notFound();
  }

  return <FeaturePageClient slug={slug} />;
}
