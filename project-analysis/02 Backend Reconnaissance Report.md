# Backend Reconnaissance Report

## 1. Executive Summary

This report documents the complete technical architecture of the myPortfolio-backend project, a TypeScript-based Express REST API. The application uses Prisma ORM with PostgreSQL, Bun runtime with TypeScript, JWT authentication, Cloudinary for media storage, and Zod for validation.

The project contains five main modules: Auth (authentication), Blog (content management), Project (portfolio projects), Work Experience (career history), and Users (user management). It exposes a REST API at `/api/v1` with both public and protected endpoints.

## 2. Technology Stack

- Runtime & Build: Bun (package manager via bun.lock), TypeScript with CommonJS output
- Framework: Express.js 5.1.0
- ORM: Prisma 6.16.2 with @prisma/client
- Database: PostgreSQL (configured via DATABASE_URL environment variable)
- File Storage: Cloudinary (cloudinary v2 + multer-storage-cloudinary)
- Validation: Zod v4.1.11
- Authentication: JSON Web Tokens (jsonwebtoken v9.0.2)
- Password Hashing: bcrypt 6.0.0
- HTTP Status Codes: http-status-codes v2.3.0
- Middleware: compression (gzip), cookie-parser v1.4.7, cors v2.8.5
- Linting: ESLint with recommended rules
- Formatting: Prettier

## 3. Repository Architecture

### Root Directory Files

| File | Purpose |
|------|---------|
| package.json | Dependencies, scripts, project metadata |
| tsconfig.json | TypeScript configuration (es2016, commonjs, strict mode) |
| Dockerfile | Multi-stage build using node:24 with npm-installed bun |
| vercel.json | @vercel/node serverless deployment config |
| .gitignore | Ignores node_modules, dist, coverage, .env files, .env.dev |
| .dockerignore | Excludes node_modules, .git, .env files for Docker builds |
| .prettierrc | Code formatting (single quote, 80 char width, trailing comma) |
| eslint.config.mjs | ESLint configuration with recommended rules |
| bun.lock | Bun package lock file |

### src/ Source Directory Structure

| Directory/M | Purpose |
|-------------|---------|
| app.ts | Express application initialization, middleware registration, route mounting |
| server.ts | Entry point: database connection test, HTTP server creation, seedOwner execution |
| configs/ | Configuration modules (db, envVars, cloudinary, multer) |
| middlewares/ | Custom Express middleware (authCheck, requestValidator, notFound, globalError) |
| modules/ | Feature-specific implementations |
| utils/ | Shared utilities |
| errorHelper/ | Error classes and handling |
| constraints/ | Default/static constraint data |
| routes/ | Route definitions (mainRouter.ts mounts all routes) |

### src/configs/

| File | Purpose |
|------|---------|
| db.ts | PrismaClient singleton initialization |
| envVars.ts | Environment variable validation and loading via dotenv |
| cloudinaryConfig.ts | Cloudinary configuration and uploadBufferCloudinary function |
| multerConfig.ts | Multer CloudinaryStorage adapter |

### src/middlewares/

| File | Purpose |
|------|---------|
| authCheck.ts | JWT authentication and role-based authorization middleware |
| requestValidator.ts | Zod schema validation and request body processing |
| notFound.ts | 404 handler for unmatched routes |
| globalError.ts | Centralized error processing and response formatting |

### src/modules/

| Module | Files |
|--------|-------|
| auth/ | auth.controller.ts, auth.route.ts, auth.schema.ts, auth.service.ts |
| blog/ | blog.controller.ts, blog.interface.ts, blog.route.ts, blog.service.ts, blog.schmea.ts (typo), blog.schema.ts |
| project/ | project.controller.ts, project.interface.ts, project.route.ts, project.service.ts, project.schema.ts |
| users/ | user.controller.ts, user.interface.ts, user.route.ts, user.services.ts |
| workExperience/ | workExp.controller.ts, workExp.interface.ts, workExp.route.ts, workExp.service.ts, workExp.schema.ts |

### src/utils/

| File | Purpose |
|------|---------|
| asyncFync.ts | async handler wrapper for controllers to catch promise rejections |
| jwt.ts | generateAccessToken, verifyJwtToken functions |
| response.ts | sendResonse (function name typo: Resonse) utility |
| seedOwner.ts | Creates default owner user if not exists |
| setCookies.ts | Configures httpOnly, secure, sameSite:none cookies for tokens |
| userToken.ts | Generates access token and refresh token pair |

### src/errorHelper/

| File | Purpose |
|------|---------|
| error.ts | AppError class (extends Error with statusCode, message, optional stack) |

### src/constraints/

| File | Purpose |
|------|---------|
| constraints.ts | Default values used by seedOwner (skills array, address, phone, social URLs) |

### src/routes/

| File | Purpose |
|------|---------|
| mainRouter.ts | Routes router imports and mounts all module routes under /api/v1 |

### Prisma/

| File | Purpose |
|------|---------|
| schema.prisma | ORM schema definition with 4 models, 2 enums, indexes, relations |
| migrations/ | DB migration files |
| 20251011171933_new/migration.sql | Original migration with User, Blog, Project, WorkExperince tables |
| 20260428162232_richtext/migration.sql | Alters Blog.content to JSONB and drops TEXT column |
## 6. Request Data Flow

### Middleware Execution Order (per /api/v1 route layer):
```
HTTP Request
  → compression (gzip)
  → express.json() (body parsing)
  → express.urlencoded({ extended: true })
  → cookie-parser
  → cors
  → /api/v1/appRoutes
    → multerUpload (file parsing)
    → authCheck (JWT + role validation)
    → requestValidator (Zod schema validation)
    → controller
      → service
## 7. Authentication and Authorization

### JWT Token Architecture

**Token Structure** (src/utils/jwt.ts):
```typescript
// generateAccessToken
async (jwtPayload: JwtPayload, secret: string, expires: string): Promise<string>

