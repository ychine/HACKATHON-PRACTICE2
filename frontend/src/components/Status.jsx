import { Badge } from "@/components/ui";

export function Status({ value }) {
  return (
    <Badge variant={value}>
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
      {value[0].toUpperCase() + value.slice(1)}
    </Badge>
  );
}
