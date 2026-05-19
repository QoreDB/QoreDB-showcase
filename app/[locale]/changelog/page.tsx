import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { ReleaseList } from "@/components/changelog/release-list";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { getReleases } from "@/lib/github";
import { buildPageMetadata, getAbsoluteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  const base = buildPageMetadata({
    locale,
    pathname: "/changelog",
    title: t("metadata.changelog_title"),
    description: t("metadata.changelog_description"),
  });

  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: {
        "application/rss+xml": getAbsoluteUrl("/changelog.rss"),
      },
    },
  };
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");
  const releases = await getReleases();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none -z-10" />

      <Header />

      <main className="flex-grow container relative mx-auto px-4 pt-32 pb-20 z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("changelog.title", "Changelog")}
            </h1>
            <p className="text-xl text-(--q-text-1) max-w-2xl mx-auto">
              {t(
                "changelog.subtitle",
                "Stay up to date with the latest changes and improvements to QoreDB.",
              )}
            </p>
          </div>

          {/* Releases List */}
          <ReleaseList initialReleases={releases} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