// verifyJwtToken
async (token: string, secret: string): any
```

**Payload Format**:
```typescript
{
  id: number,          // User's database ID
  email: string,       // User's email address
  role: 'OWNER' | 'MANAGER'
}
```

### Token Creation Flow (src/utils/userToken.ts):
1. Creates access token using JWT_ACCESS_SECRET and JWT_ACCESS_EXPIRES
2. Creates refresh token using JWT_REFRESH_SECRET and JWT_REFRESH_EXPIRES
3. Returns both tokens

### Token Storage
**Cookies**: src/utils/setCookies.ts
- accessToken: httpOnly: true, secure: true, sameSite: 'none'
- refreshToken: httpOnly: true, secure: true, sameSite: 'none'

### Authentication Middleware (src/middlewares/authCheck.ts):
```typescript
const authCheck = (...authRole: string[]) => async (req, res, next) => {
  // 1. Extract token from headers or cookies
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  
  // 2. Verify JWT
  const verifiedToken = await verifyJwtToken(accessToken, envVars.JWT_ACCESS_SECRET);
  
  // 3. Find user in database
  const existedOwner = await prisma.user.findUnique({
    where: { email: verifiedToken.email },
  });
  
  // 4. Validate user status
  if (!existedOwner) throw new AppError(404, 'You are not authorized owner');
  if (existedOwner.isActive === 'BLOCKED' || existedOwner.isActive === 'INACTIVE') 
    throw new AppError(401, `You are ${existedOwner.isActive}! Please activate first`);
  if (!existedOwner.isVerified) throw new AppError(400, 'You are not verified');
## 8. Database and Prisma

### Database Models (src/prisma/schema.prisma)

#### User Model
```prisma
model User {
  id            Int     @id @default(autoincrement())
  name          String
  email         String   @unique
  password      String
  avater        String   @default("https://cdn-icons-png.flaticon.com/512/9385/9385289.png")
  skills        String[]
  address       String   @db.VarChar(150)
  phone         String
  isActive      IsActive  @default(ACTIVE)
  role          Role      @default(OWNER)
  isVerified    Boolean   @default(true)
  github        String
  linkedin      String
  twitter       String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now())
  
  Blog         Blog[]
  Project       Project[]
  WorkExperince WorkExperince[]
}
```

#### Blog Model
```prisma
model Blog {
  id            Int      @id @default(autoincrement())
  title         String   @db.VarChar(255)
  content       Json?
  images        String[] @default(["https://placehold.co/800x450/eee/555?font=playfair-display&text=No+Thumbnail+Yet"])
  published     Boolean  @default(false)
  publishedDate DateTime @default(now())
  slug          String   @unique
  views         Int      @default(0)
  authorId      Int
  author        User     @relation(fields: [authorId], references: [id])
  tags          String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### Project Model
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String   @db.VarChar(500)
  image       String
  techStack   String[]
  liveUrl     String
## 9. Blog Module

### Module Structure

**Files**:
- blog.controller.ts - CRUD controller functions
- blog.interface.ts - TypeScript interface definitions
- blog.route.ts - Route definitions, middleware, validation
- blog.service.ts - Business logic, Prisma operations
- blog.schmea.ts - Zod validation schema (typo in filename)

### API Endpoints

#### Public Endpoints
- GET /api/v1/blogs/all - List all blogs with pagination
- GET /api/v1/blogs/:slug - Get single blog by slug (increments views)

#### Protected Endpoints (Manager/Owner)
- GET /api/v1/blogs/stats - Get blog statistics (views, counts)
- POST /api/v1/blogs/create - Create new blog
- PATCH /api/v1/blogs/publish/:slug - Publish blog
- PATCH /api/v1/blogs/unpublish/:slug - Unpublish blog
- PATCH /api/v1/blogs/update/:slug - Update blog
- DELETE /api/v1/blogs/:slug - Delete blog

### Blog Model Schema

**Prisma Model** (src/prisma/schema.prisma):
```prisma
model Blog {
  id            Int      @id @default(autoincrement())
  title         String   @db.VarChar(255)
  content       Json?    // JSON content, optional
  images        String[] @default(["https://placehold.co/800x450/eee/555?font=playfair-display&text=No+Thumbnail+Yet"])
  published     Boolean  @default(false)
  publishedDate DateTime @default(now())
  slug          String   @unique
  views         Int      @default(0)
  authorId      Int
  author        User     @relation(fields: [authorId], references: [id])
  tags          String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Request/Response Flow

#### Blog Retrieval (GET /api/v1/blogs/:slug):
```
HTTP Request
  → Multer (none for GET)
  → AuthCheck (none for public)
## 10. Project Module

### Module Structure

**Files**:
- project.controller.ts - CRUD controller functions
- project.interface.ts - TypeScript interface definitions
- project.route.ts - Route definitions, middleware, validation
- project.service.ts - Business logic, Prisma operations
- project.schema.ts - Zod validation schema

### API Endpoints

#### Protected Endpoints (Manager/Owner)
- POST /api/v1/projects/create - Create new project
- PATCH /api/v1/projects/edit/:id - Update existing project
- DELETE /api/v1/projects/:id - Delete project

#### Public Endpoints
- GET /api/v1/projects/all - List all projects
- GET /api/v1/projects/:id - Get single project

### Project Model Schema

**Prisma Model** (src/prisma/schema.prisma):
```prisma
model Project {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String   @db.VarChar(500)
  image       String
  techStack   String[]
  liveUrl     String
  githubUrl   String
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Validation (Zod) (project.schema.ts)

```typescript
export const ProjectCreateSchema = z.object({
  title: z.string().min(1, 'Project title is required').min(3, 'Project title must be at least 3 characters long'),
  description: z.string().min(1, 'Project description is required').min(10, 'Project description must be at least 10 characters long'),
  image: z.string().url('Project image must be a valid URL').min(1, 'Project image URL is required').optional(),
  techStack: z.array(z.string().min(1, 'Tech stack item cannot be empty')).min(1, 'At least one tech stack item is required'),
  liveUrl: z.string().url('Live URL must be a valid link').min(1, 'Live project URL is required'),
## 11. Work Experience Module

### Module Structure

**Files**:
- workExp.controller.ts - CRUD controller functions
- workExp.interface.ts - TypeScript interface definitions
- workExp.route.ts - Route definitions, middleware, validation
- workExp.service.ts - Business logic, Prisma operations
- workExp.schema.ts - Zod validation schema

### API Endpoints

#### Protected Endpoints (Manager/Owner)
- POST /api/v1/work-experience/create - Create work experience entry
- PATCH /api/v1/work-experience/edit/:id - Update existing entry
- DELETE /api/v1/work-experience/:id - Delete entry

#### Public Endpoints
- GET /api/v1/work-experience/all - List all work experiences

#### Mixed Access (Protected Get)
- GET /api/v1/work-experience/:id - Get single entry (protected)

### Model Schema

**Prisma Model** (src/prisma/schema.prisma):
```prisma
model WorkExperince {
  id          Int      @id @default(autoincrement())
  companyName String
  role        String   @db.VarChar(80)
  descripion  String   // Note: Typo in field name
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  startDate   DateTime
  endDate     DateTime
}
```

### Validation (Zod) (workExp.schema.ts)

```typescript
export const WorkExperienceCreateSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
## 12. User Module

### Module Structure

**Files**:
- user.controller.ts - Controller functions
- user.interface.ts - TypeScript interface definitions
- user.route.ts - Route definitions
- user.services.ts - Service functions

### API Endpoints

#### Protected Endpoint (Manager/Owner Only)
- GET /api/v1/users/getme - Get current user profile

#### Public Endpoint
- POST /api/v1/users/ - Create new user account

### User Model Interface

**File**: src/modules/users/user.interface.ts

```typescript
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  avater?: string | null;
  skills: string[];
  address: string;
  phone: string;
  isActive: isActive;
  role: Role;
  isVerified: boolean;
  github: string;
  linkedin: string;
  twitter: string;
  createdAt: Date;
  updatedAt: Date;
  Blog?: IBlog[];
  Project?: IProject[];
  WorkExperince?: IWorkExperince[];
}
```

**Enums**:
```typescript
export enum isActive {
## 13. Auth Module

### Module Structure

**Files**:
- auth.controller.ts - Authentication controller functions
- auth.route.ts - Route definitions
- auth.schema.ts - Zod validation schemas
- auth.service.ts - Authentication service logic

### Authentication Flow

**Login (POST /api/v1/auth/login)**:
1. Extract credentials from request body
2. Find user by email in database
3. Validate user status (ACTIVE, verified)
4. Compare password using bcrypt
5. Generate JWT tokens (access + refresh)
6. Set authentication cookies
7. Return tokens and user data

**Logout (POST /api/v1/auth/logout)**:
1. Clear accessToken and refreshToken cookies
2. Return success message

**Token Refresh (POST /api/v1/auth/generate-token)**:
1. Attempt to verify existing access token
2. If expired/invalid, verify refresh token
3. Validate refresh token and user status
4. Generate new access and refresh tokens
5. Set new cookies
6. Return new tokens

### JWT Token Management

**Token Generation** (src/utils/userToken.ts):
```typescript
const createUserTokens = async (jwtPayload:JwtPayload) => {
  const accessToken = await generateAccessToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );
  
  const refreshToken = await generateAccessToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES as string
  );
  
  return { accessToken, refreshToken };
};
```

**Token Verification** (src/utils/jwt.ts):
```typescript
export const verifyJwtToken = async(token:string, secret:string)=>{
### Authentication Services

**File**: src/modules/auth/auth.service.ts

#### Login Service
```typescript
const ownerLogin = async (email: string, plainPassword: string) => {
  const existedOwner = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized owner');
  }
  
  if (
    existedOwner.isActive === 'BLOCKED' ||
    existedOwner.isActive === 'INACTIVE'
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      `You are ${existedOwner.isActive}! Please activate first`,
    );
  }
  
  if (!existedOwner.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Verify before login');
  }
  
  const isValidPassword = await bcrypt.compare(
    plainPassword,
    existedOwner.password,
  );
  
  if (!isValidPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Password');
  }
  
  const jwtPayload: JwtPayload = {
    id: existedOwner.id,
    email: existedOwner.email,
    role: existedOwner.role,
  };
  
  const tokens = await createUserTokens(jwtPayload);
  
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    data: existedOwner,
  };
};
```

#### Token Generation Service
```typescript
const generateNewAccessToken = async (
### Authentication Validation

**File**: src/modules/auth/auth.schema.ts

```typescript
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email({ message: 'Email should be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 character' })
    .max(16, { message: 'Password must not exceed 16 character' }),
});
## 14. Middleware Architecture

