import { motion } from "motion/react";

export function Head({ title, desc, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1
          className="text-[32px] font-[500] leading-[1.1] tracking-[-0.03em] text-[var(--ink)]"
        >
          {title}
        </h1>
        {desc && (
          <p className="mt-1.5 text-[14px] text-[var(--ink-muted)]">{desc}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
