import {
  Bookmark,
  CalendarDays,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  Ticket,
  User,
} from "lucide-react"
import { cn } from "cn"

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { NavItemClick, NavUser, ThemeName } from "./types"

export function ProfileMenu({
  user,
  theme,
  onThemeChange,
  onNav,
}: {
  user: NavUser
  theme: ThemeName
  onThemeChange: (theme: ThemeName) => void
  onNav: NavItemClick
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group relative rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
        aria-label="User profile menu"
      >
        <Avatar
          size="default"
          className="size-9 ring-2 ring-transparent transition-all group-hover:ring-primary/40 group-data-open:ring-primary"
        >
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-sky-500/20 font-semibold text-primary">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
          <AvatarBadge className="size-2.5 bg-emerald-500 ring-2 ring-background" />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <div className="flex items-center gap-3 p-2.5">
          <Avatar size="default" className="size-10">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
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
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">
                {user.role || "Event Planner"}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onNav("Profile", "#profile")}
            className="cursor-pointer"
          >
            <User className="size-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onNav("Tickets", "#tickets")}
            className="cursor-pointer"
          >
            <Ticket className="size-4" />
            <span>My Tickets</span>
            {user.ticketsCount !== undefined && user.ticketsCount > 0 && (
              <Badge variant="default" className="ml-auto rounded-full px-1.5 py-0 text-[10px]">
                {user.ticketsCount}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onNav("Saved", "#saved")}
            className="cursor-pointer"
          >
            <Bookmark className="size-4" />
            <span>Saved Events</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onNav("Organized", "#organized")}
            className="cursor-pointer"
          >
            <CalendarDays className="size-4" />
            <span>Hosted Events</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

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
                onClick={() => onThemeChange("light")}
                className={cn(theme === "light" && "bg-accent font-semibold")}
              >
                <Sun className="size-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onThemeChange("dark")}
                className={cn(theme === "dark" && "bg-accent font-semibold")}
              >
                <Moon className="size-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onThemeChange("system")}
                className={cn(theme === "system" && "bg-accent font-semibold")}
              >
                <Monitor className="size-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => onNav("Settings", "#settings")}
            className="cursor-pointer"
          >
            <Settings className="size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onNav("Logout", "#logout")}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}