import type {
  EventCategory,
  EventStatus,
  EventVisibility,
} from "../../public/types"

/**
 * Read model shared by every event surface (home grid, Find Events, event
 * detail, My Events). It is a flattened, display-ready projection of the
 * `Event` row declared in public/types.ts.
 */
export interface SearchEvent {
  id: string
  title: string
  description: string
  category: string
  shortCategory: string
  /** Pre-formatted for display, e.g. "Oct 10, 2026 • 7:00 PM". */
  date: string
  location: string
  capacity: string
  status: string
  image: string
  tags: string[]
  rating?: number
  reviewCount?: number
  /**
   * The real join URL for online events. `location` only holds the display
   * string ("Online"), so the link is kept separately to avoid losing it when
   * an online event is edited.
   */
  meetingLink?: string
  /** ISO 8601 start. Set on every record created or edited through the form. */
  startDatetime?: string
  /** ISO 8601 end. Set on every record created or edited through the form. */
  endDatetime?: string
  visibility?: EventVisibility
  /** Mirrors `organizer_id`; decides who may edit or delete a record. */
  organizerId?: string
  createdAt?: string
  updatedAt?: string
}

export type { EventCategory, EventStatus, EventVisibility }
