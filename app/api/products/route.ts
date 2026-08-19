import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, addProduct } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const products = getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, hsn, description, price, taxRate, stock } = await request.json()

    if (!name || !hsn) {
      return NextResponse.json({ message: "Name and HSN are required" }, { status: 400 })
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      hsn,
      description,
      price,
      taxRate,
      stock,
      createdAt: new Date(),
    }

    addProduct(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 })
  }
}
