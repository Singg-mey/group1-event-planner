import * as React from "react"
import {
  CalendarDays,
  Search,
  Sparkles,
  Ticket,
  Bookmark,
  CalendarPlus,
  Settings,
  LogOut,
  User,
  Music,
  Laptop,
  Palette,
  Utensils,
  Moon,
  Sun,
  Monitor,
  Menu,
  X,
  Compass,
  ChevronRight,
  HelpCircle,
} from "lucide-react"
import { cn } from "cn"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"

export interface NavUser {
  name: string
  email: string
  avatarUrl?: string
  role?: string
  ticketsCount?: number
}

export interface NavbarProps {
  user?: NavUser
  activeItem?: string
  onNavigate?: (item: string, eventType?: string) => void
  onSearch?: (query: string) => void
  className?: string
}

// Sample events for live search suggestions
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

const EVENT_CATEGORIES = [
  {
    title: "Music & Concerts",
    href: "#find-event-music",
    description:
      "Live jazz, acoustic sessions, electronic festivals & indie gigs.",
    icon: Music,
    color: "text-amber-500 dark:text-amber-400 bg-amber-500/10",
  },
  {
    title: "Tech & Hackathons",
    href: "#find-event-tech",
    description: "Developer meetups, AI workshops, product demos & tech talks.",
    icon: Laptop,
    color: "text-blue-500 dark:text-blue-400 bg-blue-500/10",
  },
  {
    title: "Arts & Culture",
    href: "#find-event-arts",
    description:
      "Classical dance, art galleries, film screenings & exhibitions.",
    icon: Palette,
    color: "text-rose-500 dark:text-rose-400 bg-rose-500/10",
  },
  {
    title: "Food & Nightlife",
    href: "#find-event-food",
    description: "Street food fests, chef popups, rooftop DJs & social mixers.",
    icon: Utensils,
    color: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10",
  },
]

const CREATE_OPTIONS = [
  {
    title: "Host In-Person Event",
    description:
      "Reserve a physical venue, manage door tickets & seated guests.",
    icon: CalendarPlus,
    href: "#create-physical",
  },
  {
    title: "Host Online Event",
    description:
      "Stream live on Zoom/Meet, automated reminders & calendar sync.",
    icon: Laptop,
    href: "#create-virtual",
  },
  {
    title: "Drafts & Templates",
    description:
      "Quickly start from recurring templates or your recent drafts.",
    icon: Sparkles,
    href: "#create-templates",
  },
]

