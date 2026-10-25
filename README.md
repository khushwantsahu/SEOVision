# SEO Vision – Intelligent SEO Tracking Analyzer

![SEO Vision](/client/public/favicon.svg)

> **MCA 3rd-Semester Final Project**  
> **Project Title:** SEO Vision – Intelligent SEO Tracking Analyzer  
> **Tech Stack:** MERN (MongoDB, Express.js, React, Node.js) + Vite + Tailwind CSS + Recharts + Gemini AI

---

## 📌 Project Overview

**SEO Vision** is a full-stack MERN application built to analyze website SEO health, detect technical and on-page vulnerabilities, compute deterministic 0–100 SEO scores across 6 categories, provide actionable AI recommendations via Google Gemini, track target keyword rank positions over time, and persist analysis history in MongoDB.

### Core Modules
1. **Authentication:** User Registration, Login, JWT authentication, Bcrypt password hashing, and user data isolation.
2. **Dashboard:** Overview statistics, daily scan quotas, recent analyses feed, and rapid URL audit bar.
3. **AI Website Analyzer:** Live web crawler, SSRF security filter, 0–100 deterministic scoring engine, progress UI, and AI insights.
4. **Rank Tracker:** Target keyword monitoring, position change calculation, position history Recharts graph, and rank re-checking.
5. **History & Insights:** Searchable, filterable log of all user's previous website scans.
6. **Pricing & Subscription Architecture:** FREE vs PRO plan options with upgrade checkout flow.

---

## 🏗️ Architecture & Data Flow

```
User (Browser)
   │
   ▼
React + Vite Frontend (Client)
   │
   ▼
Express REST API (Server /api)
   │
   ├── Auth Middleware (JWT Verification)
   ├── SSRF Protection Middleware (validateUrl)
   │
   ├── Crawler Service (Cheerio + Axios HTML Extractor)
   ├── SEO Score Engine (Deterministic 0–100 Category Scoring)
   ├── AI Service (Google Gemini AI + Fallback Engine)
   ├── Rank Tracker Engine (Position Calculator & History Update)
   │
   ▼
MongoDB Atlas (Mongoose ODM Persistence)
```

---

## 🛠️ Technologies Used

- **Frontend:** React 18, Vite, React Router DOM, Tailwind CSS, Lucide React Icons, Recharts, Axios.
- **Backend:** Node.js, Express.js, Mongoose ODM, JSON Web Tokens (JWT), BcryptJS, Cheerio, Express Rate Limit, Helmet.
- **Database:** MongoDB / MongoDB Atlas.
- **AI Integration:** Google Gemini API (with deterministic fallback).
- **Testing:** Vitest (Unit & Integration tests).

---

## 🔒 Security Protections

1. **SSRF Protection (`server/utils/ssrfFilter.js`):** Rejects loopback addresses (`127.0.0.1`), `localhost`, private IP ranges (`10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`), and cloud metadata endpoints (`169.254.169.254`).
2. **Password Security:** Hashes passwords with `bcryptjs` (salt factor 10) and excludes password from user queries (`select: false`).
3. **User Data Isolation:** Enforces `userId` check across all database queries (`SEOAnalysis`, `KeywordTracking`, `Subscription`).
4. **Rate Limiting:** Protects API endpoints against DDoS and brute-force attacks via `express-rate-limit`.

---

## 📁 Directory Structure

