/**
 * ui.jsx — Component library aligned to DESIGN.md
 * Dark-canvas system: near-black surfaces, white pill CTAs,
 * accent-blue for focus/links only, tight negative letter-spacing.
 */
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Shared motion presets ───────────────────────────────────── */
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
};
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.22, ease: "easeOut" },
};

/* ── Button ──────────────────────────────────────────────────── */
export function Button({ className, variant = "default", size = "default", ...props }) {
  return (
    <button
      className={cn(
        // base — pill shape, tight body-sm type
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
        "text-[14px] font-[500] leading-none tracking-[-0.01em]",
        "transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--canvas)]",
        "disabled:pointer-events-none disabled:opacity-40",
        "active:scale-[0.97]",

        // variants
        variant === "default"     && "rounded-full bg-[var(--ink)] text-[var(--canvas)] hover:bg-white/90 px-4 py-[10px]",
        variant === "secondary"   && "rounded-full bg-[var(--surface-1)] text-[var(--ink)] hover:bg-[var(--surface-2)] px-4 py-[10px]",
        variant === "outline"     && "rounded-full border border-[var(--hairline)] bg-transparent text-[var(--ink)] hover:bg-[var(--surface-1)] px-4 py-[10px]",
        variant === "ghost"       && "rounded-full bg-transparent text-[var(--ink-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--ink)] px-3 py-2",
        variant === "destructive" && "rounded-full bg-red-600 text-white hover:bg-red-500 px-4 py-[10px]",

        // sizes
        size === "default" && "h-10",
        size === "sm"      && "h-9 text-[13px] px-3",
        size === "icon"    && "size-10 p-0",

        className,
      )}
      {...props}
    />
  );
}

/* ── Card ────────────────────────────────────────────────────── */
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)]",
        "shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]",
        className,
      )}
      {...props}
    />
  );
}
export const CardHeader = ({ className, ...props }) => (
  <div className={cn("p-6 pb-3", className)} {...props} />
);
export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn("text-[15px] font-[500] leading-tight tracking-[-0.015em] text-[var(--ink)]", className)}
    {...props}
  />
);
export const CardDescription = ({ className, ...props }) => (
  <p className={cn("mt-1 text-[13px] text-[var(--ink-muted)]", className)} {...props} />
);
export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-3", className)} {...props} />
);

/* ── Input ───────────────────────────────────────────────────── */
export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-[10px] border border-[var(--hairline)]",
        "bg-[var(--surface-2)] px-3 text-[14px] text-[var(--ink)]",
        "placeholder:text-[var(--ink-muted)] outline-none",
        "transition-shadow duration-150",
        "focus-visible:shadow-[0_0_0_1.5px_rgba(0,153,255,0.6)]",
        className,
      )}
      {...props}
    />
  );
}
export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full resize-y rounded-[10px] border border-[var(--hairline)]",
        "bg-[var(--surface-2)] px-3 py-2.5 text-[14px] text-[var(--ink)]",
        "placeholder:text-[var(--ink-muted)] outline-none",
        "transition-shadow duration-150",
        "focus-visible:shadow-[0_0_0_1.5px_rgba(0,153,255,0.6)]",
        className,
      )}
      {...props}
    />
  );
}
export const Label = ({ className, ...props }) => (
  <LabelPrimitive.Root
    className={cn("text-[13px] font-[500] text-[var(--ink-muted)]", className)}
    {...props}
  />
);

/* ── Badge ───────────────────────────────────────────────────── */
export function Badge({ children, variant = "secondary", className }) {
  const styles = {
    secondary: "bg-[var(--surface-2)] text-[var(--ink-muted)]",
    outline:   "border border-[var(--hairline)] text-[var(--ink)]",
    pending:   "bg-amber-500/15 text-amber-300",
    confirmed: "bg-emerald-500/15 text-emerald-300",
    rejected:  "bg-red-500/15 text-red-300",
    primary:   "bg-white/10 text-[var(--ink)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-[500] tracking-[-0.01em]",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Separator / Skeleton ────────────────────────────────────── */
export const Separator = ({ className }) => (
  <div className={cn("h-px w-full bg-[var(--hairline-soft)]", className)} />
);
export const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-[10px] bg-[var(--surface-2)]", className)} />
);

/* ── Tabs ────────────────────────────────────────────────────── */
export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-10 items-center rounded-full bg-[var(--surface-1)] p-1",
      className,
    )}
    {...props}
  />
);
export const TabsTrigger = ({ className, ...props }) => (
  <TabsPrimitive.Trigger
    className={cn(
      "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-[500] tracking-[-0.01em]",
      "text-[var(--ink-muted)] outline-none transition-all duration-150",
      "data-[state=active]:bg-[var(--surface-2)] data-[state=active]:text-[var(--ink)]",
      "focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]",
      className,
    )}
    {...props}
  />
);
export const TabsContent = ({ className, ...props }) => (
  <TabsPrimitive.Content className={cn("mt-4 outline-none", className)} {...props} />
);

