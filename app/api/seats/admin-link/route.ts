import { NextResponse } from "next/server";

import { sendAdminLinkEmail } from "@/actions/send-team-emails";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { currentAdminLink } from "@/lib/seats/links";
import {
  findCurrentSubscriptionForCustomer,
  findCustomerByEmail,
  getBaseUrl,
  normalizeEmail,
} from "@/lib/stripe/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Réponse neutre (§6 anti-énumération) : on ne révèle jamais si l'email
// correspond à un abonnement. Recréée à chaque appel (un body de réponse ne
// se consomme qu'une fois).
const neutralOk = () =>
  NextResponse.json({
    status: "ok",
    message: "If this email is a billing contact, a management link was sent.",
  });

type AdminLinkBody = { email?: string };

/**
 * (Ré)envoie le lien de gestion d'équipe à l'email de FACTURATION d'un
 * abonnement Team actif. Toujours 200 — anti-énumération.
 */
export async function POST(request: Request) {
  try {
    const limit = rateLimit(
      `seats-admin-link:${getClientIp(request)}`,
      5,
      60_000,
    );
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const body = (await request.json().catch(() => ({}))) as AdminLinkBody;
    const email = body.email?.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      // Même forme de réponse neutre pour ne pas distinguer les cas.
      return neutralOk();
    }

    const normalized = normalizeEmail(email);
    const customer = await findCustomerByEmail(normalized);
    if (!customer) {
      return neutralOk();
    }

    const subscription = await findCurrentSubscriptionForCustomer(customer.id);
    if (!subscription) {
      return neutralOk();
    }

    // Le demandeur doit être l'email de FACTURATION (pas un simple siège).
    const billingEmail = customer.email ? normalizeEmail(customer.email) : null;
    if (billingEmail !== normalized) {
      return neutralOk();
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const adminUrl = currentAdminLink(subscription, getBaseUrl(request));
        await sendAdminLinkEmail({ email: normalized, adminUrl });
      } catch (error) {
        console.error("admin-link email failed", {
          reason: error instanceof Error ? error.message : "unknown",
        });
      }
    } else {
      console.warn("RESEND_API_KEY missing, skip admin-link email");
    }

    return neutralOk();
  } catch (error) {
    console.error("seats/admin-link failed", error);
    // Même en cas d'erreur interne, rester neutre côté énumération.
    return neutralOk();
  }
}
