"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

type JoinState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; messageKey: string };

export function TeamJoinClient({
  locale,
  token,
}: {
  locale: string;
  token: string | null;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<JoinState>({ kind: "idle" });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setState({ kind: "error", messageKey: "team_seats.join.missing_token" });
      return;
    }
    setState({ kind: "loading" });
    try {
      const response = await fetch("/api/seats/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinToken: token, email }),
      });
      if (response.ok) {
        setState({ kind: "success" });
        return;
      }
      if (response.status === 409) {
        setState({ kind: "error", messageKey: "team_seats.join.cap_reached" });
        return;
      }
      if (response.status === 401) {
        setState({ kind: "error", messageKey: "team_seats.join.invalid_link" });
        return;
      }
      setState({ kind: "error", messageKey: "team_seats.join.error" });
    } catch {
      setState({ kind: "error", messageKey: "team_seats.join.error" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-12 pt-32 pb-20">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t("team_seats.join.title")}
          </h1>

          {state.kind === "success" ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2 text-emerald-500">
                <Check className="h-5 w-5" />
                <h2 className="font-semibold text-(--q-text-0)">
                  {t("team_seats.join.success_title")}
                </h2>
              </div>
              <p className="mt-2 text-sm text-(--q-text-1)">
                {t("team_seats.join.success_body")}
              </p>
              <a
                href={`/${locale}/download`}
                className="mt-4 inline-flex rounded-xl border border-(--q-border) px-4 py-2 text-sm font-medium hover:border-(--q-accent)/40"
              >
                {t("pricing_page.core.cta")}
              </a>
            </div>
          ) : (
            <>
              <p className="mt-2 text-(--q-text-1)">
                {t("team_seats.join.subtitle")}
              </p>
              {!token ? (
                <p className="mt-6 rounded-xl border border-amber-400/40 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                  {t("team_seats.join.missing_token")}
                </p>
              ) : (
                <form className="mt-6 space-y-3" onSubmit={onSubmit}>
                  <label
                    htmlFor="seat-email"
                    className="block text-sm text-(--q-text-2)"
                  >
                    {t("team_seats.join.email_label")}
                  </label>
                  <input
                    id="seat-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("team_seats.join.email_placeholder")}
                    className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={state.kind === "loading"}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-(--q-accent) text-white px-4 py-3 font-semibold transition hover:bg-(--q-accent-strong) disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {state.kind === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("team_seats.join.submit")
                    )}
                  </button>
                  {state.kind === "error" ? (
                    <p className="text-sm text-red-500">
                      {t(state.messageKey)}
                    </p>
                  ) : null}
                </form>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
