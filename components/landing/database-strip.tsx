import Image from "next/image";
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { DATABASE_COUNT, DATABASE_GROUPS } from "@/lib/databases";

export async function DatabaseStrip({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section
      className="q-home-engines q-container"
      aria-labelledby="engines-title"
    >
      <div className="q-home-engines-head">
        <h2 id="engines-title">
          <span className="q-cell">{DATABASE_COUNT}</span>{" "}
          {t("home.compatibility.heading")}
        </h2>
        <Link
          className="q-home-link"
          href={`/${locale}/docs/connections/supported-databases`}
          prefetch={false}
        >
          {t("home.compatibility.link")}
        </Link>
      </div>
      <div className="q-home-engines-groups">
        {DATABASE_GROUPS.map((group) => (
          <div key={group.key}>
            <h3>{t(`database_strip.groups.${group.key}`)}</h3>
            <ul>
              {group.databases.map((database) => (
                <li key={database.name}>
                  <Link href={`/${locale}${database.doc}`} prefetch={false}>
                    <Image
                      src={database.image}
                      alt=""
                      width={24}
                      height={24}
                      sizes="24px"
                      loading="lazy"
                    />
                    {database.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
