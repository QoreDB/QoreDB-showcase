import test from "node:test";
import assert from "node:assert/strict";
import { keygenAsync } from "@noble/ed25519";

import {
	generateLicenseKey,
	getPublicKeyFromPrivateKey,
	verifyLicenseKey,
	decodeLicenseKey,
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
});
