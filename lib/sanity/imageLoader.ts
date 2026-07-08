// Custom next/image loader.
//
// Goal: stop routing images through Vercel's Image Optimization, which is a
// major source of "Fast Origin Transfer" usage. Instead:
//   - Sanity images (cdn.sanity.io) are served directly from Sanity's CDN,
//     which already resizes/optimizes on the fly (w, q, auto=format).
//   - Any other image (local /public assets, etc.) is returned untouched and
//     served as a plain static asset (counts as roomy Fast Data Transfer,
//     not the capped Fast Origin Transfer).
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
