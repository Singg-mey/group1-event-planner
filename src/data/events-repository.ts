import type { Event } from "../../public/types"
import { notifyEventsChanged } from "@/data/events-changed"
import * as localEvents from "@/data/local-events-store"
import { getUserProfile } from "@/data/user"
import {
  applyValuesToSearchEvent,
  buildEventColumns,
  createSearchEventFromValues,
  type EventFormValues,
} from "@/lib/event-form"
import { formatEventDate, formatLocation } from "@/lib/event-format"
import { supabase } from "@/lib/supabase"
import type { SearchEvent } from "@/types/event"

/**
 * The only place that knows whether events live in Supabase or in
 * localStorage. Every screen goes through these five functions, so switching
 * data sources never reaches a component.
 */

const toSearchEvent = (event: Event): SearchEvent => ({
  id: event.id,
  title: event.title,
  description: event.description,
  category: event.category,
  shortCategory: event.category,
  date: formatEventDate(event.start_datetime),
  location: formatLocation(event.location),
  meetingLink:
    event.location.type === "online" ? event.location.meeting_link : undefined,
  capacity: `${event.capacity} attendees`,
  status: event.status === "completed" ? "CONCLUDED" : event.status,
  image: event.cover_image,
  tags: event.tags,
  startDatetime: event.start_datetime,
  endDatetime: event.end_datetime,
  visibility: event.visibility,
  organizerId: event.organizer_id,
  createdAt: event.created_at,
  updatedAt: event.updated_at,
})

const MISSING_EVENT_MESSAGE = "That event no longer exists, or it belongs to another organizer."

export type EventBackend = "auto" | "local"

let backendOverride: EventBackend = "auto"

/**
 * Test seam. `npm run test:crud` forces "local" so the suite exercises the
 * localStorage path and can never write to the real database, however
 * `.env.local` happens to be configured.
 */
export function setEventBackend(backend: EventBackend): void {
  backendOverride = backend
}

/** The client to use, or null to read and write the localStorage store. */
function activeClient() {
  return backendOverride === "local" ? null : supabase
}

/** Shared by every write path so a non-owner can never mutate the record. */
function assertCanManage(event: SearchEvent): void {
  if (!canManageEvent(event)) {
    throw new Error("You can only change events that you organize.")
  }
}

/**
 * The signed-in account's id. Creating an event without one would write a row
 * that nobody owns and that no ownership check could ever match, so the write
 * is refused instead. The UI routes are guarded too; this is the backstop for
 * anything that reaches the repository directly.
 */
function requireUserId(): string {
  const userId = getUserProfile().id
  if (!userId) {
    throw new Error("You need an account to create an event.")
  }
  return userId
}

/**
 * A real UUID, because `events.id` is a uuid column. Generating a text id like
 * "evt_a1b2c3d4" here is what produced
 * `22P02 invalid input syntax for type uuid` on every insert.
 */
const createEventId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  // v4-shaped fallback for environments without randomUUID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16)
    const value = char === "x" ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

export async function getEvents(): Promise<SearchEvent[]> {
  const client = activeClient()
  if (!client) {
    return localEvents.listLocalEvents()
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .order("start_datetime", { ascending: true })

  if (error) {
    throw error
  }

  return (data as Event[]).map(toSearchEvent)
}

export async function getEventById(id: string): Promise<SearchEvent | null> {
  const client = activeClient()
  if (!client) {
    return localEvents.findLocalEvent(id)
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ? toSearchEvent(data as Event) : null
}

export async function createEvent(
  values: EventFormValues
): Promise<SearchEvent> {
  const organizerId = requireUserId()
  const client = activeClient()

  if (!client) {
    const created = localEvents.insertLocalEvent(
      createSearchEventFromValues(values, {
        id: createEventId(),
        organizerId,
      })
    )
    notifyEventsChanged()
    return created
  }

  const now = new Date().toISOString()
  const { data, error } = await client
    .from("events")
    .insert({
      id: createEventId(),
      organizer_id: organizerId,
      created_at: now,
      updated_at: now,
      ...buildEventColumns(values),
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  notifyEventsChanged()
  return toSearchEvent(data as Event)
}

export async function updateEvent(
  id: string,
  values: EventFormValues
): Promise<SearchEvent> {
  const client = activeClient()

  if (!client) {
    const current = localEvents.findLocalEvent(id)
    if (!current) {
      throw new Error(MISSING_EVENT_MESSAGE)
    }
    assertCanManage(current)

    const updated = localEvents.patchLocalEvent(
      id,
      applyValuesToSearchEvent(current, values)
    )
    notifyEventsChanged()
    return updated
  }

  // Scoping the update to the organizer means a non-owner matches zero rows
  // instead of writing, which is what makes this check effective while the
  // table's RLS policies are still permissive.
  const { data, error } = await client
    .from("events")
    .update({
      ...buildEventColumns(values),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("organizer_id", getUserProfile().id)
    .select()
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error(MISSING_EVENT_MESSAGE)
  }

  notifyEventsChanged()
  return toSearchEvent(data as Event)
}

export async function deleteEvent(id: string): Promise<void> {
  const client = activeClient()

  if (!client) {
    const current = localEvents.findLocalEvent(id)
    if (!current) {
      throw new Error(MISSING_EVENT_MESSAGE)
    }
    assertCanManage(current)

    localEvents.removeLocalEvent(id)
    notifyEventsChanged()
    return
  }

  const { data, error } = await client
    .from("events")
    .delete()
    .eq("id", id)
    .eq("organizer_id", getUserProfile().id)
    .select("id")

  if (error) {
    throw error
  }

  // A delete that matched nothing means the row is gone or owned by someone
  // else. Reporting success either way would silently lie to the organizer.
  if (!data || data.length === 0) {
    throw new Error(MISSING_EVENT_MESSAGE)
  }

  notifyEventsChanged()
}

/**
 * Throws away local edits and restores the bundled fixtures. Only meaningful in
 * local mode; Supabase is the source of truth once it is configured.
 */
export async function resetEvents(): Promise<void> {
  if (activeClient()) {
    throw new Error("Demo data can only be reset in local mode.")
  }

  localEvents.resetLocalEvents()
  notifyEventsChanged()
}

/** Ownership check for the edit/delete affordances. */
export function canManageEvent(
  event: Pick<SearchEvent, "organizerId"> | null | undefined,
  organizerId: string = getUserProfile().id
): boolean {
  if (!event || !organizerId) return false
  return event.organizerId === organizerId
}
