"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const databases = [
  { name: "PostgreSQL", image: "/images/databases/postgresql.webp" },
  { name: "MySQL", image: "/images/databases/mysql.webp" },
  { name: "MariaDB", image: "/images/databases/mariadb.webp" },
  { name: "MongoDB", image: "/images/databases/mongodb.webp" },
  { name: "Redis", image: "/images/databases/redis.webp" },
  { name: "SQLite", image: "/images/databases/sqlite.webp" },
  { name: "DuckDB", image: "/images/databases/duckdb.webp" },
  { name: "ClickHouse", image: "/images/databases/clickhouse.webp" },
  { name: "Elasticsearch", image: "/images/databases/elasticsearch.webp" },
  { name: "OpenSearch", image: "/images/databases/opensearch.webp" },
  { name: "TimescaleDB", image: "/images/databases/timescaledb.webp" },
  { name: "SQL Server", image: "/images/databases/sqlserver.webp" },
  { name: "CockroachDB", image: "/images/databases/cockroachdb.webp" },
  { name: "Supabase", image: "/images/databases/supabase.webp" },
  { name: "Neon", image: "/images/databases/neon.webp" },
];

export function DatabaseStrip() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-10 border-y border-(--q-border) bg-(--q-bg-1)">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-(--q-text-2) text-xs font-medium uppercase tracking-[2px] mb-5">
          {t("database_strip.label")}
        </p>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {databases.map((db) => (
            <div
              key={db.name}
              className="group flex items-center gap-2.5 px-4 py-2 border border-(--q-border) rounded-lg text-sm font-medium text-(--q-text-2) hover:text-(--q-text-0) hover:border-(--q-accent) hover:bg-(--q-accent)/5 transition-all duration-200 cursor-default"
            >
              <Image
                src={db.image}
                alt={db.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain shrink-0 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-200"
              />
              {db.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
