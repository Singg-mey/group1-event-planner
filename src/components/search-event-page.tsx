import * as React from "react"
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Info,
  MapPin,
} from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SearchEvent } from "@/types/event"

interface SearchEventsPageProps {
  events: SearchEvent[]
  initialCategory?: string
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const getEventDate = (event: SearchEvent) => {
  const dateText = event.date.split(" • ")[0]
  const parsedDate = new Date(dateText)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const normalizeCategory = (category: string) => {
  const value = category.toLowerCase()
  if (value.includes("music") || value.includes("concert")) return "music"
  if (value.includes("food") || value.includes("drink")) return "food and drink"
  if (
    value.includes("tech") ||
    value.includes("startup") ||
    value.includes("hackathon")
  )
    return "tech"
  if (value.includes("art") || value.includes("cultur"))
    return "cultural and arts"
  if (value.includes("night") || value.includes("roof")) return "nightlife"
  return value
}

export function SearchEventsPage({
  events,
  initialCategory = "All Categories",
}: SearchEventsPageProps) {
  const [view, setView] = React.useState<"calendar" | "list">("calendar")
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState(initialCategory)
  const [dateFilter, setDateFilter] = React.useState("Any Date")
  const [location, setLocation] = React.useState("Any Location")
  const [monthOffset, setMonthOffset] = React.useState(0)
  const [showPastEvents, setShowPastEvents] = React.useState(false)
  const today = React.useMemo(() => new Date(), [])
  const [selectedDate, setSelectedDate] = React.useState(today)
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(
    null
  )

  const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthName = month.toLocaleString("en-US", { month: "long" })
  const year = month.getFullYear()
  const firstDay = new Date(year, month.getMonth(), 1).getDay()
  const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate()
  const previousMonthDays = new Date(year, month.getMonth(), 0).getDate()
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDay + 1
    if (dayNumber < 1)
      return { day: previousMonthDays + dayNumber, current: false }
    if (dayNumber > daysInMonth)
      return { day: dayNumber - daysInMonth, current: false }
    return { day: dayNumber, current: true }
  })

  const filteredEvents = events.filter((event) => {
    const searchable =
      `${event.title} ${event.location} ${event.category}`.toLowerCase()
    const matchesQuery =
      !query.trim() || searchable.includes(query.toLowerCase())
    const matchesCategory =
      category === "All Categories" ||
      normalizeCategory(event.category) === normalizeCategory(category)
    const matchesLocation =
      location === "Any Location" || event.location.includes(location)
    return matchesQuery && matchesCategory && matchesLocation
  })
  const eventDays = new Set(
    filteredEvents
      .map(getEventDate)
      .filter(
        (eventDate): eventDate is Date =>
          eventDate !== null &&
          eventDate.getFullYear() === year &&
          eventDate.getMonth() === month.getMonth()
      )
      .map((eventDate) => eventDate.getDate())
  )
  const selectedDayEvents = filteredEvents.filter((event) => {
    const eventDate = getEventDate(event)
    return (
      eventDate !== null && getDateKey(eventDate) === getDateKey(selectedDate)
    )
  })
  const selectedEvent = filteredEvents.find(
    (event) => event.id === selectedEventId
  )
  const pastEvents = filteredEvents.filter(
    (event) => event.status === "CONCLUDED"
  )
  const upcomingEvents = filteredEvents.filter(
    (event) => event.status !== "CONCLUDED"
  )
  const visibleEvents = showPastEvents ? pastEvents : upcomingEvents

  const changeMonth = (amount: number) => {
    setMonthOffset((value) => value + amount)
    setSelectedDate(
      new Date(today.getFullYear(), today.getMonth() + monthOffset + amount, 1)
    )
    setSelectedEventId(null)
  }

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Find Events
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover events created by the community and find something happening
          near you.
        </p>
      </header>

