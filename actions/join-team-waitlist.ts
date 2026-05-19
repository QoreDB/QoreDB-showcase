"use server";

import { Resend } from "resend";
import { type WaitlistFormData, waitlistSchema } from "@/lib/schemas";

const NOTIFY_TO = "qoredb@gmail.com";

export async function joinTeamWaitlist(data: WaitlistFormData) {
  const parsed = waitlistSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid email" };
  }

  const { email, source, address } = parsed.data;

  if (address) {
    return { success: true as const };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[team-waitlist] RESEND_API_KEY missing — logged only:", {
      email,
      source,
    });
    return { success: true as const };
  }

  const resend = new Resend(apiKey);
  const audienceId = process.env.RESEND_TEAM_WAITLIST_AUDIENCE_ID;

  try {
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    }

    await resend.emails.send({
      from: "QoreDB Waitlist <onboarding@resend.dev>",
      to: [NOTIFY_TO],
      subject: `[Team waitlist] ${email}`,
      text: `New Team / Enterprise waitlist signup.\n\nEmail: ${email}\nSource: ${source ?? "pricing-page"}\n`,
    });

    return { success: true as const };
  } catch (error) {
    console.error("[team-waitlist] failed", error);
    return { success: false as const, error: "Submission failed" };
  }
}
