import * as React from "react"
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { saveUserProfile } from "@/data/user"
import { supabase } from "@/lib/supabase"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function SignInPage() {
  const navigate = useNavigate()
  const { session, isReady } = useSupabaseAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    if (isReady && session) {
      navigate("/", { replace: true })
    }
  }, [isReady, session, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    if (!supabase) {
      setErrorMessage(
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable sign in."
      )
      return
    }

    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    const signedInUser = (await supabase.auth.getUser()).data.user
    const fullName =
      signedInUser?.user_metadata?.full_name ||
      signedInUser?.email?.split("@")[0] ||
      "Guest"
    const username =
      signedInUser?.user_metadata?.username ||
      signedInUser?.email?.split("@")[0] ||
      "guest"

    saveUserProfile({
      name: fullName,
      username,
      email: signedInUser?.email || email,
      avatarUrl: signedInUser?.user_metadata?.avatar_url || "",
      isLoggedIn: true,
    })

    navigate("/", { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <Card className="border-border/70 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-2 pb-4">
            <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
              Welcome back
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign in
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Access your event planner dashboard, saved events, and ticket
              bookings.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="signin-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 rounded-xl bg-background pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signin-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-11 rounded-xl bg-background pr-10 pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-2.5 right-3 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-primary hover:underline"
              >
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
