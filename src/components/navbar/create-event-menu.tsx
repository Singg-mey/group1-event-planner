import { cn } from "cn"

import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

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
      <NavigationMenuLink
        href="#create-new"
        onClick={(e) => onNav("Create Event", "#create-new", e)}
        className={cn(
          navigationMenuTriggerStyle(),
          activeItem === "Create Event"
            ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Create Event
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
