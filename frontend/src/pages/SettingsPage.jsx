import { toast } from "sonner";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import {
  Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, MotionCard, Tabs, TabsContent, TabsList, TabsTrigger, Textarea,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { Head } from "@/components/Head";
import { themes } from "@/lib/data";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme, role } = useApp();
  const read = role === "Class Treasurer";

  return (
    <>
      <Head
        title="Settings"
        desc="Manage organization information, branding, and collection rules."
        action={read && <Badge variant="outline">View only</Badge>}
      />

      <MotionCard delay={0.08}>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="brand">Branding</TabsTrigger>
            <TabsTrigger value="rules">Remittance rules</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="max-w-3xl">
              <CardHeader><CardTitle>Organization profile</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <Field label="Organization name" id="org">
                  <Input id="org" defaultValue={themes[theme][1]} disabled={read} />
                </Field>
                <Field label="Description" id="desc">
                  <Textarea
                    id="desc"
                    defaultValue="The official academic organization for engineering and IT students."
                    disabled={read}
                  />
                </Field>
                {!read && (
                  <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brand">
            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Organization theme</CardTitle>
                <CardDescription>Preview this screen in all four themes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.keys(themes).map((k) => (
                    <motion.button
                      key={k}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={read}
                      onClick={() => setTheme(k)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[15px] border p-4 text-left transition-colors",
                        theme === k
                          ? "border-[var(--accent-blue)] bg-[var(--surface-2)]"
                          : "border-[var(--hairline)] bg-[var(--surface-1)] hover:border-[var(--ink-muted)]",
                      )}
                    >
                      <span
                        className="size-8 rounded-full shrink-0"
                        style={{ background: themes[k][3] }}
                      />
                      <span className="flex-1 min-w-0">
                        <b className="block text-[14px] font-[500] truncate">{themes[k][0]}</b>
                        <small className="text-[12px] text-[var(--ink-muted)] truncate block">
                          {themes[k][1]}
                        </small>
                      </span>
                      {theme === k && (
                        <Check className="size-4 shrink-0 text-[var(--accent-blue)]" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card className="max-w-3xl">
              <CardHeader><CardTitle>Remittance rules</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <Field label="Monthly deadline" id="deadline">
                  <Input id="deadline" defaultValue="20th of every month" disabled={read} />
                </Field>
                <Field label="Proof requirements" id="rules">
                  <Textarea
                    id="rules"
                    defaultValue="Attach a clear deposit slip and signed collection summary."
                    disabled={read}
                  />
                </Field>
                {!read && <Button>Save rules</Button>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </MotionCard>
    </>
  );
}
