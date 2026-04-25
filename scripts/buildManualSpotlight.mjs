// buildManualSpotlight.mjs
//
// Phase-1 builder for the Spotlight carousels (Movies + TV).
//
// Source of truth:
//   data/spotlight-manual-pinned.json      → the curated ID lists
//
// Per run this script:
//   1. Fetches TMDB metadata (en+es) for every pinned ID
//      + /movie/{id}/release_dates for movies (theatrical anchor)
//      + last_air_date / status / next_episode for TV (currently-airing flag)
//   2. Joins IMDb rating from the IMDb-replica Turso DB (imdb_ratings table)
//   3. Sort:
//        movies → "theatrical anchor" desc
//          (2nd-country type-3 date → 1st type-3 → type-2 → release_date)
//        tv     → last_air_date desc (fallback first_air_date)
//   4. Upserts into Turso main DB tables `spotlight_movies` / `spotlight_tv`.
//      Tables are the canonical store going forward.
//   5. Emits public/data/spotlight-{movies,tv}.json in the legacy shape so
//      pages/index.vue keeps working unchanged until Phase-2 swaps the
//      homepage to read from Turso directly.
//
// Run: node --env-file=.env scripts/buildManualSpotlight.mjs

import { createClient } from '@libsql/client';
import { writeFileSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TMDB_API_KEY = (process.env.API_KEY || '').trim();
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TURSO_URL = (process.env.TURSO_DATABASE_URL || '').trim();
const TURSO_TOKEN = (process.env.TURSO_AUTH_TOKEN || '').trim();
const IMDB_URL = (process.env.IMDB_DB_URL || '').trim();
const IMDB_TOKEN = (process.env.IMDB_DB_TOKEN || '').trim();

const NOW = new Date();
const ENGINE_VERSION = 'manual-1.0.0';

const log = (tag, msg, ...rest) => console.log(`[${tag}] ${msg}`, ...rest);

async function tmdb(path, params = {}) {
    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set('api_key', TMDB_API_KEY);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`TMDB ${path} ${res.status}: ${body.slice(0, 200)}`);
    }
    return res.json();
}

async function fetchMovie(id) {
    const [en, es, rel] = await Promise.all([
        tmdb(`/movie/${id}`, { language: 'en-US', append_to_response: 'external_ids' }),
        tmdb(`/movie/${id}`, { language: 'es-ES' }).catch(() => null),
        tmdb(`/movie/${id}/release_dates`).catch(() => ({ results: [] })),
    ]);

    const releases = [];
    for (const country of rel.results || []) {
        for (const r of country.release_dates || []) {
            if (!r.release_date || !Number.isFinite(r.type)) continue;
            releases.push({
                type: r.type,
                date: r.release_date.slice(0, 10),
                country: country.iso_3166_1,
            });
        }
    }

    return {
        id: en.id,
        title: en.title || en.original_title,
        title_es: (es?.title?.trim()) || en.title || en.original_title,
        overview: en.overview || '',
        overview_es: (es?.overview?.trim()) ? es.overview : (en.overview || ''),
        poster_path: en.poster_path,
        backdrop_path: en.backdrop_path,
        vote_average: Number((en.vote_average ?? 0).toFixed(1)),
        genre_ids: (en.genres || []).map((g) => g.id),
        genres: en.genres || [],
        original_language: en.original_language,
        imdb_id: en.external_ids?.imdb_id || en.imdb_id || null,
        release_date: en.release_date || null,
        releases,
    };
}

async function fetchTv(id) {
    const [en, es] = await Promise.all([
        tmdb(`/tv/${id}`, { language: 'en-US', append_to_response: 'external_ids' }),
        tmdb(`/tv/${id}`, { language: 'es-ES' }).catch(() => null),
    ]);

    const status = en.status || null;
    const lastAiredDays = en.last_air_date
        ? (NOW - new Date(en.last_air_date)) / (1000 * 60 * 60 * 24)
        : Infinity;
    const isCurrentlyAiring = !!(
        (status === 'Returning Series' || status === 'In Production') &&
        (en.next_episode_to_air || lastAiredDays <= 45)
    );

    return {
        id: en.id,
        title: en.name || en.original_name,
        title_es: (es?.name?.trim()) || en.name || en.original_name,
        overview: en.overview || '',
        overview_es: (es?.overview?.trim()) ? es.overview : (en.overview || ''),
        poster_path: en.poster_path,
        backdrop_path: en.backdrop_path,
        vote_average: Number((en.vote_average ?? 0).toFixed(1)),
        genre_ids: (en.genres || []).map((g) => g.id),
        genres: en.genres || [],
        original_language: en.original_language,
        imdb_id: en.external_ids?.imdb_id || null,
        first_air_date: en.first_air_date || null,
        last_air_date: en.last_air_date || null,
        next_air_date: en.next_episode_to_air?.air_date || null,
        status,
        is_currently_airing: isCurrentlyAiring,
    };
}

