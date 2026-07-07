import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { TeamAdminClient } from "@/components/team/admin-client";
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
    pathname: "/team/admin",
    title: t("team_seats.admin.title"),
    description: t("team_seats.admin.subtitle"),
    noIndex: true,
  });
}

export default async function TeamAdminPage({
  params,
  searchParams,
}: PageProps) {
  await params;
  const { token } = await searchParams;
  return <TeamAdminClient token={token ?? null} />;
}
