// SPDX-License-Identifier: Apache-2.0

import { z } from "zod";

type Span = { _type: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string };
type BodyNode = {
  _key: string;
  _type: string;
  children?: Span[];
  markDefs?: MarkDef[];
  text?: string;
  alt?: string;
  caption?: string;
  code?: string;
};

export type SourcePost = {
  _id: string;
  title: string;
  body: BodyNode[];
};

export type Segments = {
  title: string;
  blocks: { key: string; spans: { text: string; marks: string[] }[] }[];
  callouts: { key: string; text: string }[];
  images: { key: string; alt: string; caption: string }[];
  code: { key: string; code: string }[];
};

export const TranslationSchema = z.object({
  title: z.string(),
  slug: z.string(),
  blocks: z.array(z.object({ key: z.string(), spans: z.array(z.string()) })),
  callouts: z.array(z.object({ key: z.string(), text: z.string() })),
  images: z.array(
    z.object({ key: z.string(), alt: z.string(), caption: z.string() }),
  ),
  code: z.array(z.object({ key: z.string(), code: z.string() })),
});

export type Translation = z.infer<typeof TranslationSchema>;

const FRENCH_COMMENT = /(\/\/|#|--|\/\*).*[a-zà-ÿ]{3,}/i;
const FRENCH_LETTERS = /[éèêàùçôîœ]/i;

function markNames(span: Span, markDefs: MarkDef[]): string[] {
  return (span.marks ?? []).map((mark) => {
    const def = markDefs.find((item) => item._key === mark);
    return def ? def._type : mark;
  });
}

function hasFrenchComments(code: string) {
  return code
    .split("\n")
    .some((line) => FRENCH_COMMENT.test(line) && FRENCH_LETTERS.test(line));
}

export function extractSegments(post: SourcePost): Segments {
  const segments: Segments = {
    title: post.title,
    blocks: [],
    callouts: [],
    images: [],
    code: [],
  };

  for (const node of post.body ?? []) {
    if (node._type === "block") {
      const spans = (node.children ?? [])
        .filter((child) => child._type === "span")
        .map((child) => ({
          text: child.text ?? "",
          marks: markNames(child, node.markDefs ?? []),
        }));
      if (spans.some((span) => span.text.trim() !== "")) {
        segments.blocks.push({ key: node._key, spans });
      }
    } else if (node._type === "callout" && node.text) {
      segments.callouts.push({ key: node._key, text: node.text });
    } else if (node._type === "image" && (node.alt || node.caption)) {
      segments.images.push({
        key: node._key,
        alt: node.alt ?? "",
        caption: node.caption ?? "",
      });
    } else if (
      node._type === "codeBlock" &&
      node.code &&
      hasFrenchComments(node.code)
    ) {
      segments.code.push({ key: node._key, code: node.code });
    }
  }

  return segments;
}

function sameKeys(a: { key: string }[], b: { key: string }[]) {
  const left = a.map((item) => item.key).sort();
  const right = b.map((item) => item.key).sort();
  return (
    left.length === right.length &&
    left.every((key, index) => key === right[index])
  );
}

function codeStructureKept(original: string, translated: string) {
  const before = original.split("\n");
  const after = translated.split("\n");
  if (before.length !== after.length) return false;
  return before.every(
    (line, index) => FRENCH_COMMENT.test(line) || line === after[index],
  );
}

export function validateTranslation(
  segments: Segments,
  translation: Translation,
): string[] {
  const problems: string[] = [];
  if (!sameKeys(segments.blocks, translation.blocks))
    problems.push("block keys differ");
  if (!sameKeys(segments.callouts, translation.callouts))
    problems.push("callout keys differ");
  if (!sameKeys(segments.images, translation.images))
    problems.push("image keys differ");
  if (!sameKeys(segments.code, translation.code))
    problems.push("code keys differ");

  for (const block of segments.blocks) {
    const translated = translation.blocks.find(
      (item) => item.key === block.key,
    );
    if (translated && translated.spans.length !== block.spans.length) {
      problems.push(`span count differs in block ${block.key}`);
    }
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(translation.slug))
    problems.push(`invalid slug ${translation.slug}`);
  if (/[—–]/.test(JSON.stringify(translation)))
    problems.push("contains an em or en dash");

  return problems;
}

export function applyTranslation(
  body: BodyNode[],
  segments: Segments,
  translation: Translation,
): BodyNode[] {
  const copy: BodyNode[] = structuredClone(body ?? []);

  for (const node of copy) {
    if (node._type === "block") {
      const source = segments.blocks.find((item) => item.key === node._key);
      const translated = translation.blocks.find(
        (item) => item.key === node._key,
      );
      if (!source || !translated) continue;
      let index = 0;
      for (const child of node.children ?? []) {
        if (child._type !== "span") continue;
        const keepCode = source.spans[index]?.marks.includes("code");
        if (!keepCode) child.text = translated.spans[index];
        index += 1;
      }
    } else if (node._type === "callout") {
      const translated = translation.callouts.find(
        (item) => item.key === node._key,
      );
      if (translated) node.text = translated.text;
    } else if (node._type === "image") {
      const translated = translation.images.find(
        (item) => item.key === node._key,
      );
      if (translated) {
        if (node.alt) node.alt = translated.alt;
        if (node.caption) node.caption = translated.caption;
      }
    } else if (node._type === "codeBlock" && node.code) {
      const translated = translation.code.find(
        (item) => item.key === node._key,
      );
      if (translated && codeStructureKept(node.code, translated.code)) {
        node.code = translated.code;
      }
    }
  }

  return copy;
}