// "Theatrical anchor" for movie sort. Mirrors the same priority used by
// applyManualPins in curateSpotlight.mjs:
//   prefer 2nd-country type-3 date (the moment a film became "wide" ≥2 ctry)
//   then earliest type-3, then earliest type-2, then nominal release_date.
function pickMovieTheatricalAnchor(movie) {
    const releases = movie.releases || [];
    const theatrical = releases.filter((r) => r.type === 3).map((r) => r.date).sort();
    if (theatrical.length >= 2) return theatrical[1];
    if (theatrical.length === 1) return theatrical[0];
    const limited = releases.filter((r) => r.type === 2).map((r) => r.date).sort();
    if (limited.length) return limited[0];
    return movie.release_date || null;
}

function compareDateDesc(a, b) {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return new Date(b) - new Date(a);
}

// Spotlight ordering: items closest to "now" rank highest. Distance is the
// absolute number of days between the anchor date and today, so a film
// releasing in 5 days and one released 5 days ago tie for top relevance —
// both are "current". Far past or far future drop down. Items with no
// anchor land at the bottom.
function relevanceDistance(anchorDate) {
    if (!anchorDate) return Infinity;
    const t = new Date(anchorDate).getTime();
    if (Number.isNaN(t)) return Infinity;
    return Math.abs(t - NOW.getTime()) / (1000 * 60 * 60 * 24);
}

// TV anchor: prefer the next-episode air date when TMDB has it scheduled
// (catches upcoming-season-premiering-soon shows like The Terror S03 that
// would otherwise fall to the bottom on stale last_air_date). Falls back
// to the latest aired episode, then the show's first_air_date.
function pickTvAnchor(tv) {
    return tv.next_air_date || tv.last_air_date || tv.first_air_date || null;
}

async function fetchImdbRatings(imdbDb, tconsts) {
    const valid = tconsts.filter(Boolean);
    if (!valid.length) return new Map();
    const placeholders = valid.map(() => '?').join(',');
    const r = await imdbDb.execute({
        sql: `SELECT tconst, average_rating, num_votes FROM imdb_ratings WHERE tconst IN (${placeholders})`,
        args: valid,
    });
    const map = new Map();
    for (const row of r.rows) {
        map.set(row.tconst, {
            rating: Number(row.average_rating),
            votes: Number(row.num_votes),
        });
    }
    return map;
}

async function safeAddColumn(db, table, column, type) {
    try {
        await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    } catch (e) {
        if (!/duplicate column/i.test(e?.message || '')) throw e;
    }
}

async function ensureSchema(db) {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS spotlight_movies (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            title_es TEXT,
            overview TEXT,
            overview_es TEXT,
            poster_path TEXT,
            backdrop_path TEXT,
            vote_average REAL,
            genre_ids TEXT,
            genres TEXT,
            original_language TEXT,
            imdb_id TEXT,
            release_date TEXT,
            theatrical_anchor TEXT,
            releases TEXT,
            imdb_rating REAL,
            imdb_votes INTEGER,
            rating_source TEXT,
            verdict TEXT,
            reasoning TEXT,
            pinned INTEGER DEFAULT 1,
            sort_index INTEGER NOT NULL,
            updated_at TEXT NOT NULL
        )
    `);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS spotlight_tv (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            title_es TEXT,
            overview TEXT,
            overview_es TEXT,
            poster_path TEXT,
            backdrop_path TEXT,
            vote_average REAL,
            genre_ids TEXT,
            genres TEXT,
            original_language TEXT,
            imdb_id TEXT,
            first_air_date TEXT,
            last_air_date TEXT,
            status TEXT,
            is_currently_airing INTEGER,
            imdb_rating REAL,
            imdb_votes INTEGER,
            rating_source TEXT,
            verdict TEXT,
            reasoning TEXT,
            pinned INTEGER DEFAULT 1,
            sort_index INTEGER NOT NULL,
            updated_at TEXT NOT NULL
        )
    `);

    // Idempotent migrations for columns added after first deploy.
    await safeAddColumn(db, 'spotlight_tv', 'next_air_date', 'TEXT');
}

