import { History, LayoutDashboard, MoreHorizontal, ReceiptText } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { visibleNav } from "@/lib/nav";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const PINNED = ["/app/dashboard", "/app/remittances", "/app/history"];

export function BottomNav({ onMore }) {
  const { role, go } = useApp();
  const location = useLocation();
  const visible = visibleNav(role);

  /* Pick three pinned items that are accessible for the current role */
  const items = PINNED
    .filter((p) => visible.some((n) => n.path === p))
    .slice(0, 3)
    .map((p) => visible.find((n) => n.path === p));

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed bottom-0 z-30 grid w-full border-t border-[var(--hairline)] bg-[var(--canvas)]/95 backdrop-blur-[12px] lg:hidden"
      style={{ gridTemplateColumns: `repeat(${items.length + 1}, 1fr)` }}
    >
      {items.map((n) => {
        const active = location.pathname === n.path;
        return (
          <button
            key={n.path}
            onClick={() => go(n.path)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[60px] flex-col items-center justify-center gap-1",
              "text-[11px] font-[500] tracking-[-0.005em] transition-colors duration-150",
              active ? "text-[var(--ink)]" : "text-[var(--ink-muted)]",
            )}
          >
            <div className="relative">
              <n.icon className="size-5" />
              {active && (
                <motion.span
                  layoutId="bottom-nav-dot"
                  className="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[var(--accent-blue)]"
                />
              )}
            </div>
            {n.short}
          </button>
        );
      })}
      <button
        onClick={onMore}
        className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-[500] text-[var(--ink-muted)]"
      >
        <MoreHorizontal className="size-5" />
        More
      </button>
    </motion.nav>
  );
}
