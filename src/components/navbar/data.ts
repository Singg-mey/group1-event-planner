import {
  CalendarPlus,
  Laptop,
  Music,
  Palette,
  Sparkles,
  Utensils,
} from "lucide-react"

import type { CreateOption, NavCategory } from "./types"

export const EVENT_CATEGORIES: NavCategory[] = [
  {
    title: "Music & Concerts",
    href: "#find-event-music",
    description: "Live jazz, acoustic sessions, electronic festivals & indie gigs.",
    icon: Music,
    color: "text-amber-500 dark:text-amber-400 bg-amber-500/10",
  },
  {
    title: "Tech & Hackathons",
    href: "#find-event-tech",
    description: "Developer meetups, AI workshops, product demos & tech talks.",
    icon: Laptop,
    color: "text-blue-500 dark:text-blue-400 bg-blue-500/10",
  },
  {
    title: "Arts & Culture",
    href: "#find-event-arts",
    description: "Classical dance, art galleries, film screenings & exhibitions.",
    icon: Palette,
    color: "text-rose-500 dark:text-rose-400 bg-rose-500/10",
  },
  {
    title: "Food & Nightlife",
    href: "#find-event-food",
    description: "Street food fests, chef popups, rooftop DJs & social mixers.",
    icon: Utensils,
    color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10",
  },
]

export const CREATE_OPTIONS: CreateOption[] = [
  {
    title: "Host In-Person Event",
    description: "Reserve a physical venue, manage door tickets & seated guests.",
    icon: CalendarPlus,
    href: "#create-physical",
  },
  {
    title: "Host Online Event",
    description: "Stream live on Zoom/Meet, automated reminders & calendar sync.",
    icon: Laptop,
    href: "#create-virtual",
  },
  {
    title: "Drafts & Templates",
    description: "Quickly start from recurring templates or your recent drafts.",
    icon: Sparkles,
    href: "#create-templates",
  },
]