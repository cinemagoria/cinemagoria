import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const BASE_URL = 'https://api.themoviedb.org/3';

const { TURSO_DATABASE_URL = '', TURSO_AUTH_TOKEN = '' } = process.env;

const db = createClient({
    url: TURSO_DATABASE_URL.trim(),
    authToken: TURSO_AUTH_TOKEN.trim(),
});

async function fetchTMDB(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
    return response.json();
}

async function fetchSpanishTitle(tmdbId, mediaType) {
    try {
        const data = await fetchTMDB(`/${mediaType}/${tmdbId}/translations`);
        const esMx = data.translations?.find(t => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX');
        const esEs = data.translations?.find(t => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES');
        const esAny = data.translations?.find(t => t.iso_639_1 === 'es');
        const translation = esMx || esEs || esAny;
        return translation?.data?.title || translation?.data?.name || null;
    } catch {
        return null;
    }
}

async function main() {
    // Read current hero selections from DB
    const heroResult = await db.execute(`
        SELECT tmdb_id, media_type, title, poster_path, backdrop_path, overview,
               release_date, genres, imdb_id, imdb_rating, imdb_votes,
               vote_average, vote_count, popularity, trailer_key, logo_path,
               runtime, certification, force_enrichment, spanish_title
        FROM hero_selections
        WHERE tmdb_id IS NOT NULL
    `);

    // Get existing noir_historical ids
    const noirResult = await db.execute('SELECT tmdb_id, media_type FROM noir_historical');
    const existingKeys = new Set(noirResult.rows.map(r => `${r.tmdb_id}-${r.media_type}`));

    const newEntries = heroResult.rows.filter(row => !existingKeys.has(`${row.tmdb_id}-${row.media_type}`));

    if (newEntries.length === 0) {
        console.log('No new entries to sync to noir_historical');
        process.exit(0);
    }

    console.log(`Found ${newEntries.length} new entries to add to noir_historical`);

    let inserted = 0;
    for (const row of newEntries) {
        let spanishTitle = row.spanish_title || null;

        // Fetch Spanish title if not available and TMDB_API_KEY is set
        if (!spanishTitle && TMDB_API_KEY) {
            spanishTitle = await fetchSpanishTitle(Number(row.tmdb_id), row.media_type);
            await new Promise(r => setTimeout(r, 250));
        }

        try {
            await db.execute({
                sql: `INSERT OR IGNORE INTO noir_historical (
                    tmdb_id, media_type, title, spanish_title, poster_path, backdrop_path, overview,
                    release_date, genres, imdb_id, imdb_rating, imdb_votes,
                    vote_average, vote_count, popularity, trailer_key, logo_path,
                    runtime, certification, force_enrichment, added_to_noir_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    Number(row.tmdb_id),
                    row.media_type,
                    row.title,
                    spanishTitle,
                    row.poster_path,
                    row.backdrop_path,
                    row.overview,
                    row.release_date,
                    row.genres,
                    row.imdb_id || null,
                    row.imdb_rating || null,
                    row.imdb_votes || null,
                    row.vote_average || 0,
                    row.vote_count || 0,
                    row.popularity || 0,
                    row.trailer_key || null,
                    row.logo_path || null,
                    row.runtime || null,
                    row.certification || '',
                    row.force_enrichment || 0,
                    Math.floor(Date.now() / 1000)
                ]
            });
            console.log(`  + ${row.title} (${row.media_type}, ${row.tmdb_id})`);
            inserted++;
        } catch (e) {
            console.error(`  FAIL ${row.title}: ${e.message}`);
        }
    }

    console.log(`\nSynced ${inserted} new entries to noir_historical`);
    process.exit(0);
}

main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
