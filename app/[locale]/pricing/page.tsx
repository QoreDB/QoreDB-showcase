import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import PricingPageClient from "@/components/pricing/pricing-page-client";
import { normalizeLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import { getStripePricing, getStripeTeamPricing } from "@/lib/stripe/pricing";

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

  let initialProStripePrice: string | null = null;
  try {
    const pricing = await getStripePricing(normalizedLocale);
    initialProStripePrice = pricing.formattedPrice;
  } catch (error) {
    console.error("Failed to load Stripe price on pricing page", error);
  }

  // Le teaser Team n'a besoin que du prix unitaire formaté (« À partir de … »).
  // Le configurateur complet vit sur /pricing/team.
  let initialTeamSeatPrice: string | null = null;
  try {
    const teamPricing = await getStripeTeamPricing(normalizedLocale);
    initialTeamSeatPrice = teamPricing.formattedPrice;
  } catch (error) {
    console.error("Failed to load Stripe Team price on pricing page", error);
  }

  return (
    <PricingPageClient
      locale={normalizedLocale}
      initialProStripePrice={initialProStripePrice}
      initialTeamSeatPrice={initialTeamSeatPrice}
    />
  );
}
