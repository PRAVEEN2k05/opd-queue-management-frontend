// Patient status types
export type PatientStatus = "waiting" | "in_consultation" | "completed"

// Criticality level types
export type CriticalityLevel = "emergency" | "normal"

// Patient interface for Firestore documents
export interface Patient {
  id: string
  name: string
  age: number
  symptoms: string
  criticalLevel: CriticalityLevel
  queueNumber: number
  status: PatientStatus
  createdAt: Date
  updatedAt: Date
}

// Form data for creating a new patient
export interface PatientFormData {
  name: string
  age: number
  symptoms: string
}

// Status display configuration
export const STATUS_CONFIG: Record<
  PatientStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  waiting: {
    label: "Waiting",
    variant: "secondary",
    className: "bg-amber-500 text-white",
  },
  in_consultation: {
    label: "In Consultation",
    variant: "default",
    className: "bg-primary text-primary-foreground",
  },
  completed: {
    label: "Completed",
    variant: "outline",
    className: "bg-emerald-500 text-white",
  },
}

// Criticality display configuration
export const CRITICALITY_CONFIG: Record<
  CriticalityLevel,
  { label: string; className: string }
> = {
  emergency: {
    label: "Emergency",
    className: "bg-destructive text-destructive-foreground",
  },
  normal: {
    label: "Normal",
    className: "bg-secondary text-secondary-foreground",
  },
}
