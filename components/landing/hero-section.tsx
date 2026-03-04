"use client"

import { Dice1, Dice3, Dice5, Spade, Swords, Trophy, Crown, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

const floatingIcons = [
  { Icon: Dice5, delay: 0, x: 10, y: 15 },
  { Icon: Spade, delay: 1.2, x: 80, y: 20 },
  { Icon: Dice3, delay: 0.6, x: 25, y: 70 },
  { Icon: Swords, delay: 1.8, x: 70, y: 75 },
  { Icon: Trophy, delay: 0.3, x: 90, y: 45 },
  { Icon: Crown, delay: 1.5, x: 5, y: 50 },
  { Icon: Target, delay: 0.9, x: 50, y: 10 },
  { Icon: Dice1, delay: 2.1, x: 45, y: 85 },
]

function FloatingIcon({
  Icon,
  delay,
  x,
  y,
}: {
  Icon: React.ComponentType<{ className?: string }>
  delay: number
  x: number
  y: number
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className="absolute transition-all duration-1000"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: mounted ? 0.15 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        animation: mounted ? `float ${3 + delay}s ease-in-out infinite` : "none",
      }}
    >
      <Icon className="h-8 w-8 text-neon-red md:h-12 md:w-12" />
    </div>
  )
}

export function HeroSection() {
  const t = useTranslations("Landing.hero")

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-neon-red/10 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyber-lime/10 blur-[128px]" />

      {/* Floating board game icons */}
      {floatingIcons.map((icon, i) => (
        <FloatingIcon key={i} {...icon} />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-red/30 bg-neon-red/10 px-4 py-1.5">
          <Dice5 className="h-4 w-4 text-neon-red" />
          <span className="text-sm font-medium text-neon-red">
            {t("badge")}
          </span>
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
          <span className="text-foreground">{t("titleLine1")}</span>
          <br />
          <span className="text-glow-red text-neon-red">{t("titleWith")}</span>
          <span className="text-glow-lime text-cyber-lime">BGM</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          {t("description")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#join">
            <Button
              size="lg"
              className="bg-neon-red text-primary-foreground hover:bg-neon-red/90 neon-glow-red px-8 text-base font-semibold"
            >
              {t("primaryCta")}
            </Button>
          </a>
          <a href="#about">
            <Button
              size="lg"
              variant="outline"
              className="border-cyber-lime/50 text-cyber-lime hover:bg-cyber-lime/10 hover:text-cyber-lime px-8 text-base"
            >
              {t("secondaryCta")}
            </Button>
          </a>
        </div>
      </div>

      {/* Float keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  )
}
