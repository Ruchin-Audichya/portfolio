import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const isLikelyEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = typeof body?.name === "string" ? body.name.trim() : "";
        const email = typeof body?.email === "string" ? body.email.trim() : "";
        const message = typeof body?.message === "string" ? body.message.trim() : "";

        if (!name || name.length < 2 || !isLikelyEmail(email) || message.length < 10) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

        const data = await getResend().emails.send({
            from: "onboarding@resend.dev",
            to: "ruchinaudichya100@gmail.com",
            subject: `New Message from ${safeName}`,
            replyTo: email,
            html: `
                <h1>New Message from Portfolio</h1>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Message:</strong></p>
                <p>${safeMessage}</p>
            `,
        });

        if (data.error) {
            console.error("Contact: Resend error");
            return NextResponse.json({ error: data.error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
