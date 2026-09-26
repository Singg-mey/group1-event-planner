import {
  CalendarDays,
  CalendarPlus,
  Compass,
  HelpCircle,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logoutUser } from "@/data/user"

import { EVENT_CATEGORIES } from "./data"
import type { NavItemClick, NavUser, ThemeName } from "./types"

export function MobileMenu({
  user,
  activeItem,
  theme,
  searchQuery,
  onSearchChange,
  onToggleTheme,
  onNav,
}: {
  user: NavUser
  activeItem?: string
  theme: ThemeName
  searchQuery: string
  onSearchChange: (value: string) => void
  onToggleTheme: () => void
  onNav: NavItemClick
}) {
  return (
    <div className="animate-in border-b border-border bg-background/95 px-4 pt-2 pb-6 backdrop-blur-2xl duration-200 slide-in-from-top-4 lg:hidden">
      <div className="relative mt-2 mb-4">
        <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events, categories..."
          className="h-10 rounded-xl bg-muted/60 pl-9 text-sm"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <a
          href="#home"
          onClick={(e) => onNav("Home", "#home", e)}
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
          onClick={(e) => onNav("Create Event", "#create-event", e)}
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
          onClick={(e) => onNav("Find Event", "#find-event", e)}
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

        <div className="ml-7 flex flex-wrap gap-1.5 py-1">
          {EVENT_CATEGORIES.map((c) => (
            <a
              key={c.title}
              href={c.href}
              onClick={(e) => onNav("Find Event", c.href, e, c.title)}
              className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {c.title.split(" ")[0]}
            </a>
          ))}
        </div>

        <a
          href="/about"
          onClick={(e) => onNav("About", "/about", e)}
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

      <div className="mt-4 border-t border-border pt-4">
        {user.isLoggedIn === false ? (
          <div className="flex items-center justify-between px-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                window.location.href = "/sign-in"
              }}
              className="gap-2 rounded-full px-4 text-xs font-semibold shadow-xs"
            >
              <User className="size-3.5" />
              <span>Sign In</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleTheme}
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
        ) : (
          <div className="space-y-3 px-2">
            <div className="flex items-center justify-between">
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

              <Button
                variant="outline"
                size="sm"
                onClick={onToggleTheme}
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

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-xl text-xs font-medium"
                onClick={(e) => onNav("Profile", "/profile", e)}
              >
                <User className="size-3.5" />
                <span>Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-xl text-xs font-medium"
                onClick={(e) => onNav("Settings", "/settings", e)}
              >
                <Settings className="size-3.5" />
                <span>Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  logoutUser()
                  onNav("Logout", "#logout")
                }}
              >
                <LogOut className="size-3.5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
