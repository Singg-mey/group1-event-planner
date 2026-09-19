import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  MapPin,
  Users,
  Search,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Bookmark,
  CheckCircle2,
  Eye,
  Share2,
  Ticket,
} from "lucide-react"

const FEATURED_EVENTS = [
  {
    id: "evt_001",
    title: "Phnom Penh Jazz Night",
    description: "An evening of live jazz featuring local and international artists with crafted cocktails.",
    category: "Music",
    date: "Oct 10, 2026 • 7:00 PM",
    location: "Street 240, Daun Penh",
    capacity: "200 attendees",
    status: "published",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80",
    tags: ["Jazz", "Live", "Nightlife"],
  },
  {
    id: "evt_002",
    title: "Frontend Dev Meetup 2026",
    description: "Monthly tech gathering for React, TypeScript, and modern web developers to share demos.",
    category: "Tech",
    date: "Oct 15, 2026 • 6:30 PM",
    location: "Online (Google Meet)",
    capacity: "100 attendees",
    status: "published",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    tags: ["React 19", "Tailwind", "Vite"],
  },
  {
    id: "evt_003",
    title: "Khmer Classical Dance & Arts",
    description: "Traditional Apsara dance performance followed by a curated local arts gallery showcase.",
    category: "Cultural and Arts",
    date: "Oct 24, 2026 • 5:00 PM",
    location: "Chaktomuk Theatre, Sisowath Quay",
    capacity: "300 attendees",
    status: "published",
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&auto=format&fit=crop&q=80",
    tags: ["Apsara", "Culture", "Theatre"],
  },
]

const HIGHLIGHT_EVENT = {
  title: "Phnom Penh Jazz Night",
  date: "October 10, 2026 • 7:00 PM",
  location: "Street 240, Daun Penh, Phnom Penh",
  category: "Music",
  posters: [
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=85",
  ],
}

