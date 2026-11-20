// SPDX-License-Identifier: Apache-2.0

import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "next-sanity";
import { buildRequest } from "./blog-translation/prompt";
import {
  applyTranslation,
  extractSegments,
  type SourcePost,
  type Translation,
  TranslationSchema,
  validateTranslation,
} from "./blog-translation/segments";

const OUT_DIR = path.resolve(".blog-translations");
const BATCH_FILE = path.join(OUT_DIR, "batch.json");
const PRICE = { input: 4, output: 20 };

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-02-19",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const anthropic = new Anthropic();

type Saved = {
  frId: string;
  frTitle: string;
  translation: Translation;
  usage: { input: number; output: number; batch: boolean };
};

type FullPost = SourcePost & {
  [key: string]: unknown;
  related?: { _key?: string; _ref: string; _type: string }[];
};

const PENDING_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))
  && (language == "fr" || !defined(language))
  && !defined(*[_id == ^._id + "-en"][0])
  && count(*[_type == "translation.metadata" && ^._id in translations[].value._ref
       && count(translations[language == "en"]) > 0]) == 0]
  | order(publishedAt asc){_id, title, body}`;

function savedPath(frId: string) {
  return path.join(OUT_DIR, `${frId}.json`);
}

function loadSaved(): Saved[] {
  mkdirSync(OUT_DIR, { recursive: true });
  return readdirSync(OUT_DIR)
    .filter((file) => file.endsWith(".json") && file !== "batch.json")
    .map((file) => JSON.parse(readFileSync(path.join(OUT_DIR, file), "utf8")));
}

function cost(input: number, output: number, batch: boolean) {
  const factor = batch ? 0.5 : 1;
  return ((input * PRICE.input + output * PRICE.output) / 1e6) * factor;
}

function parseMessage(message: Anthropic.Message): Translation {
  if (message.stop_reason !== "end_turn") {
    throw new Error(`stop_reason ${message.stop_reason}`);
  }
  const text = message.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("");
  return TranslationSchema.parse(JSON.parse(text));
}

function save(post: SourcePost, message: Anthropic.Message, batch: boolean) {
  const segments = extractSegments(post);
  const translation = parseMessage(message);
  const problems = validateTranslation(segments, translation);
  if (problems.length > 0) {
    throw new Error(problems.join("; "));
  }
  const saved: Saved = {
    frId: post._id,
    frTitle: post.title,
    translation,
    usage: {
      input: message.usage.input_tokens,
      output: message.usage.output_tokens,
      batch,
    },
  };
  writeFileSync(savedPath(post._id), `${JSON.stringify(saved, null, 2)}\n`);
  return saved;
}

async function pendingPosts(ids?: string[]) {
  const posts = await sanity.fetch<SourcePost[]>(PENDING_QUERY);
  const done = new Set(loadSaved().map((item) => item.frId));
  return posts.filter(
    (post) => !done.has(post._id) && (!ids || ids.includes(post._id)),
  );
}

async function listPending() {
  const posts = await pendingPosts();
  for (const post of posts) console.log(`${post._id}  ${post.title}`);
  console.log(`${posts.length} articles to translate`);
}

async function translateNow(ids: string[]) {
  for (const post of await pendingPosts(ids)) {
    const message = await anthropic.messages
      .stream(buildRequest(extractSegments(post)))
      .finalMessage();
    const saved = save(post, message, false);
    console.log(
      `${post._id}  ${saved.translation.title}  $${cost(saved.usage.input, saved.usage.output, false).toFixed(3)}`,
    );
  }
}

async function submitBatch(limit?: number) {
  const posts = (await pendingPosts()).slice(0, limit);
  if (posts.length === 0) return console.log("Nothing to translate");
  const batch = await anthropic.messages.batches.create({
    requests: posts.map((post) => ({
      custom_id: post._id,
      params: buildRequest(extractSegments(post)),
    })),
  });
  writeFileSync(
    BATCH_FILE,
    `${JSON.stringify({ id: batch.id, count: posts.length }, null, 2)}\n`,
  );
  console.log(`Batch ${batch.id} submitted with ${posts.length} articles`);
}

async function collectBatch() {
  const { id } = JSON.parse(readFileSync(BATCH_FILE, "utf8"));
  const batch = await anthropic.messages.batches.retrieve(id);
  if (batch.processing_status !== "ended") {
    const counts = batch.request_counts;
    return console.log(
      `Batch ${id}: ${batch.processing_status}, ${counts.succeeded} done, ${counts.processing} in progress`,
    );
  }
  const posts = await pendingPosts();
  let total = 0;
  for await (const result of await anthropic.messages.batches.results(id)) {
    const post = posts.find((item) => item._id === result.custom_id);
    if (!post) continue;
    if (result.result.type !== "succeeded") {
      console.log(`${result.custom_id}  ${result.result.type}`);
      continue;
    }
    try {
      const saved = save(post, result.result.message, true);
      total += cost(saved.usage.input, saved.usage.output, true);
      console.log(`${post._id}  ${saved.translation.title}`);
    } catch (error) {
      console.log(`${post._id}  rejected: ${(error as Error).message}`);
    }
  }
  console.log(`Batch cost: $${total.toFixed(2)}`);
}

function randomKey() {
  return randomBytes(6).toString("hex");
}

function referenceEntry(language: string, ref: string) {
  return {
    _key: randomKey(),
    _type: "internationalizedArrayReferenceValue",
    language,
    value: {
      _type: "reference",
      _ref: ref,
      _weak: true,
      _strengthenOnPublish: { type: "post" },
    },
  };
}

async function englishRelated(related: FullPost["related"]) {
  if (!related?.length) return undefined;
  const ids = related.map((item) => `${item._ref}-en`);
  const existing = new Set(
    await sanity.fetch<string[]>(`*[_id in $ids]._id`, { ids }),
  );
  const mapped = related
    .filter((item) => existing.has(`${item._ref}-en`))
    .map((item) => ({ ...item, _ref: `${item._ref}-en` }));
  return mapped.length > 0 ? mapped : undefined;
}

async function publish(ids?: string[]) {
  const saved = loadSaved().filter((item) => !ids || ids.includes(item.frId));
  for (const item of saved) {
    const original = await sanity.getDocument<FullPost>(item.frId);
    if (!original) {
      console.log(`${item.frId}  source missing, skipped`);
      continue;
    }
    const enId = `${item.frId}-en`;
    const slug = item.translation.slug;
    const clash = await sanity.fetch<string | null>(
      `*[_type == "post" && slug.current == $slug && _id != $enId && !(_id in path("drafts.**"))][0]._id`,
      { slug, enId },
    );
    if (clash) {
      console.log(`${item.frId}  slug "${slug}" already used by ${clash}`);
      continue;
    }

    const segments = extractSegments(original);
    const {
      _createdAt: _c,
      _updatedAt: _u,
      _rev: _r,
      related,
      ...rest
    } = original;
    const document = {
      ...rest,
      _id: enId,
      _type: "post",
      language: "en",
      title: item.translation.title,
      slug: { _type: "slug", current: slug },
      body: applyTranslation(original.body, segments, item.translation),
      related: await englishRelated(related),
    };
    await sanity.createOrReplace(document);

    const metadata = await sanity.fetch<{
      _id: string;
      translations: { language: string }[];
    } | null>(
      `*[_type == "translation.metadata" && $id in translations[].value._ref][0]{_id, translations}`,
      { id: item.frId },
    );
    if (!metadata) {
      await sanity.create({
        _id: randomUUID(),
        _type: "translation.metadata",
        schemaTypes: ["post"],
        translations: [
          referenceEntry("fr", item.frId),
          referenceEntry("en", enId),
        ],
      });
    } else if (
      !metadata.translations.some((entry) => entry.language === "en")
    ) {
      await sanity
        .patch(metadata._id)
        .append("translations", [referenceEntry("en", enId)])
        .commit();
    }
    console.log(`${item.frId}  published /en/blog/${slug}`);
  }
}

function idsArg(args: string[]) {
  const index = args.indexOf("--ids");
  return index === -1 ? undefined : args[index + 1].split(",");
}

const [command, ...args] = process.argv.slice(2);
const limitIndex = args.indexOf("--limit");
const limit = limitIndex === -1 ? undefined : Number(args[limitIndex + 1]);

const commands: Record<string, () => Promise<unknown>> = {
  pending: listPending,
  translate: () => translateNow(idsArg(args) ?? []),
  submit: () => submitBatch(limit),
  collect: collectBatch,
  publish: () => publish(idsArg(args)),
};

const run = commands[command];
if (!run) {
  console.log(
    "Usage: translate-posts <pending | translate --ids a,b | submit [--limit n] | collect | publish [--ids a,b]>",
  );
  process.exit(1);
}
run().catch((error) => {
  console.error(error);
  process.exit(1);
});
