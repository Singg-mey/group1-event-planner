import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Camera,
  Clock,
  Edit,
  Link as LinkIcon,
  Mail,
  MapPin,
  Pencil,
  Shield,
  Sparkles,
  Star,
  Ticket,
  UploadCloud,
  User,
  Users,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

export interface ProfileDetailData {
  name: string
  email: string
  avatarUrl?: string
  role?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  memberSince?: string
  ticketsCount?: number
  hostedCount?: number
  savedCount?: number
  followingCount?: number
  rating?: number
}

export interface ProfileDetailProps {
  user?: ProfileDetailData
  onBack?: () => void
  onEditProfile?: () => void
  className?: string
}

const DEFAULT_USER: ProfileDetailData = {
  name: "Alex Morgan",
  email: "alex.morgan@eventplanner.io",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  role: "Event Organizer",
  bio: "Passionate about bringing creative communities together across Phnom Penh. I organize rooftop mixers, live jazz nights and tech meetups — always looking for the next unforgettable gathering.",
  location: "Phnom Penh, Cambodia",
  website: "https://eventplanner.io/alex",
  phone: "+855 12 345 678",
  memberSince: "March 2024",
  ticketsCount: 3,
  hostedCount: 8,
  savedCount: 12,
  followingCount: 145,
  rating: 4.9,
}

