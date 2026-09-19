import * as React from "react"
import { Navbar } from "@/components/navbar"
import { CategoryCarousel } from "@/components/category-carousel"
import { HighlightEvent } from "@/components/hightlight_event"
import { Quickstart } from "@/components/quickstart"
import { CurrentEvent, type CurrentEventData } from "@/components/current-event"
import { Button } from "@/components/ui/button"
import {
  Search,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { PastEventsSection } from "./components/past-event"


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
  const [, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")


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
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-linear-to-t from-primary/80 via-primary/30 to-primary/10 dark:from-primary dark:via-primary/40 dark:to-primary/10 p-8 sm:p-12 lg:p-16 shadow-xs"
        >
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 -z-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
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

            <div className="flex flex-col gap-4">
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


            <PastEventsSection/>
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
