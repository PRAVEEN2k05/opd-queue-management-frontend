"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Activity, ShieldCheck, Home, Stethoscope } from "lucide-react"

const navItems = [
  { href: "/", label: "Register", icon: Home },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/doctor", label: "Doctor", icon: Stethoscope },
]

export function NavigationHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1.5">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-foreground">
              OPD Queue
            </span>
            <span className="text-xs text-muted-foreground">
              Management System
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "gap-2",
                  isActive && "bg-secondary"
                )}
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
