import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "cn"

// Reliable base64 SVG fallback image in case external images fail or get blocked by CORS/Ad-blockers
const DEFAULT_AVATAR_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2364748b'/><circle cx='50' cy='38' r='20' fill='%23f8fafc'/><path d='M20 85 c0-20 15-30 30-30 s30 10 30 30' fill='%23f8fafc'/></svg>"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative inline-flex shrink-0 select-none rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 size-8",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  defaultSrc = DEFAULT_AVATAR_IMAGE,
  ...props
}: AvatarPrimitive.Image.Props & {
  defaultSrc?: string
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={src || defaultSrc}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute z-10 block select-none rounded-full bg-emerald-500 ring-2 ring-background pointer-events-none",
        "bottom-0 right-0",
        "group-data-[size=sm]/avatar:size-2",
        "group-data-[size=default]/avatar:size-2.5",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:bottom-0.5 group-data-[size=lg]/avatar:right-0.5",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}