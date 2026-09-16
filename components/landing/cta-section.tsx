import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Button } from "@/components/ui/button";

export async function CTASection({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-cta q-container"
      aria-labelledby="home-cta-title"
    >
      <div>
        <p className="q-eyebrow">
          <span>06 /</span> {t("home.cta.eyebrow")}
        </p>
        <h2 id="home-cta-title">
          {t("home.cta.title")}
          <span aria-hidden="true">↗︎</span>
        </h2>
        <p>{t("home.cta.description")}</p>
      </div>
      <div className="q-home-cta-actions">
        <Button asChild className="q-home-download">
          <Link href={`/${locale}/download`}>
            {t("home.download")} <span aria-hidden="true">↗︎</span>
          </Link>
        </Button>
        <p>macOS · Windows · Linux</p>
      </div>
    </section>
  );
}
