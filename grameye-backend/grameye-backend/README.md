# GramEye AI — Backend API

Real Node.js + Express + MongoDB backend for GramEye AI: authentication,
complaint lifecycle, an AI service layer, village analytics, notifications,
and a rewards/gamification system.

## Tech stack
- **Runtime:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **AI layer:** rule-based deterministic engine (`AI_MODE=mock`), designed
  to be swapped for a real provider (`AI_MODE=real`) without changing any
  route or controller code — see `services/ai/aiService.js`.

## Setup

1. Install MongoDB locally (or use a free MongoDB Atlas cluster) and Node.js 18+.
2. Install dependencies:
   ```bash
   cd grameye-backend
   npm install
   ```
3. Copy the env file and fill in your values:
   ```bash
   cp .env.example .env
   ```
4. Seed realistic demo data (1 village, 6 wards, 9 departments, 6 users, 12 complaints):
   ```bash
   npm run seed
   ```
5. Run the server:
   ```bash
   npm run dev      # with nodemon (auto-restart)
   # or
   npm start
   ```
   Server runs at `http://localhost:5000`.

## Demo accounts
(password for all: `Demo@123`)

| Role     | Email                  |
|----------|-------------------------|
| Citizen  | citizen@grameye.demo    |
| Officer  | officer@grameye.demo    |
| Admin    | admin@grameye.demo      |

## Testing the API (for your screenshots)
Use **Postman** or the **Thunder Client** VS Code extension:

1. `POST /api/auth/login` with `{ "email": "citizen@grameye.demo", "password": "Demo@123" }` → copy the returned `token`.
2. Add header `Authorization: Bearer <token>` to all further requests.
3. `GET /api/dashboard/citizen` → citizen's stats and recent complaints.
4. `POST /api/complaints` with a body like:
   ```json
   { "title": "Pothole near school", "description": "Large pothole, school nearby", "category": "Road Damage", "ward": "<a ward _id from your DB>" }
   ```
   → returns the created complaint **plus live AI analysis** (severity, confidence, suggested department) and any detected duplicates.
5. Login as `admin@grameye.demo` and call `GET /api/dashboard/admin` for the command-center stats.

## API reference

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/complaints                 (filters: status, category, severity, ward, department, q)
GET    /api/complaints/:id
POST   /api/complaints                 (citizen — runs AI analysis + duplicate check)
PATCH  /api/complaints/:id             (officer/admin)
POST   /api/complaints/:id/assign
POST   /api/complaints/:id/resolve     (requires afterImageUrl)
POST   /api/complaints/:id/reopen
POST   /api/complaints/:id/verify      (citizen confirms resolution, +50 XP)

POST   /api/ai/analyze                 { category, description, ward }
POST   /api/ai/duplicate-check         { category, ward, excludeId }
POST   /api/ai/insight                 { question, ward }  — AI analytics assistant

GET    /api/villages
GET    /api/villages/:id
GET    /api/villages/:id/analytics
GET    /api/villages/meta/departments

GET    /api/dashboard/citizen
GET    /api/dashboard/admin            (officer/admin only)

GET    /api/rewards/leaderboard?period=weekly|monthly|alltime
POST   /api/rewards/claim              { badgeName }
```

## Database schema (Mongoose models — `models/models.js`)
`Village, Ward, Department, User, Complaint, ComplaintStatusHistory,
Notification, Reward, Badge` — matching the entity list in the project
architecture doc, with timestamps, enums for role/status/severity, and
foreign-key style references (`ObjectId` + `ref`).

## Connecting the React frontend
In `grameye-ai.jsx`, replace the client-side `useState` complaint list and
`mockAnalyze()` calls with `fetch` calls to this API (e.g.
`fetch('http://localhost:5000/api/complaints', { headers: { Authorization: 'Bearer ' + token } })`).
The response shapes were designed to match the fields the UI already reads
(`id`→`complaintCode`, `severity`, `status`, `progress`, `ward`, `category`).
