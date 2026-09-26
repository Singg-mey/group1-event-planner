import * as React from "react"
import {
  Bookmark,
  CalendarDays,
  LogOut,
  Monitor,
  Moon,
  Pencil,
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { useUserProfile } from "@/data/user"
import { useAuth } from "@/hooks/use-auth"

import type { NavItemClick, NavUser, ThemeName } from "./types"

const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"

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
  const [profile, saveProfile] = useUserProfile()
  const { isSignedIn, signOut } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)

  // Fallback chain: profile state -> user prop -> default picture URL
  const currentAvatarUrl = profile?.avatarUrl || user?.avatarUrl || DEFAULT_AVATAR_URL
  const currentName = profile?.name || user?.name || "User"

  if (!isSignedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full gap-2 px-3.5 h-9 font-semibold text-xs border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-xs"
        onClick={() => onNav("Sign In")}
      >
        <User className="size-3.5 text-primary" />
        <span>Sign In</span>
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="group relative flex items-center justify-center shrink-0 rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
          aria-label="User profile menu"
        >
          <Avatar
            size="default"
            className="size-9 shrink-0 ring-2 ring-transparent transition-all group-hover:ring-primary/40 group-data-open:ring-primary"
          >
            <AvatarImage src={currentAvatarUrl} alt={currentName} />
            <AvatarFallback className="bg-gradient-to-tr from-primary/20 to-sky-500/20 font-semibold text-primary">
              {currentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
            <AvatarBadge className="size-2.5 bottom-0.5 right-0.5 bg-emerald-500 ring-2 ring-background" />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
          <div
            onClick={() => setIsEditModalOpen(true)}
            className="group/card flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/50"
            title="Click to edit profile"
          >
            <Avatar size="default" className="size-10 shrink-0">
              <AvatarImage src={currentAvatarUrl} alt={currentName} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {currentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-sm font-semibold text-foreground">
                  {currentName}
                </span>
                <Pencil className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100" />
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {profile?.email || user?.email}
              </span>
              <div className="mt-1">
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">
                  {user?.role || "Event Planner"}
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
              onClick={() => setIsEditModalOpen(true)}
              className="cursor-pointer"
            >
              <Pencil className="size-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onNav("Tickets", "#tickets")}
              className="cursor-pointer"
            >
              <Ticket className="size-4" />
              <span>My Tickets</span>
              {user?.ticketsCount !== undefined && user.ticketsCount > 0 && (
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
              onClick={() => onNav("My Events", "/my-events")}
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
              onClick={() => onNav("Settings", "/settings")}
              className="cursor-pointer"
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsLogoutModalOpen(true)}
            className="cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={{
          name: currentName,
          username: profile?.username ?? "chuonchetra",
          bio: profile?.bio ?? "",
          location: profile?.location ?? "",
          email: profile?.email || user?.email,
          avatarUrl: currentAvatarUrl,
        }}
        onSave={(updated) => {
          saveProfile({
            name: updated.name,
            username: updated.username,
            bio: updated.bio,
            location: updated.location,
            email: updated.email,
            avatarUrl: updated.avatarUrl,
          })
        }}
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="max-w-[380px] rounded-2xl p-6" showClose={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <LogOut className="size-6" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-lg font-bold">Log out of your account?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-center">
                You will need to sign back in to book passes, manage events, or view your saved bookmarks.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full items-center gap-2 pt-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl font-semibold shadow-xs"
                onClick={() => {
                  void signOut()
                  setIsLogoutModalOpen(false)
                  onNav("Logout", "#logout")
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}