// SPDX-License-Identifier: Apache-2.0
import Link from "next/link";
import { useTranslation as getTranslation } from "@/app/[locale]/i18n";

const CLIENTS = ["Claude Desktop", "Claude Code", "Cursor"];
// Same synthetic fixture as the product captures (scripts/showcase-media).
const EXAMPLE_SQL = `SELECT c.company, SUM(o.total_cents) / 100.0 AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.id
ORDER BY revenue DESC
LIMIT 3;`;
const EXAMPLE_ROWS = [
  ["Galen Foods", "138635.87"],
  ["Cobalt Health", "134416.88"],
  ["Delta Labs", "122459.64"],
];

export async function McpSection({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  return (
    <section id="mcp" className="q-home-mcp" aria-labelledby="mcp-title">
      <div className="q-container q-home-mcp-grid">
        <div className="q-home-mcp-copy">
          <p className="q-home-kicker">
            MCP
            <span className="q-tier" data-tier="Core">
              Core
            </span>
          </p>
          <h2 id="mcp-title">{t("home.mcp.title")}</h2>
          <p className="q-home-mcp-description">{t("home.mcp.description")}</p>
          <ul className="q-home-mcp-clients" aria-label={t("home.mcp.clients")}>
            {CLIENTS.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
          <Link
            className="q-home-link"
            href={`/${locale}/docs/automation/mcp-server`}
          >
            {t("home.mcp.link")}
          </Link>
        </div>
        <figure className="q-home-agent">
          <figcaption>{t("home.mcp.example.label")}</figcaption>
          <p className="q-home-agent-prompt">{t("home.mcp.example.prompt")}</p>
          <div className="q-home-agent-call">
            <p>
              <code>qore-mcp</code>
              <span aria-hidden="true">›</span>
              <code>run_query</code>
              <span className="q-home-agent-badge">
                {t("home.mcp.example.readonly")}
              </span>
            </p>
            <pre>
              <code>{EXAMPLE_SQL}</code>
            </pre>
            <table>
              <thead>
                <tr>
                  <th scope="col">company</th>
                  <th scope="col">revenue</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_ROWS.map(([company, revenue]) => (
                  <tr key={company}>
                    <td>{company}</td>
                    <td>{revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="q-home-agent-answer">{t("home.mcp.example.answer")}</p>
        </figure>
      </div>
      <div className="q-container">
        <dl className="q-home-mcp-guarantees">
          {["access", "local"].map((key) => (
            <div key={key}>
              <dt>{t(`home.mcp.${key}.title`)}</dt>
              <dd>{t(`home.mcp.${key}.description`)}</dd>
            </div>
          ))}
        </dl>
        <p className="q-home-mcp-note">{t("home.mcp.note")}</p>
      </div>
    </section>
  );
}
