import * as React from "react"

import {
  getAuthIdentity,
  isAuthAvailable,
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
  startAuthListener,
  type AuthIdentity,
  type AuthResult,
  type SignUpInput,
} from "@/data/auth"

/**
 * Subscribes to the Supabase session. The `useAuth()` consumer re-renders on
 * sign-in, sign-out and token refresh, which is what lets the create/edit
 * guards unlock without a reload.
 */
export function useAuth() {
  const [identity, setIdentity] = React.useState<AuthIdentity | null>(
    getAuthIdentity
  )
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isActive = true
    let stopListening: (() => void) | undefined

    void startAuthListener((next) => {
      if (!isActive) return
      setIdentity(next)
      setIsLoading(false)
    }).then((unsubscribe) => {
      // The listener resolves asynchronously, so it can land after unmount.
      if (isActive) stopListening = unsubscribe
      else unsubscribe()
    })

    return () => {
      isActive = false
      stopListening?.()
    }
  }, [])

  const signIn = React.useCallback(async (email: string, password: string) => {
    await signInRequest(email, password)
  }, [])

  const signUp = React.useCallback(
    async (input: SignUpInput): Promise<AuthResult> => signUpRequest(input),
    []
  )

  const signOut = React.useCallback(async () => {
    await signOutRequest()
  }, [])

  return {
    identity,
    isLoading,
    isSignedIn: identity !== null,
    isAuthAvailable: isAuthAvailable(),
    signIn,
    signUp,
    signOut,
  }
}
