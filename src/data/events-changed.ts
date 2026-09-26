/**
 * Cross-component signal so every mounted `useEvents()` consumer refetches
 * after a create/update/delete, no matter which component triggered it.
 * Mirrors the "user-profile-updated" pattern already used in data/user.ts.
 */
export const EVENTS_CHANGED_EVENT = "eventplanner_events_changed"

export function notifyEventsChanged(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(EVENTS_CHANGED_EVENT))
}

export function subscribeToEventChanges(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(EVENTS_CHANGED_EVENT, listener)
  return () => window.removeEventListener(EVENTS_CHANGED_EVENT, listener)
}
