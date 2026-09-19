import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "cn"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} {...props} />
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-active:bg-background data-active:text-foreground data-active:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring/50", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }