import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Check,
} from "lucide-react"

// --- Custom SVGs replicating user's category icons with crisp pixel-perfection ---

/** Music & Concerts: Double beamed eighth notes */
export function MusicConcertsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      <path d="M22 47a7 7 0 1 1-7-7c1.1 0 2.1.25 3 .7V17c0-1.66 1.34-3 3-3h25c1.66 0 3 1.34 3 3v20a7 7 0 1 1-7-7c1.1 0 2.1.25 3 .7V21.5L24 25.5V47.5c0 .01-.01.02-.01.03a6.97 6.97 0 0 1-1.99-.53z" />
    </svg>
  )
}

/** Food & Drink: Wine glass on left, Dinner fork on right */
export function FoodDrinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      {/* Wine Glass */}
      <path d="M14 13h14c0 7-3.5 12.5-7 14.5V40h6a2.5 2.5 0 1 1 0 5H11a2.5 2.5 0 1 1 0-5h6V27.5c-3.5-2-7-7.5-7-14.5h4z" />
      {/* Fork */}
      <path d="M42 13h3v11c0 2.2 1.3 4 3.5 4s3.5-1.8 3.5-4V13h3v11c0 4.2-2.8 7.5-6.5 8.2V51a2.5 2.5 0 1 1-5 0V32.2c-3.7-.7-6.5-4-6.5-8.2V13h3v9h2v-9h2v9h2v-9z" />
    </svg>
  )
}

/** Tech & Startups: 6-lobed geometric rosette / atom loops */
export function TechStartupsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="8" fill="none" strokeWidth="3.5" />
      {/* 6 interconnected symmetric loop petals */}
      <path d="M32 9 C38 9, 48 17, 48 25 C48 33, 40 37, 32 37 C24 37, 16 33, 16 25 C16 17, 26 9, 32 9 Z" />
      <path
        d="M32 9 C38 9, 48 17, 48 25 C48 33, 40 37, 32 37 C24 37, 16 33, 16 25 C16 17, 26 9, 32 9 Z"
        transform="rotate(60 32 32)"
      />
      <path
        d="M32 9 C38 9, 48 17, 48 25 C48 33, 40 37, 32 37 C24 37, 16 33, 16 25 C16 17, 26 9, 32 9 Z"
        transform="rotate(120 32 32)"
      />
    </svg>
  )
}

/** Cultural & Arts: Easel with a landscape painting on canvas */
export function CulturalArtsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      {/* Top mast */}
      <rect x="30" y="8" width="4" height="6" rx="2" />
      {/* Canvas */}
      <rect x="14" y="14" width="36" height="25" rx="3" />
      {/* Shelf */}
      <rect x="10" y="38" width="44" height="4" rx="2" />
      {/* Legs */}
      <path d="M19 42 L13.5 54 a2 2 0 0 0 3.7 1.6 L22.5 44 Z" />
      <path d="M30 42 h4 v12 a2 2 0 1 1-4 0 Z" />
      <path d="M45 42 L41.5 44 l5.3 11.6 a2 2 0 1 0 3.7-1.6 Z" />
      {/* Painting cutout on canvas */}
      <circle cx="43" cy="22" r="2.8" className="fill-background" />
      <path
        d="M17 35 L26 24 L32 31 L37 25 L47 35 Z"
        className="fill-background"
      />
    </svg>
  )
}

/** Nightlife & Roof: Two dancing silhouettes celebrating with musical note */
export function NightlifeRoofIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      {/* Floating music note */}
      <path d="M33 9c1 0 4-.5 5 1.5v7a3 3 0 1 1-3-2.5v-3.5l-2 .5z" />
      {/* Left Dancer head */}
      <circle cx="21" cy="18" r="3.5" />
      {/* Right Dancer head */}
      <circle cx="43" cy="18" r="3.5" />
      {/* Connected dancing bodies */}
      <path d="M18 24c-3.5 1.8-5.5 5.5-6.5 9a2 2 0 1 0 3.9 1c1-3 2.5-5.5 5-6.5l2.6 9-4.5 4.5-5.5 1a2 2 0 1 0 .7 3.9l6.5-1.2 4-4.7 1 8a2 2 0 1 0 4 0l-1.3-11.5 11.6-1.5-1.3 13a2 2 0 1 0 4 0l1-8 4 4.7 6.5 1.2a2 2 0 1 0 .7-3.9l-5.5-1-4.5-4.5 2.6-9c2.5 1 4 3.5 5 6.5a2 2 0 1 0 3.9-1c-1-3.5-3-7.2-6.5-9-2.8-1.5-6.2-.5-8.5 2L32 26.5l-2.6-2.5c-2.3-2.5-5.7-3.5-8.5-2z" />
    </svg>
  )
}

