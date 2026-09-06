import { SUPPORTED_PRODUCTION_COMPANIES, STREAMING_PROVIDERS, SUPPORTED_FESTIVALS } from '~/utils/constants';
import { resolveTvTrailer } from '~/utils/tvTrailer';

const axios = {
    get: async (url, config = {}) => {
        try {
            const response = await $fetch(url, {
                method: 'GET',
                params: config.params,
                headers: config.headers,
                timeout: config.timeout,
                ignoreResponseError: true
            });
            return { data: response, status: 200, statusText: 'OK' };
        } catch (error) {
            throw {
                response: {
                    data: error.data,
                    status: error.statusCode || 500,
                    statusText: error.statusMessage || 'Error'
                },
                message: error.message
            };
        }
    },
    post: async (url, data, config = {}) => {
        const response = await $fetch(url, {
            method: 'POST',
            body: data,
            ...config
        });
        return { data: response };
    },
    delete: async (url, config = {}) => {
        const response = await $fetch(url, {
            method: 'DELETE',
            params: config.params,
            ...config
        });
        return { data: response };
    }
};

const getEnv = (key) => {
    try {
        const config = useRuntimeConfig().public;
        const mapping = {
            'API_KEY': config.apiKey,
            'API_LANG': config.apiLang,
            'TRAKT_CLIENT_ID': config.traktClientId,
            'API_YOUTUBE_KEY': config.apiYoutubeKey,
            'MDBLIST_API': useRuntimeConfig().public.mdblistApi || process.env.MDBLIST_API,
            'rapidApiKey': config.rapidApiKey,
            'orApiKey': config.orApiKey,
            'geminiApiKey': config.geminiApiKey,
            'geminiApiKey2': config.geminiApiKey2,
            'geminiApiKey3': config.geminiApiKey3,
            'geminiApiKey4': config.geminiApiKey4,
            'geminiApiKey5': config.geminiApiKey5,
            'geminiApiKey6': config.geminiApiKey6,
        };
        return mapping[key] || process.env[key];
    } catch (e) {
        return process.env[key];
    }
};


const apiUrl = 'https://api.themoviedb.org/3';
export const apiImgUrl = 'https://image.tmdb.org/t/p';
// ─── Listas de exclusión curadas ─────────────────────────────────────────
// Añadí IDs de TMDB acá para excluir títulos específicos de los carouseles
// de Popular Movies / Popular TV en la homepage (y cualquier otra
// invocación de getTrending).
// Blacklist para getTrending / discover / listados por compañía. Los carouseles
// Spotlight del homepage NO usan esto — consumen /api/spotlight/{movies,tv}
// que lee tablas Turso curadas por el motor Phase-2 en
// cinemagoria-candidates-selections (ver SPOTLIGHT.md).
export const EXCLUDED_MOVIE_IDS = [969681, 931285, 1273221, 1265609, 696393, 1523145, 1641319, 1307373, 1444249, 1416391, 840464, 936075, 1623125, 1239134, 1108427, 1446616, 980431, 1084577, 83533, 1226863, 1613798, 1049471, 1327819, 1297842, 1084242, 1236153, 1659087, 1290821, 1472951, 1234731, 1493859, 1290417, 1511057, 1383731, 1414413, 1159559, 1204680, 1084244, 1658464, 1301421, 1400336, 1674749];
export const EXCLUDED_TV_IDS = [269161, 289219, 318880, 316973, 316544, 259819, 300131, 312474, 276880, 281010, 314784, 297557, 260463, 258865, 196950, 295357, 301507, 289424, 295778, 279471, 287011, 278573, 274671, 278275, 224263, 292121, 293697, 315595];


