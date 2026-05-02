"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FallbackBanner() {
  const { t } = useTranslation();
  return (
    <div className="not-prose mb-6 flex items-start gap-3 rounded-lg border border-(--q-accent)/30 bg-(--q-accent-soft) px-4 py-3">
      <Languages className="mt-0.5 size-4 shrink-0 text-(--q-accent-strong)" />
      <div className="text-sm">
        <p className="font-medium text-(--q-text-0)">
          {t("docs.fallback_banner_title")}
        </p>
        <p className="mt-0.5 text-(--q-text-2)">
          {t("docs.fallback_banner_body")}
        </p>
      </div>
    </div>
  );
}
