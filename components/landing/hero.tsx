"use client";

import {
  ArrowRight,
  BookOpen,
  Github,
  Monitor,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";
import { LineShadowText } from "@/components/line-shadow-text";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "fr";

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 pt-32 pb-20 overflow-hidden w-full">
      {/* h1 : élément FCP/LCP texte — rendu visible immédiatement, aucune
          animation pilotée par JS qui retarderait le premier rendu. */}
      <h1 className="font-heading text-(--q-text-0) text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8 tracking-tight text-center max-w-5xl">
        <Trans
          i18nKey="hero.title"
          components={{
            br: <br />,
            italic: (
              <LineShadowText
                className="italic font-light whitespace-nowrap"
                shadowColor="var(--q-accent)"
              />
            ),
          }}
        />
      </h1>

      {/* Éléments secondaires : entrée en CSS pur (tourne au premier paint,
          sans attendre l'hydratation) → n'impacte ni le FCP ni le LCP. */}
      <p
        className="q-fade-up text-(--q-text-1) text-base sm:text-lg md:text-xl mb-12 max-w-2xl leading-relaxed text-center"
        style={{ animationDelay: "80ms" }}
      >
        <Trans
          i18nKey="hero.subtitle"
          components={{
            highlight: <span className="text-(--q-text-0) font-medium" />,
          }}
        />
      </p>

      <div
        className="q-fade-up flex flex-col sm:flex-row gap-4 mb-8"
        style={{ animationDelay: "160ms" }}
      >
        <button
          type="button"
          onClick={() => router.push(`/${locale}/download`)}
          className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-xl
            bg-linear-to-br from-(--q-accent) to-(--q-accent-strong)
            text-white font-bold text-lg
            shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)]
            hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]
            border border-white/10 backdrop-blur-sm
            overflow-hidden transition-all duration-300
            hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <span className="relative z-10">{t("hero.cta.download_core")}</span>
          <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            window.open("https://github.com/QoreDB/QoreDB", "_blank")
          }
          className="group border-2 border-(--q-border) hover:border-(--q-text-2) bg-(--q-bg-0)/50 backdrop-blur-sm
            text-(--q-text-0) px-8 py-6 rounded-xl text-base font-medium
            flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
        >
          <Github className="w-5 h-5" />
          {t("hero.cta.discover_pro")}
        </Button>
      </div>

      <div className="q-fade-up mb-12" style={{ animationDelay: "220ms" }}>
        <Link
          href={`/${locale}/docs`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
        >
          <BookOpen className="size-4" />
          {t("hero.cta.read_docs")}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div
        className="q-fade-up flex flex-wrap gap-6 justify-center mb-16 text-sm text-(--q-text-2)"
        style={{ animationDelay: "280ms" }}
      >
        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-(--q-accent)" />
          {t("hero.meta.rust")}
        </span>
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-(--q-accent)" />
          {t("hero.meta.license")}
        </span>
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-(--q-accent)" />
          {t("hero.meta.platforms")}
        </span>
      </div>

      {/* Single hero screenshot — élément LCP. Animation d'entrée en CSS pur
          (démarre au premier paint, sans attendre l'hydratation) et SANS delay
          → le LCP n'est quasiment pas impacté, contrairement à l'ancienne
          animation framer-motion qui gardait l'image en opacity:0 jusqu'au JS. */}
      <div className="q-fade-up relative w-full max-w-5xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-(--q-accent)/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative">
          <div className="relative aspect-[2782/1838]">
            <Image
              src="/images/screenshots/landing.webp"
              alt="QoreDB SQL Editor"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
