// Custom next/image loader.
//
// Goal: keep image bytes off the app server (Hetzner VPS), whose CPU and
// bandwidth are the scarce resources. Instead:
//   - Sanity images (cdn.sanity.io) are served directly from Sanity's CDN,
//     which already resizes/optimizes on the fly (w, q, auto=format).
//   - Any other image (local /public assets, etc.) is returned untouched and
//     served as a plain static asset.
export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Non-Sanity images (local static files, etc.): serve as-is, no optimization.
  if (!src.includes("cdn.sanity.io")) {
    return src;
  }

  // Sanity CDN: let Sanity do the resizing/format conversion.
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
