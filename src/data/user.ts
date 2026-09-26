import * as React from "react"

import { getAuthUserId, isSignedIn } from "@/data/auth"

export interface UserProfile {
  id: string
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
  // Placeholder only. The id is overwritten by the signed-in Supabase account
  // in getUserProfile(), so nothing is ever owned by this literal value.
  id: "",
  name: "Guest",
  username: "guest",
  email: "",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  role: "Event Organizer",
  bio: "",
  location: "",
  website: "",
  phone: "",
  memberSince: "",
  ticketsCount: 0,
  hostedCount: 0,
  savedCount: 0,
  followingCount: 0,
  isLoggedIn: false,
}

const USER_STORAGE_KEY = "eventplanner_user_profile"

/**
 * Profiles are stored per account id so two people sharing a browser do not
 * overwrite each other's details. Falls back to a single legacy key so an
 * existing profile is not lost on upgrade.
 */
const storageKeyFor = (userId: string) =>
  userId ? `${USER_STORAGE_KEY}_${userId}` : USER_STORAGE_KEY

/**
 * The signed-in account, or a logged-out guest when there is no session.
 *
 * `id` is the Supabase auth uid, which is what every ownership check compares
 * against. It is empty when signed out, so `canManageEvent` is false and the
 * create/edit guards stay closed.
 */
export function getUserProfile(): UserProfile {
  const authId = getAuthUserId()
  const signedIn = isSignedIn() && Boolean(authId)

  if (typeof window === "undefined") {
    return { ...DEFAULT_USER_PROFILE, id: authId ?? "", isLoggedIn: signedIn }
  }

  try {
    const item = localStorage.getItem(storageKeyFor(authId ?? ""))
    const parsed = item ? JSON.parse(item) : null

    if (parsed) {
      return {
        ...DEFAULT_USER_PROFILE,
        ...parsed,
        // Identity always comes from the session, never from storage.
        id: authId ?? "",
        isLoggedIn: signedIn,
        avatarUrl: parsed.avatarUrl || DEFAULT_USER_PROFILE.avatarUrl,
      }
    }
  } catch {
    // fall through to the default profile
  }

  return { ...DEFAULT_USER_PROFILE, id: authId ?? "", isLoggedIn: signedIn }
}

export function saveUserProfile(data: Partial<UserProfile>): UserProfile {
  const current = getUserProfile()
  const updated = { ...current, ...data }
  const authId = getAuthUserId()

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKeyFor(authId ?? ""), JSON.stringify(updated))
    } catch {
      // storage unavailable: the in-memory value still stands
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

    const handleStorage = () => setProfile(getUserProfile())

    window.addEventListener("user-profile-updated", handleUpdate)
    window.addEventListener("storage", handleStorage)
    return () => {
      window.removeEventListener("user-profile-updated", handleUpdate)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  return [profile, saveUserProfile]
}
