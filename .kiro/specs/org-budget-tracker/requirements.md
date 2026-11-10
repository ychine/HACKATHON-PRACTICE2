# Requirements Document

## Introduction

The Org Budget Tracker is a multi-organization web platform that lets student organizations register, collect remittances from class sections, and give members transparent visibility into the organization's budget.

A signed-in student may belong to several organizations with a different role in each. Class Representatives log remittances (collections from their section) with attached proof. Authorized reviewers (Org Members and Class Treasurers) confirm or reject those remittances. A confirmed remittance posts an entry to an append-only ledger in a single database transaction, and the organization's budget is computed from that ledger. Every member of an organization gets read-only access to the budget dashboard, transaction history, and reports.

The platform is built on the existing workspace: a React (Vite) frontend using React Router, TanStack Query, React Hook Form, and Zod; an Express.js (Node, ESM) REST API with Zod validation, centralized error handling, and role-based authorization middleware; PostgreSQL hosted on Supabase with SQL migrations and Row Level Security; Supabase Auth (email/password) for sign-in; and Supabase Storage for remittance proof attachments. The figma-make/ prototype serves as the visual and UX reference for the design.

## Glossary

- **System**: The Org Budget Tracker platform as a whole (Frontend + API + Database + Storage + Auth_Service).
- **Frontend**: The React (Vite) web application that students interact with.
- **API**: The Express.js REST API server that enforces authentication, authorization, validation, and business rules.
- **Database**: The PostgreSQL database hosted on Supabase.
- **Auth_Service**: Supabase Auth, the email/password authentication provider that issues JWTs.
- **Storage**: Supabase Storage, the private bucket holding remittance proof attachments.
- **Validator**: The Zod schema validation layer used by the Frontend forms and the API.
- **Ledger**: The `transaction_history` table, an append-only record of every monetary movement; the budget is computed from it.
- **Budget**: The current available balance of an Organization, computed as the sum of ledger amounts.
- **Organization**: A registered student organization (for example Engineering Society) that owns remittances, members, and a budget.
- **Student**: A profile linked to a Supabase Auth user (student number, name, email, year level, section, department).
- **Membership**: The link between a Student and an Organization that carries a Role, an optional Section, and a status.
- **Role**: One of `org_member`, `class_rep`, `class_treasurer`, or `student`, scoped per Organization via a Membership.
  - **Org Member**: officer/admin of the Organization; full visibility, manages members and settings, reviews remittances.
  - **Class Representative** (`class_rep`): logs remittances for their own Section only; sees their own remittances and their own Section's members.
  - **Class Treasurer** (`class_treasurer`): reviews remittances; views audit and settings read-only.
  - **Regular Student** (`student`): read-only access to the dashboard, budget, transaction history, and reports.
- **Section**: A class section (for example BSIT 3-A) that belongs to a Department and a Year_Level.
- **Department**: An academic department (for example Information Technology).
- **Year_Level**: An academic year level (for example 1st Year, 2nd Year).
- **Remittance**: A collection submitted by a Class Representative for their Section, with amount, date, notes, status, and optional proof attachments.
- **Remittance_Status**: One of `pending`, `confirmed`, or `rejected`.
- **Remittance_Attachment**: A proof file (image or PDF) attached to a Remittance and stored in Storage.
- **Audit_Log**: A read-only record of an actor, an action, the affected entity, and before/after state.
- **Organization_Setting**: A key/value or typed configuration for an Organization (for example remittance amount per member, academic year).
- **JWT**: The JSON Web Token issued by Auth_Service and verified by the API on every request.
- **Signed_URL**: A time-limited URL that grants temporary read access to a private Storage object.

## Requirements

### Requirement 1: Authentication

**User Story:** As a student, I want to sign up, log in, and log out with my school email and password, so that my access is tied to my identity.

#### Acceptance Criteria

1. WHEN a student submits a valid school email address and a password of at least 8 characters to the Frontend sign-up form, THE Auth_Service SHALL create a new auth user and a corresponding Student profile.
2. WHEN a student submits valid credentials, THE Frontend SHALL sign the student in via Auth_Service and store the session.
3. WHILE a student is signed in, THE Frontend SHALL include the Auth_Service JWT in every request to the API.
4. WHEN a student clicks log out, THE Frontend SHALL end the Auth_Service session and clear stored session state.
5. IF a student submits an invalid or expired JWT to the API, THEN THE API SHALL reject the request with HTTP 401.
6. THE API SHALL verify the Auth_Service JWT on every request.
7. IF a student submits a school email address that is already registered during sign-up, THEN THE Auth_Service SHALL reject the sign-up and the Frontend SHALL display an error message indicating the email is already registered.
8. IF a student submits invalid login credentials, THEN THE Frontend SHALL display an error message indicating the credentials are invalid and SHALL NOT establish a session.
9. WHEN the API receives a request with a valid Auth_Service JWT, THE API SHALL associate the request with the Student whose identity is encoded in the JWT.

