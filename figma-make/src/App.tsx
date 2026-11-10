import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Toaster, toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  History,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  UploadCloud,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  cn,
} from "./components/ui";

type Role = "Org Member" | "Class Representative" | "Class Treasurer" | "Regular Student";
type Page =
  | "orgs"
  | "dashboard"
  | "remittances"
  | "new"
  | "detail"
  | "members"
  | "history"
  | "reports"
  | "audit"
  | "settings"
  | "help";
type Theme = "blue" | "green" | "maroon" | "violet";
type ViewState = "ready" | "loading" | "empty" | "error";

const themes = {
  blue: ["Blue", "Engineering Society", "ES", "oklch(0.52 0.18 255)"],
  green: ["Green", "Environmental Club", "EC", "oklch(0.48 0.13 150)"],
  maroon: ["Maroon", "Student Council", "SC", "oklch(0.43 0.15 20)"],
  violet: ["Violet", "Arts Guild", "AG", "oklch(0.52 0.18 295)"],
} satisfies Record<Theme, string[]>;
const roles: Role[] = ["Org Member", "Class Representative", "Class Treasurer", "Regular Student"];
const txns = [
  ["Jun 18, 2025", "BSIT 3-A remittance", "Remittance", 12500, true, "Mariel Santos"],
  ["Jun 16, 2025", "Leadership summit venue", "Expense", 8400, false, "Paolo Reyes"],
  ["Jun 14, 2025", "BSCS 2-B remittance", "Remittance", 9750, true, "Althea Cruz"],
  ["Jun 11, 2025", "Event materials", "Expense", 3250, false, "Nico Ramos"],
  ["Jun 8, 2025", "BSIT 4-A remittance", "Remittance", 11000, true, "Bea Mendoza"],
] as const;
const remits = [
  ["Jun 18, 2025", "BSIT 3-A", 12500, "Mariel Santos", "pending"],
  ["Jun 14, 2025", "BSCS 2-B", 9750, "Althea Cruz", "confirmed"],
  ["Jun 8, 2025", "BSIT 4-A", 11000, "Bea Mendoza", "confirmed"],
  ["Jun 5, 2025", "BSCpE 2-A", 8250, "Joshua Lim", "rejected"],
  ["May 30, 2025", "BSIS 3-B", 10250, "Dani Flores", "confirmed"],
] as const;
const people = [
  ["Mariel Santos", "MS", "2022-00184", "BSIT 3-A", "3rd Year", "Class Representative"],
  ["Paolo Reyes", "PR", "2021-00421", "BSIT 4-A", "4th Year", "Class Treasurer"],
  ["Althea Cruz", "AC", "2023-00217", "BSCS 2-B", "2nd Year", "Class Representative"],
  ["Nico Ramos", "NR", "2022-00819", "BSIT 3-A", "3rd Year", "Org Member"],
  ["Bea Mendoza", "BM", "2021-00372", "BSIT 4-A", "4th Year", "Org Member"],
] as const;
const budget = [
  ["Jan", 82000],
  ["Feb", 94500],
  ["Mar", 88700],
  ["Apr", 112200],
  ["May", 119400],
  ["Jun", 128450],
].map(([month, balance]) => ({ month, balance }));
const sections = [
  ["IT 3-A", 38500],
  ["CS 2-B", 31250],
  ["IT 4-A", 29000],
  ["IS 3-B", 24750],
  ["CpE 2-A", 18250],
].map(([name, amount]) => ({ name, amount }));
const php = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);

