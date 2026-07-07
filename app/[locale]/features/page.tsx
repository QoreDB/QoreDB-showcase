import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { FeaturesIndexClient } from "./features-index-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/features",
    title: t("features_index.title"),
    description: t("features_index.subtitle"),
  });
}

export default function FeaturesPage() {
  return <FeaturesIndexClient />;
}
