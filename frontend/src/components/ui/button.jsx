import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-[14px] font-[500] leading-none tracking-[-0.01em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--canvas)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-[var(--ink)] text-[var(--canvas)] px-4 py-[10px] hover:bg-white/90",
        secondary:
          "rounded-full bg-[var(--surface-1)] text-[var(--ink)] px-4 py-[10px] hover:bg-[var(--surface-2)]",
        outline:
          "rounded-full border border-[var(--hairline)] bg-transparent text-[var(--ink)] px-4 py-[10px] hover:bg-[var(--surface-1)]",
        ghost:
          "rounded-full bg-transparent text-[var(--ink-muted)] px-3 py-2 hover:bg-[var(--surface-1)] hover:text-[var(--ink)]",
        destructive:
          "rounded-full bg-red-600 text-white px-4 py-[10px] hover:bg-red-500",
      },
      size: {
        default: "h-10",
        sm: "h-9 text-[13px] px-3",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
