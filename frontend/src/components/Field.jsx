import { Label } from "@/components/ui";

export function Field({ label, id, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} *</Label>
      {children}
    </div>
  );
}
