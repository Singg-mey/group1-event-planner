import type { Event } from "../../public/types"
import { ALL_EVENTS } from "@/data/events"
import type { SearchEvent } from "@/types/event"
import { supabase } from "@/lib/supabase"

type EventRow = Event

const formatEventDate = (startDatetime: string) => {
  const date = new Date(startDatetime)
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)

  return `${datePart} • ${timePart}`
}

const formatLocation = (location: Event["location"]) =>
  location.type === "online" ? "Online" : location.address

const toSearchEvent = (event: Event): SearchEvent => ({
  id: event.id,
  title: event.title,
  description: event.description,
  category: event.category,
  shortCategory: event.category,
  date: formatEventDate(event.start_datetime),
  location: formatLocation(event.location),
  capacity: `${event.capacity} attendees`,
  status: event.status === "completed" ? "CONCLUDED" : event.status,
  image: event.cover_image,
  tags: event.tags,
})

export async function getEvents(): Promise<SearchEvent[]> {
  if (!supabase) {
    return ALL_EVENTS
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_datetime", { ascending: true })

  if (error) {
    throw error
  }

  return (data as EventRow[]).map(toSearchEvent)
}
