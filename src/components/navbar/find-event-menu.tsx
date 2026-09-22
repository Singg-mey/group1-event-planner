import { ChevronRight, Compass, Sparkles } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { EVENT_CATEGORIES } from "./data"
import type { NavItemClick } from "./types"

export function FindEventMenu({
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
          activeItem === "Find Event"
            ? "bg-accent/80 font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Find Event
      </NavigationMenuTrigger>
      <NavigationMenuContent className="w-[500px] p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Compass className="size-3.5 text-primary" />
              Explore by Category
            </div>
            <a
              href="#find-event-all"
              onClick={(e) =>
                onNav("Find Event", "#find-event-all", e, "All Categories")
              }
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              All Events <ChevronRight className="size-3" />
            </a>
          </div>

          {EVENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <NavigationMenuLink
                key={cat.title}
                href={cat.href}
                onClick={(e) => onNav("Find Event", cat.href, e, cat.title)}
                className="group flex flex-col items-start gap-1 rounded-xl p-2.5 transition-colors hover:bg-muted/70 focus:bg-muted/70"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                      cat.color
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {cat.title}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
                  {cat.description}
                </p>
              </NavigationMenuLink>
            )
          })}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/40 p-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Trending in Phnom Penh this weekend
            </span>
          </div>
          <Badge variant="secondary" className="text-[11px] font-medium">
            6 Live
          </Badge>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}