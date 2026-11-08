# My Portfolio Backend API

A secure REST API for managing personal portfolio data (projects, work experience, blogs, and resume) with admin-only access.

**Live Deployments:**
- Frontend: [https://raselsdev.vercel.app](https://raselsdev.vercel.app)
- Backend: [https://rasel-shikder-backend.vercel.app](https://rasel-shikder-backend.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Authentication & Authorization](#authentication--authorization)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users Management](#users-management)
  - [Projects](#projects)
  - [Work Experience](#work-experience)
  - [Blogs](#blogs)
  - [Resume](#resume)
  - [Health Check](#health-check)
- [Error Handling](#error-handling)
- [Response Format](#response-format)
- [File Uploads](#file-uploads)
- [Environment Variables](#environment-variables)

---

## Overview

This API provides CRUD operations for managing:
- **Users** - User profiles with role-based access (OWNER, MANAGER)
- **Projects** - Portfolio projects with tech stack and links
- **Work Experience** - Professional history with employment details
- **Blogs** - Rich content posts with image support and publishing control
- **Resumes** - PDF resume uploads linked to user profiles

**Key Features:**
- JWT-based dual-token authentication (access + refresh tokens)
- Role-based authorization for admin operations
- Role-based public/private data control
- Cloudinary for secure file storage (images, resumes)
- Prisma ORM with PostgreSQL
- Rich text sanitization
- HTTP-only secure cookies

---

## Technology Stack

| Technology | Version/Notes |
|------------|---------------|
| **Runtime** | Bun 1.0+ |
| **Framework** | Express.js |
| **ORM** | Prisma with PostgreSQL |
| **Authentication** | JSON Web Tokens (JWT) |
| **Storage** | Cloudinary for images/resumes |
| **Validation** | Zod schemas |
| **Testing** | Custom test utilities |

---

## Getting Started

### Prerequisites

- Node.js 18+ (Bun runtime preferred)
- PostgreSQL database
- Cloudinary account
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd myPortfolio-backend

# Install dependencies
bun install

# Copy environment variables template
cp .env.example .env.local

# Create database schema
npx prisma migrate dev --create-only

# Review and apply migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Environment Setup

Create [`.env.local`](.env.local) with required variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# JWT Authentication
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES="7d"

# Cloudinary
CLOUDINARY_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# CORS & Security
FRONTEND_URL="https://raselsdev.vercel.app"
BCRYPT_SALT=10

# Default Admin Credentials
OWNER_EMAIL="admin@example.com"
OWNER_PASSWORD="Admin@123456"
```

### Development Server

```bash
# Start development server with watch mode
bun run dev

# Build TypeScript
bun run build

# Run production build
bun start
```

The API will be available at `http://localhost:5000`.

---

## Authentication & Authorization

### Authentication Flow

1. **Login** → Receive access + refresh tokens (HTTP-only cookies)
2. **Access Token** (15min expiry) → Attached to Authorization header or cookie
3. **Refresh Token** (7day expiry) → Used to generate new access tokens

### Token Storage

Tokens are stored in **HTTP-only, secure, sameSite='none' cookies**:
- `accessToken` - Session token for API requests
- `refreshToken` - Token for token refresh endpoint

### Roles

| Role | Permissions |
|------|-------------|
| `OWNER` | Full admin access (all endpoints) |
| `MANAGER` | Admin access (all endpoints except user management) |

### Access Control

Protected routes require `authCheck()` middleware which validates:
- JWT signature and expiration
- User existence and status
- User verification status
- Required role matches user role

```typescript
// Example: Protect route for OWNER and MANAGER
router.get(
  '/protected',
  authCheck('OWNER', 'MANAGER'),
  protectedController
);
```

---

## API Reference

**Base URL:** `https://rasel-shikder-backend.vercel.app/api/v1`

**Authentication Headers:**
```
Authorization: Bearer <access_token>
// OR
Cookie: accessToken=<access_token>; refreshToken=<refresh_token>
```

---

### Authentication

#### Login

Authenticate with email and password. Returns access and refresh tokens.

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Owner successfully logged in",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400/401):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Login failed"
}
```

#### Logout

Clear authentication cookies.

```http
POST /api/v1/auth/logout
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Owner successfully logOut",
  "data": null
}
```

#### Refresh Access Token

Generate a new access token using the refresh token cookie.

```http
POST /api/v1/auth/generate-token
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "AccessToken successfully generated",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Users Management

#### Get Current User

Retrieve authenticated user profile.

```http
GET /api/v1/users/getme
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully retrived owner",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "OWNER",
    "isActive": "ACTIVE",
    "isVerified": true,
    "github": "github.com/johndoe",
    "linkedin": "linkedin.com/in/johndoe",
    "twitter": "twitter.com/johndoe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create User

Create a new user account. **PUBLIC** endpoint - no authentication required.

```http
POST /api/v1/users/
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "manager@example.com",
  "password": "Password@123",
  "name": "John Manager",
  "phone": "+1234567890",
  "address": "123 Main St",
  "github": "github.com/johnmanager",
  "linkedin": "linkedin.com/in/johnmanager"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully created",
  "data": {
    "id": 2,
    "email": "manager@example.com",
    "name": "John Manager",
    "role": "MANAGER",
    "isActive": "ACTIVE",
    "isVerified": true
  }
}
```

---

### Projects

#### Create Project (Admin Only)

Create a new portfolio project. Supports image upload.

```http
POST /api/v1/projects/create
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
file: <image_file>
title: "E-Commerce Platform"
description: "Full-stack e-commerce solution with React and Node.js"
techStack: ["React", "Node.js", "MongoDB", "Stripe"]
liveUrl: "https://live.example.com"
githubUrl: "https://github.com/example/ecommerce"
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "New project successfully created",
  "data": {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution with React and Node.js",
    "image": "https://res.cloudinary.com/your_cloud/image/upload/v1/portfolio/image.png",
    "techStack": ["React", "Node.js", "MongoDB", "Stripe"],
    "liveUrl": "https://live.example.com",
    "githubUrl": "https://github.com/example/ecommerce",
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Read Projects

Get all projects or a specific project.

```http
GET /api/v1/projects/all
# OR
GET /api/v1/projects/:id
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project successfully retrived",
  "data": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "description": "Full-stack e-commerce solution",
      "image": "https://res.cloudinary.com/your_cloud/image/upload/v1/portfolio/image.png",
      "techStack": ["React", "Node.js"],
      "liveUrl": "https://live.example.com",
      "githubUrl": "https://github.com/example/ecommerce"
    }
  ],
  "meta": {
    "total": 5
  }
}
```

#### Update Project (Admin Only)

Update a project by ID.

```http
PATCH /api/v1/projects/edit/:id
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
title?: "Updated Project Title"
description?: "Updated description"
techStack?: ["React", "TypeScript"]
liveUrl?: "https://new-live-url.com"
githubUrl?: "https://new-github-url.com"
file?: <new_image_file>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project successfully edited",
  "data": {
    "id": 1,
    "title": "Updated Project Title",
    "description": "Updated description",
    "image": "https://res.cloudinary.com/your_cloud/image/upload/v1/portfolio/image_updated.png",
    "techStack": ["React", "TypeScript"],
    "liveUrl": "https://new-live-url.com",
    "githubUrl": "https://new-github-url.com"
  }
}
```

#### Delete Project (Admin Only)

Delete a project by ID.

```http
DELETE /api/v1/projects/:id
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project successfully deleted",
  "data": null
}
```

---

### Work Experience

#### Create Work Experience (Admin Only)

Create a new work experience entry.

```http
POST /api/v1/work-experience/create
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyName": "Tech Corp",
  "role": "Senior Developer",
  "description": "Led development of core platform features",
  "startDate": "2022-01-01",
  "endDate": "2023-06-30"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "New Work experince successfully created",
  "data": {
    "id": 1,
    "companyName": "Tech Corp",
    "role": "Senior Developer",
    "description": "Led development of core platform features",
    "userId": 1,
    "startDate": "2022-01-01T00:00:00.000Z",
    "endDate": "2023-06-30T00:00:00.000Z"
  }
}
```

#### Read Work Experience

Get all work experiences or a specific entry.

```http
GET /api/v1/work-experience/all
# OR
GET /api/v1/work-experience/:id
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Works experinces successfully retrived",
  "data": [
    {
      "id": 1,
      "companyName": "Tech Corp",
      "role": "Senior Developer",
      "description": "Led development of core platform features",
      "startDate": "2022-01-01T00:00:00.000Z",
      "endDate": "2023-06-30T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 3
  }
}
```

#### Update Work Experience (Admin Only)

Update a work experience by ID.

```http
PATCH /api/v1/work-experience/edit/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyName": "Updated Tech Corp",
  "role": "Lead Developer",
  "description": "Updated description",
  "startDate": "2022-01-01T00:00:00.000Z",
  "endDate": null
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Work experince successfully edited",
  "data": {
    "id": 1,
    "companyName": "Updated Tech Corp",
    "role": "Lead Developer",
    "description": "Updated description",
    "userId": 1,
    "startDate": "2022-01-01T00:00:00.000Z",
    "endDate": null
  }
}
```

#### Delete Work Experience (Admin Only)

Delete a work experience by ID.

```http
DELETE /api/v1/work-experience/:id
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Work experince successfully deleted",
  "data": null
}
```

---

### Blogs

#### Create Blog Post (Admin Only)

Create a new blog post with multiple image uploads.

```http
POST /api/v1/blogs/create
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
files[]: <image1.jpg>
files[]: <image2.jpg>
title: "Getting Started with TypeScript"
content: {
  "blocks": [
    {
      "type": "h2",
      "data": "Introduction"
    },
    {
      "type": "paragraph",
      "data": "TypeScript is a typed superset of JavaScript..."
    }
  ]
}
tags: ["TypeScript", "JavaScript", "Web Dev"]
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Blog successfully created",
  "data": {
    "id": 1,
    "title": "Getting Started with TypeScript",
    "content": {
      "blocks": [
        {
          "type": "h2",
          "data": "Introduction"
        }
      ]
    },
    "images": [
      "https://res.cloudinary.com/your_cloud/image/upload/v1/portfolio/blog1.jpg",
      "https://res.cloudinary.com/your_cloud/image/upload/v1/portfolio/blog2.jpg"
    ],
    "published": false,
    "slug": "getting-started-with-typescript",
    "tags": ["TypeScript", "JavaScript", "Web Dev"],
    "views": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Read Blogs

Get all blogs or a specific blog by slug.

```http
GET /api/v1/blogs/all
GET /api/v1/blogs/:slug
```

**Query Parameters (for all blogs):**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blogs successfully retrived",
  "data": [
    {
      "id": 1,
      "title": "Getting Started with TypeScript",
      "content": {
        "blocks": [
          {
            "type": "h2",
            "data": "Introduction"
          }
        ]
      },
      "images": ["https://cdn-icons..."],
      "published": true,
      "slug": "getting-started-with-typescript",
      "tags": ["TypeScript"],
      "views": 125,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPage": 2
  }
}
```

#### Get Published Blog (Public)

Read a specific blog (requires published: true).

```http
GET /api/v1/blogs/:slug
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog successfully retrived",
  "data": {
    "id": 1,
    "title": "Getting Started with TypeScript",
    "content": {
      "blocks": [...]
    },
    "images": ["https://cdn-icons..."],
    "published": true,
    "slug": "getting-started-with-typescript",
    "tags": ["TypeScript"],
    "views": 125,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Blog (Admin Only)

Update a blog post. Supports image updates.

```http
PATCH /api/v1/blogs/update/:slug
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
files[]?: <new_image.jpg>
title?: "Updated Title"
content?: { "blocks": [...] }
tags?: ["New", "Tags"]
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog successfully updated",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "content": { "blocks": [...] },
    "images": ["https://res.cloudinary.com/your_cloud/update.jpg"],
    "published": true,
    "slug": "getting-started-with-typescript",
    "tags": ["New", "Tags"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Publish Blog Post (Admin Only)

Mark a blog as published.

```http
PATCH /api/v1/blogs/publish/:slug
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog successfully published",
  "data": {
    "id": 1,
    "title": "Getting Started with TypeScript",
    "published": true,
    "publishedDate": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Unpublish Blog Post (Admin Only)

Mark a published blog as unpublished.

```http
PATCH /api/v1/blogs/unpublish/:slug
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog successfully unPublished",
  "data": {
    "id": 1,
    "title": "Getting Started with TypeScript",
    "published": false
  }
}
```

#### Delete Blog (Admin Only)

Delete a blog post.

```http
DELETE /api/v1/blogs/:slug
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog successfully deleted",
  "data": null
}
```

#### Get Blog Stats (Admin Only)

Retrieve statistics for all blogs.

```http
GET /api/v1/blogs/stats
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Successfully retrived blogs stats",
  "data": {
    "total": 20,
    "published": 15,
    "unpublished": 5,
    "totalViews": 1234,
    "totalLikes": 89
  }
}
```

---

### Resume

#### Upload Resume (Admin Only)

Upload a resume PDF. Associates with authenticated user.

```http
POST /api/v1/resume/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```form-data
file: <resume.pdf>
fileName: "John_Doe_Resume.pdf"
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resume successfully created",
  "data": {
    "id": 1,
    "userId": 1,
    "resumeUrl": "https://res.cloudinary.com/your_cloud/upload/v1/portfolio/resume.pdf",
    "fileName": "John_Doe_Resume.pdf",
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Read Resume (Public)

Get all resumes or a specific resume.

```http
GET /api/v1/resume/
# OR
GET /api/v1/resume/:id
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resumes successfully retrieved",
  "data": [
    {
      "id": 1,
      "fileName": "John_Doe_Resume.pdf",
      "resumeUrl": "https://res.cloudinary.com/your_cloud/upload/v1/portfolio/resume.pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

#### Update Resume (Admin Only)

Update resume URL by ID.

```http
PATCH /api/v1/resume/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "resumeUrl": "https://updated-url.com/resume.pdf",
  "fileName": "Updated_CV.pdf"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resume successfully updated",
  "data": {
    "id": 1,
    "resumeUrl": "https://updated-url.com/resume.pdf",
    "fileName": "Updated_CV.pdf",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Delete Resume (Admin Only)

Delete a resume by ID.

```http
DELETE /api/v1/resume/:id
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resume successfully deleted",
  "data": null
}
```

---

### Health Check

#### Health Status

Verify database connectivity.

```http
GET /health
```

**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

**Failure Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "database": "disconnected"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "statusCode": <HTTP_STATUS_CODE>,
  "message": "Error description",
  "data": null
}
```

---

## Response Format

### Standard Response Structure

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}
```

---

## File Uploads

### Supported File Types

| Resource | File Types | Max Size | Field Name | Max Files |
|----------|-----------|----------|------------|-----------|
| Projects | JPEG, JPG, PNG, WEBP | 10MB | `file` | 1 |
| Blogs | JPEG, JPG, PNG, GIF, WEBP | 10MB | `files[]` | 10 |
| Resumes | PDF | 10MB | `file` | 1 |

---

## Environment Variables

Required environment variables must be set in [`.env.local`](.env.local):

```bash
PORT=5000
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_ACCESS_SECRET="..."
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_SECRET="..."
JWT_REFRESH_EXPIRES="7d"
CLOUDINARY_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
FRONTEND_URL="..."
BCRYPT_SALT=10
OWNER_EMAIL="..."
OWNER_PASSWORD="..."
```

---

**API Version:** 1.0.0
**Last Updated:** 2024-11-08
**Maintained By:** Rasel SHikder