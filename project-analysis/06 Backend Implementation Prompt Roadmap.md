# Backend Implementation Prompt Roadmap

## Goal

Convert the Backend Improvement Plan and the completed backend audit reports into a precise, safe, step-by-step Cline implementation roadmap.

The objective is to improve the existing backend without unnecessary rewrites, API breakage, over-engineering, or unrelated changes.

Each implementation prompt must represent one meaningful, isolated task that can be:

1. Inspected before modification.
2. Implemented independently.
3. Validated with appropriate commands.
4. Reviewed through Git diff.
5. Committed separately.
6. Safely rolled back if necessary.

This roadmap is based on the existing backend architecture and must preserve the current application behavior unless a change is explicitly required.

---

# Important Implementation Rules

## Rule 1: Inspect Before Changing

Cline must inspect the current implementation before modifying any file.

Do not assume that an issue described in an audit still exists.

If an audit recommendation conflicts with the current code, current dependencies, or current API behavior, stop and report the conflict before making the change.

---

## Rule 2: Do Not Rewrite the Architecture

Preserve the existing architecture:

```text
src/
  configs/
  assets/
  modules/
  middlewares/
  errorHelper/
  utils/
  routes/
  app.ts
  server.ts
```

Do not migrate to another framework, ORM, authentication system, or application architecture.

Do not introduce unnecessary abstraction layers.

---

## Rule 3: Preserve Existing API Contracts

The existing frontend consumes this backend.

Before changing any:

- route
- request field
- response field
- pagination behavior
- authentication behavior
- cookie behavior
- error response
- upload behavior

Cline must inspect the current frontend/backend relationship when relevant.

Do not make breaking API changes unless the change is explicitly approved and all affected consumers are updated.

---

## Rule 4: Do Not Rename Public API Fields Without a Migration Plan

Internal code and Prisma naming may be improved where safe.

However, fields such as:

```text
descreption
avater
```

must not automatically be renamed in the public API.

If a field is currently consumed by the frontend, preserve the API field unless a compatibility layer or coordinated migration is implemented.

Internal Prisma/model/function naming can be cleaned separately from public API contracts.

---

## Rule 5: Do Not Add Dependencies Without Justification

Before installing a package:

1. Check whether the project already has an equivalent capability.
2. Check whether Bun already provides the required functionality.
3. Confirm that the dependency is actually required.
4. Prefer the smallest appropriate dependency.

Do not add Redis, Jest, logging systems, rate limiting, caching, or other infrastructure merely because they are commonly used.

---

## Rule 6: No Unnecessary Database Changes

Database migrations must only be created when there is a demonstrated need.

Do not rename Prisma models or fields simply because their spelling is imperfect.

Before every migration:

1. Inspect the current Prisma schema.
2. Inspect affected services/controllers.
3. Inspect API consumers if relevant.
4. Determine whether existing database data is affected.
5. Determine whether the migration is backward compatible.
6. Show the migration plan before applying destructive or potentially breaking changes.

---

## Rule 7: Never Expose Secrets

Never print the contents of:

```text
.env.dev
.env
.env.local
```

or any other secret-bearing file.

Do not place credentials in:

- source code
- README
- documentation
- Git commits
- Dockerfiles
- Docker Compose files
- audit reports

If an exposed secret is discovered, report it as exposed and require rotation.

---

## Rule 8: One Prompt, One Commit

Each implementation prompt should end with:

1. Validation.
2. Git diff review.
3. Git status review.
4. A concise implementation summary.
5. A separate Git commit.

Do not combine unrelated implementation prompts into one commit.

Do not use:

```bash
git add .
```

when sensitive or unrelated files may exist.

Stage only the files belonging to the current task.

---

# Recommended Implementation Prompts

## Total: 12 Implementation Prompts

```text
Prompt 01 → Prompt 02 → Prompt 03 → Prompt 04
                         ↓
                  Prompt 05 → Prompt 06
                         ↓
                  Prompt 07 → Prompt 08
                         ↓
                  Prompt 09 → Prompt 10
                         ↓
                  Prompt 11 → Prompt 12
```

Some prompts can be executed independently after their prerequisites are satisfied.

The exact number is intentionally smaller than the original draft because several original prompts contained overlapping work or unnecessary infrastructure.

---

# Prompt 01: Secure Environment and Git Cleanup

## Purpose

Remove tracked development secrets from the repository and establish safe environment configuration.

