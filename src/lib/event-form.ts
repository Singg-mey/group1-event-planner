import {
  DEFAULT_EVENT_CATEGORY,
  EVENT_CATEGORY_OPTIONS,
  getCategoryLabel,
} from "@/data/event-categories"
import {
  addHours,
  DEFAULT_EVENT_DURATION_HOURS,
  DEFAULT_TIMEZONE,
  formatEventDate,
  formatLocation,
  toDateInputValue,
  toIsoDateTime,
  toTimeInputValue,
} from "@/lib/event-format"
import type { EventCategory, EventStatus, EventVisibility } from "@/types/event"
import type { SearchEvent } from "@/types/event"
import type { EventLocation } from "../../public/types"

export type LocationType = "physical" | "online"

/** Everything the create/edit form collects. All fields are strings on purpose:
 *  native date/time inputs and controlled React inputs both work with strings. */
export interface EventFormValues {
  title: string
  description: string
  category: EventCategory
  tags: string
  date: string
  startTime: string
  endTime: string
  locationType: LocationType
  address: string
  meetingLink: string
  capacity: string
  coverImage: string
  status: EventStatus
  visibility: EventVisibility
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>

export const EMPTY_EVENT_FORM: EventFormValues = {
  title: "",
  description: "",
  category: DEFAULT_EVENT_CATEGORY,
  tags: "",
  date: "",
  startTime: "",
  endTime: "",
  locationType: "physical",
  address: "",
  meetingLink: "",
  capacity: "100",
  coverImage: "",
  status: "draft",
  visibility: "public",
}

export const DEFAULT_COVER_IMAGE = "https://picsum.photos/seed/event/1200/600"

const URL_PATTERN = /^https?:\/\/\S+$/i

export function hasFormErrors(errors: EventFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}

export function parseTags(tags: string): string[] {
  const parsed = tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)

  // De-duplicated so tags always render with unique React keys.
  return [...new Set(parsed)]
}

/** "200 attendees" -> "200" so the capacity input can be edited. */
export function parseCapacity(capacity: string): string {
  const digits = capacity.replace(/[^\d]/g, "")
  return digits
}

/** Accepts either a stored category value ("music") or a display label. */
export function toEventCategory(...candidates: string[]): EventCategory {
  for (const candidate of candidates) {
    const value = candidate.toLowerCase().trim()
    const match = EVENT_CATEGORY_OPTIONS.find(
      (option) =>
        option.value === value || option.label.toLowerCase() === value
    )
    if (match) return match.value
  }
  return DEFAULT_EVENT_CATEGORY
}

/** "CONCLUDED" is the display form the fixtures use for the completed status. */
export function toEventStatus(status: string): EventStatus {
  const value = status.toLowerCase()
  if (value === "concluded" || value === "completed") return "completed"
  if (value === "published") return "published"
  if (value === "cancelled") return "cancelled"
  return "draft"
}

export function toEventVisibility(
  visibility?: EventVisibility
): EventVisibility {
  if (visibility === "private" || visibility === "invite-only") {
    return visibility
  }
  return "public"
}

export function isConcludedEvent(event: Pick<SearchEvent, "status">): boolean {
  return toEventStatus(event.status) === "completed"
}

/** Projects a stored event back into form values, for editing. */
export function toEventFormValues(event: SearchEvent): EventFormValues {
  const isOnline = event.location.trim().toLowerCase() === "online"

  return {
    title: event.title,
    description: event.description,
    category: toEventCategory(event.shortCategory, event.category),
    tags: event.tags.join(", "),
    date: toDateInputValue(event.startDatetime),
    startTime: toTimeInputValue(event.startDatetime),
    endTime: toTimeInputValue(event.endDatetime),
    locationType: isOnline ? "online" : "physical",
    address: isOnline ? "" : event.location,
    meetingLink: event.meetingLink ?? "",
    capacity: parseCapacity(event.capacity),
    coverImage: event.image.startsWith("http") ? event.image : "",
    status: toEventStatus(event.status),
    visibility: toEventVisibility(event.visibility),
  }
}

