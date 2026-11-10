import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, Clock3, Download, ReceiptText } from "lucide-react";
import { motion } from "motion/react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger,
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
  MotionCard, Textarea,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { Head } from "@/components/Head";
import { Status } from "@/components/Status";
import { php } from "@/lib/data";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function RemittanceDetailPage() {
  const navigate = useNavigate();
  const { role } = useApp();
  const reviewer = ["Org Member", "Class Treasurer"].includes(role);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => navigate("/app/remittances")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-[13px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to remittances
      </motion.button>

      <Head
        title="Remittance details"
        desc="REM-2025-062 · Submitted June 18, 2025"
        action={<Status value="pending" />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <MotionCard delay={0.08}>
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent>
                <p className="text-[36px] font-[500] tabular-nums tracking-[-0.04em]">
                  {php(12500)}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-5">
                  {[
                    ["Section",          "BSIT 3-A"],
                    ["Submitted by",     "Mariel Santos"],
                    ["Collection date",  "June 18, 2025"],
                    ["Reference",        "REM-2025-062"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[12px] text-[var(--ink-muted)]">{label}</p>
                      <p className="mt-1 text-[14px] font-[500]">{val}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionCard>

          <MotionCard delay={0.14}>
            <Card>
              <CardHeader><CardTitle>Proof of remittance</CardTitle></CardHeader>
              <CardContent>
                <div className="flex aspect-video flex-col items-center justify-center rounded-[15px] bg-[var(--surface-2)]">
                  <ReceiptText className="size-10 text-[var(--ink-muted)]" />
                  <p className="mt-3 text-[13px] text-[var(--ink-muted)]">deposit-slip-june-18.jpg</p>
                  <Button className="mt-4" size="sm" variant="outline">
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <MotionCard delay={0.12}>
            <Card>
              <CardHeader><CardTitle>Status timeline</CardTitle></CardHeader>
              <CardContent>
                {[
                  ["Submitted for review", "Mariel Santos · Jun 18, 10:42 AM", true],
                  ["Treasurer review",     "Awaiting review",                  false],
                  ["Added to balance",     "After confirmation",               false],
                ].map((x, i) => (
                  <div className="flex gap-4" key={x[0]}>
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border border-[var(--hairline)]",
                          x[2] && "bg-[var(--accent-blue)] border-transparent",
                        )}
                      >
                        {x[2]
                          ? <Check className="size-3 text-white" />
                          : <Clock3 className="size-3 text-[var(--ink-muted)]" />
                        }
                      </span>
                      {i < 2 && <span className="mt-1 h-10 w-px bg-[var(--hairline-soft)]" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-[14px] font-[500]">{x[0]}</p>
                      <p className="text-[12px] text-[var(--ink-muted)]">{x[1]}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </MotionCard>

          {reviewer && (
            <MotionCard delay={0.18}>
              <Card>
                <CardHeader>
                  <CardTitle>Review submission</CardTitle>
                  <CardDescription>
                    Confirm the amount and proof before taking action.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                  {/* Reject */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1" variant="outline">Reject</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Reject remittance</DialogTitle>
                      <DialogDescription>Provide a clear correction reason.</DialogDescription>
                      <Field label="Reason" id="reason">
                        <Textarea id="reason" className="mt-2" />
                      </Field>
                      <div className="mt-5 flex justify-end">
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => toast.error("Remittance rejected")}
                          >
                            Reject remittance
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Confirm */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1">Confirm</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Confirm this remittance?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {php(12500)} will be added to the organization balance.
                      </AlertDialogDescription>
                      <div className="mt-5 flex justify-end gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success("Remittance confirmed")}>
                          Confirm
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </MotionCard>
          )}
        </div>
      </div>
    </>
  );
}
