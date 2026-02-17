import { getPublicKeyAsync, signAsync, verifyAsync } from "@noble/ed25519";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export type LicenseTier = "pro";

export type LicensePayload = {
	email: string;
	tier: LicenseTier;
	issued_at: string;
	expires_at: string | null;
	payment_id: string;
};

export type LicenseEnvelope = {
	payload: LicensePayload;
	signature: string;
};

export type GenerateLicenseInput = {
	email: string;
	paymentId: string;
	tier?: LicenseTier;
	issuedAt?: string;
	expiresAt?: string | null;
	privateKeyBase64?: string;
};

const normalizeBase64 = (value: string) => value.replace(/-/g, "+").replace(/_/g, "/");

const decodeBase64 = (value: string) => {
	const normalized = normalizeBase64(value.trim());
	return new Uint8Array(Buffer.from(normalized, "base64"));
};

const encodeBase64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64");

const readPrivateKey = (provided?: string) => {
	const raw = provided ?? process.env.LICENSE_PRIVATE_KEY;
	if (!raw) {
		throw new Error("LICENSE_PRIVATE_KEY is missing");
	}

	const bytes = decodeBase64(raw);
	if (bytes.length === 32) {
		return bytes;
	}

	if (bytes.length === 64) {
		return bytes.slice(0, 32);
	}

	throw new Error("LICENSE_PRIVATE_KEY must decode to 32 or 64 bytes");
};

const toJsonBytes = (value: unknown) => encoder.encode(JSON.stringify(value));

export async function getPublicKeyFromPrivateKey(
	privateKeyBase64?: string,
): Promise<string> {
	const privateKey = readPrivateKey(privateKeyBase64);
	const publicKey = await getPublicKeyAsync(privateKey);
	return encodeBase64(publicKey);
}

export async function generateLicenseKey(
	input: GenerateLicenseInput,
): Promise<string> {
	const privateKey = readPrivateKey(input.privateKeyBase64);
	const payload: LicensePayload = {
		email: input.email.trim().toLowerCase(),
		tier: input.tier ?? "pro",
		issued_at: input.issuedAt ?? new Date().toISOString(),
		expires_at: input.expiresAt ?? null,
		payment_id: input.paymentId,
	};

	const signature = await signAsync(toJsonBytes(payload), privateKey);
	const envelope: LicenseEnvelope = {
		payload,
		signature: encodeBase64(signature),
	};

	return encodeBase64(toJsonBytes(envelope));
}

export function decodeLicenseKey(licenseKey: string): LicenseEnvelope {
	const raw = decoder.decode(decodeBase64(licenseKey));
	const parsed = JSON.parse(raw) as Partial<LicenseEnvelope>;

	if (!parsed.payload || !parsed.signature) {
		throw new Error("Invalid license envelope");
	}

	return parsed as LicenseEnvelope;
}

export async function verifyLicenseKey(
	licenseKey: string,
	publicKeyBase64: string,
): Promise<{ valid: boolean; payload?: LicensePayload }> {
	const envelope = decodeLicenseKey(licenseKey);
	const signature = decodeBase64(envelope.signature);
	const publicKey = decodeBase64(publicKeyBase64);
	const valid = await verifyAsync(
		signature,
		toJsonBytes(envelope.payload),
		publicKey,
	);

	if (!valid) {
		return { valid: false };
	}

	return { valid: true, payload: envelope.payload };
}
