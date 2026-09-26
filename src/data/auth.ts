import type { AuthError, Session } from "@supabase/supabase-js"

import { supabase } from "@/lib/supabase"

/**
 * Supabase Auth, wrapped so the rest of the app never touches the client
 * directly and can ask "who is signed in?" synchronously.
 *
 * Ownership checks run deep in the data layer (`canManageEvent`, the
 * `organizer_id` filters on update and delete) and those are synchronous, so
 * the session is mirrored into a module variable by `startAuthListener()` and
 * everything reads that mirror rather than awaiting the client.
 *
 * The app consumes this small `AuthIdentity` shape instead of Supabase's `User`
 * so it is not coupled to the SDK's type and so tests can pin an identity
 * without a network round-trip.
 */

export interface AuthIdentity {
  id: string
  email: string
  displayName: string
}

const NOT_CONFIGURED =
  "Accounts are unavailable: Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local."

let identity: AuthIdentity | null = null

function requireClient() {
  if (!supabase) {
    throw new Error(NOT_CONFIGURED)
  }
  return supabase
}

const toIdentity = (session: Session | null): AuthIdentity | null => {
  const user = session?.user
  if (!user) return null

  const metadataName = user.user_metadata?.display_name
  return {
    id: user.id,
    email: user.email ?? "",
    displayName:
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim()
        : (user.email ?? "").split("@")[0],
  }
}

export function getAuthIdentity(): AuthIdentity | null {
  return identity
}

/** The signed-in account's id, or null when signed out. */
export function getAuthUserId(): string | null {
  return identity?.id ?? null
}

export function isSignedIn(): boolean {
  return identity !== null
}

export function isAuthAvailable(): boolean {
  return supabase !== null
}

/**
 * Test seam. Pins the signed-in identity without touching the network so the
 * CRUD harness can exercise ownership checks in Node. The app never calls this.
 */
export function setAuthIdentityForTesting(next: AuthIdentity | null): void {
  identity = next
}

/**
 * Seeds the mirror from the already-restored session, then keeps it in sync.
 * Returns an unsubscribe function.
 */
export async function startAuthListener(
  onChange?: (next: AuthIdentity | null) => void
): Promise<() => void> {
  const client = supabase
  if (!client) {
    identity = null
    onChange?.(null)
    return () => {}
  }

  const { data } = await client.auth.getSession()
  identity = toIdentity(data.session)
  onChange?.(identity)

  const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
    identity = toIdentity(session)
    onChange?.(identity)
  })

  return () => listener.subscription.unsubscribe()
}

export interface SignUpInput {
  email: string
  password: string
  displayName?: string
}

export interface AuthResult {
  /** False when the project requires the user to confirm their email first. */
  signedIn: boolean
  email?: string
}

/** Turns a Supabase auth error into something worth showing a user. */
const toMessage = (error: AuthError): string => {
  const message = error.message.toLowerCase()
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "That email already has an account. Try logging in instead."
  }
  if (message.includes("invalid login")) {
    return "That email and password combination is not correct."
  }
  return error.message
}

export async function signUp({
  email,
  password,
  displayName,
}: SignUpInput): Promise<AuthResult> {
  const client = requireClient()
  const trimmedName = displayName?.trim()

  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      // Store the display name on the auth record so the UI can greet the user
      // before a profile row exists.
      data: trimmedName ? { display_name: trimmedName } : undefined,
    },
  })

  if (error) {
    throw new Error(toMessage(error))
  }

  // With email confirmation enabled there is no session yet; the user has to
  // click the link first, so the caller shows a "check your inbox" state.
  return { signedIn: Boolean(data.session), email: data.user?.email ?? email }
}

export async function signIn(email: string, password: string): Promise<void> {
  const client = requireClient()

  const { error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw new Error(toMessage(error))
  }
}

export async function signOut(): Promise<void> {
  const client = requireClient()
  const { error } = await client.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Hands the seeded events to the first real account that signs in.
 *
 * `events.organizer_id` is a uuid column, so the seed rows are owned by a
 * placeholder uuid rather than a text sentinel. The hand-off runs through a
 * SECURITY DEFINER function because the ownership policy only lets a caller
 * touch rows it already owns, and these rows are owned by the placeholder.
 */
export async function claimSeedEvents(): Promise<number> {
  const client = supabase
  if (!client) return 0

  const { data, error } = await client.rpc("claim_seed_events")

  if (error) {
    // Not fatal: the account is valid, it just starts with no events. Say so
    // loudly, because the usual cause is an undeployed function.
    console.warn(
      "[auth] could not claim the seeded events. Run " +
        "supabase/fix-organizer-policies.sql in the Supabase SQL editor to " +
        `deploy claim_seed_events(). Details: ${error.message}`
    )
    return 0
  }

  return typeof data === "number" ? data : 0
}

export { NOT_CONFIGURED as AUTH_NOT_CONFIGURED }