/** Community: Open hand holding a heart in palm */
export function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      {/* Hand silhouette */}
      <path d="M13 33c0-3.8 3.5-5.8 6.5-2l3.5 4.5V17a3 3 0 0 1 6 0v13a3 3 0 0 1 6 0V15a3 3 0 0 1 6 0v15a3 3 0 0 1 6 0V19a3 3 0 0 1 6 0v18c0 10-8 17-18 17s-16-6.5-16-21z" />
      {/* Heart cutout in palm */}
      <path
        d="M34 38c-1.5-3-5-3-6.5-1-2 2.5.5 6 6.5 10 6-4 8.5-7.5 6.5-10-1.5-2-5-2-6.5 1z"
        className="fill-background"
      />
    </svg>
  )
}

/** Sports & Fitness */
export function SportsFitnessIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      <rect x="10" y="24" width="6" height="16" rx="2.5" />
      <rect x="17" y="20" width="6" height="24" rx="2.5" />
      <rect x="23" y="29" width="18" height="6" rx="2" />
      <rect x="41" y="20" width="6" height="24" rx="2.5" />
      <rect x="48" y="24" width="6" height="16" rx="2.5" />
    </svg>
  )
}

/** Workshops & Learning */
export function WorkshopsLearningIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-12", className)}
      aria-hidden="true"
    >
      <path d="M32 12 L8 24 L32 36 L56 24 Z" />
      <path d="M16 28.5 v14 c0 6 7.2 11 16 11 s16 -5 16 -11 v-14 L32 36.5 Z" />
      <path d="M56 25 v18 a2 2 0 1 1-4 0 v-16.5 z" />
    </svg>
  )
}

interface CategoryItem {
  id: string
  name: string
  shortKey: string
  description: string
  eventCount: number
  trendingTags: string[]
  icon: React.ComponentType<{ className?: string }>
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "cat_music",
    name: "Music & Concerts",
    shortKey: "music",
    description:
      "Live gigs, acoustic jazz sessions, indie bands, and electrifying outdoor concerts.",
    eventCount: 18,
    trendingTags: ["Live Bands", "Jazz", "Festivals", "Acoustic"],
    icon: MusicConcertsIcon,
  },
  {
    id: "cat_food",
    name: "Food & Drink",
    shortKey: "food and drink",
    description:
      "Street food bazaars, craft beer tastings, rooftop cocktail mixers, and chef pop-ups.",
    eventCount: 24,
    trendingTags: ["Street Food", "Wine Tasting", "Night Market", "Pop-up"],
    icon: FoodDrinkIcon,
  },
  {
    id: "cat_tech",
    name: "Tech & Startups",
    shortKey: "tech",
    description:
      "Developer meetups, hackathons, AI showcases, and high-energy pitch nights.",
    eventCount: 15,
    trendingTags: ["React 19", "AI & ML", "Founder Talks", "Web Dev"],
    icon: TechStartupsIcon,
  },
  {
    id: "cat_arts",
    name: "Cultural & Arts",
    shortKey: "cultural and arts",
    description:
      "Traditional Apsara dance, contemporary art galleries, photography walks, and theatre.",
    eventCount: 12,
    trendingTags: ["Apsara", "Art Gallery", "Exhibition", "Theatre"],
    icon: CulturalArtsIcon,
  },
  {
    id: "cat_nightlife",
    name: "Nightlife & Roof",
    shortKey: "nightlife",
    description:
      "Panoramic rooftop lounges, sunset DJ sessions, dance clubs, and themed social nights.",
    eventCount: 20,
    trendingTags: ["Rooftop Bar", "Sunset Beats", "DJ Session", "Cocktails"],
    icon: NightlifeRoofIcon,
  },
  {
    id: "cat_community",
    name: "Community",
    shortKey: "community",
    description:
      "Neighbourhood cleanups, volunteer drives, outdoor mixers, and charity gatherings.",
    eventCount: 11,
    trendingTags: ["Eco Clean-up", "Volunteering", "Social Mixer", "Charity"],
    icon: CommunityIcon,
  },
  {
    id: "cat_sports",
    name: "Sports & Fitness",
    shortKey: "sports",
    description:
      "Morning marathons, riverside yoga, crossfit bootcamps, and football tournaments.",
    eventCount: 9,
    trendingTags: ["Marathon", "Yoga Flow", "Crossfit", "Cycling"],
    icon: SportsFitnessIcon,
  },
  {
    id: "cat_workshops",
    name: "Workshops & Learning",
    shortKey: "workshops",
    description:
      "Masterclasses, creative design labs, pottery workshops, and entrepreneurship talks.",
    eventCount: 14,
    trendingTags: ["Design", "Pottery", "Photography", "Masterclass"],
    icon: WorkshopsLearningIcon,
  },
]

