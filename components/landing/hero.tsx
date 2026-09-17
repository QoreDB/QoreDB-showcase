import Image from "next/image";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Button } from "@/components/ui/button";
import socialStats from "@/lib/data/social-stats.json";

export async function Hero({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  const title = t("home.hero.title", { returnObjects: true }) as string[];

  return (
    <section className="q-home-hero q-container" aria-labelledby="home-title">
      <div className="q-home-hero-copy">
        <p className="q-eyebrow">{t("home.hero.eyebrow")}</p>
        <h1 id="home-title">
          {title.map((line, index) => (
            <span key={line} className={index === 0 ? "q-cell" : undefined}>
              {line}
            </span>
          ))}
        </h1>
        <p className="q-home-intro">{t("home.hero.description")}</p>
        <div className="q-home-actions">
          <Button asChild className="q-home-download">
            <Link href={`/${locale}/download`}>{t("home.download")}</Link>
          </Button>
          <a className="q-home-link" href="#preview">
            {t("home.hero.explore")}
          </a>
        </div>
        <p className="q-home-platforms">
          macOS <span>·</span> Windows <span>·</span> Linux <span>·</span>{" "}
          {t("home.hero.free")}
        </p>
        {/* Real figures, refreshed from GitHub at build time (scripts/fetch-stats.ts). */}
        <a
          className="q-home-proofline"
          href="https://github.com/QoreDB/QoreDB"
          target="_blank"
          rel="noreferrer"
          aria-label={`GitHub — ${t("social_proof.aria_label")}`}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"
            />
          </svg>
          <span>{t("social_proof.stars", { count: socialStats.stars })}</span>
          <span>
            {t("social_proof.downloads", {
              value: socialStats.downloads_display,
            })}
          </span>
          <span>Apache-2.0</span>
        </a>
      </div>
      <figure className="q-home-hero-product">
        <Image
          src="/images/showcase-v2/query-workspace-dark.webp"
          alt={t("home.hero.alt")}
          width={2880}
          height={1800}
          sizes="(max-width: 760px) 100vw, 1040px"
          priority
          fetchPriority="high"
        />
      </figure>
    </section>
  );
}
