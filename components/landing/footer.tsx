import { Dice5 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-4 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-red/20">
            <Dice5 className="h-4 w-4 text-neon-red" />
          </div>
          <span className="text-sm font-semibold text-foreground">BGM</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Board Game Members Club. Rolling dice, building empires, making memories.
        </p>
      </div>
    </footer>
  )
}
