import { Github, Heart, Star } from "lucide-react";
import type { Metadata } from "next";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { OssProgramForm } from "@/components/oss/oss-program-form";
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
    pathname: "/oss-program",
    title: t("oss_program.title"),
    description: t("oss_program.subtitle"),
  });
}

export default async function OssProgramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "common");

  const eligibility = [
    {
      icon: Star,
      title: t("oss_program.eligibility.stars_title"),
      body: t("oss_program.eligibility.stars_body"),
    },
    {
      icon: Github,
      title: t("oss_program.eligibility.maintainer_title"),
      body: t("oss_program.eligibility.maintainer_body"),
    },
    {
      icon: Heart,
      title: t("oss_program.eligibility.spirit_title"),
      body: t("oss_program.eligibility.spirit_body"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-10">
            <p className="inline-flex rounded-full bg-(--q-accent)/10 text-(--q-accent) px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {t("oss_program.badge")}
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
              {t("oss_program.title")}
            </h1>
            <p className="mt-4 text-(--q-text-1) text-lg">
              {t("oss_program.subtitle")}
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {eligibility.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--q-border) bg-(--q-bg-1) p-5"
                >
                  <span className="inline-flex rounded-lg bg-(--q-accent)/10 p-2 text-(--q-accent)">
                    <Icon className="w-4 h-4" />
                  </span>
                  <h2 className="mt-3 text-sm font-semibold text-(--q-text-0)">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-(--q-text-1)">{item.body}</p>
                </div>
              );
            })}
          </section>

          <section className="rounded-3xl border border-(--q-border) bg-(--q-bg-1) p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4">
              {t("oss_program.form_title")}
            </h2>
            <OssProgramForm />
          </section>

          <p className="mt-6 text-xs text-(--q-text-2) text-center">
            {t("oss_program.review_note")}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
