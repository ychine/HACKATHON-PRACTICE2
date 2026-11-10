import express from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

// Turn a smallint (1-6) into "1st Year" … "6th Year"
const yearLabel = (n) => {
  const map = ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
  return map[n] ?? `${n}th Year`
}

// Shape a member row (joined student + section) for the API response
const shapeMember = (m) => ({
  id: m.id,
  student_id: m.student_id,
  name: `${m.students?.first_name ?? ''} ${m.students?.last_name ?? ''}`.trim(),
  first_name: m.students?.first_name ?? '',
  last_name: m.students?.last_name ?? '',
  student_no: m.students?.student_no ?? '',
  section_id: m.students?.section_id ?? null,
  section: m.students?.sections?.name ?? '',
  year_level: m.students?.sections?.year_level ?? null,
  year_label: yearLabel(m.students?.sections?.year_level),
  role: m.role,
  joined_at: m.joined_at,
})

/* ────────────────────────────────────────────────────────────
   Health & legacy
   ──────────────────────────────────────────────────────────── */

app.get('/api/health', async (req, res) => {
  const { error } = await supabase.from('organizations').select('*', { count: 'exact', head: true })
  if (error) return res.status(500).json({ ok: false, error: error.message })
  res.json({ ok: true, message: 'Supabase connected' })
})

app.get('/api/todos', async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

/* ────────────────────────────────────────────────────────────
   Organizations
   ──────────────────────────────────────────────────────────── */

app.get('/api/organizations', async (req, res) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, created_at, departments(id, code, name)')
    .order('name', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(
    (data ?? []).map((o) => ({
      id: o.id,
      name: o.name,
      created_at: o.created_at,
      department: o.departments ? { id: o.departments.id, code: o.departments.code, name: o.departments.name } : null,
    })),
  )
})

/* ────────────────────────────────────────────────────────────
   Departments
   ──────────────────────────────────────────────────────────── */

app.get('/api/departments', async (req, res) => {
  const { data, error } = await supabase
    .from('departments')
    .select('id, code, name')
    .order('name', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data ?? [])
})

/* ────────────────────────────────────────────────────────────
   Sections
   ──────────────────────────────────────────────────────────── */

app.get('/api/sections', async (req, res) => {
  const { department_id } = req.query
  let q = supabase
    .from('sections')
    .select('id, name, year_level, department_id, school_year, departments(id, code, name)')
    .order('name', { ascending: true })
  if (department_id) q = q.eq('department_id', department_id)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json(
    (data ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      year_level: s.year_level,
      year_label: yearLabel(s.year_level),
      department_id: s.department_id,
      school_year: s.school_year,
      department: s.departments ? { id: s.departments.id, code: s.departments.code, name: s.departments.name } : null,
    })),
  )
})

// Create a new section
app.post('/api/sections', async (req, res) => {
  const { name, year_level, department_id, school_year } = req.body ?? {}
  if (!name || !year_level || !department_id)
    return res.status(400).json({ error: 'name, year_level and department_id are required' })

  // school_year is NOT NULL on this table — default to the current year
  const sy = String(school_year ?? String(new Date().getFullYear())).trim()

  const { data, error } = await supabase
    .from('sections')
    .insert({ name: String(name).trim(), year_level: Number(year_level), department_id, school_year: sy })
    .select('id, name, year_level, department_id, school_year, departments(id, code, name)')
    .single()
  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'A section with that name already exists.' })
    return res.status(500).json({ error: error.message })
  }
  res.status(201).json({
    id: data.id,
    name: data.name,
    year_level: data.year_level,
    year_label: yearLabel(data.year_level),
    department_id: data.department_id,
    department: data.departments ? { id: data.departments.id, code: data.departments.code, name: data.departments.name } : null,
  })
})

/* ────────────────────────────────────────────────────────────
   Students
   ──────────────────────────────────────────────────────────── */

app.get('/api/students', async (req, res) => {
  const { section_id } = req.query
  let q = supabase
    .from('students')
    .select('id, student_no, first_name, last_name, email, section_id, sections(id, name, year_level)')
    .order('last_name', { ascending: true })
  if (section_id) q = q.eq('section_id', section_id)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json(
    (data ?? []).map((s) => ({
      id: s.id,
      student_no: s.student_no,
      first_name: s.first_name,
      last_name: s.last_name,
      name: `${s.first_name} ${s.last_name}`.trim(),
      email: s.email,
      section_id: s.section_id,
      section: s.sections?.name ?? '',
      year_level: s.sections?.year_level ?? null,
      year_label: yearLabel(s.sections?.year_level),
    })),
  )
})

