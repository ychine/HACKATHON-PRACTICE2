/**
 * LandingCTA.jsx — blur-reveal entrance, animated bloom orbs, pulsing CTA button
 */
import { motion } from "motion/react";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri";
import { Button } from "@/components/ui";

const ease = [0.16, 1, 0.3, 1];

export function LandingCTA({ onRegister, onContact }) {
  return (
    <section
      id="contact"
      aria-label="Call to action"
      className="px-6 py-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
      >
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-[30px] p-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, #1e1050 0%, #0d0828 55%, #111110 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.09) inset, 0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Animated bloom orb — top center */}
          <motion.div
            aria-hidden
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.5, 0.35],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(107,59,222,0.5), transparent)" }}
          />
          {/* Bloom orb — right */}
          <motion.div
            aria-hidden
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(174,30,138,0.35), transparent)" }}
          />

          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="text-[clamp(2rem,5vw,3.25rem)] font-[500] leading-tight tracking-[-0.045em] text-white"
            >
              Ready to bring transparency
              <br />
              to your treasury?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.46, ease, delay: 0.18 }}
              className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/55"
            >
              Set up your org in two minutes. Every remittance accounted for,
              every peso traced, every member in the loop.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.44, ease, delay: 0.26 }}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16, ease }}
              >
                <Button className="min-w-48 gap-2" onClick={onRegister}>
                  Register your org
                  <RiArrowRightLine size={15} />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.16, ease }}
              >
                <Button variant="secondary" onClick={onContact} className="gap-2">
                  <RiMailLine size={14} />
                  Talk to us
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