### AuthCheck Middleware (src/middlewares/authCheck.ts)

**Purpose**: JWT authentication and role-based authorization middleware
**Execution Context**: All protected routes

**Middleware Function**:
```typescript
const authCheck = (...authRole: string[]) => async (req, res, next) => {
  // Extract token from headers or cookies
  const accessToken = req.headers.authorization || req.cookies.accessToken;
  
  // Verify JWT
  const verifiedToken = await verifyJwtToken(accessToken, envVars.JWT_ACCESS_SECRET);
  
  // Find user in database
  const existedOwner = await prisma.user.findUnique({
    where: { email: verifiedToken.email },
  });
  
  // Validate user status
  if (!existedOwner) throw new AppError(404, 'You are not authorized owner');
  if (existedOwner.isActive === 'BLOCKED' || existedOwner.isActive === 'INACTIVE') 
    throw new AppError(401, `You are ${existedOwner.isActive}! Please activate first`);
  if (!existedOwner.isVerified) throw new AppError(400, 'You are not verified');
## 15. Validation Architecture

### Zod Schema Implementation

**Validation Middleware** (src/middlewares/requestValidator.ts):
```typescript
export const requestValidator = (zodSchema: ZodObject<ZodRawShape>) => async (req, res, next) => {
  try {
    // JSON body parsing
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    
    // File assignment
    if (req.file && req.file.path) {
      req.body.image = req.file.path;
    }
    
    if (req.files && Array.isArray(req.files)) {
      const files = req.files as Express.Multer.File[];
      req.body.images = files.map((file) => file.path);
    }
    
    // Apply validation
    req.body = await zodSchema.parseAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
```

### Module Schemas

#### Auth Module (src/modules/auth/auth.schema.ts)
```typescript
export const LoginSchema = z.object({
  email: z.email({ message: 'Email should be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password should be at least 8 character' })
    .max(16, { message: 'Password must not exceed 16 character' }),
});
```

#### Blog Module (src/modules/blog/blog.schmea.ts)
**Note**: Typo in filename (schmea.ts instead of schema.ts)

**Create Schema**:
```typescript
export const blogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  images: z.array(z.url("Each image must be a valid URL")).nonempty("At least one image is required"),
  published: z.boolean(),
  publishedDate: z.preprocess(
## 16. Error Handling

### Custom Error Class (src/errorHelper/error.ts)

**Error Structure**:
```typescript
class AppError extends Error {
  public statusCode: number;
  
  constructor(statusCode: number, message: string, stack= "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

### GlobalError Middleware (src/middlewares/globalError.ts)

**Purpose**: Centralized error processing and standardized error responses
**Execution Order**: After all route handlers and other middleware

**Error Processing Flow**:
1. Process raw error through processRawError() function
2. Log detailed stack traces for 500+ errors
3. Send standardized JSON response with error details

### Error Classification and Handling

#### ZOD Validation Errors
**Status Code**: 400 Bad Request
**Response Format**:
```json
{
  "success": false,
  "message": "Validation failed. Check the errors array for details.",
  "errors": [
    {
      "path": "field.name",
      "message": "Error description"
    }
  ],
  "err": null,
  "stack": null
}
```

#### JWT Authentication Errors
## 17. Response Architecture

### Response Utility (src/utils/response.ts)

**Purpose**: Standardized response formatting across all endpoints
**File**: src/utils/response.ts

**Interface**:
```typescript
interface IMeta {
  totalpage?: number;
  page?: number;
  limit?: number;
  total?: number;
}

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IMeta;
}
```

**Export Function**:
```typescript
export const sendResonse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
```

### Response Format

**Success Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": {...responseData...},
  "meta": {...paginationMetadata...}
}
```

**Error Response**:
## 18. File Uploads and Cloudinary

### File Upload Configuration

**Multer Setup** (src/configs/multerConfig.ts):
```typescript
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '-')
      .replace(/[^a-z0-9\-.]/g, '');

    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${fileExtension}`;

    return {
      public_id: uniqueFileName,
      folder: 'portfolio',
      resource_type: 'auto',
    };
  },
});

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
```

### Cloudinary Configuration

**File**: src/configs/cloudinaryConfig.ts

**Configuration**:
```typescript
cloudinary.config({
  cloud_name: envVars.CLOUDINARY_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});
```

### Upload Functions

**Primary Upload** (uploadBufferCloudinary):
```typescript
export const uploadBufferCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
## 19. Environment Configuration

### Environment Variables

**File**: src/configs/envVars.ts

**Variable Definitions**:
```typescript
interface IEnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  OWNER_EMAIL: string;
  OWNER_PASSWORD: string;
  BCRYPT_SALT: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_URL: string;
}
```

### Environment Loading

**Loading Mechanism** (src/configs/envVars.ts):
```typescript
const envvarriables = (): IEnvVars => {
  const varriables: string[] = [
    "PORT",
    "NODE_ENV", 
    "DATABASE_URL",
    "FRONTEND_URL",
    "OWNER_EMAIL",
    "OWNER_PASSWORD",
    "BCRYPT_SALT",
    "JWT_REFRESH_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
## 20. CORS and HTTP Configuration

### CORS Configuration (src/app.ts)

**Origin Configuration**:
```typescript
app.use(
  cors({
    origin: envVars.FRONTEND_URL as string,
    credentials: true,
  }),
);
```

### CORS Characteristics

**Origin Restriction**:
- Only allows requests from FRONTEND_URL environment variable
- No wildcard (*) for all origins
- Frontend URL must be explicitly configured
## 21. TypeScript and Code Organization

### TypeScript Configuration (tsconfig.json)

**Compiler Options**:
```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Code Organization Structure

**Directory Layout** (src/):
```
src/
├── configs/           # Configuration modules
├── errorHelper/       # Error handling utilities
├── middlewares/       # Express middleware
├── modules/           # Feature implementations
│   ├── auth/
│   ├── blog/
│   ├── project/
│   ├── users/
│   └── workExperience/
├── utils/             # Shared utilities
├── app.ts             # Express application
└── server.ts          # Application entry point
```

### TypeScript Characteristics

**Strengths**:
- Strict type checking enabled
- CommonJS module system
- ES2016 target for broad compatibility
- Consistent file naming

