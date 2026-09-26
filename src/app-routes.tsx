import { BrowserRouter, Route, Routes } from "react-router-dom"

import App from "@/App"
import ProfilePage from "@/pages/profile-page"
import AboutPage from "@/pages/about-page"
import EventDetailPage from "@/pages/event-detail-page"
import EditEventPage from "@/pages/edit-event-page"
import CreateEventPage from "@/pages/create-event-page"
import MyEventsPage from "@/pages/my-events-page"
import SettingsPage from "@/pages/settings-page"
import MyTicketsPage from "@/pages/MyTicketsPage"
import SavedEventsPage from "@/pages/SavedEventsPage"
import AuthPage from "@/pages/auth-page"
import { RequireAuth } from "@/components/require-auth"
import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap"

/**
 * Starts the Supabase session listener and hands the seeded events to a
 * first-time account, so the guards below always see a warm session.
 */
export function AppRoot() {
  useAuthBootstrap()

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

/**
 * Creating an event, editing one, and the organizer's own list are all scoped
 * to an account, so they sit behind RequireAuth. Browsing stays open.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/tickets" element={<MyTicketsPage />} />
      <Route path="/saved" element={<SavedEventsPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route
        path="/events/:id/edit"
        element={
          <RequireAuth>
            <EditEventPage />
          </RequireAuth>
        }
      />
      <Route
        path="/create-event"
        element={
          <RequireAuth>
            <CreateEventPage />
          </RequireAuth>
        }
      />
      <Route
        path="/my-events"
        element={
          <RequireAuth>
            <MyEventsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<App />} />
    </Routes>
  )
}

export default AppRoutes
