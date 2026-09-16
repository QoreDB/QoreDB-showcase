import Image from "next/image";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Button } from "@/components/ui/button";

export async function Hero({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  const title = t("home.hero.title", { returnObjects: true }) as string[];

  return (
    <section className="q-home-hero q-container" aria-labelledby="home-title">
      <div className="q-home-hero-copy">
        <p className="q-eyebrow">
          <svg
            className="q-home-signature"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <path d="m16 2 12 7v14l-12 7L4 23V9Z" />
            <path d="m16 9 6 3.5v7L16 23l-6-3.5v-7Z" />
            <path d="m10 12.5 6 3.5 6-3.5M16 16v7" />
          </svg>
          {t("home.hero.eyebrow")}
        </p>
        <h1 id="home-title">
          {title.map((line, index) => (
            <span key={line}>
              {line}
              {index === title.length - 1 && <b aria-hidden="true">.</b>}
            </span>
          ))}
        </h1>
        <p className="q-home-intro">{t("home.hero.description")}</p>
        <div className="q-home-actions">
          <Button asChild className="q-home-download">
            <Link href={`/${locale}/download`}>
              {t("home.download")} <span aria-hidden="true">↗︎</span>
            </Link>
          </Button>
          <a className="q-home-link" href="#preview">
            {t("home.hero.explore")} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="q-home-platforms">
          macOS <span>·</span> Windows <span>·</span> Linux <span>/</span>{" "}
          {t("home.hero.free")}
        </p>
      </div>
      <figure className="q-home-hero-product">
        <svg
          className="q-home-product-signature"
          viewBox="0 0 620 480"
          fill="none"
          aria-hidden="true"
        >
          <path d="M268 64h280v320H108V144h80" />
          <path d="M300 88h224v272H132V168h80" />
          <path d="M332 112h168v224H156V192h80" />
          <path d="M108 48v352M564 64v336" className="q-home-signature-axis" />
          <rect x="261" y="61" width="6" height="6" />
          <rect x="293" y="85" width="6" height="6" />
          <rect x="325" y="109" width="6" height="6" />
        </svg>
        <div className="q-home-ruler">
          <span>{t("home.hero.workspace")}</span>
          <span>SQL / 01</span>
        </div>
        <div className="q-home-product-frame">
          <div className="q-home-product-window">
            <Image
              src="/images/showcase-v2/query-workspace.webp"
              alt={t("home.hero.alt")}
              width={1280}
              height={800}
              sizes="(max-width: 760px) 700px, 1000px"
              priority
              fetchPriority="high"
            />
          </div>
        </div>
        <figcaption>
          <span className="q-home-caption-marker" aria-hidden="true">
            ↳
          </span>
          <span>{t("home.hero.caption")}</span>
          <a href="/images/showcase-v2/query-workspace.webp">
            <span aria-hidden="true">↗︎</span>
            <span className="sr-only">{t("home.fullImage")}</span>
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