**Limitations**:
- No explicit path mapping for imports
- Module system may cause compatibility issues
- Strict mode requires careful type annotations
## 22. Deployment Architecture

### Primary Deployment Method: Vercel

**Configuration**: vercel.json

**Vercel Setup**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### Alternative Deployment: Docker

**Dockerfile** (Dockerfile):
```dockerfile
FROM node:24
## 23. Current Architectural Strengths

### Code Structure

**Modular Design**:
- Clear separation of concerns with distinct directories
- Feature modules follow consistent patterns
- Standardized naming conventions across the codebase

**Type Safety**:
- Full TypeScript support with strict type checking
- Interface definitions for all data structures
- Generic response types for consistency

**Error Handling**:
- Centralized error processing in globalError middleware
- Structured error responses with consistent format
- Custom AppError class for application-specific errors

### Technology Stack Choices

**Bun Runtime**:
- Fast performance for development and production
- Native JavaScript/TypeScript support
- Modern package management with bun.lock

**Prisma ORM**:
- Type-safe database operations
- Automatic query generation
- Migration support for database changes

**JWT Authentication**:
- Stateless authentication
- Secure token-based authorization
- Refresh token mechanism for long-running sessions

### Design Patterns

**Middleware Chain**:
- Consistent middleware execution order
## 24. Current Architectural Complexity

### Code Complexity Areas

#### 1. Misspellings and Typos
- Filename: blog.schmea.ts (typo in filename)
- Field Name: descripion (typo in WorkExperince model)
- Model Name: WorkExperince (typo in Prisma model)
- Interface Name: IWorkExperince (typo in TypeScript interface)

#### 2. Duplicate Logic
- Cloudinary Upload: Duplicate upload logic in uploadBufferCloudinary function
- Folder Names: Both 'portfolio' and 'pdf' folders used inconsistently
- Folder Typo: 'porfolio' instead of 'portfolio' in some places

#### 3. Validation Issues
- Missing Validation: UserId validation in WorkExperience doesn't match authenticated user
- Update Schema: All optional fields in WorkExperience update schema
- Complex Validation: Some schemas overly complex (e.g., blogCreateSchema)

#### 4. Service Layer Complexity
- Multiple Service Files: Separate services for each module
- Repetitive Patterns: Similar CRUD operations across services
- Inconsistent Return Types: Some services return objects, others return arrays

#### 5. Authentication Complexity
- Multiple Token Types: Access token and refresh token separate
- Complex Flow: Token refresh involves multiple steps
- Cookie Management: Multiple cookie types and settings

### Architectural Issues

#### 1. Database Schema Issues
- Model Typos: WorkExperince instead of WorkExperience
- Field Typos: descripion instead of description
- Inverse Relation Typos: Interface names don't match Prisma model names

#### 2. Code Quality Issues
- Function Name Typo: sendResonse instead of sendResponse
- File Name Typo: blog.schmea.ts instead of blog.schema.ts
- Import Issues: Some imports reference non-existent files

#### 3. Validation Complexity
- Overly Complex Schemas: Some Zod schemas too complex
- Inconsistent Validation: Different validation patterns across modules
- Missing Validation: Some endpoints lack validation

#### 4. Error Handling Issues
- Error Propagation: Errors pass through multiple layers
- Error Response Format: Inconsistent error formatting
- Development vs Production: Different error visibility

### Performance Considerations

#### 1. Database Queries
- N+1 Problem: Potential for multiple database queries
- Missing Indexing: Some queries may benefit from additional indexes
- Transaction Usage: Used for view counting but may impact performance

#### 2. File Upload
- Cloudinary Calls: Multiple API calls for file operations
- Duplicate Uploads: Potential duplicate uploads in some cases
- File Size Limits: 10MB limit may be restrictive for some use cases

#### 3. Caching
- No Caching: Limited caching implementation
- View Counting: Each blog view requires database update
- Response Caching: No response-level caching

### Maintainability Issues

#### 1. Code Duplication
- Service Logic: Similar CRUD patterns across services
- Middleware Logic: Duplicate authentication/authorization checks
- Validation Logic: Similar validation patterns across modules

#### 2. Complex Dependencies
- Circular Imports: Potential circular dependencies
- Complex Middleware Chain: Multiple middleware layers
- Global State: Prisma client singleton across application

#### 3. Testing Challenges
- Integration Testing: Difficult due to multiple layers
- Database Dependencies: Tests require database setup
- Mock Complexity: Complex mocking of external services

### Security Concerns

#### 1. Environment Variables
- Git Tracked Secrets: .env.dev tracked in Git (security risk)
- No Secret Management: Manual environment variable management
- Development vs Production: Same configuration for all environments

#### 2. Authentication
- Cookie Security: Potential XSS if not properly secured
- Token Storage: Tokens stored in cookies (httpOnly helps)
- Session Management: No session invalidation mechanism

#### 3. Input Validation
- SQL Injection: Prisma provides protection
- XSS Prevention: No output encoding visible
- File Upload Security: Limited file type validation

### Technical Debt

#### 1. Architecture Debt
- Inconsistent Patterns: Different patterns across modules
- Technical Issues: Typos and naming inconsistencies
- Complexity: Overly complex validation and error handling

#### 2. Code Debt
- Code Duplication: Repeated code patterns
- Technical Issues: Outdated TypeScript target
- Code Quality: Missing proper project structure

#### 3. Infrastructure Debt
- Deployment Issues: Multiple deployment methods with risks
- Environment Issues: Poor environment variable management
- Performance Issues: No performance optimization visible
- Separation of concerns (auth, validation, processing)
- Clear error propagation through middleware chain

**Controller/Service Pattern**:
- Controllers handle HTTP request/response
- Services contain business logic
- Clear separation of Express dependencies

### Database Design

**Relationships**:
- Properly defined foreign key constraints
- Cascade behavior for data integrity
- Comprehensive relationship definitions

**Indexing Strategy**:
- Unique indexes on critical fields (email, slug)
- Proper index selection for query optimization

### Authentication and Authorization

**Role-Based Access Control**:
- Owner and Manager roles defined
- Middleware checks role membership
- Protected routes require appropriate roles

**Secure Token Management**:
- HttpOnly cookies for security
- Secure and SameSite=None for cross-origin requests
- Token refresh mechanism

### Validation Implementation

**Zod Validation**:
- Comprehensive validation across all modules
- Structured error messages with field paths
- Runtime type validation for all request bodies

**Request Validation Flow**:
1. Body parsing and modification
2. File handling and path assignment
3. Schema validation
4. Error handling

### Deployment Configuration

**Multiple Deployment Options**:
- Vercel for serverless deployment
- Docker for containerized deployment
- Clear build and start processes

**Environment Management**:
- Environment variable validation
- Multiple deployment configurations

### Data Flow Patterns

**Consistent Request Processing**:
- Uniform middleware execution order
- Standardized request/response flow
- Consistent error handling

WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock* ./
COPY prisma ./prisma

RUN bun install

COPY . .

RUN bun run build

EXPOSE 5000

CMD ["bun", "run", "start"]
```

### Environment Configuration

**.env.dev** (Git tracked - security concern):
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FRONTEND_URL=http://localhost:3000
OWNER_EMAIL=owner@example.com
OWNER_PASSWORD=securepassword123
BCRYPT_SALT=10
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

**.gitignore**:
```gitignore
# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local
.env.dev
```

### Deployment Architecture Characteristics

**Vercel Deployment**:
- Automatic scaling
- Global CDN distribution
- Serverless architecture

**Docker Deployment**:
- Persistent state management
- Control over environment
- Multiple instance support

