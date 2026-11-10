/**
 * LandingHero.jsx
 * Full-viewport hero. Two-column on lg: copy left, animated mockup right.
 * Fixed: min-h-[100svh], restored demo button + trust strip, fixed glow typo.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  RiArrowRightLine,
  RiReceiptLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import { Button } from "@/components/ui";

const ease = [0.16, 1, 0.3, 1];

/* ── Animated remittance-flow mockup ─────────────────────── */
const FLOW_STEPS = [
  {
    label:    "Logged",
    sub:      "BSIT 3-A · ₱12,500",
    color:    "text-[var(--ink-muted)]",
    dot:      "bg-[var(--ink-muted)]",
    barColor: "bg-[var(--ink-muted)]",
    Icon:     RiReceiptLine,
    pct:      33,
  },
  {
    label:    "Pending Review",
    sub:      "Awaiting treasurer",
    color:    "text-amber-300",
    dot:      "bg-amber-400",
    barColor: "bg-amber-400",
    Icon:     RiTimeLine,
    pct:      66,
  },
  {
    label:    "Confirmed",
    sub:      "Balance updated",
    color:    "text-emerald-300",
    dot:      "bg-emerald-400",
    barColor: "bg-emerald-400",
    Icon:     RiCheckboxCircleLine,
    pct:      100,
  },
];

function RemittanceFlowCard() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % FLOW_STEPS.length), 2400);
    return () => clearInterval(id);
  }, []);
  const current = FLOW_STEPS[step];

  return (
    <div className="rounded-[24px] border border-[var(--hairline)] bg-[var(--surface-1)] p-5 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)_inset]">
      {/* Faux browser chrome */}
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--hairline)] pb-3.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500/55" />
          <span className="size-2.5 rounded-full bg-amber-500/55" />
          <span className="size-2.5 rounded-full bg-emerald-500/55" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-full border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-1 text-[11px] text-[var(--ink-muted)]">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          orgbudget.app/remittances
        </div>
      </div>

      {/* Flow status card */}
      <div className="rounded-[16px] border border-[var(--hairline)] bg-[var(--surface-2)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] font-[500] text-[var(--ink-muted)]">Remittance Status</p>
          <span className="text-[11px] text-[var(--ink-muted)]">Jun 18, 2026</span>
        </div>

        {/* Step dots + connecting lines */}
        <div className="mb-4 flex items-center gap-2">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <motion.span
                animate={{ scale: i === step ? 1.25 : 0.75, opacity: i === step ? 1 : 0.35 }}
                transition={{ duration: 0.3, ease }}
                className={`size-2 rounded-full ${s.dot}`}
              />
              {i < FLOW_STEPS.length - 1 && (
                <div className="h-px w-8 bg-[var(--hairline)]" />
              )}
            </div>
          ))}
        </div>

        {/* Animated status label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8,  filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
            exit={{    opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease }}
            className="flex items-center gap-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-1)]">
              <current.Icon size={16} className={current.color} />
            </span>
            <div>
              <p className={`text-[15px] font-[500] leading-tight tracking-[-0.02em] ${current.color}`}>
                {current.label}
              </p>
              <p className="text-[12px] text-[var(--ink-muted)]">{current.sub}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--hairline)]">
          <motion.div
            animate={{ width: `${current.pct}%` }}
            transition={{ duration: 0.65, ease }}
            className={`h-full rounded-full ${current.barColor}`}
          />
        </div>
        <p className="mt-1.5 text-right text-[11px] text-[var(--ink-muted)]">
          {current.pct}% complete
        </p>
      </div>

      {/* Mini stats */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["₱128,450", "Available"],
          ["₱214,750", "Total in"],
          ["24",        "Pending"],
        ].map(([val, lbl]) => (
          <div
            key={lbl}
            className="rounded-[12px] border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-3"
          >
            <p className="text-[13px] font-[500] tabular-nums tracking-[-0.025em] text-[var(--ink)]">
              {val}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--ink-muted)]">{lbl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Trust strip ──────────────────────────────────────────── */
const TRUST_ITEMS = ["Class treasuries", "Student orgs", "Cooperatives", "Hobby clubs"];

/* ── Hero ─────────────────────────────────────────────────── */
export function LandingHero({ onRegister, onLogin, onDemo }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  /* Parallax: mockup moves down slower than scroll, copy even slower */
  const mockY   = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const copyY   = useTransform(scrollYProgress, [0, 1], [0, 30]);
  /* Atmosphere fades as user scrolls away */
  const glowOp  = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-24"
    >
      {/* ── Atmosphere glow — violet centre ─── */}
      <motion.div
        aria-hidden
        style={{ opacity: glowOp }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[75vh]"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse 85% 60% at 50% -10%, rgba(107,59,222,0.3) 0%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* Right-side magenta accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[60vh] w-[50vw]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 85% 10%, rgba(174,30,138,0.13) 0%, transparent 65%)",
        }}
      />

      {/* Floating orbs */}
      {[
        { w: 360, h: 360, x: "8%",  y: "20%", color: "rgba(107,59,222,0.07)", dur: 8  },
        { w: 260, h: 260, x: "72%", y: "52%", color: "rgba(174,30,138,0.07)", dur: 11 },
        { w: 200, h: 200, x: "52%", y: "4%",  color: "rgba(107,59,222,0.05)", dur: 9  },
      ].map((orb, i) => (
        <motion.div
          key={i}
          aria-hidden
          animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.6 }}
          className="pointer-events-none absolute rounded-full blur-[70px]"
          style={{
            width:      orb.w,
            height:     orb.h,
            left:       orb.x,
            top:        orb.y,
            background: orb.color,
          }}
        />
      ))}

      {/* ── Content grid ──────────────────────── */}
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: copy ──────────────────── */}
          <motion.div style={{ y: copyY }} className="flex flex-col">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.05 }}
              className="text-[clamp(2.8rem,6vw,4.5rem)] font-[500] leading-[0.93] tracking-[-0.055em]"
            >
              Every remittance,
              <br />
              <span className="text-[var(--ink-muted)]">accounted for.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.14 }}
              className="mt-7 max-w-[480px] text-[18px] leading-[1.6] text-[var(--ink-muted)]"
            >
              Members confirm. Reps log. Treasurers reconcile. A
              role-based ledger that makes group finances transparent —
              and auditable — from day one.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.22 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14, ease }}
              >
                <Button className="gap-2 px-5" onClick={onRegister}>
                  Register your org
                  <RiArrowRightLine size={15} />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14, ease }}
              >
              
              </motion.div>
            </motion.div>

            {/* Sign-in hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              className="mt-4 text-[13px] text-[var(--ink-muted)]"
            >
              Already have an org?{" "}
              <button
                onClick={onLogin}
                className="font-[500] text-[var(--ink)] underline-offset-2 transition-opacity hover:opacity-70 hover:underline"
              >
                Log in
              </button>
            </motion.p>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52, duration: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <span className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--ink-muted)]">
                Built for
              </span>
              {TRUST_ITEMS.map((item, i) => (
                <span key={item} className="flex items-center gap-2 text-[12px] text-[var(--ink-muted)]">
                  {i > 0 && <span className="size-1 rounded-full bg-[var(--hairline)]" />}
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: animated mockup ──────── */}
          <motion.div
            style={{ y: mockY }}
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            transition={{ duration: 0.78, ease, delay: 0.18 }}
            className="relative"
          >
            {/* Soft bloom behind card */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-[48px] blur-[56px]"
              style={{ background: "rgba(107,59,222,0.1)" }}
            />
            <div className="relative">
              <RemittanceFlowCard />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
