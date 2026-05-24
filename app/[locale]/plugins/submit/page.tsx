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
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />

        <section className="relative z-10 px-6 pt-40 pb-12 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--q-border) to-transparent" />
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-(--q-accent)/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-(--q-accent)/5 blur-[120px]" />

          <div className="relative mx-auto max-w-3xl">
            <Link
              href={`/${locale}/plugins`}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-(--q-text-2) transition-colors hover:text-(--q-text-0)"
            >
              <ArrowLeft size={14} />
              {t("marketplace.detail.back")}
            </Link>
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-(--q-accent)">
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

        <section className="relative z-10 bg-(--q-bg-0) px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <SubmissionForm />
          </div>
        </section>

        <Footer />
      </main>
    </TranslationsProvider>
  );
}
