"use server";

import { Resend } from "resend";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const FROM = () =>
  process.env.LICENSE_FROM_EMAIL ?? "QoreDB <license@mail.qoredb.com>";

const shell = (inner: string) => `
<!doctype html>
<html>
  <body style="font-family: Inter, system-ui, sans-serif; background-color: #f7f7fb; padding: 24px; color: #111827;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 28px;">
      ${inner}
      <p style="margin: 20px 0 0;"><a href="https://www.qoredb.com/fr/quick-start">Documentation</a></p>
      <p style="margin: 6px 0 0;"><a href="https://www.qoredb.com/fr#contact">Support</a></p>
    </div>
  </body>
</html>`;

const button = (href: string, label: string) =>
  `<p style="margin: 0 0 16px;"><a href="${escapeHtml(href)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-weight: 600;">${escapeHtml(label)}</a></p>`;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }
  return new Resend(apiKey);
}

type AdminWelcomeInput = {
  email: string;
  joinUrl: string;
  adminUrl: string;
  seats: number;
};

/**
 * Email envoyé à l'admin après l'achat : explique les sièges nominatifs et
 * fournit le join-link (à partager à l'équipe) + l'admin-link (gestion).
 * La clé du siège admin est envoyée séparément via `sendLicenseEmail`.
 */
export async function sendTeamAdminWelcomeEmail({
  email,
  joinUrl,
  adminUrl,
  seats,
}: AdminWelcomeInput) {
  const html = shell(`
    <h1 style="margin: 0 0 12px; font-size: 24px;">Votre équipe QoreDB Team</h1>
    <p style="margin: 0 0 18px; color: #4b5563;">Bonjour ${escapeHtml(email)},</p>
    <p style="margin: 0 0 12px; color: #4b5563;">Votre abonnement Team couvre <strong>${seats} sièges nominatifs</strong> (une licence par personne). Votre propre siège est déjà actif : sa clé vous est envoyée dans un email séparé.</p>
    <p style="margin: 0 0 18px; color: #6b7280; font-size: 13px;">Chaque siège est rattaché à une personne. Le partage d'une clé ou l'usage au-delà des sièges souscrits sont interdits (<a href="https://www.qoredb.com/fr/terms">conditions d'utilisation</a>).</p>
    <h2 style="margin: 18px 0 8px; font-size: 16px;">Inviter votre équipe</h2>
    <p style="margin: 0 0 12px; color: #4b5563;">Partagez ce lien à vos coéquipiers. Chacun saisit son email et reçoit sa propre clé (dans la limite des sièges payés).</p>
    ${button(joinUrl, "Lien d'invitation")}
    <h2 style="margin: 18px 0 8px; font-size: 16px;">Gérer votre équipe</h2>
    <p style="margin: 0 0 12px; color: #4b5563;">Voir les sièges, en libérer un ou faire tourner le lien d'invitation :</p>
    ${button(adminUrl, "Gérer mon équipe")}
    <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">Conservez ces liens : le lien de gestion expire et peut être renvoyé depuis la page Tarifs.</p>
  `);

  const { error } = await getResend().emails.send({
    from: FROM(),
    to: [email],
    subject: "Votre équipe QoreDB Team — invitez vos coéquipiers",
    html,
  });
  if (error) {
    throw new Error(
      `Failed to send team admin welcome email: ${error.message}`,
    );
  }
}

type AdminLinkInput = {
  email: string;
  adminUrl: string;
};

/** (Ré)envoi du lien de gestion d'équipe à l'email de facturation. */
export async function sendAdminLinkEmail({ email, adminUrl }: AdminLinkInput) {
  const html = shell(`
    <h1 style="margin: 0 0 12px; font-size: 24px;">Gérer votre équipe QoreDB</h1>
    <p style="margin: 0 0 18px; color: #4b5563;">Bonjour ${escapeHtml(email)},</p>
    <p style="margin: 0 0 16px; color: #4b5563;">Voici votre lien de gestion d'équipe (sièges, invitations, facturation) :</p>
    ${button(adminUrl, "Gérer mon équipe")}
    <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">Ce lien est temporaire. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  `);

  const { error } = await getResend().emails.send({
    from: FROM(),
    to: [email],
    subject: "Votre lien de gestion d'équipe QoreDB",
    html,
  });
  if (error) {
    throw new Error(`Failed to send admin link email: ${error.message}`);
  }
}

type SeatRemovedInput = {
  email: string;
  removedEmails: string[];
};

/** Notifie l'admin que des sièges ont été retirés (baisse de quantité). */
export async function sendSeatsRemovedEmail({
  email,
  removedEmails,
}: SeatRemovedInput) {
  const list = removedEmails.map((e) => `<li>${escapeHtml(e)}</li>`).join("");
  const html = shell(`
    <h1 style="margin: 0 0 12px; font-size: 24px;">Sièges QoreDB Team retirés</h1>
    <p style="margin: 0 0 18px; color: #4b5563;">Bonjour ${escapeHtml(email)},</p>
    <p style="margin: 0 0 12px; color: #4b5563;">Suite à la réduction du nombre de sièges de votre abonnement, ${removedEmails.length} siège(s) ont été libéré(s) :</p>
    <ul style="margin: 0 0 16px; padding-left: 20px; color: #4b5563;">${list}</ul>
    <p style="margin: 0; color: #4b5563;">Les licences concernées resteront valides jusqu'à leur date d'expiration, mais ne seront pas renouvelées.</p>
  `);

  const { error } = await getResend().emails.send({
    from: FROM(),
    to: [email],
    subject: "Sièges QoreDB Team retirés",
    html,
  });
  if (error) {
    throw new Error(`Failed to send seats removed email: ${error.message}`);
  }
}
