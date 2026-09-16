// Génère les variantes WebP statiques utilisées par le loader next/image.
// Chaque source conserve son extension : hero.png -> hero.png-640.webp.

import path from "node:path";
import {
  generateImageVariants,
  writeImageVariantManifest,
} from "./image-variants";

async function main() {
  const { manifest, generated } = await generateImageVariants(
    path.join(process.cwd(), "public"),
  );
  await writeImageVariantManifest(
    path.join(process.cwd(), "lib", "image-variants.generated.ts"),
    manifest,
  );
  console.log(
    `[image-variants] ${generated} variante(s) générée(s), ${Object.keys(manifest).length} image(s) au manifeste.`,
  );
}

main().catch((error) => {
  console.error("[image-variants] échec :", error);
  process.exitCode = 1;
});
