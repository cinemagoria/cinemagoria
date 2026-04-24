// Curates the Spotlight Movies / Spotlight TV Shows carousels for the homepage.
//
// Pipeline:
//   1. Pull candidate pool from TMDB (trending + discover, both media types).
//   2. Hard-exclude: Animation, Family, adult, and IDs in the manual excluded list
//      (or currently sitting in Turso `hero_selections`).
//   3. Hard-require: IMDb rating >= 5.0 with >= 1000 votes (joined from the
//      imdb_ratings Turso DB); dropped if no IMDb id or no rating row.
//   4. Score by genre affinity (boost horror/drama/thriller/mystery/war/history/
//      documentary/sci-fi; light penalty action/adventure; heavy penalty comedy)
//      plus freshness and a popularity-sanity penalty for blockbusters.
//   5. Diversity cap: at most 2 ja/ko TV shows.
//   6. Gemini 2.5-flash pass — ONE unified call for movies + tv together (same
//      pattern as cinemagoria-rss-aggregator/scripts/generate-articles.ts: one
//      prompt batches both lists, output is a single decisions array keyed by
//      {media, idx}). Via Vertex AI + GCP service account with a fallback chain
//      to gemini-3-flash-preview and gemini-2.5-flash-lite. Classifies each
//      candidate as cinemagoria | neutral | pochoclero. Rejects pochocleros.
//   7. Pin the manual-pinned IDs at the top; take the top N survivors.
//   8. Enrich with TMDB details in both en-US and es-ES (Option A: bilingual JSON
//      baked at curate-time so the es branch has zero runtime translation cost).
//   9. Write public/data/spotlight-movies.json + public/data/spotlight-tv.json.

import { createClient } from '@libsql/client';
import { GoogleAuth } from 'google-auth-library';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Config ──────────────────────────────────────────────────────────────────

const TMDB_API_KEY = (process.env.API_KEY || '').trim();
const TMDB_BASE = 'https://api.themoviedb.org/3';

const TURSO_URL = (process.env.TURSO_DATABASE_URL || '').trim();
const TURSO_TOKEN = (process.env.TURSO_AUTH_TOKEN || '').trim();

const IMDB_URL = (process.env.IMDB_DB_URL || '').trim();
const IMDB_TOKEN = (process.env.IMDB_DB_TOKEN || '').trim();

const GCP_JSON = process.env.GCP_SERVICE_ACCOUNT_JSON || '';
const GEMINI_PROJECT_ID = 'gemini-api-keys-493004';
const GEMINI_LOCATION = 'us-central1';
const GEMINI_MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite'];

const SPOTLIGHT_TARGET = 22;
const GEMINI_INPUT_LIMIT = 50;

const MIN_IMDB_RATING = 5.0;
const MIN_IMDB_VOTES = 1000;
const MIN_TMDB_VOTES = 500;

// Genre buckets (TMDB genre IDs — identical for movie & tv where they overlap)
const GENRE_HARD_EXCLUDE = new Set([16, 10751]);           // Animation, Family
const GENRE_HEAVY_PENALTY = new Set([]);                    // (reserved for future heavy penalties)
const GENRE_LIGHT_PENALTY = new Set([35, 28, 12]);          // Comedy, Action, Adventure
const GENRE_BOOST = new Set([27, 18, 53, 9648, 10752, 36, 99, 878]); // Horror, Drama, Thriller, Mystery, War, History, Documentary, Sci-Fi

// Freshness windows
const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const MOVIE_WINDOW_YEARS = 3;
const TV_WINDOW_YEARS = 4;

const LANG_DIVERSITY_CAP = 2; // max ja or ko TV shows in final list

// ─── Small helpers ───────────────────────────────────────────────────────────

const log = (tag, msg, ...rest) => console.log(`[${tag}] ${msg}`, ...rest);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function todayISO() {
    return NOW.toISOString().slice(0, 10);
}

function yearOf(dateStr) {
    if (!dateStr) return null;
    const y = parseInt(dateStr.slice(0, 4), 10);
    return Number.isFinite(y) ? y : null;
}

