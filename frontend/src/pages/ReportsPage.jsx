import { toast } from "sonner";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  MotionCard, Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui";
import { Head } from "@/components/Head";
import { budget, sections } from "@/lib/data";

const chartStyle = {
  grid:    "rgba(255,255,255,0.06)",
  tick:    { fill: "#999", fontSize: 12 },
  tooltip: {
    contentStyle: {
      background: "#1c1c1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10,
      color: "#fff",
      fontSize: 13,
    },
  },
};

export default function ReportsPage() {
  const barChart = (data) => (
    <div className="h-80">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke={chartStyle.grid} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartStyle.tick} />
          <YAxis axisLine={false} tickLine={false} tick={chartStyle.tick} tickFormatter={(v) => `₱${v / 1000}k`} />
          <Tooltip {...chartStyle.tooltip} />
          <Bar dataKey="amount" fill="#6b3bde" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const areaChart = (data) => (
    <div className="h-80">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#6b3bde" stopOpacity=".25" />
              <stop offset="1" stopColor="#6b3bde" stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chartStyle.grid} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={chartStyle.tick} />
          <YAxis axisLine={false} tickLine={false} tick={chartStyle.tick} />
          <Tooltip {...chartStyle.tooltip} />
          <Area dataKey="balance" stroke="#6b3bde" strokeWidth={2} fill="url(#fill2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <Head
        title="Reports"
        desc="Understand collection and spending trends."
        action={
          <Button variant="outline" onClick={() => toast.success("CSV report downloaded")}>
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />

      <MotionCard delay={0.08}>
        <Tabs defaultValue="s">
          <TabsList>
            <TabsTrigger value="s">By section</TabsTrigger>
            <TabsTrigger value="m">Monthly totals</TabsTrigger>
          </TabsList>
          <TabsContent value="s">
            <Card>
              <CardHeader>
                <CardTitle>Remittances per section</CardTitle>
                <CardDescription>Confirmed collections this semester</CardDescription>
              </CardHeader>
              <CardContent>{barChart(sections)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="m">
            <Card>
              <CardHeader>
                <CardTitle>Monthly totals</CardTitle>
                <CardDescription>Available balance by month, 2025</CardDescription>
              </CardHeader>
              <CardContent>{areaChart(budget)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </MotionCard>
    </>
  );
}
