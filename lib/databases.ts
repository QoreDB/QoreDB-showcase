// SPDX-License-Identifier: Apache-2.0

export const DATABASE_GROUPS = [
  {
    key: "sql",
    databases: [
      {
        name: "PostgreSQL",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/postgresql.webp",
      },
      {
        name: "Supabase",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/supabase.webp",
      },
      {
        name: "Neon",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/neon.webp",
      },
      {
        name: "TimescaleDB",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/timescaledb.webp",
      },
      {
        name: "CockroachDB",
        doc: "/docs/connections/cockroachdb",
        image: "/images/databases/cockroachdb.webp",
      },
      {
        name: "YugabyteDB",
        doc: "/docs/connections/yugabytedb",
        image: "/images/databases/yugabytedb.webp",
      },
      {
        name: "MySQL",
        doc: "/docs/connections/mysql",
        image: "/images/databases/mysql.webp",
      },
      {
        name: "MariaDB",
        doc: "/docs/connections/mysql",
        image: "/images/databases/mariadb.webp",
      },
      {
        name: "PlanetScale",
        doc: "/docs/connections/planetscale",
        image: "/images/databases/planetscale.webp",
      },
      {
        name: "TiDB",
        doc: "/docs/connections/tidb",
        image: "/images/databases/tidb.webp",
      },
      {
        name: "SingleStore",
        doc: "/docs/connections/singlestore",
        image: "/images/databases/singlestore.webp",
      },
      {
        name: "SQL Server",
        doc: "/docs/connections/sqlserver",
        image: "/images/databases/sqlserver.webp",
      },
      {
        name: "Azure SQL",
        doc: "/docs/connections/azuresql",
        image: "/images/databases/azuresql.webp",
      },
      {
        name: "SQLite",
        doc: "/docs/connections/sqlite",
        image: "/images/databases/sqlite.webp",
      },
    ],
  },
  {
    key: "analytics",
    databases: [
      {
        name: "DuckDB",
        doc: "/docs/connections/duckdb",
        image: "/images/databases/duckdb.webp",
      },
      {
        name: "MotherDuck",
        doc: "/docs/connections/motherduck",
        image: "/images/databases/motherduck.webp",
      },
      {
        name: "ClickHouse",
        doc: "/docs/connections/clickhouse",
        image: "/images/databases/clickhouse.webp",
      },
      {
        name: "Snowflake",
        doc: "/docs/connections/snowflake",
        image: "/images/databases/snowflake.webp",
      },
      {
        name: "BigQuery",
        doc: "/docs/connections/bigquery",
        image: "/images/databases/bigquery.webp",
      },
      {
        name: "StarRocks",
        doc: "/docs/connections/starrocks",
        image: "/images/databases/starrocks.webp",
      },
      {
        name: "Apache Doris",
        doc: "/docs/connections/doris",
        image: "/images/databases/doris.webp",
      },
      {
        name: "Azure Synapse",
        doc: "/docs/connections/synapse",
        image: "/images/databases/synapse.webp",
      },
    ],
  },
  {
    key: "nosql",
    databases: [
      {
        name: "MongoDB",
        doc: "/docs/connections/mongodb",
        image: "/images/databases/mongodb.webp",
      },
      {
        name: "Amazon DocumentDB",
        doc: "/docs/connections/documentdb",
        image: "/images/databases/documentdb.webp",
      },
      {
        name: "Redis",
        doc: "/docs/connections/redis",
        image: "/images/databases/redis.webp",
      },
      {
        name: "Valkey",
        doc: "/docs/connections/dragonfly",
        image: "/images/databases/valkey.webp",
      },
      {
        name: "Dragonfly",
        doc: "/docs/connections/dragonfly",
        image: "/images/databases/dragonfly.webp",
      },
      {
        name: "KeyDB",
        doc: "/docs/connections/keydb",
        image: "/images/databases/keydb.webp",
      },
      {
        name: "Garnet",
        doc: "/docs/connections/garnet",
        image: "/images/databases/garnet.webp",
      },
      {
        name: "Elasticsearch",
        doc: "/docs/connections/elasticsearch",
        image: "/images/databases/elasticsearch.webp",
      },
      {
        name: "OpenSearch",
        doc: "/docs/connections/opensearch",
        image: "/images/databases/opensearch.webp",
      },
      {
        name: "Cassandra",
        doc: "/docs/connections/cassandra",
        image: "/images/databases/cassandra.webp",
      },
      {
        name: "ScyllaDB",
        doc: "/docs/connections/scylladb",
        image: "/images/databases/scylladb.webp",
      },
      {
        name: "Amazon Keyspaces",
        doc: "/docs/connections/keyspaces",
        image: "/images/databases/keyspaces.webp",
      },
    ],
  },
] as const;

export const DATABASE_COUNT = DATABASE_GROUPS.reduce(
  (count, group) => count + group.databases.length,
  0,
);
