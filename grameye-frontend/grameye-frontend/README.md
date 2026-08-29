# GramEye AI — Frontend

A fully interactive React prototype of GramEye AI: landing page, citizen
dashboard, multi-step "Report a Problem" flow with mock AI analysis,
village map, admin command center with charts, rewards/leaderboard, and
an EN/Hindi toggle.

## Tech stack
- React 18 + Vite
- lucide-react (icons)
- recharts (admin dashboard charts)
- Plain CSS-in-JS (inline styles + CSS variables) — no Tailwind required

## Setup

1. Make sure Node.js 18+ is installed (`node -v` to check).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed URL — usually `http://localhost:5173`.

## What to click through for your demo/screenshots
1. **Landing page** — hero, animated stats, AI scanner preview, categories, map preview, FAQ.
2. Switch the role dropdown (top-right) to **Citizen**, then click **Report a Problem** —
   walk through Describe → Location → AI Analysis → Confirm & Submit.
3. Go to **Dashboard** to see the new complaint tracked, with XP earned.
4. Click a complaint to see its **timeline** and (if resolved) before/after verification.
5. Switch role to **Panchayat Admin** to see the **Command Center**: stat cards,
   category/severity/monthly charts, smart alerts, AI recommendations, and the
   **AI Analytics Assistant** chat (try asking "What is the biggest problem in Ward 3?").
6. Open **Complaints** (admin) to see the searchable/filterable management table.
7. Open **Rewards** to see the leaderboard and badges.

## Connecting to the real backend (optional)
This prototype currently keeps all data in React state (`useState` in
`src/App.jsx`). To connect it to the `grameye-backend` API:

1. Start the backend (`npm run dev` in the backend project, default `http://localhost:5000`).
2. In `src/App.jsx`, replace the `seedComplaints()` initial state and the
   `addComplaint` / `updateComplaint` functions with `fetch` calls to
   `http://localhost:5000/api/complaints`, using the JWT returned from
   `/api/auth/login`.
3. Replace `mockAnalyze()` in the Report flow with a call to
   `POST /api/ai/analyze`.

The backend's response fields were designed to line up with what the UI
already expects (`complaintCode`, `severity`, `status`, `progress`, `category`, `ward`).
