import { cn } from "cn"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { CreateEventMenu } from "./create-event-menu"
import { FindEventMenu } from "./find-event-menu"
import type { NavItemClick } from "./types"

export function DesktopNav({
  activeItem,
  onNav,
}: {
  activeItem?: string
  onNav: NavItemClick
}) {
  return (
    <div className="hidden lg:flex">
      <NavigationMenu align="start">
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#home"
              onClick={(e) => onNav("Home", "#home", e)}
              className={cn(
                navigationMenuTriggerStyle(),
                activeItem === "Home"
                  ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>

          <FindEventMenu activeItem={activeItem} onNav={onNav} />

          <CreateEventMenu activeItem={activeItem} onNav={onNav} />

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/my-events"
              onClick={(e) => onNav("My Events", "/my-events", e)}
              className={cn(
                navigationMenuTriggerStyle(),
                activeItem === "My Events"
                  ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              My Events
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="#about"
              onClick={(e) => onNav("About", "#about", e)}
              className={cn(
                navigationMenuTriggerStyle(),
                activeItem === "About"
                  ? "bg-accent/80 font-semibold text-primary hover:bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}