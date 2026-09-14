import pg from 'pg';

let pool;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Set DATABASE_URL in backend/.env before making database calls');
  }
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      query_timeout: 10000,
    });
    pool.on('error', () => {
      console.error('An idle PostgreSQL connection failed.');
    });
  }
  return pool;
}

// Pass values separately: query('SELECT * FROM matches WHERE id = $1', [id]).
export function query(text, values = []) {
  return getPool().query(text, values);
}

export async function transaction(callback) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase() {
  if (pool) {
    const activePool = pool;
    pool = undefined;
    await activePool.end();
  }
}
