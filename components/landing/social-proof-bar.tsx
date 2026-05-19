"use client";

import { motion } from "framer-motion";
import { Download, Star, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useTranslation } from "react-i18next";
import socialStats from "@/lib/data/social-stats.json";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type StatItem = {
  key: "downloads" | "stars" | "releases";
  icon: IconType;
  href: (locale: string) => string;
  external?: boolean;
  values: Record<string, string | number>;
};

const items: StatItem[] = [
  {
    key: "downloads",
    icon: Download,
    href: (locale) => `/${locale}/download`,
    values: { value: socialStats.downloads_display },
  },
  {
    key: "stars",
    icon: Star,
    href: () => "https://github.com/QoreDB/QoreDB",
    external: true,
    values: { count: socialStats.stars },
  },
  {
    key: "releases",
    icon: Tag,
    href: (locale) => `/${locale}/changelog`,
    values: {
      count: socialStats.releases_total,
      months: socialStats.releases_months_active,
    },
  },
];

function Cell({ icon: Icon, label }: { icon: IconType; label: string }) {
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap">
      <Icon className="w-4 h-4 text-(--q-accent) shrink-0" />
      <span className="text-sm font-medium text-(--q-text-1) group-hover:text-(--q-text-0) transition-colors">
        {label}
      </span>
    </span>
  );
}

export function SocialProofBar() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <motion.section
      aria-label={t("social_proof.aria_label")}
      className="relative z-10 py-8 bg-(--q-bg-0)"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-center items-center gap-2 sm:gap-0 flex-wrap sm:flex-nowrap">
          {items.map((item, index) => {
            const label = t(`social_proof.${item.key}`, item.values);
            const wrapperClass = `group inline-flex px-4 sm:px-8 ${
              index < items.length - 1
                ? "sm:border-r sm:border-(--q-border)"
                : ""
            }`;
            return item.external ? (
              <a
                key={item.key}
                href={item.href(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className={wrapperClass}
              >
                <Cell icon={item.icon} label={label} />
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href(locale)}
                className={wrapperClass}
              >
                <Cell icon={item.icon} label={label} />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
