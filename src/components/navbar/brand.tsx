import { CalendarDays } from "lucide-react"

import type { NavItemClick } from "./types"

export function Brand({ onNav }: { onNav: NavItemClick }) {
  return (
    <a
      href="#home"
      onClick={(e) => onNav("Home", "#home", e)}
      className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
      aria-label="Event Planner Home"
    >
      <div className="flex size-9.5 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-sky-400 text-white shadow-md shadow-primary/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
        <CalendarDays className="size-5 transition-transform duration-300 group-hover:rotate-6" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Evently
          </span>
        </div>
        <span className="hidden -mt-1 text-[11px] font-medium text-muted-foreground sm:block">
          Discover & Organize
        </span>
      </div>
    </a>
  )
}