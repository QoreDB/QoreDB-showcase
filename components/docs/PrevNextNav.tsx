"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type LinkRef = { label: string; href: string } | null;

export function PrevNextNav({
  prev,
  next,
}: {
  prev: LinkRef;
  next: LinkRef;
}) {
  const { t } = useTranslation();

  if (!prev && !next) return null;

  return (
    <div className="mt-12 grid gap-3 border-t border-(--q-border) pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-lg border border-(--q-border) p-4 transition-colors hover:border-(--q-accent)/40 hover:bg-(--q-bg-1)"
        >
          <span className="inline-flex items-center gap-1 text-xs text-(--q-text-2)">
            <ArrowLeft className="size-3.5" />
            {t("docs.previous")}
          </span>
          <span className="mt-1 text-sm font-medium text-(--q-text-0) group-hover:text-(--q-accent-strong)">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end rounded-lg border border-(--q-border) p-4 text-right transition-colors hover:border-(--q-accent)/40 hover:bg-(--q-bg-1) sm:col-start-2"
        >
          <span className="inline-flex items-center gap-1 text-xs text-(--q-text-2)">
            {t("docs.next")}
            <ArrowRight className="size-3.5" />
          </span>
          <span className="mt-1 text-sm font-medium text-(--q-text-0) group-hover:text-(--q-accent-strong)">
            {next.label}
          </span>
        </Link>
      ) : null}
    </div>
  );
}
