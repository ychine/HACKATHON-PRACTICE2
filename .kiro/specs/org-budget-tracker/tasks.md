# Implementation Plan: Org Budget Tracker

## Overview

Implement the full Org Budget Tracker platform end-to-end: PostgreSQL schema with RLS migrations, Express.js REST API with JWT auth and role-based authorization, React frontend with route guards, file storage for remittance proofs, reports, audit log, and a property-based + integration test suite.

The implementation follows the layered architecture: Database → API middleware → API routes → Frontend guards → Frontend pages → Testing.

## Tasks

- [ ] 1. Database: migrations, schema, seed data, and RLS
  - [ ] 1.1 Create migration infrastructure and reference-data tables
    - Create `backend/migrations/` directory with a `run-migrations.js` runner that applies SQL files in sequential numeric order and halts on failure
    - Write `001_reference_data.sql`: `departments`, `year_levels`, `sections` tables with foreign keys, unique constraints, and seed rows (1st–5th Year, at least one department and one section)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 26.1, 26.2, 26.3_

  - [ ] 1.2 Create core entity tables
    - Write `002_core_entities.sql`: `students`, `organizations`, `memberships` tables with all columns, CHECK constraints, foreign keys, and the partial unique index `memberships_one_active_per_student_org`
    - _Requirements: 2.3, 2.4, 2.5, 4.3, 6.1, 6.2, 6.3, 6.4, 6.5, 26.2, 26.3, 26.5_

  - [ ] 1.3 Create financial and audit tables
    - Write `003_financial_audit.sql`: `remittances`, `remittance_attachments`, `transaction_history`, `audit_logs`, `organization_settings` tables with all columns, CHECK constraints, indexes, and the append-only enforcement trigger/RLS rule on `transaction_history`
    - _Requirements: 9.3, 9.4, 10.7, 13.9, 14.1, 15.1, 15.2, 15.3, 17.1, 18.1, 24.1, 24.3, 26.2, 26.4, 26.6_

  - [ ] 1.4 Write RLS policies for all tables
    - Write `004_rls_policies.sql`: enable RLS on every table; write policies that allow service-role bypass and restrict anon/authenticated access per organizational membership
    - _Requirements: 25.4, 26.7_

  - [ ]* 1.5 Write property test for ledger immutability (Property 4)
    - **Property 4: Ledger immutability**
    - Attempt UPDATE and DELETE on inserted `transaction_history` rows via the Supabase service-role client; assert both operations fail
    - **Validates: Requirements 15.1, 24.3, 24.4**

