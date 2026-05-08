import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
    TURSO_DATABASE_URL = '',
    TURSO_URL = '',
    TURSO_AUTH_TOKEN = '',
} = process.env;

const rawUrl = TURSO_DATABASE_URL.trim() || TURSO_URL.trim();
const normalizedUrl = rawUrl.startsWith('https://')
    ? rawUrl.replace(/^https:\/\//, 'libsql://')
    : rawUrl;

if (!normalizedUrl) {
    throw new Error(
        'Missing TURSO_DATABASE_URL (or TURSO_URL) secret. Configure it with your Turso database URL.',
    );
}

const db = createClient({
    url: normalizedUrl,
    authToken: TURSO_AUTH_TOKEN.trim(),
});

let result;
try {
    result = await db.execute(`
        SELECT tmdb_id, media_type, trailer_key, backdrop_path, poster_path, force_enrichment
        FROM hero_selections
        WHERE tmdb_id IS NOT NULL
    `);
} catch (error) {
    if (error?.code === 'SERVER_ERROR') {
        throw new Error(
            `Could not query Turso at "${normalizedUrl}". Verify TURSO_DATABASE_URL/TURSO_URL points to the primary database endpoint and that TURSO_AUTH_TOKEN is valid. Original error: ${error.message}`,
        );
    }

    throw error;
}

const data = result.rows.map(row => ({
    tmdb_id: Number(row.tmdb_id),
    media_type: row.media_type || 'movie',
    trailer_key: row.trailer_key || null,
    backdrop_path: row.backdrop_path || null,
    poster_path: row.poster_path || null,
    force_enrichment: row.force_enrichment === 1,
}));

const outPath = join(__dirname, '..', 'public', 'data', 'hero-enrichment.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`hero-enrichment.json updated with ${data.length} entries`);
process.exit(0);
