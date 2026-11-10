import { motion } from "motion/react";
import { Card, MotionCard } from "@/components/ui";
import { Head } from "@/components/Head";

export default function AuditPage() {
  const logs = [
    ["Paolo Reyes",   "Confirmed remittance", "REM-2025-061", "Jun 14, 2:18 PM"],
    ["Mariel Santos", "Submitted remittance", "REM-2025-062", "Jun 18, 10:42 AM"],
    ["Nico Ramos",    "Updated member role",  "Althea Cruz",  "Jun 12, 9:10 AM"],
  ];

  return (
    <>
      <Head title="Audit log" desc="A read-only trail of important organization activity." />
      <MotionCard delay={0.08}>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-[13px]">
              <thead className="border-b border-[var(--hairline)] text-[12px] text-[var(--ink-muted)]">
                <tr>
                  {["Actor", "Action", "Entity", "Time"].map((h) => (
                    <th className="px-5 py-3 font-[500] tracking-[0.02em]" key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.22, ease: "easeOut" }}
                    className="border-t border-[var(--hairline-soft)] transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <td className="px-5 py-4 font-[500]">{l[0]}</td>
                    <td className="px-5 py-4 text-[var(--ink-muted)]">{l[1]}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[12px] font-[500]">
                        {l[2]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--ink-muted)]">{l[3]}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </MotionCard>
    </>
  );
}
