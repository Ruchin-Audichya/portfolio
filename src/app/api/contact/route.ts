import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Send Email via Resend
        console.log("Attempting to send email to:", 'ruchinaudichya09@gmail.com');

        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'ruchinaudichya09@gmail.com',
            subject: `New Message from ${name}`,
            replyTo: email,
            html: `
                <h1>New Message from Portfolio</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        });

        console.log("Resend API response:", data);

        if (data.error) {
            console.error("Resend Error:", data.error);
            return NextResponse.json({ error: data.error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
