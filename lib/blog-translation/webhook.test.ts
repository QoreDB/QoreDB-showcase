// SPDX-License-Identifier: Apache-2.0

import assert from "node:assert/strict";
import test from "node:test";

import { isValidSignature, signPayload } from "./webhook";

const SECRET = "test-secret";
const BODY = JSON.stringify({ _id: "abc" });

async function sanityReferenceHeader(body: string, timestamp: number) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${body}`),
  );
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  const digest = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `t=${timestamp},v1=${digest}`;
}

test("matches the header format produced by Sanity webhooks", async () => {
  const timestamp = 1763640000000;
  assert.equal(
    signPayload(BODY, timestamp, SECRET),
    await sanityReferenceHeader(BODY, timestamp),
  );
});

test("accepts a valid signature", () => {
  const header = signPayload(BODY, 1763640000000, SECRET);
  assert.equal(isValidSignature(BODY, header, SECRET), true);
});

test("rejects a tampered body, a wrong secret or a malformed header", () => {
  const header = signPayload(BODY, 1763640000000, SECRET);
  assert.equal(isValidSignature('{"_id":"xyz"}', header, SECRET), false);
  assert.equal(isValidSignature(BODY, header, "other-secret"), false);
  assert.equal(isValidSignature(BODY, null, SECRET), false);
  assert.equal(isValidSignature(BODY, "v1=abc", SECRET), false);
  assert.equal(isValidSignature("", header, SECRET), false);
});
