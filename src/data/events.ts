import { SAMPLE_PAST_EVENTS } from "@/components/past-event"
import type { SearchEvent } from "@/types/event"

export const FEATURED_EVENTS: SearchEvent[] = [
  {
    id: "evt_001",
    title: "Phnom Penh Jazz Night",
    description:
      "An evening of live jazz featuring local and international artists with crafted cocktails.",
    category: "Music & Concerts",
    shortCategory: "music",
    date: "Oct 10, 2026 • 7:00 PM",
    location: "Street 240, Daun Penh",
    capacity: "200 attendees",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80",
    tags: ["Jazz", "Live", "Nightlife"],
  },
  {
    id: "evt_002",
    title: "Street Food & Craft Beer Festival",
    description:
      "Taste signature dishes from 30+ local food artisans, craft brew masters, and enjoy live acoustic tunes.",
    category: "Food & Drink",
    shortCategory: "food and drink",
    date: "Oct 12, 2026 • 4:00 PM",
    location: "Koh Pich (Diamond Island), Phnom Penh",
    capacity: "800 attendees",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    tags: ["Street Food", "Craft Beer", "Pop-up"],
  },
  {
    id: "evt_003",
    title: "Frontend & AI Dev Meetup 2026",
    description:
      "Monthly tech gathering for React, TypeScript, AI agents, and modern web developers to share live demos.",
    category: "Tech & Startups",
    shortCategory: "tech",
    date: "Oct 15, 2026 • 6:30 PM",
    location: "Online & Raintree Cambodia",
    capacity: "150 attendees",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    tags: ["React 19", "Tailwind", "AI & ML"],
  },
  {
    id: "evt_004",
    title: "Khmer Classical Dance & Arts",
    description:
      "Traditional Apsara dance performance followed by a curated local arts gallery showcase and artisan bazaar.",
    category: "Cultural & Arts",
    shortCategory: "cultural and arts",
    date: "Oct 24, 2026 • 5:00 PM",
    location: "Chaktomuk Theatre, Sisowath Quay",
    capacity: "300 attendees",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&auto=format&fit=crop&q=80",
    tags: ["Apsara", "Culture", "Theatre"],
  },
]

// Upcoming + past events in one shape, shared by Find Events and the detail page
export const ALL_EVENTS: SearchEvent[] = [
  ...FEATURED_EVENTS,
  ...SAMPLE_PAST_EVENTS.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category ?? "",
    shortCategory: event.category ?? "",
    date: event.date,
    location: event.location ?? "",
    capacity: event.attendeeBadge ?? "",
    status: event.status ?? "CONCLUDED",
    image: event.imageUrl ?? "",
    tags: [],
    rating: event.rating,
    reviewCount: event.reviewCount,
  })),
]
