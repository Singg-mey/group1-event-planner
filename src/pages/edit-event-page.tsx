import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { EventForm } from "@/components/event-form"
import { EventsErrorState } from "@/components/events-error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { canManageEvent } from "@/data/events-repository"
import { useEvents } from "@/hooks/use-events"
import type { EventFormValues } from "@/lib/event-form"

export function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, isLoading, error, isMutating, refresh, updateEvent, deleteEvent } =
    useEvents()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Reading from the shared list keeps this page in step with writes made
  // anywhere else, and avoids a second fetch.
  const event = events.find((item) => item.id === id) ?? null
  const isOwner = canManageEvent(event)

  const handleSubmit = async (values: EventFormValues) => {
    if (!id) return
    setActionError(null)
    const saved = await updateEvent(id, values)
    navigate(`/events/${saved.id}`)
    // Returned so the form can show the canonical record before navigating.
    return saved
  }

  const handleDelete = async () => {
    if (!id) return
    setActionError(null)
    try {
      await deleteEvent(id)
    } catch (deleteFailure) {
      const message =
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "Unable to delete the event."
      setActionError(message)
      // Keeps the confirm dialog open so the message is actually visible.
      throw deleteFailure
    }
    navigate("/my-events")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem="Create Event" />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(event ? `/events/${event.id}` : "/my-events")}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="size-3.5" />
          {event ? "Back to event" : "Back to my events"}
        </Button>

        <div className="space-y-1 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Edit event
          </h1>
          <p className="text-sm text-muted-foreground">
            Update the details. Changes go live for everyone immediately.
          </p>
        </div>

        {isLoading ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading event...
            </CardContent>
          </Card>
        ) : error ? (
          <EventsErrorState error={error} onRetry={() => void refresh()} />
        ) : !event ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find that event.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/my-events")}
              >
                Go to My Events
              </Button>
            </CardContent>
          </Card>
        ) : !isOwner ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Only the organizer of this event can change it.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                Back to event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {actionError && (
              <p role="alert" className="text-sm text-destructive">
                {actionError}
              </p>
            )}
            <EventForm
              // Remounting on the id keeps a stale record's values from
              // lingering if the route param changes without unmounting.
              key={event.id}
              mode="edit"
              event={event}
              onSubmit={handleSubmit}
              onDelete={() => setIsDeleteOpen(true)}
              onCancel={() => navigate(`/events/${event.id}`)}
            />
          </>
        )}
      </main>

      {event && isOwner && (
        <ConfirmDeleteDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title={`Delete "${event.title}"?`}
          description="This permanently removes the event for everyone. This action cannot be undone."
          isDeleting={isMutating}
          onConfirm={handleDelete}
        />
      )}

      <Footer className="mt-auto" />
    </div>
  )
}

export default EditEventPage