### Module Boundaries

**Configuration Layer** (src/configs/):
- Environment variables
- Database connection
- Cloudinary configuration
- Multer configuration

**Middleware Layer** (src/middlewares/):
- Authentication
- Validation
- Error handling
- Request/response processing

**Feature Modules** (src/modules/):
- auth: Authentication logic
- blog: Blog content management
- project: Project portfolio management
- users: User management
- workExperience: Work experience management

**Utility Layer** (src/utils/):
- Async function wrapper
- JWT token generation
- Response formatting
- Cookie handling
- Seed owner creation

### Code Quality Characteristics

**Naming Conventions**:
- PascalCase for classes and interfaces
- camelCase for functions and variables
- kebab-case for file names

**Type Safety**:
- Full TypeScript compilation
- Interface-based typing
- Generic response types

**Error Handling**:
- Custom AppError class
- Structured error responses
- Centralized error middleware

### Dependencies Management

**Package.json Scripts**:
```json
{
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "build": "tsc",
    "start": "bun run dist/server.js",
    "lint": "eslint 'src/**/*.{ts,tsx,js}'",
    "lint:fix": "eslint 'src/**/*.{ts,js}' --fix",
    "postinstall": "prisma generate"
  }
}
```

### TypeScript Compilation

**Build Process**:
1. npm run build → tsc compiles TypeScript to JavaScript
2. Output placed in dist/ directory
3. npm start → bun run dist/server.js runs compiled code
4. bun --watch src/server.ts for development with hot reload

### Code Organization Benefits

**Separation of Concerns**:
- Configuration isolated in configs/
- Middleware in middlewares/
- Business logic in modules/
- Shared utilities in utils/

**Maintainability**:
- Clear directory structure
- Type safety with TypeScript
- Consistent naming conventions

**Extensibility**:
- Modular architecture allows easy feature addition
- Clear separation of concerns
- Standardized error handling

### TypeScript Limitations

**Current Issues**:
- No explicit module resolution configuration
- CommonJS modules may cause compatibility issues
- TypeScript configuration targets older ECMAScript version
- No project references for monorepo support

### Code Quality Improvements Needed

**Recommendations**:
1. Add explicit path mapping for imports
2. Update TypeScript target to modern ECMAScript version
3. Consider using project references
4. Add Jest for testing
5. Add proper error boundary handling

**Credential Support**:
- credentials: true enables cookie-based authentication
- Allows credentials (cookies, authorization headers) to be sent
- Required for JWT cookie authentication

### HTTP Middleware Configuration (src/app.ts)

```typescript
app.use(compression());                    // Gzip compression
app.use(express.json());                   // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL encoded parsing
cookieParser();                            // Cookie parsing
app.use('/api/v1', appRoutes);            // Route mounting
```

### HTTP Configuration Characteristics

**Strengths**:
- Proper CORS configuration for security
- Compression for performance
- JSON body parsing
- URL encoded parsing
- Cookie parsing for authentication

**Limitations**:
- CORS origin is fixed from environment variable
- No additional security headers (CSP, HSTS, etc.)
- No request size limits configured
- No rate limiting
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_URL",
  ];
  
  varriables.map((envItem: string) => {
    if (!process.env[envItem]) {
      throw new Error(`Missing envoirnment varriabls ${envItem}`);
    }
  });
  
  return {
    PORT: parseInt(process.env.PORT as string),
    NODE_ENV: process.env.NODE_ENV as string,
    // ... other variables
  };
};
```

### Environment Variables Details

| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| PORT | number | Server port | Yes |
| NODE_ENV | string | Node environment (development, production) | Yes |
| DATABASE_URL | string | PostgreSQL connection string | Yes |
| FRONTEND_URL | string | Frontend application URL | Yes |
| OWNER_EMAIL | string | Default owner email | Yes |
| OWNER_PASSWORD | string | Default owner password | Yes |
| BCRYPT_SALT | string | bcrypt salt rounds | Yes |
| JWT_ACCESS_SECRET | string | JWT access token secret | Yes |
| JWT_ACCESS_EXPIRES | string | JWT access token expiration | Yes |
| JWT_REFRESH_SECRET | string | JWT refresh token secret | Yes |
| JWT_REFRESH_EXPIRES | string | JWT refresh token expiration | Yes |
| CLOUDINARY_NAME | string | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | string | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | string | Cloudinary API secret | Yes |
| CLOUDINARY_URL | string | Cloudinary URL | Yes |

### Environment File

**Development Environment** (.env.dev):
```bash
# Server
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FRONTEND_URL=http://localhost:3000

# Owner credentials
OWNER_EMAIL=owner@example.com
OWNER_PASSWORD=securepassword123

# Salt
BCRYPT_SALT=10

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES=7d

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

### Environment Security

**Security Considerations**:
- Secrets in .env.dev file
- .env.dev is tracked in Git (security issue)
- No environment-specific configuration
- No .env.example file provided

### Environment Validation

**Validation Logic** (src/configs/envVars.ts):
1. Checks all required variables are present
2. Throws error if any missing variable
3. Converts numeric variables to numbers
4. Returns validated environment object

**Error Example**:
```
Error: Missing envoirnment varriabls DATABASE_URL
```
    const public_id = `porfolio/${fileName}-${Date.now()}`; // Note: typo 'porfolio'
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'auto',
          public_id,
          folder: 'pdf',
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result as UploadApiResponse);
        }
      )
      .end(buffer);
  });
};
```

### Delete Function

**Delete Image** (deleteImageFromCloudinary):
```typescript
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Failed to delete image in cloudinary',
      error.message,
    );
  }
};
```

### Upload Endpoint Configuration

**File**: src/configs/cloudinaryConfig.ts

**Upload Destinations**:
- Blogs: multerUpload.array('files') - Multiple images
- Projects: multerUpload.single('file') - Single image

**Folder Structure**:
- Primary folder: 'portfolio'
- Secondary folder: 'pdf' (duplicate logic)
- Misspelled folder: 'porfolio' (typo)

### File Handling Characteristics

**File Processing**:
1. Client uploads file via request body
2. Multer processes file and stores in memory
3. File sent to Cloudinary via uploadBufferCloudinary
4. Cloudinary returns uploaded URL
5. URL stored in database

**Error Handling**:
- Max file size: 10MB (configurable via limits)
- File type validation via Cloudinary (auto resource_type)
- Error handling in uploadBufferCloudinary and deleteImageFromCloudinary

### Security Considerations

**File Upload Security**:
- Size Limits: 10MB max per file
- Type Validation: Cloudinary auto-detects resource type
- Storage: Files stored externally (Cloudinary), not in database
- Access Control: Upload endpoints require authentication

**Potential Issues**:
- Duplicate Upload Logic: Two upload streams with different folders
- Typo in Folder Name: 'porfolio' instead of 'portfolio'
- No File Validation: No explicit validation of file types or content

### Upload Response

**Successful Upload Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Blog successfully created",
  "data": {
    "id": 1,
    "title": "Blog Title",
    "images": ["https://res.cloudinary.com/cloud_name/..."],
    // ... other fields
  },
  "meta": null
}
```

**Error Upload Response**:
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Blog creation failed",
  "data": null,
  "meta": null
}
```
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description",
  "data": null,
  "meta": null
}
```

### Controller Response Pattern

**Standard Success Response** (blogController.createBlog):
```typescript
const createBlog = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const newBlog = await blogService.createBlog(req.body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Blog successfully created',
      data: newBlog,
    });
  },
);
```

**Standard Error Response**:
- Errors are handled by globalError middleware
- Custom AppError instances preserve statusCode
- Zod validation errors return 400 with structured error details

