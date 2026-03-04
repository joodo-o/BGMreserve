"use client"

import Link from "next/link"
import { useState } from "react"
import { Dice5, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations("Landing.navbar")

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-neon-red/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-red/20 neon-glow-red">
            <Dice5 className="h-5 w-5 text-neon-red" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            BGM
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#about"
            className="text-sm text-muted-foreground transition-colors hover:text-neon-red"
          >
            {t("about")}
          </Link>
          <Link
            href="#gallery"
            className="text-sm text-muted-foreground transition-colors hover:text-neon-red"
          >
            {t("gallery")}
          </Link>
          <Link
            href="#join"
            className="text-sm text-muted-foreground transition-colors hover:text-neon-red"
          >
            {t("join")}
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-neon-red/50 text-neon-red hover:bg-neon-red/10 hover:text-neon-red"
            >
              {t("reservations")}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="flex flex-col gap-4 border-t border-border px-4 py-4 md:hidden glass">
          <Link
            href="#about"
            className="text-sm text-muted-foreground hover:text-neon-red"
            onClick={() => setMobileOpen(false)}
          >
            {t("about")}
          </Link>
          <Link
            href="#gallery"
            className="text-sm text-muted-foreground hover:text-neon-red"
            onClick={() => setMobileOpen(false)}
          >
            {t("gallery")}
          </Link>
          <Link
            href="#join"
            className="text-sm text-muted-foreground hover:text-neon-red"
            onClick={() => setMobileOpen(false)}
          >
            {t("join")}
          </Link>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <Button
              variant="outline"
              className="w-full border-neon-red/50 text-neon-red hover:bg-neon-red/10 hover:text-neon-red"
            >
              {t("reservations")}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
