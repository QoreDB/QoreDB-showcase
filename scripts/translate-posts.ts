// SPDX-License-Identifier: Apache-2.0

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "next-sanity";
import { buildRequest } from "../lib/blog-translation/prompt";
import {
  PENDING_FILTER,
  parseTranslation,
  publishTranslation,
  translatePost,
  type Usage,
} from "../lib/blog-translation/publish";
import {
  extractSegments,
  type SourcePost,
  type Translation,
} from "../lib/blog-translation/segments";

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
  usage: Usage & { batch: boolean };
};

function savedPath(frId: string) {
  return path.join(OUT_DIR, `${frId}.json`);
}

function loadSaved(): Saved[] {
  mkdirSync(OUT_DIR, { recursive: true });
  return readdirSync(OUT_DIR)
    .filter((file) => file.endsWith(".json") && file !== "batch.json")
    .map((file) => JSON.parse(readFileSync(path.join(OUT_DIR, file), "utf8")));
}

function cost(usage: Usage, batch: boolean) {
  const factor = batch ? 0.5 : 1;
  return (
    ((usage.input * PRICE.input + usage.output * PRICE.output) / 1e6) * factor
  );
}

function save(
  post: SourcePost,
  translation: Translation,
  usage: Usage,
  batch: boolean,
) {
  const saved: Saved = {
    frId: post._id,
    frTitle: post.title,
    translation,
    usage: { ...usage, batch },
  };
  writeFileSync(savedPath(post._id), `${JSON.stringify(saved, null, 2)}\n`);
  return saved;
}

async function pendingPosts(ids?: string[]) {
  const posts = await sanity.fetch<SourcePost[]>(
    `*[${PENDING_FILTER}] | order(publishedAt asc){_id, title, body}`,
  );
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

async function translateNow(ids?: string[]) {
  for (const post of await pendingPosts(ids)) {
    const { translation, usage } = await translatePost(anthropic, post);
    save(post, translation, usage, false);
    console.log(
      `${post._id}  ${translation.title}  $${cost(usage, false).toFixed(3)}`,
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
    const message = result.result.message;
    try {
      const translation = parseTranslation(post, message);
      const usage = {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
      };
      save(post, translation, usage, true);
      total += cost(usage, true);
      console.log(`${post._id}  ${translation.title}`);
    } catch (error) {
      console.log(`${post._id}  rejected: ${(error as Error).message}`);
    }
  }
  console.log(`Batch cost: $${total.toFixed(2)}`);
}

async function publish(ids?: string[]) {
  const saved = loadSaved().filter((item) => !ids || ids.includes(item.frId));
  for (const item of saved) {
    try {
      const url = await publishTranslation(sanity, item.frId, item.translation);
      console.log(`${item.frId}  published ${url}`);
    } catch (error) {
      console.log(`${item.frId}  skipped: ${(error as Error).message}`);
    }
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
  translate: () => translateNow(idsArg(args)),
  submit: () => submitBatch(limit),
  collect: collectBatch,
  publish: () => publish(idsArg(args)),
};

const run = commands[command];
if (!run) {
  console.log(
    "Usage: translate-posts <pending | translate [--ids a,b] | submit [--limit n] | collect | publish [--ids a,b]>",
  );
  process.exit(1);
}
run().catch((error) => {
  console.error(error);
  process.exit(1);
});
