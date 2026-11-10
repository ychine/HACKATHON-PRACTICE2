import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import {
  Button, Card, MotionCard, Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui";
import { Head } from "@/components/Head";
import { Status } from "@/components/Status";
import { State, StatePicker } from "@/components/StateViews";
import { php, remits } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export default function RemittancesPage() {
  const navigate = useNavigate();
  const { role, viewState, setViewState } = useApp();
  const canLog = ["Org Member", "Class Representative"].includes(role);

  return (
    <>
      <Head
        title="Remittances"
        desc={
          role === "Class Representative"
            ? "Track remittances submitted by your section."
            : "Review and track submitted collections."
        }
        action={
          <div className="flex gap-2">
            <StatePicker value={viewState} set={setViewState} />
            {canLog && (
              <Button onClick={() => navigate("/app/remittances/new")}>
                <Plus className="size-4" />
                Log a remittance
              </Button>
            )}
          </div>
        }
      />

      <MotionCard delay={0.08}>
        <Tabs defaultValue="all">
          <TabsList className="mb-1">
            <TabsTrigger value="all">All · 24</TabsTrigger>
            <TabsTrigger value="pending">Pending · 2</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <State value={viewState} reset={() => setViewState("ready")} />
              {viewState === "ready" && (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead className="border-b border-[var(--hairline)] text-[12px] text-[var(--ink-muted)]">
                        <tr>
                          {["Date", "Section", "Amount", "Submitted by", "Status", ""].map((h) => (
                            <th className="px-5 py-3 font-[500] tracking-[0.02em]" key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {remits.map((r, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.04, duration: 0.2 }}
                            onClick={() => navigate("/app/remittances/detail")}
                            className="cursor-pointer border-b border-[var(--hairline-soft)] last:border-0 hover:bg-[var(--surface-2)] transition-colors"
                          >
                            <td className="px-5 py-4 text-[var(--ink-muted)]">{r[0]}</td>
                            <td className="px-5 py-4">{r[1]}</td>
                            <td className="px-5 py-4 font-[600] tabular-nums">{php(r[2])}</td>
                            <td className="px-5 py-4 text-[var(--ink-muted)]">{r[3]}</td>
                            <td className="px-5 py-4"><Status value={r[4]} /></td>
                            <td className="px-5 py-4">
                              <ArrowRight className="size-4 text-[var(--ink-muted)]" />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile list */}
                  <div className="divide-y divide-[var(--hairline-soft)] md:hidden">
                    {remits.map((r, i) => (
                      <button
                        className="w-full p-4 text-left transition-colors hover:bg-[var(--surface-2)]"
                        key={i}
                        onClick={() => navigate("/app/remittances/detail")}
                      >
                        <div className="flex items-center justify-between">
                          <b className="text-[15px] tabular-nums tracking-[-0.02em]">{php(r[2])}</b>
                          <Status value={r[4]} />
                        </div>
                        <p className="mt-2 text-[12px] text-[var(--ink-muted)]">
                          {r[1]} · {r[3]} · {r[0]}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          {["pending", "confirmed", "rejected"].map((t) => (
            <TabsContent key={t} value={t}>
              <Card>
                <State value="empty" reset={() => setViewState("ready")} />
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </MotionCard>
    </>
  );
}