This is the highest-priority security task.

## Important

Do not print the contents of `.env.dev`.

Do not expose existing credentials in the Cline response.

## Tasks

1. Inspect Git tracking status for `.env.dev`.
2. Confirm whether `.env.dev` is currently tracked.
3. Add `.env.dev` to `.gitignore`.
4. Remove `.env.dev` from Git tracking if it is tracked:

```bash
git rm --cached .env.dev
```

5. Create `.env.example`.
6. Include only environment variable names and safe descriptions.
7. Do not include real values.
8. Verify `.env.dev` is no longer tracked.
9. Check whether secrets were previously committed.
10. Report whether credential rotation is required.

## Important Git History Requirement

Removing a file from the current Git tree does not automatically remove previously committed secrets from Git history.

If credentials were previously committed or pushed:

- Treat them as exposed.
- Recommend rotating them.
- Do not attempt destructive Git history rewriting automatically.
- Do not force-push.
- Do not rewrite remote history without explicit approval.

## Files Allowed

```text
.gitignore
.env.example
```

Potential Git index change:

```text
.env.dev
```

## Files to Avoid

```text
src/**
package.json
prisma/**
Dockerfile
```

unless required only for verification.

## Database

No migration.

## API

No change.

## Security Impact

High. This mitigates credential leakage.

## Validation

Verify:

```bash
git ls-files .env.dev
```

returns nothing.

Verify `.gitignore` contains:

```text
.env.dev
```

Verify `.env.example` contains all required variables without values.

## Completion Criteria

- `.env.dev` is not tracked.
- `.env.dev` is ignored.
- `.env.example` exists.
- No secrets were added to the repository.
- No application behavior changed.

## Commit

```text
security: remove tracked development environment secrets
```

---

# Prompt 02: Environment Validation and Type Safety

## Purpose

Make environment configuration explicit, validated, and type-safe.

## Tasks

1. Inspect the current `src/configs/envVars.ts`.
2. Inspect `package.json` to determine whether Zod is already installed.
3. If Zod is not installed, install it.
4. Create a Zod environment schema.
5. Validate required environment variables at startup.
6. Replace unnecessary `as string` assertions where appropriate.
7. Fix naming typos in the environment configuration module.
8. Preserve the existing environment variable names.
9. Preserve current runtime behavior for valid environments.
10. Produce clear startup errors for missing or invalid variables.

## Important

Do not rename environment variables without a migration plan.

Do not expose environment values in error messages.

## Files

Primary:

```text
src/configs/envVars.ts
package.json
bun.lock
```

## Database

No migration.

## API

No API change.

## Validation

Run:

```bash
bun run build
bun run lint
```

If a type-check script exists, run it.

Also verify the server starts correctly with valid environment variables.

Test at least one missing required variable in a safe environment without exposing its value.

## Completion Criteria

- Environment variables are validated at startup.
- Invalid configuration fails clearly.
- Valid configuration continues to work.
- No secrets are printed.
- Existing environment variable names remain unchanged.

## Commit

```text
refactor: validate environment configuration
```

---

# Prompt 03: Safe Internal Naming Cleanup

## Purpose

Clean obvious internal naming errors without breaking the public API or database unnecessarily.

## Tasks

First inspect all usages of:

```text
WorkExperince
sendResonse
orderFeild
```

Also inspect:

```text
avater
descreption
```

and determine whether each is:

1. Internal only.
2. Prisma/database-facing.
3. Public API-facing.
4. Frontend-facing.

## Rules

### Internal-only names

Safe to rename if all references can be updated.

Examples:

```text
sendResonse → sendResponse
orderFeild → orderField
```

### Public API fields

Do not rename automatically.

For example:

```text
descreption
avater
```

must remain compatible if the frontend currently depends on them.

### Prisma model names

Do not create a database migration merely to correct spelling unless there is a clear benefit and the migration is demonstrated to be safe.

If a Prisma model name can be corrected without changing the physical database structure, prefer the least disruptive approach.

## Slug Logic

Inspect existing slug validation and generation.

Only extract duplicate logic into:

```text
src/utils/slug.ts
```

if genuine duplication exists.

Do not create an abstraction merely for the sake of refactoring.

## Database

Migration required:

```text
ONLY IF ACTUALLY REQUIRED
```

Do not automatically create a migration.

## API

Must remain backward compatible.

## Validation

Run:

