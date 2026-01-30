"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldCheck, Stethoscope, AlertCircle } from "lucide-react"

interface LoginFormProps {
  role: "admin" | "doctor"
}

export function LoginForm({ role }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isAdmin = role === "admin"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = login(userId, password)

    if (result.success) {
      // Redirect based on role
      if (result.role === "admin") {
        router.push("/admin")
      } else if (result.role === "doctor") {
        router.push("/doctor")
      }
    } else {
      setError("Invalid credentials. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto h-16 w-16 rounded-full ${
              isAdmin ? "bg-primary/10" : "bg-accent/10"
            } flex items-center justify-center mb-4`}
          >
            {isAdmin ? (
              <ShieldCheck className="h-8 w-8 text-primary" />
            ) : (
              <Stethoscope className="h-8 w-8 text-accent" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isAdmin ? "Admin Login" : "Doctor Login"}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "Access the admin dashboard to manage patients"
              : "Access the doctor dashboard to view and update patient queue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {isAdmin ? (
                <>
                  Are you a doctor?{" "}
                  <a href="/doctor/login" className="text-primary hover:underline">
                    Doctor Login
                  </a>
                </>
              ) : (
                <>
                  Are you an admin?{" "}
                  <a href="/admin/login" className="text-primary hover:underline">
                    Admin Login
                  </a>
                </>
              )}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