export function App() {
  const [activeItem, setActiveItem] = React.useState("Home")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")

  const categories = ["All", "Music", "Tech", "Cultural and Arts"]

  const filteredEvents = FEATURED_EVENTS.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" || evt.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch =
      !searchQuery.trim() ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* 
        Navbar component using Shadcn Navigation Component with:
        - Home
        - Create Event
        - Find Event
        - About
        - Search bar
        - Profile Avatar
      */}
      <Navbar
        activeItem={activeItem}
        onNavigate={(item) => setActiveItem(item)}
        onSearch={(query) => setSearchQuery(query)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 sm:p-12 lg:p-16 shadow-xs"
        >
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 -z-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Next-Gen Event Experience</span>
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Discover & Host <span className="text-primary">Unforgettable</span> Events
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Find concerts, developer meetups, workshops, and nightlife near you.
              Or create and manage your own event in minutes with our all-in-one organizer tools.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="gap-2 rounded-full font-semibold shadow-md shadow-primary/20"
                onClick={() => setActiveItem("Find Event")}
              >
                <Search className="size-4" />
                Find Events
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full"
                onClick={() => setActiveItem("Create Event")}
              >
                <PlusCircle className="size-4 text-primary" />
                Create Event
              </Button>
            </div>
          </div>
        </section>

        {/* Highlighted Event */}
        <section id="highlight-event">
          <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[#172a76] via-[#2146ad] to-[#2f73ed] p-0 text-white shadow-2xl shadow-blue-900/20">
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border-0 bg-cyan-300 px-3 py-1 text-[11px] font-bold text-slate-950 hover:bg-cyan-300">
                    <Sparkles className="mr-1 size-3" />
                    Spotlight Featured Event
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-blue-100/75">
                    <CheckCircle2 className="size-3" /> Organizer Verified by EventPulse
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="xs" variant="secondary" className="gap-1.5 border-0 bg-white/10 text-white hover:bg-white/20">
                    <Share2 className="size-3" /> Share
                  </Button>
                  <Button size="xs" variant="secondary" className="gap-1.5 border-0 bg-white/10 text-white hover:bg-white/20">
                    <Bookmark className="size-3" /> Saved (1.4k)
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 pt-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
                <div className="space-y-3">
                  <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-300/80 shadow-inner">
                    <img
                      src={HIGHLIGHT_EVENT.posters[0]}
                      alt={`${HIGHLIGHT_EVENT.title} main poster`}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {HIGHLIGHT_EVENT.posters.slice(1).map((poster, index) => (
                      <div key={poster} className="relative aspect-[2/1] overflow-hidden rounded-md bg-slate-300/80">
                        <img
                          src={poster}
                          alt={`${HIGHLIGHT_EVENT.title} poster ${index + 2}`}
                          className="size-full object-cover"
                        />
                        {index === 1 && (
                          <span className="absolute bottom-1 left-1 rounded bg-slate-950/75 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            +14 Photos
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="flex aspect-[2/1] items-center justify-center rounded-md bg-white/15 text-[10px] font-semibold text-blue-100">
                      <span>Gallery</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {HIGHLIGHT_EVENT.category} event <span className="text-white/40">•</span> Limited seats
                  </div>
                  <h2 className="max-w-xl font-heading text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
                    {HIGHLIGHT_EVENT.title}
                  </h2>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg bg-white/10 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-100/70">
                        <CalendarDays className="size-3.5" /> Date & time
                      </div>
                      <p className="text-xs font-semibold">{HIGHLIGHT_EVENT.date}</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-blue-100/70">
                        <MapPin className="size-3.5" /> Location & map
                      </div>
                      <p className="text-xs font-semibold">{HIGHLIGHT_EVENT.location}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="name" className="mt-2 gap-3">
                    <TabsList className="grid w-full grid-cols-2 bg-black/10 text-blue-100/70 sm:grid-cols-4">
                      <TabsTrigger value="name" className="text-xs text-blue-100/70 data-active:bg-white/10 data-active:text-white">Event name</TabsTrigger>
                      <TabsTrigger value="location" className="text-xs text-blue-100/70 data-active:bg-white/10 data-active:text-white">Location</TabsTrigger>
                      <TabsTrigger value="date" className="text-xs text-blue-100/70 data-active:bg-white/10 data-active:text-white">Date</TabsTrigger>
                      <TabsTrigger value="poster" className="text-xs text-blue-100/70 data-active:bg-white/10 data-active:text-white">Details</TabsTrigger>
                    </TabsList>

                    <div className="min-h-24 rounded-lg bg-black/10 p-4 text-xs text-blue-50/85">
                      <TabsContent value="name">
                        <p className="mb-2 font-semibold text-cyan-200">Event name</p>
                        {HIGHLIGHT_EVENT.title} brings live music and a relaxed night out to Phnom Penh.
                      </TabsContent>
                      <TabsContent value="location">
                        <p className="mb-2 font-semibold text-cyan-200">Location</p>
                        Join us at {HIGHLIGHT_EVENT.location} for an intimate evening with city atmosphere.
                      </TabsContent>
                      <TabsContent value="date">
                        <p className="mb-2 font-semibold text-cyan-200">Date and time</p>
                        Doors open at 6:30 PM. The main performance starts at {HIGHLIGHT_EVENT.date}.
                      </TabsContent>
                      <TabsContent value="poster">
                        <p className="mb-2 font-semibold text-cyan-200">Event details</p>
                        An evening of live jazz featuring local and international artists with crafted cocktails.
                      </TabsContent>
                    </div>
                  </Tabs>

                  <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-blue-100/75">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-300" /> 86% Booked • Only 28 Seats Left</span>
                    <span className="hidden font-semibold text-cyan-200 sm:inline">Bakong Pay & Visa Accepted</span>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <Button size="lg" className="gap-2 border-0 bg-cyan-300 font-bold text-slate-950 shadow-lg shadow-cyan-950/20 hover:bg-cyan-200">
                      <Ticket className="size-4" /> Get Tickets / RSVP
                    </Button>
                    <Button size="lg" variant="secondary" className="gap-2 border-0 bg-white/10 text-white hover:bg-white/20">
                      <Eye className="size-4" /> <span className="hidden sm:inline">Quick Preview</span><span className="sm:hidden">Preview</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Find Events Section */}
        <section id="find-event" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Explore Upcoming Events</h2>
              <p className="text-sm text-muted-foreground">
                Hand-picked events happening this month
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="size-4 text-muted-foreground mr-1 shrink-0" />
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full text-xs font-medium"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing results for</span>
              <span className="font-semibold text-foreground">&ldquo;{searchQuery}&rdquo;</span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setSearchQuery("")}
                className="text-xs"
              >
                Clear filter
              </Button>
            </div>
          )}

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <Card
                key={evt.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 right-3 shadow-sm">
                    {evt.category}
                  </Badge>
                </div>

                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                    <CalendarDays className="size-3.5" />
                    <span>{evt.date}</span>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {evt.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs leading-relaxed mt-1">
                    {evt.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-end space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>{evt.capacity}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t border-border/40 flex items-center justify-between mt-auto">
                  <div className="flex gap-1">
                    {evt.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="gap-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                    View <ArrowRight className="size-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Create Event & About info banner */}
        <section id="about" className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <PlusCircle className="size-5" />
              <h3 className="text-base font-semibold">Organize with Confidence</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create tickets, track RSVPs, broadcast announcements, and check in attendees via QR code scanners.
            </p>
            <Button size="sm" className="rounded-full">Get Started as Organizer</Button>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="size-5" />
              <h3 className="text-base font-semibold">About EventPlanner</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Built with React 19, TypeScript, Tailwind CSS, and Shadcn UI components. Designed for speed, aesthetic excellence, and responsiveness.
            </p>
            <div className="text-xs font-mono text-muted-foreground">
              Tip: Press <kbd className="rounded border bg-muted px-1 py-0.5 font-bold">d</kbd> to toggle Dark Mode anytime.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