### Response Characteristics

**Success Responses**:
- Consistent structure across all endpoints
- Metadata included for paginated endpoints
- Appropriate HTTP status codes (200, 201, etc.)

**Error Responses**:
- Structured error details for validation errors
- User-friendly messages in production
- Detailed error information in development
- Consistent status codes per error type

**Pagination Metadata**:
```json
{
  "page": 1,
  "limit": 10,
  "totalpage": 5,
  "total": 50
}
```

### Response Utility Usage

**All Controllers** use sendResonse() for standardized responses:

**Blog Module Examples**:
- blogController.getAllBlog - includes pagination metadata
- blogController.createBlog - returns created blog
- blogController.GetBlog - returns single blog with view count

**Project Module Examples**:
- projectController.getAllProject - includes total count
- projectController.createProject - returns created project

### Response Type Safety

**TypeScript Integration**:
- IResponse<T> generic type parameter
- Strongly typed controller functions
- IDE support for response structure

### Response Error Handling

**Error Response Flow**:
1. Controller throws AppError or other error
2. asyncFunc() wrapper catches error
3. Error passed to globalError middleware
4. processRawError() converts error to AppError instance
5. Standardized error response sent via globalError

### Response Standardization

**Benefits**:
- Consistent API response format
- Type safety with TypeScript
- Easier client-side handling
- Standardized error responses

**Limitations**:
- Requires consistent error handling across all services
- Potential for over-standardization
- Requires careful maintenance of response structure
**Status Code**: 401 Unauthorized
**Types**:
- JsonWebTokenError: Invalid token signature or format
- TokenExpiredError: Access token expired

#### Prisma Database Errors
**Status Code**: Varies (404, 409, 500)

| Code | Description | Status Code | Message |
|------|-------------|-------------|---------|
| P2002 | Unique constraint failed | 409 | A record with this value already exists for the field: ${field}. |
| P2025 | Record not found | 404 | The requested resource was not found. |
| P2003 | Foreign key constraint violated | 409 | Database foreign key error |
| Other | Generic database error | 500 | A database error occurred. |

#### Custom AppError
**Status Code**: Preserved from AppError instance
**Message**: Preserved from AppError instance

#### Generic Errors
**Status Code**: 500 (default) or provided statusCode
**Message**: Error message or generic fallback

### Error Response Format

**Standard Error Response**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* Structured error details */ },
  "err": null, // Only populated in development mode
  "stack": null // Only populated in development mode
}
```

**Development vs Production**:
- Development: Includes full error details and stack trace
- Production: Only user-friendly error message

### Error Logging

**GlobalError Middleware Logging**:
```typescript
const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
  const error = processRawError(err);
  console.log(error);
  
  // Log detailed stack trace for all 500 errors
  if (error.statusCode >= 500) {
    console.error(`[FATAL] Server Error ${error.statusCode}:`, error.stack || error.message);
  }
  
  // Send standardized JSON response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error,
  });
};
```

### Error Handling Characteristics

**Strengths**:
- Centralized error handling in globalError middleware
- Structured error responses with consistent format
- Comprehensive error type coverage (Zod, JWT, Prisma, custom, generic)
- Different behavior for development vs production

**Limitations**:
- All errors eventually pass through globalError, including successful responses
- No centralized error logging to external services
- Error handling logic duplicated across services (some services have custom error handling)
- No retry mechanism for transient errors

### Error Recovery

**Database Connection Failure**:
- Behavior: Immediate process exit via process.exit(1)
- Recovery: None (requires application restart)

**Authentication Failures**:
- Behavior: Return 401 with error message
- Recovery: Client can retry with valid credentials or token refresh

**Validation Failures**:
- Behavior: Return 400 with field-specific error details
- Recovery: Client can correct input and retry
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ message: "Published date is required" })
  ),
  slug: z.string().min(1, "Slug is required"),
  authorId: z.number(),
  tags: z.array(z.string()).optional().default([]),
});
```

**Update Schema**:
```typescript
export const blogUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  images: z.array(z.url("Each image must be a valid URL")).nonempty("At least one image is required").optional(),
  published: z.boolean().optional(),
  publishedDate: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ message: "Published date is required" })
  ).optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  authorId: z.number().optional(),
  tags: z.array(z.string()).optional(),
});
```

#### Project Module (src/modules/project/project.schema.ts)
**Create Schema**:
```typescript
export const ProjectCreateSchema = z.object({
  title: z.string().min(3, 'Project title is required').min(3, 'Project title must be at least 3 characters long'),
  description: z.string().min(10, 'Project description must be at least 10 characters long'),
  image: z.string().url('Project image must be a valid URL').min(1, 'Project image URL is required').optional(),
  techStack: z.array(z.string().min(1, 'Tech stack item cannot be empty')).min(1, 'At least one tech stack item is required'),
  liveUrl: z.string().url('Live URL must be a valid link').min(1, 'Live project URL is required'),
  githubUrl: z.string().url('GitHub URL must be a valid link').min(1, 'GitHub repository URL is required'),
  userId: z.number().positive('User ID must be a positive number'),
});
```

#### Work Experience Module (src/modules/workExperience/workExp.schema.ts)
**Create Schema**:
```typescript
export const WorkExperienceCreateSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  descripion: z.string().min(1, 'Description is required'), // Note: typo
  userId: z.number(),
  startDate: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
  endDate: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
});
```

### Validation Error Handling

**GlobalError Middleware**:
```typescript
const processRawError = (err: any): typeof AppError.prototype => {
  // ZOD VALIDATION ERRORS
  if (isZodError(err)) {
    const validationErrors = err.errors.map((error: any) => ({
      path: error.path.join('.'),
      message: error.message,
    }));
    return new AppError(400, 'Validation failed. Check the errors array for details.', validationErrors);
  }
  
  // JWT AUTHENTICATION ERRORS
  if (isJWTError(err)) {
    // ... error handling
  }
  
  // PRISMA DATABASE ERRORS
  if (isPrismaError(err)) {
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        // ... conflict handling
      case 'P2025': // Record not found
        return new AppError(404, 'The requested resource was not found.');
      // ... other cases
    }
  }
  
  // CUSTOM ERRORS
  if (err instanceof AppError) {
    return err;
  }
  
  // GENERIC ERRORS
  const statusCode = err.statusCode || 500;
  return new AppError(statusCode, err.message || 'An unexpected internal server error occurred.', err.stack);
};
```

### Validation Characteristics

**Strengths**:
- Comprehensive validation across all modules
- Structured error messages with field paths
- Type-safe validation with Zod runtime checks
- Consistent error response format

**Limitations**:
- Schema duplicates validation logic in services
- Typo in blog schema filename (schmea.ts)
- Work experience schema field name typo (descripion)
- UserId validation in work experience but not enforced against authenticated user
  
  // Role authorization
  if (!authRole.includes(existedOwner.role)) 
    throw new AppError(401, 'Authorization required to access');
  
  // Attach user to request
  req.user = verifiedToken;
  console.log('Owner is authenticated');
  next();
};
```

### RequestValidator Middleware (src/middlewares/requestValidator.ts)

**Purpose**: Zod validation and request body preprocessing
**Execution Context**: Routes using validation middleware

**Key Features**:
1. JSON Body Parsing: Processes req.body.data → req.body
2. File Path Assignment: Assigns file paths to request body
3. Zod Validation: Applies Zod schema validation
4. Error Handling: Passes validation errors to globalError middleware

**File Upload Handling**:
```typescript
// Single file upload
if (req.file && req.file.path) {
  req.body.image = req.file.path;
}

