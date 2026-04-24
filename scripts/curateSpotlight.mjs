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

// Genre buckets — TMDB uses DIFFERENT IDs for movies vs TV.
// Movie-only: 28=Action, 12=Adventure, 14=Fantasy, 878=Sci-Fi, 10752=War, 36=History, 10749=Romance, 10402=Music, 10770=TV Movie
// TV-only:    10759=Action&Adventure, 10762=Kids, 10764=Reality, 10765=Sci-Fi&Fantasy, 10766=Soap, 10767=Talk, 10763=News, 10768=War&Politics
// Shared:     16=Animation, 10751=Family, 35=Comedy, 18=Drama, 27=Horror, 53=Thriller, 9648=Mystery, 99=Documentary, 80=Crime
const GENRE_HARD_EXCLUDE = new Set([
    16,     // Animation
    10751,  // Family
    10770,  // TV Movie
    10762,  // Kids (TV)
    10764,  // Reality (TV)
    10766,  // Soap (TV)
    10767,  // Talk (TV)
    10763,  // News (TV)
]);
const GENRE_HEAVY_PENALTY = new Set([
    14,     // Fantasy (movie)
    10749,  // Romance (movie)
    10402,  // Music (movie)
]);
const GENRE_LIGHT_PENALTY = new Set([
    35,     // Comedy
    28,     // Action (movie)
    12,     // Adventure (movie)
    10759,  // Action & Adventure (TV)
]);
// Note: 10765 (TV Sci-Fi & Fantasy) is intentionally NOT in any set — it mixes
// a boosted genre (Sci-Fi) with a penalized one (Fantasy). Gemini handles that nuance.
const GENRE_BOOST = new Set([
    27,     // Horror
    18,     // Drama
    53,     // Thriller
    9648,   // Mystery
    10752,  // War (movie)
    10768,  // War & Politics (TV)
    36,     // History (movie)
    99,     // Documentary
    878,    // Sci-Fi (movie)
    80,     // Crime
]);

// Freshness windows
const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth() + 1; // 1-12

// Movies: dynamic rolling window.
// If we're before June, include from Nov 1 of (year-2) to today.
// If we're June or later, include from Jan 1 of (year-1) to today.
// This gives ~13-18 months of coverage, never showing 2-3 year old films.
const MOVIE_WINDOW_START = (() => {
    if (CURRENT_MONTH < 6) {
        return `${CURRENT_YEAR - 2}-11-01`;
    }
    return `${CURRENT_YEAR - 1}-01-01`;
})();

// TV: shows whose last_air_date is within the last 18 months are fresh.
// Shows that started before 2018 are fine as long as they aired recently.
const TV_LAST_AIRED_CUTOFF_MONTHS = 18;

const LANG_DIVERSITY_CAP = 2; // max ja or ko TV shows in final list

// Franchise / pochoclero keyword detection in titles
const POCHOCLERO_TITLE_PATTERNS = [
    /\b(?:Part|Chapter)\s+(?:Three|Four|Five|Six|Seven|Eight|Nine|Ten|[3-9]|\d{2,})\b/i,
    /\bVol\.?\s*[3-9]\b/i,
];

