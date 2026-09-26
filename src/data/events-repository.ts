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

const toSearchEvent = async (event: Event): Promise<SearchEvent> => {
  let image = event.cover_image
  const storagePrefix = "storage:event-covers/"

  if (supabase && image.startsWith(storagePrefix)) {
    const { data } = await supabase.storage
      .from("event-covers")
      .createSignedUrl(image.slice(storagePrefix.length), 3600)
    image = data?.signedUrl ?? ""
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    shortCategory: event.category,
    date: formatEventDate(event.start_datetime),
    location: formatLocation(event.location),
    capacity: `${event.capacity} attendees`,
    status: event.status === "completed" ? "CONCLUDED" : event.status,
    image,
    tags: event.tags,
  }
}

export interface NewEventInput {
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  visibility: "public" | "private"
  coverImage: File | null
}

const normalizeCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "music":
      return "music"
    case "food & drink":
      return "food and drink"
    case "tech":
      return "tech"
    case "arts & culture":
      return "cultural and arts"
    case "community":
      return "community"
    default:
      return category.toLowerCase()
  }
}

export async function createEvent(input: NewEventInput): Promise<SearchEvent> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. This event could not be saved."
    )
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!authData.user) throw new Error("Sign in to create an event.")

  const eventId = crypto.randomUUID()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  const startDate = new Date(`${input.date}T${input.time}:00`)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
  let storedCoverImage = `https://picsum.photos/seed/${eventId}/1200/600`
  let uploadedPath: string | undefined

  if (input.coverImage) {
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }
    const extension = extensionByType[input.coverImage.type]
    if (!extension) throw new Error("Choose a JPG, PNG, or WEBP cover image.")
    if (input.coverImage.size > 5 * 1024 * 1024) {
      throw new Error("Cover images must be 5MB or smaller.")
    }

    uploadedPath = `${authData.user.id}/${eventId}.${extension}`
    const { error: uploadError } = await supabase.storage
      .from("event-covers")
      .upload(uploadedPath, input.coverImage, {
        contentType: input.coverImage.type,
        upsert: false,
      })
    if (uploadError) throw uploadError
    storedCoverImage = `storage:event-covers/${uploadedPath}`
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      id: eventId,
      organizer_id: authData.user.id,
      title: input.title.trim(),
      description: input.description.trim(),
      category: normalizeCategory(input.category),
      tags: [],
      start_datetime: startDate.toISOString(),
      end_datetime: endDate.toISOString(),
      timezone,
      location: { type: "physical", address: input.location.trim() },
      cover_image: storedCoverImage,
      gallery_images: [],
      status: "published",
      visibility: input.visibility,
      capacity: 100,
    })
    .select("*")
    .single()

  if (error) {
    if (uploadedPath) {
      await supabase.storage.from("event-covers").remove([uploadedPath])
    }
    throw error
  }

  return toSearchEvent(data as Event)
}

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

  return Promise.all((data as EventRow[]).map(toSearchEvent))
}
