import { useNavigate } from "react-router-dom";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrgSwitch } from "@/components/OrgSwitch";
import { useApp } from "@/context/AppContext";

export function Header({ onMenu }) {
  const { dark, setDark, logout } = useApp();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4">
      <div className="flex min-w-0 flex-1 lg:hidden">
        <Button variant="ghost" size="icon" onClick={onMenu} aria-label="Open navigation">
          <Menu className="size-5" />
        </Button>
        <OrgSwitch />
      </div>
      <div className="hidden flex-1 lg:block" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDark(!dark)}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <Avatar>
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <p className="px-3 py-2 text-sm font-medium">Mariel Santos</p>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              logout();
              navigate("/login");
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
