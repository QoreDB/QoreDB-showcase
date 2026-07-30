import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  address: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().max(80).optional(),
  /** Honeypot field — bots fill it, humans don't. */
  address: z.string().optional(),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;

export const ossProgramSchema = z.object({
  email: z.string().email("Invalid email address"),
  githubUsername: z
    .string()
    .min(1)
    .max(40)
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
      "Invalid GitHub username",
    ),
  repo: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[^\s]+\/[^\s]+$/, "Use owner/repo format"),
  note: z.string().max(500).optional(),
  /** Honeypot. */
  address: z.string().optional(),
});

export type OssProgramFormData = z.infer<typeof ossProgramSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
  source: z.string().max(80).optional(),
  /** Honeypot. */
  address: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
