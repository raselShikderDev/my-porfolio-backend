---
name: security-rules
---

# Security Rules for Project Backend

## Core Security Principles

1. **No Unauthorized Deletion:**
   - **Files:** No file deletion commands will be executed without explicit user approval.
   - **Database:** No database truncation, reset, or destructive operations will be performed without explicit user approval.

2. **Environment Protection:**
   - Environment variables are validated at startup and must be explicitly provided in `.env.local`.
   - Secrets are never exposed in code or logs.

3. **Authentication:**
   - JWT-based authentication with dual-token system (access + refresh tokens).
   - HTTP-only cookies prevent token theft via XSS.
   - Role-based authorization ensures only authorized users can access protected routes.

4. **Data Integrity:**
   - Database schema changes require explicit migration approval.
   - File uploads are sanitized and validated before processing.

5. **Error Handling:**
   - Errors are handled gracefully without exposing sensitive information.
   - All error responses use standardized `AppError` instances.

## Existing Security Measures

- **File Uploads:**
  - Cloudinary integration with strict MIME type and size limits (10MB max, 10 files per request).
  - Unique filenames with random prefixes to prevent collisions.

- **Database:**
  - Prisma ORM with strict schema validation.
  - Enums for `User.isActive` and `User.role` to prevent invalid states.

- **Codebase:**
  - TypeScript with strict mode enabled.
  - ESLint and Prettier for consistent code formatting.
  - No hardcoded secrets or sensitive data.

- **MCP:**
  - Filesystem server configured to allow access to project directory only.
  - No destructive operations allowed without explicit user approval.

## Enforcement

- **Before any destructive operation:**
  - Claude Code will ask for explicit user approval.
  - All database operations require user confirmation.
  - File deletions are blocked unless explicitly allowed.

- **Verification:**
  - All changes are verified before execution.
  - No changes are made without evidence of user intent.

[[mcp-configuration]] [[claude-md]]