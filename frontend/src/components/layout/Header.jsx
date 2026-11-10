import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  RiBellLine,
  RiMenuLine,
  RiMoonLine,
  RiSunLine,
  RiLogoutBoxLine,
  RiSettingsLine,
} from "react-icons/ri";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { OrgSwitch } from "@/components/OrgSwitch";
import { useApp } from "@/context/AppContext";

export function Header({ onMenu }) {
  const { dark, setDark, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--hairline)] bg-[var(--canvas)]/90 px-4 backdrop-blur-[12px] transition-colors">

      {/* ── Mobile left: hamburger + Logo ──────────── */}
      <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
        <button
          onClick={onMenu}
          aria-label="Open navigation"
          className="flex size-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
        >
          <RiMenuLine size={18} />
        </button>
        {/* Logo — matches sidebar top exactly */}
        <Logo size={24} className="text-[var(--ink)]" />
      </div>

      {/* ── Desktop: OrgSwitch in header (secondary, since sidebar shows logo) */}
      <div className="hidden min-w-0 flex-1 items-center lg:flex">
        <OrgSwitch />
      </div>

      {/* ── Right actions ───────────────────────────── */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex size-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? "sun" : "moon"}
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate:   0, scale: 1   }}
              exit={{    opacity: 0, rotate:  30, scale: 0.6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {dark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="flex size-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
        >
          <RiBellLine size={16} />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-1)]"
            >
              <Avatar className="size-7">
                <AvatarFallback className="text-[11px] font-[600]">MS</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-[13px] font-[500] text-[var(--ink)]">Mariel Santos</p>
              <p className="text-[11px] text-[var(--ink-muted)]">Org Member</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/app/settings")}>
              <RiSettingsLine size={14} className="text-[var(--ink-muted)]" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => { logout(); navigate("/login"); }}
              className="text-red-400 focus:text-red-400"
            >
              <RiLogoutBoxLine size={14} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
