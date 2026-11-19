// SPDX-License-Identifier: Apache-2.0

export type DatabaseProtocol =
  | "postgres_wire"
  | "mysql_wire"
  | "tds"
  | "embedded"
  | "http"
  | "snowflake_api"
  | "bigquery_api"
  | "mongodb_wire"
  | "resp"
  | "cql";

export type DatabaseTls = "optional" | "required" | "local";

export type DatabaseAuth =
  | "password"
  | "sqlserver"
  | "none"
  | "token"
  | "snowflake"
  | "service_account"
  | "redis"
  | "elasticsearch"
  | "opensearch"
  | "keyspaces";

export interface Database {
  slug: string;
  name: string;
  doc: string;
  image: string;
  port: string | null;
  protocol: DatabaseProtocol;
  schemes: readonly string[];
  tls: DatabaseTls;
  auth: DatabaseAuth;
  related: readonly string[];
  officialListing?: string;
}

export interface DatabaseGroup {
  key: "sql" | "analytics" | "nosql";
  databases: readonly Database[];
}

const POSTGRES_FAMILY = [
  "postgresql",
  "supabase",
  "neon",
  "timescaledb",
  "cockroachdb",
  "yugabytedb",
];
const MYSQL_FAMILY = ["mysql", "mariadb", "planetscale", "tidb", "singlestore"];
const REDIS_FAMILY = ["redis", "valkey", "dragonfly", "keydb", "garnet"];
const CQL_FAMILY = ["cassandra", "scylladb", "amazon-keyspaces"];

const without = (family: readonly string[], slug: string) =>
  family.filter((item) => item !== slug);

