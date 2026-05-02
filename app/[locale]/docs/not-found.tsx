"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function DocsNotFound() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  return (
    <div className="docs-prose">
      <h1>{t("docs.not_found_title")}</h1>
      <p>{t("docs.not_found_body")}</p>
      <p>
        <Link href={`/${locale}/docs`}>← {t("docs.landing_title")}</Link>
      </p>
    </div>
  );
}
