import { Check, ChevronDown, Plus } from "lucide-react";
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { themes } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export function OrgSwitch() {
  const { theme, setTheme, go } = useApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between px-2 py-1.5"
          aria-label="Switch organization"
        >
          <span className="flex min-w-0 items-center gap-3">
            <Avatar
              initials={themes[theme][2]}
              className="size-8 shrink-0"
              style={{ background: themes[theme][3] + "33" }}
            />
            <span className="min-w-0 text-left">
              <span className="block truncate text-[13px] font-[500]">{themes[theme][1]}</span>
              <span className="block text-[11px] text-[var(--ink-muted)]">Student organization</span>
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-[var(--ink-muted)]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <p className="px-3 py-2 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
          Your organizations
        </p>
        {Object.keys(themes).map((k) => (
          <DropdownMenuItem key={k} onSelect={() => setTheme(k)}>
            <Avatar className="size-8" initials={themes[k][2]} />
            <span className="flex-1 text-[13px]">{themes[k][1]}</span>
            {theme === k && <Check className="size-3.5 text-[var(--accent-blue)]" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1 bg-[var(--hairline-soft)]" />
        <DropdownMenuItem onSelect={() => go("/app/orgs")}>
          <Plus className="size-4" />
          <span className="text-[13px]">Register another org</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
