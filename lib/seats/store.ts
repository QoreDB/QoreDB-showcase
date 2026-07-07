import type Stripe from "stripe";

import { normalizeEmail } from "@/lib/stripe/server";

/**
 * Ledger des sièges nominatifs d'un abonnement Team.
 *
 * Source de vérité = metadata de l'abonnement Stripe (zéro DB, fidèle au modèle
 * « Stripe = source de vérité »). On NE réutilise PAS la clé `qoredb_seats`
 * (qui porte le compteur entier hérité de Stage 1) : les affectations vivent
 * dans une clé dédiée pour éviter tout écrasement.
 *
 * ⚠️ Limite Stripe : ~500 caractères par valeur de metadata. En JSON compact
 * (email + statut + epoch), cela couvre confortablement des équipes ≤ ~20-30
 * sièges. Au-delà → prévoir un KV externe (cf. plan §1). On loggue un
 * avertissement à l'approche de la limite plutôt que de tronquer silencieusement.
 */

export const SEAT_ASSIGNMENTS_METADATA_KEY = "qoredb_seat_assignments";
export const JOIN_NONCE_METADATA_KEY = "qoredb_join_nonce";

const METADATA_VALUE_SOFT_LIMIT = 480;

export type SeatStatus = "active" | "removed";

export type SeatAssignment = {
  email: string;
  claimedAt: string; // ISO 8601
  status: SeatStatus;
};

// Représentation compacte stockée dans la metadata : { e, s, c }
type CompactAssignment = {
  e: string;
  s: "a" | "r";
  c: number; // epoch seconds
};

const toCompact = (assignment: SeatAssignment): CompactAssignment => ({
  e: assignment.email,
  s: assignment.status === "active" ? "a" : "r",
  c: Math.floor(new Date(assignment.claimedAt).getTime() / 1000),
});

const fromCompact = (raw: CompactAssignment): SeatAssignment => ({
  email: normalizeEmail(raw.e),
  status: raw.s === "a" ? "active" : "removed",
  claimedAt: new Date((raw.c || 0) * 1000).toISOString(),
});

export function serializeAssignments(list: SeatAssignment[]): string {
  return JSON.stringify(list.map(toCompact));
}

export function getAssignments(
  subscription: Stripe.Subscription,
): SeatAssignment[] {
  const raw = subscription.metadata?.[SEAT_ASSIGNMENTS_METADATA_KEY];
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as CompactAssignment[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry) => entry && typeof entry.e === "string")
      .map(fromCompact);
  } catch (error) {
    console.error("Failed to parse seat assignments metadata", {
      subscriptionId: subscription.id,
      error,
    });
    return [];
  }
}

/**
 * Persiste la liste d'affectations. Stripe MERGE les clés de metadata : seule
 * `SEAT_ASSIGNMENTS_METADATA_KEY` est écrite, les autres clés sont préservées.
 */
export async function setAssignments(
  stripe: Stripe,
  subscriptionId: string,
  list: SeatAssignment[],
): Promise<void> {
  const serialized = serializeAssignments(list);
  if (serialized.length > METADATA_VALUE_SOFT_LIMIT) {
    console.warn("Seat assignments metadata approaching Stripe size limit", {
      subscriptionId,
      length: serialized.length,
      seats: list.length,
    });
  }
  await stripe.subscriptions.update(subscriptionId, {
    metadata: { [SEAT_ASSIGNMENTS_METADATA_KEY]: serialized },
  });
}

/** Plafond = quantité facturée de la première ligne d'abonnement. */
export function getCap(subscription: Stripe.Subscription): number {
  const quantity = subscription.items?.data?.[0]?.quantity;
  return typeof quantity === "number" && quantity > 0 ? quantity : 0;
}

export function countActive(list: SeatAssignment[]): number {
  return list.filter((seat) => seat.status === "active").length;
}

/** Reste-t-il un slot libre sous le plafond ? */
export function canClaim(subscription: Stripe.Subscription): boolean {
  return countActive(getAssignments(subscription)) < getCap(subscription);
}

/**
 * Réduit les sièges actifs au plafond en marquant `removed` les plus RÉCENTS
 * (révocation douce suite à une baisse de quantité). Pure : retourne la liste
 * mutée + les emails retirés, sans effet de bord.
 */
export function computeTrimToCap(
  list: SeatAssignment[],
  cap: number,
): { next: SeatAssignment[]; removed: string[] } {
  const active = list.filter((seat) => seat.status === "active");
  if (active.length <= cap) {
    return { next: list, removed: [] };
  }

  const excess = active.length - cap;
  const mostRecentFirst = [...active].sort(
    (a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime(),
  );
  const removeSet = new Set(
    mostRecentFirst.slice(0, excess).map((seat) => seat.email),
  );
  const next = list.map((seat) =>
    seat.status === "active" && removeSet.has(seat.email)
      ? { ...seat, status: "removed" as const }
      : seat,
  );
  return { next, removed: [...removeSet] };
}

export function findActiveAssignment(
  list: SeatAssignment[],
  email: string,
): SeatAssignment | undefined {
  const normalized = normalizeEmail(email);
  return list.find(
    (seat) => seat.status === "active" && seat.email === normalized,
  );
}

export function getJoinNonce(subscription: Stripe.Subscription): string | null {
  return subscription.metadata?.[JOIN_NONCE_METADATA_KEY] ?? null;
}

/** Écrit le nonce du join-link (merge metadata). La rotation passe par ici. */
export async function setJoinNonce(
  stripe: Stripe,
  subscriptionId: string,
  nonce: string,
): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    metadata: { [JOIN_NONCE_METADATA_KEY]: nonce },
  });
}

const USABLE_STATUSES: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
];

/**
 * Retrouve l'abonnement Team « courant » dont `email` est un siège ACTIF.
 * Parcourt les abonnements utilisables du compte (v1 : limite 100, cf. §1).
 */
export async function findSubscriptionBySeatEmail(
  stripe: Stripe,
  email: string,
): Promise<Stripe.Subscription | null> {
  const normalized = normalizeEmail(email);
  const result = await stripe.subscriptions.list({
    status: "all",
    limit: 100,
  });

  const usable = result.data
    .filter((subscription) => USABLE_STATUSES.includes(subscription.status))
    .sort((a, b) => b.created - a.created);

  for (const subscription of usable) {
    if (findActiveAssignment(getAssignments(subscription), normalized)) {
      return subscription;
    }
  }
  return null;
}
