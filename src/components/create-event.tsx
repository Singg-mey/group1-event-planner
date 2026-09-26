import * as React from "react"
import {
  CalendarDays,
  Check,
  ImagePlus,
  MapPin,
  Upload,
  User,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserProfile } from "@/data/user"
import { createEvent } from "@/data/events-repository"

export interface CreateEventValues {
  eventName?: string
  category?: string
  city?: string
}

interface CreateEventProps {
  initialValues?: CreateEventValues
  onCreated?: () => void
}

const categories = [
  "Music",
  "Food & Drink",
  "Tech",
  "Arts & Culture",
  "Community",
]

export function CreateEvent({ initialValues, onCreated }: CreateEventProps) {
  const navigate = useNavigate()
  const [profile] = useUserProfile()
  const [visibility, setVisibility] = React.useState<"public" | "private">(
    "public"
  )
  const [coverImage, setCoverImage] = React.useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null)
  const [savedMessage, setSavedMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isLoggedIn = profile.isLoggedIn !== false

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverImage(URL.createObjectURL(file))
      setCoverImageFile(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavedMessage("")
    setErrorMessage("")

    if (!isLoggedIn) {
      setErrorMessage("Please sign in to create an event.")
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)

    try {
      await createEvent({
        title: String(formData.get("eventName") ?? ""),
        category: String(formData.get("category") ?? ""),
        date: String(formData.get("date") ?? ""),
        time: String(formData.get("time") ?? ""),
        location: String(formData.get("location") ?? ""),
        description: String(formData.get("description") ?? ""),
        visibility,
        coverImage: coverImageFile,
      })
      setSavedMessage(
        visibility === "public"
          ? "Public event saved. Everyone can view and join it."
          : "Private event saved. Only you can view and manage it."
      )
      onCreated?.()
      form.reset()
      setCoverImage(null)
      setCoverImageFile(null)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save this event."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Sign in to create an event
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Only signed-in users can publish events. Public events are visible
              to everyone, while private events stay limited to the creator.
            </p>
            <Button
              className="mt-6 rounded-full"
              onClick={() => navigate("/sign-in")}
            >
              Go to sign in
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Create a new event
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the details below. You can edit this anytime.
          </p>
        </div>

        <Card className="border-border/70 shadow-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Event details</CardTitle>
              <CardDescription>
                Give your event the essentials people need to join.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="event-name">Event name</FieldLabel>
                  <Input
                    id="event-name"
                    name="eventName"
                    defaultValue={initialValues?.eventName}
                    placeholder="e.g. Design Systems Summit 2026"
                    required
                  />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="event-category">Category</FieldLabel>
                    <select
                      id="event-category"
                      name="category"
                      defaultValue={initialValues?.category ?? ""}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="event-date">Date</FieldLabel>
                    <Input id="event-date" name="date" type="date" required />
                  </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="event-time">Start time</FieldLabel>
                    <Input id="event-time" name="time" type="time" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="event-location">
                      <MapPin className="size-3.5 text-primary" />
                      Location
                    </FieldLabel>
                    <Input
                      id="event-location"
                      name="location"
                      defaultValue={initialValues?.city}
                      placeholder="Venue or address"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="event-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="event-description"
                    name="description"
                    placeholder="Tell people what makes this event special..."
                    className="min-h-28 resize-y"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cover-image">Cover image</FieldLabel>
                  <label
                    htmlFor="cover-image"
                    className="relative flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/60 bg-primary/5 px-4 text-center transition-colors hover:bg-primary/10"
                  >
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Selected event cover"
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-background text-primary shadow-sm">
                          <ImagePlus className="size-4" />
                        </span>
                        <span className="text-sm font-medium">
                          Drag and drop or click to upload
                        </span>
                        <span className="mt-1 text-xs text-muted-foreground">
                          PNG, JPG or WEBP up to 5MB
                        </span>
                      </>
                    )}
                    <input
                      id="cover-image"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </Field>

                <Field>
                  <FieldLabel>Event visibility</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["public", "private"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setVisibility(option)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${visibility === option ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted/30 hover:border-primary/50"}`}
                      >
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${visibility === option ? "border-primary-foreground bg-primary-foreground text-primary" : "border-muted-foreground"}`}
                        >
                          {visibility === option && (
                            <Check className="size-3" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold capitalize">
                            {option}
                          </span>
                          <span
                            className={`mt-1 block text-xs ${visibility === option ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                          >
                            {option === "public"
                              ? "Everyone can view and join"
                              : "Only you can view and manage this event"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>

            <div className="flex flex-col-reverse gap-3 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <span
                className={`text-sm ${errorMessage ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}
                aria-live="polite"
                role={errorMessage ? "alert" : undefined}
              >
                {errorMessage || savedMessage}
              </span>
              <div className="flex justify-end gap-3 sm:ml-auto">
                <Button type="button" variant="outline">
                  Save draft
                </Button>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  <Upload className="size-4" />
                  {isSubmitting ? "Saving..." : "Publish event"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
