// Génère des variantes responsive (WebP) des images locales de /public/images.
//
// Pourquoi : le loader next/image custom (lib/sanity/imageLoader.ts) ne
// redimensionne PAS les images locales — pour garder la charge CPU/bande
// passante hors du VPS Hetzner. Sans variantes, mobile et desktop
// téléchargent le même fichier plein format (ex. hero 2782px = 207 Kio servi
// à un écran de 400px). PageSpeed le signale : « Améliorer l'affichage des
// images / 382–544 Kio ».
//
// Ce script pré-génère des fichiers STATIQUES (aucune charge runtime) à
// plusieurs largeurs, et écrit un manifeste consommé par le loader qui route
// alors chaque requête vers la variante la plus proche.
//
// Nommage : /images/x/hero.webp -> /images/x/hero-640.webp, hero-1200.webp, …
// Idempotent : on saute les fichiers déjà générés (suffixe -<largeur>.webp).

import { existsSync } from "node:fs";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "lib",
  "image-variants.generated.ts",
);

// Largeurs alignées sur les deviceSizes/imageSizes par défaut de next/image.
const WIDTHS = [384, 640, 828, 1200, 1600, 2048];
const QUALITY = 74;
const SOURCE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const VARIANT_RE = /-\d+\.webp$/;

type Manifest = Record<string, number[]>;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return Promise.resolve([full]);
    }),
  );
  return files.flat();
}

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.warn(`[image-variants] ${IMAGES_DIR} introuvable, rien à faire.`);
    await writeManifest({});
    return;
  }

  const all = await walk(IMAGES_DIR);
  const sources = all.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return SOURCE_EXT.has(ext) && !VARIANT_RE.test(f);
  });

  const manifest: Manifest = {};
  let generated = 0;

  for (const source of sources) {
    const image = sharp(source);
    const meta = await image.metadata();
    const originalWidth = meta.width ?? 0;
    if (!originalWidth) continue;

    const dir = path.dirname(source);
    const base = path.basename(source, path.extname(source));
    const publicPath = `/${path.relative(PUBLIC_DIR, source).split(path.sep).join("/")}`;

    // On ne monte jamais au-dessus de la largeur native.
    const targets = WIDTHS.filter((w) => w < originalWidth);
    if (originalWidth <= WIDTHS[0]) {
      // Image déjà petite : pas de variante, le loader gardera l'original.
      continue;
    }

    const availableWidths: number[] = [];
    for (const w of targets) {
      const outPath = path.join(dir, `${base}-${w}.webp`);
      availableWidths.push(w);
      if (
        existsSync(outPath) &&
        (await stat(outPath)).mtimeMs >= (await stat(source)).mtimeMs
      ) {
        continue; // déjà à jour
      }
      await sharp(source)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      generated++;
    }

    if (availableWidths.length > 0) {
      manifest[publicPath] = availableWidths;
    }
  }

  await writeManifest(manifest);
  console.log(
    `[image-variants] ${generated} variante(s) générée(s), ${Object.keys(manifest).length} image(s) au manifeste.`,
  );
}

async function writeManifest(manifest: Manifest) {
  const body = `// GÉNÉRÉ AUTOMATIQUEMENT par scripts/generate-image-variants.ts — ne pas éditer.
// Mappe chaque image locale vers les largeurs de variantes WebP disponibles.
export const IMAGE_VARIANTS: Record<string, number[]> = ${JSON.stringify(
    manifest,
    null,
    2,
  )};
`;
  await writeFile(MANIFEST_PATH, body, "utf8");
}

main().catch((err) => {
  console.error("[image-variants] échec :", err);
  process.exit(1);
});
