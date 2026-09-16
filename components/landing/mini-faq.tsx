import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

export async function MiniFaq({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-faq q-container"
      aria-labelledby="home-faq-title"
    >
      <div>
        <p className="q-eyebrow">
          <span>05 /</span> {t("home.faq.eyebrow")}
        </p>
        <h2 id="home-faq-title">{t("home.faq.title")}</h2>
      </div>
      <div>
        {["start", "privacy", "license"].map((key) => (
          <details key={key}>
            <summary>
              {t(`home.faq.${key}.question`)}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{t(`home.faq.${key}.answer`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
