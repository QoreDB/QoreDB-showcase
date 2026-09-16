// SPDX-License-Identifier: Apache-2.0

export const DATABASE_GROUPS = [
  {
    key: "sql",
    databases: [
      {
        name: "PostgreSQL",
        image: "/images/databases/postgresql.webp",
      },
      {
        name: "Supabase",
        image: "/images/databases/supabase.webp",
      },
      {
        name: "Neon",
        image: "/images/databases/neon.webp",
      },
      {
        name: "TimescaleDB",
        image: "/images/databases/timescaledb.webp",
      },
      {
        name: "CockroachDB",
        image: "/images/databases/cockroachdb.webp",
      },
      {
        name: "YugabyteDB",
        image: "/images/databases/yugabytedb.webp",
      },
      {
        name: "MySQL",
        image: "/images/databases/mysql.webp",
      },
      {
        name: "MariaDB",
        image: "/images/databases/mariadb.webp",
      },
      {
        name: "PlanetScale",
        image: "/images/databases/planetscale.webp",
      },
      {
        name: "TiDB",
        image: "/images/databases/tidb.webp",
      },
      {
        name: "SingleStore",
        image: "/images/databases/singlestore.webp",
      },
      {
        name: "SQL Server",
        image: "/images/databases/sqlserver.webp",
      },
      {
        name: "Azure SQL",
        image: "/images/databases/azuresql.webp",
      },
      {
        name: "SQLite",
        image: "/images/databases/sqlite.webp",
      },
    ],
  },
  {
    key: "analytics",
    databases: [
      {
        name: "DuckDB",
        image: "/images/databases/duckdb.webp",
      },
      {
        name: "MotherDuck",
        image: "/images/databases/motherduck.webp",
      },
      {
        name: "ClickHouse",
        image: "/images/databases/clickhouse.webp",
      },
      {
        name: "Snowflake",
        image: "/images/databases/snowflake.webp",
      },
      {
        name: "BigQuery",
        image: "/images/databases/bigquery.webp",
      },
      {
        name: "StarRocks",
        image: "/images/databases/starrocks.webp",
      },
      {
        name: "Apache Doris",
        image: "/images/databases/doris.webp",
      },
      {
        name: "Azure Synapse",
        image: "/images/databases/synapse.webp",
      },
    ],
  },
  {
    key: "nosql",
    databases: [
      {
        name: "MongoDB",
        image: "/images/databases/mongodb.webp",
      },
      {
        name: "Amazon DocumentDB",
        image: "/images/databases/documentdb.webp",
      },
      {
        name: "Redis",
        image: "/images/databases/redis.webp",
      },
      {
        name: "Valkey",
        image: "/images/databases/valkey.webp",
      },
      {
        name: "Dragonfly",
        image: "/images/databases/dragonfly.webp",
      },
      {
        name: "KeyDB",
        image: "/images/databases/keydb.webp",
      },
      {
        name: "Garnet",
        image: "/images/databases/garnet.webp",
      },
      {
        name: "Elasticsearch",
        image: "/images/databases/elasticsearch.webp",
      },
      {
        name: "OpenSearch",
        image: "/images/databases/opensearch.webp",
      },
      {
        name: "Cassandra",
        image: "/images/databases/cassandra.webp",
      },
      {
        name: "ScyllaDB",
        image: "/images/databases/scylladb.webp",
      },
      {
        name: "Amazon Keyspaces",
        image: "/images/databases/keyspaces.webp",
      },
    ],
  },
] as const;

export const DATABASE_COUNT = DATABASE_GROUPS.reduce(
  (count, group) => count + group.databases.length,
  0,
);
