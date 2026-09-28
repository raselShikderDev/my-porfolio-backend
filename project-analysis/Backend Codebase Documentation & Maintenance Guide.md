# Backend Codebase Documentation & Maintenance Guide

## 1. Document Purpose

This document is the primary technical handover and maintenance guide for the **myPortfolio-backend** repository.

It is intended to help developers understand the backend architecture, implementation, security measures, testing, deployment configuration, maintenance considerations, and future improvement opportunities without needing to inspect the entire codebase first.

**Current documented branch:** `v2`  
**Current documented commit:** `2b1ffb3`

This document describes the implementation that was verified during the backend improvement work. Where a capability is not implemented or could not be verified, it is clearly identified as a future improvement or not verified.

---

# 2. Project Overview

The backend powers the **myPortfolio** application.

It provides a REST API for:

- Authentication and authorization.
- User and owner management.
- Project management.
- Work experience management.
- Blog management.
- Image uploads through Cloudinary.
- Server-side rich-text sanitization.
- Database access through Prisma.
- Request validation using Zod.
- Centralized error handling.
- Health checking.
- Graceful server shutdown.

### API Prefix

```text
/api/v1
```

### Main API Modules

```text
/api/v1/users
/api/v1/auth
/api/v1/projects
/api/v1/work-experience
/api/v1/blogs
```

The application also exposes:

```text
/health
```

for the database health check.

---

# 3. Technology Stack

| Technology        | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| Bun               | JavaScript/TypeScript runtime, package manager, and test runner |
| TypeScript        | Primary programming language                                    |
| Express           | HTTP server and routing framework                               |
| Prisma            | ORM and database access                                         |
| PostgreSQL        | Relational database                                             |
| Cloudinary        | Image storage                                                   |
| Multer            | Multipart file handling and upload validation                   |
| Zod               | Runtime request validation                                      |
| JSON Web Token    | Authentication tokens                                           |
| bcrypt            | Password hashing                                                |
| cookie-parser     | Cookie parsing                                                  |
| CORS              | Frontend origin access control                                  |
| compression       | HTTP response compression                                       |
| sanitize-html     | Server-side rich-text sanitization                              |
| http-status-codes | HTTP status constants                                           |
| Docker            | Containerized production deployment                             |
| Vercel            | Deployment configuration                                        |

---

# 4. Architecture Overview

The backend follows a layered Express architecture.

```text
Client
  |
  v
Express Application
  |
  +--> Global Middleware
  |      |
  |      +--> compression
  |      +--> express.json
  |      +--> express.urlencoded
  |      +--> cookieParser
  |      +--> cors
  |
  +--> Routes
  |
  +--> Route Modules
  |
  +--> Authentication / Authorization
  |
  +--> Request Validation
  |
  +--> Controllers
  |
  +--> Services
  |
  +--> Prisma
  |
  +--> PostgreSQL
  |
  +--> Cloudinary for uploaded images
```

### Typical Request Flow

```text
HTTP Request
    |
    v
Express Middleware
    |
    v
Route
    |
    +--> Multer, when file upload is required
    |
    +--> Authentication, when route is protected
    |
    +--> Zod validation, when configured
    |
    v
Controller
    |
    v
Service
    |
    +--> sanitizeRichText, when applicable
    |
    v
Prisma
    |
    v
PostgreSQL
    |
    v
Standardized Response
```

---

# 5. Directory Structure

The important current project structure is:

