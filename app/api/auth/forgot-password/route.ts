import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // In production, send OTP via email using Nodemailer
    const otp = Math.random().toString().slice(2, 8)

    // Store OTP temporarily (in production, use Redis or database)
    // For demo, we'll just return success

    return NextResponse.json({
      message: "OTP sent to your email",
      // In production, don't return OTP
      demo_otp: "123456",
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