```bash
bun run build
bun run lint
bunx prisma generate
```

If tests already exist, run them.

## Completion Criteria

- Internal naming errors are corrected where safe.
- No unnecessary database migration is introduced.
- Public API compatibility is preserved.
- Build succeeds.
- Prisma client generation succeeds.
- Duplicate slug logic is removed only where justified.

## Commit

```text
refactor: clean internal naming and shared slug logic
```

---

# Prompt 04: Authentication and Authorization Hardening

## Purpose

Audit and harden the existing JWT, cookie, and authorization implementation without replacing the authentication architecture.

## Tasks

1. Inspect the existing authentication flow.
2. Inspect access token and refresh token handling.
3. Inspect cookie configuration.
4. Inspect authentication middleware.
5. Inspect mutation routes.
6. Identify missing authorization/ownership checks.
7. Add ownership checks only where required.
8. Verify cookie security settings for production.
9. Preserve development usability.
10. Determine whether authentication endpoint rate limiting is actually required.

## Cookie Requirements

Use appropriate:

```text
httpOnly
secure
sameSite
```

settings based on the existing frontend/backend deployment architecture.

Do not blindly force `sameSite: strict` if doing so breaks the legitimate cross-origin frontend/backend authentication flow.

## Rate Limiting

Only add `express-rate-limit` if the audit confirms that current authentication endpoints need it and the implementation is compatible with the deployment environment.

Do not add rate limiting to every endpoint.

## Do Not

- Replace JWT with another authentication library.
- Replace custom authentication with NextAuth.
- Change token format unnecessarily.
- Change cookie names unnecessarily.
- Change response shapes unnecessarily.

## Validation

Test:

- successful login
- invalid credentials
- authenticated request
- unauthenticated request
- unauthorized mutation
- authorized mutation
- cookie attributes
- existing refresh behavior if implemented

## Completion Criteria

- Existing authentication still works.
- Unauthorized mutations are rejected.
- Ownership checks exist where required.
- Cookie security is appropriate for the actual deployment.
- No unnecessary authentication rewrite occurred.

## Commit

```text
security: harden authentication and authorization
```

---

# Prompt 05: File Upload Security

## Purpose

Harden Multer and Cloudinary upload handling while preserving existing upload functionality.

## Tasks

1. Inspect the current Multer configuration.
2. Inspect Cloudinary configuration.
3. Verify current maximum file size.
4. Verify allowed MIME types.
5. Add explicit MIME-type validation if missing.
6. Ensure the 10 MB limit is enforced.
7. Inspect Cloudinary folder naming.

## Cloudinary Folder Naming

Do not blindly rename:

```text
porfolio
```

to:

```text
portfolio
```

if existing uploaded assets depend on the old Cloudinary path.

Determine whether the spelling is only a configuration label for new uploads or whether changing it would affect existing resources.

Only change it if safe.

## Validation

Test:

- valid image upload
- unsupported MIME type
- file larger than 10 MB
- missing file
- multiple file behavior if supported

## Completion Criteria

- Unsupported files are rejected.
- 10 MB limit is enforced.
- Existing uploads remain accessible.
- No unnecessary Cloudinary migration occurs.

## Commit

```text
security: harden file upload validation
```

---

# Prompt 06: Rich Text Support and Sanitization

## Purpose

Prepare the backend safely for rich text content used by the portfolio dashboard.

Potential rich text fields include:

- Blog content
- Project description
- Work experience description

The exact fields must be confirmed from the current implementation before changing anything.

## Tasks

1. Inspect current schemas and interfaces.
2. Determine which fields will contain rich text.
3. Preserve the existing storage type unless a migration is explicitly justified.
4. Install an appropriate server-side HTML sanitizer if sanitization is required.
5. Create a reusable sanitization utility rather than duplicating sanitization code.
6. Sanitize rich text before storage or at the appropriate trust boundary.
7. Define an explicit allowed HTML tag and attribute policy.
8. Ensure unsafe URLs and script-capable content cannot pass through.
9. Preserve ordinary formatting such as:
   - paragraphs
   - headings
   - bold
   - italic
   - lists
   - links
   - blockquotes
     as appropriate for the selected editor.

## Important

Do not introduce `dangerouslySetInnerHTML` into the backend.

Do not change database content from string to JSON unless the current application requires that migration.

Do not add Tiptap to the backend if it belongs in the frontend/dashboard layer.

## Validation

