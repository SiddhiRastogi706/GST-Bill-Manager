import { type NextRequest, NextResponse } from "next/server"
import { updateClient, deleteClient, getClientById } from "@/lib/mock-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = getClientById(params.id)
    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 })
    }
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedClient = updateClient(params.id, updates)

    if (!updatedClient) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(updatedClient)
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteClient(params.id)

    if (!deleted) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Client deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
