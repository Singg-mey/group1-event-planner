import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { AppRoot } from "@/app-routes"
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  </StrictMode>
)
