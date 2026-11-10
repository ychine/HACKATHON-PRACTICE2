import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { motion } from "motion/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  MotionCard,
  SpotlightCard,
  Textarea,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { Head } from "@/components/Head";
import { php, themes } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export default function OrgsPage() {
  const [register, setRegister] = useState(false);
  const { go } = useApp();

  if (register) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <button
          className="mb-6 flex items-center gap-2 text-[13px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
          onClick={() => setRegister(false)}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Head title="Register an organization" desc="Create a new workspace for your team." />
        <Card>
          <CardContent className="space-y-5 pt-6">
            <Field label="Organization name" id="n"><Input id="n" /></Field>
            <Field label="Description" id="d"><Textarea id="d" /></Field>
            <Field label="Department" id="dept"><Input id="dept" /></Field>
            <Field label="Logo upload" id="logo"><Input id="logo" type="file" /></Field>
            <Button
              onClick={() => { toast.success("Organization registered"); setRegister(false); }}
            >
              Register organization
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10">
      <Head
        title="My organizations"
        desc="Choose an organization to view its budget workspace."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Gradient spotlight card — first org is featured */}
        <MotionCard delay={0}>
          <SpotlightCard
            variant="violet"
            className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
            onClick={() => go("/app/dashboard")}
          >
            <div className="flex items-start justify-between">
              <Avatar className="size-12 bg-white/15 text-white" initials={themes.blue[2]} />
              <Badge className="bg-white/15 text-white border-transparent">Class Rep</Badge>
            </div>
            <h2 className="mt-5 text-[18px] font-[500] tracking-[-0.025em]">{themes.blue[1]}</h2>
            <p className="mt-2 text-[28px] font-[500] tabular-nums tracking-[-0.03em]">
              {php(128450)}
            </p>
          </SpotlightCard>
        </MotionCard>

        {/* Regular org cards */}
        {Object.keys(themes).slice(1, 3).map((k, i) => (
          <MotionCard delay={(i + 1) * 0.06} key={k}>
            <Card
              className="cursor-pointer transition-colors duration-150 hover:border-[var(--accent-blue)]/50 h-full"
              onClick={() => go("/app/dashboard")}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <Avatar className="size-12" initials={themes[k][2]} />
                  <Badge variant="outline">Member</Badge>
                </div>
                <h2 className="mt-5 text-[16px] font-[500] tracking-[-0.02em]">{themes[k][1]}</h2>
                <p className="mt-2 text-[22px] font-[500] tabular-nums tracking-[-0.025em]">
                  {php(128450 - (i + 1) * 24300)}
                </p>
              </CardContent>
            </Card>
          </MotionCard>
        ))}

        {/* Register CTA */}
        <MotionCard delay={0.18}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRegister(true)}
            className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[var(--hairline)] p-6 transition-colors hover:border-[var(--ink-muted)]"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-2)]">
              <Plus className="size-5 text-[var(--ink-muted)]" />
            </div>
            <span className="text-[14px] font-[500] text-[var(--ink-muted)]">
              Register another org
            </span>
          </motion.button>
        </MotionCard>
      </div>
    </div>
  );
}
