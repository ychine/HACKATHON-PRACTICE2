import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiMenuFoldLine, RiMenuUnfoldLine, RiCloseLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Logo } from "@/components/Logo";
import { OrgSwitch } from "@/components/OrgSwitch";
import { roles } from "@/lib/data";
import { visibleNav } from "@/lib/nav";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const SIDEBAR_W           = 248;
export const SIDEBAR_W_COLLAPSED = 64;

/* ── Nav items ──────────────────────────────────────────────── */
export function NavMenu({ collapsed = false, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role }  = useApp();

  return visibleNav(role).map((n) => {
    const active = location.pathname === n.path;
    return (
      <button
        key={n.path}
        onClick={() => { navigate(n.path); onNavigate?.(); }}
        title={collapsed ? n.label : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center rounded-[10px]",
          "text-[13px] font-[500] tracking-[-0.01em] transition-all duration-150",
          collapsed ? "justify-center px-0" : "gap-3 px-3",
          active
            ? "bg-[var(--surface-2)] text-[var(--ink)]"
            : "text-[var(--ink-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--ink)]",
        )}
      >
        <n.icon className="size-[15px] shrink-0" />
        {!collapsed && <span className="truncate">{n.label}</span>}
      </button>
    );
  });
}

/* ── Role selector ──────────────────────────────────────────── */
export function RoleSelect({ redirect = false, className }) {
  const { role, setRole } = useApp();
  const navigate           = useNavigate();
  return (
    <Select
      value={role}
      onValueChange={(v) => { setRole(v); if (redirect) navigate("/app/dashboard"); }}
    >
      <SelectTrigger className={cn("h-8 text-[12px]", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((r) => (
          <SelectItem value={r} key={r}>{r}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ── Desktop sidebar ────────────────────────────────────────── */
export function Sidebar({ collapsed, setCollapsed }) {
  const { dark, setDark } = useApp();
  const w = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col overflow-hidden border-r border-[var(--hairline)] bg-[var(--canvas)] transition-colors lg:flex"
    >
      {/* ── Top: Logo + (expanded) OrgSwitch ──────────── */}
      <div
        className={cn(
          "flex shrink-0 flex-col border-b border-[var(--hairline)]",
          collapsed ? "items-center justify-center" : "px-3 pb-0 pt-0",
        )}
      >
        {collapsed ? (
          /* Collapsed — icon mark only, same 56-px rail height as expanded */
          <div className="flex h-14 w-full items-center justify-center">
            <Logo size={26} mark className="text-[var(--ink)]" />
          </div>
        ) : (
          /* Expanded — Logo row + OrgSwitch below */
          <>
            {/* Logo row — same height as landing nav (56px) */}
            <div className="flex h-14 items-center border-b border-[var(--hairline)]">
              <Logo size={26} className="text-[var(--ink)]" />
            </div>
            {/* Org switcher row */}
            <div className="py-2">
              <OrgSwitch />
            </div>
          </>
        )}
      </div>

      {/* ── Nav links ─────────────────────────────────── */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
        <NavMenu collapsed={collapsed} />
      </nav>

      {/* ── Bottom: Dark mode + role select + collapse toggle ── */}
      <div className="space-y-1 border-t border-[var(--hairline)] p-2.5">
        {/* Dark mode toggle */}
  

        {/* Role selector — expanded only */}
        {!collapsed && (
          <div className="pt-1">
            <p className="mb-1.5 px-1 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
              View as · Prototype
            </p>
            <RoleSelect redirect />
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-9 w-full items-center rounded-[10px] text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]",
            collapsed ? "justify-center px-0" : "gap-3 px-3",
          )}
        >
          {collapsed
            ? <RiMenuUnfoldLine size={15} />
            : (
              <>
                <RiMenuFoldLine size={15} className="shrink-0" />
                <span className="text-[13px] font-[500]">Collapse</span>
              </>
            )
          }
        </button>
      </div>
    </motion.aside>
  );
}

/* ── Mobile drawer ──────────────────────────────────────────── */
export function MobileDrawer({ onClose }) {
  const { dark, setDark } = useApp();

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      >
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-full w-[82%] max-w-[280px] flex-col border-r border-[var(--hairline)] bg-[var(--canvas)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: Logo + close */}
          <div className="flex h-14 items-center justify-between border-b border-[var(--hairline)] px-4">
            <Logo size={24} className="text-[var(--ink)]" />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex size-8 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
            >
              <RiCloseLine size={16} />
            </button>
          </div>

          {/* OrgSwitch row */}
          <div className="border-b border-[var(--hairline)] px-3 py-2">
            <OrgSwitch />
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
            <NavMenu onNavigate={onClose} />
          </nav>

          {/* Bottom */}
          <div className="space-y-1 border-t border-[var(--hairline)] p-2.5">
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] font-[500] text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
            >
              {dark ? <RiSunLine size={15} /> : <RiMoonLine size={15} />}
              <span>{dark ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className="pt-1">
              <Label className="px-1 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
                View as · Prototype
              </Label>
              <RoleSelect className="mt-1.5" />
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
