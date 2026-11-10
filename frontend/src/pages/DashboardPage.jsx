import { useNavigate } from "react-router-dom";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDownLeft, ArrowUpRight, Plus, WalletCards } from "lucide-react";
import { motion } from "motion/react";
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle, MotionCard,
} from "@/components/ui";
import { Head } from "@/components/Head";
import { budget, php, txns } from "@/lib/data";

const stagger = (i) => ({ delay: i * 0.07 });

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <>
      <Head
        title="Good morning, Mariel"
        desc="Here's how Engineering Society's budget is doing."
        action={
          <Button onClick={() => navigate("/app/remittances/new")}>
            <Plus className="size-4" />
            Log a remittance
          </Button>
        }
      />

      {/* Hero balance card — gradient spotlight */}
      <MotionCard delay={0.05} className="mb-4">
        <div
          className="relative overflow-hidden rounded-[20px] p-7"
          style={{ background: "linear-gradient(135deg, #1e1050 0%, #0d0828 60%, #111110 100%)" }}
        >
          {/* Atmospheric glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full blur-[60px] opacity-40"
            style={{ background: "radial-gradient(circle, #6b3bde 0%, transparent 70%)" }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[13px] text-white/60">Current available balance</p>
              <p className="mt-3 text-[42px] font-[500] tabular-nums tracking-[-0.04em] text-white leading-none">
                {php(128450)}
              </p>
              <p className="mt-3 text-[13px] text-white/50">As of June 20, 2025</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <WalletCards className="size-5 text-white/80" />
            </div>
          </div>
        </div>
      </MotionCard>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total remitted",      214750, "+12.4% this semester"],
          ["Total expenses",       86300, "Across 14 expenses"],
          ["Pending remittances",  20750, "2 awaiting review"],
        ].map(([l, n, d], i) => (
          <MotionCard key={l} delay={0.1 + i * 0.06}>
            <Card>
              <CardContent className="p-5">
                <p className="text-[12px] font-[500] uppercase tracking-[0.05em] text-[var(--ink-muted)]">{l}</p>
                <p className="mt-3 text-[26px] font-[500] tabular-nums tracking-[-0.03em]">
                  {php(n)}
                </p>
                <p className="mt-1 text-[12px] text-[var(--ink-muted)]">{d}</p>
              </CardContent>
            </Card>
          </MotionCard>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <MotionCard delay={0.28}>
          <Card>
            <CardHeader>
              <CardTitle>Budget over time</CardTitle>
              <CardDescription>Available balance, January–June 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={budget} margin={{ left: -15, right: 8 }}>
                    <defs>
                      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#6b3bde" stopOpacity=".3" />
                        <stop offset="1" stopColor="#6b3bde" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#999", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#999", fontSize: 12 }}
                      tickFormatter={(v) => `₱${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1c1c1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 13,
                      }}
                      formatter={(v) => php(Number(v))}
                    />
                    <Area
                      dataKey="balance"
                      stroke="#6b3bde"
                      strokeWidth={2}
                      fill="url(#fill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </MotionCard>

        <MotionCard delay={0.34}>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/app/history")}>
                View all
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {txns.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut", delay: 0.38 + i * 0.05 }}
                  className="flex items-center gap-3 border-b border-[var(--hairline-soft)] py-3 last:border-0"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-2)]">
                    {t[4]
                      ? <ArrowDownLeft className="size-4 text-emerald-400" />
                      : <ArrowUpRight className="size-4 text-[var(--ink-muted)]" />
                    }
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-[500]">{t[1]}</p>
                    <p className="text-[12px] text-[var(--ink-muted)]">{t[0]}</p>
                  </div>
                  <b className={`text-[13px] tabular-nums ${t[4] ? "text-emerald-400" : "text-[var(--ink)]"}`}>
                    {t[4] ? "+" : "−"}{php(t[3])}
                  </b>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </MotionCard>
      </div>
    </>
  );
}
