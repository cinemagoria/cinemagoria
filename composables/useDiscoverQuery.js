import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { countries } from '~/utils/countries';
import {
  MOVIE_GENRES,
  TV_GENRES,
  DISCOVER_NETWORKS,
  DISCOVER_SORTS,
  DISCOVER_LANGUAGES,
  MIN_VOTE_OPTIONS,
  FORMAT_OPTIONS,
  DEFAULT_SORT,
  DEFAULT_MIN_VOTES,
} from '~/utils/discover';

const TMDB_URL = 'https://api.themoviedb.org/3';
const CLIENT_SORT_API_FALLBACK = 'popularity.desc';
const CLIENT_SORT_PAGES = 3;
const ENRICH_CHUNK_SIZE = 20;
const EXCLUDED_TV_IDS = [276880];

function isClientSort(sortValue) {
  return sortValue.startsWith('imdb_');
}

function ratingOf(item) {
  if (item.imdb_rating) return parseFloat(item.imdb_rating);
  if (item.vote_average) return parseFloat(item.vote_average);
  return 0;
}

function votesOf(item) {
  if (item.imdb_votes) {
    return typeof item.imdb_votes === 'string'
      ? parseInt(item.imdb_votes.replace(/,/g, ''), 10)
      : Number(item.imdb_votes) || 0;
  }
  return item.vote_count || 0;
}

function applyClientSort(items, sortValue) {
  const sorted = [...items];
  if (sortValue === 'imdb_rating.desc') sorted.sort((a, b) => ratingOf(b) - ratingOf(a));
  else if (sortValue === 'imdb_rating.asc') sorted.sort((a, b) => ratingOf(a) - ratingOf(b));
  else if (sortValue === 'imdb_votes.desc') sorted.sort((a, b) => votesOf(b) - votesOf(a));
  else if (sortValue === 'imdb_votes.asc') sorted.sort((a, b) => votesOf(a) - votesOf(b));
  return sorted;
}

