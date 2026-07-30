/**
 * Export every newsletter subscriber from the Resend contact book as CSV on
 * stdout (summary goes to stderr, so redirection stays clean).
 *
 * Usage:
 *   npm run export:subscribers > subscribers.csv
 *
 * Reads RESEND_API_KEY from the environment, falling back to .env.local then
 * .env (tsx does not load them on its own).
 */
import { Resend } from "resend";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Missing file is fine — the variable may come from the shell.
  }
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("Missing RESEND_API_KEY (checked shell env, .env.local, .env)");
  process.exit(1);
}

const resend = new Resend(apiKey);

function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

async function main() {
  const rows = ["email,subscribed_at,unsubscribed,first_name,last_name"];
  let unsubscribed = 0;
  let after: string | undefined;

  while (true) {
    const { data, error } = await resend.contacts.list({
      limit: 100,
      ...(after ? { after } : {}),
    });
    if (error) {
      console.error(`Resend API error: ${error.message}`);
      process.exit(1);
    }

    for (const contact of data.data) {
      if (contact.unsubscribed) unsubscribed += 1;
      rows.push(
        [
          contact.email,
          contact.created_at,
          String(contact.unsubscribed),
          contact.first_name ?? "",
          contact.last_name ?? "",
        ]
          .map(csvField)
          .join(","),
      );
    }

    if (!data.has_more || data.data.length === 0) break;
    after = data.data[data.data.length - 1].id;
  }

  console.log(rows.join("\n"));
  console.error(
    `${rows.length - 1} contact(s) exported, ${unsubscribed} unsubscribed.`,
  );
}

main();
