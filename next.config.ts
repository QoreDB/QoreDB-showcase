import type { NextConfig } from "next";
import { SUPPORTED_LOCALES } from "./lib/locale";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return SUPPORTED_LOCALES.map((locale) => ({
      source: `/${locale}/quick-start`,
      destination: `/${locale}/docs/getting-started/installation`,
      permanent: true,
    }));
  },
};

export default nextConfig;
