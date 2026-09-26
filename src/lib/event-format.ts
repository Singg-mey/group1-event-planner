export const DEFAULT_TIMEZONE = "Asia/Phnom_Penh"

/** Cambodia is UTC+7 with no daylight saving, so a fixed offset is safe here. */
export const DEFAULT_UTC_OFFSET = "+07:00"

/** Used when the organizer leaves the end time empty. */
export const DEFAULT_EVENT_DURATION_HOURS = 3

/**
 * Every datetime is written at this offset, so reads have to use it too.
 * Deriving the form values from the browser's local time made a no-op edit
 * shift an event by the viewer's UTC offset (7h in London, 12h in New York).
 */
const APP_OFFSET_MINUTES = 7 * 60

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: DEFAULT_TIMEZONE,
})

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: DEFAULT_TIMEZONE,
})

const pad = (value: number) => String(value).padStart(2, "0")

const toDate = (iso?: string): Date | null => {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Wall-clock fields of an instant as seen in the app's timezone. */
interface WallClock {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/**
 * Shifts by the fixed offset and reads the UTC getters, so the result never
 * depends on the host timezone or on Intl's locale data.
 */
const toWallClock = (date: Date): WallClock => {
  const shifted = new Date(date.getTime() + APP_OFFSET_MINUTES * 60 * 1000)

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  }
}

/** The same instant, re-expressed at the app's offset so stored values stay uniform. */
function toAppOffsetIso(date: Date): string {
  const { year, month, day, hour, minute, second } = toWallClock(date)

  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}${DEFAULT_UTC_OFFSET}`
}

export function formatEventDate(iso: string): string {
  const date = toDate(iso)
  if (!date) return ""
  return `${dateFormatter.format(date)} • ${timeFormatter.format(date)}`
}

export function formatLocation(location: {
  type: string
  address?: string
}): string {
  return location.type === "online" ? "Online" : (location.address ?? "")
}

/** "2026-10-10" for <input type="date">, or "" when the date is unknown. */
export function toDateInputValue(iso?: string): string {
  const date = toDate(iso)
  if (!date) return ""
  const { year, month, day } = toWallClock(date)
  return `${year}-${pad(month)}-${pad(day)}`
}

/** "19:00" for <input type="time">, or "" when the date is unknown. */
export function toTimeInputValue(iso?: string): string {
  const date = toDate(iso)
  if (!date) return ""
  const { hour, minute } = toWallClock(date)
  return `${pad(hour)}:${pad(minute)}`
}

/** Builds an ISO 8601 string pinned to the app's UTC offset. */
export function toIsoDateTime(
  date: string,
  time: string,
  offset: string = DEFAULT_UTC_OFFSET
): string {
  return `${date}T${time}:00${offset}`
}

export function addHours(iso: string, hours: number): string {
  const date = toDate(iso)
  if (!date) return iso
  return toAppOffsetIso(new Date(date.getTime() + hours * 60 * 60 * 1000))
}

/**
 * Sort key for start/end times. Compares parsed instants so records stay
 * correctly ordered even if one was written with a different UTC offset.
 */
export function toTimestamp(iso?: string): number {
  return toDate(iso)?.getTime() ?? 0
}
