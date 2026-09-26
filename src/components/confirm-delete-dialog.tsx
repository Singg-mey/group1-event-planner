import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  isDeleting?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete event",
  isDeleting = false,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch {
      // Leave the dialog open so the failure stays in front of the user
      // instead of revealing an error message behind a closed dialog.
      return
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Keep event
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isDeleting ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
