import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { IMAGE_VARIANTS } from "../lib/image-variants.generated";
import customImageLoader from "../lib/sanity/imageLoader";
import {
  generateImageVariants,
  writeImageVariantManifest,
} from "./image-variants";

test("same-stem PNG and WebP retain their own pixels and aspect ratio", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "qore-image-variants-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = path.join(root, "images", "features");
  await mkdir(directory, { recursive: true });

  for (const [extension, height, background] of [
    ["png", 400, "red"],
    ["webp", 600, "blue"],
  ] as const) {
    await sharp({
      create: { width: 800, height, channels: 3, background },
    }).toFile(path.join(directory, `fixture.${extension}`));
  }
  // Old generated files must not re-enter the source inventory.
  await sharp({
    create: { width: 384, height: 100, channels: 3, background: "green" },
  }).toFile(path.join(directory, "fixture-384.webp"));

  const first = await generateImageVariants(root);
  assert.equal(first.generated, 4);
  assert.deepEqual(first.manifest, {
    "/images/features/fixture.png": [384, 640],
    "/images/features/fixture.webp": [384, 640],
  });

  for (const extension of ["png", "webp"] as const) {
    const src = `/images/features/fixture.${extension}` as const;
    IMAGE_VARIANTS[src] = first.manifest[src];
    t.after(() => {
      delete IMAGE_VARIANTS[src];
    });
    const url = customImageLoader({ src, width: 320 });
    assert.equal(url, `${src}-384.webp`);
    const output = path.join(root, url);
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.width, 384);
    assert.equal(metadata.height, extension === "png" ? 192 : 288);
    const { channels } = await sharp(output).stats();
    assert.ok(channels[extension === "png" ? 0 : 2].mean > 240);
    assert.ok(channels[extension === "png" ? 2 : 0].mean < 10);
    assert.equal(customImageLoader({ src, width: 1600 }), src);
  }

  const output = path.join(directory, "fixture.webp-384.webp");
  const before = (await stat(output)).mtimeMs;
  const second = await generateImageVariants(root);
  assert.equal(second.generated, 0);
  assert.deepEqual(second.manifest, first.manifest);
  assert.equal((await stat(output)).mtimeMs, before);

  await rm(path.join(directory, "fixture.png"));
  const third = await generateImageVariants(root);
  assert.deepEqual(Object.keys(third.manifest), [
    "/images/features/fixture.webp",
  ]);
  const manifestFile = path.join(root, "manifest.ts");
  await writeImageVariantManifest(manifestFile, third.manifest);
  const body = await readFile(manifestFile, "utf8");
  assert.ok(!body.includes("fixture.png"));
});

test("only database icons get tiny sizes, never larger than their source", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "qore-image-icons-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const icons = path.join(root, "images", "databases");
  const features = path.join(root, "images", "features");
  await mkdir(icons, { recursive: true });
  await mkdir(features, { recursive: true });
  for (const [directory, name, width] of [
    [icons, "small", 20],
    [icons, "medium", 50],
    [icons, "large", 512],
    [features, "small", 50],
    [features, "large", 800],
  ] as const) {
    await sharp({
      create: { width, height: width, channels: 3, background: "purple" },
    }).toFile(path.join(directory, `${name}.webp`));
  }
  const { manifest } = await generateImageVariants(root);
  assert.deepEqual(manifest["/images/databases/medium.webp"], [24, 40]);
  assert.deepEqual(
    manifest["/images/databases/large.webp"],
    [24, 40, 64, 96, 128],
  );
  assert.deepEqual(manifest["/images/features/large.webp"], [384, 640]);
  assert.equal(manifest["/images/databases/small.webp"], undefined);
  assert.equal(manifest["/images/features/small.webp"], undefined);
  const metadata = await sharp(
    path.join(icons, "medium.webp-40.webp"),
  ).metadata();
  assert.equal(metadata.width, 40);
});

test("empty sources clear the manifest and unrelated loader URLs are preserved", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "qore-image-empty-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  assert.deepEqual(await generateImageVariants(root), {
    manifest: {},
    generated: 0,
  });
  const svg = "/images/brand.svg";
  assert.equal(customImageLoader({ src: svg, width: 64 }), svg);
  const url = new URL(
    customImageLoader({
      src: "https://cdn.sanity.io/images/project/dataset/image.jpg",
      width: 640,
      quality: 80,
    }),
  );
  assert.equal(url.searchParams.get("w"), "640");
  assert.equal(url.searchParams.get("q"), "80");
  assert.equal(url.searchParams.get("fit"), "max");
});
