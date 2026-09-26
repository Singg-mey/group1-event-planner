import * as React from "react"
import { useNavigate } from "react-router-dom"
import { CalendarPlus, CalendarRange, Loader2, RotateCcw, Users } from "lucide-react"

import { EventCardActions } from "@/components/event-card-actions"
import { EventsErrorState } from "@/components/events-error-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { resetEvents } from "@/data/events-repository"
import { getUserProfile } from "@/data/user"
import { useEvents } from "@/hooks/use-events"
import { isConcludedEvent, toEventStatus } from "@/lib/event-form"
import { isSupabaseConfigured } from "@/lib/supabase"
import type { EventStatus, SearchEvent } from "@/types/event"

const STATUS_FILTERS: { value: EventStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const statusBadgeVariant = (
  status: EventStatus
): "default" | "secondary" | "outline" | "destructive" => {
  if (status === "published") return "default"
  if (status === "cancelled") return "destructive"
  if (status === "completed") return "secondary"
  return "outline"
}

export function MyEvents() {
  const navigate = useNavigate()
  const { events, isLoading, error, isMutating, deleteEvent, refresh } =
    useEvents()
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<EventStatus | "all">("all")
  const [actionError, setActionError] = React.useState<string | null>(null)
  const [isResetting, setIsResetting] = React.useState(false)

  const currentUserId = getUserProfile().id

  const ownedEvents = React.useMemo(
    () =>
      currentUserId
        ? events.filter((event) => event.organizerId === currentUserId)
        : [],
    [events, currentUserId]
  )

  const visibleEvents = React.useMemo(() => {
    const search = query.trim().toLowerCase()

    return ownedEvents.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || toEventStatus(event.status) === statusFilter
      const matchesSearch =
        !search ||
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search)

      return matchesStatus && matchesSearch
    })
  }, [ownedEvents, query, statusFilter])

  const handleDelete = async (event: SearchEvent) => {
    setActionError(null)
    try {
      await deleteEvent(event.id)
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

  const handleReset = async () => {
    setActionError(null)
    setIsResetting(true)
    try {
      // resetEvents already broadcasts the change, so every mounted
      // useEvents() consumer refetches on its own.
      await resetEvents()
    } catch (resetFailure) {
      setActionError(
        resetFailure instanceof Error
          ? resetFailure.message
          : "Unable to reset the demo data."
      )
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Events
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, publish, or remove the events you organize.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isSupabaseConfigured && (
            <Button
              className="w-fit gap-2 rounded-full"
              variant="outline"
              disabled={isResetting}
              onClick={() => void handleReset()}
            >
              {isResetting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCcw className="size-4" />
              )}
              Reset demo data
            </Button>
          )}
          <Button
            className="w-fit gap-2 rounded-full font-semibold"
            onClick={() => navigate("/create-event")}
          >
            <CalendarPlus className="size-4" />
            Create event
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your events..."
          className="h-10 w-full rounded-lg text-xs sm:max-w-xs"
          aria-label="Search your events"
        />

        <div className="inline-flex w-fit flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className="rounded-md text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-destructive">
          {actionError}
        </p>
      )}

      {isLoading ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading your events...
          </CardContent>
        </Card>
      ) : error ? (
        <EventsErrorState error={error} onRetry={() => void refresh()} />
      ) : ownedEvents.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarRange className="size-5" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold">You have not created an event yet</p>
              <p className="text-xs text-muted-foreground">
                Publish your first event and it will show up here.
              </p>
            </div>
            <Button
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => navigate("/create-event")}
            >
              <CalendarPlus className="size-3.5" />
              Create event
            </Button>
          </CardContent>
        </Card>
      ) : visibleEvents.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-32 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            No events match these filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col overflow-hidden border-border/70 shadow-none"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={event.image}
                  alt={event.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                  <Badge variant={statusBadgeVariant(toEventStatus(event.status))}>
                    {isConcludedEvent(event) ? "Completed" : event.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-semibold transition-colors hover:text-primary">
                  {event.title}
                </h2>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <CalendarRange className="size-3.5 shrink-0" />
                    {event.date || "Date not set"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="size-3.5 shrink-0" />
                    {event.capacity}
                  </p>
                </div>

                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {event.description}
                </p>

                <EventCardActions
                  event={event}
                  isDeleting={isMutating}
                  onEdit={() => navigate(`/events/${event.id}/edit`)}
                  onDelete={handleDelete}
                  className="mt-auto flex gap-2 pt-3"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default MyEvents