```text
myPortfolio-backend/
│
├── src/
│   ├── configs/
│   │   ├── db.ts
│   │   ├── envVars.ts
│   │   ├── cloudinaryConfig.ts
│   │   └── multerConfig.ts
│   │
│   ├── middlewares/
│   │   ├── authCheck.ts
│   │   ├── requestValidator.ts
│   │   ├── notFound.ts
│   │   └── globalError.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   │
│   │   ├── users/
│   │   │   ├── user.route.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.interface.ts
│   │   │   └── user.services.ts
│   │   │
│   │   ├── project/
│   │   │   ├── project.route.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── project.service.ts
│   │   │   └── project.schema.ts
│   │   │
│   │   ├── workExperience/
│   │   │   ├── workExp.route.ts
│   │   │   ├── workExp.controller.ts
│   │   │   ├── workExp.service.ts
│   │   │   └── workExp.schema.ts
│   │   │
│   │   └── blog/
│   │       ├── blog.route.ts
│   │       ├── blog.controller.ts
│   │       ├── blog.service.ts
│   │       ├── blog.interface.ts
│   │       └── blog.schmea.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── userToken.ts
│   │   ├── setCookies.ts
│   │   ├── sanitize.ts
│   │   ├── seedOwner.ts
│   │   ├── response.ts
│   │   └── asyncFync.ts
│   │
│   ├── errorHelper/
│   │   └── error.ts
│   │
│   ├── constraints/
│   │   └── constraints.ts
│   │
│   ├── routes/
│   │   ├── mainRouter.ts
│   │   └── health/
│   │       ├── health.route.ts
│   │       └── health.controller.ts
│   │
│   ├── app.ts
│   ├── server.ts
│   └── index.d.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│   ├── configs/
│   │   ├── envVars.test.ts
│   │   └── multerConfig.test.ts
│   │
│   ├── middlewares/
│   │   └── authCheck.test.ts
│   │
│   └── utils/
│       ├── jwt.test.ts
│       └── sanitize.test.ts
│
├── project-analysis/
├── Dockerfile
├── .dockerignore
├── package.json
├── bun.lock
├── tsconfig.json
├── eslint.config.mjs
├── vercel.json
├── .gitignore
└── .env.example
```

Some existing filenames contain spelling inconsistencies. They are documented exactly as they exist and should not be renamed casually.

Examples:

```text
asyncFync.ts
sendResonse
WorkExperince
descreption
user.services.ts
blog.schmea.ts
```

These names should only be changed deliberately because they may affect imports, database contracts, or API compatibility.

---

# 6. Application Startup Flow

The application startup process consists of the following major stages.

```text
Environment Validation
        |
        v
Database Connection
        |
        v
Owner Seeding
        |
        v
Express Application Setup
        |
        v
Route Registration
        |
        v
HTTP Server Start
```

### Environment Validation

Environment configuration is handled by:

```text
src/configs/envVars.ts
```

Required environment configuration is validated before normal application startup.

The configuration includes values such as:

- `PORT`
- `DATABASE_URL`
- `FRONTEND_URL`
- JWT configuration
- Cloudinary configuration
- Owner configuration

Secrets must remain in environment variables and must not be committed to Git.

### Database Connection

Prisma is used to connect to PostgreSQL.

The server establishes the database connection before starting the HTTP server.

### Owner Seeding

`seedOwner.ts` is responsible for creating the initial owner when required.

The seeding process uses the configured owner information and password hashing.

The seed operation was also adjusted so that a seed failure does not unnecessarily terminate an otherwise running server.

### Express Initialization

`src/app.ts` configures:

- compression
- JSON parsing
- URL-encoded body parsing
- cookie parsing
- CORS
- security-related Express configuration
- routes
- error handling

The Express `x-powered-by` header is disabled.

### Graceful Shutdown

The server handles:

```text
SIGINT
SIGTERM
```

The shutdown process closes the HTTP server and disconnects Prisma.

A forced shutdown timeout is used so the process does not remain indefinitely active.

---

# 7. API Architecture

The API is organized into route, controller, service, and validation layers.

## Main Modules

```text
users
auth
projects
work-experience
blogs
health
```

## Main Endpoints

### Users

```text
GET /api/v1/users/getme
POST /api/v1/users/
```

### Authentication

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/generate-token
```

### Projects

```text
POST   /api/v1/projects/create
PATCH  /api/v1/projects/edit/:id
GET    /api/v1/projects/all
GET    /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

### Work Experience

