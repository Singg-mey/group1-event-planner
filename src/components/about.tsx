import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Compass,
  Globe2,
  Handshake,
  MapPin,
  Rocket,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface AboutContentProps {
  onBack?: () => void
  onDiscoverEvents?: () => void
  onBecomeOrganizer?: () => void
  className?: string
}

const STATS = [
  { label: "Events Hosted", value: "120+", icon: CalendarDays, tint: "bg-primary/10 text-primary" },
  { label: "Cities Covered", value: "8", icon: MapPin, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { label: "Active Organizers", value: "240+", icon: Users, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { label: "Community Attendees", value: "18k+", icon: Globe2, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
] as const

const VALUES = [
  {
    title: "Discover what matters",
    description:
      "Hand-picked concerts, meetups, workshops and festivals across Phnom Penh, Siem Reap, Kampot and beyond — tuned to your world.",
    icon: Compass,
    tint: "bg-primary/10 text-primary",
  },
  {
    title: "Host with confidence",
    description:
      "Create tickets, track RSVPs, broadcast announcements and check in attendees with QR scanning — all from one organizer hub.",
    icon: Rocket,
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    title: "Grow the community",
    description:
      "From grassroots pop-ups to national festivals, we help local organizers and independent talent reach the people they inspire.",
    icon: Handshake,
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
] as const

const ATTENDEE_FEATURES = [
  "Curated local events updated in real time",
  "Seamless ticket purchase and QR check-in",
  "Save events and get reminders before doors open",
  "Trusted organizers verified by the Evently team",
]

const ORGANIZER_FEATURES = [
  "Launch an event in minutes with free templates",
  "Sell tickets with Bakong Pay, Visa and billing tools",
  "Live RSVP dashboard and attendee messaging",
  "Attendee check-in via QR code scanners",
]

const STEPS = [
  {
    title: "Explore",
    description: "Browse by category, search live, and save events happening near you.",
    icon: Compass,
  },
  {
    title: "Reserve",
    description: "Grab your ticket or RSVP in a couple of taps — pay with local wallets.",
    icon: Ticket,
  },
  {
    title: "Show up & create",
    description: "Scan in at the venue, meet your community, or launch your own next event.",
    icon: Sparkles,
  },
] as const

export function AboutContent({
  onBack,
  onDiscoverEvents,
  onBecomeOrganizer,
  className,
}: AboutContentProps) {
  return (
    <div className={cn("space-y-12", className)}>
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </button>
        <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs">
          <Sparkles className="size-3 text-primary" />
          About Evently
        </Badge>
      </div>

      {/* Hero */}
      <section className="relative w-full overflow-hidden rounded-3xl border border-border/70 bg-linear-to-t from-primary/80 via-primary/30 to-primary/10 p-8 text-center shadow-xs sm:p-12 lg:p-14">
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 -z-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Connecting Cambodia since 2024</span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Bringing people together,{" "}
            <span className="text-primary">one event at a time</span>
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Evently is Cambodia&apos;s event discovery and organizing platform.
            We empower local organizers, artists and communities through
            effortless event creation, ticketing and seamless experiences
            across the Kingdom of Wonder.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="gap-2 rounded-full font-semibold shadow-md shadow-primary/20"
              onClick={onDiscoverEvents}
            >
              <Compass className="size-4" />
              Discover Events
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full"
              onClick={onBecomeOrganizer}
            >
              <CalendarPlus className="size-4 text-primary" />
              Become an Organizer
            </Button>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Evently in numbers
          </h2>
          <p className="text-sm text-muted-foreground">
            A growing ecosystem for Cambodian events and communities
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 text-center transition-colors hover:border-primary/30"
              >
                <div className={cn("flex size-10 items-center justify-center rounded-xl", stat.tint)}>
                  <Icon className="size-5" />
                </div>
                <span className="text-2xl leading-tight font-extrabold tabular-nums text-foreground">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* What we do */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What we do
            </h2>
            <p className="text-sm text-muted-foreground">
              Three pillars behind every event we power
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon
            return (
              <Card
                key={value.title}
                size="sm"
                className="group transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <CardContent className="flex h-full flex-col gap-3">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                      value.tint
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {value.title}
                  </CardTitle>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* For attendees vs organizers */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card size="sm" className="bg-gradient-to-br from-primary/10 to-sky-500/5">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </div>
            <CardTitle className="pt-1 text-lg font-bold text-foreground">
              For event lovers
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Never miss what&apos;s happening this season in your city.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {ATTENDEE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              size="sm"
              className="mt-5 w-full gap-1.5 rounded-full font-semibold"
              onClick={onDiscoverEvents}
            >
              Explore events <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card size="sm" className="bg-gradient-to-br from-amber-500/10 to-primary/5">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CalendarPlus className="size-5" />
            </div>
            <CardTitle className="pt-1 text-lg font-bold text-foreground">
              For organizers
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Launch, manage and grow events without the busywork.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {ORGANIZER_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              size="sm"
              variant="outline"
              className="mt-5 w-full gap-1.5 rounded-full font-semibold"
              onClick={onBecomeOrganizer}
            >
              Start hosting <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How it works
          </h2>
          <p className="text-sm text-muted-foreground">
            From discovery to hosting in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className="relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/30"
              >
                <span className="absolute top-4 right-4 font-heading text-4xl font-extrabold text-primary/10 select-none">
                  0{idx + 1}
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA band */}
      <section aria-labelledby="about-cta-title">
        <div className="flex flex-col gap-8 rounded-2xl bg-primary px-8 py-9 text-primary-foreground shadow-lg shadow-primary/15 md:flex-row md:items-center md:justify-between md:px-9 lg:px-10">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium text-primary-foreground/80">
              <Rocket className="size-3" />
              Join the movement
            </div>
            <h2
              id="about-cta-title"
              className="max-w-lg text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
            >
              Ready to discover or host something unforgettable?
            </h2>
            <p className="max-w-lg text-xs leading-relaxed text-primary-foreground/70 sm:text-sm">
              Whether you&apos;re hunting for the next rooftop mixser or want to
              bring your own idea to life, Evently has the tools — and the
              community — to help.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              size="lg"
              className="h-10 gap-1.5 bg-cyan-400 px-5 font-bold text-slate-950 shadow-md shadow-primary-foreground/10 hover:bg-cyan-300"
              onClick={onDiscoverEvents}
            >
              <Compass className="size-4" />
              Find your next event
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-10 gap-1.5 border-primary-foreground/20 bg-primary-foreground/5 px-5 font-semibold text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              onClick={onBecomeOrganizer}
            >
              <CalendarPlus className="size-4" />
              Start creating
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutContent