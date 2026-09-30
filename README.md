# SkillX Frontend

Angular (standalone components) frontend for the SkillX AI mock interview platform, built against the Spring Boot backend endpoints in `/api/...`.

## Setup

```bash
npm install
npm start
```

The dev server runs on `http://localhost:4200` and proxies every `/api/*` request to `http://localhost:8080` (your Spring Boot backend) — see `proxy.conf.json`. Change the `target` there if your backend runs elsewhere.

## Project structure

```
src/app/
  models/interview.models.ts     # TS interfaces matching every backend request/response
  services/
    auth.service.ts              # login, localStorage-backed session, logout
    interview.service.ts         # start/question/next/answer/finish/result calls
  guards/auth.guard.ts           # redirects to /login when no candidate is stored
  components/
    navbar/                      # candidate name + logout
    login/                       # name-only login screen
    interview-setup/             # company/role/experience/technologies form
    question/                    # question + live countdown + answer textarea
    feedback/                    # score/feedback/ideal answer + Continue
    results/                     # final scores, recommendation, prep plan
```

Every component has its own `.ts`, `.html`, and `.css` file.

## How the interview flow is wired

1. **Login** (`/login`) calls `POST /api/candidate/login`, stores the name (and id) in `localStorage`, and the navbar reads it reactively via a signal.
2. **`authGuard`** blocks `/setup` and every `/interview/**` route until a name is stored.
3. **Setup** (`/setup`) calls `POST /api/interviews/start` and routes to `/interview/:id/question`.
4. **Question** (`/interview/:id/question`) fetches a question and starts a client-side countdown seeded from `remainingSeconds`. On submit it calls `POST /api/interviews/:id/answer`, stashes the response on `InterviewService.lastAnswer`, and routes to `/interview/:id/feedback`.
   - The route also accepts `?mode=next`. Without it, the screen calls `GET /question` (used for the first question of a round). With it, the screen calls `GET /next` (used to advance within the same round).
5. **Feedback** (`/interview/:id/feedback`) reads `lastAnswer` and, on **Continue**:
   - `nextRound === 'COMPLETED'` → navigates to `/interview/:id/results`.
   - `roundCompleted === true` (new round starting) → navigates to `/interview/:id/question` (fetches the new round's first question).
   - otherwise → navigates to `/interview/:id/question?mode=next` (advances within the current round).
6. **Results** (`/interview/:id/results`) calls `POST /api/interviews/:id/finish` and displays the weighted scores, recommendation, strengths, weaknesses, and prep plan. **Start new interview** clears the stashed answer and returns to `/setup`.

## Notes

- Rounds progress CODING (2) → APTITUDE (10) → TECHNICAL (10) → HR (5), entirely driven by the `roundCompleted` / `nextRound` fields the backend returns — the frontend doesn't hardcode round order or lengths.
- Logout is client-side only: it clears `localStorage` and does not call the backend.
"# -SkillX-frontend-" 
