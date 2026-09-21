import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CalendarPlus, Menu, X } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

import { Brand } from "./navbar/brand"
import { DesktopNav } from "./navbar/desktop-nav"
import { MobileMenu } from "./navbar/mobile-menu"
import { ProfileMenu } from "./navbar/profile-menu"
import { SearchBar } from "./navbar/search-bar"
import type { NavItemClick, NavUser, NavbarProps } from "./navbar/types"

export type { NavUser, NavbarProps } from "./navbar/types"

const DEFAULT_USER: NavUser = {
  name: "Alex Morgan",
  email: "alex.morgan@eventplanner.io",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "Event Organizer",
  ticketsCount: 3,
}

export function Navbar({
  user = DEFAULT_USER,
  activeItem = "Home",
  onNavigate,
  onSearch,
  className,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const updateSearch = (value: string) => {
    setSearchQuery(value)
    if (onSearch) onSearch(value)
  }

  const scrollToHash = (hash: string) => {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleItemClick: NavItemClick = (name, href, e) => {
    e?.preventDefault()
    if (onNavigate) onNavigate(name)
    setMobileMenuOpen(false)

    // Pages with dedicated routes
    const routeMap: Record<string, string> = {
      Profile: "/profile",
      About: "/about",
    }
    const route = routeMap[name]
    if (route) {
      if (location.pathname === route) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        navigate(route)
        window.scrollTo({ top: 0 })
      }
      return
    }

    // Home-page anchors / sections
    const homeHash = href && href.startsWith("#") ? href : undefined
    if (location.pathname === "/") {
      if (homeHash) {
        scrollToHash(homeHash)
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } else {
      navigate(homeHash ? `/${homeHash}` : "/")
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-xl transition-colors duration-200 supports-backdrop-filter:bg-background/70",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo + Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Brand onNav={handleItemClick} />
          <DesktopNav activeItem={activeItem} onNav={handleItemClick} />
        </div>

        {/* Right: Search Bar, Quick Create, Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <SearchBar searchQuery={searchQuery} onSearchChange={updateSearch} />

          {/* Quick Create CTA Button (Desktop only) */}
          <Button
            size="sm"
            className="hidden xl:inline-flex gap-1.5 rounded-full font-semibold shadow-xs"
            onClick={() => handleItemClick("Create Event", "#create-new")}
          >
            <CalendarPlus className="size-3.5" />
            <span>Create Event</span>
          </Button>

          <ProfileMenu
            user={user}
            theme={theme}
            onThemeChange={setTheme}
            onNav={handleItemClick}
          />

          {/* Mobile menu toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden rounded-full"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-down Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          user={user}
          activeItem={activeItem}
          theme={theme}
          searchQuery={searchQuery}
          onSearchChange={updateSearch}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onNav={handleItemClick}
        />
      )}
    </header>
  )
}

export default Navbar