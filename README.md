# CashFlo

**Know your money. Own your future.**

CashFlo is a personal finance web app: enter your income and monthly expenses and get an instant, honest breakdown of where your money goes — savings rate, expense categories, rule-based Smart Insights, an AI Advisor grounded in your real numbers, and goal tracking that shows exactly how long you'll take to get there.

<video src="docs/media/cashflo-demo.mp4" poster="docs/media/cashflo-demo-poster.jpg" controls width="100%"></video>

*(If the video above doesn't render, [watch it directly](docs/media/cashflo-demo.mp4).)*

## Features

- **Instant calculation walkthrough** — income, expenses, savings rate, and expense breakdown computed server-side and shown as a live, readable walkthrough (not a black box).
- **Smart Insights** — a rule-based engine that compares this month's spending against last month's and flags what changed, no AI required.
- **AI Advisor** — a chat interface backed by Claude, answering questions about your budget using only the numbers you've entered. Calculations are always server-side; the AI explains, it never computes.
- **Goal tracking** — set a savings target and timeframe, and see exactly how much you need to save per month to hit it, with a running progress view across all your goals.

## Tech stack

- **Frontend:** React 18 + Vite, no UI framework — a from-scratch design system (`frontend/src/styles/tokens.css`) built on CSS custom properties.
- **Backend:** FastAPI + Pydantic, SQLite for persistence.
- **AI:** Anthropic Claude API for the AI Advisor, with a deterministic mock fallback when no API key is configured (so the app runs fully offline).

## Getting started

Requires Node 18+ and Python 3.12 (the pinned backend dependencies do not build on Python 3.14).

**Backend**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Optionally set `ANTHROPIC_API_KEY` in your environment to enable live AI Advisor responses; without it, the advisor falls back to deterministic mock responses so the rest of the app is fully testable offline.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and expects the backend on port `8000`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/calculate` | Core income/expense/savings calculation |
| `POST` | `/api/goal-analysis` | Time-to-goal projections |
| `POST` | `/api/affordability` | Affordability check against current cash flow |
| `POST` | `/api/insights` | Rule-based month-over-month insights |
| `GET`  | `/api/history` | Saved spending history |
| `POST` | `/api/ai-advice` | AI Advisor chat, grounded in the caller's financial data |

## Project structure

```
backend/    FastAPI app — routes, calculations, insights engine, AI advisor
frontend/   React + Vite app — pages, components, design tokens
docs/       Media assets (demo video) for this README
```
