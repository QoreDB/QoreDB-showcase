import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { Button } from "@/components/ui/button";

export async function CTASection({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section className="q-home-cta" aria-labelledby="home-cta-title">
      <div className="q-container">
        <h2 id="home-cta-title">{t("home.cta.title")}</h2>
        <Button asChild className="q-home-download">
          <Link href={`/${locale}/download`}>{t("home.download")}</Link>
        </Button>
        <p className="q-home-platforms">
          macOS <span>·</span> Windows <span>·</span> Linux <span>·</span>{" "}
          {t("home.hero.free")}
        </p>
      </div>
    </section>
  );
}
