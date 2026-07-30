"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import testimonials from "@/lib/data/testimonials.json";

export type Testimonial = {
  id: string;
  quote: string;
  quotes?: Record<string, string>;
  name: string;
  role: string;
  roles?: Record<string, string>;
  avatar?: string;
  /** Optional 2-letter locale gate ("fr", "en"). If set, only shown for that locale. */
  lang?: string;
  /** Optional public link (LinkedIn, Twitter, etc.) to make the quote verifiable. */
  handle?: string;
};

function visibleFor(locale: string, list: Testimonial[]): Testimonial[] {
  return list.filter((t) => !t.lang || t.lang === locale);
}

export function Testimonials({ locale }: { locale: string }) {
  const { t } = useTranslation();
  const all = testimonials as Testimonial[];
  const list = visibleFor(locale, all);
  if (list.length === 0) return null;

  return (
    <section className="relative z-10 py-24 px-6 bg-(--q-bg-0)">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            {t("testimonials.title")}
          </h2>
          <p className="text-(--q-text-1)">{t("testimonials.subtitle")}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {list.map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-6 flex flex-col gap-4"
            >
              <Quote className="w-5 h-5 text-(--q-accent) shrink-0" />
              <blockquote className="text-sm text-(--q-text-1) leading-relaxed whitespace-pre-line">
                {item.quotes?.[locale] || item.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto pt-2 border-t border-(--q-border)/50">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-9 h-9"
                  />
                ) : (
                  <span className="rounded-full bg-(--q-accent)/10 text-(--q-accent) w-9 h-9 inline-flex items-center justify-center font-semibold text-sm">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--q-text-0) truncate">
                    {item.handle ? (
                      <a
                        href={item.handle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-(--q-accent) transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="text-xs text-(--q-text-2) truncate">
                    {item.roles?.[locale] || item.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
