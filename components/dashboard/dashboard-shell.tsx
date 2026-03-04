"use client"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-4 py-6 lg:px-8 lg:py-10">
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-stretch justify-center">
        <div className="w-full">{children}</div>
      </main>
    </div>
  )
}
