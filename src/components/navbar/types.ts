import type { LucideIcon } from "lucide-react"

export interface NavUser {
  name: string
  email: string
  avatarUrl?: string
  role?: string
  ticketsCount?: number
}

export type ThemeName = "dark" | "light" | "system"

export interface NavbarProps {
  user?: NavUser
  activeItem?: string
  onNavigate?: (item: string) => void
  onSearch?: (query: string) => void
  className?: string
}

export interface NavCategory {
  title: string
  href: string
  description: string
  icon: LucideIcon
  color: string
}

export interface CreateOption {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export type NavItemClick = (
  name: string,
  href?: string,
  e?: { preventDefault: () => void }
) => void