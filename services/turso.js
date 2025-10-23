const { createClient } = require('@libsql/client');

let tursoClient = null;

console.log('🚀 [Turso] Initializing client...');
console.log('📍 [Turso] URL:', process.env.IMDB_DB_URL ? '✅ Set' : '❌ Missing');
console.log('🔑 [Turso] Token:', process.env.IMDB_DB_TOKEN ? '✅ Set' : '❌ Missing');

if (process.env.IMDB_DB_URL && process.env.IMDB_DB_TOKEN) {
  tursoClient = createClient({
    url: process.env.IMDB_DB_URL,
    authToken: process.env.IMDB_DB_TOKEN,
  });
  console.log('✅ [Turso] Client created successfully');
} else {
  console.error('❌ [Turso] Missing environment variables');
}

module.exports = tursoClient;