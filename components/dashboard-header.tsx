"use client"

import { Bell, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{user?.businessName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
