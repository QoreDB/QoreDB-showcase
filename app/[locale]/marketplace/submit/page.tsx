import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { SubmissionForm } from "@/components/marketplace/submission-form";
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
    pathname: "/marketplace/submit",
    title: t("marketplace.submit.title"),
    description: t("marketplace.submit.subtitle"),
  });
}

export default async function MarketplaceSubmitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { resources, t } = await getTranslation(locale, "common");

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <section className="mx-auto max-w-3xl px-4 pt-32 pb-16 sm:px-6 lg:px-12">
          <Link
            href={`/${locale}/marketplace`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-(--q-text-2) hover:text-(--q-text-0)"
          >
            <ArrowLeft size={14} />
            {t("marketplace.detail.back")}
          </Link>
          <header className="mb-10 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-(--q-text-0) sm:text-4xl">
              {t("marketplace.submit.title")}
            </h1>
            <p className="max-w-2xl text-base text-(--q-text-1)">
              {t("marketplace.submit.subtitle")}
            </p>
          </header>
          <SubmissionForm />
        </section>
        <Footer />
      </main>
    </TranslationsProvider>
  );
}
