import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/server";

const DAY = 24 * 60 * 60 * 1000;

export type SaleEntry = {
  id: string;
  email: string | null;
  amount: number;
  currency: string;
  createdAt: string;
  livemode: boolean;
};

export type SalesSnapshot = {
  totalSales: number;
  totalRevenueCents: number;
  currency: string;
  salesLast30d: number;
  revenueLast30dCents: number;
  recent: SaleEntry[];
};

function toEntry(session: Stripe.Checkout.Session): SaleEntry {
  return {
    id: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    amount: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toUpperCase(),
    createdAt: new Date(session.created * 1000).toISOString(),
    livemode: session.livemode,
  };
}

export async function getSalesSnapshot(): Promise<SalesSnapshot> {
  const stripe = getStripeClient();
  const cutoff30d = Math.floor((Date.now() - 30 * DAY) / 1000);
  const all: SaleEntry[] = [];

  // 100 most recent succeeded sessions. Production volume currently fits.
  let startingAfter: string | undefined;
  for (let page = 0; page < 5; page++) {
    const list: Stripe.ApiList<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.list({
        limit: 100,
        starting_after: startingAfter,
      });
    for (const session of list.data) {
      if (session.payment_status !== "paid") continue;
      all.push(toEntry(session));
    }
    if (!list.has_more) break;
    startingAfter = list.data.at(-1)?.id;
    if (!startingAfter) break;
  }

  let totalRevenue = 0;
  let revenue30d = 0;
  let count30d = 0;
  for (const s of all) {
    totalRevenue += s.amount;
    if (s.createdAt && new Date(s.createdAt).getTime() / 1000 >= cutoff30d) {
      revenue30d += s.amount;
      count30d += 1;
    }
  }

  const currency = all[0]?.currency ?? "EUR";

  return {
    totalSales: all.length,
    totalRevenueCents: totalRevenue,
    currency,
    salesLast30d: count30d,
    revenueLast30dCents: revenue30d,
    recent: all.slice(0, 25),
  };
}
