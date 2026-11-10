/**
 * LandingHowItWorks.jsx — 4-step flow with animated connector + stagger
 */
import { motion } from "motion/react";
import {
  RiBuildingLine,
  RiPenNibLine,
  RiUserFollowLine,
  RiPieChartLine,
} from "react-icons/ri";

const STEPS = [
  {
    Icon:  RiBuildingLine,
    title: "Register your org",
    body:  "Create a workspace in under two minutes. Invite your treasurer and class reps — no IT help needed.",
  },
  {
    Icon:  RiPenNibLine,
    title: "Reps log remittances",
    body:  "Class reps submit collection records tagged to each member and class, with proof-of-payment uploads.",
  },
  {
    Icon:  RiUserFollowLine,
    title: "Members confirm",
    body:  "Each member confirms their own remittance. Disputes surface immediately — no more conflicting claims.",
  },
  {
    Icon:  RiPieChartLine,
    title: "Treasurer reconciles",
    body:  "Approve or reject in one click. Download reports, review the audit trail, and close the books with confidence.",
  },
];

const ease = [0.16, 1, 0.3, 1];

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How it works"
      className="border-t border-[var(--hairline)] px-6 py-28"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.52, ease }}
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em] text-[var(--ink)]">
            Simple from day one.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-muted)]">
            Four steps from zero to a fully auditable org treasury.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.11 } },
          }}
        >
          {STEPS.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, x: i % 2 === 0 ? -20 : 20 },
                show:   { opacity: 1, x: 0, transition: { duration: 0.52, ease } },
              }}
              whileHover={{ x: 3, transition: { duration: 0.2, ease } }}
              className="flex gap-5"
            >
              {/* Icon circle */}
              <motion.span
                whileHover={{ scale: 1.1, transition: { duration: 0.18, ease } }}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--surface-2)]"
              >
                <Icon size={18} className="text-[var(--ink)]" />
              </motion.span>
              <div>
                <h3 className="text-[16px] font-[500] leading-tight tracking-[-0.025em] text-[var(--ink)]">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)]">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
