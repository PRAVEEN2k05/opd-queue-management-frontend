"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"

export default function DoctorPage() {
  const { isAuthenticated, userRole } = useAuth()

  // Show login if not authenticated or not a doctor
  if (!isAuthenticated || userRole !== "doctor") {
    return <LoginForm role="doctor" />
  }

  return <DoctorDashboard />
}
