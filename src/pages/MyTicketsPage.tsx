import { useNavigate } from "react-router-dom"
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const TICKETS = [
  {
    id: "tkt_001",
    event: "Sunset Rooftop Mixer",
    date: "Sep 28, 2026 • 6:00 PM",
    location: "Street 51, BKK1",
    tier: "VIP",
    price: "$25",
    status: "Active",
    code: "EV-9F2K1",
  },
  {
    id: "tkt_002",
    event: "Phnom Penh Jazz Night",
    date: "Oct 10, 2026 • 7:00 PM",
    location: "Street 240, Daun Penh",
    tier: "General",
    price: "$15",
    status: "Active",
    code: "EV-7HX4Q",
  },
  {
    id: "tkt_003",
    event: "Frontend & AI Dev Meetup",
    date: "Oct 15, 2026 • 6:30 PM",
    location: "Online & Raintree",
    tier: "Free",
    price: "$0",
    status: "Active",
    code: "EV-2M8TZ",
  },
]

export default function MyTicketsPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Back button and page title */}
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
          My Tickets
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all your purchased event passes.
        </p>
      </div>

      {/* Ticket cards list */}
      <div className="space-y-4">
        {TICKETS.map((ticket) => (
          <Card key={ticket.id} size="sm" className="transition-colors hover:border-primary/30">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Ticket className="size-6" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-base font-bold text-foreground">
                      {ticket.event}
                    </span>
                    <Badge className="bg-amber-400/15 text-[10px] text-amber-600 dark:text-amber-400">
                      {ticket.tier}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {ticket.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {ticket.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{ticket.price}</div>
                  <div className="font-mono text-xs text-muted-foreground">{ticket.code}</div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-semibold">
                  View QR
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}