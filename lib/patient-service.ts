import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getDoc,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Patient, PatientFormData, PatientStatus, CriticalityLevel } from "./types"
import { calculateCriticality } from "./criticality"

const PATIENTS_COLLECTION = "patients"

/**
 * Converts Firestore document to Patient object
 */
function docToPatient(doc: { id: string; data: () => Record<string, unknown> }): Patient {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name as string,
    age: data.age as number,
    symptoms: data.symptoms as string,
    criticalLevel: data.criticalLevel as Patient["criticalLevel"],
    queueNumber: data.queueNumber as number,
    status: data.status as PatientStatus,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  }
}

/**
 * Gets the next queue number for today
 */
async function getNextQueueNumber(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const q = query(
    collection(db, PATIENTS_COLLECTION),
    where("createdAt", ">=", Timestamp.fromDate(today)),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return 1
  }

  // Find the highest queue number for today
  let maxQueueNumber = 0
  snapshot.forEach((doc) => {
    const queueNumber = doc.data().queueNumber as number
    if (queueNumber > maxQueueNumber) {
      maxQueueNumber = queueNumber
    }
  })

  return maxQueueNumber + 1
}

/**
 * Creates a new patient in Firestore
 */
export async function createPatient(formData: PatientFormData): Promise<Patient> {
  const criticalLevel = calculateCriticality(formData.age, formData.symptoms)
  const queueNumber = await getNextQueueNumber()
  const now = new Date()

  const patientData = {
    name: formData.name,
    age: formData.age,
    symptoms: formData.symptoms,
    criticalLevel,
    queueNumber,
    status: "waiting" as PatientStatus,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  }

  const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), patientData)

  return {
    id: docRef.id,
    ...patientData,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Gets a single patient by ID
 */
export async function getPatient(patientId: string): Promise<Patient | null> {
  const docRef = doc(db, PATIENTS_COLLECTION, patientId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  return docToPatient({ id: docSnap.id, data: () => docSnap.data() })
}

/**
 * Updates a patient's status
 */
export async function updatePatientStatus(
  patientId: string,
  status: PatientStatus
): Promise<void> {
  const docRef = doc(db, PATIENTS_COLLECTION, patientId)
  await updateDoc(docRef, { status, updatedAt: Timestamp.fromDate(new Date()) })
}

/**
 * Updates a patient's criticality level (for Emergency button)
 */
export async function updatePatientCriticality(
  patientId: string,
  criticalLevel: CriticalityLevel
): Promise<void> {
  const docRef = doc(db, PATIENTS_COLLECTION, patientId)
  await updateDoc(docRef, { criticalLevel, updatedAt: Timestamp.fromDate(new Date()) })
}

/**
 * Subscribes to real-time updates for today's queue
 * Alias: subscribeToPatients
 */
export function subscribeToQueue(
  callback: (patients: Patient[]) => void
): Unsubscribe {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const q = query(
    collection(db, PATIENTS_COLLECTION),
    where("createdAt", ">=", Timestamp.fromDate(today)),
    orderBy("createdAt", "asc")
  )

  return onSnapshot(q, (snapshot) => {
    const patients: Patient[] = []
    snapshot.forEach((doc) => {
      patients.push(docToPatient({ id: doc.id, data: () => doc.data() }))
    })

    // Sort: Emergency first, then by queue number
    patients.sort((a, b) => {
      // Completed patients go to the bottom
      if (a.status === "completed" && b.status !== "completed") return 1
      if (b.status === "completed" && a.status !== "completed") return -1

      // Emergency patients first (among non-completed)
      if (a.criticalLevel === "emergency" && b.criticalLevel === "normal") return -1
      if (b.criticalLevel === "emergency" && a.criticalLevel === "normal") return 1

      // Within same criticality, sort by queue number
      return a.queueNumber - b.queueNumber
    })

    callback(patients)
  })
}

// Alias for subscribeToQueue
export const subscribeToPatients = subscribeToQueue

/**
 * Subscribes to real-time updates for a single patient
 */
export function subscribeToPatient(
  patientId: string,
  callback: (patient: Patient | null) => void
): Unsubscribe {
  const docRef = doc(db, PATIENTS_COLLECTION, patientId)

  return onSnapshot(docRef, (doc) => {
    if (!doc.exists()) {
      callback(null)
      return
    }
    callback(docToPatient({ id: doc.id, data: () => doc.data() }))
  })
}
