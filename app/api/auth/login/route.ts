import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = findUserByEmail(email)

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // In production, create a proper JWT token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
