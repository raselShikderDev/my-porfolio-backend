# 🌟 My Portfolio Backend

[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3399FF?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

A **fully dynamic personal portfolio backend** for managing projects, work experiences, and blogs using an admin panel.

- **Live Frontend:** [https://raselsdev.vercel.app](https://raselsdev.vercel.app)
- **Backend API:** [https://rasel-shikder-backend.vercel.app](https://rasel-shikder-backend.vercel.app)

---

## 💻 Features

- Admin panel for portfolio owner with full access control
- Add, edit, and delete:
  - Projects
  - Work experiences
  - Blog posts
- JWT-based authentication for secure access
- Cloudinary integration for image uploads
- REST API built with Express, TypeScript, and Prisma
- Validation with Zod for secure and consistent data
- Rich-text sanitization to prevent XSS attacks

---

## ⚙️ Developer Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/raselShikderDev/my-porfolio-backend.git
cd my-porfolio-backend
```

### 2️⃣ Install dependencies

```bash
bun install
```

### 3️⃣ Set environment variables

Create a `.env.local` file in the root directory and add:

```bash
PORT=5000
DATABASE_URL=<your_database_url>
JWT_ACCESS_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
FRONTEND_URL=http://localhost:3000
```

> 🔑 Contact the project owner for authentication details: rasel.sikder777.rk@gmail.com

### 4️⃣ Run the project

**Development mode:**

```bash
bun run dev
```

**Build and run production:**

```bash
bun run build
bun start
```

**Run tests:**

```bash
bun test
```

**Run linting:**

```bash
bun run lint
```

---

## 🛠️ Tech Stack

- **Backend:** Bun, TypeScript, Express, Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Validation:** Zod
- **Linting & Formatting:** ESLint, Prettier
- **Runtime:** Bun / tsx

---

## 🗂️ Folder Structure

```
my-porfolio-backend/
│
├─ src/
│  ├─ configs/          # Configuration files (e.g., environment variables, database, multer, cloudinary)
│  ├─ modules/           # Application modules (auth, users, projects, workExperience, blogs)
│  ├─ middlewares/       # Auth and validation middleware
│  ├─ routes/            # Express routes
│  ├─ utils/             # Utility functions
│  ├─ server.ts          # Main server file
│  └─ app.ts             # Express app configuration
│
├─ prisma/
│  └─ schema.prisma      # Prisma schema
│
├─ tests/               # Test files
│
├─ .env.local           # Environment variables
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 🌐 API Overview

## 🔐 Authentication

The backend uses JWT (JSON Web Token) for authentication:

- Access tokens are used for session management
- Refresh tokens are used for obtaining new access tokens
- HTTP-only cookies are used for secure token storage
- Protected routes require valid JWT tokens and proper authorization
## 🧪 Testing

The backend uses Bun as the test runner:

- Run tests with:
  ```bash
  bun test
  ```

---

## 🚀 Docker

### Docker Build and Run

- Build the Docker image:
  ```bash
  docker build -t myportfolio-backend .
  ```

- Run the container:
  ```bash
  docker run -p 5000:5000 -e PORT=5000 -e DATABASE_URL=<your_db_url> -e JWT_ACCESS_SECRET=<your_secret> myportfolio-backend
  ```

- Health check:
  The container performs a health check using the `/health` endpoint.

- Production image behavior:
  The container runs as a non-root user for enhanced security.

---

## 🌐 Deployment

The backend is deployed using Vercel:

- The `vercel.json` configuration ensures the server runs with the correct environment variables.

---

## 🔒 Security Notes

- Environment variables are securely managed and not hardcoded
- JWT tokens are encrypted and have appropriate expiration times
- File uploads are restricted to specific image types and size limits
- Rich-text content is sanitized to prevent XSS attacks
- Production errors are handled gracefully without exposing sensitive information
- Docker container runs as a non-root user
- Health endpoint provides monitoring capabilities

---

## 🛠️ Troubleshooting

Common setup issues and their solutions:

1. **Missing environment variables:**
   - Ensure all required variables are set in `.env.local`
   - Verify that `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and Cloudinary credentials are correct

2. **Prisma generation/migration issues:**
   - Run `bun run prisma generate` after installing dependencies
   - Ensure your database connection details are correct

3. **Port conflicts:**
   - Ensure port 5000 is available or update the `PORT` environment variable
   - Check for other services using the same port with `netstat -ano | findstr :5000`

4. **Docker startup problems:**
   - Verify Docker is running and you have proper permissions
   - Check Docker logs with `docker logs <container_id>`
   - Ensure all required environment variables are set in your Docker environment

5. **Authentication issues:**
   - Verify your JWT tokens are valid and not expired
   - Ensure your user account is active and verified

For any other issues, please contact the project owner at rasel.sikder777.rk@gmail.com.
- Users must be verified and active to access protected routes

---

## 📁 File Uploads

File uploads are restricted as follows:

- Allowed image types: JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 10MB per file
- Maximum number of files per request: 10
- Images are stored in Cloudinary with unique filenames

---

## 📝 Rich Text Sanitization

Rich-text content is sanitized server-side using the `sanitize-html` library to prevent XSS attacks. Allowed HTML tags and attributes are strictly controlled.

---

## 🛡️ Health Endpoint

The `/health` endpoint:

- **GET /health**
  - Checks database connectivity
  - Returns `200 OK` if the server is healthy
  - Returns `503 SERVICE_UNAVAILABLE` if the database connection fails

---

The backend API is organized into the following route groups:

- `/api/v1/users` - User management endpoints
- `/api/v1/auth` - Authentication endpoints
- `/api/v1/projects` - Project management endpoints
- `/api/v1/work-experience` - Work experience management endpoints
- `/api/v1/blogs` - Blog post management endpoints
- `/health` - Health check endpoint

---

## ✉️ Contact

**Owner / Developer:** Rasel Shikder  
Email: rasel.sikder777.rk@gmail.com

---

## ✅ License

This project is **private**, only accessible to the owner/admin for portfolio management.