/* Find or create a student by student_no, attaching a section. */
async function findOrCreateStudent({ student_no, first_name, last_name, section_id }) {
  // try existing
  const { data: existing } = await supabase
    .from('students')
    .select('id, student_no, first_name, last_name, email, section_id')
    .eq('student_no', student_no)
    .maybeSingle()
  if (existing) {
    // keep section in sync if a new one was supplied
    if (section_id && section_id !== existing.section_id) {
      await supabase.from('students').update({ section_id }).eq('id', existing.id)
    }
    return { student: { ...existing, section_id: section_id ?? existing.section_id } }
  }
  // create
  const { data: created, error } = await supabase
    .from('students')
    .insert({
      student_no: String(student_no).trim(),
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      email: `${String(student_no).trim().toLowerCase()}@school.ph`,
      // password_hash is NOT NULL on this table — placeholder for org-managed members
      password_hash: 'managed',
      section_id,
    })
    .select('id, student_no, first_name, last_name, email, section_id')
    .single()
  if (error) return { error }
  return { student: created }
}

/* ────────────────────────────────────────────────────────────
   Members  (org membership with role)
   ──────────────────────────────────────────────────────────── */

// List members, optionally filtered by ?org_id=
app.get('/api/members', async (req, res) => {
  const { org_id } = req.query
  let q = supabase
    .from('members')
    .select('id, student_id, org_id, role, joined_at, students(id, student_no, first_name, last_name, section_id, sections(id, name, year_level))')
    .order('joined_at', { ascending: false })
  if (org_id) q = q.eq('org_id', org_id)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json((data ?? []).map(shapeMember))
})

