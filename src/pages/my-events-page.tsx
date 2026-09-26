import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MyEvents } from "@/components/my-events"

export function MyEventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem="My Events" />
      <MyEvents />
      <Footer className="mt-auto" />
    </div>
  )
}

export default MyEventsPage
