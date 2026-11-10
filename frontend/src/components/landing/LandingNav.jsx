/**
 * LandingNav.jsx
 * Features · How It Works · For Org Leaders · Contact
 * Log In (ghost) + Register an Org (solid)
 * Dark/light toggle with animated icon swap.
 */
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useState } from "react";
import { RiMenuLine, RiCloseLine, RiMoonLine, RiSunLine } from "react-icons/ri";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { label: "Features",        href: "#features" },
  { label: "How It Works",    href: "#how-it-works" },
  { label: "For Org Leaders", href: "#roles" },
  { label: "Contact",         href: "#contact" },
];

export function LandingNav({ onLogin, onRegister, isDark, onToggleDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const bgOpacity     = useTransform(scrollY, [0, 60], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 z-50 w-full"
      >
        {/* Scroll-reactive glass bar */}
        <motion.div
          className="absolute inset-0 backdrop-blur-[16px]"
          style={{
            backgroundColor: `rgba(var(--canvas-rgb,17,17,16),${bgOpacity})`,
            borderBottom: "1px solid",
            borderBottomColor: `rgba(128,128,128,${borderOpacity * 0.15})`,
          }}
        />

        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <a href="#hero" aria-label="OrgBudget home">
            <Logo size={28} />
          </a>

          {/* Center nav — desktop */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-[var(--ink-muted)] transition-colors duration-150 hover:text-[var(--ink)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA + toggle */}
          <div className="flex items-center gap-2">
            {/* Dark/light toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              onClick={onToggleDark}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex size-9 items-center justify-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0,   scale: 1   }}
                  exit={{    opacity: 0, rotate:  30, scale: 0.6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {isDark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogin}
              className="hidden sm:inline-flex"
            >
              Log In
            </Button>
            <Button size="sm" onClick={onRegister}>
              Register an Org
            </Button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex size-9 items-center justify-center rounded-full text-[var(--ink-muted)] hover:bg-[var(--surface-1)] md:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -20 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobileOpen ? <RiCloseLine size={18} /> : <RiMenuLine size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-40 border-b border-[var(--hairline)] bg-[var(--canvas)] px-6 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-[10px] px-3 py-2.5 text-[14px] font-[500] text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-1)] hover:text-[var(--ink)]"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 flex gap-2 border-t border-[var(--hairline-soft)] pt-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => { setMobileOpen(false); onLogin(); }}
                >
                  Log In
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => { setMobileOpen(false); onRegister(); }}
                >
                  Register an Org
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