Create tests for malicious HTML examples including:

- script tags
- event handler attributes
- unsafe URLs
- iframe/object/embed content
- normal formatting

Verify legitimate rich text remains intact.

## Completion Criteria

- Rich text fields are identified.
- Sanitization is centralized.
- Unsafe HTML is removed.
- Legitimate formatting survives.
- No unnecessary database migration occurs.

## Commit

```text
security: sanitize rich text content
```

---

# Prompt 07: Database and Query Optimization

## Purpose

Improve database performance only where the current schema and query patterns justify it.

## Tasks

1. Inspect Prisma schema relationships.
2. Identify frequently filtered or joined fields.
3. Check whether indexes already exist.
4. Add indexes only where query patterns justify them.
5. Inspect blog pagination.
6. Determine whether current `skip/take` pagination is actually a performance problem.
7. Do not replace pagination automatically.
8. Inspect list queries for unnecessary fields.
9. Add explicit `select` only where it improves query efficiency or reduces sensitive/unnecessary data exposure.

## Important

Do not assume that:

```text
authorId
userId
```

automatically require indexes on every model.

Indexes must correspond to actual query patterns.

## Pagination

Cursor pagination should only be introduced if:

- the current endpoint has a real scaling concern,
- the cursor design fits the existing API,
- frontend compatibility is preserved,
- ordering is deterministic.

If cursor pagination would unnecessarily change the API contract, keep the existing pagination.

## Database

Migration required only if indexes are actually added.

## Validation

Run:

```bash
bunx prisma generate
```

If a migration is required, inspect it before applying it.

Test existing list endpoints and pagination behavior.

## Completion Criteria

- Only justified indexes are added.
- Existing API pagination remains compatible unless explicitly migrated.
- Queries return the same expected data.
- No unnecessary database changes are introduced.

## Commit

```text
perf: optimize justified database queries
```

---

# Prompt 08: Testing Infrastructure

## Purpose

Introduce a practical automated testing foundation for the existing backend.

## Tasks

1. Inspect current `package.json`.
2. Check whether a test framework already exists.
3. Check Bun's current native testing capabilities.
4. Choose the smallest appropriate testing setup.
5. Do not install Jest automatically if Bun's native test runner is sufficient.
6. Add test scripts.
7. Create an appropriate test directory.
8. Add tests for:
   - environment validation
   - request validation
   - authentication behavior
   - authorization behavior
   - rich text sanitization
   - important utility functions

## Do Not

- Build a huge test framework.
- Add integration infrastructure that is not required.
- Require Redis or external services merely to run unit tests.
- Change application architecture for testing.

## Validation

Run the test suite.

Run:

```bash
bun run build
bun run lint
```

## Completion Criteria

- Tests run consistently.
- Important security behavior has automated coverage.
- Existing application behavior remains intact.

## Commit

```text
test: add backend testing foundation
```

---

# Prompt 09: Production Readiness

## Purpose

Add small, high-value production-readiness improvements.

## Tasks

1. Inspect current server startup.
2. Add a health endpoint if one does not already exist.
3. Determine whether the health endpoint should include database connectivity.
4. Implement graceful shutdown.
5. Close database connections during shutdown.
6. Close other resources if the application creates any.
7. Inspect whether security headers are already present.
8. Add Helmet only if appropriate and compatible with the existing application.

## Health Endpoint

A suitable endpoint may be:

```text
GET /health
```

The response must not expose:

- credentials
- environment values
- internal stack traces
- database connection strings

## Graceful Shutdown

Handle:

```text
SIGTERM
SIGINT
```

without unnecessarily changing normal startup behavior.

## Validation

Verify:

- health endpoint
- server startup
- server shutdown
- database disconnect behavior
- build
- lint
- tests

## Completion Criteria

- Health endpoint works.
- Graceful shutdown works.
- Security headers are appropriate.
- No existing API behavior is broken.

## Commit

```text
feat: improve production readiness
```

---

# Prompt 10: Docker Configuration and Verification

## Purpose

Bring the Docker configuration to a clean, reproducible state.

## Important Existing Context

Docker has already been installed and verified on the development machine.

Docker functionality must not be rebuilt from scratch if working configuration already exists.

First inspect:

```text
Dockerfile
.dockerignore
docker-compose.yml
```

and the current Git diff.

## Tasks

