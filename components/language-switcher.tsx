"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type AppLocale,
  LOCALE_LABELS,
  localizePathname,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "@/lib/locale";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLocale = normalizeLocale(i18n.language);
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: AppLocale) => {
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;
    router.push(
      localizePathname(currentPathname, currentLocale, newLocale) +
        window.location.search +
        window.location.hash,
    );

    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-11 gap-2 px-2.5">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">
            {currentLocale}
          </span>
          <span className="sr-only">{t("language_switcher.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleChange(locale)}
            className="flex items-center justify-between gap-3 cursor-pointer py-3"
          >
            <span className="font-medium">{LOCALE_LABELS[locale]}</span>
            <span className="text-xs uppercase text-(--q-text-2)">
              {locale}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
