import Link from "next/link";
import { Fragment } from "react";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { ProductDemo } from "./product-demo";
import { ProductShot } from "./product-shot";

const workflows = [
  {
    key: "explore",
    tier: "Core",
    shot: "table-workspace",
    sizes: "(max-width: 760px) 1000px, 960px",
    href: "/docs/querying/results-and-exports",
  },
  {
    key: "sandbox",
    tier: "Pro",
    shot: "sandbox-changes",
    sizes: "(max-width: 760px) 1200px, 1100px",
    href: "/features/sandbox",
  },
  {
    key: "safety",
    tier: "Core",
    shot: "safety-confirm",
    sizes: "(max-width: 760px) 1000px, 1200px",
    href: "/docs/connections/environments",
  },
];

export async function FeatureShowcase({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      id="features"
      className="q-home-workflows q-container"
      aria-labelledby="workflows-title"
    >
      <h2 id="workflows-title" className="sr-only">
        {t("home.workflows.title")}
      </h2>
      {workflows.map((workflow, index) => {
        const key = `home.workflows.${workflow.key}`;
        return (
          <Fragment key={workflow.key}>
            <article
              className={`q-home-workflow q-home-workflow-${workflow.key}`}
              aria-labelledby={`workflow-${workflow.key}`}
            >
              <div className="q-home-workflow-copy">
                <p className="q-home-kicker">
                  {t(`${key}.label`)}
                  <span className="q-tier" data-tier={workflow.tier}>
                    {workflow.tier}
                  </span>
                </p>
                <h3 id={`workflow-${workflow.key}`}>{t(`${key}.title`)}</h3>
                <p className="q-home-workflow-description">
                  {t(`${key}.description`)}
                </p>
                <Link
                  className="q-home-link"
                  href={`/${locale}${workflow.href}`}
                >
                  {t(`${key}.link`)}
                </Link>
              </div>
              <figure className="q-home-proof">
                <div className="q-home-proof-crop">
                  <ProductShot
                    name={workflow.shot}
                    alt={t(`${key}.alt`)}
                    sizes={workflow.sizes}
                  />
                </div>
              </figure>
            </article>
            {index === 0 && <ProductDemo locale={locale} />}
          </Fragment>
        );
      })}
    </section>
  );
}
