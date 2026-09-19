import * as React from "react"
import { ArrowRight, CalendarDays, Pencil } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export interface QuickstartValues {
  eventName: string
  category: string
  city: string
}

export interface QuickstartProps {
  className?: string
  onStart?: (values: QuickstartValues) => void
}

export function Quickstart({ className, onStart }: QuickstartProps) {
  const [values, setValues] = React.useState<QuickstartValues>({
    eventName: "",
    category: "",
    city: "",
  })

  const update =
    (key: keyof QuickstartValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onStart?.(values)
  }

  return (
    <Card
      className={cn(
        "border-0 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden />
          Quickstart
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">3-step setup</Badge>
        </CardAction>
        <CardDescription className="font-heading text-xl font-bold text-foreground">
          What celebration are you crafting?
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="quickstart-event-name">
                1. Event name
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <CalendarDays />
                </InputGroupAddon>
                <InputGroupInput
                  id="quickstart-event-name"
                  placeholder="e.g. Phnom Penh Jazz Night"
                  value={values.eventName}
                  onChange={update("eventName")}
                />
                <InputGroupAddon align="inline-end">
                  <Pencil />
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="quickstart-category">
                  2. Category
                </FieldLabel>
                <Input
                  id="quickstart-category"
                  placeholder="e.g. Music"
                  value={values.category}
                  onChange={update("category")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="quickstart-city">
                  3. City / Province
                </FieldLabel>
                <Input
                  id="quickstart-city"
                  placeholder="e.g. Phnom Penh"
                  value={values.city}
                  onChange={update("city")}
                />
              </Field>
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold">
              Start planning event
              <ArrowRight data-icon="inline-end" />
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
