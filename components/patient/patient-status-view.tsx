"use client"

import { useEffect, useState, useRef } from "react"
import { subscribeToPatient, subscribeToQueue } from "@/lib/patient-service"
import type { Patient } from "@/lib/types"
import { StatusBadge, CriticalityBadge } from "@/components/status-badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SYMPTOM_OPTIONS } from "@/lib/criticality"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  User,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Timer,
  QrCode,
  Printer,
  Home,
} from "lucide-react"
import Link from "next/link"
import QRCodeLib from "qrcode"

interface PatientStatusViewProps {
  patientId: string
}

export function PatientStatusView({ patientId }: PatientStatusViewProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      if (typeof window !== "undefined") {
        const url = `${window.location.origin}/patient/${patientId}`
        try {
          const dataUrl = await QRCodeLib.toDataURL(url, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          })
          setQrCodeDataUrl(dataUrl)
        } catch (err) {
          console.error("Error generating QR code:", err)
        }
      }
    }
    generateQR()
  }, [patientId])

  useEffect(() => {
    setError(null)

    try {
      const unsubscribePatient = subscribeToPatient(patientId, (updatedPatient) => {
        setPatient(updatedPatient)
        setIsLoading(false)
      })

      // Subscribe to queue to get position
      const unsubscribeQueue = subscribeToQueue((patients) => {
        const waitingPatients = patients.filter(
          (p) => p.status === "waiting" || p.status === "in_consultation"
        )
        const position = waitingPatients.findIndex((p) => p.id === patientId)
        setQueuePosition(position >= 0 ? position + 1 : null)
      })

      return () => {
        unsubscribePatient()
        unsubscribeQueue()
      }
    } catch (err) {
      console.error("Error subscribing to patient:", err)
      setError("Failed to load patient data. Please try again.")
      setIsLoading(false)
    }
  }, [patientId])

  const handlePrint = () => {
    window.print()
  }

  const getSymptomLabel = (symptom: string) => {
    const option = SYMPTOM_OPTIONS.find((opt) => opt.value === symptom)
    return option?.label || symptom
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner text="Loading your status..." size="lg" />
      </div>
    )
  }

  if (error || !patient) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">Patient Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error || "This QR code may be invalid or expired."}
          </p>
          <Button className="mt-4" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isEmergency = patient.criticalLevel === "emergency"

  // Get status specific content
  const getStatusContent = () => {
    switch (patient.status) {
      case "waiting":
        return {
          icon: Timer,
          title: "Please Wait",
          description: queuePosition
            ? `You are #${queuePosition} in the queue.`
            : "You are in the queue. We will call you soon.",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
        }
      case "in_consultation":
        return {
          icon: Stethoscope,
          title: "In Consultation",
          description: "The doctor is seeing you now.",
          color: "text-primary",
          bgColor: "bg-primary/10",
        }
      case "completed":
        return {
          icon: CheckCircle2,
          title: "Consultation Complete",
          description: "Thank you for visiting. Get well soon!",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        }
      default:
        return {
          icon: Timer,
          title: "Please Wait",
          description: "You are in the queue.",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        }
    }
  }

  const statusContent = getStatusContent()
  const StatusIcon = statusContent.icon

  return (
    <div className="mx-auto max-w-md space-y-4">
      {/* Main Status Card */}
      <Card
        className={cn(
          "overflow-hidden print:shadow-none",
          isEmergency && "border-destructive"
        )}
      >
        {/* Queue Number Header */}
        <div
          className={cn(
            "py-8 text-center",
            isEmergency
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          <p className="text-sm font-medium uppercase tracking-wider opacity-90">
            Your Queue Number
          </p>
          <p className="mt-2 text-6xl font-bold">{patient.queueNumber}</p>
          <div className="mt-3">
            <CriticalityBadge
              level={patient.criticalLevel}
              className={cn(
                isEmergency
                  ? "bg-destructive-foreground/20 text-destructive-foreground"
                  : "bg-primary-foreground/20 text-primary-foreground"
              )}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className={cn("p-6", statusContent.bgColor)}>
          <div className="flex flex-col items-center text-center">
            <StatusIcon className={cn("h-12 w-12", statusContent.color)} />
            <h2 className={cn("mt-3 text-xl font-bold", statusContent.color)}>
              {statusContent.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusContent.description}
            </p>
          </div>
        </div>

        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Current Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Current Status
              </span>
              <StatusBadge status={patient.status} />
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Patient Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.age} years old
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Symptom</p>
                  <p className="text-xs text-muted-foreground">
                    {getSymptomLabel(patient.symptoms)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Registered At</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                <QrCode className="mr-1 inline h-4 w-4" />
                Your QR Code
              </p>
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl || "/placeholder.svg"}
                  alt="Patient QR Code"
                  className="h-32 w-32 rounded-lg border"
                />
              )}
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Scan this QR code to check your queue status
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      {/* Auto-refresh notice */}
      <Card className="print:hidden">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center justify-center gap-2 text-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            This page updates automatically in real-time
          </CardDescription>
        </CardHeader>
      </Card>
      
      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
