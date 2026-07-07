import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tokens « capability » signés (HMAC-SHA256), sans comptes utilisateur.
 *
 * Format compact type JWT : base64url(payload).base64url(signature).
 * - join  : capability longue durée pour réclamer un siège ; rotable via nonce.
 * - admin : capability courte durée pour gérer l'équipe.
 *
 * Sécurité (§6) : signés + expirables ; comparaison de signature en temps
 * constant ; le join-token embarque le `nonce` courant pour permettre la
 * rotation (un token dont le nonce ne matche plus l'abonnement est rejeté par
 * l'appelant, cf. S3/S4).
 */

export type TokenKind = "join" | "admin";

export type TokenPayload = {
  kind: TokenKind;
  subId: string;
  nonce?: string; // join uniquement
  exp: number; // epoch seconds
};

// Durées de vie. Join : longue (l'admin distribue le lien) — révoqué par
// rotation de nonce, pas par expiration. Admin : courte (lien de gestion).
const JOIN_TTL_SECONDS = 365 * 24 * 60 * 60; // 1 an
const ADMIN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 jours

function getSecret(): string {
  const secret =
    process.env.SEATS_TOKEN_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "SEATS_TOKEN_SECRET (or STRIPE_WEBHOOK_SECRET fallback) is missing",
    );
  }
  return secret;
}

const b64url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64url");

function sign(encodedPayload: string): string {
  return createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function encode(payload: TokenPayload): string {
  const encodedPayload = b64url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function makeJoinToken(subId: string, nonce: string): string {
  return encode({
    kind: "join",
    subId,
    nonce,
    exp: nowSeconds() + JOIN_TTL_SECONDS,
  });
}

export function makeAdminToken(subId: string): string {
  return encode({
    kind: "admin",
    subId,
    exp: nowSeconds() + ADMIN_TTL_SECONDS,
  });
}

/**
 * Vérifie signature, expiration et `kind`. Retourne le payload ou `null`.
 * Ne vérifie PAS le nonce (dépendant de l'abonnement) : c'est à l'appelant
 * de comparer `payload.nonce` au nonce courant pour gérer la rotation.
 */
export function verifyToken(
  token: string,
  expectedKind: TokenKind,
): TokenPayload | null {
  if (typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as TokenPayload;
  } catch {
    return null;
  }

  if (payload.kind !== expectedKind) {
    return null;
  }
  if (typeof payload.exp !== "number" || payload.exp < nowSeconds()) {
    return null;
  }
  if (typeof payload.subId !== "string" || !payload.subId) {
    return null;
  }

  return payload;
}
