/**
 * LandingFeatures.jsx — 6-card bento with stagger + hover-lift
 */
import { motion } from "motion/react";
import {
  RiDashboard3Line,
  RiShieldUserLine,
  RiFileList3Line,
  RiGroupLine,
  RiSurveyLine,
  RiBarChart2Line,
} from "react-icons/ri";

const FEATURES = [
  {
    Icon:  RiDashboard3Line,
    title: "Multi-org dashboard",
    body:  "One login, switch between every org you belong to. No separate accounts, no context switching friction.",
  },
  {
    Icon:  RiShieldUserLine,
    title: "Role-aware permissions",
    body:  "Members, Class Reps, and Treasurers each see exactly what they should — nothing more, nothing less.",
  },
  {
    Icon:  RiFileList3Line,
    title: "Remittance workflow",
    body:  "Log → member confirms → treasurer approves or rejects. No more \"I already paid\" disputes.",
  },
  {
    Icon:  RiGroupLine,
    title: "Member directory",
    body:  "Every member's record and payment status, filterable by class. Know who's paid at a glance.",
  },
  {
    Icon:  RiSurveyLine,
    title: "Full audit trail",
    body:  "Every action timestamped and attributed. Treasurers sleep better. Org presidents have proof.",
  },
  {
    Icon:  RiBarChart2Line,
    title: "Reports & history",
    body:  "Exportable transaction history and org-wide reports. Ready for your next general assembly.",
  },
];

const ease = [0.16, 1, 0.3, 1];

export function LandingFeatures() {
  return (
    <section id="features" aria-label="Features" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Heading with scroll-driven opacity */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.52, ease }}
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em] text-[var(--ink)]">
            Everything your org needs.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--ink-muted)]">
            Every feature maps directly to your org's real workflow — from the first
            peso collected to the last report exported.
          </p>
        </motion.div>

        {/* Staggered card grid */}
        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {FEATURES.map(({ Icon, title, body }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.98 },
                show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.46, ease } },
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 16px 40px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.08) inset",
                transition: { duration: 0.22, ease },
              }}
              className="cursor-default rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-7 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
            >
              <motion.span
                whileHover={{ scale: 1.08, transition: { duration: 0.2, ease } }}
                className="flex size-10 items-center justify-center rounded-[12px] bg-[var(--surface-2)]"
              >
                <Icon size={20} className="text-[var(--ink)]" />
              </motion.span>
              <h3 className="mt-5 text-[17px] font-[500] leading-tight tracking-[-0.025em] text-[var(--ink)]">
                {title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--ink-muted)]">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