async function fetchWithTimeout(url, ms = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

export function useDiscoverQuery(type) {
  const route = useRoute();
  const router = useRouter();

  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.public.apiKey;
  const apiLang = runtimeConfig.public.apiLang || 'en-US';

  const isMovie = type === 'movie';
  const genres = isMovie ? MOVIE_GENRES : TV_GENRES;
  const currentYear = new Date().getFullYear();

  const genre = ref('');
  const sort = ref(DEFAULT_SORT);
  const country = ref('');
  const network = ref('');
  const provider = ref('');
  const language = ref('');
  const minVotes = ref(DEFAULT_MIN_VOTES);
  const format = ref('feature');
  const yearFrom = ref(null);
  const yearTo = ref(null);
  const ratingMin = ref(null);
  const ratingMax = ref(null);

  const results = ref([]);
  const loading = ref(false);
  const error = ref(false);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalResults = ref(0);
  const searchPerformed = ref(false);

  const genreName = computed(() => genres.find(item => item.id === genre.value)?.name || '');
  const sortLabel = computed(() => DISCOVER_SORTS.find(item => item.value === sort.value)?.label || 'Highly Rated (IMDb)');
  const countryName = computed(() => countries.find(item => item.code === country.value)?.name || country.value);
  const languageName = computed(() => DISCOVER_LANGUAGES.find(item => item.code === language.value)?.name || language.value);
  const networkName = computed(() => DISCOVER_NETWORKS.find(item => item.id === network.value)?.name || '');
  const providerName = computed(() => DISCOVER_NETWORKS.find(item => item.id === provider.value)?.name || '');
  const minVotesLabel = computed(() => MIN_VOTE_OPTIONS.find(item => item.value === minVotes.value)?.label || `${minVotes.value}+ Votes`);
  const formatLabel = computed(() => FORMAT_OPTIONS.find(item => item.value === format.value)?.label || 'Feature Films');

  const chips = computed(() => {
    const list = [];
    if (genre.value) list.push({ key: 'genre', label: genreName.value });
    if (sort.value !== DEFAULT_SORT) list.push({ key: 'sort', label: sortLabel.value });
    if (country.value) list.push({ key: 'country', label: countryName.value });
    if (network.value) list.push({ key: 'network', label: networkName.value });
    if (provider.value) list.push({ key: 'provider', label: providerName.value });
    if (language.value) list.push({ key: 'language', label: languageName.value });
    if (format.value !== 'feature') list.push({ key: 'format', label: formatLabel.value });
    if (minVotes.value !== DEFAULT_MIN_VOTES) list.push({ key: 'minVotes', label: minVotesLabel.value });
    if (yearFrom.value) list.push({ key: 'yearFrom', label: `From ${yearFrom.value}` });
    if (yearTo.value) list.push({ key: 'yearTo', label: `To ${yearTo.value}` });
    if (ratingMin.value) list.push({ key: 'ratingMin', label: `Rating ≥ ${ratingMin.value}` });
    if (ratingMax.value) list.push({ key: 'ratingMax', label: `Rating ≤ ${ratingMax.value}` });
    return list;
  });

  const refinementCount = computed(() => chips.value.filter(chip => chip.key !== 'genre' && chip.key !== 'sort').length);
  const isActive = computed(() => chips.value.length > 0);
  const hasMore = computed(() => currentPage.value < totalPages.value);

  function buildParams(page) {
    const params = new URLSearchParams();
    params.set('api_key', apiKey);
    params.set('language', apiLang);
    params.set('include_adult', 'false');
    params.set('vote_count.gte', minVotes.value.toString());
    params.set('page', page);

    let apiSort = sort.value;
    if (isClientSort(sort.value)) {
      apiSort = CLIENT_SORT_API_FALLBACK;
    } else if (sort.value === 'revenue.desc' && !isMovie) {
      apiSort = 'popularity.desc';
    }
    params.set('sort_by', apiSort);

    if (genre.value) params.set('with_genres', genre.value);
    if (country.value) params.set('with_origin_country', country.value);
    if (language.value) params.set('with_original_language', language.value);

    if (network.value && !isMovie) params.set('with_networks', network.value);
    if (provider.value && isMovie) {
      params.set('with_watch_providers', provider.value);
      params.set('watch_region', 'US');
    }

    if (yearFrom.value) {
      params.set(isMovie ? 'primary_release_date.gte' : 'first_air_date.gte', `${yearFrom.value}-01-01`);
    }
    if (yearTo.value) {
      params.set(isMovie ? 'primary_release_date.lte' : 'first_air_date.lte', `${yearTo.value}-12-31`);
    }
    params.set('vote_average.gte', ratingMin.value || 0);
    if (ratingMax.value) params.set('vote_average.lte', ratingMax.value);

    if (isMovie) {
      if (format.value === 'feature') params.set('with_runtime.gte', 40);
      else params.set('with_runtime.lte', 39);
    }

    return params.toString();
  }

  async function enrichItem(item) {
    item.media_type = type;
    item.vote_average = parseFloat(item.vote_average).toFixed(1);
    item.rating_source = 'tmdb';

    try {
      const detailsRes = await fetchWithTimeout(
        `${TMDB_URL}/${type}/${item.id}?api_key=${apiKey}&append_to_response=external_ids`
      );
      const details = await detailsRes.json();
      const imdbId = details.external_ids?.imdb_id;

      if (imdbId) {
        try {
          const imdbRes = await fetchWithTimeout(`/api/imdb-rating/${imdbId}`, 3000);
          const imdbData = await imdbRes.json();
          if (imdbData.found) {
            item.imdb_rating = parseFloat(imdbData.score);
            item.imdb_votes = imdbData.votes;
            item.rating_source = 'imdb';
          }
        } catch (err) {
          console.error(`Failed to fetch IMDb rating for ${imdbId}:`, err);
        }
      }
    } catch {
      return item;
    }

    return item;
  }

  async function enrichAll(items) {
    const enriched = [];
    for (let index = 0; index < items.length; index += ENRICH_CHUNK_SIZE) {
      const chunk = items.slice(index, index + ENRICH_CHUNK_SIZE);
      enriched.push(...await Promise.all(chunk.map(item => enrichItem(item))));
    }
    return enriched;
  }

  function applyRatingBounds(items) {
    if (!ratingMin.value && !ratingMax.value) return items;
    const min = ratingMin.value ? parseFloat(ratingMin.value) : 0;
    const max = ratingMax.value ? parseFloat(ratingMax.value) : 10;
    return items.filter(item => {
      const value = item.imdb_rating ? parseFloat(item.imdb_rating) : parseFloat(item.vote_average);
      return value >= min && value <= max;
    });
  }

  async function fetchPageRaw(page) {
    const res = await fetch(`${TMDB_URL}/discover/${type}?${buildParams(page)}`);
    return res.json();
  }

  async function fetchResults(page = 1, reset = false) {
    if (!isActive.value) {
      results.value = [];
      searchPerformed.value = false;
      totalResults.value = 0;
      return;
    }

    loading.value = true;
    error.value = false;
    if (reset) {
      results.value = [];
      currentPage.value = 1;
      totalPages.value = 1;
    }

    try {
      if (isClientSort(sort.value)) {
        const pagesToFetch = reset ? CLIENT_SORT_PAGES : 1;
        const startPage = reset ? 1 : currentPage.value + 1;
        const pageNumbers = Array.from({ length: pagesToFetch }, (_, index) => startPage + index);

        const pages = await Promise.all(pageNumbers.map(pageNumber => fetchPageRaw(pageNumber)));
        totalPages.value = pages[0].total_pages || 1;
        totalResults.value = pages[0].total_results || 0;
        currentPage.value = pageNumbers[pageNumbers.length - 1];
        searchPerformed.value = true;

        const seen = new Set();
        let batch = pages.flatMap(page => page.results || []).filter(item => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });

        if (!isMovie) batch = batch.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
        batch.sort((a, b) => parseFloat(b.vote_average || 0) - parseFloat(a.vote_average || 0));

        const sorted = applyClientSort(applyRatingBounds(await enrichAll(batch)), sort.value);
        results.value = reset ? sorted : applyClientSort([...results.value, ...sorted], sort.value);
      } else {
        const data = await fetchPageRaw(page);
        totalPages.value = data.total_pages || 1;
        totalResults.value = data.total_results || 0;
        currentPage.value = data.page || page;
        searchPerformed.value = true;

        let batch = data.results || [];
        if (!isMovie) batch = batch.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
        batch.sort((a, b) => parseFloat(b.vote_average || 0) - parseFloat(a.vote_average || 0));

        const enriched = applyRatingBounds(await enrichAll(batch));
        results.value = reset ? enriched : [...results.value, ...enriched];
      }
    } catch (err) {
      console.error('Discover fetch error:', err);
      error.value = true;
    } finally {
      loading.value = false;
    }
  }

  function syncToUrl() {
    const query = {};
    if (genre.value) query.genre = genre.value;
    if (sort.value !== DEFAULT_SORT) query.sort = sort.value;
    if (country.value) query.country = country.value;
    if (network.value) query.network = network.value;
    if (provider.value) query.provider = provider.value;
    if (format.value !== 'feature') query.format = format.value;
    if (language.value) query.language = language.value;
    if (minVotes.value !== DEFAULT_MIN_VOTES) query.minVotes = minVotes.value;
    if (yearFrom.value) query.yearFrom = yearFrom.value;
    if (yearTo.value) query.yearTo = yearTo.value;
    if (ratingMin.value) query.ratingMin = ratingMin.value;
    if (ratingMax.value) query.ratingMax = ratingMax.value;

    router.replace({ query });
  }

  function commit() {
    syncToUrl();
    fetchResults(1, true);
  }

  const FIELDS = {
    genre,
    sort,
    country,
    network,
    provider,
    language,
    minVotes,
    format,
    yearFrom,
    yearTo,
    ratingMin,
    ratingMax,
  };

  const DEFAULTS = {
    genre: '',
    sort: DEFAULT_SORT,
    country: '',
    network: '',
    provider: '',
    language: '',
    minVotes: DEFAULT_MIN_VOTES,
    format: 'feature',
    yearFrom: null,
    yearTo: null,
    ratingMin: null,
    ratingMax: null,
  };

  function set(key, value) {
    if (!(key in FIELDS)) return;
    FIELDS[key].value = value;
    commit();
  }

  function reset(key) {
    set(key, DEFAULTS[key]);
  }

  function clearAll() {
    Object.keys(FIELDS).forEach(key => { FIELDS[key].value = DEFAULTS[key]; });
    commit();
  }

  function clearRefinements() {
    Object.keys(FIELDS)
      .filter(key => key !== 'genre' && key !== 'sort')
      .forEach(key => { FIELDS[key].value = DEFAULTS[key]; });
    commit();
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return;
    await fetchResults(currentPage.value + 1, false);
  }

  function hydrateFromUrl() {
    const query = route.query;
    if (query.genre) genre.value = Number(query.genre);
    if (query.sort) sort.value = query.sort;
    if (query.country) country.value = query.country;
    if (query.network) network.value = query.network;
    if (query.provider) provider.value = query.provider;
    if (query.format) format.value = query.format;
    if (query.language) language.value = query.language;
    if (query.minVotes) minVotes.value = Number(query.minVotes);
    if (query.yearFrom) yearFrom.value = Number(query.yearFrom);
    if (query.yearTo) yearTo.value = Number(query.yearTo);
    if (query.ratingMin) ratingMin.value = Number(query.ratingMin);
    if (query.ratingMax) ratingMax.value = Number(query.ratingMax);

    if (isActive.value) fetchResults(1, true);
  }

  return {
    isMovie,
    genres,
    currentYear,
    genre,
    sort,
    country,
    network,
    provider,
    language,
    minVotes,
    format,
    yearFrom,
    yearTo,
    ratingMin,
    ratingMax,
    results,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    searchPerformed,
    genreName,
    sortLabel,
    countryName,
    languageName,
    networkName,
    providerName,
    minVotesLabel,
    formatLabel,
    chips,
    refinementCount,
    isActive,
    hasMore,
    set,
    reset,
    clearAll,
    clearRefinements,
    commit,
    loadMore,
    hydrateFromUrl,
  };
}
