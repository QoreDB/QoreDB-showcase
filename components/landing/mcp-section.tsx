// SPDX-License-Identifier: Apache-2.0
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

export async function McpSection({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section id="mcp" className="q-home-mcp" aria-labelledby="mcp-title">
      <div className="q-container q-home-mcp-grid">
        <div>
          <p className="q-eyebrow">
            <span>03 /</span> {t("home.mcp.eyebrow")}
          </p>
          <h2 id="mcp-title">{t("home.mcp.title")}</h2>
          <p className="q-home-mcp-description">{t("home.mcp.description")}</p>
          <Link
            className="q-home-link"
            href={`/${locale}/docs/automation/mcp-server`}
          >
            {t("home.mcp.link")} <span aria-hidden="true">↗︎</span>
          </Link>
        </div>
        <div className="q-home-mcp-detail">
          <ol className="q-home-mcp-flow" aria-label={t("home.mcp.flowLabel")}>
            <li>{t("home.mcp.assistant")}</li>
            <li>
              <span aria-hidden="true">→</span>
              <code>qore-mcp</code>
            </li>
            <li>
              <span aria-hidden="true">→</span>
              {t("home.mcp.connections")}
            </li>
          </ol>
          <dl>
            {["access", "local", "source"].map((key) => (
              <div key={key}>
                <dt>{t(`home.mcp.${key}.title`)}</dt>
                <dd>{t(`home.mcp.${key}.description`)}</dd>
              </div>
            ))}
          </dl>
          <p className="q-home-mcp-note">{t("home.mcp.note")}</p>
        </div>
      </div>
    </section>
  );
}
