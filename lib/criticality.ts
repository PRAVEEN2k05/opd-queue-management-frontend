import type { CriticalityLevel } from "./types"

// Symptom options available in the dropdown
export const SYMPTOM_OPTIONS = [
  { value: "cold", label: "Cold" },
  { value: "fever", label: "Fever" },
  { value: "headache", label: "Headache" },
  { value: "general_checkup", label: "General Checkup" },
] as const

export type SymptomType = (typeof SYMPTOM_OPTIONS)[number]["value"]

// Severe symptoms that combined with fever indicate emergency
const SEVERE_SYMPTOM_KEYWORDS = ["severe", "chest pain", "difficulty breathing", "unconscious"]

/**
 * Calculates the criticality level based on patient symptoms
 * This is a rule-based system designed to be modular for future ML integration
 *
 * Rules:
 * - Fever + severe symptoms → Emergency
 * - Cold / Headache / General Checkup → Normal
 * - Admin can manually mark Emergency (handled separately)
 *
 * NOTE: Age-based emergency tagging has been removed per requirements
 *
 * @param _age - Patient's age (kept for future ML integration)
 * @param symptom - Patient's selected symptom
 * @param additionalNotes - Optional additional notes for severe symptom detection
 * @returns CriticalityLevel - "emergency" or "normal"
 */
export function calculateCriticality(
  _age: number,
  symptom: string,
  additionalNotes?: string
): CriticalityLevel {
  // Rule 1: Fever with severe symptoms is emergency
  if (symptom === "fever" && additionalNotes) {
    const notesLower = additionalNotes.toLowerCase()
    const hasSevereSymptoms = SEVERE_SYMPTOM_KEYWORDS.some(keyword => 
      notesLower.includes(keyword)
    )
    if (hasSevereSymptoms) {
      return "emergency"
    }
  }

  // Rule 2: All standard symptoms (Cold, Headache, General Checkup, Fever without severe) are normal
  // Emergency can be manually set by Admin
  return "normal"
}

/**
 * Gets the priority score for queue ordering
 * Lower score = higher priority (seen first)
 *
 * @param criticalLevel - The patient's criticality level
 * @param createdAt - When the patient was registered
 * @returns number - Priority score for sorting
 */
export function getPriorityScore(
  criticalLevel: CriticalityLevel,
  createdAt: Date
): number {
  // Emergency patients get a much lower base score (higher priority)
  const baseScore = criticalLevel === "emergency" ? 0 : 1000000

  // Add timestamp to maintain FIFO within same criticality
  return baseScore + createdAt.getTime()
}
