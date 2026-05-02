"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Monitor, Shield, Zap } from "lucide-react";
import Image from "next/image";
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
      <motion.h1
        className="font-heading text-(--q-text-0) text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-8 tracking-tight text-center max-w-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
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
      </motion.h1>

      <motion.p
        className="text-(--q-text-1) text-base sm:text-lg md:text-xl mb-12 max-w-2xl leading-relaxed text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Trans
          i18nKey="hero.subtitle"
          components={{
            highlight: <span className="text-(--q-text-0) font-medium" />,
          }}
        />
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/${locale}/download`)}
          className="group relative flex items-center justify-center gap-3 px-8 py-3 rounded-xl
            bg-linear-to-br from-(--q-accent) to-(--q-accent-strong)
            text-white font-bold text-lg
            shadow-[0_20px_40px_-15px_color-mix(in_srgb,var(--q-accent)_50%,transparent)]
            hover:shadow-[0_30px_60px_-12px_color-mix(in_srgb,var(--q-accent)_70%,transparent)]
            border border-white/10 backdrop-blur-sm
            overflow-hidden transition-all duration-300"
        >
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
          <span className="relative z-10">{t("hero.cta.download_core")}</span>
          <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
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
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-6 justify-center mb-16 text-sm text-(--q-text-2)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
      </motion.div>

      {/* Single hero screenshot */}
      <motion.div
        className="relative w-full max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-(--q-accent)/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative rounded-2xl border border-(--q-border) overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] bg-(--q-bg-1)">
          <div className="relative aspect-16/10">
            <Image
              src="/images/screenshots/query-screen.png"
              alt="QoreDB SQL Editor"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 960px"
              preload
              fetchPriority="high"
            />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
