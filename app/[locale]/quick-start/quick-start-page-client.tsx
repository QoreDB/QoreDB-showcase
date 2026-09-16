"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export function QuickStartPageClient() {
  const { t } = useTranslation();

  const sections = ["install", "connect", "explore", "daily"];

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-(--q-accent) opacity-5 blur-[100px] rounded-full pointer-events-none" />
          <h1 className="relative text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-(--q-text-0) to-(--q-text-1)">
            {t("quick_start_page.title")}
          </h1>
          <p className="text-(--q-text-2) relative text-lg max-w-2xl mx-auto">
            {t("quick_start_page.description")}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
          {sections.map((section, index) => (
            <section key={section} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-(--q-accent)/10 text-(--q-accent) font-bold text-lg shrink-0">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-semibold text-(--q-text-0)">
                  {t(`quick_start_page.sections.${section}.title`)}
                </h2>
              </div>
              <div
                className="text-(--q-text-1) leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: t(`quick_start_page.sections.${section}.content`)
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong class='text-(--q-text-0)'>$1</strong>",
                    )
                    .replace(
                      /\[(.*?)\]\((.*?)\)/g,
                      "<a href='$2' class='text-(--q-accent) hover:underline'>$1</a>",
                    ),
                }}
              />
            </section>
          ))}

          <section className="bg-(--q-bg-1) border border-(--q-border) rounded-xl p-6 md:p-8 mt-12">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-(--q-accent)/10 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-(--q-accent)" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-(--q-text-0) mb-2">
                  {t("quick_start_page.security_tip.title")}
                </h2>
                <p className="text-(--q-text-1) leading-relaxed">
                  {t("quick_start_page.security_tip.content")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
