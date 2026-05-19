"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { joinTeamWaitlist } from "@/actions/join-team-waitlist";

export function TeamWaitlistForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await joinTeamWaitlist({
        email,
        address: honeypot,
        source: "pricing-page",
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? t("team_waitlist.error"));
      }
    });
  };

  if (submitted) {
    return (
      <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-500">
        <Check className="h-4 w-4" />
        {t("team_waitlist.success")}
      </div>
    );
  }

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("team_waitlist.placeholder")}
        className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:outline-none transition-colors"
        aria-label={t("team_waitlist.placeholder")}
      />
      <input
        type="text"
        name="address"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--q-text-0) text-(--q-bg-0) px-4 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("team_waitlist.cta")
        )}
      </button>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </form>
  );
}
