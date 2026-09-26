import type { Event, Footer, NavBar } from "./types"

export const events: Event[] = [
  {
    id: "evt_001",
    organizer_id: "usr_001",
    title: "Phnom Penh Jazz Night",
    description:
      "An evening of live jazz featuring local and international artists.",
    category: "music",
    tags: ["jazz", "live-music", "concert"],
    start_datetime: "2026-10-10T19:00:00+07:00",
    end_datetime: "2026-10-10T23:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "physical",
      address: "Street 240, Daun Penh, Phnom Penh",
      lat: 11.5625,
      lng: 104.9282,
    },
    cover_image: "https://picsum.photos/seed/jazz/1200/600",
    gallery_images: [
      "https://picsum.photos/seed/jazz-1/800/600",
      "https://picsum.photos/seed/jazz-2/800/600",
    ],
    status: "published",
    visibility: "public",
    capacity: 200,
    created_at: "2026-09-01T09:00:00Z",
    updated_at: "2026-09-10T12:30:00Z",
  },
  {
    id: "evt_002",
    organizer_id: "usr_002",
    title: "Frontend Dev Meetup",
    description:
      "Monthly online meetup for frontend developers to share talks and demos.",
    category: "tech",
    tags: ["react", "typescript", "meetup"],
    start_datetime: "2026-10-15T18:30:00+07:00",
    end_datetime: "2026-10-15T21:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "online",
      meeting_link: "https://meet.google.com/abc-defg-hij",
    },
    cover_image: "https://picsum.photos/seed/meetup/1200/600",
    gallery_images: [],
    status: "published",
    visibility: "invite-only",
    capacity: 100,
    created_at: "2026-09-05T08:15:00Z",
    updated_at: "2026-09-05T08:15:00Z",
  },
  {
    id: "evt_003",
    organizer_id: "usr_003",
    title: "Khmer Classical Dance Showcase",
    description:
      "A performance of traditional Apsara dance followed by a gallery walk of local artists.",
    category: "cultural and arts",
    tags: ["dance", "apsara", "art-exhibition"],
    start_datetime: "2026-10-24T17:00:00+07:00",
    end_datetime: "2026-10-24T20:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "physical",
      address: "Chaktomuk Theatre, Sisowath Quay, Phnom Penh",
      lat: 11.5732,
      lng: 104.9321,
    },
    cover_image: "https://picsum.photos/seed/apsara/1200/600",
    gallery_images: [
      "https://picsum.photos/seed/apsara-1/800/600",
      "https://picsum.photos/seed/apsara-2/800/600",
      "https://picsum.photos/seed/apsara-3/800/600",
    ],
    status: "published",
    visibility: "public",
    capacity: 300,
    created_at: "2026-09-08T11:00:00Z",
    updated_at: "2026-09-12T09:20:00Z",
  },
  {
    id: "evt_004",
    organizer_id: "usr_001",
    title: "Rooftop DJ Sessions",
    description:
      "Sunset-to-midnight DJ sets with city views and a curated cocktail menu.",
    category: "nightlife",
    tags: ["dj", "rooftop", "party"],
    start_datetime: "2026-11-07T18:00:00+07:00",
    end_datetime: "2026-11-08T00:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "physical",
      address: "Street 51, BKK1, Phnom Penh",
      lat: 11.5541,
      lng: 104.9215,
    },
    cover_image: "https://picsum.photos/seed/rooftop/1200/600",
    gallery_images: ["https://picsum.photos/seed/rooftop-1/800/600"],
    status: "draft",
    visibility: "private",
    capacity: 150,
    created_at: "2026-09-15T10:00:00Z",
    updated_at: "2026-09-18T16:45:00Z",
  },
  {
    id: "evt_005",
    organizer_id: "usr_004",
    title: "Street Food Festival",
    description:
      "Taste dishes from over 30 local vendors, with cooking demos and live music.",
    category: "food and drink",
    tags: ["street-food", "festival", "local-cuisine"],
    start_datetime: "2026-11-14T16:00:00+07:00",
    end_datetime: "2026-11-14T22:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "physical",
      address: "Koh Pich (Diamond Island), Phnom Penh",
      lat: 11.5488,
      lng: 104.9391,
    },
    cover_image: "https://picsum.photos/seed/streetfood/1200/600",
    gallery_images: [
      "https://picsum.photos/seed/streetfood-1/800/600",
      "https://picsum.photos/seed/streetfood-2/800/600",
    ],
    status: "cancelled",
    visibility: "public",
    capacity: 1000,
    created_at: "2026-08-20T07:30:00Z",
    updated_at: "2026-09-17T14:00:00Z",
  },
  {
    id: "evt_006",
    organizer_id: "usr_005",
    title: "Riverside Clean-Up Day",
    description:
      "Join neighbours to clean up the riverside, with breakfast provided for volunteers.",
    category: "community",
    tags: ["volunteering", "environment", "outdoor"],
    start_datetime: "2026-08-30T06:30:00+07:00",
    end_datetime: "2026-08-30T10:00:00+07:00",
    timezone: "Asia/Phnom_Penh",
    location: {
      type: "physical",
      address: "Sisowath Quay, Phnom Penh",
      lat: 11.5696,
      lng: 104.9318,
    },
    cover_image: "https://picsum.photos/seed/cleanup/1200/600",
    gallery_images: [
      "https://picsum.photos/seed/cleanup-1/800/600",
      "https://picsum.photos/seed/cleanup-2/800/600",
    ],
    status: "completed",
    visibility: "public",
    capacity: 80,
    created_at: "2026-08-01T08:00:00Z",
    updated_at: "2026-08-31T09:00:00Z",
  },
]


export const Navigation: NavBar[] = [
  {
    id: 1,
    name: "Home"
  },
  {
    id: 2,
    name: "Create Event"
  },
  {
    id: 3,
    name: "Find Event"
  },
  {
    id: 4,
    name: "About"
  }
]

export const FooterApp: Footer[] = [
  {
    id: 1,
    title: "Discovery",
    name: ['Ai event', 'Phnom Penh Tech', 'Siem reap workshop', 'Community Arts & Culture']
  },
  {
    id: 2,
    title: "Organizer",
    name: ['Host an event', 'Organizer Dashboard', 'Community Guidelines', 'Planning Resources']
  },
  {
    id: 3,
    title: "About & Trust",
    name: ['Ai event', 'Phnom Penh Tech', 'Siem reap workshop', 'Community Arts & Culture']
  }
]