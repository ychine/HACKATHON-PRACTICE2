/**
 * LandingRoles.jsx — Role Spotlight with hover-lift + stagger
 * Org Member / Class Rep (violet spotlight) / Class Treasurer
 */
import { motion } from "motion/react";
import {
  RiUserLine,
  RiClipboardLine,
  RiSafe2Line,
} from "react-icons/ri";
import { SpotlightCard } from "@/components/ui";

const ROLES = [
  {
    Icon:    RiUserLine,
    persona: "Org Member",
    tagline: "Stay in the loop on your own record.",
    points: [
      "Confirm your own remittances",
      "See the full ledger at any time",
      "Request corrections if something's off",
      "Track your payment history",
    ],
    variant: null,
  },
  {
    Icon:    RiClipboardLine,
    persona: "Class Rep",
    tagline: "Own your class's collections end-to-end.",
    points: [
      "Log remittances for your entire class",
      "Track who's paid and who hasn't",
      "Upload proof of payment per entry",
      "Manage your class member list",
    ],
    variant: "violet",
  },
  {
    Icon:    RiSafe2Line,
    persona: "Class Treasurer",
    tagline: "Reconcile with confidence, not guesswork.",
    points: [
      "Reconcile incoming remittances at a glance",
      "Approve or reject with one click",
      "Review the full audit log",
      "Export reports for any period",
    ],
    variant: null,
  },
];

const ease = [0.16, 1, 0.3, 1];

export function LandingRoles() {
  return (
    <section
      id="roles"
      aria-label="Role spotlight"
      className="border-t border-[var(--hairline)] px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.52, ease }}
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-[500] leading-tight tracking-[-0.045em] text-[var(--ink)]">
            Built for every role.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-muted)]">
            Permissions are scoped to what each person actually needs. No role
            sees what it shouldn't — no role is blocked from what it must.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {ROLES.map(({ Icon, persona, tagline, points, variant }) => {
            const inner = (
              <div className="flex h-full flex-col">
                <motion.span
                  whileHover={{ scale: 1.08, transition: { duration: 0.18, ease } }}
                  className={[
                    "flex size-10 shrink-0 items-center justify-center rounded-[12px]",
                    variant ? "bg-white/10" : "bg-[var(--surface-2)]",
                  ].join(" ")}
                >
                  <Icon
                    size={19}
                    className={variant ? "text-white" : "text-[var(--ink)]"}
                  />
                </motion.span>
                <p className={[
                  "mt-5 text-[11px] font-[600] uppercase tracking-[0.07em]",
                  variant ? "text-white/55" : "text-[var(--ink-muted)]",
                ].join(" ")}>
                  {persona}
                </p>
                <h3 className={[
                  "mt-1.5 text-[18px] font-[500] leading-tight tracking-[-0.03em]",
                  variant ? "text-white" : "text-[var(--ink)]",
                ].join(" ")}>
                  {tagline}
                </h3>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {points.map((pt) => (
                    <li
                      key={pt}
                      className={[
                        "flex items-start gap-2.5 text-[13px] leading-snug",
                        variant ? "text-white/70" : "text-[var(--ink-muted)]",
                      ].join(" ")}
                    >
                      <span className={[
                        "mt-[3px] size-1.5 shrink-0 rounded-full",
                        variant ? "bg-white/40" : "bg-[var(--hairline)]",
                      ].join(" ")} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            );

            return (
              <motion.div
                key={persona}
                variants={{
                  hidden: { opacity: 0, y: 28, scale: 0.97 },
                  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.52, ease } },
                }}
                whileHover={{
                  y: -6,
                  transition: { duration: 0.22, ease },
                }}
                className="h-full cursor-default"
              >
                {variant ? (
                  <SpotlightCard variant={variant} className="h-full">
                    {inner}
                  </SpotlightCard>
                ) : (
                  <div className="h-full rounded-[20px] border border-[var(--hairline)] bg-[var(--surface-1)] p-7 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
