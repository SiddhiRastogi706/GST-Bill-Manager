"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Save, CheckCircle2, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [settings, setSettings] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    gstin: "",
    panNumber: "",
    address: "",
    city: "",
    state: "Maharashtra",
    invoicePrefix: "INV",
    invoiceStartNumber: "001",
    defaultTaxRate: "18",
    currency: "INR",
  })

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setSettings((prev) => ({
        ...prev,
        businessName: parsedUser.businessName || "",
        businessEmail: parsedUser.email || "",
      }))
    }

    const savedSettings = localStorage.getItem("settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    setLoading(false)
  }, [router])

  const handleSave = () => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings))
      setMessage({ type: "success", text: "Settings saved successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" })
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
          <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your business and system settings</p>
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

            {/* Business Information */}
            <Card className="glass-effect-dark p-6 border border-border/50 mb-6">
              <h2 className="text-lg font-semibold mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <Input
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="business@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={settings.businessPhone}
                    onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">GSTIN</label>
                  <Input
                    value={settings.gstin}
                    onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="27AABCT1234H1Z0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PAN Number</label>
                  <Input
                    value={settings.panNumber}
                    onChange={(e) => setSettings({ ...settings, panNumber: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="AAAPA1234A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <select
                    value={settings.state}
                    onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                  >
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>Gujarat</option>
                    <option>Rajasthan</option>
                    <option>Punjab</option>
                    <option>Haryana</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="123 Business Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="Mumbai"
                  />
                </div>
              </div>
            </Card>

            {/* Invoice Settings */}
            <Card className="glass-effect-dark p-6 border border-border/50 mb-6">
              <h2 className="text-lg font-semibold mb-4">Invoice Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Prefix</label>
                  <Input
                    value={settings.invoicePrefix}
                    onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="INV"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Example: INV-001, INV-002</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Starting Invoice Number</label>
                  <Input
                    value={settings.invoiceStartNumber}
                    onChange={(e) => setSettings({ ...settings, invoiceStartNumber: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="001"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Next invoice will be INV-{settings.invoiceStartNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Default Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={settings.defaultTaxRate}
                    onChange={(e) => setSettings({ ...settings, defaultTaxRate: e.target.value })}
                    className="bg-input border-border/50"
                    placeholder="18"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Applied to new line items</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
              <Button variant="outline" className="bg-transparent" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
