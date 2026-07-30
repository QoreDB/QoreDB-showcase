import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import PricingPageClient from "@/components/pricing/pricing-page-client";
import { normalizeLocale } from "@/lib/locale";
import {
  buildPageMetadata,
  DEFAULT_OG_IMAGE_PATH,
  getAbsoluteUrl,
  getLocalizedUrl,
  SITE_NAME,
} from "@/lib/seo";
import { getStripePricing, getStripeTeamPricing } from "@/lib/stripe/pricing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/pricing",
    title: t("pricing_page.title"),
    description: t("pricing_page.subtitle"),
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const { t } = await getTranslation(normalizedLocale, "common");

  let initialProStripePrice: string | null = null;
  let proOffer: { unitAmount: number; currency: string } | null = null;
  try {
    const pricing = await getStripePricing(normalizedLocale);
    initialProStripePrice = pricing.formattedPrice;
    proOffer = { unitAmount: pricing.unitAmount, currency: pricing.currency };
  } catch (error) {
    console.error("Failed to load Stripe price on pricing page", error);
  }

  let initialTeamSeatPrice: string | null = null;
  try {
    const teamPricing = await getStripeTeamPricing(normalizedLocale);
    initialTeamSeatPrice = teamPricing.formattedPrice;
  } catch (error) {
    console.error("Failed to load Stripe Team price on pricing page", error);
  }

  const canonical = getLocalizedUrl(normalizedLocale, "/pricing");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} — ${t("pricing_page.title")}`,
    description: t("pricing_page.subtitle"),
    url: canonical,
    image: getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: [
      {
        "@type": "Offer",
        name: "Community",
        price: "0",
        priceCurrency: proOffer?.currency ?? "EUR",
        availability: "https://schema.org/InStock",
        url: canonical,
      },
      ...(proOffer
        ? [
            {
              "@type": "Offer",
              name: "Pro",
              price: (proOffer.unitAmount / 100).toFixed(2),
              priceCurrency: proOffer.currency,
              availability: "https://schema.org/InStock",
              url: canonical,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <JsonLd id={`pricing-jsonld-${normalizedLocale}`} data={structuredData} />
      <PricingPageClient
        locale={normalizedLocale}
        initialProStripePrice={initialProStripePrice}
        initialTeamSeatPrice={initialTeamSeatPrice}
      />
    </>
  );
}
