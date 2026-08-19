import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, type } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { message: "Missing required fields: to, subject, html" },
        { status: 400 }
      )
    }

    console.log(`[Email] Sending ${type || "email"} to ${to}`)
    console.log(`[Email] Subject: ${subject}`)

    // In production, integrate with Nodemailer, SendGrid, or AWS SES
    // For now, we'll just log and simulate success
    const emailLog = {
      id: Date.now().toString(),
      to,
      subject,
      type: type || "invoice",
      status: "sent",
      timestamp: new Date(),
    }

    console.log("[Email] Simulated email sent:", emailLog)

    return NextResponse.json({
      message: "Email sent successfully",
      emailId: emailLog.id,
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 })
  }
}
