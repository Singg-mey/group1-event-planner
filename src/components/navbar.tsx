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

import { useUserProfile, logoutUser } from "@/data/user"
export type { NavUser, NavbarProps } from "./navbar/types"

export function Navbar({
  user,
  activeItem = "Home",
  onNavigate,
  onSearch,
  className,
}: NavbarProps) {
  const [profile] = useUserProfile()
  const isLoggedIn = profile.isLoggedIn !== false
  const activeUser: NavUser = user || {
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    ticketsCount: profile.ticketsCount,
    isLoggedIn: profile.isLoggedIn !== false,
  }

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

  const handleItemClick: NavItemClick = (name, href, e, eventType) => {
    e?.preventDefault()
    if (onNavigate) onNavigate(name, eventType)
    setMobileMenuOpen(false)

    if (name === "Logout" || name === "Log out") {
      logoutUser()
      navigate("/")
      return
    }

    if (name === "Create Event" && !isLoggedIn) {
      navigate("/sign-in")
      return
    }

    // Map menu items to target routes & tab parameters
    const routeMap: Record<string, string> = {
      Profile: "/profile",
      "My Profile": "/profile",
      "My Tickets": "/profile?tab=tickets",
      Tickets: "/profile?tab=tickets",
      Saved: "/profile?tab=saved",
      "Saved Events": "/profile?tab=saved",
      "Hosted Events": "/profile?tab=hosted",
      "My Events": "/profile?tab=hosted",
      About: "/about",
      Settings: "/settings", // or "/profile?tab=overview"
    }

    const targetRoute = routeMap[name]

    if (targetRoute) {
      // If navigating within the profile page (e.g. switching tabs)
      if (
        location.pathname === "/profile" &&
        targetRoute.startsWith("/profile")
      ) {
        navigate(targetRoute)
      } else {
        navigate(targetRoute)
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
            className="hidden gap-1.5 rounded-full font-semibold shadow-xs xl:inline-flex"
            onClick={() => handleItemClick("Create Event", "#create-new")}
          >
            <CalendarPlus className="size-3.5" />
            <span>Create Event</span>
          </Button>

          <ProfileMenu
            user={activeUser}
            theme={theme}
            onThemeChange={setTheme}
            onNav={handleItemClick}
          />

          {/* Mobile menu toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-full lg:hidden"
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
          user={activeUser}
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
