import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, Badge, Button, Card, Input, MotionCard, Separator } from "@/components/ui";
import { Head } from "@/components/Head";
import { State, StatePicker } from "@/components/StateViews";
import { people, php } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export default function MembersPage() {
  const { role, viewState, setViewState } = useApp();
  const [selected, setSelected] = useState(null);
  const shown =
    role === "Class Representative" ? people.filter((p) => p[3] === "BSIT 3-A") : people;

  return (
    <>
      <Head
        title="Members"
        desc={
          role === "Class Representative"
            ? "Members of your assigned section, BSIT 3-A."
            : "Organization members, roles, and academic details."
        }
        action={<StatePicker value={viewState} set={setViewState} />}
      />

      <MotionCard delay={0.08}>
        <Card>
          <div className="border-b border-[var(--hairline)] p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <Input className="pl-9" placeholder="Search members…" />
            </div>
          </div>
          <State value={viewState} reset={() => setViewState("ready")} />
          {viewState === "ready" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-[13px]">
                <thead className="border-b border-[var(--hairline)] text-[12px] text-[var(--ink-muted)]">
                  <tr>
                    {["Name", "Student no.", "Section", "Year level", "Role"].map((h) => (
                      <th className="px-5 py-3 font-[500] tracking-[0.02em]" key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((p, i) => (
                    <motion.tr
                      key={p[2]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
                      className="cursor-pointer border-t border-[var(--hairline-soft)] transition-colors hover:bg-[var(--surface-2)]"
                      onClick={() => setSelected(p)}
                    >
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-3">
                          <Avatar initials={p[1]} />
                          <span className="font-[500]">{p[0]}</span>
                        </span>
                      </td>
                      <td className="text-[var(--ink-muted)]">{p[2]}</td>
                      <td className="text-[var(--ink-muted)]">{p[3]}</td>
                      <td className="text-[var(--ink-muted)]">{p[4]}</td>
                      <td><Badge>{p[5]}</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </MotionCard>

      {/* Member detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-[var(--surface-1)] border-l border-[var(--hairline)] p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute right-4 top-4"
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>

              <div className="mt-8 flex items-center gap-4">
                <Avatar className="size-14 text-base" initials={selected[1]} />
                <div>
                  <h2 className="text-[20px] font-[500] tracking-[-0.025em]">{selected[0]}</h2>
                  <p className="text-[13px] text-[var(--ink-muted)]">{selected[2]}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {[
                ["Section",      selected[3]],
                ["Year level",   selected[4]],
                ["Role",         selected[5]],
                ["Total remitted", php(4850)],
              ].map(([label, val]) => (
                <div className="mb-5" key={label}>
                  <p className="text-[12px] text-[var(--ink-muted)]">{label}</p>
                  <p className="mt-1 text-[14px] font-[500]">{val}</p>
                </div>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
