import * as React from "react"
import { CalendarDays, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const SAMPLE_SEARCH_EVENTS = [
  {
    id: "evt_001",
    title: "Phnom Penh Jazz Night",
    category: "Music",
    location: "Street 240, Daun Penh",
    date: "Oct 10, 2026",
    badge: "Live Music",
  },
  {
    id: "evt_002",
    title: "Frontend Dev Meetup",
    category: "Tech",
    location: "Online (Google Meet)",
    date: "Oct 15, 2026",
    badge: "React & TS",
  },
  {
    id: "evt_003",
    title: "Khmer Classical Dance Showcase",
    category: "Cultural and Arts",
    location: "Chaktomuk Theatre",
    date: "Oct 24, 2026",
    badge: "Apsara Dance",
  },
  {
    id: "evt_004",
    title: "Rooftop DJ Sessions",
    category: "Nightlife",
    location: "BKK1, Phnom Penh",
    date: "Nov 07, 2026",
    badge: "Cocktails & DJ",
  },
  {
    id: "evt_005",
    title: "Street Food Festival",
    category: "Food and Drink",
    location: "Koh Pich, Phnom Penh",
    date: "Nov 14, 2026",
    badge: "30+ Vendors",
  },
]

export function SearchBar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
}) {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchContainerRef = React.useRef<HTMLDivElement>(null)

  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SAMPLE_SEARCH_EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.badge.toLowerCase().includes(q)
    )
  }, [searchQuery])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setIsSearchFocused(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={searchContainerRef}
      className="relative hidden sm:block w-48 md:w-64 lg:w-72 transition-all duration-200 focus-within:w-60 md:focus-within:w-80"
    >
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Search events, tags..."
          className="h-9 w-full rounded-full bg-muted/50 pl-9 pr-12 text-sm transition-all duration-200 hover:bg-muted/80 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2.5 hidden select-none items-center gap-0.5 rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs md:inline-flex">
            <span>⌘</span>K
          </kbd>
        )}
      </div>

      {isSearchFocused && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[300px] overflow-hidden rounded-2xl border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-md transition-all animate-in fade-in-0 zoom-in-95 z-50">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Events ({filteredEvents.length})
          </div>
          {filteredEvents.length > 0 ? (
            <div className="space-y-1">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    onSearchChange(event.title)
                    setIsSearchFocused(false)
                  }}
                  className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-muted focus:bg-muted outline-none"
                >
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <CalendarDays className="size-3.5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-xs font-semibold text-foreground">
                      {event.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="truncate">{event.location}</span>
                      <span>•</span>
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] py-0 px-1.5"
                  >
                    {event.category}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              No events found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}