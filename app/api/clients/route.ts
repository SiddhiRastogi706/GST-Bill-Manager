import { type NextRequest, NextResponse } from "next/server"
import { getAllClients, addClient } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const clients = getAllClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error("GET /api/clients error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, gstin, address, city, state } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 })
    }

    const newClient = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      gstin,
      address,
      city,
      state,
      createdAt: new Date(),
    }

    addClient(newClient)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error("POST /api/clients error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
