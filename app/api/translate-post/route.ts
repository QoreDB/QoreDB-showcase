// SPDX-License-Identifier: Apache-2.0

import Anthropic from "@anthropic-ai/sdk";
import { after, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import {
  PENDING_FILTER,
  publishTranslation,
  translatePost,
} from "@/lib/blog-translation/publish";
import type { SourcePost } from "@/lib/blog-translation/segments";
import {
  isValidSignature,
  SIGNATURE_HEADER,
} from "@/lib/blog-translation/webhook";
import { dataset, projectId } from "@/sanity/env";

export const runtime = "nodejs";

const inFlight = new Set<string>();

function documentId(body: string) {
  try {
    const id = (JSON.parse(body) as { _id?: unknown })._id;
    return typeof id === "string" ? id.replace(/^drafts\./, "") : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_TRANSLATION_WEBHOOK_SECRET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!secret || !token || !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await request.text();
  if (!isValidSignature(body, request.headers.get(SIGNATURE_HEADER), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const id = documentId(body);
  if (!id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }
  if (inFlight.has(id)) {
    return NextResponse.json({ status: "in_progress" }, { status: 202 });
  }

  const sanity = createClient({
    projectId,
    dataset,
    apiVersion: "2025-02-19",
    useCdn: false,
    token,
  });
  const post = await sanity.fetch<SourcePost | null>(
    `*[${PENDING_FILTER} && _id == $id][0]{_id, title, body}`,
    { id },
  );
  if (!post) return NextResponse.json({ status: "skipped" });

  inFlight.add(id);
  after(async () => {
    try {
      const { translation, usage } = await translatePost(new Anthropic(), post);
      const url = await publishTranslation(sanity, id, translation);
      console.info(
        `[translate-post] ${id} published ${url} (${usage.input} in, ${usage.output} out)`,
      );
    } catch (error) {
      console.error(`[translate-post] ${id} failed`, error);
    } finally {
      inFlight.delete(id);
    }
  });
  return NextResponse.json({ status: "accepted" }, { status: 202 });
}
