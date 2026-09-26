import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/**
 * A half-filled config used to fail silently: the repository falls back to the
 * localStorage store, so the app looks healthy while every write goes nowhere
 * durable and no request ever reaches the network. A common cause is a UTF-8
 * BOM at the start of .env.local, which makes Vite drop the *first* variable
 * in the file. Warn so the mismatch is visible instead of inferred.
 */
if (import.meta.env.DEV && Boolean(supabaseUrl) !== Boolean(supabasePublishableKey)) {
  const missing = supabaseUrl ? "VITE_SUPABASE_PUBLISHABLE_KEY" : "VITE_SUPABASE_URL"
  console.warn(
    `[supabase] ${missing} is missing, so the app is running on localStorage ` +
      "instead of Supabase. Check .env.local - a UTF-8 BOM on the first line " +
      "will silently drop that variable."
  )
}

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null

export const isSupabaseConfigured = Boolean(supabase)
