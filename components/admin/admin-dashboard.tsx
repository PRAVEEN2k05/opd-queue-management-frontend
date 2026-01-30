"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { AdminQueueList } from "./admin-queue-list"
import { Button } from "@/components/ui/button"
import { LogOut, ShieldCheck } from "lucide-react"

export function AdminDashboard() {
  const { isAuthenticated, userRole, logout } = useAuth()

  // Show login if not authenticated or not an admin
  if (!isAuthenticated || userRole !== "admin") {
    return <LoginForm role="admin" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">OPD Queue Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <AdminQueueList />
      </main>
    </div>
  )
}
