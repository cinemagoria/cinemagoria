const { createClient } = require('@libsql/client');

let tursoClient = null;
let chatDbClient = null;

if (process.env.IMDB_DB_URL && process.env.IMDB_DB_TOKEN) {
  tursoClient = createClient({
    url: process.env.IMDB_DB_URL,
    authToken: process.env.IMDB_DB_TOKEN,
  });
} else {
  console.error('❌ [Turso] Missing IMDB environment variables');
}

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  chatDbClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
} else {
  console.error('❌ [Turso] Missing CHAT_DB environment variables');
}

module.exports = { tursoClient, chatDbClient };