async function replaceMovieRows(db, rows) {
    await db.execute('DELETE FROM spotlight_movies');
    const stmt = `
        INSERT INTO spotlight_movies (
            id, title, title_es, overview, overview_es,
            poster_path, backdrop_path, vote_average,
            genre_ids, genres, original_language, imdb_id,
            release_date, theatrical_anchor, releases,
            imdb_rating, imdb_votes, rating_source,
            verdict, reasoning, pinned, sort_index, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const r of rows) {
        await db.execute({
            sql: stmt,
            args: [
                r.id, r.title, r.title_es, r.overview, r.overview_es,
                r.poster_path, r.backdrop_path, r.vote_average,
                JSON.stringify(r.genre_ids), JSON.stringify(r.genres),
                r.original_language, r.imdb_id,
                r.release_date, r.theatrical_anchor, JSON.stringify(r.releases),
                r.imdb_rating, r.imdb_votes, r.rating_source,
                r.verdict, r.reasoning, 1, r.sort_index, r.updated_at,
            ],
        });
    }
}

async function replaceTvRows(db, rows) {
    await db.execute('DELETE FROM spotlight_tv');
    const stmt = `
        INSERT INTO spotlight_tv (
            id, title, title_es, overview, overview_es,
            poster_path, backdrop_path, vote_average,
            genre_ids, genres, original_language, imdb_id,
            first_air_date, last_air_date, next_air_date, status, is_currently_airing,
            imdb_rating, imdb_votes, rating_source,
            verdict, reasoning, pinned, sort_index, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const r of rows) {
        await db.execute({
            sql: stmt,
            args: [
                r.id, r.title, r.title_es, r.overview, r.overview_es,
                r.poster_path, r.backdrop_path, r.vote_average,
                JSON.stringify(r.genre_ids), JSON.stringify(r.genres),
                r.original_language, r.imdb_id,
                r.first_air_date, r.last_air_date, r.next_air_date, r.status, r.is_currently_airing ? 1 : 0,
                r.imdb_rating, r.imdb_votes, r.rating_source,
                r.verdict, r.reasoning, 1, r.sort_index, r.updated_at,
            ],
        });
    }
}

function emitMovieJson(rows) {
    return {
        generated_at: new Date().toISOString(),
        engine_version: ENGINE_VERSION,
        media_type: 'movie',
        count: rows.length,
        results: rows.map((r) => ({
            id: r.id,
            media_type: 'movie',
            title: r.title,
            title_es: r.title_es,
            overview: r.overview,
            overview_es: r.overview_es,
            poster_path: r.poster_path,
            backdrop_path: r.backdrop_path,
            vote_average: r.vote_average?.toFixed?.(1) ?? String(r.vote_average ?? ''),
            genre_ids: r.genre_ids,
            genres: r.genres,
            original_language: r.original_language,
            imdb_id: r.imdb_id,
            release_date: r.release_date,
            theatrical_anchor: r.theatrical_anchor,
            imdb_rating: r.imdb_rating,
            imdb_votes: r.imdb_votes,
            rating_source: r.rating_source,
            _curated: true,
            _score: null,
            _verdict: r.verdict,
            _reasoning: r.reasoning,
            _pinned: true,
            _noir_match: false,
            _is_currently_airing: false,
        })),
    };
}

function emitTvJson(rows) {
    return {
        generated_at: new Date().toISOString(),
        engine_version: ENGINE_VERSION,
        media_type: 'tv',
        count: rows.length,
        results: rows.map((r) => ({
            id: r.id,
            media_type: 'tv',
            title: r.title,
            title_es: r.title_es,
            overview: r.overview,
            overview_es: r.overview_es,
            poster_path: r.poster_path,
            backdrop_path: r.backdrop_path,
            vote_average: r.vote_average?.toFixed?.(1) ?? String(r.vote_average ?? ''),
            genre_ids: r.genre_ids,
            genres: r.genres,
            original_language: r.original_language,
            imdb_id: r.imdb_id,
            first_air_date: r.first_air_date,
            last_air_date: r.last_air_date,
            next_air_date: r.next_air_date,
            status: r.status,
            imdb_rating: r.imdb_rating,
            imdb_votes: r.imdb_votes,
            rating_source: r.rating_source,
            _curated: true,
            _score: null,
            _verdict: r.verdict,
            _reasoning: r.reasoning,
            _pinned: true,
            _noir_match: false,
            _is_currently_airing: !!r.is_currently_airing,
        })),
    };
}

