import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  BarChart3,
  CheckCircle2,
  ReceiptText,
  ShieldCheck,
  Users,
  WalletCards,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button, SpotlightCard } from "@/components/ui";

/* ── Fade-up helper ─────────────────────────────────────── */
function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature card ───────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, body, delay }) {
  return (
    <FadeUp delay={delay}>
      <div className="rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-7 h-full shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
        <div className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--surface-2)]">
          <Icon className="size-5 text-[var(--ink)]" />
        </div>
        <h3 className="mt-5 text-[18px] font-[500] leading-tight tracking-[-0.025em]">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)]">{body}</p>
      </div>
    </FadeUp>
  );
}

/* ── Stat badge ─────────────────────────────────────────── */
function StatBadge({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-[48px] font-[500] leading-none tracking-[-0.055em]">{number}</p>
      <p className="mt-2 text-[13px] text-[var(--ink-muted)]">{label}</p>
    </div>
  );
}

/* ── Top nav ────────────────────────────────────────────── */
function TopNav({ onLogin, onGetStarted }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 z-50 w-full border-b border-[var(--hairline)] bg-[var(--canvas)]/90 backdrop-blur-[14px]"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-[9px] bg-[var(--surface-2)]">
            <WalletCards className="size-4" />
          </div>
          <span className="text-[15px] font-[500] tracking-[-0.02em]">OrgBudget</span>
        </div>

        {/* Center nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          {["Features", "How it works", "Pricing"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="text-[13px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* CTA pair */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onLogin}>
            Sign in
          </Button>
          <Button size="sm" onClick={onGetStarted}>
            Get started free
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const toApp = () => navigate("/app/dashboard");
  const toLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <TopNav onLogin={toLogin} onGetStarted={toApp} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-6 pb-24 pt-36 text-center"
        id="hero"
      >
        {/* Atmosphere glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(107,59,222,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-1.5"
          >
            <Zap className="size-3.5 text-[var(--accent-blue)]" />
            <span className="text-[12px] font-[500] text-[var(--ink-muted)]">
              Built for student organizations
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-[500] leading-[0.95] tracking-[-0.055em]"
          >
            Budget management
            <br />
            <span className="text-[var(--ink-muted)]">for every org.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-[var(--ink-muted)]"
          >
            Track remittances, manage members, and keep every peso accountable —
            from submission to confirmation in one place.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              className="min-w-44 gap-2"
              onClick={toApp}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="secondary" onClick={toLogin} className="min-w-32">
              Sign in
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-5 text-[12px] text-[var(--ink-muted)]"
          >
            Free for student organizations · No credit card required
          </motion.p>
        </div>

        {/* Hero mockup card */}
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mx-auto mt-16 max-w-3xl"
        >
          <div className="rounded-[24px] border border-[var(--hairline)] bg-[var(--surface-1)] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)_inset]">
            {/* Mock header bar */}
            <div className="mb-5 flex items-center gap-2 border-b border-[var(--hairline)] pb-4">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-500/60" />
                <span className="size-3 rounded-full bg-amber-500/60" />
                <span className="size-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="mx-auto rounded-full border border-[var(--hairline)] bg-[var(--surface-2)] px-4 py-1 text-[11px] text-[var(--ink-muted)]">
                orgbudget.app/dashboard
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["₱128,450", "Available balance", "violet"],
                ["₱214,750", "Total remitted",    "magenta"],
                ["₱86,300",  "Total expenses",    null],
              ].map(([val, label, spotlight]) =>
                spotlight ? (
                  <SpotlightCard key={label} variant={spotlight} className="rounded-[16px] p-5">
                    <p className="text-[11px] text-white/60">{label}</p>
                    <p className="mt-2 text-[22px] font-[500] tabular-nums tracking-[-0.03em]">{val}</p>
                  </SpotlightCard>
                ) : (
                  <div
                    key={label}
                    className="rounded-[16px] border border-[var(--hairline)] bg-[var(--surface-2)] p-5"
                  >
                    <p className="text-[11px] text-[var(--ink-muted)]">{label}</p>
                    <p className="mt-2 text-[22px] font-[500] tabular-nums tracking-[-0.03em]">{val}</p>
                  </div>
                )
              )}
            </div>

            {/* Mock row list */}
            <div className="mt-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--surface-2)]">
              {[
                ["BSIT 3-A remittance", "Jun 18", "₱12,500", "pending"],
                ["BSCS 2-B remittance", "Jun 14", "₱9,750",  "confirmed"],
                ["Leadership summit",   "Jun 16", "₱8,400",  "confirmed"],
              ].map(([name, date, amt, status]) => (
                <div
                  key={name}
                  className="flex items-center gap-4 border-b border-[var(--hairline-soft)] px-4 py-3 last:border-0"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-1)]">
                    <ReceiptText className="size-3.5 text-[var(--ink-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[12px] font-[500]">{name}</p>
                    <p className="text-[11px] text-[var(--ink-muted)]">{date}</p>
                  </div>
                  <span className="text-[12px] font-[600] tabular-nums">{amt}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-[500] ${
                      status === "pending"
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="border-y border-[var(--hairline)] py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-12 px-6 md:grid-cols-4">
          {[
            ["500+",  "Organizations"],
            ["98%",   "Faster reviews"],
            ["₱2M+",  "Tracked monthly"],
            ["4.9★",  "Avg. rating"],
          ].map(([num, lbl], i) => (
            <FadeUp key={lbl} delay={i * 0.07}>
              <StatBadge number={num} label={lbl} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="mb-3 text-[13px] font-[500] uppercase tracking-[0.07em] text-[var(--ink-muted)]">
              Features
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em]">
              Everything your org needs.
            </h2>
          </FadeUp>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ReceiptText,
                title: "Remittance tracking",
                body: "Log, submit, and confirm fund collections with full proof-of-payment uploads. Every peso traced.",
                delay: 0.05,
              },
              {
                icon: Users,
                title: "Member management",
                body: "Track every member's section, year level, and total contributions in a searchable roster.",
                delay: 0.10,
              },
              {
                icon: ShieldCheck,
                title: "Audit log",
                body: "A tamper-resistant trail of every confirmation, rejection, and role change — always read-only.",
                delay: 0.15,
              },
              {
                icon: BarChart3,
                title: "Reports & analytics",
                body: "Visual breakdowns by section and month. Export to CSV for treasurer reports.",
                delay: 0.20,
              },
              {
                icon: CheckCircle2,
                title: "Role-based access",
                body: "Org Members, Class Reps, Treasurers — each sees exactly what they need and nothing more.",
                delay: 0.25,
              },
              {
                icon: WalletCards,
                title: "Multi-org workspace",
                body: "Belong to multiple orgs? Switch organizations in one click without signing out.",
                delay: 0.30,
              },
            ].map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section
        id="how-it-works"
        className="border-t border-[var(--hairline)] px-6 py-28"
      >
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="mb-3 text-[13px] font-[500] uppercase tracking-[0.07em] text-[var(--ink-muted)]">
              How it works
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em]">
              Simple from day one.
            </h2>
          </FadeUp>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Register your org",
                body: "Create a workspace in under two minutes. Invite your treasurer and class reps.",
              },
              {
                step: "02",
                title: "Log remittances",
                body: "Class reps submit collection records with upload proof. Treasurer reviews in one click.",
              },
              {
                step: "03",
                title: "Track everything",
                body: "Real-time balance updates, monthly charts, and a full audit trail — always current.",
              },
            ].map(({ step, title, body }, i) => (
              <FadeUp key={step} delay={i * 0.1}>
                <div className="relative pl-14">
                  <span className="absolute left-0 top-0 text-[42px] font-[500] leading-none tracking-[-0.05em] text-[var(--hairline)]">
                    {step}
                  </span>
                  <h3 className="text-[18px] font-[500] tracking-[-0.025em]">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)]">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT GRID ────────────────────────────────── */}
      <section className="border-t border-[var(--hairline)] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-10">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-[500] leading-tight tracking-[-0.045em]">
              Designed for transparency.
            </h2>
          </FadeUp>

          <div className="grid gap-4 md:grid-cols-2">
            <FadeUp delay={0.06}>
              <SpotlightCard variant="violet" className="h-full min-h-52">
                <p className="text-[13px] font-[500] uppercase tracking-[0.06em] text-white/60">
                  Real-time
                </p>
                <h3 className="mt-3 text-[28px] font-[500] leading-tight tracking-[-0.04em]">
                  Balance updates the moment a remittance is confirmed.
                </h3>
              </SpotlightCard>
            </FadeUp>
            <FadeUp delay={0.12}>
              <SpotlightCard variant="magenta" className="h-full min-h-52">
                <p className="text-[13px] font-[500] uppercase tracking-[0.06em] text-white/60">
                  Accountability
                </p>
                <h3 className="mt-3 text-[28px] font-[500] leading-tight tracking-[-0.04em]">
                  Every action logged. Nothing hidden, nothing lost.
                </h3>
              </SpotlightCard>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section
        id="pricing"
        className="border-t border-[var(--hairline)] px-6 py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <FadeUp>
            <p className="mb-3 text-[13px] font-[500] uppercase tracking-[0.07em] text-[var(--ink-muted)]">
              Pricing
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em]">
              Free for every student org.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] text-[var(--ink-muted)]">
              OrgBudget is completely free for student organizations. No paywalls, no hidden fees.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="mt-12">
            <div className="mx-auto max-w-sm rounded-[24px] border border-[var(--hairline)] bg-[var(--surface-1)] p-8 text-left shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
              <p className="text-[13px] font-[500] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
                Free plan
              </p>
              <p className="mt-3 text-[48px] font-[500] leading-none tracking-[-0.055em]">₱0</p>
              <p className="mt-1 text-[13px] text-[var(--ink-muted)]">Forever, for student organizations</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited remittances",
                  "Up to 200 members",
                  "Full audit log",
                  "CSV exports",
                  "Multi-org support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px]">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-7 w-full gap-2" onClick={toApp}>
                Get started free
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <FadeUp>
          <div
            className="mx-auto max-w-3xl rounded-[30px] p-14 text-center"
            style={{
              background: "linear-gradient(135deg, #1e1050 0%, #0d0828 60%, #111110 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]"
            >
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-96 rounded-full blur-[80px] opacity-30"
                style={{ background: "radial-gradient(circle, #6b3bde, transparent)" }}
              />
            </div>
            <div className="relative">
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em]">
                Ready to get organized?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[16px] text-white/60">
                Join hundreds of student organizations already managing their budgets with clarity.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button className="min-w-44 gap-2" onClick={toApp}>
                  Get started free
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="secondary" onClick={toLogin} className="min-w-32">
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-[var(--hairline-soft)] px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-[8px] bg-[var(--surface-2)]">
              <WalletCards className="size-3.5" />
            </div>
            <span className="text-[14px] font-[500] tracking-[-0.02em]">OrgBudget</span>
          </div>
          <p className="text-[12px] text-[var(--ink-muted)]">
            © 2025 OrgBudget · Built for student organizations
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
