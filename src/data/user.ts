import * as React from "react"

export interface UserProfile {
  name: string
  username: string
  email: string
  avatarUrl?: string
  role?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  memberSince?: string
  ticketsCount?: number
  hostedCount?: number
  savedCount?: number
  followingCount?: number
  rating?: number
  isLoggedIn?: boolean
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "John Doe",
  username: "johndoe",
  email: "johndoe@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  role: "Event Organizer",
  bio: "Event organizer & party enthusiast in Phnom Penh. Bringing people together through music and nightlife gatherings.",
  location: "Phnom Penh, Cambodia",
  website: "https://eventplanner.io/johndoe",
  phone: "+855 12 345 678",
  memberSince: "March 2024",
  ticketsCount: 3,
  hostedCount: 8,
  savedCount: 12,
  followingCount: 145,
  rating: 4.9,
  isLoggedIn: true,
}

export function logoutUser(): UserProfile {
  return saveUserProfile({ isLoggedIn: false })
}

export function loginUser(): UserProfile {
  return saveUserProfile({ isLoggedIn: true })
}

const USER_STORAGE_KEY = "eventplanner_user_profile"

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE
  try {
    const item = localStorage.getItem(USER_STORAGE_KEY)
    if (item) {
      const parsed = JSON.parse(item)
      // If local storage has an empty string for avatarUrl, use DEFAULT_USER_PROFILE.avatarUrl
      return {
        ...DEFAULT_USER_PROFILE,
        ...parsed,
        avatarUrl: parsed.avatarUrl || DEFAULT_USER_PROFILE.avatarUrl,
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_USER_PROFILE
}

export function saveUserProfile(data: Partial<UserProfile>): UserProfile {
  const current = getUserProfile()
  const updated = { ...current, ...data }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // fallback
    }
    window.dispatchEvent(
      new CustomEvent("user-profile-updated", { detail: updated })
    )
  }
  return updated
}

export function useUserProfile(): [
  UserProfile,
  (data: Partial<UserProfile>) => UserProfile,
] {
  const [profile, setProfile] = React.useState<UserProfile>(getUserProfile)

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as UserProfile
      setProfile(detail || getUserProfile())
    }
    window.addEventListener("user-profile-updated", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("user-profile-updated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  return [profile, saveUserProfile]
}
