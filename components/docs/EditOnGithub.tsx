"use client";

import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

const GITHUB_REPO = "https://github.com/QoreDB/QoreDB-showcase";
const BRANCH = "main";

export function EditOnGithub({ relativePath }: { relativePath: string }) {
  const { t } = useTranslation();
  const url = `${GITHUB_REPO}/edit/${BRANCH}/${relativePath}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-(--q-text-2) hover:text-(--q-text-0) transition-colors"
    >
      <Pencil className="size-3.5" />
      {t("docs.edit_on_github")}
    </a>
  );
}
