import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, role, message } = body;

        // Log the submission
        console.log("Guestbook Submission:", { name, role, message });

        // Email Notification Logic
        await getResend().emails.send({
            from: 'Guestbook <onboarding@resend.dev>',
            to: 'ruchinaudichya100@gmail.com',
            subject: `New Guestbook Entry from ${name}`,
            html: `
                <h1>New Guestbook Message</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Role:</strong> ${role || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <blockquote>${message}</blockquote>
            `
        });

        return NextResponse.json({ success: true, message: "Guestbook signed successfully!" });
    } catch (error) {
        console.error("Guestbook Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to sign guestbook" },
            { status: 500 }
        );
    }
}
