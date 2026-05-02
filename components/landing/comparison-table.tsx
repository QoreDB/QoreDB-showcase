"use client";

import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const competitors = ["qoredb", "dbeaver", "tableplus", "pgadmin"] as const;
const competitorLabels = {
  qoredb: "QoreDB",
  dbeaver: "DBeaver",
  tableplus: "TablePlus",
  pgadmin: "pgAdmin",
};

const rows = [
  "opensource",
  "multidb",
  "native",
  "local",
  "vault",
  "safety",
  "sandbox",
  "fulltext",
  "er_diagram",
  "federation",
  "ai",
  "ui",
  "maturity",
  "price",
] as const;

const positiveValues = new Set([
  "Yes",
  "Oui",
  "Apache 2.0",
  "Community",
  "Argon2",
  "BYOK",
  "Pro",
  "12 drivers",
  "12 drivers natifs",
  "12 motors",
  "12 motores",
  "12 Treiber",
  "12 driver",
  "12ドライバー",
  "12 个驱动",
  "15+ years",
  "15+ ans",
  "Established",
  "Établi",
  "20+ years",
  "20+ ans",
  "Rust/Tauri",
  "Native",
  "Natif",
  "Keychain",
  "Free",
  "Free / Pro",
  "Gratuit",
  "Gratuit / Pro",
]);

const negativeValues = new Set(["No", "Non", "PG only", "PG seul"]);

function CellValue({ value }: { value: string }) {
  if (positiveValues.has(value)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
        <Check className="w-3.5 h-3.5" />
        {value}
      </span>
    );
  }
  if (negativeValues.has(value)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-red-400">
        <X className="w-3.5 h-3.5" />
        {value}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-(--q-text-2)">
      <Minus className="w-3.5 h-3.5" />
      {value}
    </span>
  );
}

export function ComparisonTable() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params.locale as string) || "fr";

  return (
    <section className="relative z-10 py-24 px-6 bg-(--q-bg-1)">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-(--q-text-0) text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            {t("comparison.title")}
          </h2>
          <p className="text-(--q-text-1) text-lg max-w-xl mx-auto">
            {t("comparison.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--q-border)">
                <th className="text-left py-4 px-4 text-(--q-text-2) font-semibold text-xs uppercase tracking-wider w-[30%]" />
                {competitors.map((c) => (
                  <th
                    key={c}
                    className={`text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider ${
                      c === "qoredb"
                        ? "text-(--q-accent) bg-(--q-accent)/5 rounded-t-lg"
                        : "text-(--q-text-2)"
                    }`}
                  >
                    {competitorLabels[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row} className="border-b border-(--q-border)/50">
                  <td className="py-3.5 px-4 font-medium text-(--q-text-0) text-sm">
                    {t(`comparison.rows.${row}`)}
                  </td>
                  {competitors.map((c) => (
                    <td
                      key={c}
                      className={`py-3.5 px-4 text-sm ${
                        c === "qoredb" ? "bg-(--q-accent)/5" : ""
                      } ${
                        c === "qoredb" && row === "price"
                          ? "font-bold text-emerald-500"
                          : ""
                      }`}
                    >
                      {c === "qoredb" && row === "price" ? (
                        <span className="text-emerald-500 font-bold">
                          {t(`comparison.values.${c}.${row}`)}
                        </span>
                      ) : (
                        <CellValue value={t(`comparison.values.${c}.${row}`)} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <p className="text-center mt-8 text-sm text-(--q-text-2) italic">
          {t("comparison.note").replace(" →", "")}{" "}
          <Link
            href={`/${locale}/roadmap`}
            className="text-(--q-accent) hover:underline not-italic font-medium"
          >
            Roadmap →
          </Link>
        </p>
      </div>
    </section>
  );
}
