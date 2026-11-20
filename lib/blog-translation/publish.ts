// SPDX-License-Identifier: Apache-2.0

import { randomBytes, randomUUID } from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import type { SanityClient } from "next-sanity";
import { buildRequest } from "./prompt";
import {
  applyTranslation,
  extractSegments,
  type SourcePost,
  type Translation,
  TranslationSchema,
  validateTranslation,
} from "./segments";

export const PENDING_FILTER = `_type == "post" && !(_id in path("drafts.**"))
  && (language == "fr" || !defined(language))
  && !defined(*[_id == ^._id + "-en"][0])
  && count(*[_type == "translation.metadata" && ^._id in translations[].value._ref
       && count(translations[language == "en"]) > 0]) == 0`;

export type Usage = { input: number; output: number };

type FullPost = SourcePost & {
  [key: string]: unknown;
  related?: { _key?: string; _ref: string; _type: string }[];
};

export function parseTranslation(
  post: SourcePost,
  message: Anthropic.Message,
): Translation {
  if (message.stop_reason !== "end_turn") {
    throw new Error(`stop_reason ${message.stop_reason}`);
  }
  const text = message.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join("");
  const translation = TranslationSchema.parse(JSON.parse(text));
  const problems = validateTranslation(extractSegments(post), translation);
  if (problems.length > 0) throw new Error(problems.join("; "));
  return translation;
}

export async function translatePost(anthropic: Anthropic, post: SourcePost) {
  const message = await anthropic.messages
    .stream(buildRequest(extractSegments(post)))
    .finalMessage();
  const usage: Usage = {
    input: message.usage.input_tokens,
    output: message.usage.output_tokens,
  };
  return { translation: parseTranslation(post, message), usage };
}

function referenceEntry(language: string, ref: string) {
  return {
    _key: randomBytes(6).toString("hex"),
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

async function englishRelated(
  sanity: SanityClient,
  related: FullPost["related"],
) {
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

export async function publishTranslation(
  sanity: SanityClient,
  frId: string,
  translation: Translation,
) {
  const original = await sanity.getDocument<FullPost>(frId);
  if (!original) throw new Error(`source ${frId} missing`);

  const enId = `${frId}-en`;
  const slug = translation.slug;
  const clash = await sanity.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug && _id != $enId && !(_id in path("drafts.**"))][0]._id`,
    { slug, enId },
  );
  if (clash) throw new Error(`slug "${slug}" already used by ${clash}`);

  const {
    _createdAt: _c,
    _updatedAt: _u,
    _rev: _r,
    related,
    ...rest
  } = original;
  await sanity.createOrReplace({
    ...rest,
    _id: enId,
    _type: "post",
    language: "en",
    title: translation.title,
    slug: { _type: "slug", current: slug },
    body: applyTranslation(
      original.body,
      extractSegments(original),
      translation,
    ),
    related: await englishRelated(sanity, related),
  });

  const metadata = await sanity.fetch<{
    _id: string;
    translations: { language: string }[];
  } | null>(
    `*[_type == "translation.metadata" && $id in translations[].value._ref][0]{_id, translations}`,
    { id: frId },
  );
  if (!metadata) {
    await sanity.create({
      _id: randomUUID(),
      _type: "translation.metadata",
      schemaTypes: ["post"],
      translations: [referenceEntry("fr", frId), referenceEntry("en", enId)],
    });
  } else if (!metadata.translations.some((entry) => entry.language === "en")) {
    await sanity
      .patch(metadata._id)
      .append("translations", [referenceEntry("en", enId)])
      .commit();
  }
  return `/en/blog/${slug}`;
}
