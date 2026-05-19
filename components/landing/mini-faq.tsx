"use client";

import { motion } from "framer-motion";
import { CreditCard, GitBranch, ShieldCheck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useTranslation } from "react-i18next";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const items: { key: "privacy" | "oss" | "no_subscription"; icon: IconType }[] =
  [
    { key: "privacy", icon: ShieldCheck },
    { key: "oss", icon: GitBranch },
    { key: "no_subscription", icon: CreditCard },
  ];

export function MiniFaq() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-12 px-6 bg-(--q-bg-0)">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="rounded-2xl border border-(--q-border) bg-(--q-bg-1)/50 p-5 hover:border-(--q-accent)/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-lg bg-(--q-accent)/10 p-2 text-(--q-accent)">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-(--q-text-0)">
                      {t(`mini_faq.${item.key}.question`)}
                    </p>
                    <p className="text-sm text-(--q-text-1) mt-1 leading-relaxed">
                      {t(`mini_faq.${item.key}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
