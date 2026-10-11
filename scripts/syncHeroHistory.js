// Keeps public/data/hero-history.json (the Ledger) in step with hero-enrichment.json:
// a title that shows up in the hero opens a stay dated today, one that leaves closes it.
// Only titles it has never seen hit TMDB (title, year, directors, fallback backdrop).
// Keys listed in LEDGER_SKIP ("movie:123,tv:456", or "none") are left out of the file. The
// variable is required: without it the file is left untouched.
//   node scripts/syncHeroHistory.js                          daily, after syncHeroData.js
//   node scripts/syncHeroHistory.js --seed <hero-history.json>  rebuild from the curation ledger
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data');
const outPath = join(dataDir, 'hero-history.json');
const apiKey = (process.env.TMDB_API_KEY || process.env.API_KEY || '').trim();
const today = new Date().toISOString().slice(0, 10);
const key = (r) => `${r.media_type}:${r.tmdb_id}`;

const skipEnv = (process.env.LEDGER_SKIP || '').trim();
const skip = new Set(skipEnv === 'none' ? [] : skipEnv.split(',').map((k) => k.trim()).filter(Boolean));
if (!skipEnv || [...skip].some((k) => !/^(movie|tv):\d+$/.test(k))) {
    // Never echo the value: workflow logs are public.
    console.error('::error::LEDGER_SKIP is missing or malformed ("none" when empty); hero-history.json was left untouched');
    process.exit(1);
}

const seedAt = process.argv.indexOf('--seed');
let rows = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : [];
if (seedAt > -1) {
    const ledger = JSON.parse(readFileSync(process.argv[seedAt + 1], 'utf8'));
    rows = ledger.stays.map((s) => ({
        tmdb_id: s.tmdb_id,
        media_type: s.media_type,
        entered: s.entered,
        exited: s.exited,
        backdrop_path: s.assets?.filter((a) => a.field === 'backdrop_path' && a.value).at(-1)?.value || null,
    }));
}

rows = rows.filter((r) => !skip.has(key(r)));

const live = new Map(JSON.parse(readFileSync(join(dataDir, 'hero-enrichment.json'), 'utf8')).filter((r) => !skip.has(key(r))).map((r) => [key(r), r]));
const open = new Map(rows.filter((r) => !r.exited).map((r) => [key(r), r]));
for (const [k, row] of open) {
    if (!live.has(k)) row.exited = today;
    else if (live.get(k).backdrop_path) row.backdrop_path = live.get(k).backdrop_path;
}
for (const [k, r] of live) {
    if (!open.has(k)) rows.push({ tmdb_id: r.tmdb_id, media_type: r.media_type, entered: today, exited: null, backdrop_path: r.backdrop_path || null });
}

const tmdb = async (type, id, language) => {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=${language}${type === 'movie' ? '&append_to_response=credits' : ''}`);
    if (res.status === 404) gone.add(`${type}:${id}`);
    if (!res.ok) throw new Error(`TMDB ${res.status} for ${type}/${id}`);
    return res.json();
};

// A title TMDB no longer has can't have a ficha to link to, so it leaves the Ledger.
const gone = new Set();
const known = new Map(rows.filter((r) => r.title).map((r) => [key(r), r]));
for (const row of rows) {
    if (row.title) continue;
    let meta = known.get(key(row));
    if (!meta && apiKey) {
        try {
            const [en, es] = await Promise.all([tmdb(row.media_type, row.tmdb_id, 'en-US'), tmdb(row.media_type, row.tmdb_id, 'es-ES')]);
            const people = row.media_type === 'movie' ? (en.credits?.crew || []).filter((c) => c.job === 'Director') : en.created_by || [];
            meta = {
                title: en.title || en.name || null,
                // With no Spanish translation TMDB answers es-ES with the original-language title
                // (Thai, Japanese...); keep only a real translation, the modal falls back to English.
                title_es: es.original_language === 'es' || (es.title || es.name) !== (es.original_title || es.original_name) ? es.title || es.name || null : null,
                year: (en.release_date || en.first_air_date || '').slice(0, 4) || null,
                directors: people.slice(0, 2).map((p) => ({ id: p.id, name: p.name })),
                tmdb_backdrop: en.backdrop_path || null,
            };
            known.set(key(row), { ...row, ...meta });
        } catch (e) {
            console.warn(e.message);
        }
    }
    if (meta) Object.assign(row, { title: meta.title, title_es: meta.title_es, year: meta.year, directors: meta.directors, tmdb_backdrop: meta.tmdb_backdrop });
}

rows = rows.filter((r) => !gone.has(key(r)));
rows.sort((a, b) => b.entered.localeCompare(a.entered) || (a.title || '').localeCompare(b.title || '', 'en'));
const ordered = rows.map((r) => ({
    tmdb_id: r.tmdb_id,
    media_type: r.media_type,
    title: r.title || null,
    title_es: r.title_es && r.title_es !== r.title ? r.title_es : null,
    year: r.year || null,
    directors: r.directors || [],
    entered: r.entered,
    exited: r.exited || null,
    backdrop_path: r.backdrop_path || null,
    tmdb_backdrop: r.tmdb_backdrop || null,
}));
writeFileSync(outPath, `[\n${ordered.map((r) => JSON.stringify(r)).join(',\n')}\n]\n`);

const missing = ordered.filter((r) => !r.title).length;
console.log(`hero-history.json: ${ordered.length} stays, ${open.size} were open`);
// A stay without a title is not shown by the modal; it is retried on the next run.
if (missing) console.log(`::warning::${missing} Ledger stay(s) have no TMDB metadata${apiKey ? '' : ' (no API_KEY / TMDB_API_KEY set)'}`);
