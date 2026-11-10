import { FileText } from "lucide-react";
import {
  Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton,
} from "@/components/ui";

export function StatePicker({ value, set }) {
  return (
    <Select value={value} onValueChange={(v) => set(v)}>
      <SelectTrigger className="w-32" aria-label="Preview state">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {["ready", "loading", "empty", "error"].map((v) => (
          <SelectItem key={v} value={v}>
            {v[0].toUpperCase() + v.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function State({ value, reset }) {
  if (value === "loading") {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="flex gap-4" key={i}>
            <Skeleton className="size-9 rounded-[10px]" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (value === "ready") return null;
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-[14px] bg-[var(--surface-2)]">
        <FileText className="size-5 text-[var(--ink-muted)]" />
      </div>
      <h3 className="mt-4 text-[15px] font-[500] tracking-[-0.015em]">
        {value === "error" ? "We couldn't load this page" : "Nothing here yet"}
      </h3>
      <p className="mt-1.5 max-w-xs text-[13px] text-[var(--ink-muted)]">
        {value === "error"
          ? "Check your connection and try again."
          : "New records will appear here when added."}
      </p>
      <Button className="mt-5" variant="outline" onClick={reset}>
        {value === "error" ? "Try again" : "Add a record"}
      </Button>
    </div>
  );
}