export function validateEventForm(values: EventFormValues): EventFormErrors {
  const errors: EventFormErrors = {}

  if (values.title.trim().length < 3) {
    errors.title = "Event name must be at least 3 characters."
  }

  if (values.description.trim().length < 10) {
    errors.description = "Add a description of at least 10 characters."
  }

  if (!values.date) {
    errors.date = "Pick a date."
  }

  if (!values.startTime) {
    errors.startTime = "Pick a start time."
  }

  if (values.endTime && values.startTime && values.endTime <= values.startTime) {
    errors.endTime = "End time must be after the start time."
  }

  if (values.locationType === "physical" && !values.address.trim()) {
    errors.address = "Add a venue or address."
  }

  if (values.locationType === "online") {
    if (!values.meetingLink.trim()) {
      errors.meetingLink = "Add a meeting link."
    } else if (!URL_PATTERN.test(values.meetingLink.trim())) {
      errors.meetingLink = "The link must start with http:// or https://"
    }
  }

  const capacity = Number(values.capacity)
  if (
    values.capacity.trim() === "" ||
    Number.isNaN(capacity) ||
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    errors.capacity = "Capacity must be a whole number of at least 1."
  }

  if (values.coverImage.trim() && !URL_PATTERN.test(values.coverImage.trim())) {
    errors.coverImage = "Use a URL starting with http:// or https://"
  }

  return errors
}

export function buildEventLocation(values: EventFormValues): EventLocation {
  if (values.locationType === "online") {
    return { type: "online", meeting_link: values.meetingLink.trim() }
  }

  return {
    type: "physical",
    address: values.address.trim(),
    lat: 0,
    lng: 0,
  }
}

export function buildEventDates(values: EventFormValues): {
  startDatetime: string
  endDatetime: string
} {
  const startDatetime = toIsoDateTime(values.date, values.startTime)
  const endDatetime = values.endTime
    ? toIsoDateTime(values.date, values.endTime)
    : addHours(startDatetime, DEFAULT_EVENT_DURATION_HOURS)

  return { startDatetime, endDatetime }
}

/** The mutable columns of an `events` row, shared by the create and update paths. */
export function buildEventColumns(values: EventFormValues) {
  const { startDatetime, endDatetime } = buildEventDates(values)

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    tags: parseTags(values.tags),
    start_datetime: startDatetime,
    end_datetime: endDatetime,
    // The events table declares `timezone` as NOT NULL with no default, so
    // every write has to supply it or Postgres rejects the whole row.
    timezone: DEFAULT_TIMEZONE,
    location: buildEventLocation(values),
    cover_image: values.coverImage.trim() || DEFAULT_COVER_IMAGE,
    status: values.status,
    visibility: values.visibility,
    capacity: Number(values.capacity),
  }
}

/** Builds a brand new local-mode record from submitted form values. */
export function createSearchEventFromValues(
  values: EventFormValues,
  meta: { id: string; organizerId: string; createdAt?: string }
): SearchEvent {
  const { startDatetime, endDatetime } = buildEventDates(values)
  const createdAt = meta.createdAt ?? new Date().toISOString()

  return {
    id: meta.id,
    title: values.title.trim(),
    description: values.description.trim(),
    category: getCategoryLabel(values.category),
    shortCategory: values.category,
    date: formatEventDate(startDatetime),
    location: formatLocation(buildEventLocation(values)),
    meetingLink:
      values.locationType === "online" ? values.meetingLink.trim() : undefined,
    capacity: `${Number(values.capacity)} attendees`,
    status: values.status,
    image: values.coverImage.trim() || DEFAULT_COVER_IMAGE,
    tags: parseTags(values.tags),
    startDatetime,
    endDatetime,
    visibility: values.visibility,
    organizerId: meta.organizerId,
    createdAt,
    updatedAt: createdAt,
  }
}

/** Applies submitted form values onto an existing record, keeping its identity. */
export function applyValuesToSearchEvent(
  event: SearchEvent,
  values: EventFormValues
): SearchEvent {
  const updated = createSearchEventFromValues(values, {
    id: event.id,
    organizerId: event.organizerId ?? "",
    createdAt: event.createdAt,
  })

  return {
    ...event,
    ...updated,
    // Ratings belong to concluded events and are not editable in this form.
    rating: event.rating,
    reviewCount: event.reviewCount,
    updatedAt: new Date().toISOString(),
  }
}
