# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My Portfolio Backend is a REST API built with Bun, TypeScript, and Express for managing a personal portfolio (projects, work experience, blogs) with admin-only access. It uses Prisma ORM for PostgreSQL and Cloudinary for image storage.

**Live deployments:**
- Frontend: https://raselsdev.vercel.app
- Backend: https://rasel-shikder-backend.vercel.app

## Security Rules

### Core Security Principles

1. **No Unauthorized Deletion:**
   - **Files:** No file deletion commands will be executed without explicit user approval. If deletion is required, the user must perform it manually.
   - **Database:** No database destructive operations (drop, truncate, reset) will be executed without explicit user approval.

2. **Environment Protection:**
   - Environment variables are validated at startup and must be explicitly provided in `.env.local`.
   - Secrets are never exposed in code, logs, or output.

3. **Authentication:**
   - JWT-based dual-token system (access + refresh tokens) stored in HTTP-only cookies.
   - Role-based authorization with `authCheck` middleware.

4. **Data Integrity:**
   - Rich text sanitization via `sanitizeRichText()` to prevent XSS attacks.
   - File uploads validated for MIME type, size (10MB max), and quantity (10 max).

## Project Structure

```
src/
├── configs/          # Configuration files (envVars, db, cloudinary, multer, prisma)
├── modules/           # Domain modules (auth, users, project, workExperience, blog)
├── middlewares/       # Auth, validation, error handling
├── routes/            # Route definitions (mainRouter, health)
├── utils/             # Shared utilities (asyncFync, response, jwt, sanitize, setCookies)
├── server.ts          # Main entry point with HTTP server
└── app.ts             # Express app configuration

prisma/
└── schema.prisma      # Database schema (User, Blog, Project, WorkExperince models)
```

## Development Commands

```bash
# Install dependencies
bun install

# Development mode (watch mode)
bun run dev

# Build TypeScript
bun run build

# Run production build
bun start

# Run tests
bun test

# Lint code
bun run lint

# Auto-fix linting issues
bun run lint:fix
```

**Important:** Run `bun run build` before any deployment. Environment variables must be set in `.env.local` before running any server command.

## Database Operations

**IMPORTANT:** Database migrations should always be run in `--create-only` mode before committing changes to avoid repository pollution.

```bash
# Create schema changes without auto-generating client
npx prisma migrate dev --create-only

# After review, generate and apply changes
npx prisma migrate dev

# Reset development database (use with caution)
npx prisma migrate reset
```

Always verify schema changes are intentional before running `prisma migrate dev` without `--create-only`.

## MCP Configuration

- **Filesystem Server:** Configured to allow access to `E:/programme/myPortfolio-backend`.
- **Security:** No destructive operations (file/database deletions) will be executed without explicit user approval.

## Authentication Flow

**Login:** POST `/api/v1/auth/login` with `{email, password}` → returns access & refresh tokens → tokens set as HTTP-only, secure, sameSite='none' cookies.

**Token refresh:** POST `/api/v1/auth/generate-token` checks refresh token cookie → generates new access token.

**Logout:** POST `/api/v1/auth/logout` clears authentication cookies.

**Protected routes:** Use `authCheck(...roles)` middleware on controllers. The middleware:
1. Extracts token from Authorization header or accessToken cookie.
2. Verifies JWT signature and expiration.
3. Validates user exists, is active and verified.
4. Checks requested role matches user role.
5. Attaches user payload to `req.user`.

## File Uploads

All file uploads use Cloudinary with strict validation:
- Allowed types: JPEG, JPG, PNG, GIF, WEBP
- Max size: 10MB per file
- Max files per request: 10
- Stored in `portfolio` folder with unique sanitized filenames

Use `multerUpload` middleware from `src/configs/multerConfig.ts` in upload routes.

## Environment Variables

Required variables in `.env.local`:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES` - Access token credentials
- `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES` - Refresh token credentials
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials
- `FRONTEND_URL` - Frontend URL for CORS
- `BCRYPT_SALT` - Bcrypt hashing rounds
- `OWNER_EMAIL`, `OWNER_PASSWORD` - Default admin credentials

**Never commit `.env.local` to git.** Always use `.env.example` as template.

## Tools & Commands

**Prisma CLI:**
```bash
npx prisma generate       # Generate Prisma Client from schema
npx prisma studio         # Open database GUI in browser
npx prisma db push        # Sync DB to schema (no migrations)
```

**ESLint & Prettier:**
- Configured in `eslint.config.mjs` and `.prettierrc`
- TypeScript-specific settings in `tsconfig.json`

**Bun-specific:** Uses Bun as runtime (`tsx` for TypeScript execution).

## Deployment

**Production:** Deployed on Vercel. The `vercel.json` config specifies build commands.

**Docker:** Dockerfile available at root. Container runs as non-root user with health check endpoint (`/health`).

**Health check:** GET `/health` verifies database connectivity. Returns 200 on success, 503 if DB unreachable.

## Database Schema Constraints

- `User.isActive` enums: ACTIVE, INACTIVE, BLOCKED
- `User.role` enums: OWNER, MANAGER
- `User.isVerified`: Boolean with default `true`
- Relationships: One User has many Projects, Blogs, and WorkExperiences
- `Blog.slug`: Unique identifier for SEO-friendly URLs
- `Blog.published`: Boolean to control visibility

## Verification Before Execution

Before taking any action, Claude Code will:
1. Check `CLAUDE.md` and project memories for security rules.
2. Confirm no destructive commands (file/database deletions) are being executed.
3. Ensure all operations are safe and intentional.

## Related Memories

- [[mcp-configuration]] — MCP filesystem server configuration
- [[security-rules]] — Security rules for project backend

## Common Patterns

**Error handling in controllers:**
```typescript
import { asyncFunc } from '../../utils/asyncFync';
import AppError from '../../errorHelper/error';

const myHandler = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    if (errorCondition) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Message');
    }
    sendResponse(res, { success: true, result });
  }
);
```

**Role-based protected route:**
```typescript
import authCheck from '../../middlewares/authCheck';

router.get(
  '/protected',
  authCheck('OWNER', 'MANAGER'), // Order matters - owner first, then manager
  protectedController
);
```

**File upload route:**
```typescript
import { multerUpload } from '../../configs/multerConfig';

router.post(
  '/upload',
  multerUpload.array('images', 10), // 'images' is form field name
  uploadController
);
```