// Known pochoclero franchise keywords (lowercased substrings)
const POCHOCLERO_FRANCHISE_KEYWORDS = [
    'marvel', 'avengers', 'spider-man', 'spider man',
    'fast & furious', 'fast and furious', 'furious',
    'transformers', 'minions', 'despicable me',
    'shrek', 'kung fu panda', 'ice age', 'trolls',
    'paw patrol', 'barbie', 'lego',
    'mission: impossible', 'mission impossible',
    'expendables', 'xxx:',
];

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
    const dateGteField = mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte';
    const dateLteField = mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte';

    // For movies, use the dynamic rolling window; for TV, look back 4 years on first_air_date
    // (the real freshness filter for TV is last_air_date, applied in hardFilterLocal).
    const discoverGte = mediaType === 'movie' ? MOVIE_WINDOW_START : `${CURRENT_YEAR - 4}-01-01`;

    const sortOptions = ['popularity.desc', 'vote_average.desc'];
    for (const sort of sortOptions) {
        for (let p = 1; p <= 3; p++) {
            try {
                const d = await tmdb(discoverPath, {
                    language: 'en-US',
                    sort_by: sort,
                    include_adult: false,
                    [dateGteField]: discoverGte,
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

// ─── 1b. Hydrate TV candidates with last_air_date ────────────────────────────
// TMDB list endpoints (trending, discover) do NOT include last_air_date.
// We need it for the TV freshness filter, so we batch-fetch the detail endpoint.

async function hydrateTvLastAired(candidates) {
    const CONCURRENCY = 8;
    const queue = [...candidates];
    async function worker() {
        while (queue.length) {
            const c = queue.shift();
            try {
                const detail = await tmdb(`/tv/${c.id}`, { language: 'en-US' });
                c.last_air_date = detail.last_air_date || null;
                c.status = detail.status || null;
            } catch {
                c.last_air_date = c.first_air_date || null;
            }
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    log('hydrate', `tv: fetched last_air_date for ${candidates.length} candidates`);
    return candidates;
}

// ─── 2. Hard filters ─────────────────────────────────────────────────────────

function isFranchisePochoclero(title) {
    if (!title) return false;
    const lower = title.toLowerCase();
    if (POCHOCLERO_FRANCHISE_KEYWORDS.some((kw) => lower.includes(kw))) return true;
    if (POCHOCLERO_TITLE_PATTERNS.some((re) => re.test(title))) return true;
    return false;
}

function hardFilterLocal(candidates, mediaType, heroBlockedIds, manuallyExcluded) {
    return candidates.filter((c) => {
        if (manuallyExcluded.has(c.id)) return false;
        if (heroBlockedIds.has(`${c.id}-${mediaType}`)) return false;
        if (c.adult) return false;

        // Genre hard exclude
        const genreIds = c.genre_ids || (c.genres || []).map((g) => g.id);
        if (genreIds.some((g) => GENRE_HARD_EXCLUDE.has(g))) return false;

        // Franchise / pochoclero title detection
        const title = c.title || c.name || '';
        if (isFranchisePochoclero(title)) return false;

        if (mediaType === 'movie') {
            // Movies: must be within the dynamic rolling window
            const rd = c.release_date;
            if (!rd) return false;
            if (!isReleased(rd)) return false;
            if (rd < MOVIE_WINDOW_START) return false;
        } else {
            // TV: use last_air_date for freshness. A show that started in 2018
            // but last aired in 2026 is fresh. A show that last aired in 2022 is not.
            const lastAired = c.last_air_date || c.first_air_date;
            if (!lastAired) return false;
            const cutoffDate = new Date(NOW);
            cutoffDate.setMonth(cutoffDate.getMonth() - TV_LAST_AIRED_CUTOFF_MONTHS);
            if (new Date(lastAired) < cutoffDate) return false;
            // Also must have started airing (not future-only)
            if (c.first_air_date && !isReleased(c.first_air_date)) return false;
        }

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

function scoreCandidate(c, mediaType, noirIds, heroBlockedIds) {
    let score = 0;

    // IMDb rating is the anchor (max contribution ~50).
    score += c.imdb_rating * 6;

    // Vote-count log boost (taste-makers vs obscure).
    score += Math.log10(Math.max(c.imdb_votes, 10)) * 2;

    // Genre affinity — smarter: don't penalize Action/Adventure if combined with
    // a core genre (Horror+Action like Sinners, Thriller+Action like Colony).
    const genreIds = c.genre_ids || (c.genres || []).map((g) => g.id);
    let boostCount = 0;
    let penaltyCount = 0;
    for (const g of genreIds) {
        if (GENRE_BOOST.has(g)) { score += 5; boostCount++; }
        else if (GENRE_HEAVY_PENALTY.has(g)) { score -= 10; penaltyCount++; }
        else if (GENRE_LIGHT_PENALTY.has(g)) penaltyCount++;
    }
    // Only apply light penalties if no boost genre is present.
    // This prevents Horror+Action from being penalized for Action.
    if (boostCount === 0) {
        score -= penaltyCount * 5;
        score -= 6; // no cinemagoria-aligned genre at all
    }

    // Blockbuster penalty: extreme popularity = likely pochoclero.
    if ((c.popularity ?? 0) > 200 && c.imdb_rating < 7.0) score -= 8;
    if ((c.popularity ?? 0) > 500) score -= 6;

    // Freshness: lean toward "last 12 months".
    const dateKey = mediaType === 'movie' ? 'release_date' : 'first_air_date';
    const dateStr = c[dateKey];
    if (dateStr) {
        const ageMonths = (NOW - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 30);
        if (ageMonths >= 1 && ageMonths <= 12) score += 5;
        else if (ageMonths < 1) score += 3;
        else if (ageMonths > 12 && ageMonths <= 18) score += 1;
    }

    // For TV, bonus if still airing / recently concluded.
    if (mediaType === 'tv') {
        const lastAired = c.last_air_date;
        if (lastAired) {
            const lastAiredAge = (NOW - new Date(lastAired)) / (1000 * 60 * 60 * 24 * 30);
            if (lastAiredAge <= 3) score += 4;
            else if (lastAiredAge <= 6) score += 2;
        }
    }

    // ★ NOIR HISTORICAL BOOST — the strongest signal.
    // If this candidate is in noir_historical but NOT in hero_selections,
    // it's a title Cinemagoria editorially selected. Massive boost.
    const key = `${c.id}-${mediaType}`;
    if (noirIds.has(key) && !heroBlockedIds.has(key)) {
        score += 20;
        c._noir_match = true;
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

// ─── Robust JSON parser for Gemini responses ─────────────────────────────────
// Ported from cinemagoria-rss-aggregator/scripts/generate-articles.ts. Gemini
// occasionally emits invalid JSON (unescaped backslashes, unescaped inner
// double quotes inside string values, trailing commas, or truncation). The
// sequence tries strict parse → sanitize escapes → full repair before giving
// up. In practice this recovers ~100% of the malformed payloads we've seen.

function sanitizeJSONEscapes(s) {
    // Replace any `\X` where X is NOT one of the valid JSON escape chars with
    // `\\X`. This fixes Gemini's habit of emitting literal backslashes inside
    // string values (e.g. file paths, regex fragments).
    return s.replace(/\\(?!["\\\/bfnrtu])/g, '\\\\');
}

function repairJSON(raw) {
    let s = raw;
    // Strip trailing commas before } or ]
    s = s.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    // If the response is truncated mid-string or mid-object, try to salvage
    // by removing the last incomplete object and closing the structures.
    // Common pattern: truncated inside a "reason" string value.
    const trimmed = s.trimEnd();
    if (!trimmed.endsWith('}')) {
        // Try to find the last complete object (ends with }) and cut there
        const lastCompleteObj = s.lastIndexOf('}');
        if (lastCompleteObj > 0) {
            // Check if we're inside the decisions array
            const afterLastObj = s.slice(lastCompleteObj + 1).trim();
            // If after the last } there's a comma or incomplete content, cut it
            if (afterLastObj.startsWith(',') || afterLastObj.length > 0) {
                s = s.slice(0, lastCompleteObj + 1);
            }
        }
        // Now balance braces/brackets
        const openBraces = (s.match(/{/g) || []).length;
        const closeBraces = (s.match(/}/g) || []).length;
        const openBrackets = (s.match(/\[/g) || []).length;
        const closeBrackets = (s.match(/]/g) || []).length;
        s += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
        s += '}'.repeat(Math.max(0, openBraces - closeBraces));
    }
    // Escape unescaped inner double quotes inside string values
    s = s.replace(/:\s*"([^"]*?)(?:"|$)/g, (m, content) => {
        const escaped = content.replace(/(?<!\\)"/g, '\\"');
        return `: "${escaped}"`;
    });
    return s;
}

function parseGeminiJSON(raw) {
    let clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(clean);
    } catch (e1) {
        log('gemini', `strict parse failed (${e1.message}); trying sanitize…`);
        try {
            return JSON.parse(sanitizeJSONEscapes(clean));
        } catch (e2) {
            log('gemini', `sanitize failed (${e2.message}); trying full repair…`);
            try {
                return JSON.parse(repairJSON(sanitizeJSONEscapes(clean)));
            } catch (e3) {
                // Show context around the reported parse position to help debug.
                const posMatch = e3.message.match(/position (\d+)/);
                if (posMatch) {
                    const pos = Number(posMatch[1]);
                    const start = Math.max(0, pos - 120);
                    const end = Math.min(clean.length, pos + 120);
                    log('gemini', `context around pos ${pos}: ...${clean.slice(start, end)}...`);
                }
                log('gemini', `first 300 chars: ${clean.slice(0, 300)}`);
                log('gemini', `last 300 chars: ${clean.slice(-300)}`);
                throw e3;
            }
        }
    }
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

function buildUnifiedGeminiPrompt(movieSlice, tvSlice, heroExamples) {
    const briefMovies = movieSlice.map((it, i) => briefOf(it, i, 'movie'));
    const briefTv = tvSlice.map((it, i) => briefOf(it, i, 'tv'));

    // Build examples string from real hero_selections
    const exampleLines = (heroExamples || []).slice(0, 25).map(
        (h) => `  - ${h.title} (${h.genres}) [${h.media_type}]`
    ).join('\n');

    return `You are the senior content curator for CINEMAGORIA, a cinephile-oriented site focused on elevated genre cinema. Evaluate candidates for the homepage "Spotlight" carousels.

Here are REAL titles currently featured on Cinemagoria's homepage (hero section). These define the editorial taste:
${exampleLines}

ACCEPT ("cinemagoria") — titles that match this editorial identity:
- Elevated horror, A24-style, psychological horror, indie horror, body horror
- Sci-fi with ideas-driven narratives, dystopian, cerebral
- Festival-tier drama, character-driven, auteur, adult themes
- Psychological thrillers, slow-burn, noir, neo-noir, crime drama
- Mystery, suspense, police procedural with grit
- Documentaries (social, political, investigative, artistic)
- War/history with critical or artistic lens
- Foreign arthouse / festival cinema (Cannes, Sundance, Berlinale)
- Action is OK ONLY when combined with horror, thriller, crime, or sci-fi (e.g. Colony, Sinners)

REJECT ("pochoclero"):
- Superhero/Marvel/DC (Daredevil, Peacemaker, etc.)
- Kids, family, YA/teen content (Heartstopper, teen dramas)
- Fantasy epics, musical fantasy, fairy-tale (Wicked, Knight of Seven Kingdoms)
- Generic rom-coms, Hallmark romances
- Mainstream action-only blockbusters without genre depth
- Reality TV, game shows, celebrity vehicles
- Procedural network TV without edge (NCIS, FBI, etc.)
- Pochoclero horror franchises that are mass-market (Welcome to Derry S1 = borderline OK but stale if old)
- Shows/films that already feel "passé" or oversaturated (hype died months ago)

BORDERLINE → "neutral"

RULES:
- Output ONLY valid JSON, no markdown.
- Keep each "reason" to MAX 6 WORDS.
- Identify by media + idx (0-based, independent per list).

MOVIES:
${JSON.stringify(briefMovies)}

TV:
${JSON.stringify(briefTv)}

JSON:
{"decisions":[{"media":"movie","idx":0,"verdict":"cinemagoria","reason":"6 words max"}]}`;
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
            maxOutputTokens: 24000,
            temperature: 0.2,
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
    if (result.usageMetadata) {
        const u = result.usageMetadata;
        log('gemini', `tokens — prompt: ${u.promptTokenCount}, completion: ${u.candidatesTokenCount}, total: ${u.totalTokenCount}`);
    }
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Gemini returned empty content');
    return parseGeminiJSON(content);
}

async function geminiCurateBoth(movieCandidates, tvCandidates, heroExamples) {
    const movieSlice = movieCandidates.slice(0, GEMINI_INPUT_LIMIT);
    const tvSlice = tvCandidates.slice(0, GEMINI_INPUT_LIMIT);

    if (!movieSlice.length && !tvSlice.length) {
        return { movies: [], tv: [] };
    }

    const prompt = buildUnifiedGeminiPrompt(movieSlice, tvSlice, heroExamples);
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
                    _noir_match: src._noir_match || false,
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

// ─── Turso: noir_historical (editorial cross-reference) ──────────────────────
// noir_historical contains ALL titles that Cinemagoria has editorially selected
// (current hero + past hero). If a TMDB candidate appears in noir but NOT in
// hero_selections, it's a strong signal it belongs in spotlight.

async function loadNoirHistoricalIds(mainDb) {
    const r = await mainDb.execute(
        `SELECT tmdb_id, media_type, title, genres, release_date FROM noir_historical WHERE removed_from_noir_at IS NULL`
    );
    const map = new Map(); // key: "tmdb_id-media_type"
    for (const row of r.rows) {
        const mt = row.media_type || 'movie';
        map.set(`${Number(row.tmdb_id)}-${mt}`, {
            tmdb_id: Number(row.tmdb_id),
            media_type: mt,
            title: row.title,
            genres: row.genres,
            release_date: row.release_date,
        });
    }
    log('noir', `noir_historical has ${map.size} active titles`);
    return map;
}

// Load hero_selections with title+genres for Gemini prompt examples
async function loadHeroExamples(mainDb) {
    const r = await mainDb.execute(
        `SELECT tmdb_id, media_type, title, genres FROM hero_selections WHERE tmdb_id IS NOT NULL ORDER BY id DESC`
    );
    return r.rows.map((row) => ({
        title: row.title,
        genres: row.genres,
        media_type: row.media_type || 'movie',
    }));
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

async function curateUpToGemini(mediaType, heroBlockedIds, manualExcluded, imdbDb, noirIds) {
    log(mediaType, '--- START ---');

    let pool = await fetchCandidates(mediaType);

    // TV candidates need last_air_date hydrated before the hard filter can use it.
    if (mediaType === 'tv') {
        pool = await hydrateTvLastAired(pool);
    }

    const afterHard = hardFilterLocal(pool, mediaType, heroBlockedIds, manualExcluded);
    log(mediaType, `after local hard filter: ${afterHard.length}`);

    const afterImdb = await imdbRatingGate(afterHard, mediaType, imdbDb);

    // Score with noir cross-reference
    for (const c of afterImdb) c._score = scoreCandidate(c, mediaType, noirIds, heroBlockedIds);
    afterImdb.sort((a, b) => b._score - a._score);

    const noirMatches = afterImdb.filter((c) => c._noir_match).length;
    log(mediaType, `noir matches in pool: ${noirMatches}`);

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

// Validate a libsql/turso URL and log only its shape (never the value). GitHub
// masks exact secret matches, not substrings, so we deliberately print scheme
// + length + last-4 to help diagnose paste errors (missing `libsql://` prefix,
// stray quotes, trailing newline) without leaking the database host.
function validateLibsqlUrl(name, value) {
    if (!value) throw new Error(`Missing ${name}`);
    const len = value.length;
    const last4 = value.slice(-4);
    const scheme = (value.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*):\/\//) || [])[1] || null;
    log('secret', `${name}: len=${len}, scheme=${scheme ?? '<none>'}, ends_with="${last4}"`);
    if (!scheme) {
        throw new Error(
            `${name} has no URL scheme — expected a value starting with "libsql://". ` +
            `Got len=${len}. Check the GitHub secret: it may be missing the "libsql://" prefix, ` +
            `have surrounding quotes, or include a leading newline.`
        );
    }
    if (!['libsql', 'http', 'https', 'ws', 'wss'].includes(scheme.toLowerCase())) {
        throw new Error(`${name} has unexpected scheme "${scheme}" — should be "libsql".`);
    }
}

async function main() {
    if (!TMDB_API_KEY) throw new Error('Missing API_KEY (TMDB)');
    if (!TURSO_URL || !TURSO_TOKEN) throw new Error('Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN');
    if (!IMDB_URL || !IMDB_TOKEN) throw new Error('Missing IMDB_DB_URL / IMDB_DB_TOKEN');
    if (!GCP_JSON) throw new Error('Missing GCP_SERVICE_ACCOUNT_JSON');

    // Pre-flight validation so we fail with a clear message if a secret is malformed.
    validateLibsqlUrl('TURSO_DATABASE_URL', TURSO_URL);
    validateLibsqlUrl('IMDB_DB_URL', IMDB_URL);
    log('secret', `TURSO_AUTH_TOKEN: len=${TURSO_TOKEN.length}`);
    log('secret', `IMDB_DB_TOKEN: len=${IMDB_TOKEN.length}`);
    log('secret', `GCP_SERVICE_ACCOUNT_JSON: len=${GCP_JSON.length}`);

    const mainDb = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const imdbDb = createClient({ url: IMDB_URL, authToken: IMDB_TOKEN });

    const heroBlockedIds = await loadHeroBlockedIds(mainDb);
    const noirIds = await loadNoirHistoricalIds(mainDb);
    const heroExamples = await loadHeroExamples(mainDb);

    const excludedRaw = readJsonSafe(join(ROOT, 'data', 'spotlight-manual-excluded.json'), { movie: [], tv: [] });
    const pinnedRaw = readJsonSafe(join(ROOT, 'data', 'spotlight-manual-pinned.json'), { movie: [], tv: [] });
    const excludedMovies = new Set(excludedRaw.movie || []);
    const excludedTv = new Set(excludedRaw.tv || []);
    const pinnedMovies = pinnedRaw.movie || [];
    const pinnedTv = pinnedRaw.tv || [];

    // Phase 1 — run the cheap, deterministic pipeline for both media types in
    // parallel (fetch → hard filter → IMDb gate → score → diversity cap).
    // Now includes noir_historical cross-referencing for score boosts.
    const [afterDiversityMovies, afterDiversityTv] = await Promise.all([
        curateUpToGemini('movie', heroBlockedIds, excludedMovies, imdbDb, noirIds),
        curateUpToGemini('tv', heroBlockedIds, excludedTv, imdbDb, noirIds),
    ]);

    // Phase 2 — ONE Gemini call for both lists at once.
    // Passes hero_selections examples so Gemini learns Cinemagoria's taste.
    const { movies: afterGeminiMovies, tv: afterGeminiTv } =
        await geminiCurateBoth(afterDiversityMovies, afterDiversityTv, heroExamples);

    // Phase 3 — enrichment + manual pins, in parallel again.
    const [movies, tv] = await Promise.all([
        finishCurate('movie', afterGeminiMovies, pinnedMovies, heroBlockedIds, imdbDb),
        finishCurate('tv', afterGeminiTv, pinnedTv, heroBlockedIds, imdbDb),
    ]);

    const outDir = join(ROOT, 'public', 'data');
    mkdirSync(outDir, { recursive: true });

    const payloadMovie = {
        generated_at: new Date().toISOString(),
        engine_version: '2.0.0',
        media_type: 'movie',
        count: movies.length,
        results: movies,
    };
    const payloadTv = {
        generated_at: new Date().toISOString(),
        engine_version: '2.0.0',
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