// Multiple file upload
if (req.files && Array.isArray(req.files)) {
  const files = req.files as Express.Multer.File[];
  req.body.images = files.map((file) => file.path);
}
```

### GlobalError Middleware (src/middlewares/globalError.ts)

**Purpose**: Centralized error processing and standardized error responses
**Execution Context**: All errors in application

**Error Processing Flow**:
1. Process raw error through processRawError() function
2. Log detailed stack traces for 500+ errors
3. Send standardized JSON response with error details

### Error Classification

**Error Types Processed**:
- Zod Validation Errors: 400 Bad Request
- JWT Authentication Errors: 401 Unauthorized
- Prisma Database Errors: 404 (not found), 409 (conflict), 500 (database)
- Custom AppError: Preserves original status code and message
- Generic Errors: 500 Internal Server Error

**Error Response Format**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* Structured error details */ },
  "err": null, // Only in development
  "stack": null // Only in development
}
```

### NotFound Middleware (src/middlewares/notFound.ts)

**Purpose**: Handler for unmatched routes
**Response**:
```json
{
  "success": false,
  "message": "Route not found"
}
```
```

### Middleware Configuration

**AuthCheck Middleware** (src/middlewares/authCheck.ts):
- Purpose: JWT authentication and role-based authorization
- Route Application: All protected routes (authCheck(...Object.values(Role)))
- Authorization: OWNER and MANAGER roles
- Token Extraction: From headers or cookies

### Current Authentication State

**Strengths**:
- JWT-based stateless authentication
- Secure cookie configuration (httpOnly, secure, SameSite=none)
- Token refresh mechanism
- Role-based access control

**Limitations**:
- No token revocation or blacklist
- Password reset not implemented
- No MFA support
- Token reuse allowed after refresh
- Token storage in cookies (potential XSS risk if not httpOnly)
  accessToken: string,
  refreshToken: string,
) => {
  let email: string | undefined;
  
  try {
    await verifyJwtToken(accessToken, envVars.JWT_ACCESS_SECRET as string);
    return {
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      const verifiedRefreshToken = await verifyJwtToken(
        refreshToken,
        envVars.JWT_REFRESH_SECRET as string,
      ) as JwtPayload;
      
      email = verifiedRefreshToken.email;
      
      if (!email) {
        throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid refresh token`);
      }
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid token`);
    } else {
      throw new AppError(StatusCodes.UNAUTHORIZED, error.message);
    }
  }
  
  if (!email) {
    throw new AppError(StatusCodes.UNAUTHORIZED, `Invalid or no tokens found`);
  }
  
  const existedOwner = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!existedOwner) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized owner');
  }
  
  if (
    existedOwner.isActive === 'BLOCKED' ||
    existedOwner.isActive === 'INACTIVE'
  ) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      `You are ${existedOwner.isActive}! Please activate first`,
    );
  }
  
  if (!existedOwner.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You are not verified');
  }
  
  const jwtPayload: JwtPayload = {
    id: existedOwner.id,
    email: existedOwner.email,
    role: existedOwner.role,
  };
  
  const tokens = await createUserTokens(jwtPayload);
  
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};
```
    const verifiedToken = await jwt.verify(token, secret)
    return verifiedToken
}
```

### Authentication Controllers

**File**: src/modules/auth/auth.controller.ts

#### Login Controller
```typescript
const ownerLogin = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const ownerCredentials = await authServices.ownerLogin(email, password);
    
    if (!ownerCredentials.accessToken && !ownerCredentials.data) {
      throw new AppError(StatusCodes.BAD_GATEWAY, 'Login failed');
    }
    
    await setAuthCookies(res, {
      accessToken: ownerCredentials.accessToken,
      refreshToken: ownerCredentials.refreshToken,
    });
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Owner successfully logged in ',
      data: ownerCredentials,
    });
  },
);
```

#### Logout Controller
```typescript
const ownerLogOut = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Owner successfully logOut ',
      data: null,
    });
  },
);
```

#### Token Generation Controller
```typescript
const generateNewAccessToken = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken || req.headers.authorization;
    const accessToken = req.cookies.accessToken || req.headers.authorization;
    
    const ownerCredentials = await authServices.generateNewAccessToken(
      accessToken,
      refreshToken,
    );
    
    if (!ownerCredentials.accessToken) {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        'Generating access tokens failed',
      );
    }
    
    await setAuthCookies(res, {
      accessToken: ownerCredentials.accessToken,
      refreshToken: ownerCredentials.refreshToken,
    });
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'AccessToken successfully generated',
      data: ownerCredentials,
    });
  },
);
```
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE", 
  BLOCKED = "BLOCKED"
}

export enum Role {
  OWNER = "OWNER",
  MANAGER = "MANAGER"
}
```

### Authentication and User Management

#### User Retrieval (GET /api/v1/users/getme)
```typescript
const getMe = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.user.email;
    const owner = await userService.getMe(email);
    
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully retrived owner',
      data: owner,
    });
  },
);
```

#### User Creation (POST /api/v1/users/)
```typescript
const create = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    
    const newUser = await userService.create(body);
    sendResonse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully created',
      data: newUser,
    });
  },
);
```

### Service Implementation

**File**: src/modules/users/user.services.ts

#### getMe Function
```typescript
const getMe = async (email:string)=>{
    const me = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if (!me) {
        throw new AppError(StatusCodes.NOT_FOUND, "Owner not found")
    }
    return me
}
```

#### create Function
```typescript
const create = async(payload:any)=>{
    
    const newUser = await prisma.user.create({
        data:payload
    })
    return newUser
}
```

### User Module Characteristics

**Protected Access**:
- GET /getme requires authentication via authCheck(...Object.values(Role))
- Retrieves currently authenticated user based on JWT email claim

**Public Registration**:
- POST / allows user creation without authentication
- No validation schema applied
- Direct payload insertion into database

**Data Access**:
- Protected endpoint returns complete user profile including relationships
- Includes Blog, Project, and WorkExperince arrays (if loaded)
- Uses req.user.email from JWT middleware for user identification

### Database Relations

**User Model** (src/prisma/schema.prisma):
```prisma
model User {
  // ... fields ...
  Blog          Blog[]
  Project       Project[]
  WorkExperince WorkExperince[]
}
```

**Interface Alignment**:
- IUser interface matches Prisma User model structure
- Includes relationship arrays for Blog, Project, WorkExperince

### Security Considerations

**Password Handling**:
- Passwords are hashed via bcrypt (not plain text)
- No password reset mechanism implemented
- Password update functionality not available

**Access Control**:
- Users can only access their own profile via /getme
- No admin or user management endpoints provided
- Role-based access control via authCheck middleware
  descripion: z.string().min(1, 'Description is required'), // Note: typo
  userId: z.number(),
  startDate: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
  endDate: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) return new Date(val);
    return val;
  }, z.date()),
});
```

### Work Experience Update Schema

```typescript
export const WorkExperienceUpdateSchema = z.object({
  companyName: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  descripion: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
```

### Service Layer Implementation

**File**: src/modules/workExperience/workExp.service.ts

**createWorkExp Function**:
```typescript
const createWorkExp = async (payload: any) => {
  const newWorkExp = await prisma.workExperince.create({
    data: payload,
  });
  
  if (!newWorkExp) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'Failed to create Work experince',
    );
  }
  return newWorkExp;
};
```

**getAllWorkExp Function**:
```typescript
const getAllWorkExp = async () => {
  const allWorkExp = await prisma.workExperince.findMany({
    take: 4,
  });
  if (!allWorkExp || allWorkExp.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Work experince not found');
  }
  
  const totalWorkExpCount = await prisma.workExperince.count();
  
  return {
    data: allWorkExp,
    total: totalWorkExpCount,
  };
};
```

### Validation Issues

1. Schema field names use descripion (typo) matching Prisma model
2. Interface name: IWorkExperince (typo) used throughout code
3. Model name: WorkExperince (typo) in Prisma schema
4. UserId validation in schema but not enforced against authenticated user

**Update Schema Issues**:
- All fields optional, allowing partial updates
- No required fields for update operation
  githubUrl: z.string().url('GitHub URL must be a valid link').min(1, 'GitHub repository URL is required'),
  userId: z.number().positive('User ID must be a positive number'),
});
```

