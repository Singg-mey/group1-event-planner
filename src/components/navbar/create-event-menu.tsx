import { CalendarPlus } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { CREATE_OPTIONS } from "./data"
import type { NavItemClick } from "./types"

export function CreateEventMenu({
  activeItem,
  onNav,
}: {
  activeItem?: string
  onNav: NavItemClick
}) {
  return (
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
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Event Creation Suite
          </div>
          {CREATE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
              <NavigationMenuLink
                key={opt.title}
                href={opt.href}
                onClick={(e) => onNav("Create Event", opt.href, e)}
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
            onClick={() => onNav("Create Event", "#create-new")}
          >
            <CalendarPlus className="size-4" />
            Start New Event Wizard
          </Button>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}