"use server";

import { Resend } from "resend";

type SendLicenseEmailInput = {
	email: string;
	licenseKey: string;
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

const buildLicenseEmailHtml = (email: string, licenseKey: string) => `
<!doctype html>
<html>
  <body style="font-family: Inter, system-ui, sans-serif; background-color: #f7f7fb; padding: 24px; color: #111827;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 28px;">
      <h1 style="margin: 0 0 12px; font-size: 24px;">Votre licence QoreDB Pro</h1>
      <p style="margin: 0 0 18px; color: #4b5563;">Bonjour ${escapeHtml(email)},</p>
      <p style="margin: 0 0 18px; color: #4b5563;">Merci pour votre achat. Voici votre clé de licence QoreDB Pro.</p>

      <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Clé de licence</p>
      <pre style="white-space: pre-wrap; word-break: break-all; background-color: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 10px; font-size: 12px; line-height: 1.45;">${escapeHtml(licenseKey)}</pre>

      <h2 style="margin: 20px 0 8px; font-size: 16px;">Activation</h2>
      <ol style="margin: 0 0 20px; padding-left: 20px; color: #4b5563;">
        <li>Ouvrir QoreDB</li>
        <li>Aller dans Settings</li>
        <li>Ouvrir Licence</li>
        <li>Coller la clé</li>
        <li>Cliquer sur Activer</li>
      </ol>

      <p style="margin: 0 0 8px;"><a href="https://www.qoredb.com/fr/quick-start">Documentation</a></p>
      <p style="margin: 0;"><a href="https://www.qoredb.com/fr#contact">Support</a></p>
    </div>
  </body>
</html>
`;

export async function sendLicenseEmail({
	email,
	licenseKey,
}: SendLicenseEmailInput) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is missing");
	}

	const resend = new Resend(apiKey);
	const html = buildLicenseEmailHtml(email, licenseKey);

	const { error } = await resend.emails.send({
		from: process.env.LICENSE_FROM_EMAIL ?? "QoreDB <onboarding@resend.dev>",
		to: [email],
		subject: "Votre licence QoreDB Pro",
		html,
	});

	if (error) {
		throw new Error(`Failed to send license email: ${error.message}`);
	}
}
