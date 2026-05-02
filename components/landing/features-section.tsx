"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Combine,
  Database,
  FolderKanban,
  Gauge,
  History,
  Layers,
  Lock,
  Shield,
  Table,
  Terminal,
  Zap,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

const featureIcons = {
  unified: Database,
  workspaces: FolderKanban,
  time_travel: History,
  ddl: Table,
  vault: Shield,
  ssh: Lock,
  editor: Terminal,
  envs: Layers,
  grid: Zap,
  ai: Brain,
  federation: Combine,
  performance: Gauge,
};

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = (
    Object.keys(featureIcons) as Array<keyof typeof featureIcons>
  ).map((key) => ({
    key,
    icon: featureIcons[key],
    title: t(`features.items.${key}.title`),
    description: t(`features.items.${key}.desc`),
  }));

  return (
    <section id="features" className="relative z-10 py-24 px-6 bg-(--q-bg-0)">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
            {t("features.eyebrow")}
          </span>

          <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            <Trans
              i18nKey="features.title"
              components={{
                accent: <span className="text-(--q-accent)" />,
                relative: <span className="relative" />,
                underline: (
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 8 Q50 0 100 8"
                      stroke="var(--q-accent)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              }}
            />
          </h2>

          <p className="text-(--q-text-1) text-lg max-w-2xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              className="group relative p-6 rounded-2xl bg-(--q-bg-1) border border-(--q-border) hover:border-(--q-accent)/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              {/* Subtle accent glow on hover */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-(--q-accent)/0 group-hover:bg-(--q-accent)/10 rounded-full blur-2xl transition-all duration-500" />

              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-(--q-accent)/10 flex items-center justify-center mb-4 group-hover:bg-(--q-accent) transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-(--q-accent) group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-(--q-text-0) font-semibold text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-(--q-text-2) text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
