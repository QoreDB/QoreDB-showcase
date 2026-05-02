"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Github } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function CTASection() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "fr";

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-(--q-accent)/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-(--q-accent)/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        className="max-w-3xl mx-auto text-center relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
          {t("cta.title")}
        </h2>
        <p className="text-(--q-text-1) text-lg sm:text-xl mb-12 max-w-xl mx-auto">
          {t("cta.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/download`}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl
							bg-linear-to-br from-(--q-accent) to-(--q-accent-strong)
							text-white font-bold text-lg
							shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)]
							hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]
							border border-white/10 overflow-hidden
							transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            />
            <span className="relative z-10">{t("cta.download_button")}</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com/QoreDB/QoreDB"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl
							border-2 border-(--q-border) hover:border-(--q-text-2) bg-(--q-bg-0)/50
							text-(--q-text-0) font-semibold text-lg
							transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" />
            {t("cta.github_button")}
          </a>
        </div>

        <div className="mt-8">
          <Link
            href={`/${locale}/docs`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
          >
            <BookOpen className="size-4" />
            {t("cta.docs_link")}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
