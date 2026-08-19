"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Search, Download, Trash2, Edit2, Eye } from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  amount: number
  gst: number
  total: number
  date: string
  status: "draft" | "sent" | "paid"
}

export default function InvoicesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
    fetchInvoices()
  }, [router])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      console.log("[v0] Invoices API response status:", response.status)
      const data = await response.json()
      console.log("[v0] Invoices data received:", data)
      setInvoices(data || [])
    } catch (error) {
      console.error("[v0] Error fetching invoices:", error)
      setMessage({ type: "error", text: "Failed to fetch invoices" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    try {
      const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete invoice")

      setInvoices(invoices.filter((i) => i.id !== id))
      setMessage({ type: "success", text: "Invoice deleted successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete invoice" })
    }
  }

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-primary/20 text-primary"
      case "sent":
        return "bg-accent/20 text-accent"
      case "draft":
        return "bg-muted/20 text-muted-foreground"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
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
                <h1 className="text-3xl font-bold mb-2">Invoices</h1>
                <p className="text-muted-foreground">Manage and track all your invoices</p>
              </div>
              <Button className="gap-2" onClick={() => router.push("/invoices/create")}>
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </div>

            {/* Search */}
            <Card className="glass-effect-dark p-4 border border-border/50 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                />
              </div>
            </Card>

            {/* Invoices Table */}
            <Card className="glass-effect-dark border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-card/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Invoice #</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">GST</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 text-sm">{invoice.clientName}</td>
                        <td className="px-6 py-4 text-sm">₹{invoice.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">₹{invoice.gst.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold">₹{invoice.total.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">{new Date(invoice.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInvoices.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
