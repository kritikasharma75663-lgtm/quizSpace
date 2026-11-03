# QuizMaster — Smart Online Quiz Platform

QuizMaster is a full-stack, intermediate-level solo capstone web application built on the **MERN** stack (MongoDB, Express.js, React.js with Vite, and Node.js) paired with **Tailwind CSS**, **Recharts**, and **Lucide React**. 

It provides an educational SaaS experience for timed, authoritative online assessments with strict server-side scoring, detailed review feedback with explanations, and a dedicated **Admin Attempts & Results Audit Ledger**.

---

## 🌟 Key Highlights

- **Database-Driven Assessment Engine:** All categories, quizzes, questions (MCQs with 4 options and explanations), users, and attempts are stored in a real MongoDB database via Mongoose models. Zero hardcoded question banks.
- **Authoritative Server-Side Scoring:** Answers and correct keys are never exposed to the client browser during an attempt. The server evaluates submissions, validates countdown timings, calculates marks, and preserves an immutable snapshot for historical integrity.
- **Admin Quiz Attempts & Results Ledger:** Dedicated administrative audit interface that tracks exactly **which user played which quiz and how many marks they obtained**, complete with filtering, sorting, pagination, question-by-question modal audit, and 1-click **CSV export**.
- **Admin Management Portal:** Create, update, publish/unpublish, and delete quizzes and categories. Add, update, and manage individual MCQ questions with correct option selectors and explanations directly from the browser UI without touching React code.
- **Student Dashboard & Analytics:** Personalized welcome banner, 4 key performance metrics (Quizzes attempted, average score %, overall accuracy, correct answers), and a Recharts performance progression chart.
- **Full Authentication & Role Authorization:** Secure JWT authentication via HTTP-only cookies and Bearer tokens, bcrypt password hashing, and role-based route guards (`user` vs `admin`).
- **1-Click Quick Demo Login:** Instant autofill buttons on the login screen for both Student and Administrator accounts.

---

## 🏗️ Project Architecture & Folder Structure

```
QuizMaster/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, Badge, Card, StatCard, etc.
│   │   │   ├── layout/         # Navbar, Sidebar, AdminSidebar, Topbar, Footer
│   │   │   ├── quiz/           # QuizCard, Timer, QuestionPalette, OptionCard
│   │   │   ├── admin/          # QuizFormModal, QuestionFormModal, AttemptDetailModal
│   │   │   └── charts/         # PerformanceChart, CategoryBarChart (Recharts)
│   │   ├── context/            # AuthContext (JWT, user state, login/logout)
│   │   ├── hooks/              # useQuizTimer (countdown, auto-submit trigger)
│   │   ├── layouts/            # PublicLayout, UserLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── user/           # UserDashboard, BrowseQuizzes, QuizDetails, LiveQuizAttempt, QuizResult, AttemptHistory, UserProfile
│   │   │   ├── admin/          # AdminDashboard, AdminQuizzes, AdminQuestions, AdminQuizAttempts, AdminCategories, AdminUsers
│   │   │   └── public/         # LandingPage, UnauthorizedPage, NotFoundPage
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/           # api.js, authService, quizService, attemptService, adminService
│   │   ├── utils/              # formatters.js (time, date, badge color utilities)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── server/
│   ├── config/                 # db.js (Mongoose MongoDB connection)
│   ├── controllers/            # authController, quizController, questionController, attemptController, adminController
│   ├── middleware/             # auth.js (JWT & Role verify), errorHandler.js, rateLimiter.js
│   ├── models/                 # User, Category, Quiz, Question, QuizAttempt
│   ├── routes/                 # authRoutes, categoryRoutes, quizRoutes, questionRoutes, attemptRoutes, adminRoutes
│   ├── services/               # scoringService.js, analyticsService.js
│   ├── scripts/                # seed.js (populates 6 categories, 60+ questions, admin & students)
│   ├── app.js                  # Express middleware, CORS, Helmet, cookie-parser
│   ├── server.js               # Server initialization and graceful shutdown
│   ├── .env.example
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 / 18, Vite, React Router 6, Axios |
| **Styling** | Tailwind CSS, Lucide React icons |
| **Data Visualization** | Recharts (AreaChart, BarChart) |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB with Mongoose ODM |
| **Security & Auth** | JWT, bcryptjs, Helmet, Express Rate Limit, Cookie-Parser, CORS |

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18 or higher (v22 tested)
- **NPM**: v9 or higher
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas URI

### 2. Environment Configuration

In the `server` directory, create a `.env` file (you can copy `.env.example`):

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/quizmaster
JWT_SECRET=quizmaster_super_secure_jwt_secret_key_2026_capstone_project
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Platform Administrator
ADMIN_EMAIL=admin@quizmaster.com
ADMIN_PASSWORD=Admin@123456
```

### 3. Install Dependencies

