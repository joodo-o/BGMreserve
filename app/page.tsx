"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReservationsTab } from "@/components/dashboard/reservations-tab"

export default function HomePage() {
  return (
    <DashboardShell>
      <ReservationsTab />
    </DashboardShell>
  )
}
