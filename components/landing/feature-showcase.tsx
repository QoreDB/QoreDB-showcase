"use client";

import { motion } from "framer-motion";
import { Check, GitBranch, LifeBuoy, Network } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const features = [
  {
    key: "sandbox",
    image: "/images/features/sandbox.webp",
    icon: GitBranch,
    color: "text-(--q-accent)",
    colorBg: "bg-(--q-accent)/10",
    colorBorder: "border-(--q-accent)/30",
    checkColor: "text-(--q-accent)",
    checkBg: "bg-(--q-accent)/10",
    listKeys: [
      "features.killer.sandbox.list.local",
      "features.killer.sandbox.list.diff",
      "features.killer.sandbox.list.script",
    ],
    pro: true,
  },
  {
    key: "federation",
    image: "/images/features/federation.webp",
    icon: Network,
    color: "text-blue-500",
    colorBg: "bg-blue-500/10",
    colorBorder: "border-blue-500/30",
    checkColor: "text-blue-500",
    checkBg: "bg-blue-500/10",
    listKeys: [
      "features.killer.federation.list.join",
      "features.killer.federation.list.engine",
      "features.killer.federation.list.nowarehouse",
    ],
    pro: true,
  },
  {
    key: "safety_net",
    image: "/images/features/query-safety.webp",
    icon: LifeBuoy,
    color: "text-emerald-500",
    colorBg: "bg-emerald-500/10",
    colorBorder: "border-emerald-500/30",
    checkColor: "text-emerald-500",
    checkBg: "bg-emerald-500/10",
    listKeys: [
      "features.killer.safety_net.list.detect",
      "features.killer.safety_net.list.env",
      "features.killer.safety_net.list.audit",
    ],
    pro: false,
  },
];

export function FeatureShowcase() {
  const { t } = useTranslation();

  return (
    <section id="preview" className="relative z-10 py-24 px-6 bg-(--q-bg-1)">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-(--q-accent) text-sm font-medium tracking-widest uppercase mb-4">
            {t("feature_showcase.eyebrow")}
          </span>
          <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t("feature_showcase.title")}
          </h2>
        </motion.div>

        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const imageLeft = index % 2 === 0;

            return (
              <motion.div
                key={feature.key}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                {/* Image */}
                <div
                  className={`relative group ${imageLeft ? "order-1" : "order-1 lg:order-2"}`}
                >
                  <Image
                    src={feature.image}
                    alt={t(`features.killer.${feature.key}.title`)}
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-xl"
                    sizes="(max-width: 1024px) 100vw, 544px"
                  />
                </div>

                {/* Text */}
                <div
                  className={`${imageLeft ? "order-2" : "order-2 lg:order-1"}`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${feature.colorBg} ${feature.color} text-xs font-medium tracking-wide uppercase border ${feature.colorBorder}`}
                    >
                      <Icon className="w-3 h-3" />
                      {t(`features.killer.${feature.key}.badge`)}
                    </div>
                    {feature.pro && (
                      <span className="inline-flex rounded-full bg-[#6B5CFF]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#6B5CFF] border border-[#6B5CFF]/20">
                        Pro
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-(--q-text-0) mb-4">
                    {t(`features.killer.${feature.key}.title`)}
                  </h3>

                  <p className="text-(--q-text-1) text-base leading-relaxed mb-8">
                    {t(`features.killer.${feature.key}.desc`)}
                  </p>

                  <ul className="space-y-3">
                    {feature.listKeys.map((key) => (
                      <li key={key} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full ${feature.checkBg} flex items-center justify-center shrink-0`}
                        >
                          <Check className={`w-3 h-3 ${feature.checkColor}`} />
                        </div>
                        <span className="text-(--q-text-1) text-sm">
                          {t(key)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
