import {
  BarChart3,
  CircleHelp,
  History,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export const nav = [
  { path: "/app/dashboard",   label: "Overview",           short: "Dashboard",   icon: LayoutDashboard },
  {
    path: "/app/remittances",
    label: "Remittances",
    short: "Remittances",
    icon: ReceiptText,
    roles: ["Org Member", "Class Representative", "Class Treasurer"],
  },
  {
    path: "/app/members",
    label: "Members",
    short: "Members",
    icon: Users,
    roles: ["Org Member", "Class Representative", "Class Treasurer"],
  },
  { path: "/app/history",  label: "Transaction history", short: "History",  icon: History  },
  { path: "/app/reports",  label: "Reports",             short: "Reports",  icon: BarChart3 },
  {
    path: "/app/audit",
    label: "Audit log",
    short: "Audit",
    icon: ShieldCheck,
    roles: ["Org Member", "Class Treasurer"],
  },
  {
    path: "/app/settings",
    label: "Settings",
    short: "Settings",
    icon: Settings,
    roles: ["Org Member", "Class Treasurer"],
  },
  {
    path: "/app/help",
    label: "Contact & help",
    short: "Help",
    icon: CircleHelp,
    roles: ["Org Member", "Class Representative", "Class Treasurer"],
  },
];

export function visibleNav(role) {
  return nav.filter((n) => !n.roles || n.roles.includes(role));
}
