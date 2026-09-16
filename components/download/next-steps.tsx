"use client";

import { ArrowRight, BookOpen, Compass, Plug } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function NextSteps() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const items = [
    {
      icon: Plug,
      href: `/${locale}/docs/getting-started/first-connection`,
      title: t("download.next_steps.first_connection_title"),
      description: t("download.next_steps.first_connection_description"),
    },
    {
      icon: Compass,
      href: `/${locale}/docs/getting-started/interface-tour`,
      title: t("download.next_steps.interface_tour_title"),
      description: t("download.next_steps.interface_tour_description"),
    },
    {
      icon: BookOpen,
      href: `/${locale}/docs`,
      title: t("download.next_steps.full_docs_title"),
      description: t("download.next_steps.full_docs_description"),
    },
  ];

  return (
    <section className="q-container border-t border-(--q-border) py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="">
          <span className="font-mono text-xs text-(--q-accent)">
            {t("download.next_steps.eyebrow")}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.035em] text-(--q-text-0) sm:text-4xl">
            {t("download.next_steps.title")}
          </h2>
          <p className="mt-3 text-(--q-text-2)">
            {t("download.next_steps.description")}
          </p>
        </div>

        <div className="divide-y divide-(--q-border)">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-2 py-6 pr-8 first:pt-0"
              >
                <div className="text-(--q-accent)">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading text-base font-semibold text-(--q-text-0)">
                  {item.title}
                </h3>
                <p className="text-sm text-(--q-text-2)">{item.description}</p>
                <span className="absolute right-0 top-7 inline-flex text-(--q-accent)">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
