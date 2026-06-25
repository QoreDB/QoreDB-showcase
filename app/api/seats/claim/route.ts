import { NextResponse } from "next/server";

import { sendLicenseEmail } from "@/actions/send-license-email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { claimSeat } from "@/lib/seats/issue";
import { getJoinNonce } from "@/lib/seats/store";
import { verifyToken } from "@/lib/seats/token";
import { getStripeClient } from "@/lib/stripe/server";

export const runtime = "nodejs";

type ClaimBody = {
  joinToken?: string;
  email?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USABLE_STATUSES = new Set(["active", "trialing", "past_due"]);

/**
 * Un coéquipier réclame son siège via le join-link partagé par l'admin.
 * POST { joinToken, email } → email la clé nominative au porteur.
 *
 * Sécurité (§6) : rate-limit, validation email, token signé + nonce (rotation),
 * plafond vérifié côté serveur, clé livrée UNIQUEMENT par email (jamais dans la
 * réponse HTTP — l'adresse saisie n'est pas authentifiée).
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(`seats-claim:${getClientIp(request)}`, 10, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json().catch(() => ({}))) as ClaimBody;
    const email = body.email?.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!body.joinToken) {
      return NextResponse.json(
        { error: "Missing join token" },
        { status: 400 },
      );
    }

    const payload = verifyToken(body.joinToken, "join");
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 401 },
      );
    }

    const stripe = getStripeClient();
    let subscription: Awaited<ReturnType<typeof stripe.subscriptions.retrieve>>;
    try {
      subscription = await stripe.subscriptions.retrieve(payload.subId);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 401 },
      );
    }

    if (!USABLE_STATUSES.has(subscription.status)) {
      return NextResponse.json(
        { error: "This team subscription is no longer active" },
        { status: 403 },
      );
    }

    // Rotation : le join-token embarque le nonce émis. S'il ne matche plus le
    // nonce courant de l'abonnement, le lien a été révoqué.
    if (payload.nonce !== getJoinNonce(subscription)) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 401 },
      );
    }

    const result = await claimSeat(stripe, subscription, email);
    if (result.status === "cap_reached") {
      return NextResponse.json(
        { error: "All seats are currently taken. Ask your admin for a seat." },
        { status: 409 },
      );
    }

    if (process.env.RESEND_API_KEY) {
      try {
        await sendLicenseEmail({
          email: result.email,
          licenseKey: result.licenseKey,
          tier: "team",
          seats: 1,
        });
      } catch (error) {
        console.error("Seat claim email failed, assignment is recorded", {
          subscriptionId: subscription.id,
          reason: error instanceof Error ? error.message : "unknown",
        });
      }
    } else {
      console.warn("RESEND_API_KEY missing, skip seat license email");
    }

    return NextResponse.json({ status: result.status, email: result.email });
  } catch (error) {
    console.error("seats/claim failed", error);
    return NextResponse.json(
      { error: "Failed to claim seat" },
      { status: 500 },
    );
  }
}
