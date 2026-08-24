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
        };
        return mapping[key] || process.env[key];
    } catch (e) {
        return process.env[key];
    }
};


const apiUrl = 'https://api.themoviedb.org/3';
export const apiImgUrl = 'https://image.tmdb.org/t/p';
export const EXCLUDED_MOVIE_IDS = [969681, 931285, 1273221, 1265609, 696393, 1523145, 1641319, 1307373, 1444249, 1416391, 840464, 936075, 1623125, 1239134, 1108427, 1446616, 980431, 1084577, 83533, 1226863, 1613798, 1049471, 1327819, 1297842, 1084242, 1236153, 1659087, 1290821, 1472951, 1234731, 1493859, 1290417, 1511057, 1383731, 1414413, 1159559, 1204680, 1084244, 1658464, 1301421, 1400336, 1674749];
export const EXCLUDED_TV_IDS = [269161, 289219, 318880, 316973, 316544, 259819, 300131, 312474, 276880, 281010, 314784, 297557, 260463, 258865, 196950, 295357, 301507, 289424, 295778, 279471, 287011, 278573, 274671, 278275, 224263, 292121, 293697, 315595];

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
 * Resuelve la URL del poster para un item siguiendo la jerarquía estándar de
 * la app — la misma que aplica el mixin `poster` de Details.js:
 *
 *   1. title_overrides poster_path (force=true)         → gana siempre
 *   2. hero_selections / noir_historical (force=true)   → gana sobre TMDB
 *   3. item.poster_path / posterSnapshot (TMDB-or-stored)
 *   4. title_overrides poster_path (force=false)        → solo si no hay (2)/(3)
 *   5. hero_selections / noir_historical (sin force)    → solo si no hay (2)/(3)
 *   6. null (el caller decide placeholder)
 *
 * Pensado para páginas que usan <img> raw en lugar de Card.vue (watchlist, lists/[slug]).
 *
 * @param {Object} args
 * @param {number|string} args.id          tmdb_id del item
 * @param {string} args.media_type         'movie' | 'tv'
 * @param {string|null} args.posterSnapshot  Snapshot del poster guardado en la lista del usuario
 *                                           (item.details.posterForDb) o item.poster_path del API.
 *                                           Puede ser URL completa, path TMDB '/abc.jpg', o null.
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

    // (1) title_overrides force=true — gana siempre.
    if (c?.poster_path && c.force_enrichment !== false) {
        return c.poster_path;
    }
    // (2) hero/noir force=true — gana sobre TMDB snapshot.
    if (h?.poster_path && h.force_enrichment) return fmt(h.poster_path);
    if (n?.poster_path && n.force_enrichment) return fmt(n.poster_path);

    // (3) Snapshot disponible (TMDB poster cuando se guardó el item, o el item.poster_path actual).
    if (posterSnapshot) return fmt(posterSnapshot);

    // (4)(5) Sin snapshot — caen los fallbacks no-force en orden.
    if (c?.poster_path) return c.poster_path;
    if (h?.poster_path) return fmt(h.poster_path);
    if (n?.poster_path) return fmt(n.poster_path);

    return null;
}

const traktApiUrl = 'https://api.trakt.tv';

const lists = {
    movie: [
        { title: 'Popular Movies', query: 'trending' },
        { title: 'Popular Movies', query: 'popular' },
        { title: 'Top Rated Movies', query: 'top_rated' },
        { title: 'Upcoming Movies', query: 'upcoming' },
        { title: 'Now Playing Movies', query: 'now_playing' },
    ],
    tv: [
        { title: 'Popular TV Shows', query: 'trending' },
        { title: 'Popular TV Shows', query: 'popular' },
        { title: 'Top Rated TV Shows', query: 'top_rated' },
        { title: 'Currently Airing TV Shows', query: 'on_the_air' },
        { title: 'TV Shows Airing Today', query: 'airing_today' },
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
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
};

export function getMovie(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/movie/${id}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                append_to_response: 'videos,credits,images,external_ids,release_dates',
                include_image_language: 'en',
            },
        }).then(async (response) => {
            const responseData = response.data;
            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'Movie not found'));
                return;
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
        axios.get(`${apiUrl}/movie/${id}/reviews?language=en-US&page=1`, {
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
        // Captured before the request: `getEnv` reads useRuntimeConfig(), which
        // resolves to undefined once the promise chain crosses Nuxt's
        // async-context boundary in production Nitro builds. Reading it inside
        // .then() would hand _attachLatestSeasonTrailer an undefined key, and
        // TMDB answers "Invalid API key" with a 200 so nothing would throw —
        // the season walk would just silently go back to season-1 trailers.
        const apiKey = getEnv('API_KEY');

        axios.get(`${apiUrl}/tv/${id}`, {
            params: {
                api_key: apiKey,
                language: getEnv('API_LANG'),
                append_to_response: 'videos,credits,images,external_ids,content_ratings',
                include_image_language: 'en',
            },
        }).then(async (response) => {
            const responseData = response.data;
            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'TV Show not found'));
                return;
            }

            await _attachLatestSeasonTrailer(responseData, id, apiKey);

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
        axios.get(`${apiUrl}/tv/${id}/reviews?language=en-US&page=1`, {
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
            });

            // `skipEnrichment: true` avoids the per-item TMDB details + IMDb
            // rating roundtrips. Callers that don't need `external_ids` or
            // `imdb_rating` (e.g. the homepage carousels) should set this
            // for a huge perf win — otherwise we fire 2 extra HTTP calls
            // per result × N results per page × M pages.
            if (skipEnrichment) {
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
        }).then((response) => {
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
        }).then((response) => {
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