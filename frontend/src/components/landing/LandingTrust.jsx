/**
 * LandingTrust.jsx — tech/trust strip, no GitHub or hackathon badge
 */
import { motion } from "motion/react";
import {
  RiShieldKeyholeLine,
  RiGroupLine,
  RiRefreshLine,
  RiLockLine,
} from "react-icons/ri";

const TECH = [
  { Icon: RiShieldKeyholeLine, label: "Secure auth via Supabase" },
  { Icon: RiGroupLine,         label: "Role-based access control" },
  { Icon: RiRefreshLine,       label: "Real-time updates" },
  { Icon: RiLockLine,          label: "Tamper-proof audit log" },
];

const USE_CASES = [
  "Student org treasuries",
  "Class-level collections",
  "Cooperatives",
  "Hobby & sports clubs",
  "Department societies",
];

export function LandingTrust() {
  const ease = [0.16, 1, 0.3, 1];

  return (
    <section
      aria-label="Trust and use cases"
      className="border-t border-[var(--hairline)] px-6 py-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Tech pills — stagger in */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {TECH.map(({ Icon, label }) => (
            <motion.span
              key={label}
              variants={{
                hidden: { opacity: 0, y: 10, scale: 0.95 },
                show:   { opacity: 1, y: 0,  scale: 1 },
              }}
              transition={{ duration: 0.38, ease }}
              className="flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface-1)] px-4 py-2 text-[13px] text-[var(--ink-muted)]"
            >
              <Icon size={14} className="shrink-0 text-[var(--accent-blue)]" />
              {label}
            </motion.span>
          ))}
        </motion.div>

        {/* Use-case row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.44, ease, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          <span className="text-[11px] font-[500] uppercase tracking-[0.07em] text-[var(--ink-muted)]">
            Perfect for
          </span>
          {USE_CASES.map((uc, i) => (
            <span
              key={uc}
              className="flex items-center gap-2 text-[13px] text-[var(--ink-muted)]"
            >
              {i > 0 && <span className="size-1 rounded-full bg-[var(--hairline)]" />}
              {uc}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