```text
POST   /api/v1/work-experience/create
PATCH  /api/v1/work-experience/edit/:id
GET    /api/v1/work-experience/all
GET    /api/v1/work-experience/:id
DELETE /api/v1/work-experience/:id
```

### Blogs

```text
POST   /api/v1/blogs/create
PATCH  /api/v1/blogs/update/:slug
GET    /api/v1/blogs/all
GET    /api/v1/blogs/:slug
PATCH  /api/v1/blogs/publish/:slug
PATCH  /api/v1/blogs/unpublish/:slug
DELETE /api/v1/blogs/:slug
GET    /api/v1/blogs/stats
```

### Health

```text
GET /health
```

The health endpoint checks database connectivity.

---

# 8. Authentication and Authorization

The backend uses JWT-based authentication.

The system uses:

```text
Access Token
Refresh Token
```

Tokens are stored in HTTP-only cookies.

## Token Configuration

JWT signing uses the configured JWT secrets.

The access token and refresh token use separate configuration values and expiration settings.

The exact expiration values should be taken from the current environment configuration rather than hardcoded in documentation.

## Cookie Security

Authentication cookies use security-oriented settings including:

```text
httpOnly: true
secure: true
sameSite: "none"
```

These settings prevent direct JavaScript access to the cookies and require secure transport.

## Authentication Flow

### Login

```text
POST /api/v1/auth/login
```

The login process:

1. Receives the owner's credentials.
2. Validates the credentials.
3. Generates access and refresh tokens.
4. Stores the tokens in authentication cookies.
5. Returns the authenticated owner information.

### Refresh Token

```text
POST /api/v1/auth/generate-token
```

The refresh token is read from the authentication cookie.

If valid, a new access token is generated.

### Logout

```text
POST /api/v1/auth/logout
```

The authentication cookies are cleared.

## Authorization Middleware

Protected routes use:

```text
src/middlewares/authCheck.ts
```

The middleware:

1. Reads the access token from the configured cookie.
2. Verifies the JWT.
3. Finds the corresponding user.
4. Checks account status.
5. Checks verification status.
6. Checks the required role.
7. Attaches authenticated user information to the request.

The authentication hardening restricts token extraction to the configured cookie-based mechanism.

The implementation does not currently provide:

- token blacklist
- server-side session store
- automatic token revocation
- automatic secret rotation
- global rate limiting

These are future security improvements.

---

# 9. User and Owner Access Model

The Prisma schema defines the following roles:

```text
MANAGER
OWNER
```

The portfolio currently uses the owner as the primary administrative account.

The user status model includes:

```text
ACTIVE
INACTIVE
BLOCKED
```

Protected operations use the authentication middleware to verify the required role.

Administrative operations such as creating, editing, publishing, and deleting portfolio content require appropriate authorization.

The `MANAGER` role exists in the schema but is not currently used as a separate permission system.

---

# 10. Database

The project uses:

```text
PostgreSQL
```

through:

```text
Prisma
```

The schema is located at:

```text
prisma/schema.prisma
```

The database contains the primary models for:

```text
User
Project
WorkExperince
Blog
```

## User

The user model stores:

- name
- email
- password hash
- avatar
- skills
- address
- phone
- account status
- role
- verification status
- social links
- timestamps

## Project

Projects contain information such as:

- title
- description
- image
- technology stack
- live URL
- GitHub URL
- user relationship
- timestamps

## WorkExperince

The existing Prisma model name is intentionally preserved:

```text
WorkExperince
```

The existing spelling is part of the current implementation.

Work experience stores:

- company
- role
- description field
- user relationship
- start date
- end date

## Blog

Blog records contain:

- title
- content
- images
- publication status
- publication date
- slug
- views
- author relationship
- tags
- timestamps

The exact database field types should always be treated according to the current `prisma/schema.prisma`.

## Relationships

The main relationships are:

```text
User
 ├── Blog[]
 ├── Project[]
 └── WorkExperince[]
```

