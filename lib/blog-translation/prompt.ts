// SPDX-License-Identifier: Apache-2.0

import type Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { type Segments, TranslationSchema } from "./segments";

export const MODEL = "claude-opus-5-5";

const SYSTEM_PROMPT = `You translate technical blog articles about QoreDB, a desktop database client built with Rust and Tauri, from French into natural American English for a developer audience.

The input is a JSON object holding the article segments. Return the same structure in English:
- title: sentence case, like "Indexes in QoreDB: showing what the engine actually exposes".
- slug: a short English URL slug in lowercase kebab case, ASCII only, at most eight words, derived from the English title.
- blocks: one entry per input block, same key. Each block is a sentence or paragraph split into spans that are concatenated with no separator; the split follows formatting marks. Return exactly as many spans as the input block, in the same order, so the concatenation reads as natural English. Keep the leading and trailing spaces at span boundaries. A span whose marks include "code" is code: return it unchanged.
- callouts, images: same keys, translated text, alt and caption. Keep an empty string empty.
- code: same keys. Translate only the French comments; every other character of the code stays identical, and the number of lines does not change.

Translate the meaning, not word by word: an English-speaking engineer should not be able to tell it was translated. Keep the author's tone, which is factual and precise, and keep every technical claim exactly as stated. Do not add, remove or soften information.

Keep unchanged: product and edition names (QoreDB, Core, Pro, Team, Qore AI Local, Database Agent), database and library names, code identifiers, SQL keywords, file paths, commands, version numbers and URLs. Write QoreDB user interface labels with their natural English wording. Replace French quotation marks with English double quotes. Never use em dashes or en dashes: use commas, colons, parentheses or separate sentences instead.`;

export function buildRequest(
  segments: Segments,
): Anthropic.MessageCreateParamsNonStreaming {
  const { parse: _parse, ...format } = zodOutputFormat(TranslationSchema);
  return {
    model: MODEL,
    max_tokens: 32000,
    system: SYSTEM_PROMPT,
    output_config: { effort: "medium", format },
    messages: [{ role: "user", content: JSON.stringify(segments) }],
  };
}