### Requirement 2: Student Profiles

**User Story:** As a student, I want my profile to store my student number, name, email, year level, section, and department, so that my academic identity is known to the System.

#### Acceptance Criteria

1. WHEN a new auth user is created, THE System SHALL create a Student profile linked to that auth user within 3 seconds.
2. IF the Student profile creation fails after the auth user is created, THEN THE System SHALL delete the newly created auth user and return an error indicating profile creation failure.
3. THE Database SHALL store each Student's student number, name, email, year_level_id, section_id, and department_id, where the student number is between 1 and 20 characters, and the name is between 1 and 100 characters.
4. THE Database SHALL enforce that the student number is unique across all Students, rejecting duplicate entries with an error indicating the student number already exists.
5. THE Student profile SHALL reference an auth.users row so that deleting the auth user also removes or invalidates the associated Student profile.
6. WHEN a Student views their own profile, THE Frontend SHALL display the student number, full name, email, year level name, section name, and department name resolved from their respective reference identifiers.
7. IF a Student attempts to view another Student's profile, THEN THE System SHALL deny access and return an error indicating insufficient permissions.

### Requirement 3: Reference Data (Departments, Year Levels, Sections)

**User Story:** As a System administrator, I want reference data for departments, year levels, and sections seeded in the Database, so that Students and Sections can be classified consistently.

#### Acceptance Criteria

1. THE Database SHALL provide a `departments` table, a `year_levels` table, and a `sections` table.
2. THE `sections` table SHALL reference a `department_id` and a `year_level_id` via foreign keys.
3. THE Database SHALL contain seeded reference data including the standard year levels 1st Year through 5th Year, at least one department, and at least one section that references a seeded department and a seeded year level.
4. WHEN a Section is created with a department and a year level that each exist in the Database, THE Database SHALL persist the Section.
5. IF a Section is created without a department or a year level, or with a department or year level that does not exist in the Database, THEN the Database SHALL reject the creation without persisting the Section.

### Requirement 4: Organization Registration

**User Story:** As a signed-in student, I want to register a new Organization, so that I become its first Org Member and can start collecting remittances.

#### Acceptance Criteria

1. WHEN a signed-in student submits an Organization registration with a name between 1 and 100 characters and an optional description of at most 500 characters and an optional department name of at most 100 characters, THE API SHALL create an Organization with status `active` and return a success response.
2. WHEN an Organization is created, THE System SHALL create a Membership record linking the creating Student to the Organization with Role `org_member` and status `active`.
3. THE Database SHALL record `created_by` as the authenticated student's identifier and `created_at` as the UTC timestamp at the moment of creation for each Organization.
4. IF the submitted Organization name is empty or exceeds 100 characters, THEN THE API SHALL reject the request with an error response indicating the name is invalid without creating any Organization or Membership record.
5. IF a signed-in student submits an Organization registration with a name that already exists for that student's account, THEN THE API SHALL reject the request with an error response indicating a duplicate name without creating any Organization or Membership record.
6. THE Frontend SHALL provide a "Register an Organization" form reachable from the My Organizations page containing fields for name, optional description, and optional department, and SHALL prevent submission if the name field is empty.

### Requirement 5: My Organizations and Org Switching

**User Story:** As a student who belongs to several organizations, I want to list my organizations and switch between them, so that I can work in one Organization at a time.

#### Acceptance Criteria

1. WHEN a signed-in student opens the My Organizations page, THE Frontend SHALL list every Organization in which the student has an active Membership.
2. WHEN a student selects an Organization from the My Organizations page, THE Frontend SHALL navigate to that Organization's Org Home route.
3. THE active Organization SHALL be identified by the `orgId` path parameter in the route (for example `/orgs/:orgId/...`).
4. WHEN a student has no active Memberships, THE Frontend SHALL show an empty state guiding the student to register or join an Organization.
5. THE Frontend SHALL provide a "Register Another Org" action on the My Organizations page that navigates the student to the Organization registration form when activated.
6. IF a student navigates to an Organization route with an `orgId` for which the student has no active Membership, THEN THE Frontend SHALL deny access and redirect the student to the My Organizations page.
7. WHEN a student selects an Organization, THE Frontend SHALL set that Organization as the active Organization for all subsequent Organization-scoped navigation until the student selects a different Organization or navigates away.