### Image Upload

**Multer Configuration**:
- multerUpload.single('file') for single image upload
- Cloudinary storage with folder: 'portfolio'
- Max file size: 10MB

**Database Storage**:
- Image URL stored in image field of Project model
- URL comes from Cloudinary upload response

### Service Layer Pattern

**File**: src/modules/project/project.service.ts

**createProject Function**:
```typescript
const createProject = async (payload: any) => {
  const newProject = await prisma.project.create({
    data: payload,
  });
  if (!newProject) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'Failed to create a project');
  }
  return newProject;
};
```

**getAllProject Function**:
```typescript
const getAllProject = async () => {
  const allProject = await prisma.project.findMany({
    take: 4, // Limit to 4 projects
  });
  if (!allProject || allProject.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Projects not found');
  }
  
  const allProjectCount = await prisma.project.count();
  
  return {
    data: allProject,
    total: allProjectCount,
  };
};
```

### Response Format

**Success Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Projects successfully retrieved",
  "data": [...projectData...],
  "meta": {
    "total": 12
  }
}
```
  → requestValidator (none for GET)
  → blogController.GetBlog
    → blogService.getBlog(slug)
      → prisma.$transaction:
        - Update views count
        - Find blog by slug
      → return blog
    → sendResponse
```

#### Blog Creation (POST /api/v1/blogs/create):
```
HTTP Request
  → Multer (array of files)
  → AuthCheck (manager/owner required)
  → requestValidator (Zod schema)
  → blogController.createBlog
    → blogService.createBlog(req.body)
      → Check duplicate slug
      → Create blog in database
    → sendResponse
```

### Validation (Zod) (blog.schmea.ts)

```typescript
export const blogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  images: z.array(z.url("Each image must be a valid URL")).nonempty("At least one image is required"),
  published: z.boolean(),
  publishedDate: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : undefined),
    z.date({ message: "Published date is required" })
  ),
  slug: z.string().min(1, "Slug is required"),
  authorId: z.number(),
  tags: z.array(z.string()).optional().default([]),
});
```

### Cloudinary Integration

**File**: src/configs/cloudinaryConfig.ts

**Upload Function**:
```typescript
export const uploadBufferCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  // Upload to Cloudinary using stream
};
```

**Multer Storage** (src/configs/multerConfig.ts):
```typescript
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const fileName = sanitizeFileName(file.originalname);
    const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}`;
    return {
      public_id: uniqueFileName,
      folder: 'portfolio',
      resource_type: 'auto',
    };
  },
});
```

### Unique Constraints

- Slug: @unique in Prisma model ensures one blog per slug
- Duplicate Check: Service layer checks for existing slug before creation

### Relationship Structure

- User → Blog: One User can have many Blogs
- Blog → User: Each Blog has one author (User)
- Composition: Blog creation includes authorId from JWT payload
  githubUrl   String
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### WorkExperince Model (Note: Typo in model name)
```prisma
model WorkExperince {
  id          Int      @id @default(autoincrement())
  companyName String
  role        String   @db.VarChar(80)
  descripion  String   // Note: typo, should be "description"
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  startDate   DateTime
  endDate     DateTime
}
```

### Prisma Client Initialization

**File**: src/configs/db.ts
```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
```

### Database Relations and Constraints

#### Foreign Key Relationships
- User → Blog: One-to-many (User has many Blogs, Blog belongs to one User)
- User → Project: One-to-many (User has many Projects, Project belongs to one User)
- User → WorkExperince: One-to-many (User has many WorkExperince, WorkExperince belongs to one User)

#### Indexes and Constraints
- User email: @unique
- Blog slug: @unique
- User id: @id @default(autoincrement())
- Blog id: @id @default(autoincrement())
- Project id: @id @default(autoincrement())
- WorkExperince id: @id @default(autoincrement())

#### Enums
- Role: MANAGER, OWNER
- IsActive: ACTIVE, INACTIVE, BLOCKED

### Database Operations Patterns

#### Transaction Usage (blog.service.ts):
```typescript
return await prisma.$transaction(async (tx) => {
  // Update view count
  const viewIncrease = await tx.blog.update({
    where: { slug: slug },
    data: { views: { increment: 1 } }
  });
  
  // Retrieve blog
  const blog = await tx.blog.findUnique({ where: { slug: slug } });
  return blog;
});
```

#### Service Layer Pattern:
- All Prisma operations wrapped in service functions
- Business logic in services, database operations in controllers
- Error handling in services with AppError throwing
- Consistent return patterns (data or AppError)

### Database Connection Configuration

**Environment Variables** (envVars.ts):
```typescript
interface IEnvVars {
  DATABASE_URL: string
  // ... other variables
}
```

**Connection Characteristics**:
- PostgreSQL provider configured in schema.prisma
- Connection string from DATABASE_URL environment variable
- No connection pooling configuration in code
- Default Prisma client configuration
  
  // 5. Role authorization
  if (!authRole.includes(existedOwner.role)) 
    throw new AppError(401, 'Authorization required to access');
  
  // 6. Attach user to request
  req.user = verifiedToken;
  next();
};
```

### Authentication Endpoints

#### Login (POST /api/v1/auth/login):
- Input: { email, password } from request body
- Process:
  1. Find user by email in database
  2. Validate user status (ACTIVE, verified)
  3. Compare password using bcrypt
  4. Create JWT payload with user details
  5. Generate access and refresh tokens
  6. Set cookies on response
  7. Return tokens and user data

#### Logout (POST /api/v1/auth/logout):
- Clear both accessToken and refreshToken cookies
- Return success message

#### Token Generation (POST /api/v1/auth/generate-token):
- Input: Refresh token from headers or cookies
- Process:
  1. Attempt to verify existing access token
  2. If expired/invalid, verify refresh token
  3. Validate refresh token and user status
  4. Generate new access and refresh tokens
  5. Set new cookies
  6. Return new tokens

### Authorization Mechanisms

**Role-Based Access Control**:
- authCheck(...Object.values(Role)) checks user role against allowed roles
- Default roles: OWNER (full access), MANAGER (restricted access)
- Users must match at least one role in the authRole array

**Status-Based Authorization**:
- isActive status: ACTIVE → allowed, INACTIVE → blocked, BLOCKED → blocked
- isVerified status: Only true users can authenticate
- Token verification includes role validation
        → Prisma/Cloudinary queries
        → response (sendResponse utility)
```

### Request Body Processing (src/middlewares/requestValidator.ts):
1. JSON body parsing: req.body.data → req.body = JSON.parse(req.body.data)
2. Single file upload: req.file → req.body.image = req.file.path
3. Multiple file upload: req.files → req.body.images = files.map(file => file.path)
4. Zod schema validation applied after modifications

### Controller/Service Pattern:
- Controllers: Express handlers using asyncFunc() wrapper to catch promise rejections
- Services: Pure business logic without Express dependencies
- Error propagation: Errors thrown in services are caught by controller wrappers and passed to globalError