interface CategoryCarouselProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryCarousel({
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  // Check scroll position to dynamically disable/enable arrows
  const checkScrollState = React.useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const isAtStart = el.scrollLeft <= 5
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5

    setCanScrollLeft(!isAtStart)
    setCanScrollRight(!isAtEnd)
  }, [])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    checkScrollState()
    el.addEventListener("scroll", checkScrollState, { passive: true })

    const observer = new ResizeObserver(() => checkScrollState())
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", checkScrollState)
      observer.disconnect()
    }
  }, [checkScrollState])

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current
    if (!el) return

    const cardWidth = 180
    const scrollDistance = direction === "left" ? -cardWidth * 2 : cardWidth * 2

    el.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    })
  }

  const isSelected = (item: CategoryItem) => {
    if (selectedCategory === "All") return false
    return (
      selectedCategory.toLowerCase() === item.shortKey.toLowerCase() ||
      selectedCategory.toLowerCase() === item.name.toLowerCase()
    )
  }

  return (
    <section
      className="relative space-y-4 py-2"
      aria-label="Event Categories Carousel"
    >
      {/* Header with Title & Navigation Controls */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <Compass className="size-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Browse by Category
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Discover experiences tailored to your passions and vibe
          </p>
        </div>

        {/* Action controls: "All" pill + Left/Right carousel arrows */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory("All")}
            className="h-9 rounded-full px-3.5 text-xs font-medium shadow-2xs"
          >
            All Events
          </Button>

          <div className="ml-1 flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              onClick={() => scroll("left")}
              className={cn(
                "size-9 rounded-full border-border/80 shadow-2xs transition-all",
                !canScrollLeft
                  ? "cursor-not-allowed opacity-35"
                  : "hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95"
              )}
              aria-label="Scroll left in categories"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              onClick={() => scroll("right")}
              className={cn(
                "size-9 rounded-full border-border/80 shadow-2xs transition-all",
                !canScrollRight
                  ? "cursor-not-allowed opacity-35"
                  : "hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95"
              )}
              aria-label="Scroll right in categories"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="group relative">
        {/* Subtle gradient edges to hint scrollability */}
        {canScrollLeft && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent transition-opacity"
            aria-hidden="true"
          />
        )}
        {canScrollRight && (
          <div
            className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background to-transparent transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Scrollable Track */}
        <div
          ref={containerRef}
          className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-1 py-3"
        >
          {CATEGORIES.map((cat) => {
            const active = isSelected(cat)
            const Icon = cat.icon

            return (
              <HoverCard key={cat.id}>
                {/* Trigger is the clickable category card */}
                <HoverCardTrigger
                  type="button"
                  onClick={() => {
                    // Toggle selection or activate
                    if (active) {
                      onSelectCategory("All")
                    } else {
                      onSelectCategory(cat.shortKey)
                    }
                  }}
                  className={cn(
                    "group relative flex h-[165px] w-[145px] shrink-0 cursor-pointer snap-start flex-col items-center justify-between rounded-2xl p-5 text-center transition-all duration-300 select-none sm:h-[185px] sm:w-[165px] sm:rounded-3xl",
                    "border bg-card shadow-2xs",
                    active
                      ? "border-primary bg-primary/10 shadow-md ring-2 shadow-primary/15 ring-primary/30"
                      : "border-border/80 hover:-translate-y-1.5 hover:border-primary/60 hover:bg-primary/3 hover:shadow-xl hover:shadow-primary/10"
                  )}
                  aria-pressed={active}
                  aria-label={`Category: ${cat.name}`}
                >
                  {/* Active Selected Check Badge */}
                  {active && (
                    <span className="absolute top-3 right-3 flex size-5 animate-in items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs zoom-in-75">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  )}

                  {/* Icon centered in upper portion with hover scaling */}
                  <div className="flex flex-1 items-center justify-center pt-2">
                    <div
                      className={cn(
                        "text-primary transition-transform duration-300",
                        active
                          ? "scale-110"
                          : "group-hover:scale-115 group-hover:rotate-1"
                      )}
                    >
                      <Icon className="drop-shadow-2xs size-11 sm:size-13" />
                    </div>
                  </div>

                  {/* Category Label */}
                  <div className="w-full pt-2">
                    <span
                      className={cn(
                        "line-clamp-2 block text-xs leading-snug font-semibold tracking-tight transition-colors sm:text-sm",
                        active
                          ? "font-bold text-primary"
                          : "text-foreground group-hover:text-primary"
                      )}
                    >
                      {cat.name}
                    </span>
                  </div>
                </HoverCardTrigger>

                {/* Enriched HoverCard Preview Popover */}
                <HoverCardContent
                  side="bottom"
                  align="center"
                  sideOffset={10}
                  className="w-80 space-y-3 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {cat.name}
                        </h4>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="size-3 text-primary" />
                          {cat.eventCount} Upcoming Events
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/30 bg-primary/5 px-2 text-[10px] font-semibold text-primary"
                    >
                      <Sparkles className="mr-1 size-2.5" />
                      Popular
                    </Badge>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 border-t border-border/50 pt-1">
                    <div className="text-[11px] font-medium text-muted-foreground">
                      Trending Highlights
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cat.trendingTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-primary">
                    <span>
                      {active
                        ? "Currently active filter • Click to clear"
                        : "Click to explore this category"}
                    </span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
