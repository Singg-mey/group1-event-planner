import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CalendarDays, Loader2, LogIn, Mail, UserPlus } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AUTH_NOT_CONFIGURED } from "@/data/auth"
import { useAuth } from "@/hooks/use-auth"

type AuthMode = "login" | "signup"

interface AuthFormValues {
  displayName: string
  email: string
  password: string
}

type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Supabase requires at least 6 characters by default. Enforcing it here means
 * the user gets an inline message instead of a round-trip rejection.
 */
const MIN_PASSWORD_LENGTH = 6

const validate = (
  values: AuthFormValues,
  mode: AuthMode
): AuthFormErrors => {
  const errors: AuthFormErrors = {}

  if (mode === "signup" && values.displayName.trim().length < 2) {
    errors.displayName = "Tell us what to call you."
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email address."
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That does not look like an email address."
  }

  if (!values.password) {
    errors.password = "Enter a password."
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  return errors
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, isSignedIn, isLoading, isAuthAvailable } = useAuth()

  const [values, setValues] = React.useState<AuthFormValues>({
    displayName: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<AuthFormErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Send people back to whatever they were trying to reach, e.g. /create-event.
  const nextPath = new URLSearchParams(location.search).get("next") ?? "/my-events"
  const isSignup = mode === "signup"

  // Already signed in: nothing to do on this page.
  React.useEffect(() => {
    if (!isLoading && isSignedIn) {
      navigate(nextPath, { replace: true })
    }
  }, [isLoading, isSignedIn, navigate, nextPath])

  const update = (key: keyof AuthFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setNotice(null)

    const nextErrors = validate(values, mode)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setIsSubmitting(true)
    try {
      if (isSignup) {
        const result = await signUp({
          email: values.email,
          password: values.password,
          displayName: values.displayName,
        })

        if (result.signedIn) {
          navigate(nextPath, { replace: true })
          return
        }

        // Email confirmation is enabled on the project, so the account exists
        // but there is no session until the link is clicked.
        setNotice(
          `Almost there. We sent a confirmation link to ${result.email}. ` +
            "Open it to finish creating your account, then come back and log in."
        )
        setValues({ displayName: "", email: "", password: "" })
        return
      }

      await signIn(values.email, values.password)
      navigate(nextPath, { replace: true })
    } catch (failure) {
      setFormError(
        failure instanceof Error
          ? failure.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthAvailable) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-16">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Accounts are unavailable</CardTitle>
              <CardDescription>{AUTH_NOT_CONFIGURED}</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer className="mt-auto" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isSignup ? (
              <UserPlus className="size-5" />
            ) : (
              <LogIn className="size-5" />
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "An account lets you create, publish and manage your own events."
              : "Log in to manage the events you organize."}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup className="gap-5">
                {isSignup && (
                  <Field data-invalid={Boolean(errors.displayName)}>
                    <FieldLabel htmlFor="auth-name">Your name</FieldLabel>
                    <Input
                      id="auth-name"
                      name="displayName"
                      value={values.displayName}
                      onChange={(e) => update("displayName", e.target.value)}
                      placeholder="e.g. John Doe"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.displayName)}
                    />
                    <FieldError>{errors.displayName}</FieldError>
                  </Field>
                )}

                <Field data-invalid={Boolean(errors.email)}>
                  <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                  <Input
                    id="auth-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                  <FieldError>{errors.email}</FieldError>
                </Field>

                <Field data-invalid={Boolean(errors.password)}>
                  <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                  <Input
                    id="auth-password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder={
                      isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters` : "Your password"
                    }
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <FieldError>{errors.password}</FieldError>
                </Field>

                {formError && (
                  <p role="alert" className="text-sm text-destructive">
                    {formError}
                  </p>
                )}

                {notice && (
                  <p
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-foreground"
                  >
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    {notice}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full gap-2 rounded-full font-semibold"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isSignup ? (
                    <UserPlus className="size-4" />
                  ) : (
                    <LogIn className="size-4" />
                  )}
                  {isSubmitting
                    ? isSignup
                      ? "Creating account..."
                      : "Logging in..."
                    : isSignup
                      ? "Create account"
                      : "Log in"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to EventLy?"}{" "}
          <Link
            to={
              isSignup
                ? `/login?next=${encodeURIComponent(nextPath)}`
                : `/signup?next=${encodeURIComponent(nextPath)}`
            }
            className="font-semibold text-primary hover:underline"
          >
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          You need an account to create an event.
        </p>
      </main>

      <Footer className="mt-auto" />
    </div>
  )
}

export default AuthPage