### Requirement 6: Memberships and Roles

**User Story:** As a student, I want my Role to be scoped per Organization, so that I can be an Org Member in one Organization and a Class Representative in another.

#### Acceptance Criteria

1. THE Database SHALL store Memberships with a student_id, organization_id, role, section_id (nullable), and status, where status is one of `active` or `inactive`.
2. THE Database SHALL enforce that a Student has at most one Membership whose status is `active` per Organization (unique constraint).
3. THE Role SHALL be one of `org_member`, `class_rep`, `class_treasurer`, or `student`.
4. IF a Membership is for a Class Representative or Class Treasurer, THEN THE Database SHALL store the Section that the member is responsible for in the `section_id` column, and `section_id` SHALL NOT be null.
5. IF a Membership is for an Org Member or Regular Student, THEN THE Database SHALL set `section_id` to null.
6. THE API SHALL derive the requesting Student's Role in the active Organization from the Membership table and SHALL ignore any role value supplied by the client.
7. IF a Student does not have a Membership whose status is `active` in the active Organization, THEN THE API SHALL reject access to that Organization's resources with HTTP 403.

### Requirement 7: Authorization by Role

**User Story:** As a platform owner, I want role-based authorization enforced by the API, so that students can only perform actions their Role allows in each Organization.

#### Acceptance Criteria

1. THE API SHALL provide a `requireRole(...)` middleware that checks the requesting Student's Membership Role in the Organization targeted by the request before running an organization-scoped handler.
2. WHILE a student is a Regular Student, THE API SHALL allow read-only access to the dashboard, budget, transaction history, and reports and SHALL deny remittance logging, review, member management, audit, and settings edits.
3. WHILE a student is a Class Representative, THE API SHALL allow logging remittances for the Section linked to that student's Membership and SHALL deny reviewing remittances.
4. WHILE a student is a Class Treasurer, THE API SHALL allow reviewing remittances and SHALL allow read access to audit and settings, and SHALL deny editing of settings.
5. WHILE a student is an Org Member, THE API SHALL allow visibility of all data within their Organization, member management, settings edits, and remittance review.
6. IF a student attempts an action not allowed by their Role, THEN THE API SHALL reject the request with HTTP 403.
7. IF a student has no Membership in the Organization targeted by the request, THEN THE API SHALL reject the request with an error indicating non-membership and the handler SHALL NOT run.

### Requirement 8: Member Management

**User Story:** As an Org Member, I want to view and manage the members of my Organization, so that I can assign roles and see who belongs to the Organization.

#### Acceptance Criteria

1. WHILE a student is an Org Member, THE Frontend SHALL list all active Members of the Organization, displaying each Member's full name, student number, section, year level, and Role.
2. WHILE a student is a Class Representative, THE Frontend SHALL list only the Members whose section matches the Class Representative's own section, displaying each Member's full name, student number, section, year level, and Role.
3. WHEN an Org Member opens a Member record, THE Frontend SHALL display the Member's full name, student number, section, year level, Role, and membership status within 2 seconds of the request.
4. WHEN an Org Member submits a membership change containing a valid Role value and, where a section-scoped Role is selected, a valid section identifier, THE API SHALL update the Membership record to reflect the new Role and section and SHALL write an Audit_Log entry recording the acting Member's identifier, the target Member's identifier, the previous Role, the new Role, and the timestamp of the change.
5. IF a request to perform a membership change is made by a student whose Role is Regular Student or Class Treasurer, THEN THE API SHALL reject the request with HTTP 403 without modifying any Membership record or writing an Audit_Log entry.
6. IF an Org Member submits a membership change containing a Role value that does not exist in the system or a section identifier that does not correspond to an existing section, THEN THE API SHALL reject the request with an error response indicating invalid input without modifying any Membership record.

### Requirement 9: Logging a Remittance

**User Story:** As a Class Representative, I want to log a remittance for my section with amount, date, notes, and proof, so that the collection can be reviewed before it affects the budget.

#### Acceptance Criteria

