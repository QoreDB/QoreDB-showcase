import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { TeamPlanClient } from "@/components/pricing/team-plan-client";
import { getIntlLocale, normalizeLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";
import { getStripeTeamPricing } from "@/lib/stripe/pricing";
import { TEAM_MIN_SEATS } from "@/lib/stripe/server";

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
    pathname: "/pricing/team",
    title: t("pricing_page.team.title"),
    description: t("pricing_page.team.page_subtitle"),
  });
}

export default async function TeamPricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);

  let pricing: Awaited<ReturnType<typeof getStripeTeamPricing>>;
  try {
    pricing = await getStripeTeamPricing(normalizedLocale);
  } catch (error) {
    console.error("Failed to load Stripe Team price on /pricing/team", error);
    notFound();
  }

  return (
    <TeamPlanClient
      locale={normalizedLocale}
      unitAmount={pricing.unitAmount}
      currency={pricing.currency}
      minSeats={TEAM_MIN_SEATS}
      intlLocale={getIntlLocale(normalizedLocale)}
    />
  );
}
