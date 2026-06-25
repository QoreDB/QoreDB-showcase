import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { TeamJoinClient } from "@/components/team/join-client";
import { normalizeLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");
  return buildPageMetadata({
    locale,
    pathname: "/team/join",
    title: t("team_seats.join.title"),
    description: t("team_seats.join.subtitle"),
    noIndex: true,
  });
}

export default async function TeamJoinPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { token } = await searchParams;
  return (
    <TeamJoinClient locale={normalizeLocale(locale)} token={token ?? null} />
  );
}
