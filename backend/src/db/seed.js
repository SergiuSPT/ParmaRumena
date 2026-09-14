import { readFile } from 'node:fs/promises';
import { migrate } from './migrate.js';
import { transaction, closeDatabase } from './index.js';

try {
  await migrate();
  const { players, matches } = JSON.parse(await readFile(new URL('./seed-data.json', import.meta.url), 'utf8'));
  await transaction(async (client) => {
    for (const player of players) {
      await client.query(`INSERT INTO players (id, first_name, last_name, number, position, photo, biography, is_demo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) ON CONFLICT (id) DO NOTHING`,
      [player.id, player.firstName, player.lastName, player.number, player.position, player.photo, player.biography]);
    }
    for (const match of matches) {
      await client.query(`INSERT INTO matches (id, opponent, initials, match_date, kickoff_time, venue, competition, round, home, home_score, away_score, is_demo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE) ON CONFLICT (id) DO NOTHING`,
      [match.id, match.opponent, match.initials, match.date, match.time, match.venue, match.competition, match.round, match.home, match.score?.home ?? null, match.score?.away ?? null]);
    }
  });
  console.log('Sample players and matches seeded. Existing records were preserved.');
} catch {
  console.error('Seed failed. Check DATABASE_URL, database availability, and schema permissions.');
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
