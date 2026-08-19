"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, FileText, Users, Settings } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsLoggedIn(true)
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GST Billing</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Professional GST Billing Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, manage, and track invoices with automatic GST calculations. Perfect for small businesses and
            accountants.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="glass-effect-dark p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-up">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Invoice Management</h3>
            <p className="text-sm text-muted-foreground">Create, edit, and manage invoices with ease</p>
          </Card>

          <Card
            className="glass-effect-dark p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <BarChart3 className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-sm text-muted-foreground">Track sales, GST, and business metrics</p>
          </Card>

          <Card
            className="glass-effect-dark p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Client Management</h3>
            <p className="text-sm text-muted-foreground">Organize and manage your clients</p>
          </Card>

          <Card
            className="glass-effect-dark p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Settings className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-semibold mb-2">Admin Panel</h3>
            <p className="text-sm text-muted-foreground">Full control and system settings</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-muted-foreground">
        <p>© 2025 GST Billing System. All rights reserved.</p>
      </footer>
    </div>
  )
}
