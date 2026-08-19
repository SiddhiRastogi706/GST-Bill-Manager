import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, addUser } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, businessName, password } = await request.json()

    // Validation
    if (!name || !email || !phone || !businessName || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      businessName,
      password, // In production, hash this with bcrypt!
      role: "user" as const,
      createdAt: new Date(),
    }

    addUser(newUser)

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