## Migration History

Migration files are not documented here unless they are present and verified in the repository.

No specific historical migration is claimed by this document.

If migration files are not present in the current repository snapshot, database migration history cannot be reconstructed reliably from this documentation alone.

---

# 11. Request Validation

Request validation uses:

```text
Zod
```

The validation middleware is:

```text
src/middlewares/requestValidator.ts
```

The middleware is responsible for processing validated request data before it reaches the controller.

For multipart requests, file handling occurs before body validation where required.

Validation schemas are maintained within their respective modules.

Examples include:

```text
ProjectCreateSchema
ProjectUpdateSchema
WorkExperienceCreateSchema
WorkExperienceUpdateSchema
blogCreateSchema
blogUpdateSchema
```

Not every endpoint necessarily uses the same validation flow. The individual route definition is the source of truth.

---

# 12. File Uploads

File uploads use:

```text
Multer
Cloudinary
multer-storage-cloudinary
```

## Supported MIME Types

The current upload configuration supports:

```text
image/jpeg
image/jpg
image/png
image/webp
image/gif
```

## File Size

Maximum file size:

```text
10 MB per file
```

## File Count

Maximum files per request:

```text
10
```

The actual route determines whether a request accepts a single file or multiple files.

Examples:

```text
multerUpload.single('file')
multerUpload.array('files')
```

## Cloudinary Storage

Uploaded images are stored through Cloudinary.

The upload configuration uses the configured Cloudinary storage settings.

## Filename and Public ID Handling

Uploaded filenames and Cloudinary public identifiers are sanitized to reduce the risk of unsafe path or identifier manipulation.

## Cleanup

The backend includes cleanup handling for uploaded files when a request fails after an upload has already occurred.

Cleanup errors are handled without hiding the original application error.

---

# 13. Rich Text Sanitization

Rich-text input is sanitized server-side using:

```text
sanitize-html
```

The helper is located in:

```text
src/utils/sanitize.ts
```

The primary helper is:

```text
sanitizeRichText
```

The sanitizer is used by the relevant services before rich-text content is persisted.

The implementation allows a controlled set of HTML elements and removes dangerous HTML content.

The exact allowed tags and attributes are defined by the sanitizer configuration in the source code and should be treated as the authoritative configuration.

Dangerous executable content such as scripts and JavaScript-based URLs is removed according to the sanitizer configuration.

### Important

This is server-side HTML sanitization.

It is not a Tiptap implementation.

It is not a JSON editor migration.

Existing database records were not automatically rewritten as part of the sanitization change.

---

# 14. Error Handling

The backend uses centralized error handling.

Important files include:

```text
src/middlewares/globalError.ts
src/middlewares/notFound.ts
src/errorHelper/error.ts
```

## Global Error Middleware

The global error middleware:

- processes application errors
- converts known errors into appropriate HTTP responses
- handles validation errors
- handles authentication errors
- handles database-related errors
- performs uploaded-file cleanup where required
- avoids exposing unnecessary internal details in production responses

Production responses should not expose internal stack traces or sensitive implementation information.

---

# 15. Response Format

The project uses a standardized response utility.

The response helper is located at:

```text
src/utils/response.ts
```

The response structure supports fields such as:

```text
statusCode
success
message
data
meta
```

A typical response follows this general structure:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": {}
}
```

The exact fields included depend on the endpoint.

---

# 16. Environment Configuration

Environment configuration is validated during application startup.

Sensitive values must remain outside source control.

Important configuration categories include:

```text
PORT
DATABASE_URL
FRONTEND_URL

JWT access configuration
JWT refresh configuration

Cloudinary configuration