async function main() {
    if (!TMDB_API_KEY) throw new Error('Missing API_KEY');
    if (!TURSO_URL || !TURSO_TOKEN) throw new Error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN');
    if (!IMDB_URL || !IMDB_TOKEN) throw new Error('Missing IMDB_DB_URL / IMDB_DB_TOKEN');

    const pinsPath = join(ROOT, 'data', 'spotlight-manual-pinned.json');
    const pins = JSON.parse(readFileSync(pinsPath, 'utf8'));
    const movieIds = Array.from(new Set(pins.movie || []));
    const tvIds = Array.from(new Set(pins.tv || []));
    log('pins', `loaded: movies=${movieIds.length}, tv=${tvIds.length}`);

    const mainDb = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const imdbDb = createClient({ url: IMDB_URL, authToken: IMDB_TOKEN });

    log('schema', 'ensuring spotlight_movies / spotlight_tv exist');
    await ensureSchema(mainDb);

    log('tmdb', `fetching ${movieIds.length} movies + ${tvIds.length} tv from TMDB...`);
    const [movies, tvShows] = await Promise.all([
        Promise.all(movieIds.map((id) => fetchMovie(id).catch((e) => {
            log('tmdb', `movie ${id} failed: ${e.message}`);
            return null;
        }))),
        Promise.all(tvIds.map((id) => fetchTv(id).catch((e) => {
            log('tmdb', `tv ${id} failed: ${e.message}`);
            return null;
        }))),
    ]);

    const validMovies = movies.filter(Boolean);
    const validTv = tvShows.filter(Boolean);
    log('tmdb', `fetched ok: movies=${validMovies.length}/${movieIds.length}, tv=${validTv.length}/${tvIds.length}`);

    const allTconsts = [
        ...validMovies.map((m) => m.imdb_id),
        ...validTv.map((t) => t.imdb_id),
    ];
    log('imdb', `looking up ${allTconsts.filter(Boolean).length} ratings`);
    const ratingMap = await fetchImdbRatings(imdbDb, allTconsts);
    log('imdb', `matched ${ratingMap.size} ratings`);

    const updatedAt = new Date().toISOString();

    // Movies: attach anchor + rating, sort desc by anchor
    for (const m of validMovies) {
        m.theatrical_anchor = pickMovieTheatricalAnchor(m);
        const rating = m.imdb_id ? ratingMap.get(m.imdb_id) : null;
        m.imdb_rating = rating?.rating ?? null;
        m.imdb_votes = rating?.votes ?? null;
        m.rating_source = rating ? 'imdb' : 'tmdb';
        m.verdict = 'pinned';
        m.reasoning = 'Manual pin (Phase-1 curated list)';
        m.updated_at = updatedAt;
    }
    validMovies.sort((a, b) =>
        relevanceDistance(a.theatrical_anchor) - relevanceDistance(b.theatrical_anchor)
    );
    validMovies.forEach((m, i) => { m.sort_index = i; });

    // TV: attach rating, sort desc by last_air_date (fallback first_air_date)
    for (const t of validTv) {
        const rating = t.imdb_id ? ratingMap.get(t.imdb_id) : null;
        t.imdb_rating = rating?.rating ?? null;
        t.imdb_votes = rating?.votes ?? null;
        t.rating_source = rating ? 'imdb' : 'tmdb';
        t.verdict = 'pinned';
        t.reasoning = 'Manual pin (Phase-1 curated list)';
        t.updated_at = updatedAt;
    }
    validTv.sort((a, b) =>
        relevanceDistance(pickTvAnchor(a)) - relevanceDistance(pickTvAnchor(b))
    );
    validTv.forEach((t, i) => { t.sort_index = i; });

    log('turso', `replacing ${validMovies.length} rows in spotlight_movies`);
    await replaceMovieRows(mainDb, validMovies);
    log('turso', `replacing ${validTv.length} rows in spotlight_tv`);
    await replaceTvRows(mainDb, validTv);

    const moviesOut = emitMovieJson(validMovies);
    const tvOut = emitTvJson(validTv);
    writeFileSync(join(ROOT, 'public', 'data', 'spotlight-movies.json'), JSON.stringify(moviesOut, null, 2));
    writeFileSync(join(ROOT, 'public', 'data', 'spotlight-tv.json'), JSON.stringify(tvOut, null, 2));
    log('out', 'wrote public/data/spotlight-{movies,tv}.json');

    log('summary', '--- ORDER ---');
    console.log('MOVIES:');
    validMovies.forEach((m, i) =>
        console.log(`  ${String(i + 1).padStart(2, ' ')}. ${m.theatrical_anchor || '????-??-??'}  ${m.title} (id ${m.id})`)
    );
    console.log('TV:');
    validTv.forEach((t, i) => {
        const anchor = pickTvAnchor(t) || '????-??-??';
        const src = t.next_air_date ? 'next' : t.last_air_date ? 'last' : 'first';
        console.log(`  ${String(i + 1).padStart(2, ' ')}. ${anchor} (${src})  ${t.title} (id ${t.id})`);
    });

    log('done', 'spotlight build complete');
}

main().catch((e) => {
    console.error('[fatal]', e);
    process.exit(1);
});
