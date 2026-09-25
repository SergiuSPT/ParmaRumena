import { createServer } from 'node:http';
import { handleRequest } from './app.js';
import { closeDatabase } from './db/index.js';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = createServer(handleRequest);
server.on('error', (error) => {
  console.error(`API server error: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`Parma Rumena API: http://${host}:${port}`);
});

function shutdown() {
  server.close(async (error) => {
    try {
      await closeDatabase();
      if (error) console.error(error.message);
      process.exit(error ? 1 : 0);
    } catch {
      console.error('Failed to close PostgreSQL connections.');
      process.exit(1);
    }
  });
  setTimeout(() => {
    server.closeAllConnections();
    process.exit(1);
  }, 5000).unref();
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