Owner configuration
```

The repository contains an example environment file for documenting required configuration.

Actual secret values must never be placed in:

- source code
- README files
- documentation
- committed `.env` files
- Docker images
- Git history

Because an environment file containing credentials had previously been committed during the project's history, previously exposed credentials should be considered compromised and rotated where applicable.

---

# 17. Security Improvements

The backend received several security-focused improvements.

## Environment Security

- Environment configuration is validated.
- Secrets are not hardcoded into source files.
- Environment files are excluded through Git ignore rules.

## JWT Security

- JWT signing uses explicit configuration.
- Access and refresh tokens use separate configuration.
- Authentication uses HTTP-only cookies.
- Authentication token extraction was restricted to the configured cookie mechanism.
- Sensitive authentication logging was removed.

## Cookie Security

Authentication cookies use:

```text
httpOnly
secure
SameSite
```

configuration appropriate for the application's cross-origin frontend setup.

## Error Security

Production error responses avoid exposing sensitive internal information.

## Upload Security

- MIME restrictions.
- File size restrictions.
- File count restrictions.
- Filename/public ID sanitization.
- Cloudinary upload handling.
- Uploaded-file cleanup.

## Rich Text Security

Rich-text content is sanitized server-side using `sanitize-html`.

## Express Security

The application disables:

```text
x-powered-by
```

to avoid unnecessarily exposing the Express technology signature.

## CORS

CORS is configured using the frontend origin configuration.

---

# 18. Testing

The project uses Bun's native test runner.

Current test files:

```text
tests/configs/envVars.test.ts
tests/configs/multerConfig.test.ts
tests/middlewares/authCheck.test.ts
tests/utils/jwt.test.ts
tests/utils/sanitize.test.ts
```

The test suite covers areas including:

- environment validation
- upload configuration
- authentication middleware
- JWT behavior
- HTML sanitization

The existing test infrastructure does not claim:

- Jest
- Supertest
- Cypress
- Docker Compose integration testing
- E2E testing
- CI coverage thresholds

Coverage percentages are not documented because no verified coverage target is part of the current implementation.

---

# 19. Production Readiness

Production-readiness improvements include:

- environment validation
- hardened JWT configuration
- secure authentication cookies
- restricted token extraction
- upload restrictions
- uploaded-file cleanup
- rich-text sanitization
- centralized error handling
- Express `x-powered-by` disabled
- health endpoint
- graceful shutdown
- production error protection
- Docker production configuration
- non-root container execution

The project should still be treated as an actively maintained application rather than a fully instrumented enterprise platform.

---

# 20. Docker

The backend includes a production-oriented multi-stage Dockerfile.

The Docker configuration uses:

```text
oven/bun:1.2.15
```

The Docker build separates build dependencies from the final runtime image.

The final image runs the application using a non-root user.

A container health check is included.

The `.dockerignore` prevents unnecessary development and sensitive files from being included in the Docker build context.

Environment files and repository metadata should not be copied into the production image.

---

# 21. Deployment

The repository contains deployment configuration including:

```text
Dockerfile
vercel.json
```

The backend can be containerized using the provided Docker configuration.

Environment variables must be configured separately in the deployment environment.

Production deployment should verify:

- database connectivity
- required environment variables
- Cloudinary configuration
- frontend origin
- JWT configuration
- health endpoint
- authentication cookies
- upload behavior

---

# 22. Complete Improvement History

The backend improvement work was divided into a sequence of focused prompts.

## Prompt 01

**Status:** IMPLEMENTED

**Commit:**

```text
0f8a2ba
feat: Secure environment by adding .env.dev to .gitignore and creating .env.example
```

Main purpose:

- Improve environment-file handling.
- Prevent environment files from being tracked.
- Create an example environment configuration.

Important security note:

Previously exposed environment credentials should be rotated.

---

## Prompt 02

**Status:** IMPLEMENTED

**Commit:**

```text
7844ca1
refactor: validate environment configuration
```

Main purpose:

- Validate environment configuration.
- Fail early when required configuration is missing or invalid.

---

## Prompt 03

**Status:** DEFERRED

The naming cleanup was intentionally not completed.

The repository contains naming inconsistencies such as:

```text
asyncFync
sendResonse
WorkExperince
descreption
blog.schmea.ts
user.services.ts
```

These were left unchanged to avoid unnecessary compatibility risks.

---

## Prompt 04

**Status:** IMPLEMENTED

**Commit:**

```text
17aa602
security: harden authentication and authorization
```

Main improvements:

- Explicit JWT algorithm handling.
- Reduced sensitive authentication logging.
- Restricted token extraction.
- Improved authentication error handling.
- Improved production error protection.

---

## Prompt 05

**Status:** IMPLEMENTED

**Commit:**

```text
a374c23
security: harden file uploads
```

Main improvements:

- MIME type restrictions.
- 10 MB file-size limit.
- Maximum 10 files per request.
- Filename/public ID sanitization.
- Upload cleanup behavior.
- Safer Cloudinary handling.

---

## Prompt 06

**Status:** IMPLEMENTED

**Commit:**

```text
6e730b6
security: sanitize rich text content
```

Main improvements:

- Added `sanitize-html`.
- Added server-side rich-text sanitization.
- Sanitized relevant blog, project, and work-experience content.
- Removed dangerous executable HTML content.

No database migration was performed for this change.

---

## Prompt 07

**Status:** ANALYSIS ONLY

The database and query optimization work was analyzed.

No implementation changes were committed as part of this prompt.

---

## Prompt 08

**Status:** IMPLEMENTED

**Commit:**

```text
efc734f
test: add backend testing infrastructure
```

Main improvements:

- Added Bun native test infrastructure.
- Added tests for environment validation.
- Added upload configuration tests.
- Added authentication middleware tests.
- Added JWT tests.
- Added sanitizer tests.

---

## Prompt 09

**Status:** IMPLEMENTED

**Commit:**

```text
5d5ff61
feat: improve production readiness
```

Main improvements:

- Added health endpoint.
- Disabled Express `x-powered-by`.
- Improved production error handling.
- Added graceful shutdown.
- Improved seed failure behavior.

---

## Prompt 10

**Status:** IMPLEMENTED

**Commit:**

```text
10f43d3
feat: improve Docker production configuration
```

Main improvements:

- Multi-stage Docker build.
- Production-oriented Bun image.
- Non-root runtime user.
- Improved Docker caching.
- Health check.
- Reduced production image contents.

---

## Prompt 11

**Status:** IMPLEMENTED

**Commit:**

```text
2b1ffb3
docs: improve backend documentation
```

Main improvements:

- Expanded README.
- Documented architecture.
- Documented environment configuration.
- Documented API structure.
- Documented authentication.
- Documented uploads.
- Documented sanitization.
- Documented testing.
- Documented Docker and deployment.
- Documented security considerations.

---

## Prompt 12

**Status:** REVIEW ONLY

Prompt 12 performed the final integration, security, Docker, Git, and implementation review.

No implementation commit was created by Prompt 12.

The final implementation remained at:

```text
2b1ffb3
```

---

# 23. Current Technical Debt

The current repository contains several known technical-debt areas.

## Naming Inconsistencies

Examples:

```text
asyncFync.ts
sendResonse
WorkExperince
descreption
blog.schmea.ts
user.services.ts
```

These should not be renamed casually.

A future naming cleanup should consider:

- imports
- Prisma model names
- database compatibility
- API contracts
- frontend dependencies

## Authentication Expansion

The current system does not implement:

- token blacklist
- refresh-token revocation storage
- session management
- automated secret rotation
- global rate limiting

## Testing Expansion

Additional testing could include:

- integration testing
- endpoint-level testing
- upload failure scenarios
- database interaction testing
- end-to-end testing

These are future improvements, not current implementation claims.

---

# 24. Intentionally Deferred / Unchanged Work

The following areas were intentionally not changed during the current improvement cycle:

### Naming Cleanup

Deferred because renaming internal identifiers can introduce unnecessary compatibility risks.

### Database Optimization

Analyzed but not implemented as part of Prompt 07.

### Database Migration History

No historical migration claims are made without verified migration files.

### Rich-Text Database Migration

No database migration was performed for the sanitization work.

### Enterprise Observability

No Prometheus, Grafana, Elasticsearch, centralized logging, or alerting system was added.

### Automated CI/CD Security

No unsupported CI security or coverage system is claimed.

---

# 25. Future Improvements

The following are recommendations only.

## Testing

Potential future work:

- Add integration tests.
- Add endpoint-level tests.
- Add end-to-end tests.
- Expand edge-case coverage.
- Add database-backed testing where appropriate.

## Authentication

Potential future work:

- Refresh-token revocation.
- Token/session management.
- Rate limiting on authentication endpoints.
- Automated secret rotation.
- Additional authentication monitoring.

## Database

Potential future work:

- Review query patterns.
- Add indexes only where supported by actual query usage.
- Introduce pagination where datasets require it.
- Review Prisma connection configuration for deployment scale.
- Introduce migrations when a migration workflow is formally adopted.

## Performance

Potential future work:

- Pagination.
- Query optimization.
- Selective field retrieval.
- Appropriate database indexing.
- Caching for frequently accessed read-only data.
- Cloudinary image transformations.
- Retry handling for appropriate transient failures.

## API Documentation

Potential future work:

- OpenAPI specification.
- Generated API reference.
- Frontend/backend contract testing.

## Observability

Potential future work:

- Structured logging.
- Request identifiers.
- Metrics.
- Monitoring dashboards.
- Alerting.

These capabilities are not currently claimed as implemented.

---

# 26. Developer Onboarding

A new developer should follow this sequence.

## Step 1. Clone the Repository

```bash
git clone <repository-url>
cd myPortfolio-backend
```

## Step 2. Install Dependencies

Using Bun:

```bash
bun install
```

## Step 3. Configure Environment

Create the required local environment file using `.env.example` as the reference.

Never commit actual credentials.

## Step 4. Verify Database Configuration

Ensure:

```text
DATABASE_URL
```

points to the intended PostgreSQL database.

## Step 5. Start Development Server

Use the project's configured development script:

```bash
bun run dev
```

## Step 6. Run Tests

```bash
bun test
```

## Step 7. Run Build

```bash
bun run build
```

## Step 8. Run Lint

```bash
bun run lint
```

## Step 9. Check Health Endpoint

```text
GET /health
```

The endpoint should confirm database connectivity.

---

# 27. Development Workflow

Before changing backend functionality:

1. Read the relevant route.
2. Read the controller.
3. Read the service.
4. Read the validation schema.
5. Check the Prisma model.
6. Check frontend usage if the API contract is affected.
7. Make the smallest appropriate change.
8. Run tests.
9. Run build.
10. Run lint.
11. Review the Git diff.
12. Commit the focused change.

Avoid unrelated refactoring during feature work.

---

# 28. Troubleshooting

## Environment Validation Error

Check:

```text
.env
.env.example
src/configs/envVars.ts
```

Make sure all required variables exist and use valid values.

## Database Connection Error

Check:

```text
DATABASE_URL
```

Then verify PostgreSQL is running and reachable.

## Authentication Failure

Check:

- access token cookie
- refresh token cookie
- JWT configuration
- user status
- user verification status
- required role
- frontend CORS configuration

## Upload Failure

Check:

- MIME type
- file size
- number of files
- Cloudinary credentials
- Cloudinary configuration
- multipart field name

For example:

```text
file
```

or:

```text
files
```

depending on the endpoint.

## Validation Failure

Check the relevant Zod schema and the shape of the request body.

For multipart requests, remember that uploaded-file handling and body parsing can affect how request data reaches validation.

## Docker Failure

Check:

```text
Dockerfile
.dockerignore
environment variables
database connectivity
health endpoint
```

Build the image and inspect the container logs.

---

# 29. Frontend/Backend Compatibility

The frontend depends on the backend API contracts.

Before changing any of the following, inspect frontend usage:

- endpoint paths
- request field names
- response field names
- authentication cookies
- image upload field names
- database-backed public fields
- rich-text content format

Particular care is required around existing names such as:

```text
descreption
WorkExperince
```

Changing these names without a coordinated frontend and database change can break the application.

The backend should therefore preserve existing API contracts unless a deliberate migration is planned.

---

# 30. Security Maintenance Checklist

Before production deployment:

```text
[ ] Environment variables configured securely
[ ] No secrets committed to Git
[ ] Previously exposed credentials rotated
[ ] DATABASE_URL verified
[ ] JWT secrets configured securely
[ ] FRONTEND_URL configured correctly
[ ] Cloudinary credentials configured
[ ] Authentication cookies configured correctly
[ ] Upload MIME restrictions verified
[ ] Upload size limit verified
[ ] Upload count limit verified
[ ] Rich-text sanitization enabled
[ ] Production error responses do not expose stack traces
[ ] CORS configuration reviewed
[ ] Health endpoint verified
[ ] Docker image reviewed
[ ] Application runs as non-root inside Docker
[ ] Tests pass
[ ] Build passes
[ ] Lint passes
```

---

# 31. Final Architecture Summary

The current backend can be summarized as:

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               v
                    ┌──────────────────────┐
                    │       Express        │
                    │       app.ts         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             v                 v                 v
        Middleware          Routes           Health
             │                 │
             │                 v
             │          Module Routers
             │                 │
             │                 v
             │            Controllers
             │                 │
             │                 v
             │             Services
             │                 │
             │                 v
             │              Prisma
             │                 │
             │                 v
             │            PostgreSQL
             │
             ├──── Authentication
             │       JWT + Cookies
             │
             ├──── Validation
             │       Zod
             │
             ├──── File Upload
             │       Multer + Cloudinary
             │
             └──── Sanitization
                     sanitize-html
```

