"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { subscribeToPatients, updatePatientStatus } from "@/lib/patient-service"
import type { Patient, PatientStatus } from "@/lib/types"
import { CRITICALITY_CONFIG, STATUS_CONFIG } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { LogOut, Stethoscope, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function DoctorDashboard() {
  const { logout } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingPatient, setUpdatingPatient] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToPatients((updatedPatients) => {
      if (!updatedPatients || updatedPatients.length === 0) {
        setPatients([])
        setLoading(false)
        return
      }

      const sorted = [...updatedPatients].sort((a, b) => {
        if (a.criticalLevel === "emergency" && b.criticalLevel !== "emergency") return -1
        if (a.criticalLevel !== "emergency" && b.criticalLevel === "emergency") return 1
        return a.queueNumber - b.queueNumber
      })

      setPatients(sorted)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (patientId: string, newStatus: PatientStatus) => {
    setUpdatingPatient(patientId)
    try {
      await updatePatientStatus(patientId, newStatus)
    } catch (error) {
      console.error("Failed to update patient status", error)
    } finally {
      setUpdatingPatient(null)
    }
  }

  const stats = {
    total: patients.length,
    waiting: patients.filter((p) => p.status === "waiting").length,
    inConsultation: patients.filter((p) => p.status === "in_consultation").length,
    completed: patients.filter((p) => p.status === "completed").length,
    emergency: patients.filter((p) => p.criticalLevel === "emergency").length,
  }

  const activePatients = patients.filter(
    (p) => p.status && p.status !== "completed"
  )

  if (loading) {
    return <LoadingSpinner message="Loading patient queue..." />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Doctor Dashboard</h1>
              <p className="text-sm text-muted-foreground">Patient Queue Management</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={<Users />} label="Total" value={stats.total} />
          <StatCard icon={<Clock />} label="Waiting" value={stats.waiting} />
          <StatCard icon={<Stethoscope />} label="In Consultation" value={stats.inConsultation} />
          <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} />
          <StatCard icon={<AlertTriangle />} label="Emergency" value={stats.emergency} />
        </div>

        {/* Active Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Queue</CardTitle>
            <CardDescription>Emergency patients are shown first</CardDescription>
          </CardHeader>
          <CardContent>
            {activePatients.length === 0 ? (
              <EmptyState
                title="No active patients"
                description="All patients have been completed"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Queue #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Symptom</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activePatients.map((patient) => {
                      if (!patient.status || !patient.criticalLevel) return null

                      const criticality =
                        CRITICALITY_CONFIG[patient.criticalLevel] ??
                        CRITICALITY_CONFIG["normal"]

                      const status =
                        STATUS_CONFIG[patient.status] ??
                        STATUS_CONFIG["waiting"]

                      return (
                        <TableRow key={patient.id}>
                          <TableCell>#{patient.queueNumber}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell className="capitalize">
                            {patient.symptoms.replace("_", " ")}
                          </TableCell>
                          <TableCell>
                            <Badge className={criticality.className}>
                              {criticality.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={patient.status}
                              onValueChange={(value) =>
                                handleStatusChange(patient.id, value as PatientStatus)
                              }
                              disabled={updatingPatient === patient.id}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="waiting">Waiting</SelectItem>
                                <SelectItem value="in_consultation">In Consultation</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

/* Small helper for stats */
function StatCard({ icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
