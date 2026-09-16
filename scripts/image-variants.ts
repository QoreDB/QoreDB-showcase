import { existsSync } from "node:fs";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_WIDTHS = [384, 640, 828, 1200, 1600, 2048];
const ICON_WIDTHS = [24, 40, 64, 96, 128];
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
// Ignore both historical stem-width outputs and extension-qualified outputs.
const VARIANT_PATTERN = /-\d+\.webp$/;

export type ImageVariantManifest = Record<string, number[]>;

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
    }),
  );
  return files.flat();
}

export async function generateImageVariants(publicDirectory: string) {
  const imagesDirectory = path.join(publicDirectory, "images");
  const manifest: ImageVariantManifest = {};
  let generated = 0;
  if (!existsSync(imagesDirectory)) return { manifest, generated };

  const sources = (await walk(imagesDirectory))
    .filter(
      (file) =>
        SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()) &&
        !VARIANT_PATTERN.test(file),
    )
    .sort();

  for (const source of sources) {
    const metadata = await sharp(source).metadata();
    const originalWidth = metadata.width ?? 0;
    if (!originalWidth) continue;

    const relative = path.relative(publicDirectory, source).split(path.sep);
    const publicPath = `/${relative.join("/")}`;
    const widths = relative[1] === "databases" ? ICON_WIDTHS : IMAGE_WIDTHS;
    const targets = widths.filter((width) => width < originalWidth);
    if (targets.length === 0) continue;
    const sourceModified = (await stat(source)).mtimeMs;

    for (const width of targets) {
      // PNG and WebP masters with the same stem can depict different UI.
      // Keeping the source extension gives each original its own outputs.
      const output = `${source}-${width}.webp`;
      if (
        existsSync(output) &&
        (await stat(output)).mtimeMs >= sourceModified
      ) {
        continue;
      }
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 74 })
        .toFile(output);
      generated++;
    }
    manifest[publicPath] = targets;
  }
  return { manifest, generated };
}

export async function writeImageVariantManifest(
  file: string,
  manifest: ImageVariantManifest,
) {
  const body = `// GÉNÉRÉ AUTOMATIQUEMENT par scripts/generate-image-variants.ts — ne pas éditer.
// Mappe chaque image locale vers les largeurs de variantes WebP disponibles.
export const IMAGE_VARIANTS: Record<string, number[]> = ${JSON.stringify(manifest, null, 2)};
`;
  await writeFile(file, body, "utf8");
}
