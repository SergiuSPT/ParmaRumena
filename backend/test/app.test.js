import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { after, before, test } from 'node:test';
import { createRequestHandler, handleRequest } from '../src/app.js';

let server;
let baseUrl;
before(async () => {
  server = createServer(handleRequest);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
}));

test('health endpoint returns the API status as JSON', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'parma-rumena-api' });
});

test('unknown API routes return a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/missing`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not found' });
});

test('health endpoint rejects unsupported methods', async () => {
  const response = await fetch(`${baseUrl}/api/health`, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
});

async function checkDatabase(t, databaseQuery, path = '/api/health/db', method = 'GET') {
  const databaseServer = createServer(createRequestHandler({ databaseQuery }));
  databaseServer.listen(0, '127.0.0.1');
  await once(databaseServer, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    databaseServer.close((error) => error ? reject(error) : resolve());
  }));
  return fetch(`http://127.0.0.1:${databaseServer.address().port}${path}`, { method });
}

test('database health runs a connectivity query', async (t) => {
  let called = false;
  const response = await checkDatabase(t, async (sql) => {
    assert.equal(sql, 'SELECT 1');
    called = true;
    return { rows: [{ '?column?': 1 }] };
  });
  assert.equal(called, true);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', database: 'postgresql' });
});

test('database failures return 503 without exposing connection details', async (t) => {
  const response = await checkDatabase(t, async () => {
    throw new Error('Private database connection details');
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: 'unavailable', database: 'postgresql' });
});

test('players endpoint returns display fields and sample-data status', async (t) => {
  const player = { id: 'player-1', firstName: 'Ana', lastName: 'Pop', number: 10, position: 'Atacant', photo: '', biography: 'Player biography', isDemo: true };
  const response = await checkDatabase(t, async () => ({ rows: [player] }), '/api/players');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: [player], demo: true });
});

test('matches endpoint preserves dates, kickoff times, zero scores, and upcoming matches', async (t) => {
  const matches = [
    { id: 'past', date: '2026-09-01', time: '19:00', home: false, score: { home: 0, away: 2 }, isDemo: false },
    { id: 'upcoming', date: '2026-10-01', time: '20:30', home: true, score: null, isDemo: false },
  ];
  const response = await checkDatabase(t, async () => ({ rows: matches }), '/api/matches');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: matches, demo: false });
});

for (const path of ['/api/players', '/api/matches']) {
  test(`${path} supports an empty database`, async (t) => {
    const response = await checkDatabase(t, async () => ({ rows: [] }), path);
    assert.deepEqual(await response.json(), { data: [], demo: false });
  });
  test(`${path} returns a safe error when the database is unavailable`, async (t) => {
    const response = await checkDatabase(t, async () => { throw new Error('Database credentials'); }, path);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'Data is temporarily unavailable' });
  });
  test(`${path} rejects writes without calling the database`, async (t) => {
    let queried = false;
    const response = await checkDatabase(t, async () => { queried = true; return { rows: [] }; }, path, 'POST');
    assert.equal(response.status, 405);
    assert.equal(queried, false);
  });
}
