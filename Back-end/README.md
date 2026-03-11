# Prestau — Back-end

> **[🇫🇷 Version française ci-dessous](#-prestau--back-end-1)**

---

## Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
  - [Authentication](#authentication---auth)
  - [Users](#users---user)
  - [Companies](#companies---company)
  - [Workers](#workers---worker)
  - [Jobs](#jobs---job)
  - [Job Offers](#job-offers---joboffer)
  - [Messages](#messages---message)
  - [Reviews](#reviews---review)
- [Authentication Flow](#-authentication-flow)
- [Role-Based Access Control](#-role-based-access-control)
- [Testing](#-testing)
- [Migration History](#-migration-history)

---

## Overview

Prestau Back-end is a **RESTful API** built with **NestJS** that powers the Prestau platform — a marketplace connecting **companies** (restaurants, hotels, catering businesses) with **temporary workers** in the food service industry.

The API handles:
- User registration and authentication (JWT)
- Company and worker profile management
- Job posting, application, and lifecycle management
- Real-time messaging between companies and workers
- Review and rating system
- Worker availability calendar management

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **NestJS** v11 | Backend framework (TypeScript) |
| **Prisma** v7 | ORM & database migrations |
| **PostgreSQL** | Relational database |
| **Passport.js** | Authentication middleware |
| **JWT** | JSON Web Tokens (access + refresh) |
| **bcrypt** | Password hashing |
| **class-validator** | DTO validation |
| **class-transformer** | DTO transformation |
| **Joi** | Environment variable validation |
| **Jest** | Unit testing framework |
| **TypeScript** v5 | Language |

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Prisma CLI** (installed via dev dependencies)

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Prestau/Back-end

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

---

## Environment Variables

Create a `.env` file at the root of the `Back-end/` folder:

```env
# Application
NODE_ENV=development          # development | production | test
PORT=3000                     # Server port (default: 3000)

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME

# Authentication
JWT_SECRET=your-secure-secret-key
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Application environment |
| `PORT` | No | `3000` | Server listening port |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing |

---

## Database Setup

```bash
# Run all pending migrations
npm run prisma:migrate

# Generate the Prisma client
npm run prisma:generate

```

### Viewing the Database

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`.

---

## Running the Application

```bash
# Development mode (hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start

# The API will be available at http://localhost:3000
```

CORS is enabled for all origins (`origin: '*'`). A global `ValidationPipe` is active for automatic DTO validation.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in watch mode (hot-reload) |
| `npm run build` | Build the application |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint and fix TypeScript files |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |

---

## Project Architecture

```
Back-end/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   ├── migrations/                # Migration history (9 migrations)
│   └── seed.ts                    # Database seeder
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module (imports all modules)
│   ├── prisma.service.ts          # Prisma database service
│   ├── models/
│   │   └── basemodel.model.ts     # Base model class (id, createdAt, updatedAt)
│   └── Modules/
│       ├── auth/                  # Authentication module
│       │   ├── auth.controller.ts     # 4 endpoints
│       │   ├── auth.service.ts        # Registration, login, logout, token refresh
│       │   ├── auth.module.ts
│       │   ├── auth.service.spec.ts
│       │   ├── decorators/
│       │   │   └── roles.decorator.ts # @Roles() decorator
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── enums/
│       │   │   └── role.enum.ts       # COMPANY | WORKER
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts  # JWT authentication guard
│       │   │   └── roles.guard.ts     # Role-based access guard
│       │   ├── interfaces/
│       │   │   └── jwt-payload.interface.ts
│       │   └── strategies/
│       │       └── jwt.strategy.ts    # Passport JWT strategy
│       ├── company/               # Company profile module
│       │   ├── company.controller.ts  # 5 endpoints
│       │   ├── company.service.ts
│       │   ├── company.module.ts
│       │   ├── company.service.spec.ts
│       │   └── dto/
│       │       ├── create-company.dto.ts
│       │       └── update-company.dto.ts
│       ├── worker/                # Worker profile module
│       │   ├── worker.controller.ts   # 7 endpoints
│       │   ├── worker.service.ts
│       │   ├── worker.module.ts
│       │   ├── worker.service.spec.ts
│       │   └── dto/
│       │       ├── create-worker.dto.ts
│       │       └── update-worker.dto.ts
│       ├── job/                   # Job posting module
│       │   ├── job.controller.ts      # 6 endpoints
│       │   ├── job.service.ts
│       │   ├── job.module.ts
│       │   ├── job.service.spec.ts
│       │   └── dto/
│       │       ├── create-job.dto.ts
│       │       └── update-job.dto.ts
│       ├── joboffer/              # Job application module
│       │   ├── joboffer.controller.ts # 10 endpoints
│       │   ├── joboffer.service.ts
│       │   ├── joboffer.module.ts
│       │   └── dto/
│       │       └── create-joboffer.dto.ts
│       ├── message/               # Messaging module
│       │   ├── message.controller.ts  # 3 endpoints
│       │   ├── message.service.ts
│       │   ├── message.module.ts
│       │   ├── message.service.spec.ts
│       │   └── dto/
│       │       └── create-message.dto.ts
│       ├── review/                # Review & rating module
│       │   ├── review.controller.ts   # 2 endpoints
│       │   ├── review.service.ts
│       │   ├── review.module.ts
│       │   ├── review.service.spec.ts
│       │   └── dto/
│       │       └── create-review.dto.ts
│       └── user/                  # User account module
│           ├── user.controller.ts     # 4 endpoints
│           ├── user.service.ts
│           ├── user.module.ts
│           ├── user.service.spec.ts
│           └── dto/
│               ├── create-user.dto.ts
│               └── update-user.dto.ts
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  Users   │───1:1─│  Company  │───1:N─│   Job    │
│          │       └───────────┘       │          │
│ id       │                           │ id       │
│ email    │       ┌───────────┐       │ title    │
│ password │───1:1─│  Worker   │       │ salary   │
│ role     │       │           │       │ status   │
│ refresh  │       │ id        │       └────┬─────┘
│ Token    │       │ firstName │            │
└──────────┘       │ lastName  │            │ 1:N
                   │ skills    │       ┌────┴─────┐
                   │ freeDays  │───1:N─│ JobOffer │───1:N─┌──────────┐
                   │ busyDays  │       │          │       │ Message  │
                   └───────────┘       │ id       │       │          │
                                       │ status   │       │ content  │
                                       └────┬─────┘       │ senderId │
                                            │             │ is_read  │
                                       ┌────┴─────┐       └──────────┘
                                       │  Review  │
                                       │          │
                                       │ rating   │
                                       │ comment  │
                                       └──────────┘
```

### Models

#### Users
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `email` | String(255) | Unique |
| `password` | String(255) | Hashed with bcrypt |
| `role` | Role | Enum: `COMPANY` \| `WORKER` |
| `refreshToken` | String(255)? | Nullable, hashed |
| `createdAt` | DateTime | Auto-generated |
| `updatedAt` | DateTime | Auto-updated |

#### Company
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `companyName` | String(255) | Required |
| `address` | String(255) | Required |
| `postalCode` | Int | Required |
| `city` | String(100) | Required |
| `siret` | String(14) | Required |
| `phoneNumber` | String(20) | Required |
| `establishment_type` | String(100) | Required |
| `description` | Text? | Optional |
| `website` | String(255)? | Optional |
| `social_media` | String(255)? | Optional |
| `userId` | Int | FK → Users, unique, cascade delete |

#### Worker
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `firstName` | String(100) | Required |
| `lastName` | String(100) | Required |
| `dateOfBirth` | DateTime? | Optional |
| `city` | String(100) | Required |
| `postalCode` | Int | Required |
| `photoURL` | String(255)? | Optional |
| `profession` | String(100) | Required |
| `experience_years` | Int? | Optional |
| `languages` | Text | Required |
| `qualifications` | Text? | Optional |
| `cv_url` | String(255)? | Optional |
| `availability` | Boolean | Default: `true` |
| `phoneNumber` | String(20) | Required |
| `skills` | Text | Required |
| `freeDays` | String[] | Default: `[]` |
| `busyDays` | String[] | Default: `[]` |
| `userId` | Int | FK → Users, unique, cascade delete |

#### Job
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `title` | String(100) | Required |
| `description` | Text | Required |
| `salary` | Float | Required |
| `start_time` | DateTime | Required |
| `end_time` | DateTime | Required |
| `companyId` | Int | FK → Company, indexed, cascade delete |
| `status` | JobStatus | Default: `OPEN` |

**JobStatus enum**: `OPEN` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`

#### JobOffer
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `request_at` | DateTime | Default: `now()` |
| `response_at` | DateTime? | Nullable |
| `contract_url` | String(255)? | Optional |
| `contract_signed` | Boolean? | Default: `false` |
| `signed_at` | DateTime? | Nullable |
| `selected_by_company` | Boolean? | Default: `false` |
| `jobId` | Int | FK → Job, indexed, cascade delete |
| `workerId` | Int | FK → Worker, indexed, cascade delete |
| `status` | JobOfferStatus | Default: `PENDING` |

**JobOfferStatus enum**: `PENDING` | `ACCEPTED` | `REJECTED` | `CANCELLED` | `COMPLETED`

#### Review
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `rating` | Int | 1–5 |
| `comment` | Text? | Optional |
| `jobId` | Int | FK → Job, indexed, cascade delete |
| `reviewerType` | String(50) | `COMPANY` or `WORKER` |
| `reviewerId` | Int | Indexed (composite with type) |
| `revieweeType` | String(50) | `COMPANY` or `WORKER` |
| `revieweeId` | Int | Indexed (composite with type) |
| `is_visible` | Boolean | Default: `true` |

#### Message
| Column | Type | Constraints |
|---|---|---|
| `id` | Int | PK, auto-increment |
| `jobOfferId` | Int | FK → JobOffer, indexed, cascade delete |
| `senderId` | Int | Required |
| `receiverId` | Int | Required |
| `content` | Text | Required |
| `sentAt` | DateTime | Default: `now()` |
| `is_read` | Boolean | Default: `false` |

---

## 📡 API Reference

All protected endpoints require the `Authorization: Bearer <token>` header.

### Authentication — `/auth`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | — | Register a new user |
| `POST` | `/auth/login` | ❌ | — | Authenticate and get tokens |
| `POST` | `/auth/logout` | ✅ | Any | Invalidate refresh token |
| `POST` | `/auth/refresh-token` | ❌ | — | Refresh access token |

<details>
<summary><strong>POST /auth/register</strong></summary>

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "WORKER"
}
```

**Validation:**
- `email`: Must be a valid email
- `password`: Minimum 6 characters
- `role`: Must be `COMPANY` or `WORKER`

**Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "WORKER"
  }
}
```
</details>

<details>
<summary><strong>POST /auth/login</strong></summary>

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "WORKER"
  }
}
```

**Errors:**
- `401`: Invalid email or password
- `403`: Company/Worker profile not created yet
</details>

<details>
<summary><strong>POST /auth/logout</strong></summary>

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Logout successful"
}
```
</details>

<details>
<summary><strong>POST /auth/refresh-token</strong></summary>

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- `401`: Invalid or expired refresh token
</details>

---

### Users — `/user`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/user/MyProfile` | ✅ | Any | Get current user's profile |
| `GET` | `/user/:id` | ✅ | Any | Get user by ID |
| `PATCH` | `/user/MyProfile` | ✅ | Any | Update current user's profile |
| `DELETE` | `/user/MyProfile` | ✅ | Any | Delete current user's account |

<details>
<summary><strong>GET /user/MyProfile</strong></summary>

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "WORKER",
  "createdAt": "2026-03-01T00:00:00.000Z",
  "updatedAt": "2026-03-01T00:00:00.000Z"
}
```
</details>

<details>
<summary><strong>PATCH /user/MyProfile</strong></summary>

**Request Body (all fields optional):**
```json
{
  "email": "newemail@example.com",
  "role": "COMPANY"
}
```

**Note:** Password cannot be updated through this endpoint.
</details>

---

### Companies — `/company`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/company` | ✅ | COMPANY | Create company profile |
| `GET` | `/company/MyCompany` | ✅ | COMPANY | Get own company profile |
| `GET` | `/company/:id` | ✅ | WORKER | View a company profile |
| `PATCH` | `/company/MyCompany` | ✅ | COMPANY | Update own company profile |
| `DELETE` | `/company/MyCompany` | ✅ | COMPANY | Delete own company profile |

<details>
<summary><strong>POST /company</strong></summary>

**Request Body:**
```json
{
  "companyName": "Restaurant Le Gourmet",
  "address": "12 Rue de la Paix",
  "city": "Paris",
  "postalCode": 75001,
  "siret": "12345678901234",
  "phoneNumber": "+33612345678",
  "establishment_type": "Restaurant",
  "description": "French fine dining restaurant",
  "website": "https://legourmet.fr",
  "social_media": "https://instagram.com/legourmet"
}
```

**Required:** `companyName`, `address`, `city`, `postalCode`, `siret`, `phoneNumber`, `establishment_type`  
**Optional:** `description`, `website`, `social_media`

**Errors:**
- `409`: Company profile already exists for this user
</details>

<details>
<summary><strong>PATCH /company/MyCompany</strong></summary>

All fields from create are updatable **except `siret`** (immutable).
</details>

---

### Workers — `/worker`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/worker` | ✅ | WORKER | Create worker profile |
| `GET` | `/worker/MyProfile` | ✅ | WORKER | Get own worker profile |
| `GET` | `/worker/availability` | ✅ | WORKER | Get availability calendar |
| `PATCH` | `/worker/availability` | ✅ | WORKER | Update day availability |
| `GET` | `/worker/:id` | ✅ | COMPANY | View a worker profile |
| `PATCH` | `/worker/MyProfile` | ✅ | WORKER | Update own worker profile |
| `DELETE` | `/worker/MyProfile` | ✅ | WORKER | Delete own worker profile |

<details>
<summary><strong>POST /worker</strong></summary>

**Request Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1995-06-15T00:00:00.000Z",
  "city": "Lyon",
  "postalCode": 69001,
  "photoURL": "https://example.com/photo.jpg",
  "profession": "Serveur",
  "experience_years": 3,
  "languages": "Français, Anglais",
  "qualifications": "CAP Restauration",
  "cv_url": "https://example.com/cv.pdf",
  "availability": true,
  "phoneNumber": "+33698765432",
  "skills": "Service en salle, Préparation cocktails"
}
```

**Required:** `firstName`, `lastName`, `city`, `postalCode`, `profession`, `languages`, `phoneNumber`, `skills`  
**Optional:** `dateOfBirth`, `photoURL`, `experience_years`, `qualifications`, `cv_url`, `availability`
</details>

<details>
<summary><strong>PATCH /worker/availability</strong></summary>

**Request Body:**
```json
{
  "date": "2026-03-15",
  "status": "busy"
}
```

**Status values:** `free` | `busy` | `neutral`

**Response (200):**
```json
{
  "freeDays": ["2026-03-10", "2026-03-12"],
  "busyDays": ["2026-03-15", "2026-03-20"]
}
```
</details>

---

### Jobs — `/job`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/job` | ✅ | COMPANY | Create a job posting |
| `GET` | `/job` | ✅ | Any | List all jobs (with optional search) |
| `GET` | `/job/my-jobs` | ✅ | Any | List own jobs |
| `GET` | `/job/:id` | ✅ | Any | Get job details |
| `PATCH` | `/job/:id` | ✅ | COMPANY | Update a job |
| `DELETE` | `/job/:id` | ✅ | COMPANY | Delete a job |

<details>
<summary><strong>POST /job</strong></summary>

**Request Body:**
```json
{
  "title": "Serveur pour soirée privée",
  "description": "Service pour une soirée de 50 personnes",
  "salary": 15.50,
  "start_time": "2026-03-20T18:00:00.000Z",
  "end_time": "2026-03-21T02:00:00.000Z"
}
```

All fields are required.
</details>

<details>
<summary><strong>GET /job?search=paris</strong></summary>

**Query Parameters:**
- `search` (optional): Filters by job title or company city (case-insensitive)

**Behavior by role:**
- **COMPANY**: Returns only their own jobs
- **WORKER**: Returns all available jobs matching search criteria
</details>

<details>
<summary><strong>GET /job/:id</strong></summary>

**Response includes computed fields:**
```json
{
  "id": 1,
  "title": "Serveur pour soirée privée",
  "description": "...",
  "salary": 15.5,
  "start_time": "2026-03-20T18:00:00.000Z",
  "end_time": "2026-03-21T02:00:00.000Z",
  "status": "OPEN",
  "company": { "..." },
  "jobOffers": [ "..." ],
  "isWorker": true,
  "alreadyApplied": false,
  "canApply": true
}
```
</details>

---

### Job Offers — `/joboffer`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/joboffer/:jobId` | ✅ | WORKER | Apply for a job |
| `POST` | `/joboffer/:id/accept` | ✅ | COMPANY | Accept an application |
| `POST` | `/joboffer/:id/reject` | ✅ | COMPANY | Reject an application |
| `POST` | `/joboffer/:id/complete` | ✅ | COMPANY | Mark job as completed |
| `POST` | `/joboffer/:id/cancel` | ✅ | COMPANY | Cancel an accepted application |
| `GET` | `/joboffer/my-offers` | ✅ | COMPANY | Get received applications |
| `GET` | `/joboffer/my-applications` | ✅ | WORKER | Get submitted applications |
| `GET` | `/joboffer/history` | ✅ | Any | Get completed missions history |
| `GET` | `/joboffer/:id` | ✅ | Any | Get application details |
| `DELETE` | `/joboffer/cancel/:jobId` | ✅ | WORKER | Cancel own application |

<details>
<summary><strong>Job Offer Lifecycle</strong></summary>

```
Worker applies → PENDING
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ACCEPTED     REJECTED    CANCELLED
        │                    (by company)
        │
        ▼
    COMPLETED
```

**Status transitions:**
1. `PENDING` → `ACCEPTED`: Company accepts the application. Job status → `IN_PROGRESS`
2. `PENDING` → `REJECTED`: Company rejects the application. If no active offers remain, Job status → `OPEN`
3. `ACCEPTED` → `CANCELLED`: Company cancels. If no active offers remain, Job status → `OPEN`
4. `ACCEPTED` → `COMPLETED`: Company marks mission as done. Job status → `COMPLETED`
</details>

<details>
<summary><strong>GET /joboffer/history</strong></summary>

Returns completed offers with review information:
```json
[
  {
    "id": 1,
    "status": "COMPLETED",
    "job": { "title": "...", "company": { "..." } },
    "worker": { "firstName": "...", "lastName": "..." },
    "hasReviewed": true,
    "myRating": 5,
    "myComment": "Excellent worker",
    "receivedRating": 4,
    "receivedComment": "Great company"
  }
]
```
</details>

---

### Messages — `/message`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/message` | ✅ | Any | Send a message |
| `GET` | `/message` | ✅ | Any | Get all messages |
| `GET` | `/message/:id` | ✅ | Any | Get a specific message |

<details>
<summary><strong>POST /message</strong></summary>

**Request Body:**
```json
{
  "content": "Hello, I'm interested in this position!",
  "jobOfferId": 1
}
```

**Note:** The `receiverId` is automatically determined based on the sender's role and the job offer context. Only participants (company owner or applicant worker) can send messages.
</details>

---

### Reviews — `/review`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/review` | ✅ | Any | Submit a review |
| `GET` | `/review/:id` | ✅ | Any | Get a review |

<details>
<summary><strong>POST /review</strong></summary>

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service, very professional!",
  "jobId": 1,
  "reviewerType": "COMPANY",
  "reviewerId": 1,
  "revieweeType": "WORKER",
  "revieweeId": 3
}
```

**Validation:**
- `rating`: Integer between 1 and 5 (required)
- `comment`: String, max 1000 characters (optional)
- Self-reviews are not allowed (`reviewerId === revieweeId`)
- Only one review per user per job
</details>

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  REGISTRATION                        │
│  POST /auth/register                                 │
│  { email, password, role }                           │
│  → Returns: access_token (15min) + refreshToken (7d) │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│               PROFILE CREATION                       │
│  POST /company  (if role = COMPANY)                  │
│  POST /worker   (if role = WORKER)                   │
│  → Creates the associated profile                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                    LOGIN                             │
│  POST /auth/login                                    │
│  { email, password }                                 │
│  → Validates profile exists                          │
│  → Returns: access_token (15min) + refreshToken (7d) │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              AUTHENTICATED REQUESTS                  │
│  Authorization: Bearer <access_token>                │
│  → Access protected endpoints                        │
└──────────────────────┬──────────────────────────────┘
                       │
          Token expires (15 min)
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                TOKEN REFRESH                         │
│  POST /auth/refresh-token                            │
│  { refreshToken }                                    │
│  → Returns: new access_token + new refreshToken      │
│  → Token rotation (old refreshToken invalidated)     │
└─────────────────────────────────────────────────────┘
```

### Security Features
- Passwords hashed with **bcrypt** (10 salt rounds)
- Access tokens expire after **15 minutes**
- Refresh tokens expire after **7 days**
- Refresh token **rotation** on each refresh (old token invalidated)
- Refresh tokens **hashed before storage** in the database
- **Logout** invalidates the refresh token server-side

---

## Role-Based Access Control

The API implements a dual-guard system:

1. **`JwtAuthGuard`**: Verifies the JWT token is valid and not expired
2. **`RolesGuard`**: Checks the user's role against the `@Roles()` decorator

| Feature | COMPANY | WORKER |
|---|---|---|
| Create/manage company profile | ✅ | ❌ |
| Create/manage worker profile | ❌ | ✅ |
| Create job postings | ✅ | ❌ |
| Apply to jobs | ❌ | ✅ |
| Accept/reject applicants | ✅ | ❌ |
| Complete/cancel offers | ✅ | ❌ |
| View available jobs | ✅ (own) | ✅ (all) |
| Send messages | ✅ | ✅ |
| Leave reviews | ✅ | ✅ |
| View company profiles | ❌ | ✅ |
| View worker profiles | ✅ | ❌ |
| Manage availability calendar | ❌ | ✅ |

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov
```

Test files are located alongside their source files with the `.spec.ts` suffix. The project uses **Jest** as the testing framework with **@nestjs/testing** for module mocking.

Modules with test coverage:
- `auth.service.spec.ts`
- `company.service.spec.ts`
- `job.service.spec.ts`
- `worker.service.spec.ts`
- `message.service.spec.ts`
- `review.service.spec.ts`
- `user.service.spec.ts`

---

## Migration History

| # | Migration | Description |
|---|---|---|
| 1 | `20260205012503_complete_schema_relations` | Initial schema: all tables, enums, foreign keys |
| 2 | `20260211165328_init` | Remove deprecated columns, fix types |
| 3 | `20260219154938_add_role_enum` | Convert role column to Enum type |
| 4 | `20260302182507_add_refreshToken` | Add refresh token support |
| 5 | `20260303015357_phoneNumber_company` | Add phone number to Company |
| 6 | `20260303134215_add_calendar_to_worker` | Add freeDays/busyDays arrays |
| 7 | `20260308221621_add_postal_code_and_city_company` | Add city & postal code to Company |
| 8 | `20260309004650_remove_address_from_job` | Remove address from Job |
| 9 | `20260309143732_add_cascade_delete` | Change all FK constraints to CASCADE delete |

---
---

# Prestau — Back-end

> **🇫🇷 Version française**

---

## Table des matières

- [Présentation](#-présentation)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation-1)
- [Variables d'environnement](#-variables-denvironnement)
- [Configuration de la base de données](#-configuration-de-la-base-de-données)
- [Lancement de l'application](#-lancement-de-lapplication)
- [Scripts disponibles](#-scripts-disponibles)
- [Architecture du projet](#-architecture-du-projet)
- [Schéma de la base de données](#-schéma-de-la-base-de-données-1)
- [Référence API](#-référence-api)
  - [Authentification](#authentification---auth)
  - [Utilisateurs](#utilisateurs---user)
  - [Entreprises](#entreprises---company)
  - [Travailleurs](#travailleurs---worker)
  - [Missions](#missions---job)
  - [Candidatures](#candidatures---joboffer)
  - [Messages](#messages---message-1)
  - [Avis](#avis---review)
- [Flux d'authentification](#-flux-dauthentification)
- [Contrôle d'accès par rôle](#-contrôle-daccès-par-rôle)
- [Tests](#-tests)
- [Historique des migrations](#-historique-des-migrations)

---

## Présentation

Le Back-end Prestau est une **API RESTful** construite avec **NestJS** qui alimente la plateforme Prestau — une marketplace mettant en relation des **entreprises** (restaurants, bars) avec des **travailleurs intérimaires** du secteur de la restauration, pour des missions courte durée de type extras.

L'API gère :
- L'inscription et l'authentification des utilisateurs (JWT)
- La gestion des profils entreprise et travailleur
- La publication, candidature et gestion du cycle de vie des missions
- La messagerie entre entreprises et travailleurs
- Le système de notation et d'avis
- La gestion du calendrier de disponibilité des travailleurs

---

## Stack technique

| Technologie | Utilisation |
|---|---|
| **NestJS** v11 | Framework backend (TypeScript) |
| **Prisma** v7 | ORM & migrations de base de données |
| **PostgreSQL** | Base de données relationnelle |
| **Passport.js** | Middleware d'authentification |
| **JWT** | Jetons d'authentification (accès + rafraîchissement) |
| **bcrypt** | Hachage des mots de passe |
| **class-validator** | Validation des DTOs |
| **class-transformer** | Transformation des DTOs |
| **Joi** | Validation des variables d'environnement |
| **Jest** | Framework de tests unitaires |
| **TypeScript** v5 | Langage |

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Prisma CLI** (installé via les dépendances de développement)

---

## Installation

```bash
# Cloner le dépôt
git clone <url-du-dépôt>
cd Prestau/Back-end

# Installer les dépendances
npm install

# Générer le client Prisma
npm run prisma:generate
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine du dossier `Back-end/` :

```env
# Application
NODE_ENV=development          # development | production | test
PORT=3000                     # Port du serveur (défaut : 3000)

# Base de données
DATABASE_URL=postgresql://UTILISATEUR:MOT_DE_PASSE@HOTE:PORT/NOM_BASE

# Authentification
JWT_SECRET=votre-clé-secrète-sécurisée
```

| Variable | Requis | Défaut | Description |
|---|---|---|---|
| `NODE_ENV` | Non | `development` | Environnement de l'application |
| `PORT` | Non | `3000` | Port d'écoute du serveur |
| `DATABASE_URL` | **Oui** | — | Chaîne de connexion PostgreSQL |
| `JWT_SECRET` | **Oui** | — | Clé secrète pour la signature JWT |

---

## Configuration de la base de données

```bash
# Exécuter toutes les migrations en attente
npm run prisma:migrate

# Générer le client Prisma
npm run prisma:generate

```

### Visualiser la base de données

```bash
npx prisma studio
```

Cela ouvre un navigateur visuel à `http://localhost:5555`.

---

## Lancement de l'application

```bash
# Mode développement (rechargement automatique)
npm run start:dev

# Mode production
npm run build
npm run start

# L'API sera disponible sur http://localhost:3000
```

Le CORS est activé pour toutes les origines (`origin: '*'`). Un `ValidationPipe` global est actif pour la validation automatique des DTOs.

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run start` | Démarrer l'application |
| `npm run start:dev` | Démarrer en mode surveillance (rechargement auto) |
| `npm run build` | Compiler l'application |
| `npm run format` | Formater le code avec Prettier |
| `npm run lint` | Analyser et corriger les fichiers TypeScript |
| `npm run prisma:generate` | Générer le client Prisma |
| `npm run prisma:migrate` | Exécuter les migrations |
| `npm run prisma:seed` | Peupler la base de données |
| `npm test` | Lancer les tests unitaires |
| `npm run test:watch` | Lancer les tests en mode surveillance |
| `npm run test:cov` | Lancer les tests avec rapport de couverture |

---

## Architecture du projet

```
Back-end/
├── prisma/
│   ├── schema.prisma              # Définition du schéma de la base de données
│   ├── migrations/                # Historique des migrations (9 migrations)
│   └── seed.ts                    # Script de peuplement de la BDD
├── src/
│   ├── main.ts                    # Point d'entrée de l'application
│   ├── app.module.ts              # Module racine (importe tous les modules)
│   ├── prisma.service.ts          # Service de connexion à la base de données
│   ├── models/
│   │   └── basemodel.model.ts     # Classe de base (id, createdAt, updatedAt)
│   └── Modules/
│       ├── auth/                  # Module d'authentification
│       │   ├── auth.controller.ts     # 4 endpoints
│       │   ├── auth.service.ts        # Inscription, connexion, déconnexion, rafraîchissement
│       │   ├── decorators/            # Décorateur @Roles()
│       │   ├── dto/                   # LoginDto, RegisterDto
│       │   ├── enums/                 # Enum Role (COMPANY | WORKER)
│       │   ├── guards/               # JwtAuthGuard, RolesGuard
│       │   ├── interfaces/            # JwtPayload, CurrentUserRequest
│       │   └── strategies/            # Stratégie JWT Passport
│       ├── company/               # Module profil entreprise (5 endpoints)
│       ├── worker/                # Module profil travailleur (7 endpoints)
│       ├── job/                   # Module missions (6 endpoints)
│       ├── joboffer/              # Module candidatures (10 endpoints)
│       ├── message/               # Module messagerie (3 endpoints)
│       ├── review/                # Module avis & notations (2 endpoints)
│       └── user/                  # Module compte utilisateur (4 endpoints)
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

## Schéma de la base de données

### Diagramme des relations

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  Users   │───1:1─│ Entreprise│───1:N─│ Mission  │
│          │       └───────────┘       │          │
│ id       │                           │ id       │
│ email    │       ┌───────────┐       │ titre    │
│ password │───1:1─│Travailleur│       │ salaire  │
│ rôle     │       │           │       │ statut   │
│ refresh  │       │ id        │       └────┬─────┘
│ Token    │       │ prénom    │            │
└──────────┘       │ nom       │            │ 1:N
                   │ compétences│      ┌────┴──────┐
                   │ joursLibres│──1:N─│Candidature│───1:N─┌──────────┐
                   │joursOccupés│      │           │       │ Message  │
                   └───────────┘       │ id        │       │          │
                                       │ statut    │       │ contenu  │
                                       └────┬──────┘       │ lu       │
                                            │              └──────────┘
                                       ┌────┴─────┐
                                       │   Avis   │
                                       │          │
                                       │ note     │
                                       │commentaire│
                                       └──────────┘
```

### Modèles

#### Users (Utilisateurs)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `email` | String(255) | Unique |
| `password` | String(255) | Haché avec bcrypt |
| `role` | Role | Enum : `COMPANY` \| `WORKER` |
| `refreshToken` | String(255)? | Nullable, haché |
| `createdAt` | DateTime | Auto-généré |
| `updatedAt` | DateTime | Mis à jour automatiquement |

#### Company (Entreprise)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `companyName` | String(255) | Requis |
| `address` | String(255) | Requis |
| `postalCode` | Int | Requis |
| `city` | String(100) | Requis |
| `siret` | String(14) | Requis |
| `phoneNumber` | String(20) | Requis |
| `establishment_type` | String(100) | Requis |
| `description` | Text? | Optionnel |
| `website` | String(255)? | Optionnel |
| `social_media` | String(255)? | Optionnel |
| `userId` | Int | FK → Users, unique, suppression en cascade |

#### Worker (Travailleur)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `firstName` | String(100) | Requis |
| `lastName` | String(100) | Requis |
| `dateOfBirth` | DateTime? | Optionnel |
| `city` | String(100) | Requis |
| `postalCode` | Int | Requis |
| `photoURL` | String(255)? | Optionnel |
| `profession` | String(100) | Requis |
| `experience_years` | Int? | Optionnel |
| `languages` | Text | Requis |
| `qualifications` | Text? | Optionnel |
| `cv_url` | String(255)? | Optionnel |
| `availability` | Boolean | Défaut : `true` |
| `phoneNumber` | String(20) | Requis |
| `skills` | Text | Requis |
| `freeDays` | String[] | Défaut : `[]` |
| `busyDays` | String[] | Défaut : `[]` |
| `userId` | Int | FK → Users, unique, suppression en cascade |

#### Job (Mission)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `title` | String(100) | Requis |
| `description` | Text | Requis |
| `salary` | Float | Requis |
| `start_time` | DateTime | Requis |
| `end_time` | DateTime | Requis |
| `companyId` | Int | FK → Company, indexé, suppression en cascade |
| `status` | JobStatus | Défaut : `OPEN` |

**Enum JobStatus** : `OPEN` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`

#### JobOffer (Candidature)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `request_at` | DateTime | Défaut : `now()` |
| `response_at` | DateTime? | Nullable |
| `contract_url` | String(255)? | Optionnel |
| `contract_signed` | Boolean? | Défaut : `false` |
| `signed_at` | DateTime? | Nullable |
| `selected_by_company` | Boolean? | Défaut : `false` |
| `jobId` | Int | FK → Job, indexé, suppression en cascade |
| `workerId` | Int | FK → Worker, indexé, suppression en cascade |
| `status` | JobOfferStatus | Défaut : `PENDING` |

**Enum JobOfferStatus** : `PENDING` | `ACCEPTED` | `REJECTED` | `CANCELLED` | `COMPLETED`

#### Review (Avis)
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `rating` | Int | 1–5 |
| `comment` | Text? | Optionnel |
| `jobId` | Int | FK → Job, indexé, suppression en cascade |
| `reviewerType` | String(50) | `COMPANY` ou `WORKER` |
| `reviewerId` | Int | Indexé (composite avec type) |
| `revieweeType` | String(50) | `COMPANY` ou `WORKER` |
| `revieweeId` | Int | Indexé (composite avec type) |
| `is_visible` | Boolean | Défaut : `true` |

#### Message
| Colonne | Type | Contraintes |
|---|---|---|
| `id` | Int | PK, auto-incrément |
| `jobOfferId` | Int | FK → JobOffer, indexé, suppression en cascade |
| `senderId` | Int | Requis |
| `receiverId` | Int | Requis |
| `content` | Text | Requis |
| `sentAt` | DateTime | Défaut : `now()` |
| `is_read` | Boolean | Défaut : `false` |

---

## Référence API

Tous les endpoints protégés nécessitent l'en-tête `Authorization: Bearer <token>`.

### Authentification — `/auth`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | ❌ | — | Inscrire un nouvel utilisateur |
| `POST` | `/auth/login` | ❌ | — | S'authentifier et obtenir les jetons |
| `POST` | `/auth/logout` | ✅ | Tous | Invalider le jeton de rafraîchissement |
| `POST` | `/auth/refresh-token` | ❌ | — | Rafraîchir le jeton d'accès |

<details>
<summary><strong>POST /auth/register</strong></summary>

**Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motDePasse123",
  "role": "WORKER"
}
```

**Validation :**
- `email` : Doit être un email valide
- `password` : Minimum 6 caractères
- `role` : Doit être `COMPANY` ou `WORKER`

**Réponse (201) :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "utilisateur@exemple.com",
    "role": "WORKER"
  }
}
```
</details>

<details>
<summary><strong>POST /auth/login</strong></summary>

**Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motDePasse123"
}
```

**Réponse (200) :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "utilisateur@exemple.com",
    "role": "WORKER"
  }
}
```

**Erreurs :**
- `401` : Email ou mot de passe invalide
- `403` : Profil entreprise/travailleur pas encore créé
</details>

<details>
<summary><strong>POST /auth/logout</strong></summary>

**En-têtes :** `Authorization: Bearer <access_token>`

**Réponse (200) :**
```json
{
  "message": "Logout successful"
}
```
</details>

<details>
<summary><strong>POST /auth/refresh-token</strong></summary>

**Corps de la requête :**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Réponse (200) :**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erreurs :**
- `401` : Jeton de rafraîchissement invalide ou expiré
</details>

---

### Utilisateurs — `/user`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `GET` | `/user/MyProfile` | ✅ | Tous | Obtenir le profil de l'utilisateur connecté |
| `GET` | `/user/:id` | ✅ | Tous | Obtenir un utilisateur par ID |
| `PATCH` | `/user/MyProfile` | ✅ | Tous | Modifier le profil de l'utilisateur connecté |
| `DELETE` | `/user/MyProfile` | ✅ | Tous | Supprimer le compte de l'utilisateur connecté |

---

### Entreprises — `/company`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/company` | ✅ | COMPANY | Créer un profil entreprise |
| `GET` | `/company/MyCompany` | ✅ | COMPANY | Obtenir son profil entreprise |
| `GET` | `/company/:id` | ✅ | WORKER | Voir un profil entreprise |
| `PATCH` | `/company/MyCompany` | ✅ | COMPANY | Modifier son profil entreprise |
| `DELETE` | `/company/MyCompany` | ✅ | COMPANY | Supprimer son profil entreprise |

<details>
<summary><strong>POST /company</strong></summary>

**Corps de la requête :**
```json
{
  "companyName": "Restaurant Le Gourmet",
  "address": "12 Rue de la Paix",
  "city": "Paris",
  "postalCode": 75001,
  "siret": "12345678901234",
  "phoneNumber": "+33612345678",
  "establishment_type": "Restaurant",
  "description": "Restaurant gastronomique français",
  "website": "https://legourmet.fr",
  "social_media": "https://instagram.com/legourmet"
}
```

**Requis :** `companyName`, `address`, `city`, `postalCode`, `siret`, `phoneNumber`, `establishment_type`  
**Optionnel :** `description`, `website`, `social_media`

**Erreurs :**
- `409` : Un profil entreprise existe déjà pour cet utilisateur
</details>

---

### Travailleurs — `/worker`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/worker` | ✅ | WORKER | Créer un profil travailleur |
| `GET` | `/worker/MyProfile` | ✅ | WORKER | Obtenir son profil travailleur |
| `GET` | `/worker/availability` | ✅ | WORKER | Obtenir le calendrier de disponibilité |
| `PATCH` | `/worker/availability` | ✅ | WORKER | Mettre à jour la disponibilité d'un jour |
| `GET` | `/worker/:id` | ✅ | COMPANY | Voir un profil travailleur |
| `PATCH` | `/worker/MyProfile` | ✅ | WORKER | Modifier son profil travailleur |
| `DELETE` | `/worker/MyProfile` | ✅ | WORKER | Supprimer son profil travailleur |

<details>
<summary><strong>POST /worker</strong></summary>

**Corps de la requête :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1995-06-15T00:00:00.000Z",
  "city": "Lyon",
  "postalCode": 69001,
  "profession": "Serveur",
  "experience_years": 3,
  "languages": "Français, Anglais",
  "qualifications": "CAP Restauration",
  "phoneNumber": "+33698765432",
  "skills": "Service en salle, Préparation cocktails"
}
```

**Requis :** `firstName`, `lastName`, `city`, `postalCode`, `profession`, `languages`, `phoneNumber`, `skills`  
**Optionnel :** `dateOfBirth`, `photoURL`, `experience_years`, `qualifications`, `cv_url`, `availability`
</details>

<details>
<summary><strong>PATCH /worker/availability</strong></summary>

**Corps de la requête :**
```json
{
  "date": "2026-03-15",
  "status": "busy"
}
```

**Valeurs de status :** `free` (libre) | `busy` (occupé) | `neutral` (neutre)

**Réponse (200) :**
```json
{
  "freeDays": ["2026-03-10", "2026-03-12"],
  "busyDays": ["2026-03-15", "2026-03-20"]
}
```
</details>

---

### Missions — `/job`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/job` | ✅ | COMPANY | Créer une offre de mission |
| `GET` | `/job` | ✅ | Tous | Lister les missions (recherche optionnelle) |
| `GET` | `/job/my-jobs` | ✅ | Tous | Lister ses propres missions |
| `GET` | `/job/:id` | ✅ | Tous | Détail d'une mission |
| `PATCH` | `/job/:id` | ✅ | COMPANY | Modifier une mission |
| `DELETE` | `/job/:id` | ✅ | COMPANY | Supprimer une mission |

<details>
<summary><strong>POST /job</strong></summary>

**Corps de la requête :**
```json
{
  "title": "Serveur pour soirée privée",
  "description": "Service pour une soirée de 50 personnes",
  "salary": 15.50,
  "start_time": "2026-03-20T18:00:00.000Z",
  "end_time": "2026-03-21T02:00:00.000Z"
}
```
</details>

<details>
<summary><strong>GET /job?search=paris</strong></summary>

**Paramètres de requête :**
- `search` (optionnel) : Filtre par titre de mission ou ville de l'entreprise (insensible à la casse)

**Comportement selon le rôle :**
- **COMPANY** : Retourne uniquement ses propres missions
- **WORKER** : Retourne toutes les missions disponibles correspondant aux critères
</details>

---

### Candidatures — `/joboffer`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/joboffer/:jobId` | ✅ | WORKER | Postuler à une mission |
| `POST` | `/joboffer/:id/accept` | ✅ | COMPANY | Accepter une candidature |
| `POST` | `/joboffer/:id/reject` | ✅ | COMPANY | Refuser une candidature |
| `POST` | `/joboffer/:id/complete` | ✅ | COMPANY | Marquer la mission comme terminée |
| `POST` | `/joboffer/:id/cancel` | ✅ | COMPANY | Annuler une candidature acceptée |
| `GET` | `/joboffer/my-offers` | ✅ | COMPANY | Voir les candidatures reçues |
| `GET` | `/joboffer/my-applications` | ✅ | WORKER | Voir ses candidatures envoyées |
| `GET` | `/joboffer/history` | ✅ | Tous | Historique des missions terminées |
| `GET` | `/joboffer/:id` | ✅ | Tous | Détail d'une candidature |
| `DELETE` | `/joboffer/cancel/:jobId` | ✅ | WORKER | Annuler sa candidature |

<details>
<summary><strong>Cycle de vie d'une candidature</strong></summary>

```
Le travailleur postule → PENDING (en attente)
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
           ACCEPTED      REJECTED    CANCELLED
          (acceptée)    (refusée)    (annulée)
                │
                ▼
           COMPLETED
           (terminée)
```

**Transitions de statut :**
1. `PENDING` → `ACCEPTED` : L'entreprise accepte. Statut de la mission → `IN_PROGRESS`
2. `PENDING` → `REJECTED` : L'entreprise refuse. Si aucune candidature active, mission → `OPEN`
3. `ACCEPTED` → `CANCELLED` : L'entreprise annule. Si aucune candidature active, mission → `OPEN`
4. `ACCEPTED` → `COMPLETED` : L'entreprise marque comme terminée. Mission → `COMPLETED`
</details>

---

### Messages — `/message`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/message` | ✅ | Tous | Envoyer un message |
| `GET` | `/message` | ✅ | Tous | Obtenir tous ses messages |
| `GET` | `/message/:id` | ✅ | Tous | Obtenir un message spécifique |

<details>
<summary><strong>POST /message</strong></summary>

**Corps de la requête :**
```json
{
  "content": "Bonjour, je suis intéressé par ce poste !",
  "jobOfferId": 1
}
```

**Note :** Le `receiverId` est déterminé automatiquement en fonction du rôle de l'expéditeur et du contexte de la candidature. Seuls les participants (entreprise propriétaire ou travailleur candidat) peuvent envoyer des messages.
</details>

---

### Avis — `/review`

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `POST` | `/review` | ✅ | Tous | Soumettre un avis |
| `GET` | `/review/:id` | ✅ | Tous | Obtenir un avis |

<details>
<summary><strong>POST /review</strong></summary>

**Corps de la requête :**
```json
{
  "rating": 5,
  "comment": "Excellent service, très professionnel !",
  "jobId": 1,
  "reviewerType": "COMPANY",
  "reviewerId": 1,
  "revieweeType": "WORKER",
  "revieweeId": 3
}
```

**Validation :**
- `rating` : Entier entre 1 et 5 (requis)
- `comment` : Chaîne, max 1000 caractères (optionnel)
- Les auto-évaluations ne sont pas autorisées
- Un seul avis par utilisateur par mission
</details>

---

## Flux d'authentification

```
┌─────────────────────────────────────────────────────────┐
│                    INSCRIPTION                           │
│  POST /auth/register                                     │
│  { email, mot de passe, rôle }                           │
│  → Retourne : access_token (15min) + refreshToken (7j)   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 CRÉATION DU PROFIL                        │
│  POST /company  (si rôle = COMPANY)                      │
│  POST /worker   (si rôle = WORKER)                       │
│  → Crée le profil associé                                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    CONNEXION                             │
│  POST /auth/login                                        │
│  { email, mot de passe }                                 │
│  → Vérifie que le profil existe                          │
│  → Retourne : access_token (15min) + refreshToken (7j)   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               REQUÊTES AUTHENTIFIÉES                     │
│  Authorization: Bearer <access_token>                    │
│  → Accès aux endpoints protégés                          │
└──────────────────────┬──────────────────────────────────┘
                       │
          Le jeton expire (15 min)
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              RAFRAÎCHISSEMENT DU JETON                    │
│  POST /auth/refresh-token                                │
│  { refreshToken }                                        │
│  → Retourne : nouveau access_token + nouveau refreshToken│
│  → Rotation des jetons (ancien refreshToken invalidé)    │
└─────────────────────────────────────────────────────────┘
```

### Fonctionnalités de sécurité
- Mots de passe hachés avec **bcrypt** (10 tours de salage)
- Jetons d'accès expirent après **15 minutes**
- Jetons de rafraîchissement expirent après **7 jours**
- **Rotation** des jetons de rafraîchissement à chaque renouvellement
- Jetons de rafraîchissement **hachés avant stockage** en base de données
- La **déconnexion** invalide le jeton côté serveur

---

## Contrôle d'accès par rôle

L'API implémente un système de double garde :

1. **`JwtAuthGuard`** : Vérifie que le jeton JWT est valide et non expiré
2. **`RolesGuard`** : Vérifie le rôle de l'utilisateur via le décorateur `@Roles()`

| Fonctionnalité | COMPANY | WORKER |
|---|---|---|
| Créer/gérer un profil entreprise | ✅ | ❌ |
| Créer/gérer un profil travailleur | ❌ | ✅ |
| Créer des offres de mission | ✅ | ❌ |
| Postuler à des missions | ❌ | ✅ |
| Accepter/refuser des candidatures | ✅ | ❌ |
| Terminer/annuler des candidatures | ✅ | ❌ |
| Voir les missions disponibles | ✅ (les siennes) | ✅ (toutes) |
| Envoyer des messages | ✅ | ✅ |
| Laisser des avis | ✅ | ✅ |
| Voir les profils entreprise | ❌ | ✅ |
| Voir les profils travailleur | ✅ | ❌ |
| Gérer le calendrier de disponibilité | ❌ | ✅ |

---

## Tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode surveillance
npm run test:watch

# Lancer les tests avec rapport de couverture
npm run test:cov
```

Les fichiers de tests se trouvent aux côtés de leurs fichiers sources avec le suffixe `.spec.ts`. Le projet utilise **Jest** comme framework de test avec **@nestjs/testing** pour le mocking des modules.

Modules avec couverture de tests :
- `auth.service.spec.ts`
- `company.service.spec.ts`
- `job.service.spec.ts`
- `worker.service.spec.ts`
- `message.service.spec.ts`
- `review.service.spec.ts`
- `user.service.spec.ts`

---

## Historique des migrations

| # | Migration | Description |
|---|---|---|
| 1 | `20260205_complete_schema_relations` | Schéma initial : toutes les tables, enums, clés étrangères |
| 2 | `20260211_init` | Suppression de colonnes obsolètes, correction de types |
| 3 | `20260219_add_role_enum` | Conversion de la colonne rôle en type Enum |
| 4 | `20260302_add_refreshToken` | Ajout du support du jeton de rafraîchissement |
| 5 | `20260303_phoneNumber_company` | Ajout du numéro de téléphone à l'entreprise |
| 6 | `20260303_add_calendar_to_worker` | Ajout des tableaux freeDays/busyDays |
| 7 | `20260308_add_postal_code_and_city` | Ajout ville et code postal à l'entreprise |
| 8 | `20260309_remove_address_from_job` | Suppression de l'adresse des missions |
| 9 | `20260309_add_cascade_delete` | Passage de toutes les FK en suppression CASCADE |
