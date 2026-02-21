import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = createClient({
    url: process.env.TURSO_DATABASE_URL.trim(),
    authToken: process.env.TURSO_AUTH_TOKEN.trim(),
});

const result = await db.execute(`
    SELECT tmdb_id, trailer_key, backdrop_path, poster_path
    FROM hero_selections
    WHERE tmdb_id IS NOT NULL
`);

const data = result.rows.map(row => ({
    tmdb_id: Number(row.tmdb_id),
    trailer_key: row.trailer_key || null,
    backdrop_path: row.backdrop_path || null,
    poster_path: row.poster_path || null,
}));

const outPath = join(__dirname, '..', 'public', 'data', 'hero-enrichment.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`hero-enrichment.json updated with ${data.length} entries`);
process.exit(0);