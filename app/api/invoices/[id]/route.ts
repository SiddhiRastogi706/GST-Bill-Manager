import { type NextRequest, NextResponse } from "next/server"
import { deleteInvoice, getInvoiceById, updateInvoice } from "@/lib/mock-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = getInvoiceById(params.id)
    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const updatedInvoice = updateInvoice(params.id, updates)

    if (!updatedInvoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error("PUT /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteInvoice(params.id)

    if (!deleted) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/invoices/[id] error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
