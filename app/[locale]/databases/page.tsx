import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { DATABASE_COUNT, DATABASE_GROUPS } from "@/lib/databases";
import { buildPageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "databases");

  return buildPageMetadata({
    locale,
    pathname: "/databases",
    title: t("index.meta_title"),
    description: t("index.subtitle", { count: DATABASE_COUNT }),
  });
}

export default async function DatabasesPage({ params }: { params: Params }) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, "databases");
  const { t: tCommon } = await getTranslation(locale, "common");

  return (
    <div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="q-container flex-1 pt-20 pb-20 lg:pt-24"
      >
        <div className="q-page-header mb-12">
          <h1 className="mb-5 max-w-4xl">{t("index.title")}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-(--q-text-1)">
            {t("index.subtitle", { count: DATABASE_COUNT })}
          </p>
        </div>

        <div className="space-y-14">
          {DATABASE_GROUPS.map((group) => (
            <section key={group.key} aria-labelledby={`group-${group.key}`}>
              <h2
                id={`group-${group.key}`}
                className="mb-5 text-xl font-semibold text-(--q-text-0)"
              >
                {tCommon(`database_strip.groups.${group.key}`)}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.databases.map((database) => (
                  <li key={database.slug} className="flex">
                    <Link
                      href={`/${locale}/databases/${database.slug}`}
                      prefetch={false}
                      className="flex w-full flex-col gap-3 rounded-2xl bg-(--q-bg-1) p-6 transition-colors hover:bg-(--q-bg-2)"
                    >
                      <span className="flex items-center gap-3">
                        <Image
                          src={database.image}
                          alt=""
                          width={28}
                          height={28}
                          sizes="28px"
                          loading="lazy"
                          className="h-7 w-7 object-contain"
                        />
                        <span className="text-lg font-semibold text-(--q-text-0)">
                          {database.name}
                        </span>
                      </span>
                      <span className="text-[15px] leading-relaxed text-(--q-text-1)">
                        {t(`databases.${database.slug}.description`)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
