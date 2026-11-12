import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

// Where contact-form messages are delivered. Override with CONTACT_TO in the environment.
// Resend's test sender only delivers to the address the Resend account was created with.
const CONTACT_TO = process.env.CONTACT_TO ?? "ruchinaudichya100@gmail.com";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isLikelyEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = text(body?.name, 100);
    const email = text(body?.email, 200);
    const message = text(body?.message, 4000);

    // Honeypot: bots fill the hidden "website" field. Pretend it worked.
    if (text(body?.website, 200)) {
      return NextResponse.json({ success: true });
    }

    if (name.length < 2 || !isLikelyEmail(email) || message.length < 10) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const data = await getResend().emails.send({
      from: "onboarding@resend.dev",
      to: CONTACT_TO,
      subject: `New message from ${safeName}`,
      replyTo: email,
      html: `
        <h1>New message from the portfolio</h1>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    if (data.error) {
      console.error("Contact: Resend error");
      return NextResponse.json({ error: "Could not send the message" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Contact form error");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
