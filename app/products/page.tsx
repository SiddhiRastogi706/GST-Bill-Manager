"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Search, Trash2, Edit2, AlertCircle, CheckCircle2 } from "lucide-react"

interface Product {
  id: string
  name: string
  hsn: string
  description: string
  price: number
  taxRate: number
  stock: number
}

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    hsn: "",
    description: "",
    price: 0,
    taxRate: 18,
    stock: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      console.log("[v0] Products API response status:", response.status)
      const data = await response.json()
      console.log("[v0] Products data received:", data)
      setProducts(data || [])
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      setMessage({ type: "error", text: "Failed to fetch products" })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsn.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = async () => {
    if (!formData.name || !formData.hsn) {
      setMessage({ type: "error", text: "Name and HSN are required" })
      return
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add product")

      const newProduct = await response.json()
      setProducts([...products, newProduct])
      setFormData({
        name: "",
        hsn: "",
        description: "",
        price: 0,
        taxRate: 18,
        stock: 0,
      })
      setShowForm(false)
      setMessage({ type: "success", text: "Product added successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add product" })
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update product")

      const updatedProduct = await response.json()
      setProducts(products.map((p) => (p.id === editingId ? updatedProduct : p)))
      setFormData({
        name: "",
        hsn: "",
        description: "",
        price: 0,
        taxRate: 18,
        stock: 0,
      })
      setEditingId(null)
      setShowForm(false)
      setMessage({ type: "success", text: "Product updated successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update product" })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete product")

      setProducts(products.filter((p) => p.id !== id))
      setMessage({ type: "success", text: "Product deleted successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete product" })
    }
  }

  const handleEditProduct = (product: Product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Products</h1>
                <p className="text-muted-foreground">Manage your products and services</p>
              </div>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    name: "",
                    hsn: "",
                    description: "",
                    price: 0,
                    taxRate: 18,
                    stock: 0,
                  })
                  setShowForm(!showForm)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex gap-3 border ${
                  message.type === "success"
                    ? "bg-primary/10 border-primary/50"
                    : "bg-destructive/10 border-destructive/50"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            {/* Add/Edit Product Form */}
            {showForm && (
              <Card className="glass-effect-dark p-6 border border-border/50 mb-6 animate-slide-up">
                <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="HSN Code"
                    value={formData.hsn}
                    onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    type="number"
                    placeholder="Tax Rate %"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseFloat(e.target.value) })}
                    className="bg-input border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdateProduct : handleAddProduct}>
                    {editingId ? "Update Product" : "Save Product"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Search */}
            <Card className="glass-effect-dark p-4 border border-border/50 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                />
              </div>
            </Card>

            {/* Products Table */}
            <Card className="glass-effect-dark border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-card/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Product Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">HSN Code</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Tax Rate</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm">{product.hsn}</td>
                        <td className="px-6 py-4 text-sm">₹{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">{product.taxRate}%</td>
                        <td className="px-6 py-4 text-sm">{product.stock}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
