import * as React from "react"

import { supabase } from "@/lib/supabase"

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
  name: "Guest",
  username: "guest",
  email: "",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  role: "Event Planner",
  bio: "",
  location: "",
  website: "",
  phone: "",
  memberSince: "",
  ticketsCount: 0,
  hostedCount: 0,
  savedCount: 0,
  followingCount: 0,
  rating: 0,
  isLoggedIn: false,
}

export function syncUserProfileFromSession(
  session: {
    user?: {
      email?: string | null
      user_metadata?: {
        full_name?: string | null
        username?: string | null
        avatar_url?: string | null
        bio?: string | null
        location?: string | null
        contact_email?: string | null
      }
    } | null
  } | null
): UserProfile {
  if (!session?.user) {
    return saveUserProfile({
      ...DEFAULT_USER_PROFILE,
      isLoggedIn: false,
    })
  }

  const email = session.user.email || ""
  const metadata = session.user.user_metadata || {}
  const username =
    metadata.username || email.split("@")[0] || DEFAULT_USER_PROFILE.username
  const name =
    metadata.full_name || email.split("@")[0] || DEFAULT_USER_PROFILE.name

  return saveUserProfile({
    name,
    username,
    email: metadata.contact_email || email,
    avatarUrl:
      typeof metadata.avatar_url === "string"
        ? metadata.avatar_url
        : DEFAULT_USER_PROFILE.avatarUrl,
    bio: metadata.bio || "",
    location: metadata.location || "",
    role: "Event Planner",
    isLoggedIn: true,
  })
}

export async function updateUserProfile(
  data: Pick<
    UserProfile,
    "name" | "username" | "bio" | "location" | "email" | "avatarUrl"
  >
): Promise<UserProfile> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Profile changes cannot be saved."
    )
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError
  if (!userData.user) throw new Error("Sign in to update your profile.")

  const { data: updatedData, error } = await supabase.auth.updateUser({
    data: {
      ...userData.user.user_metadata,
      full_name: data.name,
      username: data.username,
      bio: data.bio,
      location: data.location,
      contact_email: data.email,
      avatar_url: data.avatarUrl ?? "",
    },
  })
  if (error) throw error

  const metadata = updatedData.user.user_metadata
  return saveUserProfile({
    name: metadata.full_name || data.name,
    username: metadata.username || data.username,
    bio: metadata.bio || "",
    location: metadata.location || "",
    email: metadata.contact_email || updatedData.user.email || data.email,
    avatarUrl:
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : "",
    isLoggedIn: true,
  })
}

export function logoutUser(): UserProfile {
  if (supabase) {
    supabase.auth.signOut().catch(() => {
      // ignore sign-out errors here; local state still clears the app session
    })
  }

  return saveUserProfile({
    ...DEFAULT_USER_PROFILE,
    isLoggedIn: false,
  })
}

export function loginUser(): UserProfile {
  return saveUserProfile({
    ...DEFAULT_USER_PROFILE,
    isLoggedIn: true,
  })
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
        avatarUrl:
          typeof parsed.avatarUrl === "string"
            ? parsed.avatarUrl
            : DEFAULT_USER_PROFILE.avatarUrl,
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
