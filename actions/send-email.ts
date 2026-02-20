"use server";

import { Resend } from "resend";
import { contactSchema, ContactFormData } from "@/lib/schemas";

export async function sendEmail(data: ContactFormData) {
	const result = contactSchema.safeParse(data);

	if (!result.success) {
		return { success: false, error: result.error.message };
	}

	const { name, email, subject, message, address } = result.data;

	// Honeypot check
	if (address) {
		console.log("Honeypot filled, blocking spam.");
		return { success: true };
	}

	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return { success: false, error: "Email service is not configured." };
	}

	const resend = new Resend(apiKey);

	try {
		const { error } = await resend.emails.send({
			from: "QoreDB Contact <onboarding@resend.dev>",
			to: ["qoredb@gmail.com"],
			replyTo: email,
			subject: `[Contact Form] ${subject}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
		});

		if (error) {
			console.error("Resend error:", error);
			return { success: false, error: "Failed to send email. Please try again." };
		}

		return { success: true };
	} catch (error) {
		console.error("Server error:", error);
		return { success: false, error: "Something went wrong. Please try again." };
	}
}
