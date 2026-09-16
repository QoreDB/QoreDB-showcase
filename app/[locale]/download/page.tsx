import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { DownloadSection } from "@/components/download/download-section";
import { NextSteps } from "@/components/download/next-steps";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { DownloadProvider } from "@/contexts/DownloadProvider";
import { buildPageMetadata } from "@/lib/seo";

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

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main id="main-content" tabIndex={-1}>
        <DownloadProvider>
          <DownloadSection />
        </DownloadProvider>
        <NextSteps />
      </main>
      <Footer />
    </div>
  );
}