1. WHILE a student is a Class Representative, THE Frontend SHALL show a "Log a Remittance" action.
2. WHEN a Class Representative submits a remittance with an amount greater than zero, a collection date, notes, and at least one proof attachment, THE API SHALL create a Remittance with status `pending`, the Class Representative's Section, and `submitted_by` set to the requesting Student.
3. THE Database SHALL enforce that a Remittance amount is greater than zero (CHECK constraint).
4. THE Database SHALL store money amounts as NUMERIC(12,2).
5. WHEN a Class Representative submits a Remittance, THE System SHALL NOT modify the Budget (pending remittances do not affect the budget).
6. IF a student who is not a Class Representative for the target Section submits a remittance, THEN THE API SHALL reject the request with HTTP 403.
7. WHEN a Remittance is created, THE System SHALL write an Audit_Log entry that includes a reference to the Remittance, the submitting Student, and the time of creation.
8. IF a Class Representative submits a remittance with a missing or invalid amount, missing date, missing notes, or no proof attachment, THEN THE API SHALL reject the request with an error response indicating which field or fields failed validation and SHALL NOT create a Remittance record.

### Requirement 10: Remittance Attachments and File Storage

**User Story:** As a Class Representative, I want to upload one or more proof files with a remittance, so that reviewers can verify the collection.

#### Acceptance Criteria

1. WHEN a Class Representative uploads a proof file, THE Frontend SHALL show a preview of the selected file before submission.
2. WHEN a Remittance with 1 to 10 attachments is created, THE System SHALL store each attachment in a private Supabase Storage bucket.
3. IF an attachment's MIME type is not one of image/jpeg, image/png, image/webp, or application/pdf, THEN THE API SHALL reject the attachment and SHALL return an error indicating the unsupported file type.
4. IF an attachment's size exceeds 10 MB, THEN THE API SHALL reject the attachment and SHALL return an error indicating the file exceeds the maximum size.
5. WHEN a reviewer requests a proof file, THE API SHALL return a Signed_URL that grants read access to the private Storage object and expires after 1 hour.
6. IF an attachment upload fails, THEN THE API SHALL return an error indicating the upload failure and SHALL not create an incomplete Remittance record.
7. WHEN a Remittance with 1 to 10 attachments is created, THE System SHALL record a `remittance_attachments` row for each attachment containing storage_path, file_name, mime_type, and size.
8. IF a Remittance submission includes more than 10 attachments, THEN THE API SHALL reject the submission and SHALL return an error indicating the maximum attachment count has been exceeded.

### Requirement 11: Viewing Remittances

**User Story:** As an Organization member, I want to view remittances according to my role, so that I see the right scope of data.

#### Acceptance Criteria

1. WHILE a student is an Org Member or Class Treasurer, THE Frontend SHALL list all Remittances for the active Organization.
2. WHILE a student is a Class Representative, THE Frontend SHALL list only the Remittances submitted by that Class Representative.
3. WHILE a student is a Regular Student, THE Frontend SHALL display remittances without showing any remittance creation, editing, deletion, or submission action controls.
4. WHILE a student is a Regular Student, THE Frontend SHALL hide the remittance logging entry controls and the remittance review and confirmation action controls.
5. WHEN a student selects a Remittance_Status filter value, THE Frontend SHALL filter the displayed remittance list to show only remittances matching the selected status, where the selectable values are all, pending, confirmed, and rejected.

### Requirement 12: Remittance Detail

**User Story:** As a reviewer, I want to open a remittance's detail page to see the amount, date, notes, submitter, section, and proof, so that I can decide whether to confirm or reject it.

#### Acceptance Criteria

1. WHEN an authorized user opens a Remittance detail page, THE Frontend SHALL display the amount, section, submitter, collection date, reference, notes, status timeline, and proof attachments such that all listed fields are visible on a single page.
2. WHEN an authorized user requests a proof attachment, THE Frontend SHALL display the attachment content from its Signed_URL in a separate browser view.
3. WHEN an authorized user opens a Remittance detail page, THE Frontend SHALL display a status timeline showing the progression of Remittance_Status values, where each status is one of: submitted, review, added to balance, or rejected.
4. IF the requested Remittance does not exist or cannot be retrieved, THEN THE Frontend SHALL display an error message indicating the remittance is unavailable.
5. IF a proof attachment fails to load because its Signed_URL is expired or invalid, THEN THE Frontend SHALL display an error message indicating the attachment is unavailable.
6. IF a Remittance has no proof attachments, THEN THE Frontend SHALL display an indication that no proof attachments are available.

