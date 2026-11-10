import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import {
  Button, Card, Input, MotionCard, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui";
import { Head } from "@/components/Head";
import { State, StatePicker } from "@/components/StateViews";
import { php, txns } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export default function HistoryPage() {
  const { viewState, setViewState } = useApp();
  return (
    <>
      <Head
        title="Transaction history"
        desc="A complete, read-only record of budget activity."
        action={<StatePicker value={viewState} set={setViewState} />}
      />

      <MotionCard delay={0.08}>
        <Card>
          {/* Filters bar */}
          <div className="grid gap-3 border-b border-[var(--hairline)] p-4 sm:grid-cols-[1fr_1fr_auto]">
            <Input value="Jun 1, 2025 – Jun 30, 2025" readOnly />
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All transaction types</SelectItem>
                <SelectItem value="credit">Credits</SelectItem>
                <SelectItem value="debit">Debits</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Apply filters</Button>
          </div>

          <State value={viewState} reset={() => setViewState("ready")} />
          {viewState === "ready" && (
            <>
              {txns.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.22, ease: "easeOut" }}
                  className="flex items-center gap-3 border-b border-[var(--hairline-soft)] p-4 last:border-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-2)]">
                    {t[4]
                      ? <ArrowDownLeft className="size-4 text-emerald-400" />
                      : <ArrowUpRight className="size-4 text-[var(--ink-muted)]" />
                    }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-[500]">{t[1]}</p>
                    <p className="text-[12px] text-[var(--ink-muted)]">
                      TXN-104{i + 4} · {t[0]}
                    </p>
                  </div>
                  <b className={`text-[13px] tabular-nums ${t[4] ? "text-emerald-400" : "text-[var(--ink)]"}`}>
                    {t[4] ? "+" : "−"}{php(t[3])}
                  </b>
                </motion.div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between p-4">
                <p className="text-[12px] text-[var(--ink-muted)]">Showing 1–5 of 48</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Previous">
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Next">
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </MotionCard>
    </>
  );
}
