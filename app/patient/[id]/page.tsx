import { PatientStatusView } from "@/components/patient/patient-status-view"
import { Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PatientPageProps {
  params: Promise<{ id: string }>
}

export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">OPD Queue</span>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <PatientStatusView patientId={id} />
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>Please keep this page open for real-time updates</p>
      </footer>
    </div>
  )
}
