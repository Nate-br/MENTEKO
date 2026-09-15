# MENTEKO

**Don't just warn people. Train them to recognize the moment.**

MENTEKO is a human-centered cybersecurity awareness and digital fraud resilience platform. It is not a blog and not a static list of warnings — it puts people through realistic, controlled simulations of phishing, impersonation, payment fraud, fake transaction evidence, and social engineering, and asks them to make a real decision, the way they would in real life.

---

## About

Team **HUNTERS** built MENTEKO during the 5th INSA Cyber Talent Summer Camp. The project demonstrates human cyber resilience — the practice of recognizing and safely responding to social-engineering-driven fraud — rather than offensive hacking.

## Problem

Most digital fraud doesn't succeed because of a technical exploit. It succeeds because of a moment: an urgent message, a convincing impersonation, a request dressed up as routine. Traditional awareness content (articles, posters, generic quizzes) tells people what phishing *is* but rarely trains the actual moment of decision under pressure.

## Solution

MENTEKO follows a simple behavioral model — **STOP → CHECK → VERIFY → REPORT** — and reinforces it through a repeatable learning loop:

```
EDUCATE → SIMULATE → DECIDE → EXPLAIN → ASSESS → IMPROVE
```

Users learn the signals (Learn), face a realistic simulated message/call/chat (Simulate), make a real decision without being shown the answer first (Decide), see exactly which indicators mattered (Explain/Feedback), and get an awareness-style resilience score broken down by category (Assess), so they know exactly what to practice next (Improve).

## Features

- **Home** — landing page explaining the platform and its process.
- **Learn** — short, practical lessons on phishing, impersonation, payment fraud, fake transaction evidence, and social engineering, each with definition, warning signs, a realistic example, and safer behavior.
- **Simulate** — a library of realistic scenarios (message, call transcript, chat) presented as the situation would actually appear, not as a quiz.
- **Decision → Feedback** — after choosing a response, users see risk level, a breakdown of the specific indicators in the scenario, and the better response pattern.
- **Result** — an end-of-session resilience score (not just "X/10") with recognized strengths and categories to improve.
- **Assessment** — a structured, full-length assessment across every category with a category-by-category score breakdown and a recommended next training focus.
- **About** — project mission, safety notes, and Team HUNTERS.

## Architecture

A monorepo with two fully separate applications and no shared/mixed code:

```
MENTEKO/
├── frontend/   React + Vite + TypeScript + Tailwind CSS
├── backend/    Node.js + Express + TypeScript + MongoDB/Mongoose
├── README.md
└── .gitignore
```

The frontend works standalone using local seed data even before the backend/database is connected. Once the API is reachable, `useScenarios` (frontend/src/hooks/useScenarios.ts) transparently switches to backend-sourced scenario data — no component changes required.

## Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS v4, React Router, Axios, lucide-react
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, dotenv, cors, helmet, express-rate-limit, morgan

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          Button, Panel, Badge, Terminal
│   │   ├── layout/       Navbar, Footer, Layout
│   │   ├── scenario/     ScenarioCard, ScenarioContentView, DecisionPanel, FeedbackPanel
│   │   └── dashboard/    ScoreRing, CategoryBar
│   ├── pages/            Home, Learn, Simulate, Scenario, Result, Assessment, About
│   ├── data/              seed scenarios + learn topics (frontend fallback data)
│   ├── hooks/             useScenarios (API + fallback), useSession (in-session scoring)
│   ├── lib/api.ts         centralized Axios client
│   └── types/             shared TypeScript interfaces

backend/
├── src/
│   ├── config/database.ts        Mongoose connection
│   ├── controllers/               scenario, attempt, assessment, user
│   ├── middleware/                error handling, auth placeholder
│   ├── models/                    User, Scenario, Attempt, Assessment
│   ├── routes/                    REST routes per resource
│   ├── utils/                     asyncHandler, scenario seed data, seed script
│   ├── app.ts                     Express app (middleware + routes)
│   └── server.ts                  entrypoint (connects DB, starts server)
```

## Local Development

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod` or a MongoDB Atlas connection string) — optional for frontend-only work, required for the backend to serve real data

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend runs elsewhere
npm run dev             # http://localhost:5173
```

The frontend runs and the full Home → Learn → Simulate → Decision → Feedback → Result flow works immediately using local seed data, with no backend required.

### Backend

```bash
cd backend
npm install
cp .env.example .env    # set MONGODB_URI
npm run seed             # populates the 5 MVP scenarios into MongoDB
npm run dev               # http://localhost:5000
```

If `MONGODB_URI` is not set, the server still starts and `/api/health` reports `database: "disconnected"` — this is intentional so the API can be explored before a database is provisioned. Routes that require the database (scenarios, attempts, assessments) will return a `500` until it's connected.

## Environment Variables

**frontend/.env**
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

**backend/.env**
| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) | — |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins | `http://localhost:5173` |

Never commit a populated `.env` file. Only `.env.example` files are checked in.

## API

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server + database connectivity status |
| GET | `/scenarios` | List active scenarios (optional `?category=` `&difficulty=`) |
| GET | `/scenarios/:id` | Get a single scenario |
| POST | `/attempts` | Record a decision (`{ scenario, selectedOption }`); correctness is derived server-side |
| GET | `/attempts` | List recent attempts |
| POST | `/assessments` | Aggregate a set of attempt ids (`{ attempts: string[] }`) into a scored, category-broken-down assessment |
| GET | `/assessments/:id` | Get a single assessment |
| POST | `/users` | Create/find a lightweight user record (no authentication yet) |
| GET | `/users/:id` | Get a user |

All responses follow `{ success: boolean, data?, message? }`. Errors never leak internal stack traces to the client.

## Scenario System

Scenario content lives in MongoDB (`Scenario` model) once the backend is connected, and mirrors 1:1 with the frontend's local seed data (`frontend/src/data/scenarios.ts` / `backend/src/utils/scenarioSeedData.ts`) so the experience is identical whether served locally or from the database. Each scenario has:

- **format & context** — how the simulated content is framed (message, call transcript, chat)
- **content** — the actual simulated sender, subject, body, and call-to-action
- **options** — the possible responses, with the correct one flagged server-side only (never exposed as "correct" before a decision is made)
- **indicators** — the specific signals that made the scenario suspicious or safe
- **explanation / betterResponse** — shown only after the user decides

## Security & Safety

- MENTEKO does **not** connect to, scan, test, or interact with any live financial institution's systems or real customer accounts.
- All scenario content — sender addresses, phone numbers, names, and transaction references — is fictional (`.test` domains, invented reference numbers).
- Correctness of a decision is always computed server-side from the stored scenario; the client never sends or trusts a "correct" flag.
- `helmet`, scoped `cors`, JSON body-size limits, and rate limiting are applied to write endpoints.
- No secrets are committed to source control; configuration is via `.env` files excluded by `.gitignore`.
- Centralized error handling returns safe, generic messages for server errors while logging details server-side only.

## Future Roadmap

- Authentication (the `auth.middleware.ts` placeholder and `User` model already provide a landing point)
- Admin dashboard for managing scenarios and reviewing aggregate resilience trends
- Expanded scenario library per category, including localized (Amharic) content
- Persistent per-user history and spaced-repetition style "improve" recommendations
- Organization/team rollups for workplace awareness training

## Team HUNTERS

- **Fitsum Zerihun** — Focal Person
- **Natnael Sisay**
- **Samson Tesfaye**

Formed during the 5th INSA Cyber Talent Summer Camp.