export function Navbar({
  user = {
    name: "Alex Morgan",
    email: "alex.morgan@eventplanner.io",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Event Organizer",
    ticketsCount: 3,
  },
  activeItem = "Home",
  onNavigate,
  onSearch,
  className,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const searchContainerRef = React.useRef<HTMLDivElement>(null)

  const { theme, setTheme } = useTheme()

  // Filtered live events for search bar suggestion
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

  // Keyboard shortcut (Cmd/Ctrl + K) to focus search
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

  // Close search suggestion popup when clicking outside
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearch) onSearch(val)
  }

  const handleItemClick = (name: string, href?: string, eventType?: string) => {
    if (onNavigate) onNavigate(name, eventType)
    setMobileMenuOpen(false)
    if (href && href.startsWith("#")) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-colors duration-200 supports-backdrop-filter:bg-background/70",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <a
            href="#home"
            onClick={() => handleItemClick("Home", "#home")}
            className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
            aria-label="Event Planner Home"
          >
            <div className="flex size-9.5 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-sky-400 text-white shadow-md shadow-primary/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
              <CalendarDays className="size-5 transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                  Evently
                </span>
              </div>
              <span className="-mt-1 hidden text-[11px] font-medium text-muted-foreground sm:block">
                Discover & Organize
              </span>
            </div>
          </a>

          {/* Desktop Navigation using Shadcn Navigation Component */}
          <div className="hidden lg:flex">
            <NavigationMenu align="start">
              <NavigationMenuList className="gap-1">
                {/* 1. Home Item */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#home"
                    onClick={() => handleItemClick("Home", "#home")}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      activeItem === "Home"
                        ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 2. Find Event (Interactive Dropdown with Categories) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      activeItem === "Find Event"
                        ? "bg-accent/80 font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Find Event
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[500px] p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 flex items-center justify-between border-b border-border/50 pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          <Compass className="size-3.5 text-primary" />
                          Explore by Category
                        </div>
                        <a
                          href="#find-event-all"
                          onClick={() =>
                            handleItemClick(
                              "Find Event",
                              "#find-event-all",
                              "All Categories"
                            )
                          }
                          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          All Events <ChevronRight className="size-3" />
                        </a>
                      </div>

                      {EVENT_CATEGORIES.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <NavigationMenuLink
                            key={cat.title}
                            href={cat.href}
                            onClick={() =>
                              handleItemClick("Find Event", cat.href, cat.title)
                            }
                            className="group flex flex-col items-start gap-1 rounded-xl p-2.5 transition-colors hover:bg-muted/70 focus:bg-muted/70"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex size-7 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                                  cat.color
                                )}
                              >
                                <Icon className="size-4" />
                              </div>
                              <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                                {cat.title}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
                              {cat.description}
                            </p>
                          </NavigationMenuLink>
                        )
                      })}
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 p-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-500" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Trending in Phnom Penh this weekend
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-medium"
                      >
                        6 Live
                      </Badge>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. Create Event (Interactive Dropdown / Direct Link) */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      activeItem === "Create Event"
                        ? "bg-accent/80 font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Create Event
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[380px] p-3">
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Event Creation Suite
                      </div>
                      {CREATE_OPTIONS.map((opt) => {
                        const Icon = opt.icon
                        return (
                          <NavigationMenuLink
                            key={opt.title}
                            href={opt.href}
                            onClick={() =>
                              handleItemClick("Create Event", opt.href)
                            }
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/70 focus:bg-muted/70"
                          >
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                                {opt.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {opt.description}
                              </div>
                            </div>
                          </NavigationMenuLink>
                        )
                      })}
                    </div>
                    <div className="mt-2 border-t border-border/50 pt-2">
                      <Button
                        size="sm"
                        className="w-full justify-center gap-2 font-medium"
                        onClick={() =>
                          handleItemClick("Create Event", "#create-new")
                        }
                      >
                        <CalendarPlus className="size-4" />
                        Start New Event Wizard
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 4. About Item */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#about"
                    onClick={() => handleItemClick("About", "#about")}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      activeItem === "About"
                        ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Center/Right: Search Bar & Profile Avatar */}
        <div className="flex items-center gap-3">
          {/* 5. Search Bar */}
          <div
            ref={searchContainerRef}
            className="relative hidden w-48 transition-all duration-200 focus-within:w-60 sm:block md:w-64 md:focus-within:w-80 lg:w-72"
          >
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search events, tags..."
                className="h-9 w-full rounded-full bg-muted/50 pr-12 pl-9 text-sm transition-all duration-200 hover:bg-muted/80 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    if (onSearch) onSearch("")
                  }}
                  className="absolute right-3 flex size-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-2.5 hidden items-center gap-0.5 rounded border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs select-none md:inline-flex">
                  <span>⌘</span>K
                </kbd>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[300px] animate-in overflow-hidden rounded-2xl border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-md transition-all fade-in-0 zoom-in-95">
                <div className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Events ({filteredEvents.length})
                </div>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-1">
                    {filteredEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(event.title)
                          setIsSearchFocused(false)
                          if (onSearch) onSearch(event.title)
                        }}
                        className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors outline-none hover:bg-muted focus:bg-muted"
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
                          className="shrink-0 px-1.5 py-0 text-[10px]"
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

          {/* Quick Create CTA Button (Desktop only) */}
          <Button
            size="sm"
            className="hidden gap-1.5 rounded-full font-semibold shadow-xs xl:inline-flex"
            onClick={() => handleItemClick("Create Event", "#create-new")}
          >
            <CalendarPlus className="size-3.5" />
            <span>Create Event</span>
          </Button>

          {/* 6. Profile Avatar with Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="group relative rounded-full transition-transform outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
              aria-label="User profile menu"
            >
              <Avatar
                size="default"
                className="size-9 ring-2 ring-transparent transition-all group-hover:ring-primary/40 group-data-open:ring-primary"
              >
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                )}
                <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-sky-500/20 font-semibold text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
                <AvatarBadge className="size-2.5 bg-emerald-500 ring-2 ring-background" />
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 p-1.5"
            >
              {/* User Identity Header */}
              <div className="flex items-center gap-3 p-2.5">
                <Avatar size="default" className="size-10">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-primary/10 font-bold text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[10px] font-medium"
                    >
                      {user.role || "Event Planner"}
                    </Badge>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Profile navigation actions */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleItemClick("Profile", "#profile")}
                  className="cursor-pointer"
                >
                  <User className="size-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemClick("Tickets", "#tickets")}
                  className="cursor-pointer"
                >
                  <Ticket className="size-4" />
                  <span>My Tickets</span>
                  {user.ticketsCount !== undefined && user.ticketsCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-auto rounded-full px-1.5 py-0 text-[10px]"
                    >
                      {user.ticketsCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemClick("Saved", "#saved")}
                  className="cursor-pointer"
                >
                  <Bookmark className="size-4" />
                  <span>Saved Events</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleItemClick("Organized", "#organized")}
                  className="cursor-pointer"
                >
                  <CalendarDays className="size-4" />
                  <span>Hosted Events</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Theme Submenu */}
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    {theme === "dark" ? (
                      <Moon className="size-4" />
                    ) : theme === "light" ? (
                      <Sun className="size-4" />
                    ) : (
                      <Monitor className="size-4" />
                    )}
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-36">
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className={cn(
                        theme === "light" && "bg-accent font-semibold"
                      )}
                    >
                      <Sun className="size-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className={cn(
                        theme === "dark" && "bg-accent font-semibold"
                      )}
                    >
                      <Moon className="size-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className={cn(
                        theme === "system" && "bg-accent font-semibold"
                      )}
                    >
                      <Monitor className="size-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem
                  onClick={() => handleItemClick("Settings", "#settings")}
                  className="cursor-pointer"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Log out */}
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleItemClick("Logout", "#logout")}
                className="cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-full lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="animate-in border-b border-border bg-background/95 px-4 pt-2 pb-6 backdrop-blur-2xl duration-200 slide-in-from-top-4 lg:hidden">
          {/* Mobile Search input */}
          <div className="relative mt-2 mb-4">
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search events, categories..."
              className="h-10 rounded-xl bg-muted/60 pl-9 text-sm"
            />
          </div>

          {/* Mobile Nav items */}
          <div className="flex flex-col space-y-1">
            <a
              href="#home"
              onClick={() => handleItemClick("Home", "#home")}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeItem === "Home"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <CalendarDays className="size-4" />
              <span>Home</span>
            </a>

            <a
              href="#create-event"
              onClick={() => handleItemClick("Create Event", "#create-event")}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeItem === "Create Event"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <CalendarPlus className="size-4" />
                <span>Create Event</span>
              </div>
              <Badge variant="default" className="px-2 py-0 text-[10px]">
                New
              </Badge>
            </a>

            <a
              href="#find-event"
              onClick={() => handleItemClick("Find Event", "#find-event")}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeItem === "Find Event"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Compass className="size-4" />
              <span>Find Event</span>
            </a>

            {/* Mobile Category Quick Chips */}
            <div className="ml-7 flex flex-wrap gap-1.5 py-1">
              {EVENT_CATEGORIES.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  onClick={() => handleItemClick("Find Event", c.href, c.title)}
                  className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {c.title.split(" ")[0]}
                </a>
              ))}
            </div>

            <a
              href="#about"
              onClick={() => handleItemClick("About", "#about")}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeItem === "About"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <HelpCircle className="size-4" />
              <span>About</span>
            </a>
          </div>

          {/* Mobile Profile & Theme actions */}
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <Avatar size="sm" className="size-8">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="text-xs">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {user.ticketsCount} tickets available
                  </span>
                </div>
              </div>

              {/* Theme toggle icon button on mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 gap-1.5 rounded-full px-2.5 text-xs font-medium"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="size-3.5" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="size-3.5" /> Dark
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
