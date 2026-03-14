import { SUPPORTED_PRODUCTION_COMPANIES, STREAMING_PROVIDERS, SUPPORTED_FESTIVALS } from '~/utils/constants';

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
        };
        return mapping[key] || process.env[key];
    } catch (e) {
        return process.env[key];
    }
};


const apiUrl = 'https://api.themoviedb.org/3';
export const apiImgUrl = 'https://image.tmdb.org/t/p';
const EXCLUDED_TV_IDS = [276880];


let _heroEnrichmentPromise = null;

export async function getHeroEnrichment() {
    if (!_heroEnrichmentPromise) {
        _heroEnrichmentPromise = fetch('/data/hero-enrichment.json')
            .then(res => res.ok ? res.json() : [])
            .then(data => new Map(data.map(item => [item.tmdb_id, item])))
            .catch(() => new Map());
    }
    return _heroEnrichmentPromise;
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

export function getIMDbRatingFromDB(imdbId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`/api/imdb-rating/${imdbId}`, { timeout: 1500 });
            resolve(response.data);
        } catch (error) {
            resolve({ found: false });
        }
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
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
        const mainRequest = axios.get(`${apiUrl}/movie/${id}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                append_to_response: 'videos,credits,images,external_ids,release_dates',
                include_image_language: 'es,en,null',
            },
        });

        const extraVideosRequest = axios.get(`${apiUrl}/movie/${id}/videos`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: 'en-US'
            }
        }).catch(() => ({ data: { results: [] } }));

        Promise.all([mainRequest, extraVideosRequest]).then(async ([response, videoResponse]) => {
            const responseData = response.data;

            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'Movie not found'));
                return;
            }

            if (!responseData.overview && getEnv('API_LANG') !== 'en-US') {
                try {
                    const fallbackResponse = await axios.get(`${apiUrl}/movie/${id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            language: 'en-US',
                        },
                    });
                    if (fallbackResponse.data.overview) {
                        responseData.overview = fallbackResponse.data.overview;
                        responseData.original_overview_language = 'en';
                    }
                } catch (e) {
                    console.warn('Failed to fetch fallback overview', e);
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
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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

export function getTvShow(id) {
    return new Promise((resolve, reject) => {
        const mainRequest = axios.get(`${apiUrl}/tv/${id}`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                append_to_response: 'videos,credits,images,external_ids,content_ratings',
                include_image_language: 'es,en,null',
            },
        });

        const extraVideosRequest = axios.get(`${apiUrl}/tv/${id}/videos`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: 'en-US'
            }
        }).catch(() => ({ data: { results: [] } }));

        Promise.all([mainRequest, extraVideosRequest]).then(async ([response, videoResponse]) => {
            const responseData = response.data;

            if (!responseData || responseData.success === false) {
                reject(new Error(responseData?.status_message || 'TV Show not found'));
                return;
            }

            if (!responseData.overview && getEnv('API_LANG') !== 'en-US') {
                try {
                    const fallbackResponse = await axios.get(`${apiUrl}/tv/${id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            language: 'en-US',
                        },
                    });
                    if (fallbackResponse.data.overview) {
                        responseData.overview = fallbackResponse.data.overview;
                        responseData.original_overview_language = 'en';
                    }
                } catch (e) {
                    console.warn('Failed to fetch fallback overview', e);
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
        const data = await $fetch(`https://cinemagoria-favorites.vercel.app/api/ec-reviews/${itemType}/${itemId}`);
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
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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

export function getTrending(media, page = 1) {
    return new Promise((resolve, reject) => {
        axios.get(`${apiUrl}/trending/${media}/week`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                page,
            },
        }).then(async (response) => {
            if (media === 'tv') {
                response.data.results = response.data.results.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
            }

            response.data.results.forEach(item => {
                item.vote_average = parseFloat(item.vote_average).toFixed(1);
            });

            const enrichedResults = await Promise.all(
                response.data.results.map(async (item) => {
                    const endpoint = media === 'movie' ? 'movie' : 'tv';
                    const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/${media}/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                        const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}`, {
                            params: {
                                api_key: getEnv('API_KEY'),
                                append_to_response: 'external_ids'
                            }
                        });
                        item.external_ids = detailsResponse.data.external_ids;
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

    try {
        const searchMulti = axios.get(`${apiUrl}/search/multi?include_adult=false`, {
            params: {
                api_key: getEnv('API_KEY'),
                language: getEnv('API_LANG'),
                query,
                page,
            },
        });

        const searchCompanies = axios.get(`${apiUrl}/search/company`, {
            params: {
                api_key: getEnv('API_KEY'),
                query,
                page,
            },
        });

        const [multiResponse, companyResponse] = await Promise.all([searchMulti, searchCompanies]);
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
                        const detailsResponse = await axios.get(`${apiUrl}/${endpoint}/${item.id}`, {
                            params: {
                                api_key: getEnv('API_KEY'),
                                append_to_response: 'external_ids'
                            }
                        });
                        item.external_ids = detailsResponse.data.external_ids;
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

        multiResponse.data.results = [...streamingResults, ...companyResults, ...enrichedMultiResults];
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
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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


const FOLLOWS_API_URL = 'https://cinemagoria-follows-rust.vercel.app';

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

const CACHE_PREFIX = 'trans_cache_v1_';
const BATCH_DELIMITER = ' ||| ';

const PRESERVED_WORDS = [];

function replacePreservedWords(text) {
    let modifiedText = text;
    const wordMap = {};

    PRESERVED_WORDS.forEach((word, index) => {
        const placeholder = `__PRESERVED_${index}__`;
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        if (regex.test(modifiedText)) {
            wordMap[placeholder] = word;
            modifiedText = modifiedText.replace(regex, placeholder);
        }
    });

    return { modifiedText, wordMap };
}

function restorePreservedWords(text, wordMap) {
    let restoredText = text;
    for (const [placeholder, word] of Object.entries(wordMap)) {
        const regex = new RegExp(placeholder, 'gi');
        restoredText = restoredText.replace(regex, word);
    }
    return restoredText;
}

export async function translateReviewsBatch(reviews) {
    if (!reviews || reviews.length === 0) {
        return [];
    }

    const contents = reviews.map(r => r.content || '');
    const translations = new Array(contents.length).fill(null);
    const indicesToTranslate = [];
    const textsToTranslate = [];

    contents.forEach((text, index) => {
        if (!text.trim()) {
            translations[index] = '';
            return;
        }

        if (import.meta.client) {
            try {
                const cacheKey = CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.slice(0, 50) + text.length)));
                const cached = localStorage.getItem(cacheKey);

                if (cached) {
                    translations[index] = cached;
                } else {
                    indicesToTranslate.push(index);
                    textsToTranslate.push(text);
                }
            } catch (e) {
                indicesToTranslate.push(index);
                textsToTranslate.push(text);
            }
        } else {
            indicesToTranslate.push(index);
            textsToTranslate.push(text);
        }
    });

    if (indicesToTranslate.length === 0) {
        return translations;
    }

    const combinedQuery = textsToTranslate.join(BATCH_DELIMITER);
    const { modifiedText: finalQuery, wordMap } = replacePreservedWords(combinedQuery);

    try {
        const response = await axios.post('https://deep-translate1.p.rapidapi.com/language/translate/v2',
            {
                source: 'en',
                target: 'es',
                q: finalQuery
            },
            {
                headers: {
                    'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
                    'x-rapidapi-key': getEnv('rapidApiKey'),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.data && response.data.data.translations && response.data.data.translations.translatedText && response.data.data.translations.translatedText.length > 0) {
            let translatedText = response.data.data.translations.translatedText[0];
            translatedText = restorePreservedWords(translatedText, wordMap);
            const translatedParts = translatedText.split(BATCH_DELIMITER.trim());

            if (translatedParts.length === textsToTranslate.length) {
                translatedParts.forEach((trans, i) => {
                    const originalIndex = indicesToTranslate[i];
                    translations[originalIndex] = trans.trim();

                    if (import.meta.client) {
                        try {
                            const text = textsToTranslate[i];
                            const cacheKey = CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.slice(0, 50) + text.length)));
                            localStorage.setItem(cacheKey, trans.trim());
                        } catch (e) {
                            // Ignore localStorage errors
                        }
                    }
                });
            } else {
                indicesToTranslate.forEach((originalIndex, i) => {
                    translations[originalIndex] = textsToTranslate[i];
                });
            }

        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Translation Error', error);
        indicesToTranslate.forEach((originalIndex, i) => {
            translations[originalIndex] = textsToTranslate[i];
        });
    }

    return translations;
}

export async function translateText(text) {
    if (!text || !text.trim()) return '';

    if (import.meta.client) {
        try {
            const cacheKey = CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.slice(0, 50) + text.length)));
            const cached = localStorage.getItem(cacheKey);
            if (cached) return cached;
        } catch (e) {
            // Ignore
        }
    }

    try {
        const { modifiedText: finalQuery, wordMap } = replacePreservedWords(text);

        const response = await axios.post('https://deep-translate1.p.rapidapi.com/language/translate/v2',
            {
                source: 'en',
                target: 'es',
                q: finalQuery
            },
            {
                headers: {
                    'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
                    'x-rapidapi-key': getEnv('rapidApiKey'),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data && response.data.data && response.data.data.translations && response.data.data.translations.translatedText && response.data.data.translations.translatedText.length > 0) {
            let translation = response.data.data.translations.translatedText[0];
            translation = restorePreservedWords(translation, wordMap);
            if (import.meta.client) {
                try {
                    const cacheKey = CACHE_PREFIX + btoa(unescape(encodeURIComponent(text.slice(0, 50) + text.length)));
                    localStorage.setItem(cacheKey, translation);
                } catch (e) {
                    // Ignore
                }
            }
            return translation;
        }
    } catch (error) {
        console.error('Translation Error', error);
    }

    return text;
}

export function translateReview(reviewContent) {
    return Promise.resolve(reviewContent);
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
                    const detailsResponse = await axios.get(`${apiUrl}/movie/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
                    const detailsResponse = await axios.get(`${apiUrl}/tv/${item.id}`, {
                        params: {
                            api_key: getEnv('API_KEY'),
                            append_to_response: 'external_ids'
                        }
                    });
                    item.external_ids = detailsResponse.data.external_ids;
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
    try {
        const response = await axios.get('/api/news', {
            params: {
                q: query,
                limit: 10,
                page: page,
                lang: getEnv('API_LANG')
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching news:", error);
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