"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { subscribeNewsletter } from "@/actions/subscribe-newsletter";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export function NewsletterPageClient({ locale }: { locale: string }) {
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
          source: "newsletter-page",
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
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        {/* Floating background orbs */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-(--q-accent) opacity-5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          className="max-w-md w-full mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-3xl border border-(--q-border) bg-(--q-bg-1)/50 backdrop-blur-xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-(--q-accent) via-purple-500 to-(--q-accent)" />

            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-(--q-accent)/10 text-(--q-accent) mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3 font-heading">
                {t("newsletter_page.title")}
              </h1>
              <p className="text-(--q-text-1) text-sm leading-relaxed">
                {t("newsletter_page.subtitle")}
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-emerald-500">
                  {t("newsletter_page.success_title")}
                </h2>
                <p className="text-(--q-text-1) text-sm">
                  {t("newsletter_page.success")}
                </p>
              </motion.div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="email" className="sr-only">
                    {t("newsletter_page.placeholder")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter_page.placeholder")}
                    className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0)/80 px-4 py-3.5 text-sm text-(--q-text-0) placeholder:text-(--q-text-2) focus:border-(--q-accent) focus:ring-4 focus:ring-(--q-accent)/10 focus:outline-none transition-all duration-200"
                  />
                </div>

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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--q-accent) hover:bg-(--q-accent-strong) text-white py-3.5 text-sm font-semibold shadow-lg shadow-(--q-accent)/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("newsletter_page.cta")
                  )}
                </button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 text-center font-medium mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
