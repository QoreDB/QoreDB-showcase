import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import { FAQ_ITEMS, faqAnswerToPlainText } from "@/lib/faq";
import { normalizeLocale } from "@/lib/locale";
import { buildPageMetadata, getLocalizedUrl } from "@/lib/seo";
import { FAQPageClient } from "./faq-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/faq",
    title: t("faq_page.title"),
    description: t("metadata.site_description"),
  });
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const { t } = await getTranslation(normalizedLocale, "common");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": getLocalizedUrl(normalizedLocale, "/faq"),
    inLanguage: normalizedLocale,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: t(`faq_page.items.${item.key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerToPlainText(t(`faq_page.items.${item.key}.answer`)),
      },
    })),
  };

  return (
    <>
      <JsonLd id={`faq-jsonld-${normalizedLocale}`} data={structuredData} />
      <FAQPageClient />
    </>
  );
}
