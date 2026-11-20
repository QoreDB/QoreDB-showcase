// SPDX-License-Identifier: Apache-2.0

import { createHmac, timingSafeEqual } from "node:crypto";

export const SIGNATURE_HEADER = "sanity-webhook-signature";

const HEADER_FORMAT = /^t=(\d+)[, ]+v1=([^, ]+)$/;

export function signPayload(body: string, timestamp: number, secret: string) {
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");
  return `t=${timestamp},v1=${digest}`;
}

export function isValidSignature(
  body: string,
  header: string | null,
  secret: string,
) {
  const match = header?.trim().match(HEADER_FORMAT);
  if (!match || !body) return false;
  const expected = Buffer.from(signPayload(body, Number(match[1]), secret));
  const received = Buffer.from(header?.trim() ?? "");
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
