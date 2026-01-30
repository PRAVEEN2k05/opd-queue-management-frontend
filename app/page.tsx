import Link from "next/link"
import { PatientRegistrationForm } from "@/components/public/patient-registration-form"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  QrCode,
  Clock,
  Zap,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">OPD Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/doctor">
                <Stethoscope className="mr-2 h-4 w-4" />
                Doctor
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Registration Form */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                {/* Left: Info */}
                <div className="text-center lg:text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      QR-Based Queue Management
                    </span>
                  </div>
                  <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                    OPD Patient Queue System
                  </h1>
                  <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                    Register now to join the queue. Get your queue number and
                    track your status in real-time via QR code.
                  </p>

                  {/* Features */}
                  <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">QR Code Tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Scan to view status
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="rounded-lg bg-destructive/10 p-2">
                        <Zap className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Emergency Priority</p>
                        <p className="text-sm text-muted-foreground">
                          Auto-detection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="rounded-lg bg-amber-500/10 p-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Real-time Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Instant notifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <div className="rounded-lg bg-emerald-500/10 p-2">
                        <Activity className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Smart Queue</p>
                        <p className="text-sm text-muted-foreground">
                          Efficient management
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Registration Form */}
                <div>
                  <PatientRegistrationForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                How It Works
              </h2>
              <p className="mt-2 text-muted-foreground">
                Simple steps to join the queue
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Register</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill in your details and select your symptom to register for the queue.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Get QR Code</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Receive your queue number and a unique QR code to track your status.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Track Status</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Scan your QR code anytime to see your real-time queue position.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>OPD Queue Management System</p>
          <p className="mt-1">Designed for healthcare efficiency</p>
        </div>
      </footer>
    </div>
  )
}
