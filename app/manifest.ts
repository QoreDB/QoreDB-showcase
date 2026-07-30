import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE } from "@/lib/locale";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — The modern database client`,
    short_name: SITE_NAME,
    description:
      "A fast, secure modern database client for developers. Unified SQL + NoSQL, secure vault, local-first.",
    lang: DEFAULT_LOCALE,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0C0F",
    theme_color: "#6B5CFF",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
