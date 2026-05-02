"use client";

import { useTranslation } from "react-i18next";
import { getIntlLocale } from "@/lib/locale";

export function LastUpdated({
  iso,
  locale,
}: {
  iso: string | null;
  locale: string;
}) {
  const { t } = useTranslation();
  if (!iso) return null;
  const date = new Date(iso);
  const formatted = new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return (
    <p className="mt-2 text-xs text-(--q-text-2)">
      {t("docs.last_updated", { date: formatted })}
    </p>
  );
}
