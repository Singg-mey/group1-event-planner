import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import ProfilePage from "./pages/profile-page.tsx"
import AboutPage from "./pages/about-page.tsx"
import EventDetailPage from "./pages/event-detail-page.tsx"
import SettingsPage from "./pages/settings-page.tsx"
import MyTicketsPage from "./pages/MyTicketsPage.tsx"
import SavedEventsPage from "./pages/SavedEventsPage.tsx"
import SignInPage from "./pages/sign-in-page.tsx"
import SignUpPage from "./pages/sign-up-page.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/saved" element={<SavedEventsPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
