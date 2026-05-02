import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { DownloadSection } from "@/components/download/download-section";
import { NextSteps } from "@/components/download/next-steps";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import TranslationsProvider from "@/components/TranslationsProvider";
import { buildPageMetadata } from "@/lib/seo";

const i18nNamespaces = ["common"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  return buildPageMetadata({
    locale,
    pathname: "/download",
    title: t("download.title", "Download QoreDB"),
    description: t(
      "download.subtitle",
      "Get the latest version of QoreDB for your operating system.",
    ),
  });
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources } = await getTranslation(locale, "common");

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />
        <DownloadSection />
        <NextSteps />
        <Footer />
      </main>
    </TranslationsProvider>
  );
}
