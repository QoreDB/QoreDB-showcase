import { getIntlLocale } from "@/lib/locale";
import { getStripeClient } from "@/lib/stripe/server";

export type StripePricingPayload = {
  formattedPrice: string;
  currency: string;
  unitAmount: number;
};

async function getPricing(
  priceId: string,
  locale: string,
): Promise<StripePricingPayload> {
  const stripe = getStripeClient();
  const price = await stripe.prices.retrieve(priceId);
  if (price.unit_amount == null) {
    throw new Error("Stripe price has no unit_amount");
  }

  const currency = price.currency.toUpperCase();
  const unitAmount = price.unit_amount;
  const formattedPrice = new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency,
  }).format(unitAmount / 100);

  return {
    formattedPrice,
    currency,
    unitAmount,
  };
}

export async function getStripePricing(
  locale: string,
): Promise<StripePricingPayload> {
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  if (!stripePriceId) {
    throw new Error("STRIPE_PRICE_ID is missing");
  }
  return getPricing(stripePriceId, locale);
}

/** Prix unitaire (par siège, annuel) du plan Team. */
export async function getStripeTeamPricing(
  locale: string,
): Promise<StripePricingPayload> {
  const teamPriceId = process.env.STRIPE_TEAM_PRICE_ID;
  if (!teamPriceId) {
    throw new Error("STRIPE_TEAM_PRICE_ID is missing");
  }
  return getPricing(teamPriceId, locale);
}
