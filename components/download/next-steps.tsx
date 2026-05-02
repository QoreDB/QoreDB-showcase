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
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-(--q-accent-strong)">
            {t("download.next_steps.eyebrow")}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-(--q-text-0) sm:text-4xl">
            {t("download.next_steps.title")}
          </h2>
          <p className="mt-3 text-(--q-text-2)">
            {t("download.next_steps.description")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-3 rounded-xl border border-(--q-border) bg-(--q-bg-1)/50 p-6 transition-all hover:-translate-y-0.5 hover:border-(--q-accent)/40 hover:shadow-md"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-(--q-accent-soft) text-(--q-accent-strong)">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading text-base font-semibold text-(--q-text-0)">
                  {item.title}
                </h3>
                <p className="text-sm text-(--q-text-2)">{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-(--q-accent) group-hover:text-(--q-accent-strong)">
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
