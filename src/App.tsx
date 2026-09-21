import * as React from "react"
import { Navbar } from "@/components/navbar"
import { CategoryCarousel } from "@/components/category-carousel"
import { HighlightEvent } from "@/components/hightlight_event"
import { Quickstart } from "@/components/quickstart"
import { CurrentEvent, type CurrentEventData } from "@/components/current-event"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CalendarDays,
  MapPin,
  Users,
  Search,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Globe2,
  Send,
} from "lucide-react"

const FEATURED_EVENTS = [
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

const CURRENT_EVENT: CurrentEventData = {
  title: "Sunset Rooftop Mixer",
  location: "Street 51, BKK1, Phnom Penh",
  confirmed: 42,
  capacity: 50,
  checklistDone: 6,
  checklistTotal: 8,
}

export function App() {
  const [activeItem, setActiveItem] = React.useState("Home")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")

  const categories = [
    "All",
    "Music & Concerts",
    "Food & Drink",
    "Tech & Startups",
    "Cultural & Arts",
    "Nightlife & Roof",
    "Community",
  ]

  // Normalizer to link category tags, shortKeys, and display titles seamlessly
  const normalize = (cat: string) => {
    const c = cat.toLowerCase().trim()
    if (c.includes("music") || c.includes("concert")) return "music"
    if (c.includes("food") || c.includes("drink")) return "food and drink"
    if (c.includes("tech") || c.includes("startup")) return "tech"
    if (c.includes("cultur") || c.includes("art")) return "cultural and arts"
    if (c.includes("night") || c.includes("roof")) return "nightlife"
    if (c.includes("commun")) return "community"
    if (c.includes("sport") || c.includes("fit")) return "sports"
    if (c.includes("workshop") || c.includes("learn")) return "workshops"
    return c
  }

  const filteredEvents = FEATURED_EVENTS.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" ||
      normalize(evt.category) === normalize(selectedCategory) ||
      normalize(evt.shortCategory) === normalize(selectedCategory) ||
      evt.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(evt.shortCategory.toLowerCase())

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

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-linear-to-t from-primary/80 via-primary/30 to-primary/10 p-3 shadow-xs sm:p-4 lg:p-6 dark:from-primary dark:via-primary/40 dark:to-primary/10"
        >
          <div className="absolute top-0 right-0 -z-10 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 -z-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>Next-Gen Event Experience</span>
              </div>

              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl">
                Discover & Host{" "}
                <span className="text-primary">Unforgettable</span> Events
              </h1>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Find concerts, developer meetups, workshops, and nightlife near
                you. Or create and manage your own event in minutes with our
                all-in-one organizer tools.
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

            <div className="flex flex-col gap-2">
              <Quickstart onStart={() => setActiveItem("Create Event")} />
              <CurrentEvent
                event={CURRENT_EVENT}
                onManage={() => setActiveItem("Create Event")}
              />
            </div>
          </div>
        </section>

        {/* Browsing Category Carousel with Clickable Hover Cards */}
        <CategoryCarousel
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
        <HighlightEvent />

        {/* Find Events Section */}
        <section id="find-event" className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Explore Upcoming Events
                </h2>
                {selectedCategory !== "All" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-2.5 py-1 text-xs font-semibold"
                  >
                    <span className="font-bold text-primary">
                      {selectedCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Clear category filter"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Hand-picked events happening this month
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="mr-1 size-4 shrink-0 text-muted-foreground" />
              {categories.map((cat) => {
                const isActive =
                  (selectedCategory === "All" && cat === "All") ||
                  (cat !== "All" &&
                    normalize(selectedCategory) === normalize(cat))

                return (
                  <Button
                    key={cat}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedCategory(
                        isActive && cat !== "All" ? "All" : cat
                      )
                    }
                    className="shrink-0 rounded-full text-xs font-medium"
                  >
                    {cat}
                  </Button>
                )
              })}
            </div>
          </div>

          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing results for</span>
              <span className="font-semibold text-foreground">
                &ldquo;{searchQuery}&rdquo;
              </span>
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
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
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary">
                    <CalendarDays className="size-3.5" />
                    <span>{evt.date}</span>
                  </div>
                  <CardTitle className="text-lg font-bold transition-colors group-hover:text-primary">
                    {evt.title}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 text-xs leading-relaxed">
                    {evt.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-end space-y-3 p-5 pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>{evt.capacity}</span>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between border-t border-border/40 p-5 pt-0">
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
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
                  >
                    View <ArrowRight className="size-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Create Event & About info banner */}
        <section
          id="about"
          className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2"
        >
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-2 font-bold text-primary">
              <PlusCircle className="size-5" />
              <h3 className="text-base font-semibold">
                Organize with Confidence
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Create tickets, track RSVPs, broadcast announcements, and check in
              attendees via QR code scanners.
            </p>
            <Button size="sm" className="rounded-full">
              Get Started as Organizer
            </Button>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-2 font-bold text-primary">
              <Sparkles className="size-5" />
              <h3 className="text-base font-semibold">About EventPlanner</h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Built with React 19, TypeScript, Tailwind CSS, and Shadcn UI
              components. Designed for speed, aesthetic excellence, and
              responsiveness.
            </p>
            <div className="font-mono text-xs text-muted-foreground">
              Tip: Press{" "}
              <kbd className="rounded border bg-muted px-1 py-0.5 font-bold">
                d
              </kbd>{" "}
              to toggle Dark Mode anytime.
            </div>
          </div>
        </section>
      </main>

      <section
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        aria-labelledby="newsletter-title"
      >
        <div className="flex flex-col gap-8 rounded-2xl bg-primary px-8 py-9 text-primary-foreground shadow-lg shadow-primary/15 md:flex-row md:items-center md:justify-between md:px-9 lg:px-10">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium text-primary-foreground/80">
              <Send className="size-3" />
              Official Telegram Channels
            </div>
            <h2
              id="newsletter-title"
              className="max-w-lg text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
            >
              Never miss what&apos;s happening this weekend
            </h2>
            <p className="max-w-lg text-xs leading-relaxed text-primary-foreground/70 sm:text-sm">
              Get the Friday digest of secret popup dinners, live concerts, art
              openings, and RSVP spots across Phnom Penh, Siem Reap & Kampot.
            </p>
          </div>

          <form
            className="flex w-full max-w-lg flex-col gap-2 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              required
              className="h-10 border-0 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary-foreground/40"
            />
            <Button
              type="submit"
              size="lg"
              className="h-10 bg-cyan-400 px-5 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Join Weekly Digest
            </Button>
          </form>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-[#EFF4FF]  dark:bg-background">
        <Card className="mx-auto max-w-7xl rounded-none border-0 bg-transparent px-4 shadow-none ring-0 sm:px-6 lg:px-8">
          <CardContent className="grid gap-10 px-0 py-0 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <a
                href="#home"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground"
              >
                <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <CalendarDays className="size-4" />
                </span>
                <span>EventPlanner</span>
              </a>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Empowering Cambodia&apos;s vibrant community through effortless
                event discovery, grassroots gatherings, and seamless organizing
                across Phnom Penh, Siem Reap, and beyond.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-background/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                <MapPin className="size-3 text-primary" />
                Proudly built for Cambodia
              </div>
            </div>

            <FooterLinkGroup
              title="Discovery"
              links={[
                "All Events",
                "Phnom Penh Tech",
                "Siem Reap Workshops",
                "Community Arts & Culture",
              ]}
            />
            <FooterLinkGroup
              title="Organizers"
              links={[
                "Host an Event",
                "Organizer Dashboard",
                "Community Guidelines",
                "Planning Resources",
              ]}
            />
            <FooterLinkGroup
              title="About & Trust"
              links={[
                "Our Mission",
                "Safety & Verification",
                "Contact Support",
                "Privacy Policy",
              ]}
            />
          </CardContent>

          <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2025 EventPlanner Cambodia. Connecting communities across the
              Kingdom of Wonder.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </a>
              <a
                href="#language"
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <Globe2 className="size-3" />
                ខ្មែរ / English
              </a>
            </div>
          </div>
        </Card>
      </footer>
    </div>
  )
}

function FooterLinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-foreground">{title}</h2>
      <nav className="flex flex-col items-start gap-2" aria-label={title}>
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  )
}

export default App
