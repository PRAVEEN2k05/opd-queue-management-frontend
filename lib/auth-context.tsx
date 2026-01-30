"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// User roles
export type UserRole = "admin" | "doctor" | null

// Hardcoded credentials as per requirements
const CREDENTIALS = {
  admin: {
    userId: "admin",
    password: "admin123",
  },
  doctor: {
    userId: "doctor",
    password: "doctor123",
  },
}

interface AuthContextType {
  isAuthenticated: boolean
  userRole: UserRole
  login: (userId: string, password: string) => { success: boolean; role: UserRole }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("opd_session")
    const role = sessionStorage.getItem("opd_role") as UserRole
    if (session === "authenticated" && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  const login = (userId: string, password: string): { success: boolean; role: UserRole } => {
    // Check admin credentials
    if (
      userId === CREDENTIALS.admin.userId &&
      password === CREDENTIALS.admin.password
    ) {
      setIsAuthenticated(true)
      setUserRole("admin")
      sessionStorage.setItem("opd_session", "authenticated")
      sessionStorage.setItem("opd_role", "admin")
      return { success: true, role: "admin" }
    }

    // Check doctor credentials
    if (
      userId === CREDENTIALS.doctor.userId &&
      password === CREDENTIALS.doctor.password
    ) {
      setIsAuthenticated(true)
      setUserRole("doctor")
      sessionStorage.setItem("opd_session", "authenticated")
      sessionStorage.setItem("opd_role", "doctor")
      return { success: true, role: "doctor" }
    }

    return { success: false, role: null }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    sessionStorage.removeItem("opd_session")
    sessionStorage.removeItem("opd_role")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
