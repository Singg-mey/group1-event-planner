export type EventCategory =
  | "music"
  | "tech"
  | "cultural and arts"
  | "nightlife"
  | "food and drink"
  | "community"

export type EventStatus = "draft" | "published" | "cancelled" | "completed"

export type EventVisibility = "public" | "private" | "invite-only"

export interface PhysicalLocation {
  type: "physical"
  address: string
  lat: number
  lng: number
}

export interface OnlineLocation {
  type: "online"
  meeting_link: string
}

export type EventLocation = PhysicalLocation | OnlineLocation

export interface Event {
  id: string
  organizer_id: string // FK to Users
  title: string
  description: string
  category: EventCategory
  tags: string[]
  start_datetime: string // ISO 8601
  end_datetime: string // ISO 8601
  timezone: string // IANA, e.g. "Asia/Phnom_Penh"
  location: EventLocation
  cover_image: string
  gallery_images: string[]
  status: EventStatus
  visibility: EventVisibility
  capacity: number // max attendees
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}


export interface NavBar {
  id: number
  name: string
}

export interface Footer {
  id: number,
  title: string,
  name : string[]
}