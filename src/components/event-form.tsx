import * as React from "react"
import { CalendarDays, Check, Link2, MapPin, Save, Trash2, Upload } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  EVENT_CATEGORY_OPTIONS,
  EVENT_STATUS_OPTIONS,
  EVENT_VISIBILITY_OPTIONS,
} from "@/data/event-categories"
import {
  EMPTY_EVENT_FORM,
  hasFormErrors,
  toEventFormValues,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
  type LocationType,
} from "@/lib/event-form"
import type { EventStatus, SearchEvent } from "@/types/event"

const selectClassName =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"

export interface EventFormProps {
  /** "create" shows Save draft + Publish, "edit" shows a single Save. */
  mode: "create" | "edit"
  /** The record being edited. Required when mode is "edit". */
  event?: SearchEvent
  /** Pre-fills a blank form, e.g. from the home page Quickstart card. */
  initialValues?: Partial<EventFormValues>
  /**
   * Resolve with the saved record so the form can re-read canonical values,
   * or with nothing to fall back to `event`. Reject (or throw) to surface the
   * error.
   */
  onSubmit: (values: EventFormValues) => Promise<SearchEvent | void>
  onDelete?: () => void
  onCancel?: () => void
  className?: string
}

export function EventForm({
  mode,
  event,
  initialValues,
  onSubmit,
  onDelete,
  onCancel,
  className,
}: EventFormProps) {
  const [values, setValues] = React.useState<EventFormValues>(() =>
    event
      ? toEventFormValues(event)
      : { ...EMPTY_EVENT_FORM, ...initialValues }
  )
  const [errors, setErrors] = React.useState<EventFormErrors>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // `isSubmitting` only disables the buttons on the next render, so a fast
  // second click could still reach handleSubmit and create a duplicate record.
  // The ref closes that window.
  const isSubmittingRef = React.useRef(false)

  const update =
    <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => {
        if (!current[key]) return current
        const next = { ...current }
        delete next[key]
        return next
      })
    }

  const handleSubmit = async (statusOverride?: EventStatus) => {
    if (isSubmittingRef.current) return

    setSubmitError(null)

    const nextValues = statusOverride
      ? { ...values, status: statusOverride }
      : values

    const nextErrors = validateEventForm(nextValues)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      setSubmitError("Please fix the highlighted fields and try again.")
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    try {
      const saved = await onSubmit(nextValues)

      if (saved) {
        // Re-read the record that was just written so the form shows canonical
        // values. Reading `event` here would restore the pre-save props and
        // discard the user's edits.
        setValues(toEventFormValues(saved))
      } else if (mode === "edit" && event) {
        setValues(toEventFormValues(event))
      } else {
        // Clear the form after a successful create. Leaving it filled in meant
        // a second click on Publish created a second event.
        setValues({ ...EMPTY_EVENT_FORM, ...initialValues })
        setErrors({})
      }
    } catch (submitFailure) {
      setSubmitError(
        submitFailure instanceof Error
          ? submitFailure.message
          : "Something went wrong. Please try again."
      )
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const isEdit = mode === "edit"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit()
      }}
      className={cn("space-y-6", className)}
    >
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Event details</CardTitle>
          <CardDescription>
            Give your event the essentials people need to join.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <FieldGroup className="gap-6">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="event-name">Event name</FieldLabel>
              <Input
                id="event-name"
                name="title"
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Design Systems Summit 2026"
                aria-invalid={Boolean(errors.title)}
                required
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="event-category">Category</FieldLabel>
                <select
                  id="event-category"
                  name="category"
                  value={values.category}
                  onChange={(e) =>
                    update("category", e.target.value as EventFormValues["category"])
                  }
                  className={selectClassName}
                  required
                >
                  {EVENT_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FieldError>{errors.category}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="event-tags">Tags</FieldLabel>
                <Input
                  id="event-tags"
                  name="tags"
                  value={values.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="jazz, live-music, concert"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas.
                </p>
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <Field data-invalid={Boolean(errors.date)}>
                <FieldLabel htmlFor="event-date">Date</FieldLabel>
                <Input
                  id="event-date"
                  name="date"
                  type="date"
                  value={values.date}
                  onChange={(e) => update("date", e.target.value)}
                  aria-invalid={Boolean(errors.date)}
                  required
                />
                <FieldError>{errors.date}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.startTime)}>
                <FieldLabel htmlFor="event-start-time">Start time</FieldLabel>
                <Input
                  id="event-start-time"
                  name="startTime"
                  type="time"
                  value={values.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  aria-invalid={Boolean(errors.startTime)}
                  required
                />
                <FieldError>{errors.startTime}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.endTime)}>
                <FieldLabel htmlFor="event-end-time">End time</FieldLabel>
                <Input
                  id="event-end-time"
                  name="endTime"
                  type="time"
                  value={values.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                  aria-invalid={Boolean(errors.endTime)}
                />
                <FieldError>{errors.endTime}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>Where is it happening?</FieldLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "physical", label: "In person", icon: MapPin },
                    { value: "online", label: "Online", icon: Link2 },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("locationType", option.value as LocationType)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                      values.locationType === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/30 hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                        values.locationType === option.value
                          ? "border-primary-foreground bg-primary-foreground text-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {values.locationType === option.value && <Check className="size-3" />}
                    </span>
                    <span className="flex items-center gap-2">
                      <option.icon className="size-4" />
                      <span className="text-sm font-semibold">{option.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Field>

            {values.locationType === "physical" ? (
              <Field data-invalid={Boolean(errors.address)}>
                <FieldLabel htmlFor="event-location">
                  <MapPin className="size-3.5 text-primary" />
                  Location
                </FieldLabel>
                <Input
                  id="event-location"
                  name="address"
                  value={values.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Venue or address"
                  aria-invalid={Boolean(errors.address)}
                  required
                />
                <FieldError>{errors.address}</FieldError>
              </Field>
            ) : (
              <Field data-invalid={Boolean(errors.meetingLink)}>
                <FieldLabel htmlFor="event-meeting-link">
                  <Link2 className="size-3.5 text-primary" />
                  Meeting link
                </FieldLabel>
                <Input
                  id="event-meeting-link"
                  name="meetingLink"
                  type="url"
                  value={values.meetingLink}
                  onChange={(e) => update("meetingLink", e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  aria-invalid={Boolean(errors.meetingLink)}
                  required
                />
                <FieldError>{errors.meetingLink}</FieldError>
              </Field>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="event-capacity">
                  <CalendarDays className="size-3.5 text-primary" />
                  Capacity
                </FieldLabel>
                <Input
                  id="event-capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  value={values.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  aria-invalid={Boolean(errors.capacity)}
                  required
                />
                <FieldError>{errors.capacity}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="event-visibility">Visibility</FieldLabel>
                <select
                  id="event-visibility"
                  name="visibility"
                  value={values.visibility}
                  onChange={(e) =>
                    update("visibility", e.target.value as EventFormValues["visibility"])
                  }
                  className={selectClassName}
                >
                  {EVENT_VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} — {option.hint}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="event-description">Description</FieldLabel>
              <Textarea
                id="event-description"
                name="description"
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Tell people what makes this event special..."
                className="min-h-28 resize-y"
                aria-invalid={Boolean(errors.description)}
                required
              />
              <FieldError>{errors.description}</FieldError>
            </Field>

            <Field data-invalid={Boolean(errors.coverImage)}>
              <FieldLabel htmlFor="cover-image">Cover image URL</FieldLabel>
              <Input
                id="cover-image"
                name="coverImage"
                type="url"
                value={values.coverImage}
                onChange={(e) => update("coverImage", e.target.value)}
                placeholder="https://images.example.com/cover.jpg"
                aria-invalid={Boolean(errors.coverImage)}
              />
              <FieldError>{errors.coverImage}</FieldError>
              {values.coverImage && (
                <img
                  src={values.coverImage}
                  alt="Selected event cover preview"
                  className="mt-2 h-40 w-full rounded-xl object-cover"
                />
              )}
            </Field>

            {isEdit && (
              <Field>
                <FieldLabel htmlFor="event-status">Status</FieldLabel>
                <select
                  id="event-status"
                  name="status"
                  value={values.status}
                  onChange={(e) =>
                    update("status", e.target.value as EventStatus)
                  }
                  className={selectClassName}
                >
                  {EVENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </FieldGroup>
        </CardContent>

        <div className="flex flex-col-reverse gap-3 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <span
            className={cn(
              "text-sm",
              submitError ? "text-destructive" : "text-muted-foreground"
            )}
            role={submitError ? "alert" : undefined}
            aria-live="polite"
          >
            {submitError}
          </span>

          <div className="flex flex-wrap justify-end gap-3 sm:ml-auto">
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            {isEdit ? (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit("draft")}
                >
                  Save draft
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Upload className="size-4" />
                  {isSubmitting ? "Publishing..." : "Publish event"}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </form>
  )
}

export default EventForm