export const DATABASE_GROUPS: readonly DatabaseGroup[] = [
  {
    key: "sql",
    databases: [
      {
        slug: "postgresql",
        name: "PostgreSQL",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/postgresql.webp",
        port: "5432",
        protocol: "postgres_wire",
        schemes: ["postgresql://", "postgres://"],
        tls: "optional",
        auth: "password",
        related: without(POSTGRES_FAMILY, "postgresql"),
      },
      {
        slug: "supabase",
        name: "Supabase",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/supabase.webp",
        port: "5432 · 6543",
        protocol: "postgres_wire",
        schemes: ["postgresql://"],
        tls: "required",
        auth: "password",
        related: ["postgresql", "neon", "timescaledb"],
      },
      {
        slug: "neon",
        name: "Neon",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/neon.webp",
        port: "5432",
        protocol: "postgres_wire",
        schemes: ["postgresql://"],
        tls: "required",
        auth: "password",
        related: ["postgresql", "supabase", "timescaledb"],
      },
      {
        slug: "timescaledb",
        name: "TimescaleDB",
        doc: "/docs/connections/postgresql",
        image: "/images/databases/timescaledb.webp",
        port: "5432",
        protocol: "postgres_wire",
        schemes: ["postgresql://"],
        tls: "optional",
        auth: "password",
        related: ["postgresql", "supabase", "neon"],
      },
      {
        slug: "cockroachdb",
        name: "CockroachDB",
        doc: "/docs/connections/cockroachdb",
        image: "/images/databases/cockroachdb.webp",
        port: "26257",
        protocol: "postgres_wire",
        schemes: ["cockroachdb://", "postgresql://"],
        tls: "optional",
        auth: "password",
        related: ["postgresql", "yugabytedb", "tidb"],
      },
      {
        slug: "yugabytedb",
        name: "YugabyteDB",
        doc: "/docs/connections/yugabytedb",
        image: "/images/databases/yugabytedb.webp",
        port: "5433",
        protocol: "postgres_wire",
        schemes: ["postgresql://"],
        tls: "optional",
        auth: "password",
        related: ["postgresql", "cockroachdb", "tidb"],
      },
      {
        slug: "mysql",
        name: "MySQL",
        doc: "/docs/connections/mysql",
        image: "/images/databases/mysql.webp",
        port: "3306",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: without(MYSQL_FAMILY, "mysql"),
      },
      {
        slug: "mariadb",
        name: "MariaDB",
        doc: "/docs/connections/mysql",
        image: "/images/databases/mariadb.webp",
        port: "3306",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: without(MYSQL_FAMILY, "mariadb"),
      },
      {
        slug: "planetscale",
        name: "PlanetScale",
        doc: "/docs/connections/planetscale",
        image: "/images/databases/planetscale.webp",
        port: "3306",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "required",
        auth: "password",
        related: without(MYSQL_FAMILY, "planetscale"),
      },
      {
        slug: "tidb",
        name: "TiDB",
        doc: "/docs/connections/tidb",
        image: "/images/databases/tidb.webp",
        port: "4000",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: without(MYSQL_FAMILY, "tidb"),
      },
      {
        slug: "singlestore",
        name: "SingleStore",
        doc: "/docs/connections/singlestore",
        image: "/images/databases/singlestore.webp",
        port: "3306",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: without(MYSQL_FAMILY, "singlestore"),
      },
      {
        slug: "sql-server",
        name: "SQL Server",
        doc: "/docs/connections/sqlserver",
        image: "/images/databases/sqlserver.webp",
        port: "1433",
        protocol: "tds",
        schemes: ["sqlserver://", "mssql://"],
        tls: "optional",
        auth: "sqlserver",
        related: ["azure-sql", "azure-synapse"],
      },
      {
        slug: "azure-sql",
        name: "Azure SQL",
        doc: "/docs/connections/azuresql",
        image: "/images/databases/azuresql.webp",
        port: "1433",
        protocol: "tds",
        schemes: ["sqlserver://", "mssql://"],
        tls: "required",
        auth: "password",
        related: ["sql-server", "azure-synapse"],
      },
      {
        slug: "sqlite",
        name: "SQLite",
        doc: "/docs/connections/sqlite",
        image: "/images/databases/sqlite.webp",
        port: null,
        protocol: "embedded",
        schemes: [],
        tls: "local",
        auth: "none",
        related: ["duckdb"],
      },
    ],
  },
  {
    key: "analytics",
    databases: [
      {
        slug: "duckdb",
        name: "DuckDB",
        doc: "/docs/connections/duckdb",
        image: "/images/databases/duckdb.webp",
        port: null,
        protocol: "embedded",
        schemes: [],
        tls: "local",
        auth: "none",
        related: ["motherduck", "sqlite", "clickhouse"],
      },
      {
        slug: "motherduck",
        name: "MotherDuck",
        doc: "/docs/connections/motherduck",
        image: "/images/databases/motherduck.webp",
        port: "5432",
        protocol: "postgres_wire",
        schemes: ["postgresql://"],
        tls: "required",
        auth: "token",
        related: ["duckdb", "snowflake", "bigquery"],
      },
      {
        slug: "clickhouse",
        name: "ClickHouse",
        doc: "/docs/connections/clickhouse",
        image: "/images/databases/clickhouse.webp",
        port: "8123 · 8443",
        protocol: "http",
        schemes: [],
        tls: "optional",
        auth: "password",
        related: ["duckdb", "starrocks", "apache-doris"],
        officialListing:
          "https://clickhouse.com/docs/integrations/connectors/tools/gui",
      },
      {
        slug: "snowflake",
        name: "Snowflake",
        doc: "/docs/connections/snowflake",
        image: "/images/databases/snowflake.webp",
        port: "443",
        protocol: "snowflake_api",
        schemes: [],
        tls: "required",
        auth: "snowflake",
        related: ["bigquery", "azure-synapse", "motherduck"],
      },
      {
        slug: "bigquery",
        name: "BigQuery",
        doc: "/docs/connections/bigquery",
        image: "/images/databases/bigquery.webp",
        port: "443",
        protocol: "bigquery_api",
        schemes: [],
        tls: "required",
        auth: "service_account",
        related: ["snowflake", "azure-synapse", "motherduck"],
      },
      {
        slug: "starrocks",
        name: "StarRocks",
        doc: "/docs/connections/starrocks",
        image: "/images/databases/starrocks.webp",
        port: "9030",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: ["apache-doris", "clickhouse", "mysql"],
      },
      {
        slug: "apache-doris",
        name: "Apache Doris",
        doc: "/docs/connections/doris",
        image: "/images/databases/doris.webp",
        port: "9030",
        protocol: "mysql_wire",
        schemes: ["mysql://"],
        tls: "optional",
        auth: "password",
        related: ["starrocks", "clickhouse", "mysql"],
      },
      {
        slug: "azure-synapse",
        name: "Azure Synapse",
        doc: "/docs/connections/synapse",
        image: "/images/databases/synapse.webp",
        port: "1433",
        protocol: "tds",
        schemes: ["sqlserver://", "mssql://"],
        tls: "required",
        auth: "password",
        related: ["azure-sql", "sql-server", "snowflake"],
      },
    ],
  },
  {
    key: "nosql",
    databases: [
      {
        slug: "mongodb",
        name: "MongoDB",
        doc: "/docs/connections/mongodb",
        image: "/images/databases/mongodb.webp",
        port: "27017",
        protocol: "mongodb_wire",
        schemes: ["mongodb://", "mongodb+srv://"],
        tls: "optional",
        auth: "password",
        related: ["amazon-documentdb", "elasticsearch", "redis"],
      },
      {
        slug: "amazon-documentdb",
        name: "Amazon DocumentDB",
        doc: "/docs/connections/documentdb",
        image: "/images/databases/documentdb.webp",
        port: "27017",
        protocol: "mongodb_wire",
        schemes: ["mongodb://"],
        tls: "required",
        auth: "password",
        related: ["mongodb", "amazon-keyspaces"],
      },
      {
        slug: "redis",
        name: "Redis",
        doc: "/docs/connections/redis",
        image: "/images/databases/redis.webp",
        port: "6379",
        protocol: "resp",
        schemes: ["redis://", "rediss://"],
        tls: "optional",
        auth: "redis",
        related: without(REDIS_FAMILY, "redis"),
      },
      {
        slug: "valkey",
        name: "Valkey",
        doc: "/docs/connections/dragonfly",
        image: "/images/databases/valkey.webp",
        port: "6379",
        protocol: "resp",
        schemes: ["valkey://", "valkeys://"],
        tls: "optional",
        auth: "redis",
        related: without(REDIS_FAMILY, "valkey"),
      },
      {
        slug: "dragonfly",
        name: "Dragonfly",
        doc: "/docs/connections/dragonfly",
        image: "/images/databases/dragonfly.webp",
        port: "6379",
        protocol: "resp",
        schemes: ["redis://", "rediss://"],
        tls: "optional",
        auth: "redis",
        related: without(REDIS_FAMILY, "dragonfly"),
      },
      {
        slug: "keydb",
        name: "KeyDB",
        doc: "/docs/connections/keydb",
        image: "/images/databases/keydb.webp",
        port: "6379",
        protocol: "resp",
        schemes: ["redis://", "rediss://"],
        tls: "optional",
        auth: "redis",
        related: without(REDIS_FAMILY, "keydb"),
      },
      {
        slug: "garnet",
        name: "Garnet",
        doc: "/docs/connections/garnet",
        image: "/images/databases/garnet.webp",
        port: "6379",
        protocol: "resp",
        schemes: ["redis://", "rediss://"],
        tls: "optional",
        auth: "redis",
        related: without(REDIS_FAMILY, "garnet"),
      },
      {
        slug: "elasticsearch",
        name: "Elasticsearch",
        doc: "/docs/connections/elasticsearch",
        image: "/images/databases/elasticsearch.webp",
        port: "9200",
        protocol: "http",
        schemes: [],
        tls: "optional",
        auth: "elasticsearch",
        related: ["opensearch", "mongodb"],
      },
      {
        slug: "opensearch",
        name: "OpenSearch",
        doc: "/docs/connections/opensearch",
        image: "/images/databases/opensearch.webp",
        port: "9200",
        protocol: "http",
        schemes: [],
        tls: "optional",
        auth: "opensearch",
        related: ["elasticsearch", "mongodb"],
      },
      {
        slug: "cassandra",
        name: "Cassandra",
        doc: "/docs/connections/cassandra",
        image: "/images/databases/cassandra.webp",
        port: "9042",
        protocol: "cql",
        schemes: [],
        tls: "optional",
        auth: "password",
        related: without(CQL_FAMILY, "cassandra"),
      },
      {
        slug: "scylladb",
        name: "ScyllaDB",
        doc: "/docs/connections/scylladb",
        image: "/images/databases/scylladb.webp",
        port: "9042",
        protocol: "cql",
        schemes: [],
        tls: "optional",
        auth: "password",
        related: without(CQL_FAMILY, "scylladb"),
      },
      {
        slug: "amazon-keyspaces",
        name: "Amazon Keyspaces",
        doc: "/docs/connections/keyspaces",
        image: "/images/databases/keyspaces.webp",
        port: "9142",
        protocol: "cql",
        schemes: [],
        tls: "required",
        auth: "keyspaces",
        related: ["cassandra", "scylladb", "amazon-documentdb"],
      },
    ],
  },
];

export const DATABASES: readonly Database[] = DATABASE_GROUPS.flatMap(
  (group) => group.databases,
);

export const DATABASE_COUNT = DATABASES.length;

export const DATABASE_SLUGS = DATABASES.map((database) => database.slug);

export function getDatabase(slug: string): Database | undefined {
  return DATABASES.find((database) => database.slug === slug);
}

export function getDatabaseGroupKey(slug: string): DatabaseGroup["key"] {
  const group = DATABASE_GROUPS.find((candidate) =>
    candidate.databases.some((database) => database.slug === slug),
  );
  return group?.key ?? "sql";
}
