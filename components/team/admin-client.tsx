"use client";

import { Copy, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

type Seat = {
  email: string;
  status: "active" | "removed";
  claimedAt: string;
};

type TeamData = {
  cap: number;
  seats: Seat[];
  joinLink: string;
};

export function TeamAdminClient({ token }: { token: string | null }) {
  const { t } = useTranslation();
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/seats/admin?token=${encodeURIComponent(token)}`,
      );
      if (!response.ok) {
        setUnauthorized(true);
        return;
      }
      setData((await response.json()) as TeamData);
    } catch {
      setUnauthorized(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (email: string) => {
    if (!token) return;
    setBusyEmail(email);
    setActionError(null);
    try {
      const response = await fetch("/api/seats/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", email, adminToken: token }),
      });
      if (!response.ok) {
        setActionError(t("team_seats.admin.error"));
        return;
      }
      await load();
    } catch {
      setActionError(t("team_seats.admin.error"));
    } finally {
      setBusyEmail(null);
    }
  };

  const rotate = async () => {
    if (!token) return;
    setRotating(true);
    setActionError(null);
    try {
      const response = await fetch("/api/seats/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rotate", adminToken: token }),
      });
      if (!response.ok) {
        setActionError(t("team_seats.admin.error"));
        return;
      }
      const result = (await response.json()) as { joinLink: string };
      setData((prev) => (prev ? { ...prev, joinLink: result.joinLink } : prev));
    } catch {
      setActionError(t("team_seats.admin.error"));
    } finally {
      setRotating(false);
    }
  };

  const copyJoinLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.joinLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible : ignorer silencieusement
    }
  };

  const activeCount =
    data?.seats.filter((s) => s.status === "active").length ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-12 pt-32 pb-20">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t("team_seats.admin.title")}
          </h1>
          <p className="mt-2 text-(--q-text-1)">
            {t("team_seats.admin.subtitle")}
          </p>

          {loading ? (
            <div className="mt-8 flex items-center gap-2 text-(--q-text-2)">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("team_seats.admin.loading")}
            </div>
          ) : unauthorized || !data ? (
            <p className="mt-8 rounded-xl border border-amber-400/40 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              {t("team_seats.admin.unauthorized")}
            </p>
          ) : (
            <>
              <p className="mt-6 text-sm text-(--q-text-2)">
                {t("team_seats.admin.cap_label")} : {activeCount} / {data.cap}{" "}
                {t("team_seats.admin.used_label")}
              </p>

              <div className="mt-6">
                <h2 className="text-sm font-semibold text-(--q-text-0)">
                  {t("team_seats.admin.seats_heading")}
                </h2>
                {data.seats.length === 0 ? (
                  <p className="mt-3 text-sm text-(--q-text-2)">
                    {t("team_seats.admin.empty")}
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-(--q-border) rounded-xl border border-(--q-border)">
                    {data.seats.map((seat) => (
                      <li
                        key={seat.email}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-(--q-text-0)">
                            {seat.email}
                          </p>
                          <span
                            className={`text-xs ${
                              seat.status === "active"
                                ? "text-emerald-500"
                                : "text-(--q-text-2)"
                            }`}
                          >
                            {seat.status === "active"
                              ? t("team_seats.admin.status_active")
                              : t("team_seats.admin.status_removed")}
                          </span>
                        </div>
                        {seat.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => remove(seat.email)}
                            disabled={busyEmail === seat.email}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-(--q-border) px-3 py-1.5 text-xs font-medium text-(--q-text-1) transition hover:border-red-400/50 hover:text-red-500 disabled:opacity-50"
                          >
                            {busyEmail === seat.email ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            {t("team_seats.admin.remove")}
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-semibold text-(--q-text-0)">
                  {t("team_seats.admin.join_link_label")}
                </h2>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    readOnly
                    value={data.joinLink}
                    className="w-full truncate rounded-xl border border-(--q-border) bg-(--q-bg-0) px-3 py-2 text-xs text-(--q-text-1)"
                  />
                  <button
                    type="button"
                    onClick={copyJoinLink}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-(--q-border) px-3 py-2 text-xs font-medium hover:border-(--q-accent)/40"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied
                      ? t("team_seats.admin.copied")
                      : t("team_seats.admin.copy")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={rotate}
                  disabled={rotating}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-(--q-text-2) transition hover:text-(--q-accent) disabled:opacity-50"
                >
                  {rotating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {t("team_seats.admin.rotate")}
                </button>
              </div>

              {actionError ? (
                <p className="mt-4 text-sm text-red-500">{actionError}</p>
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