### Requirement 13: Reviewing a Remittance (Confirm and Reject)

**User Story:** As an Org Member or Class Treasurer, I want to confirm or reject a pending remittance, so that confirmed collections are added to the budget and rejected ones never touch it.

#### Acceptance Criteria

1. WHEN a user with an Org Member or Class Treasurer role navigates to a pending Remittance detail page, THE Frontend SHALL display both a Confirm action and a Reject action.
2. WHEN a reviewer confirms a pending Remittance, THE System SHALL, in a single atomic Database transaction, set the Remittance status to `confirmed`, set `reviewed_by` to the reviewer's user ID and `reviewed_at` to the current timestamp, insert a `transaction_history` row of type `remittance`, and write an Audit_Log entry.
3. IF the atomic transaction in criterion 2 fails for any reason, THEN THE System SHALL roll back all changes, leave the Remittance status as `pending`, and return an error response indicating the confirmation could not be completed.
4. WHEN a reviewer rejects a pending Remittance, THE System SHALL set the Remittance status to `rejected`, set `reviewed_by` to the reviewer's user ID, `reviewed_at` to the current timestamp, and `rejection_reason` to the provided text, write an Audit_Log entry, and SHALL NOT insert a `transaction_history` row.
5. WHEN a reviewer submits a Remittance rejection, THE System SHALL require a `rejection_reason` between 1 and 500 characters in length.
6. IF a reviewer submits a rejection with a `rejection_reason` that is empty or exceeds 500 characters, THEN THE API SHALL reject the request with an error response indicating an invalid rejection reason.
7. IF the reviewer's user ID matches the `submitted_by` field of the Remittance, THEN THE API SHALL reject the review request with an error response indicating self-review is not permitted.
8. IF a reviewer attempts to confirm or reject a Remittance whose status is not `pending`, THEN THE API SHALL reject the request with an error response indicating the Remittance is not in a reviewable state.
9. WHEN a Remittance status is set to `confirmed`, THE Database SHALL enforce immutability by preventing any subsequent update or delete operations on that Remittance record.
10. IF a user with a Class Representative or Regular Student role attempts to confirm or reject a Remittance, THEN THE API SHALL reject the request with an error response indicating insufficient permissions.
11. WHEN a Remittance review action (confirm or reject) completes successfully, THE Frontend SHALL display a confirmation message indicating the outcome to the reviewer within 3 seconds.

### Requirement 14: Budget Computation

**User Story:** As an Organization member, I want to see the current budget and totals, so that I understand the Organization's financial position.

#### Acceptance Criteria

1. THE Budget SHALL be computed as the net sum of all `transaction_history` amounts for the Organization, where `remittance` and `adjustment` entries increase the Budget and `expense` entries decrease the Budget.
2. WHEN a Remittance is confirmed, THE Budget SHALL increase by the Remittance amount.
3. WHEN the dashboard is loaded, THE Frontend SHALL display the current available balance (the Budget), the total of all remittance entries in the transaction_history, the total of all expense entries in the transaction_history, and the count of Remittances with status pending.
4. THE Frontend SHALL format all money values with the peso currency symbol and two decimal places.

### Requirement 15: Transaction History (Ledger)

**User Story:** As an Organization member, I want a read-only, filterable, paginated transaction history, so that I can see every monetary movement in the Organization.

#### Acceptance Criteria

1. THE `transaction_history` table SHALL be append-only; THE System SHALL never execute an operation that updates or deletes an existing ledger row.
2. THE `transaction_history` table SHALL store id, organization_id, type, amount, remittance_id (nullable), description, created_by, and created_at.
3. THE `transaction_history.type` SHALL be one of `remittance`, `expense`, or `adjustment`.
4. WHEN an active member opens the transaction history view, THE Frontend SHALL display the history as a read-only list with no create, edit, or delete controls, sorted by created_at descending by default.
5. WHEN a member applies a date filter using ISO 8601 start and end dates spanning at most 365 days, or a type filter, THE Frontend SHALL request the filtered history from the API.
6. THE API SHALL paginate the transaction history with a maximum of 50 rows per page and SHALL return pagination metadata including current page, page size, total row count, and total page count, sorted by created_at descending by default.
7. IF a filtered query returns zero rows, THEN THE API SHALL return an empty list with a total row count of zero.
8. WHEN a correction to the budget is needed, THE System SHALL insert a new `transaction_history` row of type `adjustment` rather than modifying or deleting an existing row.

