import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { Button } from "@/components/ui/button"
import type { SearchEvent } from "@/types/event"

export interface EventCardActionsProps {
  event: SearchEvent
  onEdit?: (event: SearchEvent) => void
  onDelete: (event: SearchEvent) => void | Promise<void>
  isDeleting?: boolean
  size?: "sm" | "xs"
  className?: string
}

/**
 * Edit + delete controls shared by the event detail page, the My Events list,
 * and anywhere else an owned event is rendered.
 */
export function EventCardActions({
  event,
  onEdit,
  onDelete,
  isDeleting = false,
  size = "sm",
  className,
}: EventCardActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <>
      <div className={className}>
        {onEdit && (
          <Button
            type="button"
            variant="outline"
            size={size}
            onClick={() => onEdit(event)}
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size={size}
          onClick={() => setIsDialogOpen(true)}
          className="gap-1.5"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>

      <ConfirmDeleteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={`Delete "${event.title}"?`}
        description="This permanently removes the event for everyone. This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={() => onDelete(event)}
      />
    </>
  )
}

export default EventCardActions
