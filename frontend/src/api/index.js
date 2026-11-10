/**
 * src/api/index.js — Thin wrappers around the Express backend.
 * Base URL is handled by the Vite proxy: /api → http://localhost:5000
 */

const BASE = '/api'

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }
  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`)
  return data
}

/* ── Organizations ─────────────────────────────────────────── */
export const getOrganizations  = () => req('GET', '/organizations')

/* ── Departments ───────────────────────────────────────────── */
export const getDepartments    = () => req('GET', '/departments')

/* ── Sections ──────────────────────────────────────────────── */
export const getSections       = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/sections${qs ? `?${qs}` : ''}`)
}
export const createSection     = (body) => req('POST', '/sections', body)

/* ── Students ──────────────────────────────────────────────── */
export const getStudents       = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/students${qs ? `?${qs}` : ''}`)
}

/* ── Members ───────────────────────────────────────────────── */
export const getMembers        = (org_id) => req('GET', `/members?org_id=${org_id}`)
export const addMember         = (body) => req('POST', '/members', body)
export const deleteMember      = (id) => req('DELETE', `/members/${id}`)

/* ── Class Representatives ─────────────────────────────────── */
export const getClassReps      = (org_id) => req('GET', `/class-representatives?org_id=${org_id}`)
export const addClassRep       = (body) => req('POST', '/class-representatives', body)
export const deleteClassRep    = (id) => req('DELETE', `/class-representatives/${id}`)