### Requirement 16: Reports

**User Story:** As an Organization member, I want reports such as remittances per section, monthly totals, and budget over time, so that I can understand collection and spending trends.

#### Acceptance Criteria

1. WHEN a member opens the Reports page, THE Frontend SHALL display a remittances-per-section chart, a monthly totals chart, and a budget-over-time chart, each populated with data returned from the API.
2. WHILE a member is authenticated and belongs to an active Organization, THE Frontend SHALL display the Reports page and its contents.
3. WHEN a member selects a report type and applies a date range filter of up to 24 months, THE API SHALL return aggregated report data covering only the selected period.
4. THE API SHALL compute all report aggregations server-side and SHALL return them as a structured response containing at minimum: section name, period (month and year), total remittances collected, and total budget allocated per period.
5. WHEN a member requests a CSV export of the currently displayed report, THE API SHALL return a downloadable CSV file containing the same records as the active report view, with one row per data point and column headers matching the report fields.
6. IF the API cannot retrieve report data due to a server or database error, THEN THE Frontend SHALL display an error message indicating that the report could not be loaded and SHALL not display partial or stale data.

### Requirement 17: Audit Log

**User Story:** As an Org Member or Class Treasurer, I want a read-only audit trail, so that I can see who did what and when in the Organization.

#### Acceptance Criteria

1. THE Database SHALL store `audit_logs` with organization_id, actor_id, action, entity_type, entity_id, before/after JSON, and created_at, where the before or after JSON values are null when the action does not produce a prior or resulting entity state.
2. WHEN any of the following actions occurs - remittance created, remittance reviewed, member role changed, organization settings saved, or organization registered - THE System SHALL write an Audit_Log entry.
3. WHERE the authenticated user is an Org Member or a Class Treasurer, THE Frontend SHALL display the Audit Log.
4. THE Audit Log SHALL be read-only; THE API SHALL not expose create, update, or delete endpoints for audit entries to the Frontend.
5. IF the authenticated user is a Class Representative or a Regular Student, THEN THE API SHALL deny access to audit entries with an HTTP 403 response.
6. IF writing an Audit_Log entry fails, THEN THE System SHALL complete the triggering user action without displaying an error to the user.
7. IF the authenticated user is a Class Representative or a Regular Student, THEN THE Frontend SHALL not display the Audit Log.

### Requirement 18: Organization Settings

**User Story:** As an Org Member, I want to configure Organization settings such as the remittance amount per member and academic year, so that collection rules are consistent across the Organization.

#### Acceptance Criteria

1. THE Database SHALL provide an `organization_settings` table keyed by `organization_id` storing at minimum the remittance amount per member (a positive decimal value between 0.01 and 999,999.99) and the academic year (a string in "YYYY-YYYY" format where the second year equals the first year plus one).
2. WHEN an Org Member navigates to the Organization settings page, THE Frontend SHALL display the current settings values in editable input fields.
3. WHEN an Org Member submits settings where the remittance amount is between 0.01 and 999,999.99 and the academic year matches the "YYYY-YYYY" format with consecutive years, THE API SHALL persist the updated settings, return a success response within 3 seconds, and THE Frontend SHALL display a confirmation message indicating the settings were saved successfully.
4. IF an Org Member submits settings where the remittance amount is outside the range 0.01 to 999,999.99 or the academic year does not match the "YYYY-YYYY" consecutive-year format, THEN THE API SHALL reject the request and THE Frontend SHALL display an error message indicating which field failed validation without discarding the submitted values.
5. WHILE a student holds the role of Class Treasurer, Class Representative, or Regular Student, THE Frontend SHALL display Organization settings fields as read-only, disabling all edit controls.
6. IF a Class Treasurer, Class Representative, or Regular Student submits a settings edit request, THEN THE API SHALL deny the request with an HTTP 403 response and SHALL NOT modify the stored settings.
7. WHEN an Org Member successfully saves settings, THE API SHALL write an Audit_Log entry recording the actor's user ID, the previous values, the new values, and the UTC timestamp of the change.

### Requirement 19: API Input Validation

**User Story:** As a platform owner, I want every API input validated server-side, so that malformed or malicious data is rejected before it reaches the Database.

#### Acceptance Criteria

