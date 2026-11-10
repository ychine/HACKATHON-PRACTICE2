/**
 * LandingProblem.jsx — The Problem, 3 cards with hover-lift motion
 */
import { motion } from "motion/react";
import {
  RiTableLine,
  RiEyeOffLine,
  RiQuestionAnswerLine,
} from "react-icons/ri";

const PROBLEMS = [
  {
    Icon:  RiTableLine,
    title: "Endless spreadsheets",
    body:  "\"Who paid? Who didn't? Ask five chats.\" Collections managed in group chats and sheets that nobody trusts.",
  },
  {
    Icon:  RiEyeOffLine,
    title: "Zero visibility",
    body:  "Members never see where the money went. Treasurers scramble before every general assembly.",
  },
  {
    Icon:  RiQuestionAnswerLine,
    title: "No accountability",
    body:  "Approvals happen in DMs, not in records. Disputes have no paper trail — just conflicting screenshots.",
  },
];

const ease = [0.16, 1, 0.3, 1];

export function LandingProblem() {
  return (
    <section
      aria-label="The problem"
      className="border-y border-[var(--hairline)] px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease }}
          className="mb-12 text-[clamp(1.75rem,4vw,2.75rem)] font-[500] leading-tight tracking-[-0.045em] text-[var(--ink)]"
        >
          Group finances are broken.
        </motion.h2>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {PROBLEMS.map(({ Icon, title, body }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              whileHover={{ y: -4, transition: { duration: 0.22, ease } }}
              className="cursor-default rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-6 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
            >
              <span className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--surface-2)]">
                <Icon size={19} className="text-[var(--ink-muted)]" />
              </span>
              <h3 className="mt-4 text-[16px] font-[500] leading-tight tracking-[-0.025em] text-[var(--ink)]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-muted)]">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
