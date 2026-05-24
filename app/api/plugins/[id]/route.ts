import { type NextRequest, NextResponse } from "next/server";
import {
  findPlugin,
  isValidPluginId,
  RegistryUnavailableError,
} from "@/lib/marketplace/registry";

// GET /api/plugins/<plugin-id>
//
// Returns a single registry entry (all versions). 404 if the id isn't in
// the catalog, 400 if the id doesn't pass the same syntactic check the
// QoreDB host enforces (so we don't echo garbage back to the caller).

export const revalidate = 300;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!isValidPluginId(id)) {
    return NextResponse.json(
      { error: "Invalid plugin id format" },
      { status: 400 },
    );
  }
  try {
    const plugin = await findPlugin(id);
    if (!plugin) {
      return NextResponse.json(
        { error: `Plugin '${id}' is not in the registry` },
        { status: 404 },
      );
    }
    return NextResponse.json(plugin, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message =
      error instanceof RegistryUnavailableError
        ? error.message
        : "Failed to load the plugin registry";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
