import { notFound } from "next/navigation";
import { getSalesSnapshot } from "@/lib/admin/sales";
import socialStats from "@/lib/data/social-stats.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Sales · Admin",
  robots: { index: false, follow: false },
};

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const adminToken = process.env.ADMIN_DASHBOARD_TOKEN;
  if (!adminToken) {
    return (
      <main className="min-h-screen bg-(--q-bg-0) text-(--q-text-0) p-12">
        <h1 className="text-2xl font-bold">Admin dashboard not configured</h1>
        <p className="mt-3 text-sm text-(--q-text-2)">
          Set <code>ADMIN_DASHBOARD_TOKEN</code> in your environment and access
          via <code>/admin/sales?token=…</code>.
        </p>
      </main>
    );
  }

  const params = await searchParams;
  if (params.token !== adminToken) {
    notFound();
  }

  let snapshot: Awaited<ReturnType<typeof getSalesSnapshot>> | null = null;
  let error: string | null = null;
  try {
    snapshot = await getSalesSnapshot();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch sales";
  }

  const downloadsTotal = socialStats.downloads_raw;
  const stars = socialStats.stars;
  const conversion =
    snapshot && downloadsTotal > 0
      ? (snapshot.totalSales / downloadsTotal) * 100
      : null;

  return (
    <main className="min-h-screen bg-(--q-bg-0) text-(--q-text-0) p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-(--q-text-2)">
            Admin
          </p>
          <h1 className="text-3xl font-bold">Sales dashboard</h1>
          <p className="text-sm text-(--q-text-2)">
            Live from Stripe + GitHub. Refresh to update.
          </p>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        {snapshot ? (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card
                label="Sales (all time)"
                value={String(snapshot.totalSales)}
              />
              <Card
                label="Revenue (all time)"
                value={formatCurrency(
                  snapshot.totalRevenueCents,
                  snapshot.currency,
                )}
              />
              <Card label="Sales (30d)" value={String(snapshot.salesLast30d)} />
              <Card
                label="Revenue (30d)"
                value={formatCurrency(
                  snapshot.revenueLast30dCents,
                  snapshot.currency,
                )}
              />
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card
                label="Downloads (cumulative)"
                value={String(downloadsTotal)}
              />
              <Card label="GitHub stars" value={String(stars)} />
              <Card
                label="Conversion (sales / downloads)"
                value={conversion != null ? `${conversion.toFixed(3)}%` : "—"}
              />
              <Card
                label="Stats fetched at"
                value={new Date(socialStats.fetched_at).toLocaleDateString(
                  "en-US",
                )}
              />
            </section>

            <section className="rounded-2xl border border-(--q-border) overflow-hidden">
              <div className="px-4 py-3 border-b border-(--q-border) flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent sales</h2>
                <span className="text-xs text-(--q-text-2)">
                  {snapshot.recent.length} shown
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-(--q-text-2)">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.recent.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-t border-(--q-border)/50"
                      >
                        <td className="px-4 py-2 text-(--q-text-2)">
                          {formatDate(sale.createdAt)}
                        </td>
                        <td className="px-4 py-2">{sale.email ?? "—"}</td>
                        <td className="px-4 py-2 font-medium">
                          {formatCurrency(sale.amount, sale.currency)}
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 ${
                              sale.livemode
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-(--q-text-2)/10 text-(--q-text-2)"
                            }`}
                          >
                            {sale.livemode ? "live" : "test"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}

        <p className="text-xs text-(--q-text-2)">
          Downloads are cumulative across all releases (no 30-day window
          available from GitHub asset stats). Compare two snapshots over time
          for a real delta.
        </p>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--q-border) bg-(--q-bg-1) p-4">
      <p className="text-xs uppercase tracking-wide text-(--q-text-2)">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-(--q-text-0)">{value}</p>
    </div>
  );
}
