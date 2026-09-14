# Parma Rumena

The project contains two independent applications:

- `frontend/`: React, TypeScript, Vite, all photos, and gallery optimization scripts.
- `backend/`: Node.js API, with PostgreSQL queries and a shared connection pool in `src/db/`.

Git metadata and shared ignore rules stay at the repository root.

## Setup

Use Node.js 24 or newer. Install dependencies from the project root:

```sh
npm --prefix frontend ci
npm --prefix backend ci
```

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` to your
PostgreSQL connection string. Also configure `HOST` and `PORT` if needed.
Credentials belong only in that file, never in frontend code. The `pg` driver
is installed; provide a live database, then create the application tables:

```sh
npm run db:migrate
# Optional: insert the sample roster and fixtures (existing rows are preserved).
npm run db:seed
```

Migrations create `players` and `matches` and record applied versions. Sample
data is labeled on the page; change `is_demo` to `false` for confirmed records.
The site fetches `/api/players` and `/api/matches`; it shows a retry message
when the API/database is unavailable instead of silently substituting mock data.
The API can start without database credentials; only database routes need them.

## Development

Run these commands in separate terminals from the project root:

```sh
npm run dev:frontend
npm run dev:backend
```

`npm run dev` also starts the frontend, as before. Vite serves the home page
and `/galerie/` and proxies `/api` requests to `http://127.0.0.1:3001`.
If the backend port changes, set `BACKEND_URL` in the frontend process environment.
`GET /api/health` returns API availability; it does not check a database.
`GET /api/health/db` executes `SELECT 1` and returns 200 when PostgreSQL is
reachable, or 503 if the connection is missing or unavailable.
`GET /api/players` returns player names, shirt numbers, positions, photos, and biographies.
`GET /api/matches` returns the chronological schedule, venues, opponents, and final scores.
Match dates and times use local Romanian schedule values; scores are in home/away order.

For production, run `npm --prefix backend start`. Set `HOST=0.0.0.0` when the
backend must accept connections outside localhost. Configure the hosting reverse
proxy to forward `/api` to the backend; Vite's proxy is for development only.

## Checks and build

```sh
npm run build
npm run lint
npm test
```

The frontend build is written to `frontend/dist/`, including `galerie/index.html`.
`npm run preview` serves that build locally.

After adding gallery photos, run `npm run gallery:optimize` from the root.
This preserves originals and generates WebP derivatives under
`frontend/public/gallery-optimized/`. It requires Python with Pillow;
see `frontend/scripts/README.md`.
