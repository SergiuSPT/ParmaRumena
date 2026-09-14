Database access
===============

`index.js` manages a shared PostgreSQL connection pool using `pg`. Set
`DATABASE_URL` in `backend/.env` to your connection string. For hosted databases,
use your provider's TLS connection settings; certificate verification is not disabled.
The pool connects lazily, so starting the API does not require a running database.
Run `npm run db:migrate` from the project root to create the tables in your
configured database. Run `npm run db:seed` for the optional sample roster and
fixtures. Both commands are safe to repeat; seeding does not overwrite existing IDs.

API handlers in `src/app.js` will call these modules. Keep credentials on the
backend and use parameterized queries when implementing database operations.
The frontend should call `/api/...`, rather than connecting to the database.

The `players` table stores names, shirt number, position, image path, and biography.
The `matches` table stores opponent, date, local kickoff time, venue, competition,
round, home/away status, and nullable final scores. Both scores must be supplied
together and cannot be negative. Set `is_demo = false` for confirmed records.

`collections.js` provides the read queries used by the public API. Add new
versioned SQL files to `migrations/` for future schema changes.

Example:

```js
import { query } from './db/index.js';
const { rows } = await query('SELECT * FROM matches WHERE id = $1', [matchId]);
```

`GET /api/health/db` checks connectivity using `SELECT 1`. Database errors are
not returned to API clients. Pool connections close during server shutdown.