function isReleased(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) <= NOW;
}

function readJsonSafe(filePath, fallback) {
    try {
        if (!existsSync(filePath)) return fallback;
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (e) {
        log('warn', `Could not read ${filePath}:`, e.message);
        return fallback;
    }
}

// ─── 1. Candidate pool ───────────────────────────────────────────────────────

async function fetchCandidates(mediaType) {
    const pool = new Map();
    const putAll = (items) => {
        for (const it of items || []) {
            if (!it?.id) continue;
            if (!pool.has(it.id)) pool.set(it.id, { ...it, media_type: mediaType });
        }
    };

    // Trending (weekly) — pages 1..5
    for (let p = 1; p <= 5; p++) {
        try {
            const d = await tmdb(`/trending/${mediaType}/week`, { page: p, language: 'en-US' });
            putAll(d.results);
        } catch (e) { log('warn', `trending ${mediaType} p${p}:`, e.message); }
    }

    // Discover: popularity-sorted, with a release window, min vote count.
    // This widens the pool beyond trending (which is heavily skewed to blockbusters).
    const discoverPath = mediaType === 'movie' ? '/discover/movie' : '/discover/tv';
    const windowYears = mediaType === 'movie' ? MOVIE_WINDOW_YEARS : TV_WINDOW_YEARS;
    const minYear = CURRENT_YEAR - windowYears;
    const dateGteField = mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte';
    const dateLteField = mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte';

    const sortOptions = ['popularity.desc', 'vote_average.desc'];
    for (const sort of sortOptions) {
        for (let p = 1; p <= 3; p++) {
            try {
                const d = await tmdb(discoverPath, {
                    language: 'en-US',
                    sort_by: sort,
                    include_adult: false,
                    [dateGteField]: `${minYear}-01-01`,
                    [dateLteField]: todayISO(),
                    'vote_count.gte': MIN_TMDB_VOTES,
                    page: p,
                });
                putAll(d.results);
            } catch (e) { log('warn', `discover ${mediaType} ${sort} p${p}:`, e.message); }
        }
    }

    log('pool', `${mediaType}: ${pool.size} unique candidates`);
    return [...pool.values()];
}

// ─── 2. Hard filters ─────────────────────────────────────────────────────────

function hardFilterLocal(candidates, mediaType, heroBlockedIds, manuallyExcluded) {
    const windowYears = mediaType === 'movie' ? MOVIE_WINDOW_YEARS : TV_WINDOW_YEARS;
    const minYear = CURRENT_YEAR - windowYears;
    const dateKey = mediaType === 'movie' ? 'release_date' : 'first_air_date';

    return candidates.filter((c) => {
        if (manuallyExcluded.has(c.id)) return false;
        if (heroBlockedIds.has(`${c.id}-${mediaType}`)) return false;
        if (c.adult) return false;

        // Genre hard exclude
        const genreIds = c.genre_ids || (c.genres || []).map((g) => g.id);
        if (genreIds.some((g) => GENRE_HARD_EXCLUDE.has(g))) return false;

        // Freshness + released
        const y = yearOf(c[dateKey]);
        if (!y || y < minYear) return false;
        if (!isReleased(c[dateKey])) return false;

        // TMDB vote floor (trending sometimes returns barely-rated stuff)
        if ((c.vote_count ?? 0) < MIN_TMDB_VOTES) return false;

        return true;
    });
}

// ─── 3. IMDb rating gate ─────────────────────────────────────────────────────

async function fetchImdbIdsBatch(ids, mediaType) {
    // TMDB exposes external_ids on the detail endpoint. No batch endpoint, so
    // we parallelize with a small concurrency limit.
    const CONCURRENCY = 6;
    const results = new Map();
    const queue = [...ids];

    async function worker() {
        while (queue.length) {
            const id = queue.shift();
            try {
                const d = await tmdb(`/${mediaType}/${id}/external_ids`);
                results.set(id, d.imdb_id || null);
            } catch (e) {
                results.set(id, null);
            }
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return results;
}

async function imdbRatingGate(candidates, mediaType, imdbDb) {
    if (!candidates.length) return [];
    const idList = candidates.map((c) => c.id);
    const imdbIds = await fetchImdbIdsBatch(idList, mediaType);

    const tconsts = [...new Set([...imdbIds.values()].filter(Boolean))];
    if (!tconsts.length) return [];

    // Turso SQL — chunk into batches of 250 for safe IN() length.
    const ratingMap = new Map();
    const CHUNK = 250;
    for (let i = 0; i < tconsts.length; i += CHUNK) {
        const slice = tconsts.slice(i, i + CHUNK);
        const placeholders = slice.map(() => '?').join(',');
        const sql = `SELECT tconst, average_rating, num_votes FROM imdb_ratings WHERE tconst IN (${placeholders})`;
        const r = await imdbDb.execute({ sql, args: slice });
        for (const row of r.rows) {
            ratingMap.set(row.tconst, {
                rating: Number(row.average_rating),
                votes: Number(row.num_votes),
            });
        }
    }

    const surviving = [];
    for (const c of candidates) {
        const tconst = imdbIds.get(c.id);
        if (!tconst) continue;
        const r = ratingMap.get(tconst);
        if (!r) continue;
        if (!Number.isFinite(r.rating) || r.rating < MIN_IMDB_RATING) continue;
        if (!Number.isFinite(r.votes) || r.votes < MIN_IMDB_VOTES) continue;
        surviving.push({ ...c, imdb_id: tconst, imdb_rating: r.rating, imdb_votes: r.votes });
    }
    log('imdb', `${mediaType}: ${candidates.length} → ${surviving.length} after IMDb gate`);
    return surviving;
}

// ─── 4. Scoring ──────────────────────────────────────────────────────────────

function scoreCandidate(c, mediaType) {
    let score = 0;

    // IMDb rating is the anchor (max contribution ~50).
    score += c.imdb_rating * 6;

    // Vote-count log boost (taste-makers vs obscure).
    score += Math.log10(Math.max(c.imdb_votes, 10)) * 2;

    // Genre affinity.
    const genreIds = c.genre_ids || (c.genres || []).map((g) => g.id);
    for (const g of genreIds) {
        if (GENRE_BOOST.has(g)) score += 6;
        else if (GENRE_HEAVY_PENALTY.has(g)) score -= 15;
        else if (GENRE_LIGHT_PENALTY.has(g)) score -= 4;
    }

    // Blockbuster penalty: extreme popularity + ratings plateau = pochoclero.
    // TMDB popularity is noisy but spikes for franchise releases.
    if ((c.popularity ?? 0) > 300 && c.imdb_rating < 7.0) score -= 8;
    if ((c.popularity ?? 0) > 600) score -= 6;

    // Freshness: lean toward "last 18 months" but not brand-new.
    const dateKey = mediaType === 'movie' ? 'release_date' : 'first_air_date';
    const y = yearOf(c[dateKey]);
    if (y) {
        const ageMonths = (NOW - new Date(c[dateKey])) / (1000 * 60 * 60 * 24 * 30);
        if (ageMonths >= 2 && ageMonths <= 24) score += 3;
        else if (ageMonths < 2) score += 1;
    }

    return score;
}

function applyDiversityCap(list, mediaType) {
    if (mediaType !== 'tv') return list;
    const out = [];
    const jaKo = { ja: 0, ko: 0 };
    for (const item of list) {
        const lang = item.original_language;
        if (lang === 'ja' || lang === 'ko') {
            if (jaKo[lang] >= LANG_DIVERSITY_CAP) continue;
            jaKo[lang] += 1;
        }
        out.push(item);
    }
    return out;
}

// ─── 5. Gemini curator ───────────────────────────────────────────────────────
//
// UNIFIED CALL. We follow cinemagoria-rss-aggregator/scripts/generate-articles.ts:
// one Gemini request per pipeline run, batching movies + tv into the same prompt
// with a `media` tag on every item. Cuts token cost, latency and rate-limit
// exposure roughly in half versus doing two calls.

function briefOf(it, i, media) {
    return {
        idx: i,
        media,
        id: it.id,
        title: it.title || it.name,
        year: yearOf(it.release_date || it.first_air_date),
        overview: (it.overview || '').slice(0, 280),
        genres: (it.genre_ids || []).join(','),
        imdb: it.imdb_rating,
        lang: it.original_language,
    };
}

function buildUnifiedGeminiPrompt(movieSlice, tvSlice) {
    const briefMovies = movieSlice.map((it, i) => briefOf(it, i, 'movie'));
    const briefTv = tvSlice.map((it, i) => briefOf(it, i, 'tv'));

    return `You are the senior content curator for CINEMAGORIA, a cinephile-oriented site. You evaluate both movies and TV shows for the homepage "Spotlight" carousels.

CINEMAGORIA's editorial identity — what belongs on the homepage:
- Horror (elevated/arthouse horror, A24-style, indie horror, psychological horror)
- Science fiction with conceptual/ideas-driven narratives
- Drama (festival-tier, character-driven, adult)
- Thrillers (psychological, slow-burn, noir)
- Mystery, suspense, neo-noir
- Documentaries (social, political, investigative, art)
- War, history (with a critical or artistic lens)
- Foreign arthouse / festival cinema (Cannes, Berlinale, Rotterdam, BIFFF, Sundance, Tribeca-tier)
- Auteur-driven productions (indie directors, A24, Neon, Mubi, IFC, Criterion)
- K/J content ONLY if it's arthouse/genre-standout (not mass-market drama/romance)

What does NOT belong (REJECT as "pochoclero"):
- Franchise sequels/prequels (Scream N, Saw N, M3GAN sequels, Expendables, etc.)
- Superhero / Marvel / DC
- Kids and family content
- Generic romantic comedies, Hallmark-style romances
- Teen drama aimed at under-18 audiences
- Mainstream action-adventure blockbusters (Fast & Furious, Mission Impossible sequels, big-budget CGI spectacle)
- Reality-adjacent content, game shows
- Shallow celebrity vehicles, star-driven comedy

Edge cases — classify as "neutral" when:
- The title is a borderline genre piece that could go either way
- Mainstream but with meaningful auteur credentials
- Popular but the quality is ambiguous

For each item, output strictly: "cinemagoria" | "neutral" | "pochoclero".
Also give a short 1-sentence reasoning.

Identify each decision by BOTH its \`media\` ("movie" or "tv") AND its \`idx\`. The two lists use independent 0-based indices; a movie idx=3 is a different item than a tv idx=3.

MOVIES:
${JSON.stringify(briefMovies, null, 2)}

TV SHOWS:
${JSON.stringify(briefTv, null, 2)}

Respond ONLY with valid JSON of the form:
{
  "decisions": [
    { "media": "movie", "idx": 0, "verdict": "cinemagoria" | "neutral" | "pochoclero", "reason": "..." },
    { "media": "tv",    "idx": 0, "verdict": "cinemagoria" | "neutral" | "pochoclero", "reason": "..." }
  ]
}`;
}

async function callGemini(prompt) {
    if (!GCP_JSON) throw new Error('Missing GCP_SERVICE_ACCOUNT_JSON');
    const auth = new GoogleAuth({
        credentials: JSON.parse(GCP_JSON),
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const token = (await auth.getAccessToken()) || '';

    const body = JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 16000,
            temperature: 0.3,
        },
    });

    let response;
    for (const model of GEMINI_MODEL_CHAIN) {
        const started = Date.now();
        log('gemini', `→ ${model}`);
        response = await fetch(
            `https://${GEMINI_LOCATION}-aiplatform.googleapis.com/v1/projects/${GEMINI_PROJECT_ID}/locations/${GEMINI_LOCATION}/publishers/google/models/${model}:generateContent`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body,
            }
        );
        log('gemini', `${model} → ${response.status} in ${Date.now() - started}ms`);
        if (response.status !== 503 && response.status !== 429) break;
    }
    if (!response.ok) {
        const err = await response.text().catch(() => '');
        throw new Error(`Gemini ${response.status}: ${err.slice(0, 300)}`);
    }
    const result = await response.json();
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Gemini returned empty content');
    return JSON.parse(content);
}

async function geminiCurateBoth(movieCandidates, tvCandidates) {
    const movieSlice = movieCandidates.slice(0, GEMINI_INPUT_LIMIT);
    const tvSlice = tvCandidates.slice(0, GEMINI_INPUT_LIMIT);

    if (!movieSlice.length && !tvSlice.length) {
        return { movies: [], tv: [] };
    }

    const prompt = buildUnifiedGeminiPrompt(movieSlice, tvSlice);
    log('gemini', `unified call: ${movieSlice.length} movies + ${tvSlice.length} tv (1 request)`);

    let parsed;
    try {
        parsed = await callGemini(prompt);
    } catch (e) {
        log('gemini', `FAILED (${e.message}) — falling back to score-only ranking for both media types`);
        return { movies: movieCandidates, tv: tvCandidates };
    }

    // Split decisions by media type, key by idx.
    const movieDecisions = new Map();
    const tvDecisions = new Map();
    for (const d of parsed.decisions || []) {
        if (d.media === 'movie') movieDecisions.set(d.idx, d);
        else if (d.media === 'tv') tvDecisions.set(d.idx, d);
    }

    const applyDecisions = (slice, decisions, label) => {
        const kept = [];
        for (let i = 0; i < slice.length; i++) {
            const d = decisions.get(i);
            const verdict = d?.verdict || 'neutral';
            if (verdict === 'pochoclero') continue;
            kept.push({
                ...slice[i],
                _verdict: verdict,
                _reasoning: d?.reason || null,
            });
        }
        log('gemini', `${label}: ${slice.length} → ${kept.length} after Gemini pass`);
        return kept;
    };

    return {
        movies: applyDecisions(movieSlice, movieDecisions, 'movie'),
        tv: applyDecisions(tvSlice, tvDecisions, 'tv'),
    };
}

// ─── 6. Final enrichment (bilingual) ─────────────────────────────────────────

async function enrichDetails(id, mediaType) {
    const [en, es] = await Promise.all([
        tmdb(`/${mediaType}/${id}`, { language: 'en-US', append_to_response: 'external_ids' }),
        tmdb(`/${mediaType}/${id}`, { language: 'es-ES' }).catch(() => null),
    ]);

    const pick = (field, fallback) => (es?.[field]?.trim() ? es[field] : fallback);

    const title_en = en.title || en.name;
    const title_es = pick('title', null) || pick('name', null) || title_en;

    const common = {
        id: en.id,
        media_type: mediaType,
        title: title_en,
        title_es: title_es,
        overview: en.overview || '',
        overview_es: es?.overview?.trim() ? es.overview : (en.overview || ''),
        poster_path: en.poster_path,
        backdrop_path: en.backdrop_path,
        vote_average: parseFloat(en.vote_average).toFixed(1),
        genre_ids: (en.genres || []).map((g) => g.id),
        genres: en.genres || [],
        original_language: en.original_language,
        imdb_id: en.external_ids?.imdb_id || en.imdb_id || null,
    };

    if (mediaType === 'movie') {
        return {
            ...common,
            release_date: en.release_date || null,
        };
    }
    return {
        ...common,
        first_air_date: en.first_air_date || null,
        last_air_date: en.last_air_date || null,
        status: en.status || null,
    };
}

async function enrichAll(items, mediaType) {
    const CONCURRENCY = 4;
    const out = new Array(items.length);
    let cursor = 0;
    async function worker() {
        while (cursor < items.length) {
            const i = cursor++;
            const src = items[i];
            try {
                const enriched = await enrichDetails(src.id, mediaType);
                out[i] = {
                    ...enriched,
                    imdb_rating: src.imdb_rating,
                    imdb_votes: src.imdb_votes,
                    rating_source: 'imdb',
                    _curated: true,
                    _score: Number(src._score?.toFixed(2) ?? 0),
                    _verdict: src._verdict || null,
                    _reasoning: src._reasoning || null,
                    _pinned: src._pinned || false,
                };
            } catch (e) {
                log('warn', `enrich ${mediaType}/${src.id} failed: ${e.message}`);
                out[i] = null;
            }
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return out.filter(Boolean);
}

// ─── Turso: hero_selections (dynamic dedupe) ─────────────────────────────────

async function loadHeroBlockedIds(mainDb) {
    const r = await mainDb.execute(`SELECT tmdb_id, media_type FROM hero_selections WHERE tmdb_id IS NOT NULL`);
    const set = new Set();
    for (const row of r.rows) {
        const mt = row.media_type || 'movie';
        set.add(`${Number(row.tmdb_id)}-${mt}`);
    }
    log('hero', `hero_selections currently blocks ${set.size} titles`);
    return set;
}

// ─── Manual overrides ────────────────────────────────────────────────────────

async function applyManualPins(finalList, mediaType, pinnedIds, heroBlockedIds, imdbDb) {
    if (!pinnedIds.length) return finalList;

    const pinnedInList = new Set(finalList.filter((it) => pinnedIds.includes(it.id)).map((it) => it.id));
    const missing = pinnedIds.filter((id) => !pinnedInList.has(id));
    if (!missing.length) {
        // Reorder: pinned first in requested order.
        const pinnedSet = new Set(pinnedIds);
        const pinned = pinnedIds
            .map((id) => finalList.find((it) => it.id === id))
            .filter(Boolean)
            .map((it) => ({ ...it, _pinned: true }));
        const rest = finalList.filter((it) => !pinnedSet.has(it.id));
        return [...pinned, ...rest];
    }

    // Force-fetch missing pinned (skip IMDb/hero checks — user-forced).
    const forced = [];
    for (const id of missing) {
        if (heroBlockedIds.has(`${id}-${mediaType}`)) {
            log('pin', `skipping pinned ${mediaType}/${id}: currently in hero_selections`);
            continue;
        }
        try {
            const enriched = await enrichDetails(id, mediaType);
            // Best-effort IMDb rating attach (not required).
            let imdbRating = null, imdbVotes = null;
            if (enriched.imdb_id) {
                try {
                    const r = await imdbDb.execute({
                        sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ? LIMIT 1',
                        args: [enriched.imdb_id],
                    });
                    if (r.rows[0]) {
                        imdbRating = Number(r.rows[0].average_rating);
                        imdbVotes = Number(r.rows[0].num_votes);
                    }
                } catch {}
            }
            forced.push({
                ...enriched,
                imdb_rating: imdbRating,
                imdb_votes: imdbVotes,
                rating_source: imdbRating ? 'imdb' : 'tmdb',
                _curated: true,
                _pinned: true,
                _score: 9999,
                _verdict: 'pinned',
                _reasoning: 'Manual pin from data/spotlight-manual-pinned.json',
            });
        } catch (e) {
            log('pin', `pinned ${mediaType}/${id} enrich failed: ${e.message}`);
        }
    }

    const pinnedSet = new Set(pinnedIds);
    const existingPinned = pinnedIds
        .map((id) => finalList.find((it) => it.id === id))
        .filter(Boolean)
        .map((it) => ({ ...it, _pinned: true }));
    const allPinned = [
        ...forced,
        ...existingPinned.filter((it) => !forced.some((f) => f.id === it.id)),
    ];
    const rest = finalList.filter((it) => !pinnedSet.has(it.id));
    return [...allPinned, ...rest];
}

// ─── Main orchestration per media type (split around the unified Gemini call) ─

async function curateUpToGemini(mediaType, heroBlockedIds, manualExcluded, imdbDb) {
    log(mediaType, '--- START ---');

    const pool = await fetchCandidates(mediaType);
    const afterHard = hardFilterLocal(pool, mediaType, heroBlockedIds, manualExcluded);
    log(mediaType, `after local hard filter: ${afterHard.length}`);

    const afterImdb = await imdbRatingGate(afterHard, mediaType, imdbDb);

    for (const c of afterImdb) c._score = scoreCandidate(c, mediaType);
    afterImdb.sort((a, b) => b._score - a._score);

    const afterDiversity = applyDiversityCap(afterImdb, mediaType);
    log(mediaType, `after diversity cap: ${afterDiversity.length}`);

    return afterDiversity;
}

async function finishCurate(mediaType, afterGemini, manualPinned, heroBlockedIds, imdbDb) {
    const topRaw = afterGemini.slice(0, SPOTLIGHT_TARGET + 4); // buffer for enrichment failures
    const enriched = await enrichAll(topRaw, mediaType);
    const topEnriched = enriched.slice(0, SPOTLIGHT_TARGET);

    const withPins = await applyManualPins(topEnriched, mediaType, manualPinned, heroBlockedIds, imdbDb);

    return withPins.slice(0, SPOTLIGHT_TARGET + manualPinned.length);
}

// ─── Entry ───────────────────────────────────────────────────────────────────

async function main() {
    if (!TMDB_API_KEY) throw new Error('Missing API_KEY (TMDB)');
    if (!TURSO_URL || !TURSO_TOKEN) throw new Error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN');
    if (!IMDB_URL || !IMDB_TOKEN) throw new Error('Missing IMDB_DB_URL / IMDB_DB_TOKEN');
    if (!GCP_JSON) throw new Error('Missing GCP_SERVICE_ACCOUNT_JSON');

    const mainDb = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const imdbDb = createClient({ url: IMDB_URL, authToken: IMDB_TOKEN });

    const heroBlockedIds = await loadHeroBlockedIds(mainDb);

    const excludedRaw = readJsonSafe(join(ROOT, 'data', 'spotlight-manual-excluded.json'), { movie: [], tv: [] });
    const pinnedRaw = readJsonSafe(join(ROOT, 'data', 'spotlight-manual-pinned.json'), { movie: [], tv: [] });
    const excludedMovies = new Set(excludedRaw.movie || []);
    const excludedTv = new Set(excludedRaw.tv || []);
    const pinnedMovies = pinnedRaw.movie || [];
    const pinnedTv = pinnedRaw.tv || [];

    // Phase 1 — run the cheap, deterministic pipeline for both media types in
    // parallel (fetch → hard filter → IMDb gate → score → diversity cap).
    const [afterDiversityMovies, afterDiversityTv] = await Promise.all([
        curateUpToGemini('movie', heroBlockedIds, excludedMovies, imdbDb),
        curateUpToGemini('tv', heroBlockedIds, excludedTv, imdbDb),
    ]);

    // Phase 2 — ONE Gemini call for both lists at once.
    const { movies: afterGeminiMovies, tv: afterGeminiTv } =
        await geminiCurateBoth(afterDiversityMovies, afterDiversityTv);

    // Phase 3 — enrichment + manual pins, in parallel again.
    const [movies, tv] = await Promise.all([
        finishCurate('movie', afterGeminiMovies, pinnedMovies, heroBlockedIds, imdbDb),
        finishCurate('tv', afterGeminiTv, pinnedTv, heroBlockedIds, imdbDb),
    ]);

    const outDir = join(ROOT, 'public', 'data');
    mkdirSync(outDir, { recursive: true });

    const payloadMovie = {
        generated_at: new Date().toISOString(),
        engine_version: '1.0.0',
        media_type: 'movie',
        count: movies.length,
        results: movies,
    };
    const payloadTv = {
        generated_at: new Date().toISOString(),
        engine_version: '1.0.0',
        media_type: 'tv',
        count: tv.length,
        results: tv,
    };

    writeFileSync(join(outDir, 'spotlight-movies.json'), JSON.stringify(payloadMovie, null, 2));
    writeFileSync(join(outDir, 'spotlight-tv.json'), JSON.stringify(payloadTv, null, 2));

    log('done', `movies=${movies.length} tv=${tv.length}`);
    process.exit(0);
}

main().catch((e) => {
    console.error('[fatal]', e);
    process.exit(1);
});
