import { useNavigate } from "react-router-dom"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about"

export function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem="About" />
      <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        <AboutContent
          onBack={() => navigate("/")}
          onDiscoverEvents={() => navigate("/")}
          onBecomeOrganizer={() => navigate("/")}
        />
      </main>
      <Footer className="mt-auto" />
    </div>
  )
}

export default AboutPage