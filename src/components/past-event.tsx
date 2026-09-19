/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import { cn } from "cn"

/**
 * Interface representing a past event data model
 */
export interface PastEvent {
  id: string
  title: string
  description: string
  /** Formatted location string or venue (e.g., "Chaktomuk Theatre • Phnom Penh") */
  location?: string
  /** Specific venue name (e.g., "Chaktomuk Theatre") */
  venue?: string
  /** City or province (e.g., "Phnom Penh", "Siem Reap", "Kampot") */
  city?: string
  /** Event date string (e.g., "Dec 12 - 16, 2024") */
  date: string
  /** Image URL for event highlight/cover */
  imageUrl?: string
  /** Status tag text (defaults to "CONCLUDED") */
  status?: string
  /** Average rating score (e.g., 4.9) */
  rating?: number
  /** Number of community reviews (e.g., 320) */
  reviewCount?: number
  /** Highlight statistic badge (e.g., "1,850+ Attended", "2,400+ Runners", "Sold Out (1,100)") */
  attendeeBadge?: string
  /** Link or target URL to view recap */
  recapUrl?: string
  /** Optional category */
  category?: string
}

/**
 * Props for PastEventCard component
 */
export interface PastEventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Past event object containing all event details */
  event?: PastEvent
  /** Individual fallback props if not passing an event object directly */
  id?: string
  title?: string
  description?: string
  location?: string
  venue?: string
  city?: string
  date?: string
  imageUrl?: string
  status?: string
  rating?: number
  reviewCount?: number
  attendeeBadge?: string
  recapUrl?: string
  /** Callback triggered when clicking "View Recap" */
  onViewRecap?: (event: PastEvent) => void
}

/**
 * Past Event Card component styled with Shadcn UI components.
 * Renders a concluded event card featuring cover image, badges, ratings, venue, description, and recap CTA.
 */
