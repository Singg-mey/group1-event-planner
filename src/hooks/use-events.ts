import * as React from "react"

import { getEvents } from "@/data/events-repository"
import type { SearchEvent } from "@/types/event"

export function useEvents() {
  const [events, setEvents] = React.useState<SearchEvent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    let isActive = true

    getEvents()
      .then((nextEvents) => {
        if (isActive) {
          setEvents(nextEvents)
        }
      })
      .catch((nextError: unknown) => {
        if (isActive) {
          setError(
            nextError instanceof Error
              ? nextError
              : new Error("Unable to load events")
          )
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return { events, isLoading, error }
}
