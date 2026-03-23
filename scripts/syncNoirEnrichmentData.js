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
    SELECT tmdb_id, media_type, trailer_key, backdrop_path, poster_path, force_enrichment
    FROM noir_historical
    WHERE tmdb_id IS NOT NULL
`);

const data = result.rows.map(row => ({
    tmdb_id: Number(row.tmdb_id),
    media_type: row.media_type || 'movie',
    trailer_key: row.trailer_key || null,
    backdrop_path: row.backdrop_path || null,
    poster_path: row.poster_path || null,
    force_enrichment: row.force_enrichment === 1,
}));

const outPath = join(__dirname, '..', 'public', 'data', 'noir-enrichment.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`noir-enrichment.json updated with ${data.length} entries`);
process.exit(0);
