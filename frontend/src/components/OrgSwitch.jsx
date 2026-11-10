import { RiCheckLine, RiArrowDownSLine, RiAddLine } from "react-icons/ri";
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useApp } from "@/context/AppContext";

/** Derive initials from an org name, e.g. "Engineering Society" → "ES" */
function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Simple colour-bucket so each org gets a distinct bg tint */
const TINTS = [
  "oklch(0.52 0.18 255)",   // blue
  "oklch(0.48 0.13 150)",   // green
  "oklch(0.43 0.15 20)",    // maroon
  "oklch(0.52 0.18 295)",   // violet
  "oklch(0.50 0.16 60)",    // amber
];
function tintFor(idx) {
  return TINTS[idx % TINTS.length];
}

export function OrgSwitch() {
  const { organizations, selectedOrg, setSelectedOrg, go } = useApp();

  const orgName = selectedOrg?.name ?? "No organization";
  const orgInitials = initials(orgName);
  const selectedIdx = organizations.findIndex((o) => o.id === selectedOrg?.id);
  const tint = tintFor(selectedIdx >= 0 ? selectedIdx : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between px-2 py-1.5"
          aria-label="Switch organization"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar
              initials={orgInitials}
              className="size-8 shrink-0"
              style={{ background: tint + "33" }}
            />
            <span className="min-w-0 text-left">
              <span className="block truncate text-[13px] font-[500]">{orgName}</span>
              <span className="block text-[11px] text-[var(--ink-muted)]">Student organization</span>
            </span>
          </span>
          <RiArrowDownSLine size={15} className="ml-1 shrink-0 text-[var(--ink-muted)]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <p className="px-3 py-2 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
          Your organizations
        </p>

        {organizations.length === 0 && (
          <p className="px-3 py-2 text-[13px] text-[var(--ink-muted)]">
            No organizations found.
          </p>
        )}

        {organizations.map((org, i) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setSelectedOrg(org)}
          >
            <Avatar
              className="size-8"
              initials={initials(org.name)}
              style={{ background: tintFor(i) + "33" }}
            />
            <span className="flex-1 text-[13px]">{org.name}</span>
            {selectedOrg?.id === org.id && (
              <Check className="size-3.5 text-[var(--accent-blue)]" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-1 bg-[var(--hairline-soft)]" />
        <DropdownMenuItem onSelect={() => go("/app/orgs")}>
          <RiAddLine size={15} className="text-[var(--ink-muted)]" />
          <span className="text-[13px]">Register another org</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
