import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CreateEvent } from "@/components/create-event"

export function CreateEventPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Navbar activeItem="Create Event" />
      <CreateEvent />
      <Footer className="mt-auto" />
    </div>
  )
}

export default CreateEventPage
