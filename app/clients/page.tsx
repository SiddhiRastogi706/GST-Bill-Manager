"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Plus, Search, Trash2, Edit2, Mail, Phone, AlertCircle, CheckCircle2 } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  gstin: string
  address: string
  city: string
  state: string
}

export default function ClientsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
    city: "",
    state: "Maharashtra",
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
    fetchClients()
  }, [router])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      console.log("[v0] Clients API response status:", response.status)
      const data = await response.json()
      console.log("[v0] Clients data received:", data)
      setClients(data || [])
    } catch (error) {
      console.error("[v0] Error fetching clients:", error)
      setMessage({ type: "error", text: "Failed to fetch clients" })
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddClient = async () => {
    if (!formData.name || !formData.email) {
      setMessage({ type: "error", text: "Name and email are required" })
      return
    }

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add client")

      const newClient = await response.json()
      setClients([...clients, newClient])
      setFormData({
        name: "",
        email: "",
        phone: "",
        gstin: "",
        address: "",
        city: "",
        state: "Maharashtra",
      })
      setShowForm(false)
      setMessage({ type: "success", text: "Client added successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add client" })
    }
  }

  const handleUpdateClient = async () => {
    if (!editingId) return

    try {
      const response = await fetch(`/api/clients/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update client")

      const updatedClient = await response.json()
      setClients(clients.map((c) => (c.id === editingId ? updatedClient : c)))
      setFormData({
        name: "",
        email: "",
        phone: "",
        gstin: "",
        address: "",
        city: "",
        state: "Maharashtra",
      })
      setEditingId(null)
      setShowForm(false)
      setMessage({ type: "success", text: "Client updated successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update client" })
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete client")

      setClients(clients.filter((c) => c.id !== id))
      setMessage({ type: "success", text: "Client deleted successfully" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete client" })
    }
  }

  const handleEditClient = (client: Client) => {
    setFormData(client)
    setEditingId(client.id)
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
                <h1 className="text-3xl font-bold mb-2">Clients</h1>
                <p className="text-muted-foreground">Manage your business clients</p>
              </div>
              <Button
                className="gap-2"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    gstin: "",
                    address: "",
                    city: "",
                    state: "Maharashtra",
                  })
                  setShowForm(!showForm)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Client
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

            {/* Add/Edit Client Form */}
            {showForm && (
              <Card className="glass-effect-dark p-6 border border-border/50 mb-6 animate-slide-up">
                <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Client" : "Add New Client"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Client Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="GSTIN"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-input border-border/50"
                  />
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-input border-border/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdateClient : handleAddClient}>
                    {editingId ? "Update Client" : "Save Client"}
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
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border/50"
                />
              </div>
            </Card>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card
                  key={client.id}
                  className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.gstin}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </div>
                    <div className="text-muted-foreground">
                      {client.address}, {client.city}, {client.state}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <Card className="glass-effect-dark p-8 border border-border/50 text-center">
                <p className="text-muted-foreground">No clients found</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
