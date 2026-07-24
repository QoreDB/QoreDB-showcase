// Custom next/image loader.
//
// Goal: keep image bytes off the app server (Hetzner VPS), whose CPU and
// bandwidth are the scarce resources. Instead:
//   - Sanity images (cdn.sanity.io) are served directly from Sanity's CDN,
//     which already resizes/optimizes on the fly (w, q, auto=format).
//   - Local /public images are served as STATIC pre-generated responsive
//     variants (see scripts/generate-image-variants.ts). The manifest maps a
//     source path to the widths available; here we route each request to the
//     smallest variant >= the requested width. No runtime resizing.
//   - Anything without a variant (SVG, tiny images…) is returned untouched.
import { IMAGE_VARIANTS } from "../image-variants.generated";

export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Sanity CDN: let Sanity do the resizing/format conversion.
  if (src.includes("cdn.sanity.io")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }

  // Local static image with pre-generated responsive variants.
  const widths = IMAGE_VARIANTS[src];
  if (widths && widths.length > 0) {
    const target = widths.find((w) => w >= width) ?? widths[widths.length - 1];
    const dot = src.lastIndexOf(".");
    return `${src.slice(0, dot)}-${target}.webp`;
  }

  // No variant available: serve as-is, no optimization.
  return src;
}
