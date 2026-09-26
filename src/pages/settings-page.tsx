import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Bell,
  Check,
  Globe,
  Key,
  Laptop,
  LogOut,
  Moon,
  Pencil,
  Shield,
  Sparkles,
  Sun,
  Trash2,
  User,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { EditProfileModal } from "@/components/edit-profile-modal"
import { useUserProfile } from "@/data/user"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/components/theme-provider"

export function SettingsPage() {
  const navigate = useNavigate()
  const [profile, saveProfile] = useUserProfile()
  const { signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  // Notification toggles
  const [eventReminders, setEventReminders] = React.useState(true)
  const [ticketUpdates, setTicketUpdates] = React.useState(true)
  const [announcements, setAnnouncements] = React.useState(false)
  const [weeklyDigest, setWeeklyDigest] = React.useState(true)

  // Privacy toggles
  const [publicProfile, setPublicProfile] = React.useState(true)
  const [showTicketsPublic, setShowTicketsPublic] = React.useState(false)

  // Password state
  const [passwordSaved, setPasswordSaved] = React.useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  const handleLogout = () => {
    void signOut()
    setIsLogoutModalOpen(false)
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem="Settings" />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Back and Page Header */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div>
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                Settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your account credentials, notifications, appearance, and privacy.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogoutModalOpen(true)}
              className="gap-1.5 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" />
              Log out
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Account Profile Summary */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <User className="size-4 text-primary" />
                Account & Profile
              </CardTitle>
              <CardDescription>
                Your public profile and contact information across EventPlanner.
              </CardDescription>
              <CardAction>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                  className="gap-1.5 rounded-full font-semibold"
                >
                  <Pencil className="size-3.5" />
                  Edit Profile
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" className="size-14 ring-2 ring-primary/20">
                    {profile.avatarUrl ? (
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                    <AvatarBadge className="size-3 bg-emerald-500 ring-2 ring-background" />
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{profile.name}</span>
                      <Badge className="bg-primary/10 text-primary text-[10px]">
                        {profile.role || "Event Organizer"}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">@{profile.username}</span>
                    <span className="text-xs text-muted-foreground">{profile.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-right">
                  <span>{profile.location || "Phnom Penh, Cambodia"}</span>
                </div>
              </div>

              {/* Regional Preferences */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Language
                  </Label>
                  <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm">
                    <span className="flex items-center gap-2">
                      <Globe className="size-4 text-muted-foreground" />
                      English (United States)
                    </span>
                    <Badge variant="secondary" className="text-[10px]">Default</Badge>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Timezone
                  </Label>
                  <div className="flex items-center justify-between rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm">
                    <span className="truncate">Indochina Time (ICT) • GMT+7</span>
                    <span className="text-xs text-muted-foreground">Phnom Penh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Appearance & Theme */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="size-4 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how EventPlanner looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Light theme tile */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-all ${
                    theme === "light"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Sun className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">Light</span>
                  <span className="text-xs text-muted-foreground">Clean, high-contrast day theme</span>
                </button>

                {/* Dark theme tile */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-all ${
                    theme === "dark"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Moon className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">Dark</span>
                  <span className="text-xs text-muted-foreground">Sleek, low-light evening theme</span>
                </button>

                {/* System theme tile */}
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-all ${
                    theme === "system"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Laptop className="size-5" />
                  </div>
                  <span className="text-sm font-semibold">System</span>
                  <span className="text-xs text-muted-foreground">Follows your OS appearance</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Notification Preferences */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Bell className="size-4 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about your upcoming tickets and events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Event Reminders</div>
                  <div className="text-xs text-muted-foreground">
                    Receive alert emails 24 hours and 2 hours before events you hold tickets for.
                  </div>
                </div>
                <Switch checked={eventReminders} onCheckedChange={setEventReminders} />
              </div>
              <Separator />

              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Ticket & Purchase Updates</div>
                  <div className="text-xs text-muted-foreground">
                    Instant receipts, QR code delivery, and admission status changes.
                  </div>
                </div>
                <Switch checked={ticketUpdates} onCheckedChange={setTicketUpdates} />
              </div>
              <Separator />

              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Organizer Announcements</div>
                  <div className="text-xs text-muted-foreground">
                    Direct messages and schedule updates from hosts of events you attend.
                  </div>
                </div>
                <Switch checked={announcements} onCheckedChange={setAnnouncements} />
              </div>
              <Separator />

              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Phnom Penh Weekend Digest</div>
                  <div className="text-xs text-muted-foreground">
                    A curated Friday email with top rooftop mixers, gigs, and tech meetups.
                  </div>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Privacy & Security */}
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Shield className="size-4 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your credentials, active sessions, and public visibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Public Profile Visibility</div>
                  <div className="text-xs text-muted-foreground">
                    Allow other attendees and organizers to view your bio and hosted events.
                  </div>
                </div>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>
              <Separator />

              <div className="flex items-center justify-between gap-4 py-1">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold text-foreground">Show Tickets on Profile</div>
                  <div className="text-xs text-muted-foreground">
                    Display badge count of events you are attending on your profile card.
                  </div>
                </div>
                <Switch checked={showTicketsPublic} onCheckedChange={setShowTicketsPublic} />
              </div>
              <Separator />

              {/* Password update form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                  <Key className="size-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Change Password</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="curr-pwd" className="text-xs text-muted-foreground">Current Password</Label>
                    <Input id="curr-pwd" type="password" placeholder="••••••••" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="new-pwd" className="text-xs text-muted-foreground">New Password</Label>
                    <Input id="new-pwd" type="password" placeholder="••••••••" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pwd" className="text-xs text-muted-foreground">Confirm New Password</Label>
                    <Input id="confirm-pwd" type="password" placeholder="••••••••" required />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  {passwordSaved ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <Check className="size-3.5" /> Password updated successfully!
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Minimum 8 characters with numbers & symbols</span>
                  )}
                  <Button type="submit" size="sm" className="rounded-xl font-semibold">
                    Update Password
                  </Button>
                </div>
              </form>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-3 pt-1">
                <div className="text-sm font-semibold">Active Sessions</div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-background border border-border text-foreground">
                      <Laptop className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">
                        Chrome on Windows (Current Session)
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Phnom Penh, Cambodia • Active now
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] text-emerald-600 font-semibold">
                    Current
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Danger Zone */}
          <Card size="sm" className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-destructive">
                <Trash2 className="size-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible account actions. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Log out from all sessions</div>
                  <div className="text-xs text-muted-foreground">
                    Signs out your account from all browsers and mobile devices.
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-3.5" />
                  Log out
                </Button>
              </div>

              <Separator className="bg-destructive/20" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-destructive">Delete Account</div>
                  <div className="text-xs text-muted-foreground">
                    Permanently delete your profile, hosted events, and saved tickets.
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="rounded-xl font-semibold"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer className="mt-auto" />

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={{
          name: profile.name,
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
        }}
        onSave={(data) => {
          saveProfile(data)
        }}
      />

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="max-w-[400px] rounded-2xl p-6" showClose={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <LogOut className="size-6" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-lg font-bold">Log out of Evently?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-center">
                You will need to sign back in to access your tickets, organized events, and profile settings.
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
                className="flex-1 rounded-xl font-semibold"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-[420px] rounded-2xl p-6" showClose={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <Trash2 className="size-6" />
            </div>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-lg font-bold text-destructive">Delete your account?</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-center">
                This action is permanent and cannot be undone. All your booked passes, events, and profile data will be permanently wiped.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full items-center gap-2 pt-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Keep Account
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl font-semibold"
                onClick={() => {
                  void signOut()
                  setIsDeleteModalOpen(false)
                  navigate("/")
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SettingsPage
