import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { query, transaction, closeDatabase } from './index.js';

export async function migrate() {
  await query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const folder = new URL('./migrations/', import.meta.url);
  const files = (await readdir(folder)).filter(name => name.endsWith('.sql')).sort();
  for (const name of files) {
    const sql = await readFile(new URL(name, folder), 'utf8');
    await transaction(async (client) => {
      await client.query('LOCK TABLE schema_migrations IN EXCLUSIVE MODE');
      const existing = await client.query('SELECT name FROM schema_migrations WHERE name = $1', [name]);
      if (existing.rowCount) return;
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      console.log(`Applied ${name}`);
    });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await migrate(); }
  catch { console.error('Migration failed. Check DATABASE_URL, database availability, and schema permissions.'); process.exitCode = 1; }
  finally { await closeDatabase(); }
}