1. THE API SHALL validate every request body, query parameter, and path parameter with a Validator schema.
2. IF a request fails validation, THEN THE API SHALL reject it with HTTP 400 and an error response that identifies the field or fields that failed validation and the type of validation failure, and SHALL NOT write any data to the Database.
3. THE Validator SHALL define schemas for remittance creation, review, member changes, organization registration, and settings.
4. THE API SHALL validate file attachment MIME type and size on the server, rejecting attachments whose MIME type is not an allowed image or PDF type or whose size exceeds the configured maximum, regardless of any Frontend validation.

### Requirement 20: API Error Handling and Response Format

**User Story:** As a developer, I want consistent API errors and status codes, so that the Frontend can handle errors predictably.

#### Acceptance Criteria

1. THE API SHALL use centralized error-handling middleware that produces, for every error, a JSON response containing the HTTP status code and a message, with a structure identical across all error types.
2. WHEN validation fails, THE API SHALL return HTTP 400 with an error response that identifies the field or fields that failed validation.
3. WHEN a user is unauthenticated, THE API SHALL return HTTP 401.
4. WHEN a user is forbidden from an action, THE API SHALL return HTTP 403.
5. WHEN a resource is not found, THE API SHALL return HTTP 404.
6. WHEN a request conflicts with current state (for example reviewing a non-pending remittance), THE API SHALL return HTTP 409.
7. WHEN an unexpected error occurs, THE API SHALL return HTTP 500 with the consistent error response shape and without exposing stack traces or internal system error messages.

### Requirement 21: Frontend Route Guards and Action Visibility

**User Story:** As a student, I want the Frontend to hide and block actions I am not allowed to perform, so that I cannot accidentally trigger forbidden operations.

#### Acceptance Criteria

1. WHEN an unauthenticated student tries to reach a protected route (such as the My Organizations page or any `/orgs/:orgId/` route), THE Frontend SHALL redirect to the Log In page.
2. WHEN a student tries to reach an Organization route for which the student has no active Membership, THE Frontend SHALL redirect the student to the My Organizations page.
3. WHILE a student's Role is not `class_rep`, THE Frontend SHALL not render the "Log a Remittance" action.
4. WHILE a student's Role is `class_rep` or `student`, THE Frontend SHALL not render the Confirm and Reject actions.
5. WHILE the Frontend is fetching the current user's Role from the API, THE Frontend SHALL not render any role-restricted action controls until the Role is determined.
6. WHEN the Frontend receives the current Role from the API, THE Frontend SHALL use only the API-returned Role value to determine which actions to display.

### Requirement 22: Frontend Loading, Empty, and Error States

**User Story:** As a student, I want clear loading, empty, and error states, so that the app is usable while data loads or when something goes wrong.

#### Acceptance Criteria

1. WHILE a data fetch is in progress, THE Frontend SHALL show a loading indicator in the content area and SHALL not display stale or partial data from a previous fetch.
2. WHEN a data fetch completes successfully and the returned list contains no items, THE Frontend SHALL show an empty state with a message explaining why the list is empty.
3. WHEN a data fetch fails, THE Frontend SHALL show an error state containing both an error indication and a retry action that re-requests the same data, and the page SHALL not appear crashed or blank.
4. WHEN a destructive action (confirm or reject) is triggered, THE Frontend SHALL show a confirmation dialog that offers both a confirm and a cancel option, and the destructive action SHALL not proceed until the user confirms.

### Requirement 23: Frontend Responsiveness

**User Story:** As a student who mostly uses a phone, I want a responsive, mobile-friendly interface, so that I can use the app comfortably on any device.

#### Acceptance Criteria

1. THE Frontend SHALL reflow all content to fit within the viewport width without horizontal scrolling at mobile (viewport widths less than 768 pixels), tablet (viewport widths 768 to 1023 pixels), and desktop (viewport widths 1024 pixels or greater) widths.
2. WHILE the viewport is in the mobile width range (less than 768 pixels), THE Frontend SHALL display a bottom navigation bar or drawer containing links to the primary destinations: Dashboard, Remittances, Members, History, Reports, Audit, and Settings.
3. WHILE the viewport is in the desktop width range (1024 pixels or greater), THE Frontend SHALL display a sidebar navigation containing links to the primary destinations: Dashboard, Remittances, Members, History, Reports, Audit, and Settings.
4. WHILE the viewport is in the tablet width range (768 to 1023 pixels), THE Frontend SHALL display a consistent primary navigation - either the bottom navigation or the sidebar navigation - across all primary destinations.
5. THE Frontend SHALL present each primary destination - Dashboard, Remittances, Members, History, Reports, Audit, and Settings - with the same screen layout structure, component arrangement, and navigation hierarchy as the corresponding screen in the figma-make prototype.