```
SEOVision0/
│
├── client/                      # React 18 + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, ScoreGauge, SEOIssueCard, RankChart, ProgressUI, etc.
│   │   ├── context/            # AuthContext (Auth, Theme, Toast)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Analyze, Report, RankTracker, History, Pricing
│   │   ├── services/           # Axios API services
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Design System & Tailwind CSS
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── config/                 # MongoDB database connection
│   ├── controllers/            # Auth, Analysis, Rank, Dashboard, Subscription
│   ├── middleware/             # Auth, SSRF Validation, Rate Limiter, Error Handler
│   ├── models/                 # User, SEOAnalysis, KeywordTracking, Subscription, Payment
│   ├── routes/                 # Express API routes
│   ├── services/               # Crawler, SEO Score Engine, AI Service, Rank Tracker Service
│   ├── utils/                  # SSRF Filter helper
│   ├── tests/                  # Vitest unit test suites
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── Dockerfile                   # Linux-compatible Docker configuration
├── docker-compose.yml           # Multi-container orchestration (App + MongoDB)
├── package.json                 # Root script runner (Concurrently)
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas connection URI

### 1. Environment Variables Configuration
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/SEO
JWT_SECRET=seo_vision_secret_jwt_key_mca_2026_secure
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Optional Gemini AI Key
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash
```

---

### 💻 Windows Setup Commands

```powershell
# Clone or navigate to project directory
cd SEOVision0

# Install dependencies for root, server, and client
npm run install:all

# Run backend tests
cd server
npm test
cd ..

# Run backend and frontend simultaneously in development mode
npm run dev
```

---

### 🐧 Linux / macOS Setup Commands

```bash
# Navigate to workspace
cd SEOVision0

# Install all packages
npm install
npm install --prefix server
npm install --prefix client

# Execute Vitest backend test suite
cd server && npm test && cd ..

# Start development servers concurrently
npm run dev
```

---

### 🐳 Docker Setup (Linux Containers)

```bash
# Build and run containers in detached mode
docker-compose up -d --build

# View container logs
docker-compose logs -f app
```

---

## 📑 API Endpoint Documentation

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |
| `POST` | `/api/auth/logout` | Private | Clear session |
| `POST` | `/api/analysis` | Private | Run SEO analysis on a website |
| `GET` | `/api/analysis` | Private | Get user's analysis history |
| `GET` | `/api/analysis/:id` | Private | View detailed analysis report |
| `DELETE` | `/api/analysis/:id` | Private | Delete an analysis record |
| `POST` | `/api/rank-tracker` | Private | Add keyword for rank tracking |
| `GET` | `/api/rank-tracker` | Private | List tracked keywords |
| `PUT` | `/api/rank-tracker/:id/refresh` | Private | Re-check rank position |
| `DELETE` | `/api/rank-tracker/:id` | Private | Delete tracked keyword |
| `GET` | `/api/dashboard/stats` | Private | Get overview dashboard stats |
| `GET` | `/api/subscription` | Private | Fetch current subscription |
| `POST` | `/api/subscription/checkout` | Private | Upgrade to PRO plan |

---

## 🧪 Testing Results

Unit tests executed with **Vitest**:
- `tests/ssrf.test.js`: Verified blocking of `127.0.0.1`, `localhost`, `169.254.169.254`, and `javascript:` URIs. (4/4 Passed)
- `tests/seoScore.test.js`: Verified deterministic scoring algorithm across perfect and unoptimized page fixtures. (3/3 Passed)
- `tests/rankTracker.test.js`: Verified rank calculator and position improvement change. (2/2 Passed)

**Total Test Suite:** 3 Passed (9/9 Unit Tests Passed)

---

## 🎓 MCA Presentation & Viva Notes

- **Q: How does the SEO analyzer prevent SSRF attacks?**  
  *A:* The `validateUrlForSsrf` utility parses user input using the standard `URL` module, checks if the hostname is an IP or domain, and cross-checks against private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.1`), and AWS metadata (`169.254.169.254`) before making any HTTP request.
- **Q: Is the SEO score random?**  
  *A:* No. The score is computed deterministically by `seoScoreService.js` by assessing 6 weighted categories (Technical 20%, On-Page 25%, Performance 20%, Accessibility 15%, Content 10%, Best Practices 10%). The same HTML input will always produce the exact same score.
- **Q: How does the application handle missing AI API keys?**  
  *A:* The `aiService.js` includes a deterministic fallback generator that produces tailored recommendations based on the actual crawled data if `AI_API_KEY` is not present or if the external API call fails.
