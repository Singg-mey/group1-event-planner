import * as React from "react"
import { Camera, Mail, MapPin, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface EditProfileFormData {
  name: string
  username: string
  bio: string
  location: string
  email: string
  avatarUrl?: string
}

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<EditProfileFormData>
  onSave?: (data: EditProfileFormData) => void
}

export function EditProfileModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditProfileModalProps) {
  const [fullName, setFullName] = React.useState(initialData?.name ?? "Chuonchetra Chuot")
  const [username, setUsername] = React.useState(initialData?.username ?? "chuonchetra")
  const [bio, setBio] = React.useState(
    initialData?.bio ??
      "Event organizer & party enthusiast in Phnom Penh. Bringing people together through music and nightlife gatherings."
  )
  const [location, setLocation] = React.useState(initialData?.location ?? "Phnom Penh, Cambodia")
  const [email, setEmail] = React.useState(initialData?.email ?? "chuonchetra@example.com")
  const [avatarUrl, setAvatarUrl] = React.useState(initialData?.avatarUrl || "")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Sync all internal form states whenever modal opens or initialData changes
  React.useEffect(() => {
    if (open && initialData) {
      if (initialData.name !== undefined) setFullName(initialData.name)
      if (initialData.username !== undefined) setUsername(initialData.username)
      if (initialData.bio !== undefined) setBio(initialData.bio)
      if (initialData.location !== undefined) setLocation(initialData.location)
      if (initialData.email !== undefined) setEmail(initialData.email)
      setAvatarUrl(initialData.avatarUrl || "")
    }
  }, [open, initialData])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setAvatarUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({
      name: fullName.trim() || "User",
      username: username.trim().replace(/^@/, ""),
      bio: bio.trim(),
      location: location.trim(),
      email: email.trim(),
      avatarUrl,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[460px] gap-0 overflow-hidden rounded-[22px] border border-border/80 bg-background p-6 shadow-2xl sm:max-w-[480px]"
        showClose={false}
      >
        {/* Custom Header with close button */}
        <div className="flex items-start justify-between pb-5">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Update your personal details and public profile info
            </DialogDescription>
          </DialogHeader>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4.5">
          {/* Avatar & Photo card surface */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/35 p-4 sm:gap-5 sm:p-5">
            {/* Avatar Preview */}
            <div className="relative shrink-0">
              <div className="relative flex size-18 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-slate-200 shadow-xs dark:bg-slate-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
                    {(fullName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Camera icon badge */}
              <button
                type="button"
                onClick={handleUploadClick}
                title="Change photo"
                className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-[#3b5bf5] text-white shadow-md ring-2 ring-background transition-transform hover:scale-105 hover:bg-[#2f4ee0] active:scale-95"
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            {/* Upload / Remove Actions */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="rounded-lg border border-border/80 bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted"
                >
                  Upload photo
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs font-semibold text-rose-500 transition-colors hover:text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground sm:text-xs">
                Recommended square JPG, PNG max 5MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile image"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="edit-full-name"
                className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
              >
                Full Name
              </label>
              <input
                id="edit-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Chuonchetra Chuot"
                required
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-2xs transition-all outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            {/* Username / Handle */}
            <div className="space-y-1.5">
              <label
                htmlFor="edit-username"
                className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
              >
                Username / Handle
              </label>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-input bg-background shadow-2xs transition-all focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <div className="flex items-center justify-center border-r border-input bg-muted/30 px-3.5 text-sm font-medium text-muted-foreground select-none">
                  @
                </div>
                <input
                  id="edit-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="chuonchetra"
                  className="flex-1 border-none bg-transparent px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="edit-bio"
                  className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
                >
                  Bio
                </label>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {bio.length} / 250
                </span>
              </div>
              <textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={250}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm text-foreground shadow-2xs transition-all outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label
                htmlFor="edit-location"
                className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
              >
                Location
              </label>
              <div className="relative flex items-center">
                <MapPin className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
                <input
                  id="edit-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Phnom Penh, Cambodia"
                  className="w-full rounded-xl border border-input bg-background pr-3.5 pl-10 py-2.5 text-sm text-foreground shadow-2xs transition-all outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="edit-email"
                className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
              >
                Contact Email
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
                <input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chuonchetra@example.com"
                  className="w-full rounded-xl border border-input bg-background pr-3.5 pl-10 py-2.5 text-sm text-foreground shadow-2xs transition-all outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#3b5bf5] px-5 py-2 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#2f4ee0] active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}