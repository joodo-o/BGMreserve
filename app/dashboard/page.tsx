"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReservationsTab } from "@/components/dashboard/reservations-tab"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <ReservationsTab />
    </DashboardShell>
  )
}
