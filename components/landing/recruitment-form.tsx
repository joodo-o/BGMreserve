"use client"

import { useState } from "react"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"

export function RecruitmentForm() {
  const t = useTranslations("Landing.recruitment")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const form = new FormData(e.currentTarget)
    const email = (form.get("email") as string | null)?.trim() ?? ""
    const phone = (form.get("phone") as string | null)?.trim() ?? ""

    if (!email.toLowerCase().endsWith("@snu.ac.kr")) {
      setError(t("errors.emailDomain"))
      return
    }

    if (!phone) {
      setError(t("errors.phoneRequired"))
      return
    }

    setLoading(true)
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="join" className="relative px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="glass rounded-2xl p-10 neon-glow-lime">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-cyber-lime" />
            <h3 className="mb-2 text-2xl font-bold text-foreground">
              {t("submittedTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("submittedBody")}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="join" className="relative px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-5xl">
            {t("title")} <span className="text-cyber-lime text-glow-lime">BGM</span>
          </h2>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 md:p-10 neon-glow-red"
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-foreground">
                  {t("fields.fullName")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("fields.fullNamePlaceholder")}
                  required
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-red"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-foreground">
                  {t("fields.phone")}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("fields.phonePlaceholder")}
                  required
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-red"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">
                {t("fields.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("fields.emailPlaceholder")}
                required
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-red"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="text-foreground">
                {t("fields.reason")}
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t("fields.reasonPlaceholder")}
                rows={4}
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-neon-red resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-red text-primary-foreground hover:bg-neon-red/90 neon-glow-red text-base font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("button.sending")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("button.submit")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