function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  const color = themes[theme][3];
  return (
    <div
      style={
        {
          "--primary": color,
          "--ring": color,
          "--primary-foreground": "oklch(0.99 0 0)",
          "--radius": ".625rem",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
function Head({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      {action}
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <Badge variant={value as "pending" | "confirmed" | "rejected"}>
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {value[0].toUpperCase() + value.slice(1)}
    </Badge>
  );
}
function StatePicker({ value, set }: { value: ViewState; set: (v: ViewState) => void }) {
  return (
    <Select value={value} onValueChange={(v) => set(v as ViewState)}>
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
function State({ value, reset }: { value: ViewState; reset: () => void }) {
  if (value === "loading")
    return (
      <div className="space-y-5 p-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="flex gap-4" key={i}>
            <Skeleton className="size-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  if (value === "ready") return null;
  return (
    <div className="flex min-h-64 flex-col items-center justify-center text-center">
      <FileText className="mb-4 size-6 text-muted-foreground" />
      <h3 className="font-semibold">
        {value === "error" ? "We couldn’t load this page" : "Nothing here yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
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

function OrgSwitch({
  theme,
  setTheme,
  go,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  go: (p: Page) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-between px-2 py-2">
          <span className="flex min-w-0 items-center gap-3">
            <Avatar initials={themes[theme][2]} />
            <span className="min-w-0 text-left">
              <span className="block truncate font-semibold">{themes[theme][1]}</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Student organization
              </span>
            </span>
          </span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
          Your organizations
        </p>
        {(Object.keys(themes) as Theme[]).map((k) => (
          <DropdownMenuItem key={k} onSelect={() => setTheme(k)}>
            <Avatar initials={themes[k][2]} className="size-8" />
            <span className="flex-1">{themes[k][1]}</span>
            {theme === k && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="my-1 h-px bg-border" />
        <DropdownMenuItem onSelect={() => go("orgs")}>
          <Plus className="size-4" />
          Register another org
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Dashboard({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <Head
        title="Good morning, Mariel"
        desc="Here’s how Engineering Society’s budget is doing."
        action={
          <Button onClick={() => go("new")}>
            <Plus className="size-4" />
            Log a remittance
          </Button>
        }
      />
      <Card className="mb-4 border-0 bg-primary text-primary-foreground">
        <CardContent className="p-7">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-80">Current available balance</p>
              <p className="mt-3 text-3xl font-semibold tabular-nums sm:text-4xl">{php(128450)}</p>
              <p className="mt-3 text-sm opacity-80">As of June 20, 2025</p>
            </div>
            <WalletCards className="size-7" />
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total remitted", 214750, "+12.4% this semester"],
          ["Total expenses", 86300, "Across 14 expenses"],
          ["Pending remittances", 20750, "2 awaiting review"],
        ].map(([l, n, d]) => (
          <Card key={l as string}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{l}</p>
              <p className="mt-3 text-xl font-semibold tabular-nums">{php(n as number)}</p>
              <p className="mt-2 text-xs text-muted-foreground">{d}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Budget over time</CardTitle>
            <CardDescription>Available balance, January–June 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={budget} margin={{ left: -15, right: 8 }}>
                  <defs>
                    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="var(--primary)" stopOpacity=".2" />
                      <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₱${v / 1000}k`} />
                  <Tooltip formatter={(v) => php(Number(v))} />
                  <Area
                    dataKey="balance"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#fill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => go("history")}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {txns.map((t, i) => (
              <div
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                key={i}
              >
                <span className="rounded-md bg-muted p-2">
                  {t[4] ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t[1]}</p>
                  <p className="text-xs text-muted-foreground">{t[0]}</p>
                </div>
                <b className="text-sm tabular-nums">
                  {t[4] ? "+" : "−"}
                  {php(t[3])}
                </b>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Remittances({
  role,
  go,
  state,
  setState,
}: {
  role: Role;
  go: (p: Page) => void;
  state: ViewState;
  setState: (s: ViewState) => void;
}) {
  const canLog = ["Org Member", "Class Representative"].includes(role);
  return (
    <>
      <Head
        title="Remittances"
        desc={
          role === "Class Representative"
            ? "Track remittances submitted by your section."
            : "Review and track submitted collections."
        }
        action={
          <div className="flex gap-2">
            <StatePicker value={state} set={setState} />
            {canLog && (
              <Button onClick={() => go("new")}>
                <Plus className="size-4" />
                Log a remittance
              </Button>
            )}
          </div>
        }
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All · 24</TabsTrigger>
          <TabsTrigger value="pending">Pending · 2</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <State value={state} reset={() => setState("ready")} />
            {state === "ready" && (
              <>
                <div className="hidden md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                      <tr>
                        {["Date", "Section", "Amount", "Submitted by", "Status", ""].map((h) => (
                          <th className="px-5 py-3 font-medium" key={h}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {remits.map((r, i) => (
                        <tr
                          key={i}
                          onClick={() => go("detail")}
                          className="cursor-pointer border-b last:border-0 hover:bg-muted/40"
                        >
                          <td className="px-5 py-4">{r[0]}</td>
                          <td className="px-5 py-4">{r[1]}</td>
                          <td className="px-5 py-4 font-semibold tabular-nums">{php(r[2])}</td>
                          <td className="px-5 py-4">{r[3]}</td>
                          <td>
                            <Status value={r[4]} />
                          </td>
                          <td>
                            <ArrowRight className="size-4" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y md:hidden">
                  {remits.map((r, i) => (
                    <button className="w-full p-4 text-left" key={i} onClick={() => go("detail")}>
                      <div className="flex justify-between">
                        <b>{php(r[2])}</b>
                        <Status value={r[4]} />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {r[1]} · {r[3]} · {r[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </Card>
        </TabsContent>
        {["pending", "confirmed", "rejected"].map((t) => (
          <TabsContent key={t} value={t}>
            <Card>
              <State value="empty" reset={() => setState("ready")} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}

function RemitForm({ go }: { go: (p: Page) => void }) {
  const [files, setFiles] = useState(["deposit-slip-june-18.jpg", "collection-summary.pdf"]);
  return (
    <>
      <button
        onClick={() => go("remittances")}
        className="mb-5 flex cursor-pointer gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to remittances
      </button>
      <Head title="Log a remittance" desc="Submit collected funds and attach proof for review." />
      <Card className="max-w-3xl">
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
              go("remittances");
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
                <SelectTrigger id="section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">BSIT 3-A</SelectItem>
                  <SelectItem value="b">BSCS 2-B</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Notes" id="notes">
              <Textarea id="notes" placeholder="Add context for the reviewer…" />
            </Field>
            <Field label="Proof of remittance" id="proof">
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center">
                <UploadCloud className="mb-3 size-6" />
                <b className="text-sm">
                  Drop files here, or <span className="text-primary">browse</span>
                </b>
                <small className="mt-1 text-muted-foreground">JPG, PNG, or PDF up to 10 MB</small>
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
            <div className="grid gap-3 sm:grid-cols-2">
              {files.map((f) => (
                <div className="flex items-center gap-3 rounded-md bg-muted p-3" key={f}>
                  <FileText className="size-5" />
                  <span className="min-w-0 flex-1 truncate text-sm">{f}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFiles(files.filter((x) => x !== f))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => go("remittances")}>
                Cancel
              </Button>
              <Button>Submit for review</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} *</Label>
      {children}
    </div>
  );
}

function Detail({ role, go }: { role: Role; go: (p: Page) => void }) {
  const reviewer = ["Org Member", "Class Treasurer"].includes(role);
  return (
    <>
      <button
        onClick={() => go("remittances")}
        className="mb-5 flex cursor-pointer gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to remittances
      </button>
      <Head
        title="Remittance details"
        desc="REM-2025-062 · Submitted June 18, 2025"
        action={<Status value="pending" />}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{php(12500)}</p>
              <div className="mt-6 grid grid-cols-2 gap-5 text-sm">
                {[
                  ["Section", "BSIT 3-A"],
                  ["Submitted by", "Mariel Santos"],
                  ["Collection date", "June 18, 2025"],
                  ["Reference", "REM-2025-062"],
                ].map((x) => (
                  <div key={x[0]}>
                    <p className="text-muted-foreground">{x[0]}</p>
                    <p className="mt-1 font-medium">{x[1]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Proof of remittance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video flex-col items-center justify-center rounded-md bg-muted">
                <ReceiptText className="size-10" />
                <p className="mt-3 text-sm">deposit-slip-june-18.jpg</p>
                <Button className="mt-3" size="sm" variant="outline">
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {[
                ["Submitted for review", "Mariel Santos · Jun 18, 10:42 AM", true],
                ["Treasurer review", "Awaiting review", false],
                ["Added to balance", "After confirmation", false],
              ].map((x, i) => (
                <div className="flex gap-3" key={x[0] as string}>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full border",
                        x[2] && "bg-primary text-primary-foreground",
                      )}
                    >
                      {x[2] ? <Check className="size-3" /> : <Clock3 className="size-3" />}
                    </span>
                    {i < 2 && <span className="h-10 w-px bg-border" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{x[0]}</p>
                    <p className="text-xs text-muted-foreground">{x[1]}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {reviewer && (
            <Card>
              <CardHeader>
                <CardTitle>Review submission</CardTitle>
                <CardDescription>
                  Confirm the amount and proof before taking action.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1" variant="outline">
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Reject remittance</DialogTitle>
                    <DialogDescription>Provide a clear correction reason.</DialogDescription>
                    <Field label="Reason" id="reason">
                      <Textarea id="reason" />
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
          )}
        </div>
      </div>
    </>
  );
}

function Members({
  role,
  state,
  setState,
}: {
  role: Role;
  state: ViewState;
  setState: (s: ViewState) => void;
}) {
  const [selected, setSelected] = useState<(typeof people)[number] | null>(null);
  const shown =
    role === "Class Representative" ? people.filter((p) => p[3] === "BSIT 3-A") : people;
  return (
    <>
      <Head
        title="Members"
        desc={
          role === "Class Representative"
            ? "Members of your assigned section, BSIT 3-A."
            : "Organization members, roles, and academic details."
        }
        action={<StatePicker value={state} set={setState} />}
      />
      <Card>
        <div className="border-b p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 size-4" />
            <Input className="pl-9" placeholder="Search members…" />
          </div>
        </div>
        <State value={state} reset={() => setState("ready")} />
        {state === "ready" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  {["Name", "Student no.", "Section", "Year level", "Role"].map((h) => (
                    <th className="px-5 py-3" key={h}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr
                    className="cursor-pointer border-t hover:bg-muted/40"
                    key={p[2]}
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        <Avatar initials={p[1]} />
                        <b>{p[0]}</b>
                      </span>
                    </td>
                    <td>{p[2]}</td>
                    <td>{p[3]}</td>
                    <td>{p[4]}</td>
                    <td>
                      <Badge>{p[5]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {selected && (
        <div className="fixed inset-0 z-50 bg-foreground/20" onClick={() => setSelected(null)}>
          <aside
            className="absolute right-0 h-full w-full max-w-md bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute right-4"
              variant="ghost"
              size="icon"
              onClick={() => setSelected(null)}
            >
              <X className="size-4" />
            </Button>
            <div className="mt-10 flex items-center gap-4">
              <Avatar className="size-14" initials={selected[1]} />
              <div>
                <h2 className="text-xl font-semibold">{selected[0]}</h2>
                <p className="text-muted-foreground">{selected[2]}</p>
              </div>
            </div>
            <Separator className="my-6" />
            {[
              ["Section", selected[3]],
              ["Year level", selected[4]],
              ["Role", selected[5]],
              ["Total remitted", php(4850)],
            ].map((x) => (
              <div className="mb-5" key={x[0]}>
                <p className="text-sm text-muted-foreground">{x[0]}</p>
                <p className="mt-1 font-medium">{x[1]}</p>
              </div>
            ))}
          </aside>
        </div>
      )}
    </>
  );
}

function HistoryPage({ state, setState }: { state: ViewState; setState: (s: ViewState) => void }) {
  return (
    <>
      <Head
        title="Transaction history"
        desc="A complete, read-only record of budget activity."
        action={<StatePicker value={state} set={setState} />}
      />
      <Card>
        <div className="grid gap-3 border-b p-4 sm:grid-cols-[1fr_1fr_auto]">
          <Input value="Jun 1, 2025 – Jun 30, 2025" readOnly />
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All transaction types</SelectItem>
              <SelectItem value="credit">Credits</SelectItem>
              <SelectItem value="debit">Debits</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Apply filters</Button>
        </div>
        <State value={state} reset={() => setState("ready")} />
        {state === "ready" && (
          <>
            {txns.map((t, i) => (
              <div className="flex items-center gap-3 border-b p-4" key={i}>
                <span className="rounded-md bg-muted p-2">
                  {t[4] ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t[1]}</p>
                  <p className="text-xs text-muted-foreground">
                    TXN-104{i + 4} · {t[0]}
                  </p>
                </div>
                <b className="text-sm tabular-nums">
                  {t[4] ? "+" : "−"}
                  {php(t[3])}
                </b>
              </div>
            ))}
            <div className="flex justify-between p-4">
              <p className="text-sm text-muted-foreground">Showing 1–5 of 48</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
function Reports() {
  const chart = (data: any, type: "bar" | "area") => (
    <div className="h-80">
      <ResponsiveContainer>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip />
            <Bar dataKey="amount" fill="var(--primary)" radius={[5, 5, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Area
              dataKey="balance"
              fill="var(--primary)"
              fillOpacity=".12"
              stroke="var(--primary)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
  return (
    <>
      <Head
        title="Reports"
        desc="Understand collection and spending trends."
        action={
          <Button variant="outline" onClick={() => toast.success("CSV report downloaded")}>
            <Download className="size-4" />
            Export CSV
          </Button>
        }
      />
      <Tabs defaultValue="s">
        <TabsList>
          <TabsTrigger value="s">By section</TabsTrigger>
          <TabsTrigger value="m">Monthly totals</TabsTrigger>
        </TabsList>
        <TabsContent value="s">
          <Card>
            <CardHeader>
              <CardTitle>Remittances per section</CardTitle>
              <CardDescription>Confirmed collections this semester</CardDescription>
            </CardHeader>
            <CardContent>{chart(sections, "bar")}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="m">
          <Card>
            <CardHeader>
              <CardTitle>Monthly totals</CardTitle>
            </CardHeader>
            <CardContent>{chart(budget, "area")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
function Audit() {
  const logs = [
    ["Paolo Reyes", "Confirmed remittance", "REM-2025-061", "Jun 14, 2:18 PM"],
    ["Mariel Santos", "Submitted remittance", "REM-2025-062", "Jun 18, 10:42 AM"],
    ["Nico Ramos", "Updated member role", "Althea Cruz", "Jun 12, 9:10 AM"],
  ];
  return (
    <>
      <Head title="Audit log" desc="A read-only trail of important organization activity." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Actor", "Action", "Entity", "Time"].map((h) => (
                  <th className="px-5 py-3" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr className="border-t" key={i}>
                  {l.map((x) => (
                    <td className="px-5 py-4" key={x}>
                      {x}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
function SettingsPage({
  theme,
  setTheme,
  role,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  role: Role;
}) {
  const read = role === "Class Treasurer";
  return (
    <>
      <Head
        title="Settings"
        desc="Manage organization information, branding, and collection rules."
        action={read && <Badge variant="outline">View only</Badge>}
      />
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="brand">Branding</TabsTrigger>
          <TabsTrigger value="rules">Remittance rules</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Organization profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Organization name" id="org">
                <Input id="org" defaultValue={themes[theme][1]} disabled={read} />
              </Field>
              <Field label="Description" id="desc">
                <Textarea
                  id="desc"
                  defaultValue="The official academic organization for engineering and IT students."
                  disabled={read}
                />
              </Field>
              {!read && (
                <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="brand">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Organization theme</CardTitle>
              <CardDescription>Preview this screen in all four themes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(themes) as Theme[]).map((k) => (
                  <button
                    key={k}
                    disabled={read}
                    onClick={() => setTheme(k)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-left",
                      theme === k && "border-primary ring-1 ring-primary",
                    )}
                  >
                    <span className="size-8 rounded-full" style={{ background: themes[k][3] }} />
                    <span className="flex-1">
                      <b className="block text-sm">{themes[k][0]}</b>
                      <small className="text-muted-foreground">{themes[k][1]}</small>
                    </span>
                    {theme === k && <Check className="size-4 text-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rules">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Remittance rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Field label="Monthly deadline" id="deadline">
                <Input id="deadline" defaultValue="20th of every month" disabled={read} />
              </Field>
              <Field label="Proof requirements" id="rules">
                <Textarea
                  id="rules"
                  defaultValue="Attach a clear deposit slip and signed collection summary."
                  disabled={read}
                />
              </Field>
              {!read && <Button>Save rules</Button>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
function Help() {
  return (
    <>
      <Head
        title="Contact & help"
        desc="Find quick answers or send a message to the organization team."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Message sent");
              }}
            >
              <Field label="Subject" id="subject">
                <Input id="subject" />
              </Field>
              <Field label="Message" id="message">
                <Textarea id="message" />
              </Field>
              <Button>Send message</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {[
                [
                  "How long does review take?",
                  "Most remittances are reviewed within two school days.",
                ],
                [
                  "What proof can I upload?",
                  "Upload a clear JPG, PNG, or PDF of the deposit slip or receipt.",
                ],
                [
                  "Why was mine rejected?",
                  "Open the remittance detail to see the reviewer’s reason.",
                ],
              ].map((x, i) => (
                <AccordionItem value={`${i}`} key={i}>
                  <AccordionTrigger>{x[0]}</AccordionTrigger>
                  <AccordionContent>{x[1]}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
function Orgs({ go }: { go: (p: Page) => void }) {
  const [register, setRegister] = useState(false);
  if (register)
    return (
      <>
        <button className="mb-5 flex gap-2 text-sm" onClick={() => setRegister(false)}>
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Head title="Register an organization" desc="Create a new workspace for your team." />
        <Card className="max-w-2xl">
          <CardContent className="space-y-5 pt-6">
            <Field label="Organization name" id="n">
              <Input id="n" />
            </Field>
            <Field label="Description" id="d">
              <Textarea id="d" />
            </Field>
            <Field label="Department" id="dept">
              <Input id="dept" />
            </Field>
            <Field label="Logo upload" id="logo">
              <Input id="logo" type="file" />
            </Field>
            <Button
              onClick={() => {
                toast.success("Organization registered");
                setRegister(false);
              }}
            >
              Register organization
            </Button>
          </CardContent>
        </Card>
      </>
    );
  return (
    <>
      <Head title="My organizations" desc="Choose an organization to view its budget workspace." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(themes) as Theme[]).slice(0, 3).map((k, i) => (
          <Card
            className="cursor-pointer hover:border-primary"
            key={k}
            onClick={() => go("dashboard")}
          >
            <CardContent className="p-5">
              <div className="flex justify-between">
                <Avatar className="size-12" initials={themes[k][2]} />
                <Badge variant="outline">{i ? "Member" : "Class Representative"}</Badge>
              </div>
              <h2 className="mt-5 font-semibold">{themes[k][1]}</h2>
              <p className="mt-3 text-xl font-semibold">{php(128450 - i * 24300)}</p>
            </CardContent>
          </Card>
        ))}
        <button
          onClick={() => setRegister(true)}
          className="min-h-48 cursor-pointer rounded-lg border border-dashed p-6 hover:border-primary"
        >
          <Plus className="mx-auto size-5" />
          <b className="mt-4 block">Register another org</b>
        </button>
      </div>
    </>
  );
}
function Auth({ login }: { login: () => void }) {
  const [signup, setSignup] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center gap-3">
          <span className="rounded-lg bg-primary p-2 text-primary-foreground">
            <WalletCards />
          </span>
          <b className="self-center text-lg">Org Budget Tracker</b>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{signup ? "Create your account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {signup
                ? "Get started with your student organization."
                : "Sign in to access your organization budgets."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <Field label="School email" id="email">
                <Input id="email" type="email" required />
              </Field>
              <Field label="Password" id="password">
                <Input id="password" type="password" required />
              </Field>
              {signup && (
                <Field label="Confirm password" id="confirm">
                  <Input id="confirm" type="password" />
                </Field>
              )}
              <Button className="w-full">{signup ? "Create account" : "Log in"}</Button>
            </form>
            <Separator className="my-5" />
            <p className="text-center text-sm text-muted-foreground">
              {signup ? "Already have an account?" : "New here?"}{" "}
              <button onClick={() => setSignup(!signup)} className="font-semibold text-primary">
                {signup ? "Log in" : "Sign up"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const nav: { p: Page; l: string; i: any; r?: Role[] }[] = [
  { p: "dashboard", l: "Overview", i: LayoutDashboard },
  {
    p: "remittances",
    l: "Remittances",
    i: ReceiptText,
    r: ["Org Member", "Class Representative", "Class Treasurer"],
  },
  {
    p: "members",
    l: "Members",
    i: Users,
    r: ["Org Member", "Class Representative", "Class Treasurer"],
  },
  { p: "history", l: "Transaction history", i: History },
  { p: "reports", l: "Reports", i: BarChart3 },
  { p: "audit", l: "Audit log", i: ShieldCheck, r: ["Org Member", "Class Treasurer"] },
  { p: "settings", l: "Settings", i: Settings, r: ["Org Member", "Class Treasurer"] },
  {
    p: "help",
    l: "Contact & help",
    i: CircleHelp,
    r: ["Org Member", "Class Representative", "Class Treasurer"],
  },
];
export default function App() {
  const [page, setPage] = useState<Page>("dashboard"),
    [role, setRole] = useState<Role>("Org Member"),
    [theme, setTheme] = useState<Theme>("blue"),
    [dark, setDark] = useState(false),
    [mobile, setMobile] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [state, setState] = useState<ViewState>("ready"),
    [logged, setLogged] = useState(true);
  const visible = useMemo(() => nav.filter((n) => !n.r || n.r.includes(role)), [role]);
  const go = (p: Page) => {
    setPage(p);
    setMobile(false);
    setState("ready");
  };
  const safe =
    visible.some((n) => n.p === page) || ["orgs", "new", "detail"].includes(page)
      ? page
      : "dashboard";
  if (!logged)
    return (
      <ThemeProvider theme={theme}>
        <div className={dark ? "dark" : ""}>
          <Auth
            login={() => {
              setLogged(true);
              setPage("orgs");
            }}
          />
        </div>
      </ThemeProvider>
    );
  const content =
    safe === "dashboard" ? (
      <Dashboard go={go} />
    ) : safe === "remittances" ? (
      <Remittances role={role} go={go} state={state} setState={setState} />
    ) : safe === "new" ? (
      <RemitForm go={go} />
    ) : safe === "detail" ? (
      <Detail role={role} go={go} />
    ) : safe === "members" ? (
      <Members role={role} state={state} setState={setState} />
    ) : safe === "history" ? (
      <HistoryPage state={state} setState={setState} />
    ) : safe === "reports" ? (
      <Reports />
    ) : safe === "audit" ? (
      <Audit />
    ) : safe === "settings" ? (
      <SettingsPage theme={theme} setTheme={setTheme} role={role} />
    ) : safe === "help" ? (
      <Help />
    ) : (
      <Orgs go={go} />
    );
  const menu = (
    <>
      {visible.map((n) => (
        <button
          key={n.p}
          onClick={() => go(n.p)}
          title={n.l}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium",
            collapsed ? "justify-center" : "gap-3",
            safe === n.p ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <n.i className="size-4" />
          {!collapsed && n.l}
        </button>
      ))}
    </>
  );
  return (
    <ThemeProvider theme={theme}>
      <div className={cn("min-h-screen bg-background text-foreground", dark && "dark")}>
        <aside
          className={cn(
            "fixed inset-y-0 z-40 hidden flex-col border-r bg-card lg:flex",
            collapsed ? "w-20" : "w-64",
          )}
        >
          <div className="border-b p-3">
            {collapsed ? (
              <Avatar className="mx-auto" initials={themes[theme][2]} />
            ) : (
              <OrgSwitch theme={theme} setTheme={setTheme} go={go} />
            )}
          </div>
          <nav className="flex-1 space-y-1 p-3">{menu}</nav>
          <div className="border-t p-3">
            {!collapsed && (
              <>
                <p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">
                  View as · Prototype
                </p>
                <Select
                  value={role}
                  onValueChange={(v) => {
                    setRole(v as Role);
                    setPage("dashboard");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem value={r} key={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className="mt-2 w-full"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="size-4" />
              {!collapsed && "Collapse sidebar"}
            </Button>
          </div>
        </aside>
        {mobile && (
          <div
            className="fixed inset-0 z-50 bg-foreground/30 lg:hidden"
            onClick={() => setMobile(false)}
          >
            <aside
              className="h-full w-[86%] max-w-xs bg-card p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex border-b pb-3">
                <OrgSwitch theme={theme} setTheme={setTheme} go={go} />
                <Button variant="ghost" size="icon" onClick={() => setMobile(false)}>
                  <X className="size-4" />
                </Button>
              </div>
              <nav className="mt-3 space-y-1">{menu}</nav>
              <div className="absolute bottom-4 left-3 right-3">
                <Label>View as · Prototype</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem value={r} key={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </aside>
          </div>
        )}
        <div className={collapsed ? "lg:pl-20" : "lg:pl-64"}>
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4">
            <div className="flex min-w-0 flex-1 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobile(true)}>
                <Menu className="size-5" />
              </Button>
              <OrgSwitch theme={theme} setTheme={setTheme} go={go} />
            </div>
            <div className="hidden flex-1 lg:block" />
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar initials="MS" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <p className="px-3 py-2 text-sm font-medium">Mariel Santos</p>
                <DropdownMenuSeparator className="h-px bg-border" />
                <DropdownMenuItem onSelect={() => setLogged(false)}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="mx-auto max-w-[1100px] px-4 pb-28 pt-7 sm:px-6 lg:pb-10">{content}</main>
        </div>
        <nav className="fixed bottom-0 z-30 grid w-full grid-cols-4 border-t bg-background lg:hidden">
          {[
            ["dashboard", "Dashboard", LayoutDashboard],
            ["remittances", "Remittances", ReceiptText],
            ["history", "History", History],
            ["more", "More", MoreHorizontal],
          ].map(([p, l, I]: any) => (
            <button
              key={l}
              onClick={() =>
                p === "more" ? setMobile(true) : go(visible.some((n) => n.p === p) ? p : "reports")
              }
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px]",
                safe === p ? "text-primary" : "text-muted-foreground",
              )}
            >
              <I className="size-5" />
              {l}
            </button>
          ))}
        </nav>
        <Toaster richColors theme={dark ? "dark" : "light"} />
      </div>
    </ThemeProvider>
  );
}
