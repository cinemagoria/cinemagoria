import 'dotenv/config';
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

const sanitizeUrl = value => value.trim().replace(/^['"]|['"]$/g, '');
const toLibsqlUrl = value => {
    if (value.startsWith('http://')) {
        return value.replace(/^http:\/\//, 'libsql://');
    }
    if (value.startsWith('https://')) {
        return value.replace(/^https:\/\//, 'libsql://');
    }
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value)) {
        return value;
    }
    return `libsql://${value}`;
};

const rawUrl = sanitizeUrl(TURSO_DATABASE_URL) || sanitizeUrl(TURSO_URL);
const normalizedUrl = toLibsqlUrl(rawUrl);

if (!normalizedUrl) {
    throw new Error(
        'Missing TURSO_DATABASE_URL (or TURSO_URL) secret. Configure it with your Turso database URL.',
    );
}

let db;
try {
    db = createClient({
        url: normalizedUrl,
        authToken: TURSO_AUTH_TOKEN.trim(),
    });
} catch (error) {
    if (error?.code === 'URL_INVALID') {
        throw new Error(
            `Invalid Turso URL format: "${normalizedUrl}". Set TURSO_DATABASE_URL (or TURSO_URL) to something like "libsql://<db-name>-<org>.turso.io".`,
        );
    }
    throw error;
}

let result;
try {
    result = await db.execute(`
        SELECT tmdb_id, media_type, trailer_key, backdrop_path, poster_path, force_enrichment
        FROM noir_historical
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

const outPath = join(__dirname, '..', 'public', 'data', 'noir-enrichment.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`noir-enrichment.json updated with ${data.length} entries`);
process.exit(0);