### Requirement 24: Non-Functional: Money and Ledger Integrity

**User Story:** As a platform owner, I want money handled precisely and the ledger kept immutable, so that financial data is accurate and auditable.

#### Acceptance Criteria

1. THE Database SHALL store every monetary amount as NUMERIC(12,2).
2. THE System SHALL never store or compute money using floating-point arithmetic.
3. THE `transaction_history` ledger SHALL be append-only; no operation SHALL update or delete an existing ledger row.
4. WHEN a budget correction is submitted, THE System SHALL insert a new `transaction_history` row of type `adjustment` and SHALL not modify or delete any existing ledger row.
5. THE Budget SHALL change only when a new `transaction_history` row is appended to the ledger.

### Requirement 25: Non-Functional: Security and Configuration

**User Story:** As a platform owner, I want secrets protected and defense-in-depth enforced, so that the platform is secure by default.

#### Acceptance Criteria

1. THE System SHALL read Supabase URL and keys from environment variables.
2. THE API SHALL use the Supabase service-role key only within server-side code.
3. THE Frontend SHALL only use the Supabase publishable (anon) key.
4. THE Database SHALL enable Row Level Security on all tables as defense in depth.
5. THE API SHALL enforce authorization checks before performing any data access or modification operation on behalf of a Frontend request.
6. THE API SHALL NOT include the Supabase service-role key in any response sent to the Frontend, including error messages and diagnostic output.
7. IF required Supabase environment variables are not set at System startup, THEN THE System SHALL fail to start and SHALL emit an error indicating the missing configuration.

### Requirement 26: Database Schema and Migrations

**User Story:** As a developer, I want a versioned SQL schema with migrations, foreign keys, indexes, and constraints, so that the Database is consistent and reproducible.

#### Acceptance Criteria

1. THE Database SHALL be provisioned with SQL migrations (not manual clicks in the Supabase dashboard), where migrations are sequentially applied, version-numbered, and produce an identical schema on a fresh instance.
2. THE Database SHALL define the `students`, `organizations`, `departments`, `year_levels`, `sections`, `transaction_history`, `memberships`, `remittances`, `remittance_attachments`, `audit_logs`, and `organization_settings` tables.
3. THE Database SHALL define foreign keys relating sections to departments and year levels, students to sections, memberships to students and organizations, remittances to organizations and sections, and attachments to remittances.
4. THE Database SHALL define indexes on foreign keys and on columns used for filtering (for example remittances by organization_id and status).
5. THE Database SHALL enforce unique constraints (for example one active membership per student per org, unique student number).
6. THE Database SHALL enforce CHECK constraints where monetary amount columns in `transaction_history` and `remittances` must be greater than zero.
7. THE Database SHALL define RLS policies on all tables that restrict access based on the authenticated user's role and organizational membership.
8. IF a migration fails, THEN THE Database SHALL halt the migration sequence, preserve all previously applied migrations, and skip all subsequent migration files.

### Requirement 27: Testing

**User Story:** As a developer, I want automated tests for authorization and the remittance-confirmation transaction, so that the core rules do not regress.

#### Acceptance Criteria

1. THE System SHALL include a test suite that, for each of the four Roles (`org_member`, `class_rep`, `class_treasurer`, `student`), asserts that the Role's allowed actions return a success response and that actions denied to that Role are rejected with HTTP 403.
2. WHEN a reviewer confirms a pending Remittance, THE System SHALL include a test that verifies exactly one `transaction_history` row and exactly one Audit_Log entry are inserted atomically, such that both rows persist together or neither persists.
3. IF a reviewer attempts to review a Remittance that the same reviewer submitted, THEN THE System SHALL include a test that verifies the API rejects the review request with HTTP 403.
4. WHEN a reviewer rejects a pending Remittance, THE System SHALL include a test that verifies no `transaction_history` row is inserted and the Budget total remains unchanged from its value before the rejection.
5. WHILE a Remittance has status `confirmed`, THE System SHALL include a test that verifies the Remittance's amount, status, and reviewed_by fields cannot be modified and the Remittance record cannot be deleted.
