import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

const SECRET = "test-secret-for-seats-token";
process.env.SEATS_TOKEN_SECRET = SECRET;

import { makeAdminToken, makeJoinToken, verifyToken } from "./token";

test("valid join token round-trips subId and nonce", () => {
  const token = makeJoinToken("sub_123", "nonce_abc");
  const payload = verifyToken(token, "join");
  assert.ok(payload);
  assert.equal(payload?.subId, "sub_123");
  assert.equal(payload?.nonce, "nonce_abc");
  assert.equal(payload?.kind, "join");
});

test("valid admin token round-trips subId", () => {
  const token = makeAdminToken("sub_456");
  const payload = verifyToken(token, "admin");
  assert.ok(payload);
  assert.equal(payload?.subId, "sub_456");
});

test("kind mismatch is rejected", () => {
  const joinToken = makeJoinToken("sub_123", "n");
  assert.equal(verifyToken(joinToken, "admin"), null);

  const adminToken = makeAdminToken("sub_123");
  assert.equal(verifyToken(adminToken, "join"), null);
});

test("tampered signature is rejected", () => {
  const token = makeJoinToken("sub_123", "n");
  const [payload] = token.split(".");
  const forged = `${payload}.${"x".repeat(43)}`;
  assert.equal(verifyToken(forged, "join"), null);
});

test("tampered payload is rejected (signature no longer matches)", () => {
  const token = makeAdminToken("sub_123");
  const [, signature] = token.split(".");
  const forgedPayload = Buffer.from(
    JSON.stringify({ kind: "admin", subId: "sub_999", exp: 9999999999 }),
  ).toString("base64url");
  assert.equal(verifyToken(`${forgedPayload}.${signature}`, "admin"), null);
});

test("expired token is rejected", () => {
  // Forge un token avec exp dans le passé, signé avec le bon secret via l'API
  // interne reproduite : on encode/sign comme le module.
  const expiredPayload = Buffer.from(
    JSON.stringify({ kind: "admin", subId: "sub_1", exp: 1 }),
  ).toString("base64url");
  const sig = createHmac("sha256", SECRET)
    .update(expiredPayload)
    .digest("base64url");
  assert.equal(verifyToken(`${expiredPayload}.${sig}`, "admin"), null);
});

test("garbage input is rejected", () => {
  assert.equal(verifyToken("", "join"), null);
  assert.equal(verifyToken("no-dot", "join"), null);
  assert.equal(verifyToken("a.b.c", "join"), null);
});

test("rotation: a join token with a stale nonce is detectable by the caller", () => {
  // verifyToken ne vérifie pas le nonce ; il retourne le nonce embarqué pour
  // que l'appelant le compare au nonce courant de l'abonnement.
  const token = makeJoinToken("sub_123", "old_nonce");
  const payload = verifyToken(token, "join");
  assert.equal(payload?.nonce, "old_nonce");
  // Simule la rotation côté abonnement -> mismatch -> l'appelant rejette.
  const currentNonce = "new_nonce";
  assert.notEqual(payload?.nonce, currentNonce);
});
