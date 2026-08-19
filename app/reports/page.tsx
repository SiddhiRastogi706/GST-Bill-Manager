"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Download, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [dateRange, setDateRange] = useState("month")

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

    fetchReportData()
  }, [router])

  const fetchReportData = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([fetch("/api/invoices"), fetch("/api/clients")])

      const invoicesData = await invoicesRes.json()
      const clientsData = await clientsRes.json()

      setInvoices(invoicesData)
      setClients(clientsData)
    } catch (error) {
      console.log("[v0] Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)
    const totalGST = invoices.reduce((sum: number, inv: any) => sum + inv.gst, 0)
    const avgInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0

    return {
      totalRevenue,
      totalGST,
      totalInvoices: invoices.length,
      avgInvoiceValue,
    }
  }

  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 5000),
      gst: Math.floor(Math.random() * 1000),
    }))
  }

  const stats = calculateStats()
  const monthlyData = generateMonthlyData()
  const gstBreakdown = [
    { name: "CGST", value: stats.totalGST / 2 },
    { name: "SGST", value: stats.totalGST / 2 },
    { name: "IGST", value: 0 },
  ]

  const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-chart-3)"]

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
                <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                <p className="text-muted-foreground">View detailed business analytics and reports</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  {dateRange === "month" ? "This Month" : "This Year"}
                </Button>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect-dark p-6 border border-border/50">
                <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-primary mt-2">+12% from last month</p>
              </Card>
              <Card className="glass-effect-dark p-6 border border-border/50">
                <p className="text-muted-foreground text-sm mb-1">Total GST</p>
                <p className="text-2xl font-bold">₹{stats.totalGST.toLocaleString()}</p>
                <p className="text-xs text-accent mt-2">18% average rate</p>
              </Card>
              <Card className="glass-effect-dark p-6 border border-border/50">
                <p className="text-muted-foreground text-sm mb-1">Invoices</p>
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                <p className="text-xs text-primary mt-2">Total invoices</p>
              </Card>
              <Card className="glass-effect-dark p-6 border border-border/50">
                <p className="text-muted-foreground text-sm mb-1">Avg Invoice Value</p>
                <p className="text-2xl font-bold">₹{Math.round(stats.avgInvoiceValue).toLocaleString()}</p>
                <p className="text-xs text-accent mt-2">Per invoice</p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-effect-dark p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Revenue & GST Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-primary)" />
                    <Bar dataKey="gst" fill="var(--color-accent)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="glass-effect-dark p-6 border border-border/50">
                <h3 className="font-semibold mb-4">GST Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gstBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gstBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Monthly Breakdown */}
            <Card className="glass-effect-dark p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-2 text-left">Month</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                      <th className="px-4 py-2 text-right">CGST (9%)</th>
                      <th className="px-4 py-2 text-right">SGST (9%)</th>
                      <th className="px-4 py-2 text-right">Total GST</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row) => (
                      <tr key={row.month} className="border-b border-border/50 hover:bg-card/50">
                        <td className="px-4 py-2">{row.month}</td>
                        <td className="px-4 py-2 text-right">₹{row.revenue.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">₹{(row.gst / 2).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">₹{(row.gst / 2).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">₹{row.gst.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold">
                          ₹{(row.revenue + row.gst).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
