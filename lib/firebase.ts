import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBCt0BdG_jjxapfsPUeyB1UXUb4esI9CUk",
  authDomain: "opd-queue-management-10cc5.firebaseapp.com",
  projectId: "opd-queue-management-10cc5",
  storageBucket: "opd-queue-management-10cc5.firebasestorage.app",
  messagingSenderId: "752790605667",
  appId: "1:752790605667:web:0b1a610322430197cd8d56"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const db = getFirestore(app)
export default app
