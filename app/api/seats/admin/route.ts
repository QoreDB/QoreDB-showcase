import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  buildJoinUrl,
  currentJoinLink,
  generateNonce,
} from "@/lib/seats/links";
import {
  getAssignments,
  getCap,
  type SeatAssignment,
  setAssignments,
  setJoinNonce,
} from "@/lib/seats/store";
import { makeJoinToken, verifyToken } from "@/lib/seats/token";
import {
  getBaseUrl,
  getStripeClient,
  normalizeEmail,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

const USABLE_STATUSES = new Set(["active", "trialing", "past_due"]);

type ResolveOk = {
  ok: true;
  stripe: Stripe;
  subscription: Stripe.Subscription;
};
type ResolveErr = { ok: false; response: NextResponse };

/**
 * Vérifie l'admin-token et charge l'abonnement. Réponses neutres (§6) : un
 * token invalide/expiré renvoie toujours 401 sans détailler la raison.
 */
async function resolveAdmin(
  token: string | null,
): Promise<ResolveOk | ResolveErr> {
  const unauthorized: ResolveErr = {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };

  if (!token) {
    return unauthorized;
  }
  const payload = verifyToken(token, "admin");
  if (!payload) {
    return unauthorized;
  }

  const stripe = getStripeClient();
  try {
    const subscription = await stripe.subscriptions.retrieve(payload.subId);
    if (!USABLE_STATUSES.has(subscription.status)) {
      return unauthorized;
    }
    return { ok: true, stripe, subscription };
  } catch {
    return unauthorized;
  }
}

function serializeSeats(list: SeatAssignment[]) {
  return list.map((seat) => ({
    email: seat.email,
    status: seat.status,
    claimedAt: seat.claimedAt,
  }));
}

export async function GET(request: Request) {
  try {
    const limit = rateLimit(`seats-admin:${getClientIp(request)}`, 30, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const token = new URL(request.url).searchParams.get("token");
    const resolved = await resolveAdmin(token);
    if (!resolved.ok) {
      return resolved.response;
    }

    const { stripe, subscription } = resolved;
    const assignments = getAssignments(subscription);
    const baseUrl = getBaseUrl(request);
    const joinLink = await currentJoinLink(stripe, subscription, baseUrl);

    return NextResponse.json({
      cap: getCap(subscription),
      seats: serializeSeats(assignments),
      joinLink,
    });
  } catch (error) {
    console.error("seats/admin GET failed", error);
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }
}

type AdminAction =
  | { action: "remove"; email?: string; adminToken?: string }
  | { action: "rotate"; adminToken?: string };

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`seats-admin:${getClientIp(request)}`, 30, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json().catch(() => ({}))) as AdminAction;
    const headerToken = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");
    const resolved = await resolveAdmin(body.adminToken ?? headerToken ?? null);
    if (!resolved.ok) {
      return resolved.response;
    }

    const { stripe, subscription } = resolved;

    if (body.action === "remove") {
      const email = body.email ? normalizeEmail(body.email) : null;
      if (!email) {
        return NextResponse.json(
          { error: "email is required" },
          { status: 400 },
        );
      }
      // Révocation DOUCE : on marque `removed` (libère un slot, stoppe la
      // réémission au renouvellement). La clé courante reste valide jusqu'à
      // expires_at (cohérent offline, cf. §1).
      const next = getAssignments(subscription).map((seat) =>
        seat.email === email && seat.status === "active"
          ? { ...seat, status: "removed" as const }
          : seat,
      );
      await setAssignments(stripe, subscription.id, next);
      return NextResponse.json({ status: "removed", email });
    }

    if (body.action === "rotate") {
      // Nouveau nonce → tous les anciens join-links deviennent invalides.
      const nonce = generateNonce();
      await setJoinNonce(stripe, subscription.id, nonce);
      const baseUrl = getBaseUrl(request);
      const joinLink = buildJoinUrl(
        baseUrl,
        makeJoinToken(subscription.id, nonce),
      );
      return NextResponse.json({ status: "rotated", joinLink });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("seats/admin POST failed", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 },
    );
  }
}