1. Inspect the existing Dockerfile.
2. Inspect `.dockerignore`.
3. Determine whether the existing Dockerfile already builds successfully.
4. Preserve working configuration where possible.
5. Use an appropriate Bun base image if a change is actually required.
6. Ensure secrets are not copied into the image.
7. Ensure `.env.dev` is excluded.
8. Ensure the production image contains only required runtime files.
9. Add Docker Compose only if it provides genuine local development value.
10. Do not add unnecessary PostgreSQL or Redis containers if the project uses an external database or does not require them locally.

## Validation

Run:

```bash
docker build -t myportfolio-backend:latest .
```

If Compose exists and is relevant:

```bash
docker compose config
docker compose up
```

Verify the API is reachable.

## Completion Criteria

- Docker build succeeds.
- Secrets are excluded.
- Existing local development behavior remains usable.
- Docker configuration is minimal and reproducible.

## Commit

```text
build: finalize backend Docker configuration
```

---

# Prompt 11: Documentation

## Purpose

Update developer documentation after the implementation work is stable.

## Tasks

Update:

```text
README.md
```

and create:

```text
CONTRIBUTING.md
```

Document:

- project setup
- required environment variables
- local development
- database setup
- Prisma commands
- testing
- linting
- Docker usage
- API base path
- authentication overview
- upload behavior
- rich text expectations
- deployment considerations

## Security

Never place real credentials in documentation.

Use `.env.example` references.

## Important

Documentation must describe the actual final implementation.

Do not document features that were not implemented.

## Validation

Check every command documented in README for correctness.

## Completion Criteria

- README reflects the actual project.
- Environment setup is documented.
- Docker setup is documented.
- Testing is documented.
- No secrets are exposed.

## Commit

```text
docs: update backend development documentation
```

---

# Prompt 12: Final Integration, Security, and Git Review

## Purpose

Perform the final verification of the entire backend after all implementation prompts are complete.

This prompt must not introduce new features.

## Tasks

### 1. Build

Run:

```bash
bun run build
```

### 2. Lint

Run:

```bash
bun run lint
```

### 3. Tests

Run the complete test suite.

### 4. Prisma

Run:

```bash
bunx prisma generate
```

Verify migrations are consistent if migrations were created.

### 5. API Compatibility

Verify existing endpoints:

```text
/api/v1/users
/api/v1/auth
/api/v1/projects
/api/v1/work-experience
/api/v1/blogs
```

Check:

- response shapes
- authentication
- authorization
- validation
- uploads
- pagination
- error handling

### 6. Docker

Verify the final Docker build.

### 7. Security Review

Check for:

- tracked `.env.dev`
- exposed secrets
- unsafe logging
- insecure cookies
- missing authorization checks
- unsafe rich text
- unrestricted uploads
- accidental debug output

### 8. Git Review

Run:

```bash
git status
git diff --check
git diff
```

Review all changed files.

Do not stage unrelated files.

Do not automatically use:

```bash
git add .
```

## Stop Conditions

Stop immediately if:

- tests fail unexpectedly
- build fails
- Prisma migration fails
- API response shapes changed unexpectedly
- authentication breaks
- secrets appear in Git
- large unexplained diffs appear
- Docker build fails unexpectedly
- frontend compatibility is uncertain

## Completion Criteria

All of the following must be true:

- Build passes.
- Lint passes.
- Tests pass.
- Prisma generation succeeds.
- Docker build succeeds.
- No secrets are tracked.
- No unexplained files changed.
- Existing API behavior remains compatible.
- Security improvements are verified.
- Documentation reflects the final implementation.

Do not create a final commit automatically if unresolved problems remain.

---

# Implementation Dependency Order

## Required sequence

```text
01 Secure Environment
        ↓
02 Environment Validation
        ↓
03 Safe Internal Naming
        ↓
04 Authentication Hardening
        ↓
05 File Upload Security
        ↓
06 Rich Text Sanitization
        ↓
07 Database Optimization
        ↓
08 Testing Infrastructure
        ↓
09 Production Readiness
        ↓
10 Docker
        ↓
11 Documentation
        ↓
12 Final Validation
```

This sequence minimizes the chance of implementing later changes on top of an insecure or unstable configuration.

---

# Required vs Conditional Work

## Required

The following should normally be completed:

```text
01 Secure Environment
02 Environment Validation
04 Authentication Hardening
05 File Upload Security
06 Rich Text Sanitization
08 Testing Infrastructure
09 Production Readiness
12 Final Validation
```

