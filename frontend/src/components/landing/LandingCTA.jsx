/**
 * LandingCTA.jsx — blur-reveal entrance, animated bloom orbs, pulsing CTA button
 * Fixed: orbs no longer clip against overflow-hidden.
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
      className="px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="relative mx-auto max-w-3xl"
      >
        {/* Orbs sit OUTSIDE the rounded card — no clipping */}
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-28 left-1/2 h-80 w-[28rem] -translate-x-1/2 rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(107,59,222,0.55), transparent)" }}
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
          className="pointer-events-none absolute -right-16 -top-8 h-60 w-60 rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(174,30,138,0.4), transparent)" }}
        />

        {/* Card — rounded corners, inset shadow, NO overflow-hidden so orbs show */}
        <div
          className="relative rounded-[30px] p-14 text-center"
          style={{
            background: "linear-gradient(135deg, #1e1050 0%, #0d0828 55%, #111110 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.09) inset, 0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
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
            transition={{ duration: 0.46, ease, delay: 0.16 }}
            className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-white/55"
          >
            Set up your org in two minutes. Every remittance accounted for,
            every peso traced, every member in the loop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.44, ease, delay: 0.24 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease }}
            >
              <Button className="min-w-48 gap-2" onClick={onRegister}>
                Register your org
                <RiArrowRightLine size={15} />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease }}
            >
              <Button variant="secondary" onClick={onContact} className="gap-2">
                <RiMailLine size={14} />
                Talk to us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