// Detect non-Latin script titles (Hindi, Korean, Japanese, Arabic, Chinese, Thai, etc.)
// Returns true if the title contains characters outside Latin/common punctuation ranges
function _hasNonLatinScript(text) {
    if (!text) return false;
    // Allow: Latin, Latin Extended, spaces, digits, common punctuation
    return /[^\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F\u2100-\u214F\d\s.,!?:;'"()\-–—/&@#$%+='"""''…·•½¼¾°ºª×÷]/.test(text);
}

// Check if any credit person carries a non-Latin name. Only sample the top
// of each list — full crews can hit dozens of names and the heuristic only
// needs to know whether to spend one extra TMDB call on the en-US fallback.
function _hasNonLatinScriptInCredits(credits) {
    if (!credits) return false;
    const sample = [
        ...((credits.cast || []).slice(0, 12)),
        ...((credits.crew || []).slice(0, 24)),
    ];
    return sample.some(p => p && p.name && _hasNonLatinScript(p.name));
}

// Merge en-US person names into the es-ES credits payload by `person.id`.
// Only replaces names that are non-Latin in `esCredits` with their Latin
// counterpart from `enCredits`. Mutates `esCredits` in place — names that
// already render in a Latin script stay untouched.
function _replaceCreditsWithEnFallback(esCredits, enCredits) {
    if (!esCredits || !enCredits) return;
    const byId = new Map();
    for (const list of [enCredits.cast || [], enCredits.crew || []]) {
        for (const p of list) {
            if (p && p.id && p.name && !_hasNonLatinScript(p.name)) {
                byId.set(p.id, p.name);
            }
        }
    }
    if (byId.size === 0) return;
    for (const list of [esCredits.cast || [], esCredits.crew || []]) {
        for (const p of list) {
            if (p && p.id && p.name && _hasNonLatinScript(p.name)) {
                const enName = byId.get(p.id);
                if (enName) p.name = enName;
            }
        }
    }
}

// Fetch English title fallback for a movie or TV show with non-Latin title
async function _fetchEnglishTitleFallback(id, mediaType) {
    try {
        const res = await axios.get(`${apiUrl}/${mediaType}/${id}`, {
            params: { api_key: getEnv('API_KEY'), language: 'en-US' }
        });
        return mediaType === 'movie' ? res.data.title : res.data.name;
    } catch { return null; }
}

// Fix non-Latin titles in list items
// Step 1 (sync): try original_title/original_name fallback (0 API calls)
// Step 2 (async): if still non-Latin, fetch en-US title (1 API call per item that needs it)
function _fixNonLatinTitleInList(item, mediaType) {
    const titleField = (mediaType === 'movie' || item.title) ? 'title' : null;
    const nameField = (mediaType === 'tv' || item.name) ? 'name' : null;

    if (titleField && _hasNonLatinScript(item[titleField])) {
        if (item.original_title && !_hasNonLatinScript(item.original_title)) {
            item[titleField] = item.original_title;
        } else {
            item._needsEnTitleFetch = true;
        }
    }
    if (nameField && _hasNonLatinScript(item[nameField])) {
        if (item.original_name && !_hasNonLatinScript(item.original_name)) {
            item[nameField] = item.original_name;
        } else {
            item._needsEnTitleFetch = true;
        }
    }
}

// Batch-fix remaining non-Latin titles that need en-US fetch
async function _fixNonLatinTitlesAsync(items, mediaType) {
    const needsFetch = items.filter(i => i._needsEnTitleFetch);
    if (needsFetch.length === 0) return;

    await Promise.all(needsFetch.map(async (item) => {
        const type = item.media_type || mediaType;
        const enTitle = await _fetchEnglishTitleFallback(item.id, type);
        if (enTitle && !_hasNonLatinScript(enTitle)) {
            if (type === 'movie') item.title = enTitle;
            else item.name = enTitle;
        }
        delete item._needsEnTitleFetch;
    }));
}


let _heroEnrichmentPromise = null;
let _noirEnrichmentPromise = null;
let _customEnrichmentPromise = null;

function _buildEnrichmentMap(data) {
    const map = new Map();
    for (const item of data) {
        if (item.media_type) {
            map.set(`${item.tmdb_id}-${item.media_type}`, item);
        }
        if (!map.has(item.tmdb_id)) {
            map.set(item.tmdb_id, item);
        }
    }
    return map;
}

export async function getHeroEnrichment() {
    if (!_heroEnrichmentPromise) {
        _heroEnrichmentPromise = fetch('/data/hero-enrichment.json')
            .then(res => res.ok ? res.json() : [])
            .then(_buildEnrichmentMap)
            .catch(() => new Map());
    }
    return _heroEnrichmentPromise;
}

export async function getNoirEnrichment() {
    if (!_noirEnrichmentPromise) {
        _noirEnrichmentPromise = fetch('/data/noir-enrichment.json')
            .then(res => res.ok ? res.json() : [])
            .then(_buildEnrichmentMap)
            .catch(() => new Map());
    }
    return _noirEnrichmentPromise;
}

export async function getCustomEnrichment() {
    if (!_customEnrichmentPromise) {
        _customEnrichmentPromise = fetch('/data/custom-enrichment.json')
            .then(res => res.ok ? res.json() : [])
            .then(_buildEnrichmentMap)
            .catch(() => new Map());
    }
    return _customEnrichmentPromise;
}

/**
 * Resuelve la URL del poster siguiendo la jerarquía estándar (igual que el
 * mixin `poster` de Details.js). Ver cinemagoria-main/utils/api.js para docs completas.
 */
export async function resolveItemPoster({ id, media_type, posterSnapshot = null }) {
    if (id == null) return posterSnapshot || null;

    const [custom, hero, noir] = await Promise.all([
        getCustomEnrichment(),
        getHeroEnrichment(),
        getNoirEnrichment(),
    ]);

    const key = media_type ? `${id}-${media_type}` : null;
    const lookup = (map) => (key && map.get(key)) || map.get(id) || null;

    const c = lookup(custom);
    const h = lookup(hero);
    const n = lookup(noir);

    const fmt = (p) => {
        if (!p) return null;
        if (p.startsWith('http')) return p;
        return `${apiImgUrl}/w500${p}`;
    };

    if (c?.poster_path && c.force_enrichment !== false) return c.poster_path;
    if (h?.poster_path && h.force_enrichment) return fmt(h.poster_path);
    if (n?.poster_path && n.force_enrichment) return fmt(n.poster_path);

    if (posterSnapshot) return fmt(posterSnapshot);

    if (c?.poster_path) return c.poster_path;
    if (h?.poster_path) return fmt(h.poster_path);
    if (n?.poster_path) return fmt(n.poster_path);

    return null;
}


const traktApiUrl = 'https://api.trakt.tv';

const lists = {
    movie: [
        { title: 'Películas en Tendencia', query: 'trending' },
        { title: 'Películas Populares', query: 'popular' },
        { title: 'Películas Mejor Valoradas', query: 'top_rated' },
        { title: 'Próximas Películas', query: 'upcoming' },
        { title: 'Películas en Cartelera', query: 'now_playing' },
    ],
    tv: [
        { title: 'Series de TV en Tendencia', query: 'trending' },
        { title: 'Series de TV Populares', query: 'popular' },
        { title: 'Series de TV Mejor Valoradas', query: 'top_rated' },
        { title: 'Series de TV en Emisión Actualmente', query: 'on_the_air' },
        { title: 'Series de TV que se Emiten Hoy', query: 'airing_today' },
    ],
};

export const languages = [
    { 'iso_639_1': 'xx', 'english_name': 'No Language' },
    { 'iso_639_1': 'aa', 'english_name': 'Afar' },
    { 'iso_639_1': 'af', 'english_name': 'Afrikaans' },
    { 'iso_639_1': 'ak', 'english_name': 'Akan' },
    { 'iso_639_1': 'an', 'english_name': 'Aragonese' },
    { 'iso_639_1': 'as', 'english_name': 'Assamese' },
    { 'iso_639_1': 'av', 'english_name': 'Avaric' },
    { 'iso_639_1': 'ae', 'english_name': 'Avestan' },
    { 'iso_639_1': 'ay', 'english_name': 'Aymara' },
    { 'iso_639_1': 'az', 'english_name': 'Azerbaijani' },
    { 'iso_639_1': 'ba', 'english_name': 'Bashkir' },
    { 'iso_639_1': 'bm', 'english_name': 'Bambara' },
    { 'iso_639_1': 'bi', 'english_name': 'Bislama' },
    { 'iso_639_1': 'bo', 'english_name': 'Tibetan' },
    { 'iso_639_1': 'br', 'english_name': 'Breton' },
    { 'iso_639_1': 'ca', 'english_name': 'Catalan' },
    { 'iso_639_1': 'cs', 'english_name': 'Czech' },
    { 'iso_639_1': 'ce', 'english_name': 'Chechen' },
    { 'iso_639_1': 'cu', 'english_name': 'Slavic' },
    { 'iso_639_1': 'cv', 'english_name': 'Chuvash' },
    { 'iso_639_1': 'kw', 'english_name': 'Cornish' },
    { 'iso_639_1': 'co', 'english_name': 'Corsican' },
    { 'iso_639_1': 'cr', 'english_name': 'Cree' },
    { 'iso_639_1': 'cy', 'english_name': 'Welsh' },
    { 'iso_639_1': 'da', 'english_name': 'Danish' },
    { 'iso_639_1': 'de', 'english_name': 'German' },
    { 'iso_639_1': 'dv', 'english_name': 'Divehi' },
    { 'iso_639_1': 'dz', 'english_name': 'Dzongkha' },
    { 'iso_639_1': 'eo', 'english_name': 'Esperanto' },
    { 'iso_639_1': 'et', 'english_name': 'Estonian' },
    { 'iso_639_1': 'eu', 'english_name': 'Basque' },
    { 'iso_639_1': 'fo', 'english_name': 'Faroese' },
    { 'iso_639_1': 'fj', 'english_name': 'Fijian' },
    { 'iso_639_1': 'fi', 'english_name': 'Finnish' },
    { 'iso_639_1': 'fr', 'english_name': 'French' },
    { 'iso_639_1': 'fy', 'english_name': 'Frisian' },
    { 'iso_639_1': 'ff', 'english_name': 'Fulah' },
    { 'iso_639_1': 'gd', 'english_name': 'Gaelic' },
    { 'iso_639_1': 'ga', 'english_name': 'Irish' },
    { 'iso_639_1': 'gl', 'english_name': 'Galician' },
    { 'iso_639_1': 'gv', 'english_name': 'Manx' },
    { 'iso_639_1': 'gn', 'english_name': 'Guarani' },
    { 'iso_639_1': 'gu', 'english_name': 'Gujarati' },
    { 'iso_639_1': 'ht', 'english_name': 'Haitian; Haitian Creole' },
    { 'iso_639_1': 'ha', 'english_name': 'Hausa' },
    { 'iso_639_1': 'sh', 'english_name': 'Serbo-Croatian' },
    { 'iso_639_1': 'hz', 'english_name': 'Herero' },
    { 'iso_639_1': 'ho', 'english_name': 'Hiri Motu' },
    { 'iso_639_1': 'hr', 'english_name': 'Croatian' },
    { 'iso_639_1': 'hu', 'english_name': 'Hungarian' },
    { 'iso_639_1': 'ig', 'english_name': 'Igbo' },
    { 'iso_639_1': 'io', 'english_name': 'Ido' },
    { 'iso_639_1': 'ii', 'english_name': 'Yi' },
    { 'iso_639_1': 'iu', 'english_name': 'Inuktitut' },
    { 'iso_639_1': 'ie', 'english_name': 'Interlingue' },
    { 'iso_639_1': 'ia', 'english_name': 'Interlingua' },
    { 'iso_639_1': 'id', 'english_name': 'Indonesian' },
    { 'iso_639_1': 'ik', 'english_name': 'Inupiaq' },
    { 'iso_639_1': 'is', 'english_name': 'Icelandic' },
    { 'iso_639_1': 'it', 'english_name': 'Italian' },
    { 'iso_639_1': 'jv', 'english_name': 'Javanese' },
    { 'iso_639_1': 'ja', 'english_name': 'Japanese' },
    { 'iso_639_1': 'kl', 'english_name': 'Kalaallisut' },
    { 'iso_639_1': 'kn', 'english_name': 'Kannada' },
    { 'iso_639_1': 'ks', 'english_name': 'Kashmiri' },
    { 'iso_639_1': 'kr', 'english_name': 'Kanuri' },
    { 'iso_639_1': 'kk', 'english_name': 'Kazakh' },
    { 'iso_639_1': 'km', 'english_name': 'Khmer' },
    { 'iso_639_1': 'ki', 'english_name': 'Kikuyu' },
    { 'iso_639_1': 'rw', 'english_name': 'Kinyarwanda' },
    { 'iso_639_1': 'ky', 'english_name': 'Kirghiz' },
    { 'iso_639_1': 'kv', 'english_name': 'Komi' },
    { 'iso_639_1': 'kg', 'english_name': 'Kongo' },
    { 'iso_639_1': 'ko', 'english_name': 'Korean' },
    { 'iso_639_1': 'kj', 'english_name': 'Kuanyama' },
    { 'iso_639_1': 'ku', 'english_name': 'Kurdish' },
    { 'iso_639_1': 'lo', 'english_name': 'Lao' },
    { 'iso_639_1': 'la', 'english_name': 'Latin' },
    { 'iso_639_1': 'lv', 'english_name': 'Latvian' },
    { 'iso_639_1': 'li', 'english_name': 'Limburgish' },
    { 'iso_639_1': 'ln', 'english_name': 'Lingala' },
    { 'iso_639_1': 'lt', 'english_name': 'Lithuanian' },
    { 'iso_639_1': 'lb', 'english_name': 'Letzeburgesch' },
    { 'iso_639_1': 'lu', 'english_name': 'Luba-Katanga' },
    { 'iso_639_1': 'lg', 'english_name': 'Ganda' },
    { 'iso_639_1': 'mh', 'english_name': 'Marshall' },
    { 'iso_639_1': 'ml', 'english_name': 'Malayalam' },
    { 'iso_639_1': 'mr', 'english_name': 'Marathi' },
    { 'iso_639_1': 'mg', 'english_name': 'Malagasy' },
    { 'iso_639_1': 'mt', 'english_name': 'Maltese' },
    { 'iso_639_1': 'mo', 'english_name': 'Moldavian' },
    { 'iso_639_1': 'mn', 'english_name': 'Mongolian' },
    { 'iso_639_1': 'mi', 'english_name': 'Maori' },
    { 'iso_639_1': 'ms', 'english_name': 'Malay' },
    { 'iso_639_1': 'my', 'english_name': 'Burmese' },
    { 'iso_639_1': 'na', 'english_name': 'Nauru' },
    { 'iso_639_1': 'nv', 'english_name': 'Navajo' },
    { 'iso_639_1': 'nr', 'english_name': 'Ndebele' },
    { 'iso_639_1': 'nd', 'english_name': 'Ndebele' },
    { 'iso_639_1': 'ng', 'english_name': 'Ndonga' },
    { 'iso_639_1': 'ne', 'english_name': 'Nepali' },
    { 'iso_639_1': 'nl', 'english_name': 'Dutch' },
    { 'iso_639_1': 'nn', 'english_name': 'Norwegian Nynorsk' },
    { 'iso_639_1': 'nb', 'english_name': 'Norwegian Bokmål' },
    { 'iso_639_1': 'no', 'english_name': 'Norwegian' },
    { 'iso_639_1': 'ny', 'english_name': 'Chichewa; Nyanja' },
    { 'iso_639_1': 'oc', 'english_name': 'Occitan' },
    { 'iso_639_1': 'oj', 'english_name': 'Ojibwa' },
    { 'iso_639_1': 'or', 'english_name': 'Oriya' },
    { 'iso_639_1': 'om', 'english_name': 'Oromo' },
    { 'iso_639_1': 'os', 'english_name': 'Ossetian; Ossetic' },
    { 'iso_639_1': 'pi', 'english_name': 'Pali' },
    { 'iso_639_1': 'pl', 'english_name': 'Polish' },
    { 'iso_639_1': 'pt', 'english_name': 'Portuguese' },
    { 'iso_639_1': 'qu', 'english_name': 'Quechua' },
    { 'iso_639_1': 'rm', 'english_name': 'Raeto-Romance' },
    { 'iso_639_1': 'ro', 'english_name': 'Romanian' },
    { 'iso_639_1': 'rn', 'english_name': 'Rundi' },
    { 'iso_639_1': 'ru', 'english_name': 'Russian' },
    { 'iso_639_1': 'sg', 'english_name': 'Sango' },
    { 'iso_639_1': 'sa', 'english_name': 'Sanskrit' },
    { 'iso_639_1': 'si', 'english_name': 'Sinhalese' },
    { 'iso_639_1': 'sk', 'english_name': 'Slovak' },
    { 'iso_639_1': 'sl', 'english_name': 'Slovenian' },
    { 'iso_639_1': 'se', 'english_name': 'Northern Sami' },
    { 'iso_639_1': 'sm', 'english_name': 'Samoan' },
    { 'iso_639_1': 'sn', 'english_name': 'Shona' },
    { 'iso_639_1': 'sd', 'english_name': 'Sindhi' },
    { 'iso_639_1': 'so', 'english_name': 'Somali' },
    { 'iso_639_1': 'st', 'english_name': 'Sotho' },
    { 'iso_639_1': 'es', 'english_name': 'Spanish' },
    { 'iso_639_1': 'sq', 'english_name': 'Albanian' },
    { 'iso_639_1': 'sc', 'english_name': 'Sardinian' },
    { 'iso_639_1': 'sr', 'english_name': 'Serbian' },
    { 'iso_639_1': 'ss', 'english_name': 'Swati' },
    { 'iso_639_1': 'su', 'english_name': 'Sundanese' },
    { 'iso_639_1': 'sw', 'english_name': 'Swahili' },
    { 'iso_639_1': 'sv', 'english_name': 'Swedish' },
    { 'iso_639_1': 'ty', 'english_name': 'Tahitian' },
    { 'iso_639_1': 'ta', 'english_name': 'Tamil' },
    { 'iso_639_1': 'tt', 'english_name': 'Tatar' },
    { 'iso_639_1': 'te', 'english_name': 'Telugu' },
    { 'iso_639_1': 'tg', 'english_name': 'Tajik' },
    { 'iso_639_1': 'tl', 'english_name': 'Tagalog' },
    { 'iso_639_1': 'th', 'english_name': 'Thai' },
    { 'iso_639_1': 'ti', 'english_name': 'Tigrinya' },
    { 'iso_639_1': 'to', 'english_name': 'Tonga' },
    { 'iso_639_1': 'tn', 'english_name': 'Tswana' },
    { 'iso_639_1': 'ts', 'english_name': 'Tsonga' },
    { 'iso_639_1': 'tk', 'english_name': 'Turkmen' },
    { 'iso_639_1': 'tr', 'english_name': 'Turkish' },
    { 'iso_639_1': 'tw', 'english_name': 'Twi' },
    { 'iso_639_1': 'ug', 'english_name': 'Uighur' },
    { 'iso_639_1': 'uk', 'english_name': 'Ukrainian' },
    { 'iso_639_1': 'ur', 'english_name': 'Urdu' },
    { 'iso_639_1': 'uz', 'english_name': 'Uzbek' },
    { 'iso_639_1': 've', 'english_name': 'Venda' },
    { 'iso_639_1': 'vi', 'english_name': 'Vietnamese' },
    { 'iso_639_1': 'vo', 'english_name': 'Volapük' },
    { 'iso_639_1': 'wa', 'english_name': 'Walloon' },
    { 'iso_639_1': 'wo', 'english_name': 'Wolof' },
    { 'iso_639_1': 'xh', 'english_name': 'Xhosa' },
    { 'iso_639_1': 'yi', 'english_name': 'Yiddish' },
    { 'iso_639_1': 'za', 'english_name': 'Zhuang' },
    { 'iso_639_1': 'zu', 'english_name': 'Zulu' },
    { 'iso_639_1': 'ab', 'english_name': 'Abkhazian' },
    { 'iso_639_1': 'zh', 'english_name': 'Mandarin' },
    { 'iso_639_1': 'ps', 'english_name': 'Pushto' },
    { 'iso_639_1': 'am', 'english_name': 'Amharic' },
    { 'iso_639_1': 'ar', 'english_name': 'Arabic' },
    { 'iso_639_1': 'bg', 'english_name': 'Bulgarian' },
    { 'iso_639_1': 'cn', 'english_name': 'Cantonese' },
    { 'iso_639_1': 'mk', 'english_name': 'Macedonian' },
    { 'iso_639_1': 'el', 'english_name': 'Greek' },
    { 'iso_639_1': 'fa', 'english_name': 'Persian' },
    { 'iso_639_1': 'he', 'english_name': 'Hebrew' },
    { 'iso_639_1': 'hi', 'english_name': 'Hindi' },
    { 'iso_639_1': 'hy', 'english_name': 'Armenian' },
    { 'iso_639_1': 'en', 'english_name': 'English' },
    { 'iso_639_1': 'ee', 'english_name': 'Ewe' },
    { 'iso_639_1': 'ka', 'english_name': 'Georgian' },
    { 'iso_639_1': 'pa', 'english_name': 'Punjabi' },
    { 'iso_639_1': 'bn', 'english_name': 'Bengali' },
    { 'iso_639_1': 'bs', 'english_name': 'Bosnian' },
    { 'iso_639_1': 'ch', 'english_name': 'Chamorro' },
    { 'iso_639_1': 'be', 'english_name': 'Belarusian' },
    { 'iso_639_1': 'yo', 'english_name': 'Yoruba' },
];

export function getListItem(type, query) {
    if (type === 'movie') {
        return lists.movie.find(list => list.query === query);
    } else if (type === 'tv') {
        return lists.tv.find(list => list.query === query);
    }
};

const IMDB_BATCH_SIZE = 60;
const IMDB_BATCH_WINDOW_MS = 24;
const IMDB_BATCH_TIMEOUT_MS = 8000;

const imdbPending = new Map();
let imdbFlushTimer = null;

const settleImdbSlice = (slice, ratings) => {
    slice.forEach(([id, resolvers]) => {
        const hit = ratings && ratings[id];
        resolvers.forEach((resolve) => resolve(hit || { found: false, source: 'tmdb' }));
    });
};

const flushImdbPending = () => {
    imdbFlushTimer = null;
    const queued = [...imdbPending.entries()];
    imdbPending.clear();
    if (!queued.length) return;

    for (let i = 0; i < queued.length; i += IMDB_BATCH_SIZE) {
        const slice = queued.slice(i, i + IMDB_BATCH_SIZE);
        axios
            .get('/api/imdb-ratings', {
                params: { ids: slice.map(([id]) => id).join(',') },
                timeout: IMDB_BATCH_TIMEOUT_MS,
            })
            .then((response) => settleImdbSlice(slice, (response.data && response.data.ratings) || {}))
            .catch(() => settleImdbSlice(slice, {}));
    }
};

export function getIMDbRatingFromDB(imdbId) {
    if (!imdbId) return Promise.resolve({ found: false, source: 'tmdb' });

    return new Promise((resolve) => {
        const waiting = imdbPending.get(imdbId);
        if (waiting) {
            waiting.push(resolve);
        } else {
            imdbPending.set(imdbId, [resolve]);
        }

        if (!imdbFlushTimer) imdbFlushTimer = setTimeout(flushImdbPending, IMDB_BATCH_WINDOW_MS);
    });
}

async function enrichWithIMDbRating(item) {
    if (!item.imdb_id && !item.external_ids?.imdb_id) {
        item.rating_source = 'tmdb';
        return item;
    }

    const imdbId = item.imdb_id || item.external_ids?.imdb_id;

    try {
        const imdbData = await getIMDbRatingFromDB(imdbId);
        if (imdbData.found) {
            item.imdb_rating = imdbData.score;
            item.imdb_votes = imdbData.votes;
            item.rating_source = 'imdb';
        } else {
            item.rating_source = 'tmdb';
        }
    } catch (error) {
        console.error("Error enriching with IMDb rating:", error);
        item.rating_source = 'tmdb';
    }

    return item;
}

export function getMovies(query, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${query}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'movie');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'movie');
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getMovie(id) {
    return new Promise((resolve, reject) => {
        // Capture runtime-config values SYNC, before any await crosses the
        // Nuxt async-context boundary. `useRuntimeConfig()` (called via
        // `getEnv`) only resolves the public config when the request's
        // async-local-storage context is alive — after `Promise.all` + `await`
        // we land in a microtask that has lost that context in production
        // builds, and a follow-up `getEnv('API_KEY')` returns `undefined`,
        // which silently breaks the en-US fallback (TMDB returns
        // "Invalid API key" but axios resolves with status 200, so the
        // `catch` never fires). Capturing once keeps the same key alive for
        // the whole promise chain.
        const apiKey = getEnv('API_KEY');
        const apiLang = getEnv('API_LANG');

        const mainRequest = axios.get(`${apiUrl}/movie/${id}`, {
            params: {
                api_key: apiKey,
                language: apiLang,
                append_to_response: 'videos,credits,images,external_ids,release_dates',
                include_image_language: 'es,en,null',
            },
        });

        const extraVideosRequest = axios.get(`${apiUrl}/movie/${id}/videos`, {
            params: {
                api_key: apiKey,
                language: 'en-US'
            }
        }).catch(() => ({ data: { results: [] } }));

        Promise.all([mainRequest, extraVideosRequest]).then(async ([response, videoResponse]) => {
            const responseData = response.data;

            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'Movie not found'));
                return;
            }

            if (apiLang !== 'en-US') {
                const needsOverviewFallback = !responseData.overview;
                const needsTitleFallback = _hasNonLatinScript(responseData.title);
                const needsCreditsFallback = _hasNonLatinScriptInCredits(responseData.credits);

                if (needsOverviewFallback || needsTitleFallback || needsCreditsFallback) {
                    try {
                        const fallbackResponse = await axios.get(`${apiUrl}/movie/${id}`, {
                            params: {
                                api_key: apiKey,
                                language: 'en-US',
                                append_to_response: 'credits',
                            },
                        });
                        if (needsOverviewFallback && fallbackResponse.data.overview) {
                            responseData.overview = fallbackResponse.data.overview;
                            responseData.original_overview_language = 'en';
                        }
                        if (needsTitleFallback && fallbackResponse.data.title && !_hasNonLatinScript(fallbackResponse.data.title)) {
                            responseData.title = fallbackResponse.data.title;
                        }
                        if (needsCreditsFallback && fallbackResponse.data.credits) {
                            _replaceCreditsWithEnFallback(responseData.credits, fallbackResponse.data.credits);
                        }
                    } catch (e) {
                        console.warn('Failed to fetch en-US fallback', e);
                    }
                }
            }

            if (videoResponse.data && videoResponse.data.results) {
                const currentIds = new Set((responseData.videos.results || []).map(v => v.id));
                const newVideos = videoResponse.data.results.filter(v => !currentIds.has(v.id));
                responseData.videos = {
                    ...responseData.videos,
                    results: [...(responseData.videos.results || []), ...newVideos]
                };
            }

            const sortImages = (imgs) => {
                if (!imgs) return [];
                return imgs.sort((a, b) => {
                    const score = (lang) => (lang === 'es' || lang === 'es-ES') ? 2 : (lang === null ? 1 : 0);
                    return score(b.iso_639_1) - score(a.iso_639_1);
                });
            };

            if (responseData.images) {
                if (responseData.images.backdrops) responseData.images.backdrops = sortImages(responseData.images.backdrops);
                if (responseData.images.posters) responseData.images.posters = sortImages(responseData.images.posters);
            }
            const [providersResult, reviewsResult] = await Promise.allSettled([
                getMovieProviders(id),
                getMovieReviews(id)
            ]);

            if (providersResult.status === 'fulfilled') {
                responseData.providers = providersResult.value;
            } else {
                console.error("Error fetching movie providers:", providersResult.reason);
                responseData.providers = [];
            }

            if (reviewsResult.status === 'fulfilled') {
                responseData.reviews = reviewsResult.value;
            } else {
                console.error("Error fetching movie reviews:", reviewsResult.reason);
                responseData.reviews = [];
            }

            const imdbId = responseData.external_ids ? responseData.external_ids.imdb_id : null;
            if (imdbId) {
                try {
                    const imdbData = await getIMDbRatingFromDB(imdbId);

                    if (imdbData.found) {
                        responseData.imdb_rating = imdbData.score;
                        responseData.imdb_votes = imdbData.votes;
                        responseData.rating_source = 'imdb';
                    } else {
                        responseData.rating_source = 'tmdb';
                    }
                } catch (error) {
                    console.error("Error fetching IMDb rating:", error);
                    responseData.rating_source = 'tmdb';
                }
            } else {
                responseData.rating_source = 'tmdb';
            }

            resolve(responseData);
        }).catch((error) => {
            console.error("Error fetching movie data:", error);
            reject(error);
        });
    });
};

export function getMovieReleaseDates(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${id}/release_dates`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            resolve(response.data.results);
        }).catch((error) => {
            console.error("Error fetching movie release dates:", error);
            reject(error);
        });
    });
}

export function getMovieReviews(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${id}/reviews?language=${getEnv('API_LANG')}&page=1`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            const reviews = response.data.results;

            if (reviews && reviews.length > 0) {
                const reviewsData = reviews.map(review => {
                    const authorName = review.author_details.name || review.author_details.username || null;
                    const authorAvatar = review.author_details.avatar_path || null;
                    const authorRating = review.author_details.rating || null;
                    const content = review.content;
                    const createdAt = review.created_at;
                    const url = review.url;

                    return {
                        authorName,
                        authorAvatar,
                        authorRating,
                        content,
                        createdAt,
                        url,
                        source: 'TMDB'
                    };
                });

                resolve(reviewsData);
            } else {
                resolve([]);
            }
        }).catch((error) => {
            console.error("Error fetching movie reviews:", error);
            reject(error);
        });
    });
};

export function getMovieProviders(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${id}/watch/providers`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            const results = response.data.results;

            if (!results) {
                resolve([]);
                return;
            }

            let countryData = results.AR;
            let flatrate = [];
            let watchLink = '';

            if (countryData && countryData.flatrate) {
                flatrate = countryData.flatrate;
                watchLink = countryData.link;
            } else if (results.US) {
                countryData = results.US;
                if (countryData && countryData.flatrate) {
                    flatrate = countryData.flatrate;
                    watchLink = countryData.link;
                }
            }

            const providerData = flatrate.map(provider => ({
                name: provider.provider_name,
                logo_path: provider.logo_path,
                link: watchLink
            }));

            resolve(providerData);

        }).catch((error) => {
            console.error("Error fetching movie providers:", error);
            resolve([]);
        });
    });
};

export function getTVShowProviders(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${id}/watch/providers`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            const results = response.data.results;

            if (!results) {
                resolve([]);
                return;
            }

            let countryData = results.AR;
            let flatrate = [];
            let watchLink = '';

            if (countryData && countryData.flatrate) {
                flatrate = countryData.flatrate;
                watchLink = countryData.link;
            } else if (results.US) {
                countryData = results.US;
                if (countryData && countryData.flatrate) {
                    flatrate = countryData.flatrate;
                    watchLink = countryData.link;
                }
            }

            const providerData = flatrate.map(provider => ({
                name: provider.provider_name,
                logo_path: provider.logo_path,
                link: watchLink
            }));

            resolve(providerData);

        }).catch((error) => {
            console.error("Error fetching TV show providers:", error);
            resolve([]);
        });
    });
};

export function getMovieRecommended(id, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${id}/recommendations`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'movie');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'movie');
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getTvShows(query, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${query}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'tv');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'tv');
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

// A TMDB video row can point at a YouTube video that has since been pulled —
// every Euphoria season-3 trailer but one is a dead embed. oEmbed answers 200
// for something that will actually play in an iframe and 403 for anything
// removed, private or embedding-disabled.
//
// Fails open by construction: resolveTvTrailer treats a throw as "playable", so
// a timeout or a rate-limited YouTube can only cost us the check, never a
// working trailer.
async function _isYouTubePlayable(key) {
    const response = await $fetch.raw(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${key}&format=json`,
        { method: 'GET', timeout: 1500, ignoreResponseError: true, responseType: 'text' },
    );
    return response.status === 200;
}

// TMDB's series-level video list is frozen at the show's launch, so a TV page
// left to itself plays a season-1 trailer forever (see utils/tvTrailer.js).
// This pulls the latest season's videos in, sets `best_trailer` for the play
// button and merges everything into `videos.results` for the Videos tab.
//
// Every failure here is swallowed: a dead season request leaves `responseData`
// exactly as TMDB returned it, which is the old behaviour, so no TV page can
// break because of this.
async function _attachLatestSeasonTrailer(responseData, id, apiKey) {
    try {
        const { best, videos } = await resolveTvTrailer({
            seriesVideos: responseData.videos?.results || [],
            seasons: responseData.seasons || [],
            // Season videos are requested in en-US: TMDB returns almost nothing
            // for localized languages, and the YouTube key is the same anyway.
            fetchSeasonVideos: async (seasonNumber) => {
                const response = await axios.get(`${apiUrl}/tv/${id}/season/${seasonNumber}/videos`, {
                    params: { api_key: apiKey, language: 'en-US' },
                    timeout: 4000,
                });
                return response.data?.results || [];
            },
            isPlayable: _isYouTubePlayable,
        });

        responseData.best_trailer = best || null;
        responseData.videos = {
            ...responseData.videos,
            results: videos.sort((a, b) => Date.parse(b.published_at || 0) - Date.parse(a.published_at || 0)),
        };
    } catch (error) {
        console.error('Error resolving latest-season TV trailer:', error);
    }
}

export function getTvShow(id) {
    return new Promise((resolve, reject) => {
        // Capture runtime-config values before any await — see getMovie() for
        // why useRuntimeConfig() can return undefined after crossing the
        // async-context boundary in production Nitro builds.
        const apiKey = getEnv('API_KEY');
        const apiLang = getEnv('API_LANG');

        const mainRequest = axios.get(`${apiUrl}/tv/${id}`, {
            params: {
                api_key: apiKey,
                language: apiLang,
                append_to_response: 'videos,credits,images,external_ids,content_ratings',
                include_image_language: 'es,en,null',
            },
        });

        const extraVideosRequest = axios.get(`${apiUrl}/tv/${id}/videos`, {
            params: {
                api_key: apiKey,
                language: 'en-US'
            }
        }).catch(() => ({ data: { results: [] } }));

        Promise.all([mainRequest, extraVideosRequest]).then(async ([response, videoResponse]) => {
            const responseData = response.data;

            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'TV Show not found'));
                return;
            }

            if (apiLang !== 'en-US') {
                const needsOverviewFallback = !responseData.overview;
                const needsTitleFallback = _hasNonLatinScript(responseData.name);
                const needsCreditsFallback = _hasNonLatinScriptInCredits(responseData.credits);

                if (needsOverviewFallback || needsTitleFallback || needsCreditsFallback) {
                    try {
                        const fallbackResponse = await axios.get(`${apiUrl}/tv/${id}`, {
                            params: {
                                api_key: apiKey,
                                language: 'en-US',
                                append_to_response: 'credits',
                            },
                        });
                        if (needsOverviewFallback && fallbackResponse.data.overview) {
                            responseData.overview = fallbackResponse.data.overview;
                            responseData.original_overview_language = 'en';
                        }
                        if (needsTitleFallback && fallbackResponse.data.name && !_hasNonLatinScript(fallbackResponse.data.name)) {
                            responseData.name = fallbackResponse.data.name;
                        }
                        if (needsCreditsFallback && fallbackResponse.data.credits) {
                            _replaceCreditsWithEnFallback(responseData.credits, fallbackResponse.data.credits);
                        }
                    } catch (e) {
                        console.warn('Failed to fetch en-US fallback', e);
                    }
                }
            }

            if (videoResponse.data && videoResponse.data.results) {
                const currentIds = new Set((responseData.videos.results || []).map(v => v.id));
                const newVideos = videoResponse.data.results.filter(v => !currentIds.has(v.id));
                responseData.videos = {
                    ...responseData.videos,
                    results: [...(responseData.videos.results || []), ...newVideos]
                };
            }

            // Runs after the en-US merge above so the series-level pool is
            // already complete before the season walk starts.
            await _attachLatestSeasonTrailer(responseData, id, apiKey);

            const sortImages = (imgs) => {
                if (!imgs) return [];
                return imgs.sort((a, b) => {
                    const score = (lang) => (lang === 'es' || lang === 'es-ES') ? 2 : (lang === null ? 1 : 0);
                    return score(b.iso_639_1) - score(a.iso_639_1);
                });
            };

            if (responseData.images) {
                if (responseData.images.backdrops) responseData.images.backdrops = sortImages(responseData.images.backdrops);
                if (responseData.images.posters) responseData.images.posters = sortImages(responseData.images.posters);
            }
            try {
                const providers = await getTVShowProviders(id);
                responseData.providers = providers;
            } catch (error) {
                console.error("Error fetching TV show providers:", error);
                responseData.providers = [];
            }

            const imdbId = responseData.external_ids ? responseData.external_ids.imdb_id : null;

            if (imdbId) {
                try {
                    const imdbData = await getIMDbRatingFromDB(imdbId);
                    if (imdbData.found) {
                        responseData.imdb_rating = imdbData.score;
                        responseData.imdb_votes = imdbData.votes;
                        responseData.rating_source = 'imdb';
                    } else {
                        responseData.rating_source = 'tmdb';
                    }
                } catch (error) {
                    console.error("Error fetching IMDb rating:", error);
                    responseData.rating_source = 'tmdb';
                }
            } else {
                responseData.rating_source = 'tmdb';
            }

            resolve(responseData);
        }).catch((error) => {
            console.error("Error fetching TV show data:", error);
            reject(error);
        });
    });
};

export function getTvShowReviews(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${id}/reviews?language=${getEnv('API_LANG')}&page=1`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            const reviews = response.data.results;

            if (reviews && reviews.length > 0) {
                const reviewsData = reviews.map(review => {
                    const authorName = review.author_details.name || review.author_details.username || null;
                    const authorAvatar = review.author_details.avatar_path || null;
                    const authorRating = review.author_details.rating || null;
                    const content = review.content;
                    const createdAt = review.created_at;
                    const url = review.url;

                    return {
                        authorName,
                        authorAvatar,
                        authorRating,
                        content,
                        createdAt,
                        url,
                        source: 'TMDB'
                    };
                });

                resolve(reviewsData);
            } else {
                resolve([]);
            }
        }).catch((error) => {
            console.error("Error fetching tv show reviews:", error);
            reject(error);
        });
    });
};

export function getTraktReviews(id, type) {
    return new Promise((resolve, reject) => {
        const endpoint = type === 'movie' ? 'movies' : 'shows';
        const clientId = getEnv('TRAKT_CLIENT_ID');

        if (!clientId) {
            console.warn('Trakt Client ID is missing, skipping request.');
            resolve([]);
            return;
        }

        axios.get(`${traktApiUrl}/${endpoint}/${id}/comments`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': clientId
            }
        }).then(response => {
            const reviews = response.data;
            if (reviews && reviews.length > 0) {
                const reviewsData = reviews.map(review => {
                    return {
                        authorName: review.user ? review.user.username : 'Anonymous',
                        authorAvatar: null,
                        authorRating: review.rating,
                        content: review.comment,
                        createdAt: review.created_at,
                        url: `https://trakt.tv/comments/${review.id}`,
                        source: 'Trakt'
                    };
                });
                resolve(reviewsData);
            } else {
                resolve([]);
            }
        }).catch(error => {
            console.error('Trakt API Error', error);
            resolve([]);
        });
    });
};

export async function getECReviews(itemType, itemId) {
    try {
        const data = await $fetch(`https://cinemagoria-favorites-746175915741.us-east1.run.app/api/ec-reviews/${itemType}/${itemId}`);
        if (!data || !data.reviews || !data.reviews.length) return [];
        return data.reviews.map(r => ({
            authorName: r.displayName,
            authorAlias: r.alias || null,
            authorRating: r.rating,
            content: r.review,
            createdAt: r.createdAt,
            source: 'Cinemagoria',
            url: r.alias ? `/u/${r.alias}` : null,
            showFullContent: false
        }));
    } catch (e) {
        return [];
    }
}

export function getTvShowRecommended(id, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${id}/recommendations`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'tv');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'tv');
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getTvShowEpisodes(id, season) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${id}/season/${season}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
            },
        }).then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getEpisode(tvId, season, episode) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/tv/${tvId}/season/${season}/episode/${episode}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                append_to_response: 'images',
            },
        }).then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getTrending(media, page = 1, options = {}) {
    const { skipEnrichment = false } = options;
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/trending/${media}/week`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            // Apply curated exclusion lists before any downstream work.
            if (media === 'tv') {
                response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
            } else if (media === 'movie') {
                response.data.results = response.data.results.filter(item => !EXCLUDED_MOVIE_IDS.includes(item.id));
            }

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, media);
            });

            // `skipEnrichment: true` evita los roundtrips a TMDB details +
            // IMDb rating por item. Los callers que no necesitan
            // `external_ids` o `imdb_rating` (p.ej. los carouseles de la
            // homepage) deberían pasarlo en true — caso contrario disparamos
            // 2 HTTP extra por result × N results por página × M páginas.
            if (skipEnrichment) {
                await _fixNonLatinTitlesAsync(response.data.results, media);
                resolve(response.data);
                return;
            }

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const endpoint = media === 'movie' ? 'movie' : 'tv';
                    const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, media);
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getMediaByGenre(media, genre, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/discover/${media}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                with_genres: genre,
                page,
            },
        }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, media);
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/${media}/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, media);
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getCredits(id, type) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/person/${id}/${type}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
            },
        }).then(async (response) => {
            const mediaType = type.includes('movie') ? 'movie' : 'tv';
            if (response.data.cast) {
                response.data.cast.forEach(item => _fixNonLatinTitleInList(item, mediaType));
                await _fixNonLatinTitlesAsync(response.data.cast, mediaType);
            }
            if (response.data.crew) {
                response.data.crew.forEach(item => _fixNonLatinTitleInList(item, mediaType));
                await _fixNonLatinTitlesAsync(response.data.crew, mediaType);
            }
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getGenreList(media) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/genre/${media}/list`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            resolve(response.data.genres);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getPerson(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/person/${id}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                append_to_response: 'images,combined_credits,external_ids',
                include_image_language: 'en,null',
            },
        }).then(async (response) => {
            if (!response.data.biography && getEnv('API_LANG') !== 'en-US') {
                try {
                    const fallbackResponse = await axios.get(`${apiUrl}/person/${id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            language: 'en-US',
                        },
                    });
                    if (fallbackResponse.data.biography) {
                        response.data.biography = fallbackResponse.data.biography;
                        response.data.original_biography_language = 'en';
                    }
                } catch (e) {
                    console.warn('Failed to fetch fallback biography', e);
                }
            }

            response.data.combined_credits.cast.forEach(role => {
                role.vote_average = role.vote_average.toFixed(1);
            });

            resolve(response.data);
        })

            .catch((error) => {
                reject(error);
            });
    });
};

function parseSearchContext(rawQuery) {
    const yearMatch = rawQuery.match(/\b(19\d{2}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;

    let baseQuery = rawQuery;
    let personQuery = null;

    if (rawQuery.includes('+')) {
        const parts = rawQuery.split('+').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
            baseQuery = parts[0];
            personQuery = parts.slice(1).join(' ').trim();
        }
    } else if (year) {
        baseQuery = rawQuery.replace(yearMatch[0], '').replace(/\s{2,}/g, ' ').trim();
    }

    return { baseQuery, year, personQuery, originalQuery: rawQuery };
}

async function _detectPersonContext(personQuery) {
    try {
        const personResponse = await axios.get(`${apiUrl}/search/person`, {
            params: {
                api_key: getEnv('API_KEY'),
                query: personQuery,
                language: getEnv('API_LANG'),
            }
        });

        const persons = personResponse.data.results || [];
        if (persons.length === 0) return { personCreditIds: new Set(), personName: null };

        const topPerson = persons[0];

        try {
            const personDetail = await axios.get(`${apiUrl}/person/${topPerson.id}`, {
                params: {
                    api_key: getEnv('API_KEY'),
                    append_to_response: 'combined_credits',
                    language: getEnv('API_LANG'),
                }
            });
            const credits = personDetail.data.combined_credits || {};
            const allCreditIds = new Set();
            (credits.cast || []).forEach(c => allCreditIds.add(c.id));
            (credits.crew || []).forEach(c => allCreditIds.add(c.id));
            return { personCreditIds: allCreditIds, personName: topPerson.name };
        } catch (e) {
            const creditIds = new Set((topPerson.known_for || []).map(k => k.id));
            return { personCreditIds: creditIds, personName: topPerson.name };
        }
    } catch (e) {
        return { personCreditIds: new Set(), personName: null };
    }
}

function _scoreResults(results, context) {
    const { year, personCreditIds } = context;

    results.forEach(item => {
        let score = 0;

        if (year && (item.media_type === 'movie' || item.media_type === 'tv')) {
            const releaseDate = item.release_date || item.first_air_date || '';
            if (releaseDate.startsWith(year)) {
                score += 100;
            }
        }

        if (personCreditIds && personCreditIds.size > 0 && (item.media_type === 'movie' || item.media_type === 'tv')) {
            if (personCreditIds.has(item.id)) {
                score += 200;
            }
        }

        item._contextScore = score;
    });

    return results;
}

export async function search(query, page = 1) {
    const imdbIdPattern = /^tt\d{7,}$/;
    const tmdbIdPattern = /^\d+$/;

    let idSearchResults = [];
    let matchedById = null;

    if (imdbIdPattern.test(query)) {
        try {
            const findResponse = await axios.get(`${apiUrl}/find/${query}`, {
                params: {
                    api_key: getEnv('API_KEY'),
                    language: getEnv('API_LANG'),
                    external_source: 'imdb_id'
                }
            });

            if (findResponse.data) {
                const results = [
                    ...(findResponse.data.movie_results || []).map(r => ({ ...r, media_type: 'movie' })),
                    ...(findResponse.data.tv_results || []).map(r => ({ ...r, media_type: 'tv' }))
                ];

                if (results.length > 0) {
                    idSearchResults = results;
                    matchedById = 'IMDB';
                }
            }
        } catch (e) {
            console.error("Error searching by IMDb ID:", e);
        }
    } else if (tmdbIdPattern.test(query)) {
        try {
            const [movieResult, tvResult] = await Promise.allSettled([
                getMovie(query),
                getTvShow(query)
            ]);

            if (movieResult.status === 'fulfilled') {
                idSearchResults.push({ ...movieResult.value, media_type: 'movie' });
            }

            if (tvResult.status === 'fulfilled') {
                idSearchResults.push({ ...tvResult.value, media_type: 'tv' });
            }

            if (idSearchResults.length > 0) {
                matchedById = 'TMDB';
            }
        } catch (e) {
            console.error("Error searching by TMDB ID:", e);
        }
    }

    if (idSearchResults.length > 0) {
        const enrichedIdResults = await Promise.all(
            idSearchResults.map(async (item) => {
                try {
                    if (matchedById === 'IMDB') {
                        const endpoint = item.media_type === 'movie' ? 'movie' : 'tv';
                        const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}/external_ids`, {
                            params: {
                                api_key: getEnv('API_KEY')
                            }
                        });
                        item.external_ids = detailsResponse.data;
                        return enrichWithIMDbRating(item);
                    }
                    return item;
                } catch (e) {
                    return item;
                }
            })
        );

        enrichedIdResults.forEach(item => item.matched_by_id = matchedById);

        return {
            page: 1,
            results: enrichedIdResults,
            total_pages: 1,
            total_results: enrichedIdResults.length
        };
    }

    const context = parseSearchContext(query);
    const searchQuery = context.baseQuery || query;

    let personContext = { personCreditIds: new Set(), personName: null };
    if (page === 1 && context.personQuery) {
        personContext = await _detectPersonContext(context.personQuery);
    }

    try {
        const searchMulti = axios.get(`${apiUrl}/search/multi?include_adult=false`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                query: searchQuery,
                page,
            },
        });

        const searchCompanies = axios.get(`${apiUrl}/search/company`, {
            params: {
                api_key: getEnv('API_KEY'),
                query: searchQuery,
                page,
            },
        });

        let [multiResponse, companyResponse] = await Promise.all([searchMulti, searchCompanies]);

        if (multiResponse.data.results.length === 0 && searchQuery !== query) {
            const fallbackMulti = await axios.get(`${apiUrl}/search/multi?include_adult=false`, {
                params: {
                    api_key: getEnv('API_KEY'),
                    language: getEnv('API_LANG'),
                    query: query,
                    page,
                },
            });
            multiResponse = fallbackMulti;
        }

        const results = multiResponse.data.results;

        const festivalMatch = SUPPORTED_FESTIVALS.find(f =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.slug.toLowerCase().includes(query.toLowerCase())
        );

        if (festivalMatch) {
            results.unshift({
                id: festivalMatch.id,
                name: festivalMatch.name,
                media_type: 'festival',
                logo_path: festivalMatch.logo_path,
                slug: festivalMatch.slug
            });
        }

        results.forEach(item => {
            if (item.vote_average) {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
            }
            if (item.media_type === 'movie') _fixNonLatinTitleInList(item, 'movie');
            else if (item.media_type === 'tv') _fixNonLatinTitleInList(item, 'tv');
        });

        const enrichedMultiResults = await Promise.all(
            multiResponse.data.results.map(async (item) => {
                if (item.media_type === 'movie' || item.media_type === 'tv') {
                    const endpoint = item.media_type === 'movie' ? 'movie' : 'tv';
                    try {
                        const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}/external_ids`, {
                            params: {
                                api_key: getEnv('API_KEY')
                            }
                        });
                        item.external_ids = detailsResponse.data;
                        return enrichWithIMDbRating(item);
                    } catch (e) {
                        console.error(`Error enriching item ${item.id}:`, e);
                        return item;
                    }
                }
                return item;
            })
        );

        const companyResults = companyResponse.data.results
            .filter(company => SUPPORTED_PRODUCTION_COMPANIES.hasOwnProperty(company.id))
            .map(company => ({
                ...company,
                media_type: 'production',
                slug: SUPPORTED_PRODUCTION_COMPANIES[company.id].slug,
                name: SUPPORTED_PRODUCTION_COMPANIES[company.id].name
            }));

        let streamingResults = [];
        if (page === 1) {
            streamingResults = STREAMING_PROVIDERS
                .filter(provider => provider.name.toLowerCase().includes(query.toLowerCase()))
                .map(provider => ({
                    ...provider,
                    media_type: 'streaming'
                }));
        }

        const allResults = [...streamingResults, ...companyResults, ...enrichedMultiResults];

        if (page === 1) {
            _scoreResults(allResults, {
                year: context.year,
                personCreditIds: personContext.personCreditIds
            });
        }

        multiResponse.data.results = allResults;
        await _fixNonLatinTitlesAsync(multiResponse.data.results);
        return multiResponse.data;
    } catch (error) {
        throw error;
    }
};



export function getMDBListRatings(imdbId, type) {
    return new Promise((resolve, reject) => {
        const endpoint = type === 'movie' ? 'movie' : 'show';
        const apiKey = getEnv('MDBLIST_API');

        if (!apiKey) {
            resolve({ found: false });
            return;
        }

        axios.get(`https://api.mdblist.com/imdb/${endpoint}/${imdbId}`, {
            params: {
                apikey: apiKey,
            },
        }).then((response) => {
            const ratings = response.data.ratings;
            const tomatoesRating = ratings?.find(r => r.source === 'tomatoes');

            if (tomatoesRating && tomatoesRating.value) {
                let url = '';
                if (tomatoesRating.url) {
                    url = `https://www.rottentomatoes.com${tomatoesRating.url}`;
                }

                resolve({
                    found: true,
                    score: tomatoesRating.value,
                    url: url
                });
            } else {
                resolve({ found: false });
            }
        }).catch((error) => {
            console.error("Error fetching MDBLIST ratings:", error);
            resolve({ found: false });
        });
    });
}

export function getMoviesByProductionCompany(companyId, page = 1, filters = {}) {
    return new Promise((resolve, reject) => {
        const params = {
            api_key: getEnv('API_KEY'),
            language: getEnv('API_LANG'),
            with_companies: companyId,
            sort_by: filters.sort_by || 'popularity.desc',
            page,
        };

        if (filters.with_genres) params.with_genres = filters.with_genres;
        if (filters['primary_release_date.gte']) params['primary_release_date.gte'] = filters['primary_release_date.gte'];
        if (filters['primary_release_date.lte']) params['primary_release_date.lte'] = filters['primary_release_date.lte'];
        if (filters['vote_average.gte']) params['vote_average.gte'] = filters['vote_average.gte'];
        if (filters['vote_average.lte']) params['vote_average.lte'] = filters['vote_average.lte'];
        if (filters['vote_count.gte']) params['vote_count.gte'] = filters['vote_count.gte'];
        if (filters['vote_count.lte']) params['vote_count.lte'] = filters['vote_count.lte'];

        axios.get(`${apiUrl}/discover/movie`, { params }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'movie');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'movie');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getTVShowsByProductionCompany(companyId, page = 1, filters = {}) {
    return new Promise((resolve, reject) => {
        const params = {
            api_key: getEnv('API_KEY'),
            language: getEnv('API_LANG'),
            with_companies: companyId,
            sort_by: filters.sort_by || 'popularity.desc',
            page,
        };

        if (filters.with_genres) params.with_genres = filters.with_genres;
        if (filters['first_air_date.gte']) params['first_air_date.gte'] = filters['first_air_date.gte'];
        if (filters['first_air_date.lte']) params['first_air_date.lte'] = filters['first_air_date.lte'];
        if (filters['vote_average.gte']) params['vote_average.gte'] = filters['vote_average.gte'];
        if (filters['vote_average.lte']) params['vote_average.lte'] = filters['vote_average.lte'];
        if (filters['vote_count.gte']) params['vote_count.gte'] = filters['vote_count.gte'];
        if (filters['vote_count.lte']) params['vote_count.lte'] = filters['vote_count.lte'];

        axios.get(`${apiUrl}/discover/tv`, { params }).then(async (response) => {
            response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'tv');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'tv');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });

};

export function getMoviesByCompanies(companyIds, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/discover/movie`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                with_companies: companyIds,
                sort_by: 'popularity.desc',
                page,
            },
        }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'movie');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'movie');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getTvShowsByCompanies(companyIds, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/discover/tv`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                with_companies: companyIds,
                sort_by: 'popularity.desc',
                page,
            },
        }).then(async (response) => {
            response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'tv');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'tv');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getYouTubeVideo(id) {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                key: getEnv('API_YOUTUBE_KEY'),
                id,
                part: 'contentDetails',
            },
        }).then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getProductionCompanyDetails(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/company/${id}`, {
            params: {
                api_key: getEnv('API_KEY'),
            },
        }).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            console.error("Error fetching production company details:", error);
            reject(error);
        });
    });
};

export async function enrichMovieWithIMDbRating(item) {
    return enrichWithIMDbRating(item);
}
export async function enrichTVShowWithIMDbRating(item) {
    return enrichWithIMDbRating(item);
}


const FOLLOWS_API_URL = 'https://cinemagoria-follows-746175915741.us-east1.run.app';

export async function followProductionCompany(userEmail, companyId, companyName, logoPath, originCountry) {
    const response = await $fetch(`${FOLLOWS_API_URL}/company-follows/add`, {
        method: 'POST',
        body: {
            user_email: userEmail,
            company_id: companyId,
            company_name: companyName,
            logo_path: logoPath,
            origin_country: originCountry
        }
    });
    return response;
}

export async function unfollowProductionCompany(userEmail, companyId) {
    const response = await $fetch(`${FOLLOWS_API_URL}/company-follows/remove`, {
        method: 'DELETE',
        params: { user_email: userEmail, company_id: companyId }
    });
    return response;
}

export async function getFollowedProductionCompanies(userEmail) {
    try {
        const response = await $fetch(`${FOLLOWS_API_URL}/company-follows/list`, {
            params: { user_email: userEmail }
        });
        return response.company_follows || [];
    } catch (error) {
        console.error('Error fetching followed companies:', error);
        return [];
    }
}

const CACHE_PREFIX = 'trans_cache_v3_';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const TRANSLATE_SYSTEM_PROMPT = `Eres un traductor experto de contenido audiovisual (cine y televisión) con más de 20 años de experiencia. Traduces del inglés al español latinoamericano neutro con la misma fluidez y precisión que los subtítulos profesionales de Netflix o HBO.

PRINCIPIOS DE TRADUCCIÓN:
- Español latinoamericano neutro, inteligible en toda Latinoamérica, sin modismos regionales ni vulgarismos
- Prioriza la naturalidad sobre la literalidad: el resultado debe sonar como si hubiera sido escrito originalmente en español, nunca como una traducción
- Adapta las expresiones idiomáticas al equivalente natural en español, en lugar de traducirlas palabra por palabra
- Sé fiel al tono y registro del original: narrativo, íntimo, crítico, humorístico, técnico, etc.

QUÉ NO TRADUCIR (mantener en idioma original):
- Títulos de películas, series, álbumes o canciones
- Nombres de personas, personajes y actores
- Nombres de lugares (países, ciudades, barrios)
- Nombres de empresas, estudios y marcas
- Términos técnicos del inglés ya adoptados (streaming, spoiler, showrunner, etc.)

TERMINOLOGÍA CINEMATOGRÁFICA CORRECTA:
- "guion" (no libreto), "director de fotografía", "montaje" (no edición), "banda sonora", "tráiler", "estreno" (no premiere), "reparto" (no cast), "trama" (no plot)

FORMATO:
- Mantener saltos de línea, párrafos y puntuación del original
- NO agregar encabezados, notas del traductor ni texto fuera de la traducción
- Responder EXCLUSIVAMENTE con el texto traducido, nada más`;

const TRANSLATE_OVERVIEW_PROMPT = `Traduce esta sinopsis de película o serie al español latinoamericano. La traducción debe ser fluida y atractiva, como si fuera escrita por un redactor editorial de cine. Mantén el suspenso y la intriga cuando el original los tenga. Responde ÚNICAMENTE con la traducción:

`;

const TRANSLATE_REVIEW_PROMPT = `Traduce esta reseña o crítica cinematográfica al español latinoamericano. Es esencial preservar la voz y personalidad del crítico (irónica, apasionada, técnica, casual), sus opiniones y argumentos exactos, y el nivel de formalidad del texto. Responde ÚNICAMENTE con la traducción:

`;

function _getTranslationCacheKey(text) {
    return CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.slice(0, 50) + text.length)));
}

function _getCached(text) {
    if (!import.meta.client) return null;
    try {
        return localStorage.getItem(_getTranslationCacheKey(text));
    } catch (e) {
        return null;
    }
}

function _setCache(text, translation) {
    if (!import.meta.client) return;
    try {
        localStorage.setItem(_getTranslationCacheKey(text), translation);
    } catch (e) {
        // Ignore localStorage errors
    }
}

// --- Gemini multi-key rotation ---
let _geminiKeyIndex = 0;

function _getGeminiKeys() {
    const keys = [
        getEnv('geminiApiKey'),
        getEnv('geminiApiKey2'),
        getEnv('geminiApiKey3'),
        getEnv('geminiApiKey4'),
        getEnv('geminiApiKey5'),
        getEnv('geminiApiKey6'),
    ].filter(Boolean);
    return keys;
}

async function _callGemini(userPrompt) {
    if (!import.meta.client) return null;
    const keys = _getGeminiKeys();
    if (keys.length === 0) {
        console.error('No GEMINI_API_KEY configured');
        return null;
    }

    for (let attempt = 0; attempt < keys.length; attempt++) {
        const keyIdx = (_geminiKeyIndex + attempt) % keys.length;
        const apiKey = keys[keyIdx];

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: TRANSLATE_SYSTEM_PROMPT }] },
                    contents: [{ parts: [{ text: userPrompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
                }),
            });

            if (response.status === 429 || response.status === 503 || response.status === 500) {
                console.warn(`Gemini key ${keyIdx + 1} returned ${response.status}, rotating...`);
                _geminiKeyIndex = (keyIdx + 1) % keys.length;
                continue;
            }

            if (!response.ok) {
                const errBody = await response.text().catch(() => '');
                console.error(`Gemini API error: ${response.status}`, errBody);
                _geminiKeyIndex = (keyIdx + 1) % keys.length;
                continue;
            }

            _geminiKeyIndex = keyIdx; // stick with working key
            const result = await response.json();
            const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            return content ? content.trim() : null;
        } catch (error) {
            console.error(`Gemini key ${keyIdx + 1} error:`, error);
            _geminiKeyIndex = (keyIdx + 1) % keys.length;
            continue;
        }
    }
    console.error('All Gemini keys exhausted');
    return null;
}

// Overviews cache helpers
async function _fetchCachedOverview(tmdbId, mediaType) {
    try {
        const data = await $fetch('/api/overview-cache', {
            params: { tmdb_id: tmdbId, media_type: mediaType }
        });
        return data?.found ? data.contentEs : null;
    } catch { return null; }
}

async function _saveCachedOverview(tmdbId, mediaType, contentEn, contentEs) {
    try {
        const hash = _reviewContentHash(contentEn); // reuse hash function
        await $fetch('/api/overview-cache', {
            method: 'POST',
            body: { tmdb_id: tmdbId, media_type: mediaType, content_en: contentEn, content_es: contentEs, content_hash: hash }
        });
    } catch (e) {
        console.error('Failed to save overview to cache:', e);
    }
}

// In-flight deduplication: prevents Hero.vue and MovieInfo/TvInfo from
// translating the same overview simultaneously (saves 1 API call per visit)
const _inflightTranslations = new Map();

export async function translateText(text, tmdbId = null, mediaType = null) {
    if (!text || !text.trim()) return '';

    // Deduplicate: if same tmdbId+type is already being translated, reuse that promise
    const dedupeKey = (tmdbId && mediaType) ? `${tmdbId}-${mediaType}` : null;
    if (dedupeKey && _inflightTranslations.has(dedupeKey)) {
        return _inflightTranslations.get(dedupeKey);
    }

    const promise = _translateTextInner(text, tmdbId, mediaType);

    if (dedupeKey) {
        _inflightTranslations.set(dedupeKey, promise);
        promise.finally(() => _inflightTranslations.delete(dedupeKey));
    }

    return promise;
}

async function _translateTextInner(text, tmdbId, mediaType) {
    // 1. DB cache (if tmdbId provided)
    if (tmdbId && mediaType) {
        const dbCached = await _fetchCachedOverview(tmdbId, mediaType);
        if (dbCached) {
            _setCache(text, dbCached); // also save to localStorage
            return dbCached;
        }
    }

    // 2. localStorage cache — if found, also persist to DB for other users
    const cached = _getCached(text);
    if (cached) {
        if (tmdbId && mediaType) {
            _saveCachedOverview(tmdbId, mediaType, text, cached);
        }
        return cached;
    }

    // 3. Server side translation.
    //
    // The model is picked from a snapshot the daily probe refreshes, so a model
    // retired from the free catalogue stops being offered without a deploy —
    // which is what silently broke this path before. The endpoint also owns the
    // shared cache, so the first reader to open a title pays for the call and
    // everyone after them reads the row.
    let translation = null;
    try {
        const res = await $fetch('/api/translate', {
            method: 'POST',
            body: { text, tmdbId, mediaType },
        });
        translation = res?.translated || null;
    } catch (error) {
        console.error('Translation Error', error);
    }

    if (translation) {
        _setCache(text, translation);
        return translation;
    }

    // Nothing was available. The English text renders; the reader sees no error.
    return text;
}

export async function translateReviewsBatch(reviews) {
    if (!reviews || reviews.length === 0) return [];

    const contents = reviews.map(r => r.content || '');
    const translations = new Array(contents.length).fill(null);
    const indicesToTranslate = [];

    contents.forEach((text, index) => {
        if (!text.trim()) {
            translations[index] = '';
            return;
        }
        const cached = _getCached(text);
        if (cached) {
            translations[index] = cached;
        } else {
            indicesToTranslate.push(index);
        }
    });

    if (indicesToTranslate.length === 0) return translations;

    for (const originalIndex of indicesToTranslate) {
        const text = contents[originalIndex];
        try {
            const translation = await _callGemini(TRANSLATE_REVIEW_PROMPT + text);
            if (translation) {
                _setCache(text, translation);
                translations[originalIndex] = translation;
            } else {
                translations[originalIndex] = text;
            }
        } catch (error) {
            console.error('Review translation error', error);
            translations[originalIndex] = text;
        }
    }

    return translations;
}

export function translateReview(reviewContent) {
    return Promise.resolve(reviewContent);
}

// --- Reviews Cache System ---

function _reviewContentHash(text) {
    // Simple hash for browser: first 500 chars + length -> base64
    const raw = (text || '').slice(0, 500) + (text || '').length;
    return btoa(unescape(encodeURIComponent(raw))).replace(/[+/=]/g, '').slice(0, 32);
}

export async function fetchCachedReviews(tmdbId, mediaType) {
    try {
        const data = await $fetch(`/api/reviews-cache`, {
            params: { tmdb_id: tmdbId, media_type: mediaType }
        });
        return data?.reviews || [];
    } catch {
        return [];
    }
}

async function saveCachedReview(tmdbId, mediaType, review, contentEs) {
    try {
        await $fetch('/api/reviews-cache', {
            method: 'POST',
            body: {
                tmdb_id: tmdbId,
                media_type: mediaType,
                source: review.source,
                author_name: review.authorName || 'Anonymous',
                content_en: review.content,
                content_es: contentEs,
                content_hash: _reviewContentHash(review.content),
                author_rating: review.authorRating || null,
                author_avatar: review.authorAvatar || null,
                author_alias: review.authorAlias || null,
                review_url: review.url || null,
                created_at: review.createdAt || null
            }
        });
    } catch (e) {
        console.error('Failed to save review to cache:', e);
    }
}

// --- Gemini batch translation (1 call for N reviews via structured JSON prompt) ---
async function _translateBatchWithGemini(texts) {
    if (!texts || texts.length === 0) return null;
    if (!import.meta.client) return null;

    // Build a numbered JSON for the prompt
    const numbered = {};
    texts.forEach((t, i) => { numbered[i] = t; });

    const batchPrompt = `Traduce TODAS las siguientes reseñas cinematográficas al español latinoamericano. Preserva la voz de cada crítico.

IMPORTANTE: Responde EXCLUSIVAMENTE con un JSON válido, con las mismas claves numéricas y los valores traducidos. Sin explicaciones, sin markdown, sin backticks.

${JSON.stringify(numbered, null, 2)}`;

    try {
        const raw = await _callGemini(batchPrompt);
        if (!raw) return null;

        // Clean possible markdown wrappers
        const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleaned);

        return texts.map((_, i) => parsed[i] || parsed[String(i)] || null);
    } catch (e) {
        console.error('Gemini batch parse error:', e);
        return null;
    }
}

// --- OpenRouter batch translation (1 call for N reviews) ---
async function _translateBatchWithOpenRouter(texts) {
    if (!texts || texts.length === 0) return null;
    if (!import.meta.client) return null;
    // Routed through the server: the model comes from the daily snapshot rather
    // than a literal, and the provider key stays out of the browser bundle.
    try {
        const res = await $fetch('/api/translate', {
            method: 'POST',
            body: { texts },
        });
        const out = res?.translations;
        return Array.isArray(out) && out.some(Boolean) ? out : null;
    } catch (e) {
        console.error('Batch translation error:', e);
        return null;
    }
}

// --- RapidAPI batch translation (1 call for N reviews) ---
async function _translateBatchWithRapidAPI(texts) {
    if (!texts || texts.length === 0) return null;
    const apiKey = getEnv('rapidApiKey');
    if (!apiKey) return null;

    // Build JSON object: { "0": "text1", "1": "text2", ... }
    const jsonPayload = {};
    texts.forEach((text, i) => { jsonPayload[String(i)] = text; });

    try {
        const res = await fetch('https://google-translate113.p.rapidapi.com/api/v1/translator/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
                'x-rapidapi-key': apiKey
            },
            body: JSON.stringify({
                from: 'en',
                to: 'es',
                json: jsonPayload
            })
        });
        if (!res.ok) {
            console.warn('RapidAPI batch error:', res.status);
            return null;
        }
        const data = await res.json();
        const trans = data?.trans;
        if (!trans) return null;

        // Reconstruct array from keyed response
        return texts.map((_, i) => trans[String(i)] || null);
    } catch (e) {
        console.error('RapidAPI batch error:', e);
        return null;
    }
}

export async function translateReviewsBatchWithCache(reviews, tmdbId, mediaType) {
    if (!reviews || reviews.length === 0) return [];
    if (!import.meta.client) return reviews.map(r => r.content);

    // 1. Fetch all cached reviews for this title from DB
    const cached = await fetchCachedReviews(tmdbId, mediaType);
    const cacheMap = new Map();
    for (const c of cached) {
        cacheMap.set(c.contentHash, c.contentEs);
    }

    const translations = new Array(reviews.length).fill(null);
    const needsTranslation = []; // indices that need translation

    reviews.forEach((review, index) => {
        const content = review.content || '';
        if (!content.trim()) { translations[index] = ''; return; }

        const hash = _reviewContentHash(content);

        // Check DB cache first
        if (cacheMap.has(hash)) {
            translations[index] = cacheMap.get(hash);
            return;
        }

        // Check localStorage cache
        const localCached = _getCached(content);
        if (localCached) {
            translations[index] = localCached;
            return;
        }

        needsTranslation.push(index);
    });

    if (needsTranslation.length === 0) return translations;

    console.log(`[Reviews] ${needsTranslation.length} need translation, ${reviews.length - needsTranslation.length} cached`);

    // 2. Try RapidAPI batch first (1 API call for ALL uncached reviews)
    const textsToTranslate = needsTranslation.map(idx => reviews[idx].content);
    const batchResults = await _translateBatchWithRapidAPI(textsToTranslate);

    const stillNeedTranslation = []; // indices that RapidAPI failed

    if (batchResults) {
        batchResults.forEach((translated, batchIdx) => {
            const reviewIdx = needsTranslation[batchIdx];
            if (translated) {
                translations[reviewIdx] = translated;
                _setCache(reviews[reviewIdx].content, translated);
                saveCachedReview(tmdbId, mediaType, reviews[reviewIdx], translated);
            } else {
                stillNeedTranslation.push(reviewIdx);
            }
        });
    } else {
        // RapidAPI failed entirely, all need fallback
        stillNeedTranslation.push(...needsTranslation);
    }

    if (stillNeedTranslation.length === 0) return translations;

    // 3. Fallback: Gemini batch (multi-key rotation) → OpenRouter batch
    const remainingTexts = stillNeedTranslation.map(idx => reviews[idx].content);
    let batchTranslations = await _translateBatchWithGemini(remainingTexts);

    const afterGemini = []; // indices still unresolved

    if (batchTranslations) {
        batchTranslations.forEach((translated, batchIdx) => {
            const reviewIdx = stillNeedTranslation[batchIdx];
            if (translated) {
                translations[reviewIdx] = translated;
                _setCache(reviews[reviewIdx].content, translated);
                saveCachedReview(tmdbId, mediaType, reviews[reviewIdx], translated);
            } else {
                afterGemini.push(reviewIdx);
            }
        });
    } else {
        afterGemini.push(...stillNeedTranslation);
    }

    if (afterGemini.length === 0) return translations;

    // 4. Last resort: OpenRouter batch
    const orTexts = afterGemini.map(idx => reviews[idx].content);
    const orResults = await _translateBatchWithOpenRouter(orTexts);

    if (orResults) {
        orResults.forEach((translated, batchIdx) => {
            const reviewIdx = afterGemini[batchIdx];
            if (translated) {
                translations[reviewIdx] = translated;
                _setCache(reviews[reviewIdx].content, translated);
                saveCachedReview(tmdbId, mediaType, reviews[reviewIdx], translated);
            } else {
                translations[reviewIdx] = reviews[reviewIdx].content;
            }
        });
    } else {
        afterGemini.forEach(idx => { translations[idx] = reviews[idx].content; });
    }

    return translations;
}

export async function followStreamingPlatform(userEmail, providerId, providerName, logoPath) {
    const response = await $fetch(`${FOLLOWS_API_URL}/streaming-follows/add`, {
        method: 'POST',
        body: {
            user_email: userEmail,
            provider_id: providerId,
            provider_name: providerName,
            logo_path: logoPath
        }
    });
    return response;
}

export async function unfollowStreamingPlatform(userEmail, providerId) {
    const response = await $fetch(`${FOLLOWS_API_URL}/streaming-follows/remove`, {
        method: 'DELETE',
        params: { user_email: userEmail, provider_id: providerId }
    });
    return response;
}

export async function getFollowedStreamingPlatforms(userEmail) {
    try {
        const response = await $fetch(`${FOLLOWS_API_URL}/streaming-follows/list`, {
            params: { user_email: userEmail }
        });
        return response.streaming_follows || [];
    } catch (error) {
        console.error('Error fetching followed streaming platforms:', error);
        return [];
    }
}

export function getMoviesByProvider(providerId, page = 1, filters = {}) {
    return new Promise((resolve, reject) => {
        const params = {
            api_key: getEnv('API_KEY'),
            language: getEnv('API_LANG'),
            with_watch_providers: providerId,
            watch_region: 'US',
            sort_by: filters.sort_by || 'popularity.desc',
            page,
        };

        if (filters.with_genres) params.with_genres = filters.with_genres;
        if (filters['primary_release_date.gte']) params['primary_release_date.gte'] = filters['primary_release_date.gte'];
        if (filters['primary_release_date.lte']) params['primary_release_date.lte'] = filters['primary_release_date.lte'];
        if (filters['vote_average.gte']) params['vote_average.gte'] = filters['vote_average.gte'];
        if (filters['vote_average.lte']) params['vote_average.lte'] = filters['vote_average.lte'];
        if (filters['vote_count.gte']) params['vote_count.gte'] = filters['vote_count.gte'];
        if (filters['vote_count.lte']) params['vote_count.lte'] = filters['vote_count.lte'];

        axios.get(`${apiUrl}/discover/movie`, { params }).then(async (response) => {
            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'movie');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'movie');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getTvShowsByProvider(providerId, page = 1, filters = {}) {
    return new Promise((resolve, reject) => {
        const params = {
            api_key: getEnv('API_KEY'),
            language: getEnv('API_LANG'),
            with_watch_providers: providerId,
            watch_region: 'US',
            sort_by: filters.sort_by || 'popularity.desc',
            page,
        };

        if (filters.with_genres) params.with_genres = filters.with_genres;
        if (filters['first_air_date.gte']) params['first_air_date.gte'] = filters['first_air_date.gte'];
        if (filters['first_air_date.lte']) params['first_air_date.lte'] = filters['first_air_date.lte'];
        if (filters['vote_average.gte']) params['vote_average.gte'] = filters['vote_average.gte'];
        if (filters['vote_average.lte']) params['vote_average.lte'] = filters['vote_average.lte'];
        if (filters['vote_count.gte']) params['vote_count.gte'] = filters['vote_count.gte'];
        if (filters['vote_count.lte']) params['vote_count.lte'] = filters['vote_count.lte'];

        axios.get(`${apiUrl}/discover/tv`, { params }).then(async (response) => {
            response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
                _fixNonLatinTitleInList(item, 'tv');
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}/external_ids`, {
                        params: {
                            api_key: getEnv('API_KEY')
                        }
                    });
                    item.external_ids = detailsResponse.data;
                    return enrichWithIMDbRating(item);
                })
            );

            response.data.results = enrichedResults;
            await _fixNonLatinTitlesAsync(response.data.results, 'tv');
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function searchNews(query, page = 1) {
    // News search hits Turso with `title LIKE %q% OR description LIKE %q%` which
    // is a full table scan. Cap the wait at 5s — news is supplementary; if the
    // DB is slow we still want movie/TV results to render. Also skip queries
    // shorter than 3 chars to avoid scanning the whole table for nothing.
    if (!query || query.trim().length < 3) {
        return { results: [] };
    }
    try {
        const response = await axios.get('/api/news', {
            params: {
                q: query,
                limit: 10,
                page: page,
                lang: getEnv('API_LANG')
            },
            timeout: 5000
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.warn(`searchNews timed out for "${query}" after 5s — returning empty.`);
        } else {
            console.error("Error searching news:", error);
        }
        return { results: [] };
    }
}

export async function followUser(followerEmail, followedEmail) {
    return $fetch(`${FOLLOWS_API_URL}/user-follows/add`, {
        method: 'POST',
        body: { follower_email: followerEmail, followed_email: followedEmail }
    });
}

export async function unfollowUser(followerEmail, followedEmail) {
    return $fetch(`${FOLLOWS_API_URL}/user-follows/remove`, {
        method: 'DELETE',
        body: { follower_email: followerEmail, followed_email: followedEmail }
    });
}

export async function getUserFollowing(userEmail) {
    try {
        const r = await $fetch(`${FOLLOWS_API_URL}/user-follows/list`, { params: { user_email: userEmail } });
        return r.following ?? [];
    } catch { return []; }
}

export async function getUserFollowers(userEmail) {
    try {
        const r = await $fetch(`${FOLLOWS_API_URL}/user-follows/followers`, { params: { user_email: userEmail } });
        return r.followers ?? [];
    } catch { return []; }
}

export async function searchUsers(query, limit = 10) {
    try {
        const r = await $fetch(`${FOLLOWS_API_URL}/user-search`, { params: { q: query, limit } });
        return r.users ?? [];
    } catch { return []; }
}

export async function getPublicProfile(alias, viewerEmail = null) {
    try {
        const params = viewerEmail ? { viewer_email: viewerEmail } : {};
        return await $fetch(`${FOLLOWS_API_URL}/profile/${alias}`, { params });
    } catch { return null; }
}

export async function setUserAlias(userEmail, alias, bio = null) {
    return $fetch(`${FOLLOWS_API_URL}/alias`, {
        method: 'POST',
        body: { user_email: userEmail, alias, bio }
    });
}

export async function updateUserPrivacy(userEmail, settings) {
    return $fetch(`${FOLLOWS_API_URL}/privacy`, {
        method: 'POST',
        body: { user_email: userEmail, ...settings }
    });
}

export async function getActivityFeed(userEmail, page = 1) {
    try {
        const r = await $fetch(`${FOLLOWS_API_URL}/activity/feed`, {
            params: { user_email: userEmail, page, per_page: 20 }
        });
        return r;
    } catch { return { items: [], page: 1 }; }
}