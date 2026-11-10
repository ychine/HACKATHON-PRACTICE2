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
import { themes } from "@/lib/data";
import { useApp } from "@/context/AppContext";

export function OrgSwitch() {
  const { theme, setTheme, go } = useApp();
  const current = themes[theme];

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
              initials={current[2]}
              className="size-7 shrink-0 rounded-[8px] text-[11px]"
              style={{ background: `color-mix(in srgb, ${current[3]} 20%, transparent)` }}
            />
            <span className="min-w-0 text-left">
              <span className="block truncate text-[13px] font-[500] text-[var(--ink)]">
                {current[1]}
              </span>
              <span className="block text-[11px] text-[var(--ink-muted)]">
                Student organization
              </span>
            </span>
          </span>
          <RiArrowDownSLine size={15} className="ml-1 shrink-0 text-[var(--ink-muted)]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <p className="px-3 pb-1 pt-2 text-[10px] font-[700] uppercase tracking-[0.06em] text-[var(--ink-muted)]">
          Your organizations
        </p>
        {Object.keys(themes).map((k) => (
          <DropdownMenuItem key={k} onSelect={() => setTheme(k)}>
            <Avatar
              className="size-7 shrink-0 rounded-[8px] text-[11px]"
              initials={themes[k][2]}
              style={{ background: `color-mix(in srgb, ${themes[k][3]} 20%, transparent)` }}
            />
            <span className="flex-1 text-[13px]">{themes[k][1]}</span>
            {theme === k && (
              <RiCheckLine size={13} className="text-[var(--accent-blue)]" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem onSelect={() => go("/app/orgs")}>
          <RiAddLine size={15} className="text-[var(--ink-muted)]" />
          <span className="text-[13px]">Register another org</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
