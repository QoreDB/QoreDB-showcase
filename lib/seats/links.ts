import { randomBytes } from "node:crypto";
import type Stripe from "stripe";

import { DEFAULT_LOCALE } from "@/lib/locale";
import { getJoinNonce, setJoinNonce } from "@/lib/seats/store";
import { makeAdminToken, makeJoinToken } from "@/lib/seats/token";

/**
 * Construction des liens « capability » partagés à l'admin/aux coéquipiers.
 * Les pages frontend `/team/join` et `/team/admin` (lot UX) consomment ces
 * tokens et appellent les endpoints API. On pointe sur la locale par défaut ;
 * les pages restent accessibles dans toutes les locales.
 */

export function generateNonce(): string {
  return randomBytes(12).toString("base64url");
}

export function buildJoinUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/${DEFAULT_LOCALE}/team/join?token=${encodeURIComponent(token)}`;
}

export function buildAdminUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/${DEFAULT_LOCALE}/team/admin?token=${encodeURIComponent(token)}`;
}

/**
 * Garantit qu'un nonce de join existe sur l'abonnement (init paresseuse).
 * Retourne le nonce courant — généré et persisté s'il était absent.
 */
export async function ensureJoinNonce(
  stripe: Stripe,
  subscription: Stripe.Subscription,
): Promise<string> {
  const existing = getJoinNonce(subscription);
  if (existing) {
    return existing;
  }
  const nonce = generateNonce();
  await setJoinNonce(stripe, subscription.id, nonce);
  return nonce;
}

/** Join-link complet pour le nonce courant de l'abonnement. */
export async function currentJoinLink(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  baseUrl: string,
): Promise<string> {
  const nonce = await ensureJoinNonce(stripe, subscription);
  return buildJoinUrl(baseUrl, makeJoinToken(subscription.id, nonce));
}

/** Admin-link complet (token court). */
export function currentAdminLink(
  subscription: Stripe.Subscription,
  baseUrl: string,
): string {
  return buildAdminUrl(baseUrl, makeAdminToken(subscription.id));
}
