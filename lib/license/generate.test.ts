import assert from "node:assert/strict";
import test from "node:test";
import { keygenAsync } from "@noble/ed25519";

import {
  decodeLicenseKey,
  generateLicenseKey,
  getPublicKeyFromPrivateKey,
  verifyLicenseKey,
} from "./generate";

const toBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");

test("generate + verify license key", async () => {
  const { secretKey } = await keygenAsync();
  const privateKeyBase64 = toBase64(secretKey);
  const publicKeyBase64 = await getPublicKeyFromPrivateKey(privateKeyBase64);

  const licenseKey = await generateLicenseKey({
    email: "User@example.com",
    paymentId: "pi_test_123",
    privateKeyBase64,
    issuedAt: "2026-02-17T00:00:00.000Z",
  });

  const decoded = decodeLicenseKey(licenseKey);
  assert.equal(decoded.payload.email, "user@example.com");
  assert.equal(decoded.payload.payment_id, "pi_test_123");

  const verification = await verifyLicenseKey(licenseKey, publicKeyBase64);
  assert.equal(verification.valid, true);
  assert.equal(verification.payload?.tier, "pro");
  // Une clé Pro ne porte jamais de champ seats.
  assert.equal(verification.payload?.seats, undefined);
  assert.equal(decoded.payload.expires_at, null);
});

test("generate + verify team license key with seats", async () => {
  const { secretKey } = await keygenAsync();
  const privateKeyBase64 = toBase64(secretKey);
  const publicKeyBase64 = await getPublicKeyFromPrivateKey(privateKeyBase64);

  const licenseKey = await generateLicenseKey({
    email: "Admin@Acme.com",
    paymentId: "sub_test_123",
    tier: "team",
    seats: 5,
    expiresAt: "2027-06-15T00:00:00.000Z",
    privateKeyBase64,
    issuedAt: "2026-06-01T00:00:00.000Z",
  });

  const decoded = decodeLicenseKey(licenseKey);
  assert.equal(decoded.payload.email, "admin@acme.com");
  assert.equal(decoded.payload.tier, "team");
  assert.equal(decoded.payload.seats, 5);
  assert.equal(decoded.payload.expires_at, "2027-06-15T00:00:00.000Z");
  assert.equal(decoded.payload.payment_id, "sub_test_123");

  const verification = await verifyLicenseKey(licenseKey, publicKeyBase64);
  assert.equal(verification.valid, true);
  assert.equal(verification.payload?.tier, "team");
  assert.equal(verification.payload?.seats, 5);
});
