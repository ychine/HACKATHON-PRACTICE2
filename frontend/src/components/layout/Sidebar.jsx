import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { OrgSwitch } from "@/components/OrgSwitch";
import { roles, themes } from "@/lib/data";
import { visibleNav } from "@/lib/nav";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

/* Sidebar widths — keep in sync with SIDEBAR_W/SIDEBAR_W_COLLAPSED in App.jsx */
export const SIDEBAR_W           = 240;
export const SIDEBAR_W_COLLAPSED = 72;

export function NavMenu({ collapsed = false, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useApp();

  return visibleNav(role).map((n) => {
    const active = location.pathname === n.path;
    return (
      <button
        key={n.path}
        onClick={() => {
          navigate(n.path);
          onNavigate?.();
        }}
        title={n.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center rounded-[10px]",
          "text-[13px] font-[500] tracking-[-0.01em] transition-all duration-150",
          collapsed ? "justify-center px-0" : "gap-3 px-3",
          active
            ? "bg-white/10 text-[var(--ink)]"
            : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
        )}
      >
        <n.icon className="size-4 shrink-0" />
        {!collapsed && <span className="truncate">{n.label}</span>}
      </button>
    );
  });
}

export function RoleSelect({ redirect = false, className }) {
  const { role, setRole } = useApp();
  const navigate = useNavigate();
  return (
    <Select
      value={role}
      onValueChange={(v) => {
        setRole(v);
        if (redirect) navigate("/app/dashboard");
      }}
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

export function Sidebar({ collapsed, setCollapsed }) {
  const { theme } = useApp();
  const w = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  return (
    <motion.aside
      /* Drive width with Motion — avoids Tailwind purge of arbitrary values */
      animate={{ width: w }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--hairline)] bg-[var(--canvas)] overflow-hidden lg:flex"
    >
      {/* Top — logo / org */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-[var(--hairline)]",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        {collapsed
          ? <Avatar className="size-8" initials={themes[theme][2]} />
          : <OrgSwitch />
        }
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
        <NavMenu collapsed={collapsed} />
      </nav>

      {/* Bottom — role + collapse toggle */}
      <div className="shrink-0 space-y-2 border-t border-[var(--hairline)] p-2.5">
        {!collapsed && (
          <div>
            <p className="mb-1.5 px-1 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
              View as · Prototype
            </p>
            <RoleSelect redirect />
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start gap-2 text-[var(--ink-muted)] hover:text-[var(--ink)]"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="size-4 shrink-0" />
          {!collapsed && <span className="text-[13px]">Collapse</span>}
        </Button>
      </div>
    </motion.aside>
  );
}

export function MobileDrawer({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      >
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-[82%] max-w-xs border-r border-[var(--hairline)] bg-[var(--canvas)] p-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
            <OrgSwitch />
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
              <X className="size-4" />
            </Button>
          </div>
          <nav className="mt-3 space-y-0.5">
            <NavMenu onNavigate={onClose} />
          </nav>
          <div className="absolute bottom-6 left-3 right-3 space-y-2">
            <Label className="px-1 text-[10px] font-[700] uppercase tracking-[0.06em]">
              View as · Prototype
            </Label>
            <RoleSelect className="mt-1" />
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}
