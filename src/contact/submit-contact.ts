"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { isLocale } from "@/i18n/config";

export type ContactFormState = {
  status: "idle" | "error";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const localeRaw = String(formData.get("locale") ?? "en");
  const locale = isLocale(localeRaw) ? localeRaw : "en";
  const thankYouPath = `/${locale}/contact/thank-you`;

  // Honeypot — real users never fill `website`.
  const website = String(formData.get("website") ?? "").trim();
  if (website.length > 0) {
    redirect(thankYouPath);
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const enquiry = String(formData.get("enquiry") ?? "").trim();

  if (
    name.length === 0 ||
    name.length > 120 ||
    company.length === 0 ||
    company.length > 160 ||
    enquiry.length === 0 ||
    enquiry.length > 5000 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { status: "error" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "info@highvalleyoil.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "High Valley Oil <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return { status: "error" };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Contact form — ${name} (${company})`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      "",
      enquiry,
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return { status: "error" };
  }

  redirect(thankYouPath);
}
