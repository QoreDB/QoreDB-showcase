// SPDX-License-Identifier: Apache-2.0

export const COMPARE_ROWS = [
  "license",
  "price",
  "platforms",
  "technology",
  "databases",
  "telemetry",
  "safety",
  "ai",
  "notebooks",
] as const;

export type CompareRow = (typeof COMPARE_ROWS)[number];

export interface Competitor {
  slug: string;
  name: string;
  website: string;
  sources: readonly string[];
}

export const COMPARE_CHECKED_AT = "2026-11-19";

export const COMPETITORS: readonly Competitor[] = [
  {
    slug: "dbeaver",
    name: "DBeaver",
    website: "https://dbeaver.io/",
    sources: [
      "https://github.com/dbeaver/dbeaver",
      "https://dbeaver.io/about/",
      "https://dbeaver.io/download/",
      "https://dbeaver.com/edition/",
      "https://dbeaver.com/docs/dbeaver/Statistics-Collection/",
      "https://dbeaver.com/docs/dbeaver/AI-Smart-Assistance/",
      "https://dbeaver.com/docs/dbeaver/Connection-Types/",
      "https://dbeaver.com/docs/dbeaver/Managing-security-restrictions-for-database-connection/",
    ],
  },
  {
    slug: "tableplus",
    name: "TablePlus",
    website: "https://tableplus.com/",
    sources: [
      "https://tableplus.com/",
      "https://tableplus.com/pricing",
      "https://tableplus.com/docs/preferences/crash-and-security",
      "https://tableplus.com/docs/llm-plugin",
      "https://tableplus.com/docs/gui-tools/manage-connections",
    ],
  },
  {
    slug: "datagrip",
    name: "DataGrip",
    website: "https://www.jetbrains.com/datagrip/",
    sources: [
      "https://www.jetbrains.com/datagrip/",
      "https://www.jetbrains.com/datagrip/buy/",
      "https://sales.jetbrains.com/hc/en-gb/articles/18950890312210-The-free-non-commercial-licensing-FAQ",
      "https://www.jetbrains.com/help/datagrip/installation-guide.html",
      "https://www.jetbrains.com/help/datagrip/managing-data-sources.html",
      "https://www.jetbrains.com/help/datagrip/settings-usage-statistics.html",
      "https://www.jetbrains.com/help/datagrip/data-sources-and-drivers-dialog.html",
    ],
  },
  {
    slug: "beekeeper-studio",
    name: "Beekeeper Studio",
    website: "https://www.beekeeperstudio.io/",
    sources: [
      "https://github.com/beekeeper-studio/beekeeper-studio",
      "https://www.beekeeperstudio.io/pricing",
      "https://docs.beekeeperstudio.io/user_guide/security/",
      "https://www.beekeeperstudio.io/features/sql-ai",
      "https://www.beekeeperstudio.io/blog/release-6.1-free-folders-readonly",
    ],
  },
  {
    slug: "pgadmin",
    name: "pgAdmin",
    website: "https://www.pgadmin.org/",
    sources: [
      "https://www.pgadmin.org/licence/",
      "https://www.pgadmin.org/faq/",
      "https://github.com/pgadmin-org/pgadmin4",
      "https://www.pgadmin.org/docs/pgadmin4/latest/config_py.html",
      "https://www.pgadmin.org/docs/pgadmin4/latest/ai_tools.html",
      "https://www.pgadmin.org/docs/pgadmin4/latest/server_dialog.html",
      "https://www.pgadmin.org/docs/pgadmin4/latest/import_export_servers.html",
    ],
  },
];

export const COMPETITOR_SLUGS = COMPETITORS.map(
  (competitor) => competitor.slug,
);

export function getCompetitor(slug: string): Competitor | undefined {
  return COMPETITORS.find((competitor) => competitor.slug === slug);
}
