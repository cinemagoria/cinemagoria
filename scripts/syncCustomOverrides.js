import 'dotenv/config';
import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { TURSO_DATABASE_URL = '', TURSO_AUTH_TOKEN = '' } = process.env;

const db = createClient({
    url: TURSO_DATABASE_URL.trim(),
    authToken: TURSO_AUTH_TOKEN.trim(),
});

const result = await db.execute(`
    SELECT tmdb_id, media_type, poster_path, backdrop_path, trailer_key
    FROM title_overrides
    WHERE tmdb_id IS NOT NULL
`);

const data = result.rows.map(row => ({
    tmdb_id: Number(row.tmdb_id),
    media_type: row.media_type || 'movie',
    poster_path: row.poster_path || null,
    backdrop_path: row.backdrop_path || null,
    trailer_key: row.trailer_key || null,
}));

const outPath = join(__dirname, '..', 'public', 'data', 'custom-enrichment.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`custom-enrichment.json updated with ${data.length} entries`);
process.exit(0);
