import type Stripe from "stripe";

import { generateLicenseKey } from "@/lib/license/generate";
import {
  canClaim,
  findActiveAssignment,
  getAssignments,
  type SeatAssignment,
  setAssignments,
} from "@/lib/seats/store";
import {
  computeTeamExpiresAt,
  getSubscriptionPeriodEnd,
  normalizeEmail,
} from "@/lib/stripe/server";

/** `expires_at` d'une clé de siège = fin de période + 14 j de grâce. */
export function seatExpiresAt(
  subscription: Stripe.Subscription,
): string | null {
  return computeTeamExpiresAt(getSubscriptionPeriodEnd(subscription));
}

/**
 * Génère une clé NOMINATIVE pour un porteur de siège (tier team, 1 siège).
 * La clé est signée hors-ligne ; l'app la vérifie sans phone-home.
 */
export function issueSeatKey(
  subscription: Stripe.Subscription,
  email: string,
): Promise<string> {
  return generateLicenseKey({
    email: normalizeEmail(email),
    paymentId: subscription.id,
    tier: "team",
    seats: 1,
    expiresAt: seatExpiresAt(subscription),
  });
}

export type ClaimResult =
  | { status: "claimed" | "existing"; email: string; licenseKey: string }
  | { status: "cap_reached" };

/**
 * Réclame (ou ré-émet) un siège de façon IDEMPOTENTE :
 * - email déjà actif → ré-émet sa clé SANS consommer de slot (`existing`) ;
 * - slot libre → ajoute l'affectation, émet la clé (`claimed`) ;
 * - plafond atteint → `cap_reached` (aucune mutation).
 *
 * Le plafond est vérifié ICI, côté serveur uniquement (§6). L'envoi d'email
 * est laissé à l'appelant (le porteur reçoit sa clé à l'adresse saisie).
 */
export async function claimSeat(
  stripe: Stripe,
  subscription: Stripe.Subscription,
  rawEmail: string,
  now: Date = new Date(),
): Promise<ClaimResult> {
  const email = normalizeEmail(rawEmail);
  const assignments = getAssignments(subscription);

  if (findActiveAssignment(assignments, email)) {
    const licenseKey = await issueSeatKey(subscription, email);
    return { status: "existing", email, licenseKey };
  }

  if (!canClaim(subscription)) {
    return { status: "cap_reached" };
  }

  const next: SeatAssignment[] = [
    ...assignments,
    { email, status: "active", claimedAt: now.toISOString() },
  ];
  await setAssignments(stripe, subscription.id, next);

  const licenseKey = await issueSeatKey(subscription, email);
  return { status: "claimed", email, licenseKey };
}
