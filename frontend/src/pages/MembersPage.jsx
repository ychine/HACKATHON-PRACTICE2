import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, X, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  MotionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
} from "@/components/ui";
import { Head } from "@/components/Head";
import { useApp } from "@/context/AppContext";
import {
  getMembers,
  addMember,
  deleteMember,
  getClassReps,
  addClassRep,
  deleteClassRep,
  getSections,
  createSection,
} from "@/api";

/* ── helpers ──────────────────────────────────────────────── */
function nameInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const ROLES = ["Org Member", "Class Representative", "Class Treasurer"];

/* ── empty state ──────────────────────────────────────────── */
function Empty({ msg }) {
  return (
    <tr>
      <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[var(--ink-muted)]">
        {msg}
      </td>
    </tr>
  );
}

/* ── skeleton rows ────────────────────────────────────────── */
function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i} className="border-t border-[var(--hairline-soft)]">
      {Array.from({ length: 5 }).map((__, j) => (
        <td key={j} className="px-5 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  ));
}

/* ════════════════════════════════════════════════════════════
   Add Member Dialog — scoped to the active org's department
   ════════════════════════════════════════════════════════════ */
function AddMemberDialog({ orgId, orgName, sections, open, onClose, onAdded }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    student_no: "",
    section_id: "",
    role: "Org Member",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.student_no || !form.section_id || !form.role) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const member = await addMember({ ...form, org_id: orgId });
      toast.success(`${member.name} added as ${member.role}.`);
      onAdded(member);
      onClose();
      setForm({ first_name: "", last_name: "", student_no: "", section_id: "", role: "Org Member" });
    } catch (err) {
      toast.error(err.message ?? "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Add member — {orgName}</DialogTitle>
        <DialogDescription>
          Enroll a new student in this organization. Sections shown belong to {orgName}.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-first">First name *</Label>
              <Input id="add-first" value={form.first_name} onChange={set("first_name")} placeholder="e.g. Juan" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-last">Last name *</Label>
              <Input id="add-last" value={form.last_name} onChange={set("last_name")} placeholder="e.g. dela Cruz" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-sno">Student number *</Label>
            <Input id="add-sno" value={form.student_no} onChange={set("student_no")} placeholder="e.g. 2024-00123" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-section">Section *</Label>
            <Select value={form.section_id} onValueChange={set("section_id")}>
              <SelectTrigger id="add-section">
                <SelectValue placeholder="Select section…" />
              </SelectTrigger>
              <SelectContent>
                {sections.length === 0 ? (
                  <div className="px-3 py-2 text-[12px] text-[var(--ink-muted)]">
                    No sections yet. Add one first.
                  </div>
                ) : (
                  sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-role">Role *</Label>
            <Select value={form.role} onValueChange={set("role")}>
              <SelectTrigger id="add-role">
                <SelectValue placeholder="Select role…" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding…" : "Add member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════
   Add Class Rep Dialog — scoped to the active org's department
   ════════════════════════════════════════════════════════════ */
function AddClassRepDialog({ orgId, orgName, sections, presetSectionId, open, onClose, onAdded }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    student_no: "",
    section_id: "",
  });
  const [loading, setLoading] = useState(false);

  // When opening with a preset section (e.g. clicked "Assign" on a specific
  // section row), pre-fill and lock the section field.
  useEffect(() => {
    if (open && presetSectionId) {
      setForm((f) => ({ ...f, section_id: presetSectionId }));
    }
  }, [open, presetSectionId]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.student_no || !form.section_id) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const rep = await addClassRep({ ...form, org_id: orgId });
      const repName = rep.student?.name ?? `${form.first_name} ${form.last_name}`;
      const sectionName = rep.section?.name ?? "";
      toast.success(`${repName} set as Class Rep for ${sectionName}.`);
      onAdded(rep);
      onClose();
      setForm({ first_name: "", last_name: "", student_no: "", section_id: "" });
    } catch (err) {
      toast.error(err.message ?? "Failed to assign class rep.");
    } finally {
      setLoading(false);
    }
  };

  const lockedSection = Boolean(presetSectionId);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Assign class representative — {orgName}</DialogTitle>
        <DialogDescription>
          Designate one student as the class rep for a section. Sections shown belong to {orgName}.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rep-first">First name *</Label>
              <Input id="rep-first" value={form.first_name} onChange={set("first_name")} placeholder="e.g. Maria" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rep-last">Last name *</Label>
              <Input id="rep-last" value={form.last_name} onChange={set("last_name")} placeholder="e.g. Santos" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-sno">Student number *</Label>
            <Input id="rep-sno" value={form.student_no} onChange={set("student_no")} placeholder="e.g. 2024-00456" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-section">Section *</Label>
            <Select value={form.section_id} onValueChange={set("section_id")} disabled={lockedSection}>
              <SelectTrigger id="rep-section">
                <SelectValue placeholder="Select section…" />
              </SelectTrigger>
              <SelectContent>
                {sections.length === 0 ? (
                  <div className="px-3 py-2 text-[12px] text-[var(--ink-muted)]">
                    No sections yet. Add one first.
                  </div>
                ) : (
                  sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning…" : "Assign representative"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════
   Add Section Dialog — locked to the active org's department
   ════════════════════════════════════════════════════════════ */
function AddSectionDialog({ department, open, onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", year_level: "1", school_year: String(new Date().getFullYear()) });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.value ?? e }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.year_level || !department?.id) {
      toast.error("Please fill in the section name and year level.");
      return;
    }
    setLoading(true);
    try {
      const section = await createSection({
        name: form.name.trim(),
        year_level: Number(form.year_level),
        school_year: form.school_year.trim(),
        department_id: department.id,
      });
      toast.success(`Section ${section.name} created under ${department.name}.`);
      onAdded(section);
      onClose();
      setForm({ name: "", year_level: "1", school_year: String(new Date().getFullYear()) });
    } catch (err) {
      toast.error(err.message ?? "Failed to create section.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Add section</DialogTitle>
        <DialogDescription>
          Create a new class/section under the active organization's department.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sec-name">Section name *</Label>
            <Input id="sec-name" value={form.name} onChange={set("name")} placeholder="e.g. CCS 1-A" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sec-year">Year level *</Label>
            <Select value={form.year_level} onValueChange={set("year_level")}>
              <SelectTrigger id="sec-year">
                <SelectValue placeholder="Select year level…" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y === 1 ? "1st Year" : y === 2 ? "2nd Year" : y === 3 ? "3rd Year" : y === 4 ? "4th Year" : `${y}th Year`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sec-sy">School year *</Label>
            <Input id="sec-sy" value={form.school_year} onChange={set("school_year")} placeholder="e.g. 2026" />
          </div>

          {/* Department is locked to the active org's department — not a general dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="sec-dept">Department</Label>
            <div
              id="sec-dept"
              className="flex h-10 w-full items-center rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-2)] px-3 text-[14px] text-[var(--ink-muted)]"
            >
              {department ? `${department.name} (${department.code})` : "—"}
            </div>
            <p className="text-[11px] text-[var(--ink-muted)]">
              Locked to the selected organization's department.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !department}>
              {loading ? "Creating…" : "Create section"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════
   Class Reps Table — section-driven
   Lists EVERY section in the org's department. Each row shows the
   section's assigned class rep, or "not yet assigned" when there
   is none (so newly created sections appear immediately).
   ════════════════════════════════════════════════════════════ */
function ClassRepsTable({ orgId, orgName, sections, onRepChanged }) {
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [presetSection, setPresetSection] = useState(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const data = await getClassReps(orgId);
      setReps(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { load(); }, [load]);

  // index reps by section_id for quick lookup
  const repBySection = {};
  for (const r of reps) repBySection[r.section_id] = r;

  // one row per section (the org's own sections), sorted by name
  const rows = [...sections].sort((a, b) => a.name.localeCompare(b.name));

  const handleRemove = async (rep) => {
    try {
      await deleteClassRep(rep.id);
      setReps((r) => r.filter((x) => x.id !== rep.id));
      toast.success("Class rep unassigned.");
      if (onRepChanged) onRepChanged(); // refresh members (role may revert)
    } catch (err) {
      toast.error(err.message ?? "Failed to remove.");
    }
  };

  const handleAdded = (rep) => {
    // replace any existing rep for the same section, else add
    setReps((r) => {
      const idx = r.findIndex((x) => x.section_id === rep.section_id);
      if (idx >= 0) {
        const copy = [...r];
        copy[idx] = rep;
        return copy;
      }
      return [...r, rep];
    });
    if (onRepChanged) onRepChanged(); // refresh members (new rep w/ Class Rep role)
  };

  const openAssign = (sectionId) => {
    setPresetSection(sectionId ?? null);
    setShowAdd(true);
  };

  return (
    <MotionCard delay={0.14} className="mt-6">
      <Card>
        <div className="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-4">
          <div>
            <h2 className="text-[14px] font-[500] tracking-[-0.015em]">Class representatives</h2>
            <p className="mt-0.5 text-[12px] text-[var(--ink-muted)]">
              One rep per section. Sections without a rep show "not yet assigned".
            </p>
          </div>
          <Button size="sm" onClick={() => openAssign(null)} disabled={sections.length === 0}>
            <UserCheck className="size-4" />
            Assign rep
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-[var(--hairline)] text-[12px] text-[var(--ink-muted)]">
              <tr>
                {["Section", "Year level", "Representative", "Student no.", "Role", ""].map((h) => (
                  <th key={h} className="px-5 py-3 font-[500] tracking-[0.02em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[var(--ink-muted)]">
                    No sections yet. Add a section first.
                  </td>
                </tr>
              ) : (
                rows.map((sec, i) => {
                  const rep = repBySection[sec.id] ?? null;
                  const assigned = Boolean(rep);
                  return (
                    <motion.tr
                      key={sec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.03, duration: 0.2 }}
                      className="border-t border-[var(--hairline-soft)] transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <td className="px-5 py-4 font-[500]">{sec.name}</td>
                      <td className="px-5 py-4 text-[var(--ink-muted)]">{sec.year_label}</td>
                      <td className="px-5 py-4">
                        {assigned ? (
                          <span className="flex items-center gap-3">
                            <Avatar initials={nameInitials(rep.student?.name ?? "")} />
                            <span>{rep.student?.name ?? "—"}</span>
                          </span>
                        ) : (
                          <span className="italic text-[var(--ink-muted)]">not yet assigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[var(--ink-muted)]">
                        {assigned ? (rep.student?.student_no ?? "—") : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={assigned ? "confirmed" : "outline"}>
                          {assigned ? "Class Representative" : "No assigned representative"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        {assigned ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[var(--ink-muted)] hover:text-red-400"
                            onClick={() => handleRemove(rep)}
                            aria-label="Unassign rep"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAssign(sec.id)}
                          >
                            <UserCheck className="size-4" />
                            Assign
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AddClassRepDialog
        orgId={orgId}
        orgName={orgName}
        sections={sections}
        presetSectionId={presetSection}
        open={showAdd}
        onClose={() => { setShowAdd(false); setPresetSection(null); }}
        onAdded={handleAdded}
      />
    </MotionCard>
  );
}

/* ════════════════════════════════════════════════════════════
   MembersPage
   ════════════════════════════════════════════════════════════ */
export default function MembersPage() {
  const { selectedOrg, role } = useApp();
  const orgId = selectedOrg?.id ?? null;
  const orgName = selectedOrg?.name ?? "—";
  const orgDepartment = selectedOrg?.department ?? null;
  const orgDeptId = orgDepartment?.id ?? null;
  // Only officers (Class Rep / Class Treasurer) can create sections —
  // plain Org Members should not see the "Add section" button.
  const canManageSections = role !== "Org Member";

  const [members, setMembers] = useState([]);
  // Sections are scoped to the active org's department — never general.
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  /* Load ONLY the sections that belong to the active org's department. */
  const loadSections = useCallback(async () => {
    if (!orgDeptId) {
      setSections([]);
      return;
    }
    try {
      const data = await getSections({ department_id: orgDeptId });
      setSections(data);
    } catch {
      setSections([]);
    }
  }, [orgDeptId]);

  useEffect(() => { loadSections(); }, [loadSections]);

  /* Load members whenever the active org changes. */
  const loadMembers = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setMembers([]);
    try {
      const data = await getMembers(orgId);
      setMembers(data);
    } catch {
      /* backend may not be reachable */
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const sectionOptions = Array.from(new Set(members.map((m) => m.section).filter(Boolean))).sort();
  const yearOptions = Array.from(new Set(members.map((m) => String(m.year_level ?? m.year_label ?? "")).filter(Boolean))).sort((a, b) => Number(a) - Number(b));

  const shown = members.filter((m) => {
    const roleMatches = roleFilter === "all" || m.role === roleFilter;
    const sectionMatches = sectionFilter === "all" || m.section === sectionFilter;
    const yearMatches = yearFilter === "all" || String(m.year_level ?? m.year_label ?? "") === String(yearFilter);
    const q = search.trim().toLowerCase();
    const textMatches = !q || [m.name, m.student_no, m.section, m.role].some((value) =>
      String(value ?? "").toLowerCase().includes(q)
    );
    return roleMatches && sectionMatches && yearMatches && textMatches;
  });

  const handleDelete = async (member) => {
    try {
      await deleteMember(member.id);
      setMembers((ms) => ms.filter((m) => m.id !== member.id));
      setSelected(null);
      toast.success(`${member.name} removed from the organization.`);
    } catch (err) {
      toast.error(err.message ?? "Failed to remove member.");
    }
  };

  return (
    <>
      <Head
        title="Members"
        desc={orgId ? `Showing members of ${orgName}.` : "Select an organization to view its members."}
        action={
          orgId ? (
            <Button onClick={() => setShowAddMember(true)}>
              <Plus className="size-4" />
              Add member
            </Button>
          ) : null
        }
      />

      {/* Members table */}
      <MotionCard delay={0.08}>
        <Card>
          <div className="flex flex-col gap-3 border-b border-[var(--hairline)] p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-muted)]" />
                <Input
                  className="pl-9"
                  placeholder="Search by name, student no., section…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-[620px] grid-cols-1 gap-3 sm:grid-cols-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {sectionOptions.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All year levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All year levels</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {orgId && canManageSections && (
              <Button variant="outline" size="sm" onClick={() => setShowAddSection(true)}>
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add section</span>
                <span className="sm:hidden">Section</span>
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-[13px]">
              <thead className="border-b border-[var(--hairline)] text-[12px] text-[var(--ink-muted)]">
                <tr>
                  {["Name", "Student no.", "Section", "Year level", "Role"].map((h) => (
                    <th className="px-5 py-3 font-[500] tracking-[0.02em]" key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows />
                ) : !orgId ? (
                  <Empty msg="No organization selected. Use the org switcher in the sidebar." />
                ) : shown.length === 0 ? (
                  <Empty
                    msg={
                      search || roleFilter !== "all" || sectionFilter !== "all" || yearFilter !== "all"
                        ? "No members match the current filters."
                        : "No members yet. Add the first one!"
                    }
                  />
                ) : (
                  shown.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.03, duration: 0.2 }}
                      className="cursor-pointer border-t border-[var(--hairline-soft)] transition-colors hover:bg-[var(--surface-2)]"
                      onClick={() => setSelected(m)}
                    >
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-3">
                          <Avatar initials={nameInitials(m.name)} />
                          <span className="font-[500]">{m.name}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[var(--ink-muted)]">{m.student_no}</td>
                      <td className="px-5 py-4 text-[var(--ink-muted)]">{m.section}</td>
                      <td className="px-5 py-4 text-[var(--ink-muted)]">{m.year_label}</td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            m.role === "Class Representative"
                              ? "confirmed"
                              : m.role === "Class Treasurer"
                              ? "pending"
                              : "secondary"
                          }
                        >
                          {m.role}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </MotionCard>

      {/* Class representatives section */}
      {orgId && (
        <ClassRepsTable
          orgId={orgId}
          orgName={orgName}
          sections={sections}
          onRepChanged={() => loadMembers()}
        />
      )}

      {/* Member detail slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
              onClick={() => setSelected(null)}
            />
            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-[var(--surface-1)] border-l border-[var(--hairline)] p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute right-4 top-4"
                variant="ghost"
                size="icon"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>

              <div className="mt-8 flex items-center gap-4">
                <Avatar className="size-14 text-base" initials={nameInitials(selected.name)} />
                <div>
                  <h2 className="text-[20px] font-[500] tracking-[-0.025em]">{selected.name}</h2>
                  <p className="text-[13px] text-[var(--ink-muted)]">{selected.student_no}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {[
                ["Section",      selected.section],
                ["Year level",   selected.year_label],
                ["Role",         selected.role],
                ["Organization", orgName],
              ].map(([label, val]) => (
                <div className="mb-5" key={label}>
                  <p className="text-[12px] text-[var(--ink-muted)]">{label}</p>
                  <p className="mt-1 text-[14px] font-[500]">{val}</p>
                </div>
              ))}

              <Separator className="my-6" />

              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDelete(selected)}
              >
                <Trash2 className="size-4" />
                Remove from organization
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Add member dialog — uses only this org's sections */}
      {orgId && (
        <AddMemberDialog
          orgId={orgId}
          orgName={orgName}
          sections={sections}
          open={showAddMember}
          onClose={() => setShowAddMember(false)}
          onAdded={(m) => setMembers((ms) => [m, ...ms])}
        />
      )}

      {/* Add section dialog — locked to this org's department */}
      <AddSectionDialog
        department={orgDepartment}
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        onAdded={(section) => setSections((s) => [...s, section].sort((a, b) => a.name.localeCompare(b.name)))}
      />
    </>
  );
}
