import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Shown when loading the event list fails. Without it a failed read is
 * indistinguishable from an account that owns nothing, because the pages
 * render their empty state whenever `events` is empty.
 */
export interface EventsErrorStateProps {
  error: Error | null
  onRetry?: () => void
  className?: string
}

export function EventsErrorState({
  error,
  onRetry,
  className,
}: EventsErrorStateProps) {
  return (
    <Card className={`border-dashed shadow-none ${className ?? ""}`.trim()}>
      <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold">We couldn&apos;t load your events</p>
          <p role="alert" className="text-xs text-muted-foreground">
            {error?.message ?? "Something went wrong. Please try again."}
          </p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
            <RotateCcw className="size-3.5" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default EventsErrorState