/* ── DropdownMenu ────────────────────────────────────────────── */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={6}
      className={cn(
        "z-50 min-w-56 rounded-[15px] border border-[var(--hairline)]",
        "bg-[var(--surface-1)] p-1.5 text-[var(--ink)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);
export const DropdownMenuItem = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "flex cursor-pointer items-center gap-2 rounded-[8px] px-3 py-2",
      "text-[13px] outline-none transition-colors focus:bg-[var(--surface-2)]",
      className,
    )}
    {...props}
  />
);
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;

/* ── Dialog ──────────────────────────────────────────────────── */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-6",
          "shadow-[0_24px_64px_rgba(0,0,0,0.6)]",
          "outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const DialogTitle = ({ className, ...props }) => (
  <DialogPrimitive.Title
    className={cn("text-[18px] font-[500] leading-tight tracking-[-0.025em]", className)}
    {...props}
  />
);
export const DialogDescription = ({ className, ...props }) => (
  <DialogPrimitive.Description
    className={cn("mt-1.5 text-[13px] text-[var(--ink-muted)]", className)}
    {...props}
  />
);

/* ── AlertDialog ─────────────────────────────────────────────── */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export function AlertDialogContent({ children }) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px]" />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-6",
          "shadow-[0_24px_64px_rgba(0,0,0,0.6)]",
        )}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}
export const AlertDialogTitle = ({ children }) => (
  <AlertDialogPrimitive.Title className="text-[18px] font-[500] tracking-[-0.025em]">
    {children}
  </AlertDialogPrimitive.Title>
);
export const AlertDialogDescription = ({ children }) => (
  <AlertDialogPrimitive.Description className="mt-2 text-[13px] text-[var(--ink-muted)]">
    {children}
  </AlertDialogPrimitive.Description>
);
export const AlertDialogCancel = ({ children }) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button variant="outline">{children}</Button>
  </AlertDialogPrimitive.Cancel>
);
export const AlertDialogAction = ({ children, onClick }) => (
  <AlertDialogPrimitive.Action asChild>
    <Button onClick={onClick}>{children}</Button>
  </AlertDialogPrimitive.Action>
);

/* ── Avatar ──────────────────────────────────────────────────── */
export const Avatar = ({ initials, className }) => (
  <AvatarPrimitive.Root
    className={cn(
      "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden",
      "rounded-[10px] bg-white/10 text-[13px] font-[600] text-[var(--ink)]",
      className,
    )}
  >
    <AvatarPrimitive.Fallback>{initials}</AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);

/* ── Select ──────────────────────────────────────────────────── */
export const Select = SelectPrimitive.Root;
export function SelectTrigger({ className, children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full cursor-pointer items-center justify-between rounded-[10px]",
        "border border-[var(--hairline)] bg-[var(--surface-2)] px-3",
        "text-[14px] text-[var(--ink)] outline-none",
        "transition-shadow focus-visible:shadow-[0_0_0_1.5px_rgba(0,153,255,0.6)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="size-4 text-[var(--ink-muted)]" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
export const SelectValue = SelectPrimitive.Value;
export function SelectContent({ children }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={4}
        className={cn(
          "z-50 min-w-[var(--radix-select-trigger-width)] rounded-[15px]",
          "border border-[var(--hairline)] bg-[var(--surface-1)] p-1.5",
          "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        )}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectItem({ value, children }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="relative flex cursor-pointer items-center rounded-[8px] py-2 pl-8 pr-3 text-[13px] outline-none focus:bg-[var(--surface-2)]"
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2">
        <Check className="size-3.5 text-[var(--accent-blue)]" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

/* ── Accordion ───────────────────────────────────────────────── */
export const Accordion = AccordionPrimitive.Root;
export function AccordionItem({ value, children }) {
  return (
    <AccordionPrimitive.Item value={value} className="border-b border-[var(--hairline-soft)]">
      {children}
    </AccordionPrimitive.Item>
  );
}
export function AccordionTrigger({ children }) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between py-4 text-left text-[14px] font-[500] tracking-[-0.01em] text-[var(--ink)]">
        <span>{children}</span>
        <ChevronDown className="size-4 text-[var(--ink-muted)] transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
export const AccordionContent = ({ children }) => (
  <AccordionPrimitive.Content className="pb-4 text-[13px] leading-relaxed text-[var(--ink-muted)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
    {children}
  </AccordionPrimitive.Content>
);

/* ── SpotlightCard — gradient atmosphere tile ────────────────── */
export function SpotlightCard({ variant = "violet", className, children }) {
  const bg = {
    violet:  "spotlight-violet",
    magenta: "spotlight-magenta",
    orange:  "spotlight-orange",
    coral:   "spotlight-coral",
  }[variant] ?? "spotlight-violet";
  return (
    <div
      className={cn(
        "rounded-[30px] p-8 text-[var(--ink)]",
        "shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]",
        bg,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── MotionCard — fade-up wrapper for page cards ─────────────── */
export function MotionCard({ delay = 0, className, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
