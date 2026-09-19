import { ArrowRight, ListChecks, MapPin, Star } from "lucide-react"
import { cn } from "cn"

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
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export interface CurrentEventData {
  title: string
  location: string
  confirmed: number
  capacity: number
  checklistDone: number
  checklistTotal: number
}

export interface CurrentEventProps {
  event: CurrentEventData
  className?: string
  onManage?: () => void
}

export function CurrentEvent({
  event,
  className,
  onManage,
}: CurrentEventProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "border-0 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex min-w-0 items-center gap-2 font-semibold">
          <Star
            className="size-4 shrink-0 fill-amber-400 text-amber-400"
            aria-hidden
          />
          <span className="truncate">{event.title}</span>
        </CardTitle>
        <CardAction>
          <Badge className="bg-amber-400/15 text-amber-600 dark:text-amber-400">
            Active host
          </Badge>
        </CardAction>
        <CardDescription className="flex min-w-0 items-center gap-1.5 text-xs">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{event.location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Progress
          value={event.confirmed}
          max={event.capacity}
          className="gap-2 **:data-[slot=progress-indicator]:bg-sky-400 **:data-[slot=progress-track]:h-2"
        >
          <ProgressLabel className="text-xs text-muted-foreground">
            RSVP confirmation
          </ProgressLabel>
          <ProgressValue className="text-xs font-medium text-foreground">
            {(_, value) => `${value}/${event.capacity} confirmed`}
          </ProgressValue>
        </Progress>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListChecks className="size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-medium text-foreground">
                {event.checklistDone}/{event.checklistTotal}
              </span>{" "}
              checklist done
            </span>
          </span>
          <Button
            variant="link"
            size="sm"
            onClick={onManage}
            className="h-auto px-0 font-semibold text-emerald-500 has-data-[icon=inline-end]:pr-0 dark:text-emerald-400"
          >
            Manage hub
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