      <div className="grid gap-2 lg:grid-cols-[minmax(15rem,1.7fr)_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events by name, location, or keyword..."
            className="h-10 rounded-lg pl-9 text-xs"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option>All Categories</option>
          <option>Music & Concerts</option>
          <option>Food & Drink</option>
          <option>Tech & Startups</option>
          <option>Cultural & Arts</option>
        </select>
        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option>Any Date</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/40"
        >
          <option>Any Location</option>
          <option>Phnom Penh</option>
          <option>Siem Reap</option>
          <option>Online</option>
        </select>
        <Button className="h-10 gap-2 rounded-lg px-5 text-xs">
          <Search className="size-3.5" />
          Search
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-lg border border-border bg-card p-1">
          <Button
            variant={view === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("calendar")}
            className="gap-2 rounded-md text-xs"
          >
            <CalendarRange className="size-3.5" />
            Calendar View
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="gap-2 rounded-md text-xs"
          >
            <List className="size-3.5" />
            List View
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setMonthOffset(0)
              setSelectedDate(today)
              setSelectedEventId(null)
            }}
          >
            Today
          </Button>
          <div className="flex items-center rounded-lg border border-border bg-card">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-32 text-center text-xs font-semibold">
              {monthName} {year}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      {view === "calendar" ? (
        <Card className="rounded-xl border-border/80 shadow-none">
          <CardContent className="p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft />
              </Button>
              <h2 className="text-sm font-bold">
                {monthName} {year}
              </h2>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-medium text-muted-foreground">
              {WEEKDAYS.map((day) => (
                <span key={day} className="pb-2">
                  {day}
                </span>
              ))}
              {calendarDays.map(({ day, current }, index) => {
                const cellDate = new Date(year, month.getMonth(), day)
                const hasEvent = current && eventDays.has(day)
                const selected =
                  current && getDateKey(cellDate) === getDateKey(selectedDate)
                const isToday = getDateKey(cellDate) === getDateKey(today)
                return (
                  <button
                    type="button"
                    key={`${day}-${index}`}
                    disabled={!current}
                    onClick={() => {
                      setSelectedDate(cellDate)
                      setSelectedEventId(null)
                    }}
                    aria-label={`${cellDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}${hasEvent ? ", has events" : ""}`}
                    className={`relative flex min-h-12 items-start justify-center border-t border-border/40 pt-2 text-xs sm:min-h-14 ${current ? "text-foreground" : "cursor-default text-muted-foreground/30"}`}
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-full font-semibold ${selected ? "bg-primary text-primary-foreground" : isToday ? "border-2 border-primary text-primary" : ""}`}
                    >
                      {day}
                    </span>
                    {hasEvent && (
                      <span className="absolute top-9 size-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 border-t border-border/60 pt-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedDayEvents.length === 0
                      ? "No events scheduled"
                      : `${selectedDayEvents.length} event${selectedDayEvents.length === 1 ? "" : "s"} scheduled`}
                  </p>
                </div>
                {getDateKey(selectedDate) === getDateKey(today) && (
                  <Badge variant="secondary">Today</Badge>
                )}
              </div>

              {selectedDayEvents.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 rounded-lg border border-border/70 bg-muted/20 p-3"
                    >
                      <img
                        src={event.image}
                        alt=""
                        className="size-14 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="truncate text-sm font-semibold">
                          {event.title}
                        </p>
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="size-3 shrink-0" />
                          {event.location}
                        </p>
                        <Button
                          variant="link"
                          size="xs"
                          className="h-auto px-0 text-xs"
                          onClick={() => setSelectedEventId(event.id)}
                        >
                          View event <ArrowRight className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedEvent && (
                <Card className="mt-3 border-primary/30 bg-primary/5 shadow-none">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge>{selectedEvent.category}</Badge>
                        <CardTitle className="mt-2 text-base">
                          {selectedEvent.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSelectedEventId(null)}
                        aria-label="Close event details"
                      >
                        <ChevronRight className="rotate-90" />
                      </Button>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {selectedEvent.description}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {selectedEvent.date}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="flex h-full">
                <img src={event.image} alt="" className="w-32 object-cover" />
                <CardContent className="space-y-2 p-4">
                  <Badge>{event.category}</Badge>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {event.date} · {event.location}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      <section className="space-y-4" aria-labelledby="event-list-title">
        <div>
          <h2
            id="event-list-title"
            className="text-lg font-bold tracking-tight"
          >
            {showPastEvents ? "Past Events" : "Upcoming Events"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {showPastEvents
              ? "Look back at events that have already happened."
              : "Plan ahead with events happening soon in your community."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-lg border border-border bg-card p-1">
            <Button
              variant={!showPastEvents ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPastEvents(false)}
              className="rounded-md text-xs"
            >
              Upcoming Events
            </Button>
            <Button
              variant={showPastEvents ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPastEvents(true)}
              className="rounded-md text-xs"
            >
              Past Events
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setQuery("")
              setCategory(initialCategory)
              setDateFilter("Any Date")
              setLocation("Any Location")
              setShowPastEvents(false)
            }}
            className="w-fit gap-1 px-0 text-xs font-semibold text-primary"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden border-border/80 shadow-none"
              >
                <img
                  src={event.image}
                  alt=""
                  className="h-32 w-full object-cover"
                />
                <CardContent className="flex flex-1 flex-col space-y-2 p-4">
                  <Badge>{event.category}</Badge>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {event.location}
                  </p>
                  <Link
                    to={`/events/${event.id}`}
                    state={{ activeItem: "Find Event" }}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "mt-auto w-full gap-1.5 text-xs",
                    })}
                  >
                    <Info className="size-3.5" />
                    Event detail
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed shadow-none">
            <CardContent className="flex min-h-24 items-center justify-center p-6 text-center text-sm text-muted-foreground">
              {showPastEvents
                ? "No past events found for these filters."
                : "No upcoming events found for these filters."}
            </CardContent>
          </Card>
        )}
      </section>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filteredEvents.length} events found</span>
        <Button variant="ghost" size="sm" className="gap-2">
          <SlidersHorizontal className="size-3.5" />
          More filters
        </Button>
      </div>
    </main>
  )
}
