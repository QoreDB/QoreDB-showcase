import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// POST /api/plugins/submit
//
// Public submission endpoint. Stages a pending plugin in Sanity for a
// maintainer to review in the Studio. The bytes never become reachable from
// the marketplace API until the maintainer mirrors them into the
// qoredb-plugins-registry repo and flips the doc's status to `approved`.
//
// Request: multipart/form-data with these fields:
//   pluginId       Reverse-DNS id, must match plugin.json#id.
//   name           Display name.
//   version        Semver string, must match plugin.json#version.
//   description    Short marketing description.
//   author         Maintainer name (free-form).
//   contactEmail   Used to reach the submitter for review feedback.
//   repositoryUrl  Optional source-of-truth link.
//   kind           "declarative" | "executable".
//   manifest       The plugin.json verbatim, as a string.
//   archive        The plugin.zip blob.
//
// Mirrors the same constraints the QoreDB host enforces at install time, so
// a submission that would fail to install won't enter the review queue
// either: id pattern, manifest cross-checks, 8 MiB / 256 files budget,
// runtime presence vs declared kind.

const MAX_ARCHIVE_BYTES = 8 * 1024 * 1024;
const PLUGIN_ID_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORIES = new Set([
  "safety",
  "observability",
  "productivity",
  "theming",
  "integrations",
]);

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

interface ParsedManifest {
  id?: unknown;
  name?: unknown;
  version?: unknown;
  runtime?: unknown;
}

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return fail(
      "Marketplace submissions are temporarily disabled. Please try again later.",
      503,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Expected multipart/form-data");
  }

  const pluginId = (form.get("pluginId") ?? "").toString().trim();
  const name = (form.get("name") ?? "").toString().trim();
  const version = (form.get("version") ?? "").toString().trim();
  const description = (form.get("description") ?? "").toString().trim();
  const author = (form.get("author") ?? "").toString().trim();
  const contactEmail = (form.get("contactEmail") ?? "").toString().trim();
  const repositoryUrl = (form.get("repositoryUrl") ?? "").toString().trim();
  const kind = (form.get("kind") ?? "").toString().trim();
  const category = (form.get("category") ?? "").toString().trim();
  const manifestRaw = (form.get("manifest") ?? "").toString();
  const archive = form.get("archive");

  if (!PLUGIN_ID_PATTERN.test(pluginId)) {
    return fail(
      "Plugin id must use lowercase letters, digits, '.', '-' or '_'",
    );
  }
  if (!name) return fail("Display name is required");
  if (!version) return fail("Version is required");
  if (!EMAIL_PATTERN.test(contactEmail))
    return fail("A valid contact email is required");
  if (kind !== "declarative" && kind !== "executable") {
    return fail("Kind must be 'declarative' or 'executable'");
  }
  if (!CATEGORIES.has(category)) {
    return fail(
      "Category is required and must be one of: safety, observability, productivity, theming, integrations",
    );
  }
  if (!(archive instanceof File))
    return fail("Missing plugin.zip in the 'archive' field");
  if (archive.size > MAX_ARCHIVE_BYTES) {
    return fail(
      `plugin.zip exceeds the 8 MiB install budget (got ${archive.size} bytes)`,
    );
  }
  if (archive.size === 0) return fail("plugin.zip is empty");

  let manifest: ParsedManifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch {
    return fail("plugin.json is not valid JSON");
  }
  if (manifest.id !== pluginId) {
    return fail(
      "Form 'pluginId' does not match plugin.json#id. Both must agree.",
    );
  }
  if (manifest.version !== version) {
    return fail(
      "Form 'version' does not match plugin.json#version. Both must agree.",
    );
  }
  const hasRuntime = manifest.runtime != null;
  if (kind === "executable" && !hasRuntime) {
    return fail("Executable plugins must declare a 'runtime' block in plugin.json");
  }
  if (kind === "declarative" && hasRuntime) {
    return fail(
      "Declarative plugins must not declare a 'runtime' block in plugin.json",
    );
  }
  if (typeof manifest.name !== "string" || manifest.name.trim() === "") {
    return fail("plugin.json#name must be a non-empty string");
  }

  // Hash the archive so the reviewer can cross-reference what they're about
  // to mirror into the registry. Not a substitute for the per-version
  // sha256 in index.json — that one is committed alongside the bytes.
  const archiveBytes = new Uint8Array(await archive.arrayBuffer());
  const archiveSha = createHash("sha256")
    .update(archiveBytes)
    .digest("hex");

  let assetRef: string;
  try {
    const asset = await writeClient.assets.upload(
      "file",
      Buffer.from(archiveBytes),
      { filename: `${pluginId}-${version}.zip`, contentType: "application/zip" },
    );
    assetRef = asset._id;
  } catch (error) {
    console.error("Failed to upload plugin archive to Sanity:", error);
    return fail("Could not store the archive. Please try again.", 502);
  }

  try {
    const doc = await writeClient.create({
      _type: "pluginSubmission",
      pluginId,
      name,
      version,
      description: description || undefined,
      author: author || undefined,
      contactEmail,
      repositoryUrl: repositoryUrl || undefined,
      kind,
      category,
      archive: {
        _type: "file",
        asset: { _type: "reference", _ref: assetRef },
      },
      manifest: manifestRaw,
      submittedAt: new Date().toISOString(),
      status: "pending",
    });

    return NextResponse.json(
      {
        ok: true,
        submissionId: doc._id,
        archiveSha256: `sha256-${archiveSha}`,
        // The maintainer side picks the doc up by id in the Studio.
        reviewUrl: `/studio/desk/pluginSubmission;${doc._id}`,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Failed to create plugin submission:", error);
    return fail("Could not record the submission. Please try again.", 502);
  }
}