You can install all dependencies from the root directory or inside each folder:

```bash
# Root:
npm run install:all

# Or separately:
cd server && npm install
cd ../client && npm install
```

### 4. Seed the Database

Populate MongoDB with 6 academic categories, 6 sample quizzes across difficulties, 60 rich MCQ questions with explanations, pre-configured admin and student demo accounts, and sample completed attempts:

```bash
cd server
npm run seed
```

### 5. Running the Application

In terminal 1 (start Backend API):
```bash
cd server
npm start
# Server runs at http://localhost:5000/api
```

In terminal 2 (start Frontend Client):
```bash
cd client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 👥 Default Demo Credentials

On the login page (`http://localhost:5173/login`), use the 1-click **Quick Fill** buttons or enter:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@quizmaster.com` | `Admin@123456` | Full administrative control, question bank CRUD, attempts audit ledger, CSV export, user management |
| **Student** | `user@quizmaster.com` | `User@123456` | Take quizzes, view results with explanations, review personal dashboard & history |
| **Student 2** | `sarah.chen@example.com` | `User@123456` | Additional demo account with completed assessments |

---

## 📋 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new student account (cannot self-register as admin)
- `POST /api/auth/login` — Log in and receive HTTP-only cookie + JWT token
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Get current authenticated user
- `PUT /api/auth/profile` — Update display name or change password

### Quizzes & Categories
- `GET /api/categories` — Get active categories with live quiz counts
- `POST /api/categories` — (Admin) Create category
- `GET /api/quizzes` — Browse published quizzes (search, category, difficulty, pagination)
- `GET /api/quizzes/:id` — Get quiz details and rules
- `POST /api/quizzes` — (Admin) Create new quiz
- `PUT /api/quizzes/:id` — (Admin) Update quiz settings and publish status
- `DELETE /api/quizzes/:id` — (Admin) Delete quiz and cascade questions

### Questions (Admin Only)
- `GET /api/quizzes/:id/questions` — View quiz question bank (includes correct keys & explanations)
- `POST /api/quizzes/:id/questions` — Add new MCQ question with 4 options and correct option index
- `PUT /api/questions/:id` — Update question text, options, or explanation
- `DELETE /api/questions/:id` — Delete question from MongoDB

### Quiz Attempts & Scoring
- `POST /api/attempts/start` — Start new attempt or resume active attempt (sanitizes questions, stripping keys)
- `PUT /api/attempts/:id/answer` — Progressively save selected answer
- `POST /api/attempts/:id/submit` — Authoritative server-side evaluation & score calculation
- `GET /api/attempts/my-history` — User's completed attempt history
- `GET /api/attempts/:id/result` — Get result with full question snapshot, chosen answer, correct key, and explanation

### Admin Analytics & Audit Ledger
- `GET /api/admin/dashboard` — Platform stats, category distribution, recent attempts
- `GET /api/admin/attempts` — Filterable audit table of all attempts across all users
- `GET /api/admin/attempts/:id` — Question-by-question scoring breakdown audit
- `GET /api/admin/reports/export` — Stream attempts report as downloadable CSV
- `GET /api/admin/users` — List all registered users with performance metrics
- `PATCH /api/admin/users/:id/status` — Activate / deactivate user account

---

## 🔒 Security & Reliability Implementations

1. **Answer Key Protection:** Correct answers (`correctAnswer`) and explanations are completely omitted from client responses during active test attempts.
2. **Server-Side Timer Validation:** Server compares attempt `startedAt` with quiz duration. Expired attempts cannot be modified and are automatically finalized.
3. **Immutable Snapshot:** Every finalized attempt archives a snapshot of the exact questions, choices, correct keys, and candidate answers as they existed when the test was completed.
4. **Rate Limiting & Helmet:** Protects auth endpoints against brute force attempts and sets secure HTTP headers.
5. **CORS & Cookies:** Configured for cross-origin credentials with fallback Bearer token support.
6. **Input Validation:** Safe MongoDB queries and duplicate email prevention.

---

## 👨‍💻 Capstone Evaluation Checklist

- [x] Full-Stack MERN connected to real MongoDB instance
- [x] No hardcoded question arrays in frontend
- [x] Clean light UI theme with navy blue, indigo, and soft violet accents
- [x] Real-time countdown timer with auto-submit on timeout
- [x] Complete student assessment flow with question navigator palette
- [x] Authoritative server scoring with pass/fail evaluation
- [x] Results review page with correct answers and educational explanations
- [x] Separate protected Admin Panel with role-based guards
- [x] **Admin Quiz Attempts & Results ledger** displaying user, quiz, marks, percentage, and time taken
- [x] Question-by-question audit modal for admin inspection
- [x] CSV export of all student attempts
- [x] Admin Quiz and Question bank CRUD with immediate MongoDB persistence
- [x] Database seed script with 6 categories, 6 quizzes, and 60+ questions
