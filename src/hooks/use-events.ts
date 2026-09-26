import * as React from "react"

import { subscribeToEventChanges } from "@/data/events-changed"
import {
  createEvent as createEventRecord,
  deleteEvent as deleteEventRecord,
  getEvents,
  updateEvent as updateEventRecord,
} from "@/data/events-repository"
import type { EventFormValues } from "@/lib/event-form"
import type { SearchEvent } from "@/types/event"

const toError = (error: unknown, fallback: string): Error =>
  error instanceof Error ? error : new Error(fallback)

/**
 * Read + mutate access to events. Mutations run through the repository and then
 * every mounted consumer refetches, because the repository broadcasts a change
 * signal when a write succeeds.
 */
export function useEvents() {
  const [events, setEvents] = React.useState<SearchEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [isMutating, setIsMutating] = React.useState(false)

  // The first load is a promise, so state updates land in a callback rather
  // than synchronously in the effect body.
  const [reloadToken, setReloadToken] = React.useState(0)

  React.useEffect(() => {
    let isActive = true

    getEvents()
      .then((nextEvents) => {
        if (!isActive) return
        setEvents(nextEvents)
        setError(null)
      })
      .catch((nextError: unknown) => {
        if (!isActive) return
        setError(toError(nextError, "Unable to load events"))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [reloadToken])

  const refresh = React.useCallback(async () => {
    setReloadToken((token) => token + 1)
  }, [])

  // Any successful write anywhere in the app bumps the token, so every mounted
  // consumer re-reads the list.
  React.useEffect(
    () => subscribeToEventChanges(() => setReloadToken((token) => token + 1)),
    []
  )

  const runMutation = React.useCallback(
    async <T,>(mutation: () => Promise<T>, fallback: string): Promise<T> => {
      setIsMutating(true)
      try {
        return await mutation()
      } catch (mutationError) {
        throw toError(mutationError, fallback)
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  const createEvent = React.useCallback(
    (values: EventFormValues) =>
      runMutation(() => createEventRecord(values), "Unable to create the event"),
    [runMutation]
  )

  const updateEvent = React.useCallback(
    (id: string, values: EventFormValues) =>
      runMutation(
        () => updateEventRecord(id, values),
        "Unable to save your changes"
      ),
    [runMutation]
  )

  const deleteEvent = React.useCallback(
    (id: string) =>
      runMutation(() => deleteEventRecord(id), "Unable to delete the event"),
    [runMutation]
  )

  return {
    events,
    isLoading,
    error,
    isMutating,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh,
  }
}
