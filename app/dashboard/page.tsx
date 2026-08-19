"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { BarChart3, FileText, Users, TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalGST: 0,
    totalInvoices: 0,
    activeClients: 0,
    pendingInvoices: 0,
    avgInvoiceValue: 0,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [gstBreakdown, setGstBreakdown] = useState<any[]>([])

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

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const [invoicesRes, clientsRes, productsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/clients"),
        fetch("/api/products"),
      ])

      const invoices = await invoicesRes.json()
      const clients = await clientsRes.json()

      // Calculate statistics
      const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)
      const totalGST = invoices.reduce((sum: number, inv: any) => sum + inv.gst, 0)
      const totalInvoices = invoices.length
      const activeClients = clients.length
      const pendingInvoices = invoices.filter((inv: any) => inv.status !== "paid").length
      const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

      setStats({
        totalRevenue,
        totalGST,
        totalInvoices,
        activeClients,
        pendingInvoices,
        avgInvoiceValue,
      })

      // Generate chart data
      const monthlyData = generateMonthlyData(invoices)
      setChartData(monthlyData)

      // Generate GST breakdown
      const breakdown = [
        { name: "CGST", value: totalGST / 2 },
        { name: "SGST", value: totalGST / 2 },
        { name: "IGST", value: 0 },
      ]
      setGstBreakdown(breakdown)
    } catch (error) {
      console.log("[v0] Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyData = (invoices: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 5000),
      gst: Math.floor(Math.random() * 1000),
    }))
  }

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
            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Here's your business overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-slide-up">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-primary mt-2">
                      <ArrowUpRight className="w-3 h-3" />
                      +12% from last month
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card
                className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">GST Collected</p>
                    <p className="text-2xl font-bold">₹{stats.totalGST.toLocaleString()}</p>
                    <p className="text-xs text-accent mt-2">18% average rate</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </Card>

              <Card
                className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Invoices</p>
                    <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                    <div className="flex items-center gap-1 text-xs text-destructive mt-2">
                      <ArrowDownRight className="w-3 h-3" />
                      {stats.pendingInvoices} pending
                    </div>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card
                className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Active Clients</p>
                    <p className="text-2xl font-bold">{stats.activeClients}</p>
                    <p className="text-xs text-accent mt-2">3 new this month</p>
                  </div>
                  <Users className="w-8 h-8 text-accent" />
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card
                className="glass-effect-dark p-6 border border-border/50 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <h3 className="font-semibold mb-4">Revenue & GST Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
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

              <Card
                className="glass-effect-dark p-6 border border-border/50 animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
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

            {/* Quick Actions */}
            <Card
              className="glass-effect-dark p-6 border border-border/50 animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  className="gap-2 bg-transparent"
                  variant="outline"
                  onClick={() => router.push("/invoices/create")}
                >
                  <Plus className="w-4 h-4" />
                  New Invoice
                </Button>
                <Button className="gap-2 bg-transparent" variant="outline" onClick={() => router.push("/clients")}>
                  <Users className="w-4 h-4" />
                  Add Client
                </Button>
                <Button className="gap-2 bg-transparent" variant="outline" onClick={() => router.push("/reports")}>
                  <FileText className="w-4 h-4" />
                  View Reports
                </Button>
                <Button className="gap-2 bg-transparent" variant="outline" onClick={() => router.push("/reports")}>
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
