import { Users, Calendar, Gamepad2, BookOpen } from "lucide-react"

const features = [
  {
    icon: Gamepad2,
    title: "Weekly Game Nights",
    description:
      "Every week we gather for epic sessions spanning everything from chill card games to intense strategy battles.",
    accent: "neon-red" as const,
  },
  {
    icon: Users,
    title: "Growing Community",
    description:
      "A vibrant, welcoming group of tabletop enthusiasts. Beginners and veterans alike are always welcome.",
    accent: "cyber-lime" as const,
  },
  {
    icon: BookOpen,
    title: "200+ Games Library",
    description:
      "Our ever-expanding library covers every genre. Reserve any game for your next session from our catalog.",
    accent: "neon-red" as const,
  },
  {
    icon: Calendar,
    title: "Events & Tournaments",
    description:
      "Seasonal tournaments, themed nights, and special events keep the competitive spirit alive.",
    accent: "cyber-lime" as const,
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-5xl">
            What We <span className="text-neon-red text-glow-red">Do</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            BGM is more than a club. It is a community of tabletop lovers who believe
            in the power of gathering around a table and sharing an adventure.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-neon-red/40 hover:neon-glow-red"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  feature.accent === "neon-red"
                    ? "bg-neon-red/15 text-neon-red"
                    : "bg-cyber-lime/15 text-cyber-lime"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