const STATS: {
  label: string
  valueKey: "hostedCount" | "ticketsCount" | "savedCount" | "followingCount"
  icon: React.ComponentType<{ className?: string }>
  tint: string
}[] = [
  { label: "Events Hosted", valueKey: "hostedCount", icon: CalendarDays, tint: "bg-primary/10 text-primary" },
  { label: "Tickets Owned", valueKey: "ticketsCount", icon: Ticket, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { label: "Saved Events", valueKey: "savedCount", icon: Bookmark, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { label: "Followers", valueKey: "followingCount", icon: Users, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
]
interface Ticket {
  id: string
  event: string
  date: string
  location: string
  tier: string
  price: string
  status: string
  code: string
}
const TICKETS: Ticket[] = [
  {
    id: "tkt_001",
    event: "Sunset Rooftop Mixer",
    date: "Sep 28, 2026 • 6:00 PM",
    location: "Street 51, BKK1",
    tier: "VIP",
    price: "$25",
    status: "Active",
    code: "EV-9F2K1",
  },
  {
    id: "tkt_002",
    event: "Phnom Penh Jazz Night",
    date: "Oct 10, 2026 • 7:00 PM",
    location: "Street 240, Daun Penh",
    tier: "General",
    price: "$15",
    status: "Active",
    code: "EV-7HX4Q",
  },
  {
    id: "tkt_003",
    event: "Frontend & AI Dev Meetup",
    date: "Oct 15, 2026 • 6:30 PM",
    location: "Online & Raintree",
    tier: "Free",
    price: "$0",
    status: "Active",
    code: "EV-2M8TZ",
  },
]

const HOSTED_EVENTS = [
  {
    id: "hst_001",
    title: "Sunset Rooftop Mixer",
    date: "Sep 28, 2026",
    location: "Street 51, BKK1",
    confirmed: 42,
    capacity: 50,
    status: "Live",
    image:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "hst_002",
    title: "Vinyl Nights: Soul & Funk",
    date: "Oct 05, 2026",
    location: "Eden Bar, Daun Penh",
    confirmed: 28,
    capacity: 40,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "hst_003",
    title: "Cambodian Art Walk",
    date: "Oct 18, 2026",
    location: "Chaktomuk Theatre",
    confirmed: 61,
    capacity: 80,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&auto=format&fit=crop&q=80",
  },
]

const SAVED_EVENTS = [
  {
    id: "sav_001",
    title: "Khmer Classical Dance & Arts",
    date: "Oct 24, 2026",
    location: "Chaktomuk Theatre",
    category: "Cultural & Arts",
    image:
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "sav_002",
    title: "Street Food & Craft Beer Festival",
    date: "Oct 12, 2026",
    location: "Koh Pich, Phnom Penh",
    category: "Food & Drink",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "sav_003",
    title: "Frontend & AI Dev Meetup 2026",
    date: "Oct 15, 2026",
    location: "Online & Raintree",
    category: "Tech & Startups",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80",
  },
]

const RECENT_ACTIVITY = [
  {
    id: "act_001",
    icon: Ticket,
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    title: "Ticket purchased",
    description: "Sunset Rooftop Mixer • VIP",
    time: "2 hours ago",
  },
  {
    id: "act_002",
    icon: CalendarDays,
    tint: "bg-primary/10 text-primary",
    title: "Event published",
    description: "Vinyl Nights: Soul & Funk went live",
    time: "Yesterday",
  },
  {
    id: "act_003",
    icon: Bookmark,
    tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    title: "Saved event",
    description: "Street Food & Craft Beer Festival",
    time: "3 days ago",
  },
  {
    id: "act_004",
    icon: Users,
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "New follower",
    description: "Dara Sok started following you",
    time: "1 week ago",
  },
]

export function ProfileDetail({
  user = DEFAULT_USER,
  onBack,
  onEditProfile,
  className,
}: ProfileDetailProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  const [isEditing, setIsEditing] = React.useState(false)

  const avatarWithOverlay = (
    <div className="group/avatar relative shrink-0">
      <Avatar size="lg" className="size-20 ring-4 ring-background md:size-24">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-sky-500/20 text-xl font-bold text-primary md:text-2xl">
          {initials}
        </AvatarFallback>
        <AvatarBadge className="size-3.5 bg-emerald-500" />
      </Avatar>
      {isEditing && (
        <button
          type="button"
          aria-label="Change profile photo"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/50 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100"
        >
          <Camera className="size-5" />
        </button>
      )}
    </div>
  )

  return (
    <div className={cn("space-y-8", className)}>
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
          <Shield className="size-3 text-emerald-500" />
          Verified account
        </Badge>
      </div>

      {/* Profile Hero Card */}
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card [--card-spacing:--spacing(6)]">
        {/* Cover banner */}
        <div className="relative h-28 overflow-hidden bg-linear-to-r from-primary via-indigo-500 to-sky-400 md:h-36">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-linear-to-b from-white/10 to-transparent opacity-40 blur-2xl" />
          <div className="absolute bottom-0 left-5 flex h-full items-end pb-3 text-[4.5rem] leading-none font-bold tracking-tight text-white/10 select-none md:left-8 md:text-[7rem]">
            {initials}
          </div>
          {onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              aria-label="Upload cover photo"
              className="absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <UploadCloud className="size-4" />
            </button>
          )}
        </div>

        <CardContent className="pt-14 pb-6">
          {/* Avatar row */}
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
              {avatarWithOverlay}
              <div className="flex flex-col gap-1.5 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span>{user.rating ?? "4.9"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="gap-1.5 bg-primary/10 text-primary">
                    <Sparkles className="size-3" />
                    {user.role || "Event Planner"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Member since {user.memberSince}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {user.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {user.location}
                    </span>
                  )}
                  {user.website && (
                    <span className="inline-flex items-center gap-1">
                      <LinkIcon className="size-3.5" />
                      {user.website.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-1">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full font-semibold"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <Pencil className="size-3.5" />
                {isEditing ? "Preview Profile" : "Edit Profile"}
              </Button>
              <Button size="sm" className="gap-1.5 rounded-full font-semibold" onClick={onEditProfile}>
                <ArrowRight className="size-3.5" />
                Organizer Hub
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:border-primary/30"
                >
                  <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", stat.tint)}>
                    <Icon className="size-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg leading-tight font-bold tabular-nums text-foreground">
                      {user[stat.valueKey] ?? 0}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="h-auto w-full gap-1 rounded-full bg-muted/60 p-1 sm:w-fit">
          <TabsTrigger value="overview" className="gap-1.5 rounded-full data-active:bg-background">
            <User className="size-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-1.5 rounded-full data-active:bg-background">
            <Ticket className="size-4" />
            My Tickets
            <span className="ml-0.5 rounded-full bg-muted-foreground/15 px-1.5 text-[11px]">
              {user.ticketsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="hosted" className="gap-1.5 rounded-full data-active:bg-background">
            <CalendarDays className="size-4" />
            Hosted Events
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1.5 rounded-full data-active:bg-background">
            <Bookmark className="size-4" />
            Saved
            <span className="ml-0.5 rounded-full bg-muted-foreground/15 px-1.5 text-[11px]">
              {user.savedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ---- Overview ---- */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            {/* About / bio */}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {isEditing ? "Edit Profile" : "About me"}
                </CardTitle>
                <CardAction>
                  <Badge variant="secondary" className="text-[11px]">
                    Public
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full name</Label>
                      <Input id="profile-name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-bio">Bio</Label>
                      <Textarea
                        id="profile-bio"
                        defaultValue={user.bio}
                        rows={4}
                        className="resize-none rounded-2xl"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="profile-location">Location</Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <MapPin className="size-3.5" />
                          </InputGroupAddon>
                          <InputGroupInput id="profile-location" defaultValue={user.location} />
                        </InputGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-website">Website</Label>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            <LinkIcon className="size-3.5" />
                          </InputGroupAddon>
                          <InputGroupInput id="profile-website" defaultValue={user.website} />
                        </InputGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <InputGroup>
                        <InputGroupAddon align="inline-start" className="rounded-full">
                          <span className="text-xs font-semibold">KH</span>
                        </InputGroupAddon>
                        <InputGroupInput id="profile-phone" defaultValue={user.phone} />
                      </InputGroup>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="gap-1.5 font-semibold" onClick={() => setIsEditing(false)}>
                        <Edit className="size-3.5" />
                        Save changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {user.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent activity */}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
                <CardAction>
                  <Badge variant="secondary" className="gap-1 text-[11px]">
                    <Clock className="size-3" />
                    Live
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-1">
                {RECENT_ACTIVITY.map((act, idx) => {
                  const Icon = act.icon
                  return (
                    <React.Fragment key={act.id}>
                      <div className="flex items-start gap-3 py-1.5">
                        <div
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                            act.tint
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {act.title}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {act.description}
                          </span>
                        </div>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {act.time}
                        </span>
                      </div>
                      {idx < RECENT_ACTIVITY.length - 1 && <Separator />}
                    </React.Fragment>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming events preview */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">My next event</CardTitle>
              <CardAction>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Manage hub <ArrowRight className="size-3" />
                </button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <HostedEventCard event={HOSTED_EVENTS[0]} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- Tickets ---- */}
        <TabsContent value="tickets" className="mt-4 space-y-3">
          {TICKETS.map((ticket) => (
            <Card key={ticket.id} size="sm" className="transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Ticket className="size-5" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-bold text-foreground">
                        {ticket.event}
                      </span>
                      <Badge className="bg-amber-400/15 text-[10px] text-amber-600 dark:text-amber-400">
                        {ticket.tier}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {ticket.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {ticket.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <div className="text-base font-bold text-foreground">{ticket.price}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">
                      {ticket.code}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full font-semibold">
                    View ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ---- Hosted events ---- */}
        <TabsContent value="hosted" className="mt-4 space-y-4">
          {HOSTED_EVENTS.map((event) => (
            <HostedEventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        {/* ---- Saved events ---- */}
        <TabsContent value="saved" className="mt-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAVED_EVENTS.map((event) => (
              <div
                key={event.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-2.5 right-2.5 shadow-sm">
                    {event.category}
                  </Badge>
                  <button
                    type="button"
                    aria-label="Remove from saved"
                    className="absolute top-2.5 left-2.5 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                  >
                    <Bookmark className="size-3.5 fill-current" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="font-semibold text-foreground transition-colors group-hover:text-primary">
                    {event.title}
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {event.location}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto w-full rounded-full font-semibold"
                  >
                    View event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact strip */}
      <Card size="sm" className="border-dashed">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" />
              {user.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              {user.location}
            </span>
            {user.phone && (
              <span className="inline-flex items-center gap-1.5">
                <UploadCloud className="size-3.5 text-primary" />
                {user.phone}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full font-semibold">
            <Mail className="size-3.5" />
            Contact {user.name.split(" ")[0]}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function HostedEventCard({ event }: { event: (typeof HOSTED_EVENTS)[number] }) {
  const statusTint =
    event.status === "Live"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : event.status === "Published"
        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
        : "bg-muted text-muted-foreground"

  return (
    <Card
      size="sm"
      className="overflow-hidden transition-colors hover:border-primary/30"
    >
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-44">
          <img src={event.image} alt={event.title} className="size-full object-cover" />
          <Badge className={cn("absolute top-2 right-2 text-[10px]", statusTint)}>
            {event.status}
          </Badge>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-1">
            <span className="truncate text-sm font-bold text-foreground">
              {event.title}
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                {event.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            </span>
          </div>
          <Progress
            value={event.confirmed}
            max={event.capacity}
            className="gap-1.5 **:data-[slot=progress-indicator]:bg-sky-400 **:data-[slot=progress-track]:h-1.5"
          >
            <ProgressLabel className="text-[11px] text-muted-foreground">
              Confirmed
            </ProgressLabel>
            <ProgressValue className="text-[11px] tabular-nums">
              {(_, value) => `${value}/${event.capacity}`}
            </ProgressValue>
          </Progress>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              {Math.round((event.confirmed / event.capacity) * 100)}% capacity filled
            </span>
            <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold text-primary">
              Manage <ArrowRight className="size-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileDetail