import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const name = typeof body?.name === "string" ? body.name.trim() : "";
        const role = typeof body?.role === "string" ? body.role.trim() : "";
        const message = typeof body?.message === "string" ? body.message.trim() : "";

        if (!name || name.length < 1 || !message || message.length < 2) {
            return NextResponse.json(
                { success: false, message: "Invalid submission" },
                { status: 400 }
            );
        }

        const safeName = escapeHtml(name);
        const safeRole = role ? escapeHtml(role) : "N/A";
        const safeMessage = escapeHtml(message);

        await getResend().emails.send({
            from: "Guestbook <onboarding@resend.dev>",
            to: "ruchinaudichya100@gmail.com",
            subject: `New Guestbook Entry from ${safeName}`,
            html: `
                <h1>New Guestbook Message</h1>
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Role:</strong> ${safeRole}</p>
                <p><strong>Message:</strong></p>
                <blockquote>${safeMessage}</blockquote>
            `,
        });

        return NextResponse.json({ success: true, message: "Guestbook signed successfully!" });
    } catch (error) {
        console.error("Guestbook Error");
        return NextResponse.json(
            { success: false, message: "Failed to sign guestbook" },
            { status: 500 }
        );
    }
}
