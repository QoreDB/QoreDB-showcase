import Image from "next/image";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

export async function DatabaseStrip({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-compatibility q-container"
      aria-label={t("home.compatibility.label")}
    >
      <p>
        {t("home.compatibility.title")}
        <strong>{t("home.compatibility.subtitle")}</strong>
      </p>
      <ul>
        {["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"].map((name) => (
          <li key={name}>
            <Image
              className={`q-home-database-${name.toLowerCase()}`}
              src={`/images/databases/${name.toLowerCase()}.webp`}
              alt=""
              width={28}
              height={28}
              sizes="28px"
            />
            <span>{name}</span>
          </li>
        ))}
      </ul>
      <Link
        className="q-home-link"
        href={`/${locale}/docs/connections/supported-databases`}
        prefetch={false}
      >
        {t("home.compatibility.link")} <span aria-hidden="true">↗︎</span>
      </Link>
    </section>
  );
}
