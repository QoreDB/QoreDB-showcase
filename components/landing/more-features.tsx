import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { FEATURE_PAGES } from "@/lib/features";

// Sandbox and production safety already have their own figure above.
const SHOWN_ABOVE = ["sandbox", "production-safety"];

export async function MoreFeatures({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-more q-container"
      aria-labelledby="more-features-title"
    >
      <div className="q-home-section-heading">
        <h2 id="more-features-title">{t("features_index.title")}</h2>
        <Link className="q-home-link" href={`/${locale}/features`}>
          {t("features_common.back_to_index")}
        </Link>
      </div>
      <ul>
        {FEATURE_PAGES.filter(
          (feature) => !SHOWN_ABOVE.includes(feature.slug),
        ).map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.slug}>
              <Link
                href={`/${locale}/features/${feature.slug}`}
                prefetch={false}
              >
                <Icon aria-hidden="true" />
                <span>{t(`features_pages.${feature.slug}.title`)}</span>
                <span
                  className="q-tier"
                  data-tier={feature.tier === "pro" ? "Pro" : "Core"}
                >
                  {feature.tier === "pro" ? "Pro" : "Core"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
