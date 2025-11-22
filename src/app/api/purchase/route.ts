import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            product,
            productId,
            price,
            name,
            email,
            phone,
            paymentMethod,
            quantity,
            totalAmount
        } = body;

        // Email content
        const emailContent = `
🛒 NEW ORDER REQUEST - Software License Shop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PRODUCT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product: ${product}
Product ID: ${productId}
Unit Price: ₹${price}
Quantity: ${quantity}
Total Amount: ₹${totalAmount}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Email: ${email}
Phone: ${phone}
Payment Method: ${paymentMethod}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contact customer via email/phone
2. Send payment details for ${paymentMethod}
3. Deliver license key after payment confirmation
4. Expected delivery: 1-5 minutes after payment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕒 Order Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

        // In production, use a proper email service like Resend, SendGrid, or Nodemailer
        // For now, this will log the order (you can set up actual email later)
        console.log("Order received:", emailContent);

        // TODO: Implement actual email sending
        // Example with Resend (you'll need to set up):
        /*
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'shop@ruchinaudichya.in',
          to: 'ruchinaudichya09@gmail.com',
          subject: `🛒 New Order: ${product}`,
          text: emailContent
        });
    
        // Send confirmation to customer
        await resend.emails.send({
          from: 'shop@ruchinaudichya.in',
          to: email,
          subject: `Order Confirmation: ${product}`,
          text: `Thank you for your order!\n\nWe'll contact you shortly at ${phone} or ${email} to complete the purchase.\n\nOrder Details:\n${product}\nQuantity: ${quantity}\nTotal: ₹${totalAmount}\n\nPayment Method: ${paymentMethod}\n\nExpected Delivery: 1-5 minutes after payment\nWarranty: 30 days\n\nBest regards,\nRuchin Audichya`
        });
        */

        return NextResponse.json({
            success: true,
            message: "Order request received! We'll contact you shortly."
        });
    } catch (error) {
        console.error("Purchase error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process order" },
            { status: 500 }
        );
    }
}
