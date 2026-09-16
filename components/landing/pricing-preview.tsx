import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

export async function PricingPreview({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-pricing q-container"
      aria-labelledby="home-pricing-title"
    >
      <div className="q-home-section-heading">
        <p className="q-eyebrow">
          <span>04 /</span> {t("home.pricing.eyebrow")}
        </p>
        <Link className="q-home-link" href={`/${locale}/pricing`}>
          {t("home.pricing.compare")} <span aria-hidden="true">↗︎</span>
        </Link>
      </div>
      <h2 id="home-pricing-title">{t("home.pricing.title")}</h2>
      <div className="q-home-plans">
        {["core", "pro", "team"].map((plan, index) => (
          <article key={plan}>
            <div className="q-home-plan-label">
              <span>0{index + 1}</span>
              <p>{t(`home.pricing.${plan}.model`)}</p>
            </div>
            <h3>
              {plan === "core" ? "Core" : plan === "pro" ? "Pro" : "Team"}
            </h3>
            <p>{t(`home.pricing.${plan}.description`)}</p>
            <Link
              className="q-home-link"
              href={`/${locale}/${plan === "core" ? "download" : "pricing"}`}
            >
              {t(`home.pricing.${plan}.link`)} <span aria-hidden="true">↗︎</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
