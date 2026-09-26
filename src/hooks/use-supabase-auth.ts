import * as React from "react"
import type { Session } from "@supabase/supabase-js"

import { syncUserProfileFromSession } from "@/data/user"
import { supabase } from "@/lib/supabase"

export function useSupabaseAuth() {
  const [session, setSession] = React.useState<Session | null>(null)
  const [isReady, setIsReady] = React.useState(() => !supabase)

  React.useEffect(() => {
    if (!supabase) {
      return
    }

    let isActive = true

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!isActive) return
        setSession(currentSession)
        syncUserProfileFromSession(currentSession)
        setIsReady(true)
      })
      .catch(() => {
        if (!isActive) return
        syncUserProfileFromSession(null)
        setIsReady(true)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return
      setSession(nextSession)
      syncUserProfileFromSession(nextSession)
      setIsReady(true)
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    isReady,
  }
}
