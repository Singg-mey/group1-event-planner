import { CalendarDays, Globe2, MapPin } from "lucide-react"
import { cn } from "cn"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

export interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border/60 bg-[#EFF4FF] py-10 dark:bg-background",
        className
      )}
    >
      <Card className="mx-auto max-w-7xl rounded-none border-0 bg-transparent px-4 shadow-none ring-0 sm:px-6 lg:px-8">
        <CardContent className="grid gap-10 px-0 py-0 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <a
              href="#home"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CalendarDays className="size-4" />
              </span>
              <span>EventPlanner</span>
            </a>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Empowering Cambodia&apos;s vibrant community through effortless
              event discovery, grassroots gatherings, and seamless organizing
              across Phnom Penh, Siem Reap, and beyond.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-background/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
              <MapPin className="size-3 text-primary" />
              Proudly built for Cambodia
            </div>
          </div>

          <FooterLinkGroup
            title="Discovery"
            links={[
              "All Events",
              "Phnom Penh Tech",
              "Siem Reap Workshops",
              "Community Arts & Culture",
            ]}
          />
          <FooterLinkGroup
            title="Organizers"
            links={[
              "Host an Event",
              "Organizer Dashboard",
              "Community Guidelines",
              "Planning Resources",
            ]}
          />
          <FooterLinkGroup
            title="About & Trust"
            links={[
              "Our Mission",
              "Safety & Verification",
              "Contact Support",
              "Privacy Policy",
            ]}
          />
        </CardContent>

        <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-2 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2025 EventPlanner Cambodia. Connecting communities across the
            Kingdom of Wonder.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="#language"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <Globe2 className="size-3" />
              ខ្មែរ / English
            </a>
          </div>
        </div>
      </Card>
    </footer>
  )
}

function FooterLinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-foreground">{title}</h2>
      <nav className="flex flex-col items-start gap-2" aria-label={title}>
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  )
}

export default Footer