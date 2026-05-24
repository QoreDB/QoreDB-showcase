import { NextResponse } from "next/server";
import {
  fetchRegistryIndex,
  RegistryUnavailableError,
} from "@/lib/marketplace/registry";

// GET /api/marketplace/plugins
//
// Returns the full registry catalog. The QoreDB app's in-app marketplace
// hits this endpoint, and the marketplace page on the showcase consumes it
// server-side. Response shape is the registry index itself — no rewriting,
// so the schema in qoredb-plugins-registry/schema/ describes both.

export const revalidate = 300;

export async function GET() {
  try {
    const index = await fetchRegistryIndex();
    return NextResponse.json(index, {
      headers: {
        // Five-minute browser cache, ten-minute CDN stale-while-revalidate.
        // Cheap to refresh, never urgent.
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
