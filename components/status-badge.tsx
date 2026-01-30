"use client"

import { Badge } from "@/components/ui/badge"
import { STATUS_CONFIG, CRITICALITY_CONFIG } from "@/lib/types"
import type { PatientStatus, CriticalityLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: PatientStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

interface CriticalityBadgeProps {
  level: CriticalityLevel
  className?: string
}

export function CriticalityBadge({ level, className }: CriticalityBadgeProps) {
  const config = CRITICALITY_CONFIG[level]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
