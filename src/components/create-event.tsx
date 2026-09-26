import * as React from "react"
import { CalendarDays, CheckCircle2 } from "lucide-react"

import { EventForm } from "@/components/event-form"
import { Button } from "@/components/ui/button"
import { toEventCategory, type EventFormValues } from "@/lib/event-form"
import { useEvents } from "@/hooks/use-events"
import { useNavigate } from "react-router-dom"

export interface CreateEventValues {
  eventName?: string
  category?: string
  city?: string
}

interface CreateEventProps {
  initialValues?: CreateEventValues
  onManaged?: (eventId: string) => void
}

/** Turns the home page Quickstart prefill into partial form values. */
const toPrefill = (values?: CreateEventValues): Partial<EventFormValues> => {
  if (!values) return {}

  const prefill: Partial<EventFormValues> = {}

  if (values.eventName) prefill.title = values.eventName
  if (values.category) prefill.category = toEventCategory(values.category)
  if (values.city) prefill.address = values.city

  return prefill
}

export function CreateEvent({ initialValues, onManaged }: CreateEventProps) {
  const navigate = useNavigate()
  const { createEvent } = useEvents()
  const [createdId, setCreatedId] = React.useState<string | null>(null)
  const [prefillKey, setPrefillKey] = React.useState(0)

  const handleSubmit = async (values: EventFormValues) => {
    const created = await createEvent(values)
    setCreatedId(created.id)
    onManaged?.(created.id)
    // Returned so the form clears itself and a second click cannot create a
    // duplicate event.
    return created
  }

  const handleStartAnother = () => {
    setCreatedId(null)
    setPrefillKey((key) => key + 1)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Create a new event
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below. You can edit this anytime.
          </p>
        </div>

        {createdId && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              Your event is ready. Manage it any time from My Events.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(`/events/${createdId}`)}
              >
                View event
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => navigate("/my-events")}
              >
                My Events
              </Button>
            </div>
          </div>
        )}

        <EventForm
          // Remounting on prefillKey gives "Start another event" a blank form.
          key={prefillKey}
          mode="create"
          initialValues={toPrefill(initialValues)}
          onSubmit={handleSubmit}
          onCancel={handleStartAnother}
        />
      </div>
    </main>
  )
}

export default CreateEvent
