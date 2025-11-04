"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

import { cn } from "@/lib/utils"

function DropdownMenu(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>
) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>
) {
  return (
    <DropdownMenuPrimitive.Trigger data-slot="dropdown-trigger" {...props} />
  )
}

function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align="end"
        sideOffset={8}
        className={cn(
          "z-9999 min-w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg",
          "data-[side=bottom]:animate-in data-[side=top]:animate-in",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:bg-slate-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>
) {
  return (
    <DropdownMenuPrimitive.Separator
      className="-mx-1 my-1 h-px bg-slate-200"
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
