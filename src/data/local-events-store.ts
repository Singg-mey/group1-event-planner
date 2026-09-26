import { ALL_EVENTS } from "@/data/events"
import { toTimestamp } from "@/lib/event-format"
import type { SearchEvent } from "@/types/event"

/**
 * localStorage-backed store used whenever Supabase is not configured. It is
 * seeded from the fixtures in src/data/events.ts on first read, so the app has
 * something to show before any write happens.
 */
const STORAGE_KEY = "eventplanner_events"

const seed = (): SearchEvent[] => [...ALL_EVENTS]

/**
 * Guards every field the UI reads without a fallback. A bare `Array.isArray`
 * check let a payload written by an older shape through, which then threw on
 * `event.tags.join(", ")` and took the edit page down with it.
 */
const isSearchEvent = (value: unknown): value is SearchEvent => {
  if (typeof value !== "object" || value === null) return false

  const event = value as Partial<SearchEvent>
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.description === "string" &&
    typeof event.category === "string" &&
    typeof event.shortCategory === "string" &&
    typeof event.date === "string" &&
    typeof event.location === "string" &&
    typeof event.capacity === "string" &&
    typeof event.status === "string" &&
    typeof event.image === "string" &&
    Array.isArray(event.tags)
  )
}

const isSearchEventArray = (value: unknown): value is SearchEvent[] =>
  Array.isArray(value) && value.every(isSearchEvent)

/**
 * Sorted by start time so the list matches the `order("start_datetime")` the
 * Supabase path applies. Otherwise a newly created far-future event jumped to
 * the top of the grid in local mode only. Records with no start time (the
 * bundled past events) go last, which is Postgres' NULLS LAST default for an
 * ascending sort.
 */
const byStartTime = (a: SearchEvent, b: SearchEvent): number => {
  const left = a.startDatetime ? toTimestamp(a.startDatetime) : null
  const right = b.startDatetime ? toTimestamp(b.startDatetime) : null

  if (left === null && right === null) return 0
  if (left === null) return 1
  if (right === null) return -1
  return left - right
}

export function listLocalEvents(): SearchEvent[] {
  if (typeof window === "undefined") return seed().sort(byStartTime)

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed().sort(byStartTime)

    const parsed: unknown = JSON.parse(raw)
    return isSearchEventArray(parsed) ? [...parsed].sort(byStartTime) : seed().sort(byStartTime)
  } catch {
    return seed().sort(byStartTime)
  }
}

export function findLocalEvent(id: string): SearchEvent | null {
  return listLocalEvents().find((event) => event.id === id) ?? null
}

function writeStore(events: SearchEvent[]): SearchEvent[] {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {
      // Storage unavailable or over quota: the caller still gets the result.
    }
  }
  return events
}

export function insertLocalEvent(event: SearchEvent): SearchEvent {
  const events = listLocalEvents()
  writeStore([event, ...events])
  return event
}

export function patchLocalEvent(
  id: string,
  changes: Partial<SearchEvent>
): SearchEvent {
  const events = listLocalEvents()
  const index = events.findIndex((event) => event.id === id)

  if (index === -1) {
    throw new Error("That event no longer exists.")
  }

  const updated: SearchEvent = { ...events[index], ...changes }
  const next = [...events]
  next[index] = updated
  writeStore(next)
  return updated
}

export function removeLocalEvent(id: string): void {
  const events = listLocalEvents()
  const next = events.filter((event) => event.id !== id)

  if (next.length === events.length) {
    throw new Error("That event no longer exists.")
  }

  writeStore(next)
}

/** Throws away local edits and restores the bundled fixtures. */
export function resetLocalEvents(): SearchEvent[] {
  return writeStore(seed())
}