- [ ] 2. API: project setup, environment validation, and shared middleware
  - [ ] 2.1 Configure backend entry point and environment validation
    - In `backend/server.js` / `backend/src/app.js`, read `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `PORT` on startup; exit with descriptive error if any are missing
    - Create `backend/src/supabaseAdmin.js` exporting a service-role Supabase client
    - _Requirements: 25.1, 25.2, 25.7_

  - [ ] 2.2 Implement centralized error-handling middleware
    - Create `backend/src/middleware/errorMiddleware.js` producing the unified `{ error: { status, message, fields? } }` JSON shape for all error types; never expose stack traces or service-role keys
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 25.6_

  - [ ] 2.3 Implement JWT verification middleware
    - Create `backend/src/middleware/jwtMiddleware.js` that verifies the Supabase JWT on every request, attaches `req.studentId`, and returns HTTP 401 on missing/invalid/expired tokens
    - _Requirements: 1.3, 1.5, 1.6, 1.9, 7.7_

  - [ ] 2.4 Implement membership resolution and role-enforcement middleware
    - Create `backend/src/middleware/membershipMiddleware.js` that resolves the active membership for `req.params.orgId` and attaches `req.membership`; returns HTTP 403 if no active membership
    - Create `backend/src/middleware/requireRole.js` that accepts an array of roles and returns HTTP 403 if `req.membership.role` is not in the array
    - _Requirements: 6.6, 6.7, 7.1, 7.6_

  - [ ]* 2.5 Write property test for role authorization exhaustiveness (Property 1)
    - **Property 1: Role authorization is exhaustive**
    - Generate random `(role, endpoint_key)` pairs from the full permission matrix; invoke `requireRole` middleware directly with each pair; assert the outcome (allow/403) matches the matrix for all 400+ combinations
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**

- [ ] 3. API: Zod validation schemas
  - [ ] 3.1 Implement shared Zod schemas
    - Create `backend/src/schemas/index.js` exporting: `SignupSchema`, `RegisterOrgSchema`, `CreateRemittanceSchema`, `RejectRemittanceSchema`, `UpdateMembershipSchema`, `OrgSettingsSchema`, `HistoryQuerySchema`
    - Implement `OrgSettingsSchema` with the `academicYear` consecutive-year `.refine()` and `UpdateMembershipSchema` with section-required refinement as defined in the design
    - _Requirements: 19.1, 19.3_

  - [ ]* 3.2 Write property test for input validation rejection (Property 7)
    - **Property 7: Input validation rejects invalid data**
    - For each schema, generate random objects that violate each constraint; assert `schema.safeParse(input).success === false` for every invalid input and `.success === true` for valid boundary inputs
    - **Validates: Requirements 19.1, 19.2, 20.2**

  - [ ]* 3.3 Write property test for academic year consecutive constraint (Property 9)
    - **Property 9: Academic year format is consecutive**
    - Generate random year strings (valid consecutive, non-consecutive, wrong format, edge years); assert the `OrgSettingsSchema` refinement accepts only valid consecutive-year strings
    - **Validates: Requirements 18.1, 18.3, 18.4**

- [ ] 4. API: Auth and student profile routes
  - [ ] 4.1 Implement sign-up endpoint
    - Create `POST /api/auth/signup`: validate body with `SignupSchema`; call Supabase Auth Admin to create auth user; insert `students` row; if student insert fails, delete auth user and return 500
    - _Requirements: 1.1, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 4.2 Implement student profile endpoint
    - Create `GET /api/students/me` (JWT required): return current student's profile with resolved year level name, section name, and department name via JOIN
    - _Requirements: 2.6, 2.7_

- [ ] 5. API: Organization routes
  - [ ] 5.1 Implement organization registration endpoint
    - Create `POST /api/orgs` (JWT required): validate body with `RegisterOrgSchema`; insert organization with `created_by` and `created_at`; insert `org_member` membership; write audit log; reject duplicate name per student with 409
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 17.2_

  - [ ] 5.2 Implement list and get organization endpoints
    - Create `GET /api/orgs` (JWT): return all organizations where the student has an active membership
    - Create `GET /api/orgs/:orgId` (JWT + member): return org details
    - _Requirements: 5.1, 5.3_

- [ ] 6. API: Member management routes
  - [ ] 6.1 Implement list and get member endpoints
    - Create `GET /api/orgs/:orgId/members` (all roles): for `org_member` / `class_treasurer` / `student`, return all active members with full name, student number, section, year level, and role; for `class_rep`, filter to own section only
    - Create `GET /api/orgs/:orgId/members/:memberId` (all roles): return member detail
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 6.2 Implement update member endpoint
    - Create `PATCH /api/orgs/:orgId/members/:memberId` (`org_member` only): validate body with `UpdateMembershipSchema`; update membership record; write audit log entry with before/after role and actor
    - Reject with 403 for non-`org_member` roles; reject with 400 for invalid role or unknown section
    - _Requirements: 8.4, 8.5, 8.6, 17.2_

- [ ] 7. API: Remittance creation and file storage
  - [ ] 7.1 Implement remittance creation endpoint with attachment validation
    - Create `POST /api/orgs/:orgId/remittances` (`class_rep` only): parse multipart body; validate amount, date, notes, and attachments against `CreateRemittanceSchema` and attachment rules (1–10 files, allowed MIME types, ≤ 10 MB each)
    - Reject with 400 and field-level errors if any validation fails; do not create any record
    - _Requirements: 9.2, 9.3, 9.6, 9.8, 10.3, 10.4, 10.6, 10.8, 19.4_

  - [ ] 7.2 Implement Storage upload and remittance persistence
    - On successful validation, upload each file to the private Supabase Storage bucket; insert `remittances` row with `status = 'pending'`; insert one `remittance_attachments` row per file; write audit log
    - If any Storage upload fails, delete any uploaded files and return 500 without creating remittance or attachment records
    - _Requirements: 9.2, 9.5, 9.7, 10.2, 10.6, 10.7, 17.2_

  - [ ]* 7.3 Write property test for attachment constraint enforcement (Property 10)
    - **Property 10: Attachment constraints are enforced**
    - Generate random arrays of `{mime_type, size_bytes}` descriptors; assert the validation function rejects when any attachment has an invalid MIME type, exceeds 10 MB, the array is empty, or the array has more than 10 items
    - **Validates: Requirements 10.2, 10.3, 10.4, 10.6, 10.8**

- [ ] 8. API: Remittance listing, detail, and signed URL
  - [ ] 8.1 Implement remittance list and detail endpoints
    - Create `GET /api/orgs/:orgId/remittances` (all roles): for `class_rep`, return only remittances where `submitted_by` matches the requesting student; for all others, return all org remittances; support optional `status` query filter
    - Create `GET /api/orgs/:orgId/remittances/:id` (all roles): return full remittance detail including attachments list
    - _Requirements: 11.1, 11.2, 11.5_

  - [ ] 8.2 Implement signed URL endpoint for attachments
    - Create `GET /api/orgs/:orgId/remittances/:id/attachments/:attachId/url` (all roles): generate a Supabase Storage signed URL expiring in 1 hour and return it in the response
    - _Requirements: 10.5_

  - [ ]* 8.3 Write property test for remittance scope by role (Property 8)
    - **Property 8: Remittance scope is role-scoped**
    - For a `class_rep` student, assert every remittance returned has `submitted_by` equal to that student's ID; for `org_member` and `class_treasurer`, assert all org remittances are returned regardless of submitter
    - **Validates: Requirements 11.1, 11.2**

- [ ] 9. API: Remittance review (confirm and reject) with atomic transaction
  - [ ] 9.1 Implement confirm remittance endpoint
    - Create a PostgreSQL RPC function `confirm_remittance(p_remittance_id, p_reviewer_id)` in a new migration `005_rpc_confirm_remittance.sql` that atomically: guards non-pending status (raises exception), guards self-review (raises exception), updates remittance status, inserts `transaction_history` row, inserts `audit_logs` row
    - Create `POST /api/orgs/:orgId/remittances/:id/confirm` (`org_member`, `class_treasurer`): call the RPC; return HTTP 409 on any exception; reject self-review with HTTP 403
    - _Requirements: 13.1, 13.2, 13.3, 13.7, 13.8, 13.9, 17.2_

  - [ ] 9.2 Implement reject remittance endpoint
    - Create `POST /api/orgs/:orgId/remittances/:id/reject` (`org_member`, `class_treasurer`): validate body with `RejectRemittanceSchema`; set status `rejected`, `reviewed_by`, `reviewed_at`, `rejection_reason`; write audit log; do NOT insert `transaction_history` row
    - Reject self-review with HTTP 403; reject non-pending remittances with HTTP 409; reject empty/over-500-char reason with HTTP 400
    - _Requirements: 13.4, 13.5, 13.6, 13.7, 13.8, 13.10, 17.2_

  - [ ]* 9.3 Write integration test for remittance confirmation atomicity (Property 2)
    - **Property 2: Remittance confirmation atomicity**
    - Confirm a pending remittance; assert exactly one `transaction_history` row and one `audit_logs` row were inserted; force a mid-transaction failure (constraint violation); assert neither row exists and remittance status is still `pending`
    - **Validates: Requirements 13.2, 13.3, 27.2**

  - [ ]* 9.4 Write integration test for self-review rejection (Property 6)
    - **Property 6: Self-review is always rejected**
    - Submit a remittance as student A; attempt to confirm it as student A; assert HTTP 403 and remittance status unchanged
    - **Validates: Requirements 13.7, 27.3**

  - [ ]* 9.5 Write integration test for rejection not touching the ledger
    - Reject a remittance; assert no `transaction_history` row was inserted; assert the budget total is unchanged from before the rejection
    - **Validates: Requirements 13.4, 27.4**

  - [ ]* 9.6 Write integration test for confirmed remittance immutability (Property 5)
    - **Property 5: Remittance status transitions are valid**
    - Confirm a remittance; attempt to UPDATE `amount`, `status`, and `reviewed_by`; attempt DELETE; assert all modification operations fail; attempt a second confirm; assert HTTP 409
    - **Validates: Requirements 13.8, 13.9, 27.5**

- [ ] 10. Checkpoint — API core complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. API: Transaction history and budget computation
  - [ ] 11.1 Implement transaction history endpoint
    - Create `GET /api/orgs/:orgId/history` (all roles): query `transaction_history` with optional `type` and date-range filters (≤ 365 days); paginate at max 50 rows with `{ data, meta: { page, page_size, total_rows, total_pages } }`; sort by `created_at` descending; return empty list with `total_rows: 0` for zero-result filters
    - _Requirements: 15.4, 15.5, 15.6, 15.7_

  - [ ] 11.2 Implement budget computation in dashboard endpoint
    - Create `GET /api/orgs/:orgId/dashboard` (all roles): run the `COALESCE(SUM(...))` budget SQL using `NUMERIC(12,2)` arithmetic; return current budget, total remittances, total expenses, and pending remittance count
    - _Requirements: 14.1, 14.2, 14.3, 24.1, 24.2, 24.5_

  - [ ]* 11.3 Write property test for budget equals ledger sum (Property 3)
    - **Property 3: Budget equals ledger sum**
    - Generate random arrays of `{type, amount}` ledger entries of types `remittance`, `expense`, `adjustment`; compute expected budget with decimal arithmetic; assert the SQL-equivalent computation (mocked or real) returns the same value with no floating-point operations
    - **Validates: Requirements 14.1, 14.2, 24.1, 24.2, 24.5**

- [ ] 12. API: Reports, audit log, and settings routes
  - [ ] 12.1 Implement reports endpoints
    - Create `GET /api/orgs/:orgId/reports/sections` (all roles): aggregate total remittances per section for the requested date range (≤ 24 months); return `{ section_name, period, total_remittances_collected, total_budget_allocated }`
    - Create `GET /api/orgs/:orgId/reports/monthly` (all roles): aggregate monthly totals
    - Create `GET /api/orgs/:orgId/reports/budget-over-time` (all roles): running budget sum over time
    - Create `GET /api/orgs/:orgId/reports/export` (all roles): return CSV download with column headers matching report fields
    - _Requirements: 16.1, 16.3, 16.4, 16.5_

  - [ ] 12.2 Implement audit log endpoint
    - Create `GET /api/orgs/:orgId/audit` (`org_member`, `class_treasurer`): return paginated audit log sorted by `created_at` descending; return HTTP 403 for `class_rep` and `student`
    - _Requirements: 17.3, 17.4, 17.5_

  - [ ] 12.3 Implement organization settings endpoints
    - Create `GET /api/orgs/:orgId/settings` (all roles): return current settings
    - Create `PUT /api/orgs/:orgId/settings` (`org_member` only): validate with `OrgSettingsSchema`; persist settings; write audit log with before/after values; return 403 for all other roles
    - _Requirements: 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 17.2_

- [ ] 13. API: Full authorization matrix integration tests
  - [ ]* 13.1 Write authorization matrix integration tests (Property 1 integration)
    - For each of the four roles (`org_member`, `class_rep`, `class_treasurer`, `student`), seed the test DB with appropriate memberships and run every route in the permission matrix via Supertest
    - Assert allowed actions return 2xx and denied actions return HTTP 403
    - **Validates: Requirements 7.1–7.6, 27.1**

- [ ] 14. Frontend: project setup and shared infrastructure
  - [ ] 14.1 Configure API client and auth session management
    - Create `frontend/src/lib/apiClient.js`: an axios instance that automatically attaches the Supabase Auth JWT as `Authorization: Bearer <token>` on every request; handle 401 by redirecting to `/login`
    - Confirm Supabase anon key is used only in the frontend (`frontend/src/lib/supabase.js`); never the service-role key
    - _Requirements: 1.3, 25.3_

  - [ ] 14.2 Implement shared UI state components
    - Create `LoadingState`, `EmptyState`, `ErrorState` (with retry via TanStack Query `refetch`), `ConfirmationDialog` (AlertDialog with confirm and cancel), and `MoneyDisplay` (formats as `₱X,XXX.XX` via `Intl.NumberFormat` with `en-PH` locale) components
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 14.4_

- [ ] 15. Frontend: authentication pages and route guards
  - [ ] 15.1 Implement AuthGuard and OrgMembershipGuard
    - Create `AuthGuard`: read Supabase Auth session from context; redirect to `/login` if no session; render nothing (no role-restricted controls) while session loads
    - Create `OrgMembershipGuard`: fetch active membership for current `orgId`; redirect to `/orgs` if none; render loading state while fetching
    - _Requirements: 5.6, 21.1, 21.2, 21.5, 21.6_

  - [ ] 15.2 Implement SignUpPage and LoginPage
    - Create `SignUpPage` (`/signup`): React Hook Form + Zod with `SignupSchema`; call Supabase Auth then `POST /api/students/profile`; display error on duplicate email or invalid credentials
    - Create `LoginPage` (`/login`): Supabase Auth `signInWithPassword`; store session; display error on invalid credentials; redirect on success
    - _Requirements: 1.1, 1.2, 1.4, 1.7, 1.8_

- [ ] 16. Frontend: layout and navigation
  - [ ] 16.1 Implement OrgLayout with responsive navigation
    - Create `OrgLayout`: desktop (≥ 1024 px) left sidebar; mobile (< 768 px) bottom navigation bar; tablet (768–1023 px) consistent primary navigation; both show links to Dashboard, Remittances, Members, History, Reports, Audit, Settings
    - Receive current role from context and pass to child pages
    - Match layout structure from the `figma-make` prototype (`figma-make/src/App.tsx`)
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 17. Frontend: My Organizations and organization registration
  - [ ] 17.1 Implement MyOrgsPage and RegisterOrgPage
    - Create `MyOrgsPage` (`/orgs`): list all active memberships using TanStack Query; show `EmptyState` when empty with guidance; include "Register Another Org" button that navigates to `/orgs/new`
    - Create `RegisterOrgPage` (`/orgs/new`): React Hook Form + Zod with `RegisterOrgSchema`; prevent submission if name empty; call `POST /api/orgs`; redirect to new org's dashboard on success
    - _Requirements: 4.6, 5.1, 5.2, 5.4, 5.5, 5.7_

- [ ] 18. Frontend: Dashboard, Members, and History pages
  - [ ] 18.1 Implement DashboardPage
    - Create `DashboardPage` (`/orgs/:orgId/dashboard`): fetch and display current budget, total remittances, total expenses, and pending remittance count via TanStack Query; show `LoadingState` while fetching; show `ErrorState` with retry on failure; format all money values with `MoneyDisplay`
    - _Requirements: 14.3, 14.4, 22.1, 22.3_

  - [ ] 18.2 Implement MembersPage
    - Create `MembersPage` (`/orgs/:orgId/members`): for `org_member` show all members; for `class_rep` show own-section members; display full name, student number, section, year level, role; show member side-panel detail on row click
    - For `org_member`: show role-change form in the panel using `UpdateMembershipSchema`; show `ConfirmationDialog` before submitting
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ] 18.3 Implement HistoryPage
    - Create `HistoryPage` (`/orgs/:orgId/history`): read-only paginated ledger; no create/edit/delete controls; sort by `created_at` descending; support type filter and date-range filter (ISO 8601, ≤ 365 days) with inputs wired to query params; show `EmptyState` for zero results
    - _Requirements: 15.4, 15.5, 11.3, 11.4_

- [ ] 19. Frontend: Remittances list, form, and detail
  - [ ] 19.1 Implement RemittancesPage
    - Create `RemittancesPage` (`/orgs/:orgId/remittances`): tabbed filter (all / pending / confirmed / rejected); show "Log a Remittance" button only for `class_rep` (hide for all other roles); show no create/review controls for `student` role
    - _Requirements: 9.1, 11.1, 11.2, 11.3, 11.4, 11.5, 21.3, 21.4_

  - [ ] 19.2 Implement RemittanceFormPage with file upload
    - Create `RemittanceFormPage` (`/orgs/:orgId/remittances/new`): React Hook Form + Zod; show file preview before submission; validate 1–10 files, allowed MIME types, ≤ 10 MB; call `POST /api/orgs/:orgId/remittances` with multipart form data; display field-level errors from API 400 responses
    - _Requirements: 9.2, 9.8, 10.1, 10.3, 10.4, 10.8_

  - [ ] 19.3 Implement RemittanceDetailPage with status timeline and review panel
    - Create `RemittanceDetailPage` (`/orgs/:orgId/remittances/:id`): display amount, section, submitter, collection date, reference, notes, status timeline (submitted → review → added to balance / rejected), and proof attachments list; fetch signed URLs for attachments; display "no attachments" state when list is empty
    - For `org_member` and `class_treasurer`: show Confirm and Reject buttons only for `pending` remittances; show `ConfirmationDialog` before submitting; display outcome confirmation within 3 seconds on success
    - Display attachment-unavailable error when signed URL fetch fails; display remittance-unavailable error when detail fetch fails
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 13.1, 13.11, 21.3, 21.4, 22.4_

- [ ] 20. Frontend: Reports, Audit Log, and Settings pages
  - [ ] 20.1 Implement ReportsPage
    - Create `ReportsPage` (`/orgs/:orgId/reports`): remittances-per-section chart, monthly totals chart, and budget-over-time chart using data from report endpoints; date range filter (up to 24 months); "Export CSV" button that triggers download from `GET /api/orgs/:orgId/reports/export`
    - Show `ErrorState` on fetch failure; do not display partial or stale data
    - _Requirements: 16.1, 16.2, 16.3, 16.5, 16.6_

  - [ ] 20.2 Implement AuditPage
    - Create `AuditPage` (`/orgs/:orgId/audit`): read-only audit log; visible only to `org_member` and `class_treasurer`; hide from `class_rep` and `student` via route guard and conditional rendering; show `LoadingState` and `ErrorState`
    - _Requirements: 17.3, 17.4, 17.7_

  - [ ] 20.3 Implement SettingsPage
    - Create `SettingsPage` (`/orgs/:orgId/settings`): editable form for `org_member` using React Hook Form + `OrgSettingsSchema`; read-only display for `class_treasurer`, `class_rep`, `student`; show confirmation message on save; show field-level errors from API 400 responses without discarding submitted values
    - _Requirements: 18.2, 18.3, 18.4, 18.5_

- [ ] 21. Frontend: role-driven visibility and action guards
  - [ ] 21.1 Wire role context and enforce all action visibility rules
    - Ensure `OrgLayout` fetches the current role via `GET /api/orgs/:orgId` or membership endpoint and stores it in React context; child pages read only the API-returned role to decide which action controls to render
    - Verify: "Log a Remittance" hidden for non-`class_rep`; Confirm/Reject hidden for `class_rep` and `student`; Audit link hidden for `class_rep` and `student`; settings fields disabled for non-`org_member`
    - _Requirements: 21.3, 21.4, 21.5, 21.6_

- [ ] 22. Checkpoint — Full feature complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. End-to-end smoke tests
  - [ ]* 23.1 Implement happy-path E2E tests with Playwright
    - Write E2E test 1: Sign up → register org → log remittance as `class_rep` → confirm remittance as `org_member` → assert budget increased by remittance amount
    - Write E2E test 2: Navigate to `/orgs/:orgId/*` without an active membership → assert redirect to My Organizations page
    - **Validates: Requirements 1.1, 4.1, 9.2, 13.2, 14.2, 21.2**

- [ ] 24. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP, but property-based and integration tests directly validate the correctness properties in the design document
- All money values must use `NUMERIC(12,2)` in the DB and `Intl.NumberFormat` with `PHP` currency in the UI; no floating-point arithmetic anywhere
- The `transaction_history` table is append-only; this is enforced at the DB level (trigger or RLS) and must never be circumvented in the API
- The `confirm_remittance` RPC must execute atomically; any failure rolls back all three operations (remittance update, ledger insert, audit insert)
- The Supabase service-role key must never appear in frontend code, API responses, or error messages
- Each property-based test must run a minimum of 100 fast-check iterations
- The figma-make prototype (`figma-make/src/App.tsx`) is the canonical UX reference for all screen layouts

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["1.4", "2.1"] },
    { "id": 4, "tasks": ["1.5", "2.2", "2.3"] },
    { "id": 5, "tasks": ["2.4", "3.1"] },
    { "id": 6, "tasks": ["2.5", "3.2", "3.3", "4.1"] },
    { "id": 7, "tasks": ["4.2", "5.1"] },
    { "id": 8, "tasks": ["5.2", "6.1"] },
    { "id": 9, "tasks": ["6.2", "7.1"] },
    { "id": 10, "tasks": ["7.2"] },
    { "id": 11, "tasks": ["7.3", "8.1"] },
    { "id": 12, "tasks": ["8.2", "9.1"] },
    { "id": 13, "tasks": ["8.3", "9.2"] },
    { "id": 14, "tasks": ["9.3", "9.4", "9.5", "9.6"] },
    { "id": 15, "tasks": ["11.1", "11.2"] },
    { "id": 16, "tasks": ["11.3", "12.1"] },
    { "id": 17, "tasks": ["12.2", "12.3"] },
    { "id": 18, "tasks": ["13.1", "14.1"] },
    { "id": 19, "tasks": ["14.2", "15.1"] },
    { "id": 20, "tasks": ["15.2", "16.1"] },
    { "id": 21, "tasks": ["17.1"] },
    { "id": 22, "tasks": ["18.1", "18.2", "18.3"] },
    { "id": 23, "tasks": ["19.1"] },
    { "id": 24, "tasks": ["19.2", "19.3"] },
    { "id": 25, "tasks": ["20.1", "20.2", "20.3"] },
    { "id": 26, "tasks": ["21.1"] },
    { "id": 27, "tasks": ["23.1"] }
  ]
}
```