## Conditional

These should only be implemented when the current code justifies them:

```text
03 Internal Naming Cleanup
07 Database Optimization
10 Docker improvements
```

## Optional

These are not required unless there is a demonstrated need:

```text
Redis caching
Advanced monitoring
Distributed caching
Complex logging infrastructure
Large-scale pagination redesign
Major database refactoring
```

---

# Database Migration Policy

Before creating any Prisma migration, Cline must answer:

1. Why is the migration necessary?
2. Which database objects change?
3. Does existing data change?
4. Does the API change?
5. Does the frontend need changes?
6. Is the migration backward compatible?
7. Can the change be implemented without migration?

If the answer to any of these is uncertain, stop and report the uncertainty before applying the migration.

---

# API Compatibility Policy

The following must remain stable unless explicitly approved:

```text
Route paths
HTTP methods
Request field names
Response field names
Authentication behavior
Cookie names
Error response structure
Existing upload behavior
Existing frontend-facing pagination behavior
```

Internal refactoring is preferred over public contract changes.

---

# Git Commit Strategy

Create one commit after each successfully completed implementation prompt.

Suggested commits:

```text
security: remove tracked development environment secrets

refactor: validate environment configuration

refactor: clean internal naming and shared slug logic

security: harden authentication and authorization

security: harden file upload validation

security: sanitize rich text content

perf: optimize justified database queries

test: add backend testing foundation

feat: improve production readiness

build: finalize backend Docker configuration

docs: update backend development documentation
```

Final validation does not require a separate commit unless it changes files.

---

# Cline Behavior Requirements

For every implementation prompt:

1. Read the relevant existing files.
2. Do not modify unrelated files.
3. Do not blindly follow an audit recommendation if the current implementation already solves the issue.
4. Explain any conflict with the audit reports.
5. Make the smallest safe change.
6. Run relevant validation commands.
7. Inspect the resulting Git diff.
8. Check Git status.
9. Report exactly what changed.
10. Report what was tested.
11. Report any remaining risks.
12. Create the task-specific Git commit only after validation succeeds.
13. Stop after completing the requested task.

Do not continue into the next prompt automatically.

---

# Things Cline Must Not Do

Do not:

- rewrite the entire backend
- migrate Express to another framework
- replace Prisma
- replace JWT authentication
- introduce NextAuth
- introduce Redis without justification
- rename public API fields without compatibility planning
- change database models merely to fix spelling
- rewrite Git history automatically
- force-push
- expose `.env.dev`
- print secrets
- change unrelated frontend code
- modify unrelated backend modules
- upgrade every dependency unnecessarily
- add unnecessary abstractions
- add unnecessary microservices
- add unnecessary Docker services
- change API response formats without approval
- create speculative features
- automatically create database migrations
- automatically replace pagination with cursor pagination
- automatically install Jest when the existing Bun testing capabilities are sufficient

---

# Final Success Criteria

The backend improvement work is complete when:

- Environment secrets are secured.
- Environment configuration is validated.
- Authentication and authorization are appropriately hardened.
- File uploads are validated.
- Rich text is safely handled.
- Database improvements are justified and tested.
- Automated tests exist for important behavior.
- Production readiness improvements are implemented where useful.
- Docker configuration is reproducible.
- Documentation matches the actual system.
- The existing frontend remains compatible.
- Build, lint, tests, Prisma generation, and Docker validation succeed.
- Git contains no unintended files or secrets.

---

# Final Report Metadata

Report Name:

```text
06 Backend Implementation Prompt Roadmap
```

Purpose:

```text
Step-by-step implementation roadmap for the existing backend.
```

Recommended Implementation Prompts:

```text
12
```

Audit Reports Used:

```text
01 Backend Docker and Environment Audit
02 Backend Reconnaissance Report
03 Backend Security and API Audit
04 Backend Code Quality Performance and Testing Audit
05 Backend Improvement Plan
```

Implementation Strategy:

```text
One meaningful task per prompt.
One validation cycle per prompt.
One Git commit per completed prompt.
```

Database Changes:

```text
Conditional.
No migration should be created unless justified.
```

API Breaking Changes:

```text
Not permitted by default.
```

Docker:

```text
Existing Docker work must be inspected and reused where appropriate.
```

Secrets:

```text
Must never be exposed or committed.
```

Final Validation:

```text
Required before considering the backend improvement work complete.
```
