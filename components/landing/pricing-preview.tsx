import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

const PLANS = [
  { key: "core", name: "Core", href: "download" },
  { key: "pro", name: "Pro", href: "pricing" },
  { key: "team", name: "Team", href: "pricing" },
];

export async function PricingPreview({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-pricing q-container"
      aria-labelledby="home-pricing-title"
    >
      <div className="q-home-section-heading">
        <h2 id="home-pricing-title">{t("home.pricing.title")}</h2>
        <Link className="q-home-link" href={`/${locale}/pricing`}>
          {t("home.pricing.compare")}
        </Link>
      </div>
      <div className="q-home-plans">
        {PLANS.map((plan) => (
          <article key={plan.key} data-plan={plan.key}>
            <h3>
              {plan.name}
              <span>{t(`home.pricing.${plan.key}.model`)}</span>
            </h3>
            <p>
              {plan.key === "team"
                ? t("pricing_page.team.description")
                : t(`home.pricing.${plan.key}.description`)}
            </p>
            <Link className="q-home-link" href={`/${locale}/${plan.href}`}>
              {t(`home.pricing.${plan.key}.link`)}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
