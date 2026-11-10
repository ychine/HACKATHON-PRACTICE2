import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, FileText, Trash2, UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import {
  Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Separator, Textarea,
} from "@/components/ui";
import { Field } from "@/components/Field";
import { Head } from "@/components/Head";

export default function NewRemittancePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState(["deposit-slip-june-18.jpg", "collection-summary.pdf"]);

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

      <Head title="Log a remittance" desc="Submit collected funds and attach proof for review." />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="max-w-3xl"
      >
        <Card>
          <CardHeader>
            <CardTitle>Remittance details</CardTitle>
            <CardDescription>Complete all required fields.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Remittance submitted for review");
                navigate("/app/remittances");
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Amount (PHP)" id="amount">
                  <Input id="amount" type="number" required placeholder="0.00" />
                </Field>
                <Field label="Collection date" id="date">
                  <Input id="date" type="date" defaultValue="2025-06-20" />
                </Field>
              </div>

              <Field label="Section" id="section">
                <Select defaultValue="a">
                  <SelectTrigger id="section"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">BSIT 3-A</SelectItem>
                    <SelectItem value="b">BSCS 2-B</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Notes" id="notes">
                <Textarea id="notes" placeholder="Add context for the reviewer…" />
              </Field>

              {/* File upload zone */}
              <Field label="Proof of remittance" id="proof">
                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[15px] border border-dashed border-[var(--hairline)] bg-[var(--surface-2)]/50 text-center transition-colors hover:border-[var(--ink-muted)]">
                  <UploadCloud className="mb-3 size-6 text-[var(--ink-muted)]" />
                  <b className="text-[14px] font-[500]">
                    Drop files here, or{" "}
                    <span className="text-[var(--accent-blue)]">browse</span>
                  </b>
                  <small className="mt-1 text-[12px] text-[var(--ink-muted)]">
                    JPG, PNG, or PDF up to 10 MB
                  </small>
                  <input
                    id="proof"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={(e) =>
                      setFiles([...files, ...Array.from(e.target.files || []).map((f) => f.name)])
                    }
                  />
                </label>
              </Field>

              {files.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {files.map((f) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-3 rounded-[10px] bg-[var(--surface-2)] px-3 py-2.5"
                    >
                      <FileText className="size-4 shrink-0 text-[var(--ink-muted)]" />
                      <span className="min-w-0 flex-1 truncate text-[13px]">{f}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setFiles(files.filter((x) => x !== f))}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              <Separator />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/remittances")}>
                  Cancel
                </Button>
                <Button>Submit for review</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