The backend is structured around Express modules with separate routes, controllers, services, validation, middleware, and utilities.

Authentication is JWT-based and cookie-based.

PostgreSQL is accessed through Prisma.

Images are stored through Cloudinary.

Rich-text input is sanitized server-side.

Errors are processed through centralized middleware.

The application includes a health endpoint and graceful shutdown handling.

The repository also contains a Bun-based test suite covering important security and utility functionality.

The most important maintenance principle is to preserve existing API and database contracts unless a deliberate migration is planned. Existing naming inconsistencies should therefore be treated as technical debt rather than casually renamed.

---

# Appendix A. Important Existing Naming

The following names are intentionally documented exactly as they currently exist:

```text
WorkExperince
descreption
asyncFync
sendResonse
blog.schmea.ts
user.services.ts
```

Do not correct these names casually.

Any future rename should include:

1. Source-code reference review.
2. Prisma/database compatibility review.
3. API compatibility review.
4. Frontend compatibility review.
5. Tests.
6. Migration planning where required.

---

# Appendix B. Current Improvement Commit History

```text
0f8a2ba  feat: Secure environment by adding .env.dev to .gitignore and creating .env.example
7844ca1  refactor: validate environment configuration
17aa602  security: harden authentication and authorization
a374c23  security: harden file uploads
6e730b6  security: sanitize rich text content
efc734f  test: add backend testing infrastructure
5d5ff61  feat: improve production readiness
10f43d3  feat: improve Docker production configuration
2b1ffb3  docs: improve backend documentation
```

Additional workflow states:

```text
Prompt 03  DEFERRED
Prompt 07  ANALYSIS ONLY
Prompt 12  REVIEW ONLY
```

---

# Appendix C. Documentation Reliability Rule

This document intentionally avoids claiming infrastructure, metrics, tests, migrations, monitoring systems, or performance measurements that are not verified as part of the current implementation.

When this document and the source code disagree, the current source code is the final authority.

Future documentation updates should preserve the distinction between:

```text
Current Implementation
```

and:

```text
Future Recommendation
```

No future capability should be documented as implemented until it actually exists in the repository.

```

```
