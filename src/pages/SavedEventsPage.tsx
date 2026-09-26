import { useNavigate } from "react-router-dom"
import { ArrowLeft, Bookmark, CalendarDays, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SAVED_EVENTS = [
  {
    id: "sav_001",
    title: "Khmer Classical Dance & Arts",
    date: "Oct 24, 2026",
    location: "Chaktomuk Theatre",
    category: "Cultural & Arts",
    image:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "sav_002",
    title: "Street Food & Craft Beer Festival",
    date: "Oct 12, 2026",
    location: "Koh Pich, Phnom Penh",
    category: "Food & Drink",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "sav_003",
    title: "Frontend & AI Dev Meetup 2026",
    date: "Oct 15, 2026",
    location: "Online & Raintree",
    category: "Tech & Startups",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80",
  },
]

export default function SavedEventsPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Saved Events
        </h1>
        <p className="text-sm text-muted-foreground">
          Events you have bookmarked for later.
        </p>
      </div>

      {/* Grid of Saved Events */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SAVED_EVENTS.map((event) => (
          <div
            key={event.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={event.image}
                alt={event.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Badge className="absolute top-2.5 right-2.5 shadow-sm">
                {event.category}
              </Badge>
              <button
                type="button"
                aria-label="Remove from saved"
                className="absolute top-2.5 left-2.5 flex size-7 items-center justify-center rounded-full bg-background/80 text-primary backdrop-blur-sm transition-colors hover:bg-background"
              >
                <Bookmark className="size-4 fill-current" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="font-semibold text-foreground transition-colors group-hover:text-primary">
                {event.title}
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {event.location}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto w-full rounded-full font-semibold"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}