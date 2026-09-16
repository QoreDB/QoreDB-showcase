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
    pathname: "/plugins/submit",
    title: t("marketplace.submit.title"),
    description: t("marketplace.submit.subtitle"),
  });
}

export default async function PluginSubmitPage({
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
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="q-container pt-28 lg:pt-36"
        >
          <section className="q-page-header !pt-0 mb-10">
            <div className="max-w-3xl">
              <Link
                href={`/${locale}/plugins`}
                className="mb-8 inline-flex items-center gap-1.5 text-sm text-(--q-text-2) transition-colors hover:text-(--q-text-0)"
              >
                <ArrowLeft size={14} />
                {t("marketplace.detail.back")}
              </Link>
              <span className="q-eyebrow mb-4 block">
                {t("marketplace.eyebrow")}
              </span>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-(--q-text-0) sm:text-4xl lg:text-5xl">
                {t("marketplace.submit.title")}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
                {t("marketplace.submit.subtitle")}
              </p>
            </div>
          </section>

          <section className="pb-24">
            <div className="max-w-3xl">
              <SubmissionForm />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </TranslationsProvider>
  );
}
