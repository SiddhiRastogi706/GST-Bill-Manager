"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Trash2, ArrowLeft, Mail } from "lucide-react"
import { sendInvoiceEmail } from "@/lib/email-utils"

interface LineItem {
  id: string
  description: string
  hsn: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-003",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientGSTIN: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    state: "Maharashtra",
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Product/Service 1",
      hsn: "1001",
      quantity: 1,
      unitPrice: 1000,
      taxRate: 18,
      amount: 1000,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [emailSent, setEmailSent] = useState(false)

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
    setLoading(false)
  }, [router])

  const calculateAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateGST = (amount: number, taxRate: number) => {
    return (amount * taxRate) / 100
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const totalGST = lineItems.reduce((sum, item) => sum + calculateGST(item.amount, item.taxRate), 0)
  const grandTotal = subtotal + totalGST

  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      hsn: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 18,
      amount: 0,
    }
    setLineItems([...lineItems, newItem])
  }

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const handleLineItemChange = (id: string, field: string, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          let numValue = value
          if (field === "quantity" || field === "unitPrice" || field === "taxRate") {
            numValue = value === "" ? 0 : Number(value) || 0
          }
          const updated = { ...item, [field]: numValue }
          if (field === "quantity" || field === "unitPrice") {
            updated.amount = calculateAmount(updated.quantity, updated.unitPrice)
          }
          return updated
        }
        return item
      }),
    )
  }

  const handleSaveInvoice = async (isDraft = false) => {
    console.log("[v0] Save invoice button clicked, isDraft:", isDraft)
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      if (!invoiceData.clientName) {
        console.log("[v0] Client name missing")
        setErrorMessage("Client name is required")
        setIsSubmitting(false)
        return
      }

      if (lineItems.length === 0 || !lineItems.some((item) => item.description)) {
        console.log("[v0] No line items or descriptions")
        setErrorMessage("At least one line item with description is required")
        setIsSubmitting(false)
        return
      }

      const invoicePayload = {
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientPhone: invoiceData.clientPhone,
        clientGSTIN: invoiceData.clientGSTIN,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        state: invoiceData.state,
        lineItems,
        subtotal,
        totalGST,
        grandTotal,
        status: isDraft ? "draft" : "sent",
      }

      console.log("[v0] Invoice payload:", invoicePayload)

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(invoicePayload),
      })

      console.log("[v0] API response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] API response data:", responseData)

      if (!response.ok) {
        throw new Error(`Failed to save invoice: ${responseData.message || response.statusText}`)
      }

      // Send email if invoice is being sent (not draft)
      if (!isDraft && invoiceData.clientEmail) {
        const emailSent = await sendInvoiceEmail(invoiceData.clientEmail, invoicePayload)
        if (emailSent) {
          setEmailSent(true)
          setSuccessMessage("Invoice created and email sent to client!")
        } else {
          setSuccessMessage("Invoice created but email sending failed. You can send it manually.")
        }
      } else {
        setSuccessMessage(isDraft ? "Invoice saved as draft!" : "Invoice created successfully!")
      }

      setTimeout(() => {
        router.push("/invoices")
      }, 2000)
    } catch (error) {
      console.error("[v0] Invoice save error:", error)
      setErrorMessage("Error saving invoice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    console.log("[v0] Download PDF button clicked")
    try {
      const pdfData = {
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        clientGSTIN: invoiceData.clientGSTIN,
        invoiceDate: invoiceData.invoiceDate,
        lineItems,
        subtotal,
        totalGST,
        grandTotal,
      }

      console.log("[v0] PDF data:", pdfData)

      const response = await fetch("/api/invoices/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      })

      console.log("[v0] PDF API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to generate PDF: ${errorData}`)
      }

      const blob = await response.blob()
      console.log("[v0] PDF blob created, size:", blob.size)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${pdfData.invoiceNumber}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      console.log("[v0] PDF download triggered")
    } catch (error) {
      console.error("[v0] PDF download error:", error)
      setErrorMessage(`Error downloading PDF: ${String(error)}`)
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
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Create Invoice</h1>
                <p className="text-muted-foreground">Create a new invoice with GST calculations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Invoice Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client Information */}
                <Card className="glass-effect-dark p-6 border border-border/50">
                  <h2 className="text-lg font-semibold mb-4">Client Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Client Name</label>
                      <Input
                        placeholder="Client name"
                        value={invoiceData.clientName}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        placeholder="client@example.com"
                        value={invoiceData.clientEmail}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={invoiceData.clientPhone}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">GSTIN</label>
                      <Input
                        placeholder="27AABCT1234H1Z0"
                        value={invoiceData.clientGSTIN}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientGSTIN: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                  </div>
                </Card>

                {/* Invoice Details */}
                <Card className="glass-effect-dark p-6 border border-border/50">
                  <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Invoice Number</label>
                      <Input
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <select
                        value={invoiceData.state}
                        onChange={(e) => setInvoiceData({ ...invoiceData, state: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                      >
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Tamil Nadu</option>
                        <option>Gujarat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Invoice Date</label>
                      <Input
                        type="date"
                        value={invoiceData.invoiceDate}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <Input
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                        className="bg-input border-border/50"
                      />
                    </div>
                  </div>
                </Card>

                {/* Line Items */}
                <Card className="glass-effect-dark p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Line Items</h2>
                    <Button size="sm" className="gap-2" onClick={handleAddLineItem}>
                      <Plus className="w-4 h-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {lineItems.map((item) => (
                      <div key={item.id} className="p-4 bg-card/50 rounded-lg border border-border/50 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Input
                              placeholder="Product/Service description"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                              className="bg-input border-border/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">HSN Code</label>
                            <Input
                              placeholder="HSN code"
                              value={item.hsn}
                              onChange={(e) => handleLineItemChange(item.id, "hsn", e.target.value)}
                              className="bg-input border-border/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Qty</label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "quantity", Number.parseFloat(e.target.value))
                              }
                              className="bg-input border-border/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Unit Price</label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "unitPrice", Number.parseFloat(e.target.value))
                              }
                              className="bg-input border-border/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <Input
                              type="number"
                              value={item.amount}
                              disabled
                              className="bg-input border-border/50 opacity-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Tax %</label>
                            <Input
                              type="number"
                              value={item.taxRate}
                              onChange={(e) =>
                                handleLineItemChange(item.id, "taxRate", Number.parseFloat(e.target.value))
                              }
                              className="bg-input border-border/50"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleRemoveLineItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="glass-effect-dark p-6 border border-border/50 sticky top-8">
                  <h2 className="text-lg font-semibold mb-6">Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{totalGST.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border/50 pt-4 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm">
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => handleSaveInvoice(false)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Save & Send"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleSaveInvoice(true)}
                      disabled={isSubmitting}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleDownloadPDF}
                      disabled={isSubmitting}
                    >
                      Download PDF
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
