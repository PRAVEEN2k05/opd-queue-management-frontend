"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createPatient } from "@/lib/patient-service"
import { SYMPTOM_OPTIONS } from "@/lib/criticality"
import { Loader2, UserPlus } from "lucide-react"

export function PatientRegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptom: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }

    const age = Number.parseInt(formData.age, 10)
    if (Number.isNaN(age) || age < 0 || age > 150) {
      setError("Please enter a valid age")
      return
    }

    if (!formData.symptom) {
      setError("Please select a symptom")
      return
    }

    setIsLoading(true)

    try {
      const patient = await createPatient({
        name: formData.name.trim(),
        age,
        symptoms: formData.symptom,
      })

      // Redirect to confirmation page
      router.push(`/patient/${patient.id}`)
    } catch (err) {
      console.error("Error creating patient:", err)
      setError("Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <UserPlus className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl text-foreground">Patient Registration</CardTitle>
        <CardDescription>
          Enter your details to join the OPD queue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              min="0"
              max="150"
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, age: e.target.value }))
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptom">Symptom</Label>
            <Select
              value={formData.symptom}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, symptom: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger id="symptom">
                <SelectValue placeholder="Select your symptom" />
              </SelectTrigger>
              <SelectContent>
                {SYMPTOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Register & Get Queue Number
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
