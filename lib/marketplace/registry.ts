// Marketplace registry client.
//
// Pulls the canonical plugin catalog (and individual manifests) from the
// `qoredb-plugins-registry` GitHub repo. The repo is the source of truth for
// the bytes; this module is the read path the showcase API + pages use.
//
// We trust the registry's URLs (raw.githubusercontent.com) and don't proxy
// the .zip bytes — the in-app marketplace downloads them directly from
// GitHub. That keeps Vercel egress flat and matches how the QoreDB host
// would treat any third-party mirror: verify by the sha256 declared in the
// catalog before doing anything with the file.

const RAW_BASE =
  process.env.QOREDB_REGISTRY_RAW_BASE ??
  "https://raw.githubusercontent.com/qoredb/qoredb-plugins-registry/main";

const INDEX_URL = `${RAW_BASE}/index.json`;

// 5-minute server-side cache. Approved plugin updates land at human cadence,
// so a stale listing for a few minutes is fine — and the marketplace pages
// avoid hammering GitHub on every request.
const REVALIDATE_SECONDS = 300;

export type PluginKind = "declarative" | "executable";

export type PluginHook = "preExecute" | "postExecute";

export type PluginCapability =
  | "log"
  | "notify"
  | "storage"
  | "queryRead"
  | "http"
  | "fs"
  | "secrets";

export interface RegistryRuntimeSummary {
  abiVersion: 1;
  entry: string;
  hooks: PluginHook[];
  capabilities: PluginCapability[];
  integrity: string | null;
}

export interface RegistryContributionSummary {
  snippets: number;
  connectionTemplates: number;
  themes: number;
  resultViewers: number;
  commands: string[];
}

export interface RegistryArchive {
  url: string;
  sha256: string;
  sizeBytes: number;
}

export interface RegistryVersion {
  version: string;
  qoredb: string | null;
  kind: PluginKind;
  runtime: RegistryRuntimeSummary | null;
  contributes: RegistryContributionSummary;
  archive: RegistryArchive;
  manifestUrl: string;
}

export interface RegistryPlugin {
  id: string;
  name: string;
  author: string | null;
  description: string | null;
  latestVersion: string;
  kind: PluginKind;
  versions: RegistryVersion[];
}

export interface RegistryIndex {
  registryVersion: 1;
  generatedAt: string;
  plugins: RegistryPlugin[];
}

export class RegistryUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryUnavailableError";
  }
}

export async function fetchRegistryIndex(): Promise<RegistryIndex> {
  const response = await fetch(INDEX_URL, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["marketplace-registry"] },
  });
  if (!response.ok) {
    throw new RegistryUnavailableError(
      `Registry index responded with HTTP ${response.status}`,
    );
  }
  const json = (await response.json()) as RegistryIndex;
  if (json.registryVersion !== 1) {
    throw new RegistryUnavailableError(
      `Unsupported registry version: ${json.registryVersion}`,
    );
  }
  return json;
}

export async function findPlugin(
  id: string,
): Promise<RegistryPlugin | undefined> {
  const index = await fetchRegistryIndex();
  return index.plugins.find((p) => p.id === id);
}

export function findVersion(
  plugin: RegistryPlugin,
  version?: string,
): RegistryVersion | undefined {
  if (!version) {
    return plugin.versions.find((v) => v.version === plugin.latestVersion);
  }
  return plugin.versions.find((v) => v.version === version);
}

export function isValidPluginId(id: string): boolean {
  // Mirrors src-tauri/src/plugins/manifest.rs `is_valid_id`.
  return /^[a-z0-9][a-z0-9._-]*$/.test(id);
}
