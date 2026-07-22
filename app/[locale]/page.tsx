import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JsonLd } from "@/components/JsonLd";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { HeroBackgroundManager } from "@/components/hero-background-manager";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { normalizeLocale } from "@/lib/locale";
import { buildPageMetadata, getAbsoluteUrl, getLocalizedUrl } from "@/lib/seo";

const SocialProofBar = dynamic(() =>
  import("@/components/landing/social-proof-bar").then((m) => ({
    default: m.SocialProofBar,
  })),
);
const MiniFaq = dynamic(() =>
  import("@/components/landing/mini-faq").then((m) => ({
    default: m.MiniFaq,
  })),
);
const DatabaseStrip = dynamic(() =>
  import("@/components/landing/database-strip").then((m) => ({
    default: m.DatabaseStrip,
  })),
);
const FeaturesSection = dynamic(() =>
  import("@/components/landing/features-section").then((m) => ({
    default: m.FeaturesSection,
  })),
);
const FeatureShowcase = dynamic(() =>
  import("@/components/landing/feature-showcase").then((m) => ({
    default: m.FeatureShowcase,
  })),
);
const InlineCTA = dynamic(() =>
  import("@/components/landing/inline-cta").then((m) => ({
    default: m.InlineCTA,
  })),
);
const Testimonials = dynamic(() =>
  import("@/components/landing/testimonials").then((m) => ({
    default: m.Testimonials,
  })),
);
const ComparisonTable = dynamic(() =>
  import("@/components/landing/comparison-table").then((m) => ({
    default: m.ComparisonTable,
  })),
);
const PricingPreview = dynamic(() =>
  import("@/components/landing/pricing-preview").then((m) => ({
    default: m.PricingPreview,
  })),
);
const CTASection = dynamic(() =>
  import("@/components/landing/cta-section").then((m) => ({
    default: m.CTASection,
  })),
);
const Footer = dynamic(() =>
  import("@/components/landing/footer").then((m) => ({
    default: m.Footer,
  })),
);

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
        image: getAbsoluteUrl("/images/screenshots/query-screen.png"),
        screenshot: getAbsoluteUrl("/images/screenshots/query-screen.png"),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd id={`home-jsonld-${normalizedLocale}`} data={structuredData} />
      <div className="min-h-screen overflow-hidden relative">
        <HeroBackgroundManager />
        <Header />
        <Hero />
        <SocialProofBar />
        <DatabaseStrip />
        <FeaturesSection />
        <FeatureShowcase />
        <InlineCTA />
        <Testimonials locale={normalizedLocale} />
        <ComparisonTable />
        <MiniFaq />
        <PricingPreview />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
