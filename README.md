# 🌟 My Portfolio Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3399FF?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

A **fully dynamic personal portfolio backend** where the owner can manage projects, experiences, blogs, and more via an **admin panel**—no coding required.

- **Live Frontend:** [https://raselsdev.vercel.app](https://raselsdev.vercel.app)
- **Backend API:** [https://rasel-shikder-backend.vercel.app](https://rasel-shikder-backend.vercel.app)

---

## 💻 Features

- Admin panel for portfolio owner with full access control
- Add, edit, and delete:
  - Projects
  - Experiences
  - Blog posts
- Fully dynamic content management without touching code
- JWT-based authentication for secure access
- Cloudinary integration for image uploads
- REST API built with Express, TypeScript, and Prisma
- Validation with Zod for secure and consistent data

---

## ⚙️ Developer Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/raselShikderDev/my-porfolio-backend.git
cd my-porfolio-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set environment variables

Create a `.env.local` file in the root directory and add:

```bash
PORT=5000
DATABASE_URL=<your_database_url>
JWT_ACCESS_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

> 🔑 Contact the project owner for authentication details: rasel.sikder777.rk@gmail.com

### 4️⃣ Run the project

**Development mode:**

```bash
npm run dev
```

**Build and run production:**

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL (or any Prisma-supported DB)
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
│  ├─ controllers/       # API controllers
│  ├─ middlewares/       # Auth & validation middleware
│  ├─ models/            # Prisma models
│  ├─ routes/            # Express routes
│  ├─ server.ts          # Main server file
│
├─ prisma/
│  └─ schema.prisma      # Prisma schema
│
├─ .env.local            # Environment variables
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 🌐 Live Demo

- **Frontend:** [https://raselsdev.vercel.app](https://raselsdev.vercel.app)
- **Backend API:** [https://rasel-shikder-backend.vercel.app](https://rasel-shikder-backend.vercel.app)

> ⚠️ Authentication required for admin panel. Contact owner for credentials.

---

## ✉️ Contact

**Owner / Developer:** Rasel Shikder  
Email: rasel.sikder777.rk@gmail.com

---

## ✅ License

This project is **private**, only accessible to the owner/admin for portfolio management.
