"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Users, TrendingUp, FileText, AlertCircle, Trash2, Edit2, CheckCircle2, XCircle, Search } from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  businessName: string
  role: string
  createdAt: Date
  status: "active" | "inactive"
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    activeUsers: 0,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
    }
    fetchAdminData()
  }, [router])

  const fetchAdminData = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([fetch("/api/invoices"), fetch("/api/clients")])

      const invoices = await invoicesRes.json()
      const clients = await clientsRes.json()

      const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)
      const totalInvoices = invoices.length
      const activeUsers = 2 // Mock data

      setStats({
        totalUsers: 2,
        totalRevenue,
        totalInvoices,
        activeUsers,
      })

      const mockUsers: AdminUser[] = [
        {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          businessName: "Demo Business",
          role: "user",
          createdAt: new Date("2025-01-01"),
          status: "active",
        },
        {
          id: "2",
          name: "John Doe",
          email: "john@example.com",
          businessName: "John's Business",
          role: "user",
          createdAt: new Date("2025-01-05"),
          status: "active",
        },
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.log("[v0] Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)))
    setMessage({ type: "success", text: "User status updated" })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDeleteUser = (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    setUsers(users.filter((u) => u.id !== id))
    setMessage({ type: "success", text: "User deleted successfully" })
    setTimeout(() => setMessage(null), 3000)
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users and system settings</p>
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
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-primary mt-2">{stats.activeUsers} active</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-accent mt-2">All time</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </Card>

              <Card className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Invoices</p>
                    <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                    <p className="text-xs text-primary mt-2">Generated</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </Card>

              <Card className="glass-effect-dark p-6 border border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">System Health</p>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-xs text-primary mt-2">All systems operational</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
              </Card>
            </div>

            {/* Users Management */}
            <Card className="glass-effect-dark p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Management</h2>
                <Button>Add User</Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border/50"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-card/50">
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Email</th>
                      <th className="px-4 py-3 text-left font-semibold">Business</th>
                      <th className="px-4 py-3 text-left font-semibold">Role</th>
                      <th className="px-4 py-3 text-left font-semibold">Joined</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.businessName}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">{u.createdAt.toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                              u.status === "active"
                                ? "bg-primary/20 text-primary hover:bg-primary/30"
                                : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                            }`}
                          >
                            {u.status}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUser(u.id)}
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

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
