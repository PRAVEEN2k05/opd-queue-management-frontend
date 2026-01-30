"use client"

import { useEffect, useState } from "react"
import {
  subscribeToQueue,
  updatePatientStatus,
  updatePatientCriticality,
} from "@/lib/patient-service"
import type { Patient, PatientStatus } from "@/lib/types"
import { StatusBadge } from "@/components/status-badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  AlertTriangle,
  Clock,
  Stethoscope,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { SYMPTOM_OPTIONS } from "@/lib/criticality"

export function AdminQueueList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingPatientId, setUpdatingPatientId] = useState<string | null>(null)

  useEffect(() => {
    setError(null)

    try {
      const unsubscribe = subscribeToQueue((updatedPatients) => {
        setPatients(updatedPatients)
        setIsLoading(false)
      })

      return () => unsubscribe()
    } catch (err) {
      console.error("Error subscribing to queue:", err)
      setError("Failed to load queue. Please refresh the page.")
      setIsLoading(false)
    }
  }, [])

  // Calculate stats
  const totalCount = patients.length
  const waitingCount = patients.filter((p) => p.status === "waiting").length
  const emergencyCount = patients.filter(
    (p) => p.criticalLevel === "emergency" && p.status !== "completed"
  ).length
  const inConsultationCount = patients.filter(
    (p) => p.status === "in_consultation"
  ).length
  const completedCount = patients.filter((p) => p.status === "completed").length

  const handleStatusChange = async (patientId: string, newStatus: PatientStatus) => {
    setUpdatingPatientId(patientId)
    try {
      await updatePatientStatus(patientId, newStatus)
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setUpdatingPatientId(null)
    }
  }

  const handleEmergencyMark = async (patientId: string) => {
    setUpdatingPatientId(patientId)
    try {
      await updatePatientCriticality(patientId, "emergency")
    } catch (err) {
      console.error("Error marking emergency:", err)
    } finally {
      setUpdatingPatientId(null)
    }
  }

  const getSymptomLabel = (symptom: string) => {
    const option = SYMPTOM_OPTIONS.find((opt) => opt.value === symptom)
    return option?.label || symptom
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner text="Loading queue..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-destructive">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Users className="h-8 w-8 text-muted-foreground" />
            <span className="mt-2 text-2xl font-bold text-foreground">{totalCount}</span>
            <span className="text-sm text-muted-foreground">Total Patients</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Clock className="h-8 w-8 text-amber-500" />
            <span className="mt-2 text-2xl font-bold text-foreground">{waitingCount}</span>
            <span className="text-sm text-muted-foreground">Waiting</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="mt-2 text-2xl font-bold text-foreground">{inConsultationCount}</span>
            <span className="text-sm text-muted-foreground">In Consultation</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <span className="mt-2 text-2xl font-bold text-foreground">{completedCount}</span>
            <span className="text-sm text-muted-foreground">Completed</span>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                Live Queue
              </CardTitle>
              <CardDescription>
                Real-time view of all registered patients
              </CardDescription>
            </div>
            <Badge
              className="gap-1 bg-destructive text-destructive-foreground"
            >
              <AlertTriangle className="h-3 w-3" />
              {emergencyCount} Emergency
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No patients registered"
              description="Patients will appear here when they register"
            />
          ) : (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                    patient.criticalLevel === "emergency"
                      ? "border-destructive/50 bg-destructive/5"
                      : ""
                  }`}
                >
                  {/* Patient Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {patient.queueNumber}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">{patient.name}</span>
                        <StatusBadge status={patient.status} />
                        {patient.criticalLevel === "emergency" && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            Emergency
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Age: {patient.age} | {getSymptomLabel(patient.symptoms)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Emergency Button */}
                    {patient.criticalLevel !== "emergency" &&
                      patient.status !== "completed" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEmergencyMark(patient.id)}
                          disabled={updatingPatientId === patient.id}
                        >
                          {updatingPatientId === patient.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              EMERGENCY
                            </>
                          )}
                        </Button>
                      )}

                    {/* Status Select */}
                    {patient.status !== "completed" && (
                      <Select
                        value={patient.status}
                        onValueChange={(value) =>
                          handleStatusChange(patient.id, value as PatientStatus)
                        }
                        disabled={updatingPatientId === patient.id}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="in_consultation">
                            In Consultation
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
