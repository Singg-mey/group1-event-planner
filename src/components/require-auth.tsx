import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { Loader2, Lock, LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export interface RequireAuthProps {
  children: React.ReactNode
  /** Where to send people who are not signed in. Defaults to /login. */
  redirectTo?: string
}

/**
 * Wraps the routes that need an account: creating an event, editing one, and
 * the organizer's own event list.
 *
 * While the session is still being restored it renders a spinner rather than
 * redirecting, otherwise a refresh on a guarded page would bounce a signed-in
 * user out to the login screen for a frame.
 */
export function RequireAuth({
  children,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { isSignedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Checking your session...
      </div>
    )
  }

  if (!isSignedIn) {
    // Keep the intended destination so login can return the user to it.
    const next = encodeURIComponent(
      `${location.pathname}${location.search}`
    )
    return <Navigate to={`${redirectTo}?next=${next}`} replace />
  }

  return <>{children}</>
}

/**
 * Shown in place of a guarded form when the account is signed in but the
 * request needs Supabase and it is not configured.
 */
export function AuthUnavailableCard() {
  return (
    <Card className="border-dashed shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-4" />
          Accounts are unavailable
        </CardTitle>
        <CardDescription>
          Connect Supabase to create and manage events.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button size="sm" variant="outline" disabled className="gap-2">
          <LogIn className="size-3.5" />
          Log in
        </Button>
        <Button size="sm" variant="outline" disabled className="gap-2">
          <UserPlus className="size-3.5" />
          Sign up
        </Button>
      </CardContent>
    </Card>
  )
}

export default RequireAuth
