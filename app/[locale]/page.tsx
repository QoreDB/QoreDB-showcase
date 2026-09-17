import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { JsonLd } from "@/components/JsonLd";
import { CTASection } from "@/components/landing/cta-section";
import { DatabaseStrip } from "@/components/landing/database-strip";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { McpSection } from "@/components/landing/mcp-section";
import { MiniFaq } from "@/components/landing/mini-faq";
import { MoreFeatures } from "@/components/landing/more-features";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { normalizeLocale } from "@/lib/locale";
import { buildPageMetadata, getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo";
import "@/components/landing/home.css";

const OFFER_COUNTRIES = [
  "FR",
  "BE",
  "CH",
  "LU",
  "CA",
  "US",
  "GB",
  "ES",
  "IT",
  "DE",
  "AT",
  "CN",
  "JP",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/",
    title: t("metadata.site_title"),
    description: t("metadata.site_description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);
  const { t } = await getTranslation(normalizedLocale, "common");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "QoreDB",
        url: getLocalizedUrl(normalizedLocale, "/"),
        logo: getAbsoluteUrl("/logo.png"),
        sameAs: [
          "https://github.com/QoreDB/QoreDB",
          "https://www.linkedin.com/company/qoredb/?viewAsMember=true",
        ],
      },
      {
        "@type": "WebSite",
        name: "QoreDB",
        url: getLocalizedUrl(normalizedLocale, "/"),
        inLanguage: normalizedLocale,
        description: t("metadata.site_description"),
      },
      {
        "@type": "SoftwareApplication",
        name: "QoreDB",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Windows, Linux",
        description: t("metadata.site_description"),
        url: getLocalizedUrl(normalizedLocale, "/"),
        downloadUrl: getLocalizedUrl(normalizedLocale, "/download"),
        image: getAbsoluteUrl("/images/showcase-v2/query-workspace-dark.webp"),
        screenshot: getAbsoluteUrl(
          "/images/showcase-v2/query-workspace-dark.webp",
        ),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: getLocalizedUrl(normalizedLocale, "/download"),
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0",
              currency: "EUR",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: OFFER_COUNTRIES,
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY",
              },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: OFFER_COUNTRIES,
            returnPolicyCategory:
              "https://schema.org/MerchantReturnNotPermitted",
          },
        },
      },
    ],
  };

  return (
    <>
      <JsonLd id={`home-jsonld-${normalizedLocale}`} data={structuredData} />
      <Header />
      <main id="main-content" tabIndex={-1} className="q-home">
        <div className="q-home-first-screen">
          <Hero locale={normalizedLocale} />
        </div>
        <DatabaseStrip locale={normalizedLocale} />
        <FeatureShowcase locale={normalizedLocale} />
        <MoreFeatures locale={normalizedLocale} />
        <McpSection locale={normalizedLocale} />
        <PricingPreview locale={normalizedLocale} />
        <MiniFaq locale={normalizedLocale} />
        <CTASection locale={normalizedLocale} />
      </main>
      <Footer />
    </>
  );
}
