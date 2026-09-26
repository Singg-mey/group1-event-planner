import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Eye,
  MapPin,
  Share2,
  Sparkles,
  Ticket,
} from "lucide-react"

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

export function HighlightEvent() {
  return (
    <section id="highlight-event">
      <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[#172a76] via-[#2146ad] to-[#2f73ed] p-0 text-white shadow-2xl shadow-blue-900/20 lg:min-h-[38rem]">
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
  )
}
