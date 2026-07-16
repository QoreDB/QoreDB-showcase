"use client";

import { motion } from "framer-motion";
import { Check, FileText, Loader2, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { subscribeNewsletter } from "@/actions/subscribe-newsletter";

export function NewsletterCard({
  locale,
  source,
}: {
  locale: string;
  source: string;
}) {
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
      const result = await subscribeNewsletter(
        {
          email,
          address: honeypot,
          source: source,
        },
        locale,
      );

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || t("newsletter_page.error"));
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--q-border)/60 bg-linear-to-br from-(--q-bg-1) to-(--q-bg-2)/45 p-6 sm:p-8 mt-12 mb-8">
      {/* Background orbs */}
      <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-linear-to-br from-(--q-accent)/10 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-linear-to-br from-purple-500/5 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-(--q-accent-soft) px-3 py-1 text-xs font-semibold text-(--q-accent-strong)">
            <Mail className="size-3.5" />
            Newsletter
          </div>
          <h4 className="font-heading text-xl font-bold text-(--q-text-0) !m-0">
            {locale === "fr"
              ? "Restez informé des nouveautés"
              : "Stay updated on new releases"}
          </h4>
          <p className="text-sm text-(--q-text-1) leading-relaxed !m-0">
            {locale === "fr"
              ? "Rejoignez notre newsletter pour recevoir les mises à jour majeures, les nouveaux drivers et nos coulisses techniques."
              : "Subscribe to get product releases, new drivers notifications, and technical tutorials."}
          </p>

          {/* Lead Magnet Banner */}
          <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
            <FileText className="size-3.5" />
            <span>
              {locale === "fr"
                ? "🎁 Bonus : Recevez notre fiche mémo d'optimisation SQL & SQLite (PDF) !"
                : "🎁 Bonus: Get our free SQL & SQLite Optimization Cheat Sheet (PDF)!"}
            </span>
          </div>
        </div>

        <div className="w-full md:max-w-xs shrink-0">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm font-medium text-emerald-500"
            >
              <Check className="h-4 w-4 shrink-0" />
              <span>{t("newsletter_page.success")}</span>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter_page.placeholder")}
                className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-2.5 text-sm text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:outline-none transition-colors"
              />

              {/* Honeypot */}
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--q-text-0) text-(--q-bg-0) px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t("newsletter_page.cta")
                )}
              </button>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
