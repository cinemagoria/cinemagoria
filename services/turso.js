const { createClient } = require('@libsql/client');

let tursoClient = null;

if (process.env.IMDB_DB_URL && process.env.IMDB_DB_TOKEN) {
  tursoClient = createClient({
    url: process.env.IMDB_DB_URL,
    authToken: process.env.IMDB_DB_TOKEN,
  });
} else {
  console.error('❌ [Turso] Missing environment variables');
}

module.exports = tursoClient;