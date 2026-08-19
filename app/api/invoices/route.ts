import { type NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const invoices = mockDb.getInvoices()
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json()
    console.log("[v0] POST /api/invoices - Received data:", invoiceData)

    if (!invoiceData.clientName) {
      console.log("[v0] Client name missing")
      return NextResponse.json({ message: "Client name is required" }, { status: 400 })
    }

    console.log("[v0] Creating invoice with mockDb...")
    const newInvoice = mockDb.createInvoice(invoiceData)
    console.log("[v0] Invoice created:", newInvoice)
    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error("[v0] Invoice creation error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