export function PastEventCard({
  event,
  id,
  title,
  description,
  location,
  venue,
  city,
  date,
  imageUrl,
  status,
  rating,
  reviewCount,
  attendeeBadge,
  recapUrl,
  onViewRecap,
  className,
  ...props
}: PastEventCardProps) {
  // Consolidate data from event prop or direct props
  const displayId = event?.id ?? id ?? "past-evt"
  const displayTitle = event?.title ?? title ?? "Untitled Event"
  const displayDescription = event?.description ?? description ?? ""
  const displayDate = event?.date ?? date ?? ""
  const displayImageUrl =
    event?.imageUrl ??
    imageUrl ??
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80"
  const displayStatus = event?.status ?? status ?? "CONCLUDED"
  const displayRating = event?.rating ?? rating
  const displayReviewCount = event?.reviewCount ?? reviewCount
  const displayAttendeeBadge =
    event?.attendeeBadge ?? attendeeBadge ?? "Concluded"
  const displayRecapUrl = event?.recapUrl ?? recapUrl

  // Format venue and city into "Venue • City"
  const displayLocation =
    event?.location ??
    location ??
    (venue && city ? `${venue} • ${city}` : venue || city || "")

  const eventObject: PastEvent = event ?? {
    id: displayId,
    title: displayTitle,
    description: displayDescription,
    location: displayLocation,
    date: displayDate,
    imageUrl: displayImageUrl,
    status: displayStatus,
    rating: displayRating,
    reviewCount: displayReviewCount,
    attendeeBadge: displayAttendeeBadge,
    recapUrl: displayRecapUrl,
  }

  const handleRecapClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewRecap?.(eventObject)
  }

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
      {...props}
    >
      {/* Cover Image & Overlay Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={displayImageUrl}
          alt={displayTitle}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient subtle vignette gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />

        {/* Top Badges (Concluded + Reviews) */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {displayStatus && (
            <Badge
              variant="secondary"
              className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase shadow-xs backdrop-blur-md dark:bg-white/85 dark:text-slate-950"
            >
              {displayStatus}
            </Badge>
          )}

          {displayRating !== undefined && (
            <Badge
              variant="default"
              className="rounded-full border border-white/15 bg-slate-950/80 px-2.5 py-0.5 text-[11px] font-medium text-white shadow-xs backdrop-blur-md"
            >
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span>
                {displayRating.toFixed(1)}
                {displayReviewCount ? ` (${displayReviewCount} reviews)` : ""}
              </span>
            </Badge>
          )}
        </div>

        {/* Bottom Date Overlay */}
        {displayDate && (
          <div className="absolute bottom-3 left-3 text-xs font-medium text-white/95 drop-shadow-xs">
            {displayDate}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <CardHeader className="space-y-1.5 p-5 pb-2">
        {displayLocation && (
          <p className="text-xs font-semibold tracking-wide text-teal-600 dark:text-teal-400">
            {displayLocation}
          </p>
        )}
        <CardTitle className="line-clamp-2 text-base leading-snug font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {displayTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-5 py-0">
        <CardDescription className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {displayDescription}
        </CardDescription>
      </CardContent>

      {/* Card Footer: Attendee badge + View Recap action */}
      <CardFooter className="mt-4 flex items-center justify-between border-t border-border/40 p-4 px-5">
        {displayAttendeeBadge && (
          <Badge
            variant="outline"
            className="rounded-full border-teal-500/25 bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-500/15 dark:text-teal-300"
          >
            {displayAttendeeBadge}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRecapClick}
          className="group/btn h-8 gap-1 px-2 text-xs font-semibold text-teal-600 hover:bg-teal-500/10 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          <span>View Recap</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

/**
 * Sample past events in Cambodia, matching the mock design reference
 */
export const SAMPLE_PAST_EVENTS: PastEvent[] = [
  {
    id: "past-evt-001",
    title: "Phnom Penh International Film Festival 2024",
    description:
      "1,850+ cinephiles joined 48 regional indie film debuts, panel talks, and director retrospectives.",
    location: "Chaktomuk Theatre • Phnom Penh",
    venue: "Chaktomuk Theatre",
    city: "Phnom Penh",
    date: "Dec 12 – 16, 2024",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    status: "CONCLUDED",
    rating: 4.9,
    reviewCount: 320,
    attendeeBadge: "1,850+ Attended",
    category: "Cultural and Arts",
  },
  {
    id: "past-evt-002",
    title: "Angkor Ultra Trail Cultural Run 2025",
    description:
      "International endurance runners crossed ancient Khmer trails at dawn with proceeds funding heritage preservation.",
    location: "Angkor Archaeological Park • Siem Reap",
    venue: "Angkor Archaeological Park",
    city: "Siem Reap",
    date: "Jan 25, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80",
    status: "CONCLUDED",
    rating: 5.0,
    reviewCount: 540,
    attendeeBadge: "2,400+ Runners",
    category: "Sports & Community",
  },
  {
    id: "past-evt-003",
    title: "Bassac Street Jazz & Groove Fest",
    description:
      "12 stages tucked along Bassac alleys celebrating Southeast Asian brass, funk, and Cambodian classical fusion.",
    location: "Bassac Lane • Phnom Penh",
    venue: "Bassac Lane",
    city: "Phnom Penh",
    date: "Nov 08 – 10, 2024",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    status: "CONCLUDED",
    rating: 4.8,
    reviewCount: 210,
    attendeeBadge: "Sold Out (1,100)",
    category: "Music",
  },
  {

    id: "past-evt-0045",
    title: "Kampot Writers & Music Gathering",
    description:
      "Intimate spoken word poetry, river acoustic jam circles, and literary book stalls along the Tuek Chhu river.",
    location: "Old French Quarter • Kampot",
    venue: "Old French Quarter",
    city: "Kampot",
    date: "Feb 14 – 16, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    status: "CONCLUDED",
    rating: 4.9,
    reviewCount: 185,
    attendeeBadge: "620+ Attended",
    category: "Cultural and Arts",
  },
]

/**
 * Props for PastEventsSection component
 */
export interface PastEventsSectionProps {
  events?: PastEvent[]
  title?: string
  subtitle?: string
  exploreButtonText?: string
  onExploreAll?: () => void
  onViewRecap?: (event: PastEvent) => void
  className?: string
}

/**
 * Complete "Past Events in Cambodia & Highlights" section component
 * matching the provided UI layout with section title, recap CTA button, and responsive grid.
 */
export function PastEventsSection({
  events = SAMPLE_PAST_EVENTS,
  title = "Past Events in Cambodia & Highlights",
  subtitle = "Relive memorable festivals, international summits, and cultural runs.",
  exploreButtonText = "Explore All Past Recaps (850+) →",
  onExploreAll,
  onViewRecap,
  className,
}: PastEventsSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onExploreAll}
          className="w-fit rounded-full border-border/80 px-4 py-2 text-xs font-semibold hover:border-primary/50 hover:bg-muted/50"
        >
          {exploreButtonText}
        </Button>
      </div>

      {/* Grid of Past Event Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => (
          <PastEventCard
            key={event.id}
            event={event}
            onViewRecap={onViewRecap}
          />
        ))}
      </div>
    </section>
  )
}

export default PastEventCard