// Add a member (creates the student if needed, links to the org with a role)
app.post('/api/members', async (req, res) => {
  const { org_id, first_name, last_name, student_no, section_id, role } = req.body ?? {}
  if (!org_id || !student_no || !first_name || !last_name || !section_id || !role)
    return res.status(400).json({ error: 'org_id, first_name, last_name, student_no, section_id and role are required' })

  const validRoles = ['Org Member', 'Class Representative', 'Class Treasurer']
  if (!validRoles.includes(role))
    return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` })

  const { student, error: sErr } = await findOrCreateStudent({ student_no, first_name, last_name, section_id })
  if (sErr) {
    if (sErr.code === '23505') return res.status(409).json({ error: 'A student with that student number already exists with different details.' })
    return res.status(500).json({ error: sErr.message })
  }

  // upsert membership (unique student_id+org_id)
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('student_id', student.id)
    .eq('org_id', org_id)
    .maybeSingle()

  let memberRow
  if (existing) {
    const { data, error } = await supabase
      .from('members').update({ role }).eq('id', existing.id)
      .select('id, student_id, org_id, role, joined_at, students(id, student_no, first_name, last_name, section_id, sections(id, name, year_level))')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    memberRow = data
  } else {
    const { data, error } = await supabase
      .from('members').insert({ student_id: student.id, org_id, role })
      .select('id, student_id, org_id, role, joined_at, students(id, student_no, first_name, last_name, section_id, sections(id, name, year_level))')
      .single()
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'That student is already a member of this organization.' })
      return res.status(500).json({ error: error.message })
    }
    memberRow = data
  }

  // If role is Class Representative, also register them as the rep for that section
  if (role === 'Class Representative') {
    const { data: rep } = await supabase
      .from('class_representatives')
      .select('id')
      .eq('org_id', org_id)
      .eq('section_id', section_id)
      .maybeSingle()
    if (rep) {
      await supabase.from('class_representatives').update({ student_id: student.id }).eq('id', rep.id)
    } else {
      await supabase.from('class_representatives').insert({ org_id, section_id, student_id: student.id })
    }
  }

  res.status(201).json(shapeMember(memberRow))
})

// Delete a member
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ok: true })
})

/* ────────────────────────────────────────────────────────────
   Class representatives  (rep-per-section-per-org)
   ──────────────────────────────────────────────────────────── */

// List class reps, optionally filtered by ?org_id=
app.get('/api/class-representatives', async (req, res) => {
  const { org_id } = req.query
  let q = supabase
    .from('class_representatives')
    .select('id, org_id, section_id, student_id, assigned_at, students(id, student_no, first_name, last_name), sections(id, name, year_level)')
    .order('assigned_at', { ascending: false })
  if (org_id) q = q.eq('org_id', org_id)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json(
    (data ?? []).map((r) => ({
      id: r.id,
      org_id: r.org_id,
      section_id: r.section_id,
      student_id: r.student_id,
      assigned_at: r.assigned_at,
      student: r.students ? { id: r.students.id, student_no: r.students.student_no, name: `${r.students.first_name} ${r.students.last_name}`.trim() } : null,
      section: r.sections ? { id: r.sections.id, name: r.sections.name, year_level: r.sections.year_level, year_label: yearLabel(r.sections.year_level) } : null,
    })),
  )
})

// Assign a class rep to a section for an org (one rep per section per org)
app.post('/api/class-representatives', async (req, res) => {
  const { org_id, section_id, student_id, first_name, last_name, student_no } = req.body ?? {}
  if (!org_id || !section_id)
    return res.status(400).json({ error: 'org_id and section_id are required' })

  let repStudentId = student_id
  if (!repStudentId) {
    if (!student_no || !first_name || !last_name)
      return res.status(400).json({ error: 'Provide either student_id, or first_name+last_name+student_no' })
    const { student, error: sErr } = await findOrCreateStudent({ student_no, first_name, last_name, section_id })
    if (sErr) return res.status(500).json({ error: sErr.message })
    repStudentId = student.id
  }

  // replace existing rep for this org+section (unique constraint)
  const { data: existing } = await supabase
    .from('class_representatives')
    .select('id')
    .eq('org_id', org_id)
    .eq('section_id', section_id)
    .maybeSingle()

  let row
  if (existing) {
    const { data, error } = await supabase
      .from('class_representatives').update({ student_id: repStudentId }).eq('id', existing.id)
      .select('id, org_id, section_id, student_id, assigned_at, students(id, student_no, first_name, last_name), sections(id, name, year_level)')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    row = data
  } else {
    const { data, error } = await supabase
      .from('class_representatives').insert({ org_id, section_id, student_id: repStudentId })
      .select('id, org_id, section_id, student_id, assigned_at, students(id, student_no, first_name, last_name), sections(id, name, year_level)')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    row = data
  }

  // Make sure the rep is also a member with the Class Representative role
  const { data: member } = await supabase
    .from('members').select('id').eq('student_id', repStudentId).eq('org_id', org_id).maybeSingle()
  if (member) {
    await supabase.from('members').update({ role: 'Class Representative' }).eq('id', member.id)
  } else {
    await supabase.from('members').insert({ student_id: repStudentId, org_id, role: 'Class Representative' })
  }

  res.status(201).json({
    id: row.id,
    org_id: row.org_id,
    section_id: row.section_id,
    student_id: row.student_id,
    assigned_at: row.assigned_at,
    student: row.students ? { id: row.students.id, student_no: row.students.student_no, name: `${row.students.first_name} ${row.students.last_name}`.trim() } : null,
    section: row.sections ? { id: row.sections.id, name: row.sections.name, year_level: row.sections.year_level, year_label: yearLabel(row.sections.year_level) } : null,
  })
})

// Remove a class rep — also demotes the member's role if they rep no
// other section in this org, so the Members tab stays consistent.
app.delete('/api/class-representatives/:id', async (req, res) => {
  const { id } = req.params

  // fetch the rep so we know org + student
  const { data: rep } = await supabase
    .from('class_representatives')
    .select('id, org_id, student_id, section_id')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('class_representatives').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })

  if (rep) {
    // still repping another section in this org?
    const { count } = await supabase
      .from('class_representatives')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', rep.org_id)
      .eq('student_id', rep.student_id)
    if (!count) {
      await supabase
        .from('members')
        .update({ role: 'Org Member' })
        .eq('student_id', rep.student_id)
        .eq('org_id', rep.org_id)
    }
  }

  res.json({ ok: true })
})

/* ──────────────────────────────────────────────────────────── */

app.listen(process.env.PORT, () =>
  console.log(`API running on port ${process.env.PORT}`),
)
