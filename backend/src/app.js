import { query } from './db/index.js';
import { listPlayers, listMatches } from './db/collections.js';

function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',

    'Access-Control-Allow-Origin': '*',

    ...headers,
  });

  response.end(JSON.stringify(body));
}

// Keep request handling independent of the listening port for testing.
// Future API routes should call database functions from src/db/.
export function createRequestHandler({ databaseQuery = query } = {}) {
  return async function handleRequest(request, response) {
    let pathname;
    try {
      pathname = new URL(request.url, 'http://localhost').pathname;
    } catch {
      sendJson(response, 400, { error: 'Invalid request URL' });
      return;
    }

    if (pathname === '/api/health' || pathname === '/api/health/db') {
      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Method not allowed' }, { Allow: 'GET' });
        return;
      }
      if (pathname === '/api/health/db') {
        try {
          await databaseQuery('SELECT 1');
          sendJson(response, 200, { status: 'ok', database: 'postgresql' });
        } catch {
          sendJson(response, 503, { status: 'unavailable', database: 'postgresql' });
        }
        return;
      }
      // This reports API availability, not database connectivity.
      sendJson(response, 200, { status: 'ok', service: 'parma-rumena-api' });
      return;
    }

    const list = pathname === '/api/players' ? listPlayers : pathname === '/api/matches' ? listMatches : null;
    if (list) {
      if (request.method !== 'GET') {
        sendJson(response, 405, { error: 'Method not allowed' }, { Allow: 'GET' });
        return;
      }
      try {
        const data = await list(databaseQuery);
        sendJson(response, 200, { data, demo: data.some(row => row.isDemo) });
      } catch {
        sendJson(response, 503, { error: 'Data is temporarily unavailable' });
      }
      return;
    }
    sendJson(response, 404, { error: 'Not found' });
  };
}

export const handleRequest = createRequestHandler();
