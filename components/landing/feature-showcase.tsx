import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { ProductDemo } from "./product-demo";

const workflows = [
  {
    key: "explore",
    tier: "Core",
    image: "/images/showcase-v2/table-workspace.webp",
    width: 1280,
    height: 800,
    sizes: "(max-width: 760px) 760px, 900px",
    href: "/docs/querying/results-and-exports",
  },
  {
    key: "sandbox",
    tier: "Pro",
    image: "/images/features/sandbox.webp",
    width: 2000,
    height: 1310,
    sizes: "(max-width: 760px) 1250px, 1100px",
    href: "/features/sandbox",
  },
  {
    key: "safety",
    tier: "Core",
    image: "/images/features/query-safety.webp",
    width: 2000,
    height: 1310,
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
      <div id="preview" className="q-home-section-heading">
        <p className="q-eyebrow">
          <span>02 /</span> {t("home.workflows.eyebrow")}
        </p>
        <h2 id="workflows-title" className="sr-only">
          {t("home.workflows.title")}
        </h2>
      </div>
      {workflows.map((workflow, index) => {
        const key = `home.workflows.${workflow.key}`;
        const steps = t(`${key}.steps`, { returnObjects: true }) as {
          title: string;
          description: string;
        }[];
        return (
          <Fragment key={workflow.key}>
            <article
              className={`q-home-workflow q-home-workflow-${workflow.key}`}
              aria-labelledby={`workflow-${workflow.key}`}
            >
              <div className="q-home-workflow-copy">
                <p className="q-home-proof-label">
                  0{index + 1} — {t(`${key}.label`)}{" "}
                  <span>{workflow.tier}</span>
                </p>
                <h3 id={`workflow-${workflow.key}`}>{t(`${key}.title`)}</h3>
                <p className="q-home-workflow-description">
                  {t(`${key}.description`)}
                </p>
                <ol className="q-home-steps">
                  {steps.map((step, stepIndex) => (
                    <li key={step.title}>
                      <span aria-hidden="true">0{stepIndex + 1}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  className="q-home-link"
                  href={`/${locale}${workflow.href}`}
                >
                  {t(`${key}.link`)} <span aria-hidden="true">↗︎</span>
                </Link>
              </div>
              <figure className="q-home-proof-image">
                <div className="q-home-proof-crop">
                  <Image
                    src={workflow.image}
                    alt={t(`${key}.alt`)}
                    width={workflow.width}
                    height={workflow.height}
                    fetchPriority="low"
                    sizes={workflow.sizes}
                  />
                </div>
                <figcaption>
                  <span>FIG. 0{index + 1}</span>
                  <span>{t(`${key}.caption`)}</span>
                  <a href={workflow.image}>
                    <span aria-hidden="true">↗︎</span>
                    <span className="sr-only">{t("home.fullImage")}</span>
                  </a>
                </figcaption>
              </figure>
            </article>
            {index === 0 && <ProductDemo locale={locale} />}
          </Fragment>
        );
      })}
    </section>
  );
}
