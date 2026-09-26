import * as React from "react"

import { claimSeedEvents, startAuthListener } from "@/data/auth"

/**
 * Starts the session listener once for the whole app and performs the
 * seeded-event hand-off when an account signs in for the first time.
 *
 * Mounted in app-routes.tsx so the session mirror is warm before any guarded
 * route renders, and so a sign-out on one screen is reflected everywhere.
 */
export function useAuthBootstrap(): void {
  const claimedForRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    let isActive = true
    let stopListening: (() => void) | undefined

    void startAuthListener((identity) => {
      if (!isActive || !identity) return
      // Guarded by account id so the claim can never repeat for the same user.
      if (claimedForRef.current === identity.id) return
      claimedForRef.current = identity.id

      void claimSeedEvents().then((claimed) => {
        if (isActive && claimed > 0) {
          console.info(`[auth] claimed ${claimed} seeded event(s) for this account`)
        }
      })
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
}
