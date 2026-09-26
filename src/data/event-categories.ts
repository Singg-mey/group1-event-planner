import type {
  EventCategory,
  EventStatus,
  EventVisibility,
} from "../../public/types"

export interface EventCategoryOption {
  value: EventCategory
  label: string
}

/**
 * Single source of truth for the category list. The navbar's marketing cards
 * (components/navbar/data.ts) are a different concern, so they keep their own
 * `EVENT_CATEGORIES` constant.
 */
export const EVENT_CATEGORY_OPTIONS: EventCategoryOption[] = [
  { value: "music", label: "Music & Concerts" },
  { value: "food and drink", label: "Food & Drink" },
  { value: "tech", label: "Tech & Startups" },
  { value: "cultural and arts", label: "Cultural & Arts" },
  { value: "nightlife", label: "Nightlife & Rooftop" },
  { value: "community", label: "Community" },
]

export const DEFAULT_EVENT_CATEGORY: EventCategory = "music"

export const EVENT_STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
]

export const EVENT_VISIBILITY_OPTIONS: {
  value: EventVisibility
  label: string
  hint: string
}[] = [
  { value: "public", label: "Public", hint: "Anyone can find and join" },
  { value: "private", label: "Private", hint: "Only people with the link" },
  { value: "invite-only", label: "Invite only", hint: "Approved guests only" },
]

export function getCategoryLabel(category: EventCategory): string {
  return (
    EVENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
    category
  )
}
