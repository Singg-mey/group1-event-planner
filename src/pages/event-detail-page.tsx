import * as React from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CalendarDays, MapPin, Pencil, Star, Users } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCardActions } from "@/components/event-card-actions"
import { EventsErrorState } from "@/components/events-error-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { canManageEvent } from "@/data/events-repository"
import { useEvents } from "@/hooks/use-events"
import { isConcludedEvent } from "@/lib/event-form"
import type { SearchEvent } from "@/types/event"

export function EventDetailPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { events, isLoading, error, isMutating, deleteEvent, refresh } =
    useEvents()
  const event = events.find((item) => item.id === id)
  const isPast = event ? isConcludedEvent(event) : false
  const isOwner = canManageEvent(event)

  const [actionError, setActionError] = React.useState<string | null>(null)

  const handleDelete = async (target: SearchEvent) => {
    setActionError(null)
    try {
      await deleteEvent(target.id)
      navigate("/my-events")
    } catch (deleteFailure) {
      setActionError(
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "Unable to delete the event."
      )
      // Keeps the confirm dialog open so the message is actually visible.
      throw deleteFailure
    }
  }

  const details = event
    ? [
        { icon: CalendarDays, label: "Date", value: event.date },
        { icon: MapPin, label: "Location", value: event.location },
        {
          icon: Users,
          label: isPast ? "Attendance" : "Capacity",
          value: event.capacity,
        },
        {
          icon: Star,
          label: "Rating",
          value:
            event.rating !== undefined
              ? `${event.rating.toFixed(1)}${event.reviewCount ? ` (${event.reviewCount} reviews)` : ""}`
              : "",
        },
      ].filter((detail) => detail.value)
    : []

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem={state?.activeItem ?? "Home"} />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/", { state })}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="size-3.5" />
          Back to events
        </Button>

        {isLoading ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground">
              Loading event...
            </CardContent>
          </Card>
        ) : error ? (
          <EventsErrorState error={error} onRetry={() => void refresh()} />
        ) : event ? (
          <article className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-muted sm:aspect-[21/9]">
              <img
                src={event.image}
                alt={event.title}
                className="size-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {event.category && <Badge>{event.category}</Badge>}
                <Badge variant="secondary" className="uppercase">
                  {isPast ? "Past event" : "Upcoming"}
                </Badge>
              </div>
            </div>

            <header className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {event.title}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {event.description}
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {details.map(({ icon: Icon, label, value }) => (
                <Card key={label} size="sm" className="shadow-none">
                  <CardContent className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isOwner && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
                <p className="mr-auto text-xs text-muted-foreground">
                  You organize this event.
                  {actionError && (
                    <span role="alert" className="ml-2 text-destructive">
                      {actionError}
                    </span>
                  )}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  className="gap-1.5"
                >
                  <Pencil className="size-3.5" />
                  Edit event
                </Button>
                <EventCardActions
                  event={event}
                  isDeleting={isMutating}
                  onDelete={handleDelete}
                  className="flex gap-2"
                />
              </div>
            )}

            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ) : (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-40 items-center justify-center text-center text-sm text-muted-foreground">
              We couldn&apos;t find that event.
            </CardContent>
          </Card>
        )}
      </main>
      <Footer className="mt-auto" />
    </div>
  )
}

export default EventDetailPage
