<template>
  <main class="main">
    <UserNav />
    <TopNav
      :title="metaTitle" />

    <StreamingPlatformHero
      v-if="provider && provider.id"
      :item="provider"
      title="Streaming Service" />

    <div class="sp-toolbar">
      <div class="sp-toolbar__row">
        <label class="switch">
          <input type="checkbox" :checked="activeTab === 'tvShows'" @change="toggleTab">
          <span>Movies</span>
          <span>TV Shows</span>
        </label>

        <div class="sp-toolbar__actions">
          <span v-if="resultCount" class="sp-result-count">{{ resultCount }}</span>
          <button
            type="button"
            class="sp-refine"
            :class="{ 'is-on': advancedFilterCount > 0 }"
            @click="openFiltersModal">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="17" x2="14" y2="17" /></svg>
            <span>Refine</span>
            <span v-if="advancedFilterCount" class="sp-refine__count">{{ advancedFilterCount }}</span>
          </button>
        </div>
      </div>

      <div class="sp-genres" role="group" aria-label="Filter by genre">
        <button
          type="button"
          class="sp-genre"
          :class="{ 'is-on': selectedGenre === '' }"
          @click="pickGenre('', '')">All</button>
        <button
          v-for="genre in currentGenreList"
          :key="genre.id"
          type="button"
          class="sp-genre"
          :class="{ 'is-on': selectedGenre === genre.id }"
          @click="pickGenre(genre.id, genre.name)">{{ genre.name }}</button>
      </div>

      <div v-if="hasActiveFilters" class="sp-active">
        <div class="sp-active__chips">
          <span v-for="(chip, index) in activeFilterChips" :key="index" class="sp-chip">
            <span>{{ chip.label }}</span>
            <button
              type="button"
              class="sp-chip__remove"
              :aria-label="`Remove ${chip.label}`"
              @click="removeFilter(chip.value)">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        </div>
        <button type="button" class="sp-clear-all" @click="clearAllFilters">Clear all</button>
      </div>
    </div>

    <section class="spacing">
      <div v-if="activeTab === 'movies'" class="content-section">
        <div v-if="movies && movies.results && movies.results.length">
          <Listing
            :items="movies"
            :loading="moviesLoading"
            @loadMore="loadMoreMovies" />
        </div>
        <div v-else-if="!moviesLoading" class="sp-empty">
          <img src="/ui/cinema-popcorn.svg" alt="" class="sp-empty__art">
          <h3 v-if="hasActiveFilters">No movies match your filters</h3>
          <h3 v-else>Nothing to show yet</h3>
          <p v-if="hasActiveFilters">Loosen a filter or two and the list will fill back in.</p>
          <p v-else>No movies found for this streaming provider.</p>
          <button v-if="hasActiveFilters" type="button" class="sp-btn sp-btn--ghost sp-empty__action" @click="clearAllFilters">Clear filters</button>
        </div>
      </div>

      <div v-if="activeTab === 'tvShows'" class="content-section">
        <div v-if="tvShows && tvShows.results && tvShows.results.length">
          <Listing
            :items="tvShows"
            :loading="tvShowsLoading"
            @loadMore="loadMoreTVShows" />
        </div>
        <div v-else-if="!tvShowsLoading" class="sp-empty">
          <img src="/ui/cinema-popcorn.svg" alt="" class="sp-empty__art">
          <h3 v-if="hasActiveFilters">No TV shows match your filters</h3>
          <h3 v-else>Nothing to show yet</h3>
          <p v-if="hasActiveFilters">Loosen a filter or two and the list will fill back in.</p>
          <p v-else>No TV shows found for this streaming provider.</p>
          <button v-if="hasActiveFilters" type="button" class="sp-btn sp-btn--ghost sp-empty__action" @click="clearAllFilters">Clear filters</button>
        </div>
      </div>
    </section>

    <div v-if="filtersModalVisible" class="sp-modal-overlay" @click="closeFiltersModal">
      <div class="sp-modal" role="dialog" aria-modal="true" aria-labelledby="sp-modal-title" @click.stop>
        <button type="button" class="sp-modal__close" aria-label="Close" @click="closeFiltersModal">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div class="sp-modal__head">
          <h3 id="sp-modal-title">Refine results</h3>
          <p>Genres are one tap away in the bar. These narrow the search further.</p>
        </div>

        <div class="sp-modal__body">
          <div class="sp-field">
            <span class="sp-field__label">Release years</span>
            <div class="sp-range">
              <input type="number" v-model.number="customYearStart" :min="1880" :max="currentYear" placeholder="From" aria-label="From year">
              <em>to</em>
              <input type="number" v-model.number="customYearEnd" :min="1880" :max="currentYear" placeholder="To" aria-label="To year">
            </div>
            <div class="sp-quick">
              <button v-for="range in yearRanges" :key="range" type="button" class="sp-quick__btn" @click="setYearRange(range)">{{ range }}</button>
            </div>
          </div>

          <div class="sp-field">
            <span class="sp-field__label">Score</span>
            <div class="sp-range">
              <input type="number" v-model.number="minImdbRating" min="0" max="10" step="0.1" placeholder="Min" aria-label="Minimum score">
              <em>to</em>
              <input type="number" v-model.number="maxImdbRating" min="0" max="10" step="0.1" placeholder="Max" aria-label="Maximum score">
            </div>
          </div>

          <div class="sp-field">
            <span class="sp-field__label">Votes</span>
            <div class="sp-range">
              <input type="number" v-model.number="minImdbVotes" min="0" placeholder="Min" aria-label="Minimum votes">
              <em>to</em>
              <input type="number" v-model.number="maxImdbVotes" min="0" placeholder="Max" aria-label="Maximum votes">
            </div>
          </div>

          <div class="sp-field">
            <span class="sp-field__label">Sort by</span>
            <div class="sp-sort">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                type="button"
                class="sp-sort__btn"
                :class="{ 'is-on': orderMode === option.value }"
                @click="selectSort(option.value)">{{ option.label }}</button>
            </div>
          </div>
        </div>

        <div class="sp-modal__foot">
          <button type="button" class="sp-btn sp-btn--ghost" @click="clearAllFilters">Clear</button>
          <button type="button" class="sp-btn sp-btn--solid" @click="applyFilters">Show results</button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useAsyncData, useHead, useRuntimeConfig, useNuxtApp, createError } from '#imports';
import { getMoviesByProvider, getTvShowsByProvider } from '~/utils/api';
import { getStreamingProviderBySlug } from '~/utils/constants';
import TopNav from '~/components/global/TopNav';
import Listing from '~/components/Listing';
import StreamingPlatformHero from '~/components/StreamingPlatformHero';
import UserNav from '@/components/global/UserNav';

const route = useRoute();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();

const moviesLoading = ref(false);
const tvShowsLoading = ref(false);
const activeTab = ref('movies');
const showRatedItems = ref(false);
const filtersModalVisible = ref(false);
const selectedGenre = ref('');
const selectedGenreName = ref('');
const customYearStart = ref(null);
const customYearEnd = ref(null);
const minImdbRating = ref(null);
const maxImdbRating = ref(null);
const minImdbVotes = ref(null);
const maxImdbVotes = ref(null);
const orderMode = ref('popularity.desc');
const currentYear = new Date().getFullYear();
const slug = route.params.slug;
const provider = ref(null);

const providerInfo = getStreamingProviderBySlug(slug);

if (!providerInfo) {
  throw createError({ statusCode: 404, message: 'Streaming provider not found' });
}

provider.value = providerInfo;
const providerId = providerInfo.id;

const { data: asyncDataResult, error } = await useAsyncData(`streaming-${providerId}`, async () => {
  const [moviesData, tvShowsData] = await Promise.all([
    getMoviesByProvider(providerId, 1, { sort_by: 'popularity.desc' }),
    getTvShowsByProvider(providerId, 1, { sort_by: 'popularity.desc' }),
  ]);

  return {
    movies: moviesData,
    tvShows: tvShowsData,
  };
});

if (error.value) {
  console.error('Error loading streaming provider data:', error.value);
  throw createError({ statusCode: 500, message: 'Error loading streaming provider data' });
}

const movies = ref(asyncDataResult.value?.movies || {});
const tvShows = ref(asyncDataResult.value?.tvShows || {});

const metaTitle = computed(() => {
  return provider.value && provider.value.name ? `${provider.value.name} - Streaming Library` : 'Streaming Library';
});

useHead({
  title: metaTitle,
  meta: [
    { property: 'og:title', content: metaTitle },
    { property: 'og:url', content: `${config.public.frontendUrl}${route.path}` },
  ],
  bodyAttrs: {
    class: 'topnav-active',
  },
});

const movieGenres = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
  { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" }, { id: 53, name: "Thriller" }, { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" }, { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentary" }, { id: 18, name: "Drama" },
  { id: 10751, name: "Family" }, { id: 10762, name: "Kids" }, { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" }, { id: 10764, name: "Reality" }, { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" }, { id: 10767, name: "Talk" }, { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];

const currentGenreList = computed(() => {
    return activeTab.value === 'movies' ? movieGenres : tvGenres;
});

const hasActiveFilters = computed(() => {
    return selectedGenre.value !== '' || 
           customYearStart.value !== null || 
           customYearEnd.value !== null ||
           minImdbRating.value !== null ||
           maxImdbRating.value !== null ||
           minImdbVotes.value !== null ||
           maxImdbVotes.value !== null ||
           orderMode.value !== 'popularity.desc';
});

const activeFilterChips = computed(() => {
    const chips = [];
    if (selectedGenreName.value) chips.push({ label: selectedGenreName.value, value: 'selectedGenre' });
    if (customYearStart.value) chips.push({ label: `From ${customYearStart.value}`, value: 'customYearStart' });
    if (customYearEnd.value) chips.push({ label: `To ${customYearEnd.value}`, value: 'customYearEnd' });
    
    if (minImdbRating.value !== null || maxImdbRating.value !== null) {
       let label = '';
       if (minImdbRating.value !== null && maxImdbRating.value !== null) {
          label = minImdbRating.value === maxImdbRating.value ? `Rating: ${minImdbRating.value}` : `Rating: ${minImdbRating.value}-${maxImdbRating.value}`;
       } else if (minImdbRating.value !== null) {
          label = `Rating: ≥ ${minImdbRating.value}`;
       } else {
          label = `Rating: ≤ ${maxImdbRating.value}`;
       }
       chips.push({ label, value: 'imdbRating' });
    }

    if (minImdbVotes.value !== null || maxImdbVotes.value !== null) {
       let label = '';
       if (minImdbVotes.value !== null && maxImdbVotes.value !== null) {
          label = `Votes: ${minImdbVotes.value}-${maxImdbVotes.value}`;
       } else if (minImdbVotes.value !== null) {
          label = `Votes: ≥ ${minImdbVotes.value}`;
       } else {
          label = `Votes: ≤ ${maxImdbVotes.value}`;
       }
       chips.push({ label, value: 'imdbVotes' });
    }
    
    if (orderMode.value !== 'popularity.desc') chips.push({ label: `Sort: ${currentSortLabel.value}`, value: 'orderMode' });
    return chips;
});

const sortOptions = computed(() => {
    const isMovie = activeTab.value === 'movies';
    const dateField = isMovie ? 'primary_release_date' : 'first_air_date';
    
    return [
        { value: 'popularity.desc', label: 'Popularity' },
        { value: `${dateField}.desc`, label: 'Newer Releases' },
        { value: `${dateField}.asc`, label: 'Older Releases' },
        { value: 'vote_average.desc', label: 'Highest Rated' },
        { value: 'vote_average.asc', label: 'Lowest Rated' },
        { value: 'vote_count.desc', label: 'Highest Vote Count' },
        { value: 'vote_count.asc', label: 'Lowest Vote Count' }
    ];
});

const currentSortLabel = computed(() => {
    const option = sortOptions.value.find(opt => opt.value === orderMode.value);
    return option ? option.label : 'Popularity';
});

const yearRanges = ['1960-1980', '1980-2000', '2000-2010', '2010-2020', `2020-${currentYear}`];

const resultCount = computed(() => {
    const source = activeTab.value === 'movies' ? movies.value : tvShows.value;
    const total = source && source.total_results;
    if (!total) return '';
    return `${total.toLocaleString('en-US')} ${activeTab.value === 'movies' ? 'movies' : 'shows'}`;
});

const advancedFilterCount = computed(() => {
    let count = 0;
    if (customYearStart.value !== null || customYearEnd.value !== null) count += 1;
    if (minImdbRating.value !== null || maxImdbRating.value !== null) count += 1;
    if (minImdbVotes.value !== null || maxImdbVotes.value !== null) count += 1;
    if (orderMode.value !== 'popularity.desc') count += 1;
    return count;
});

const pickGenre = (id, name) => {
    if (selectedGenre.value === id) return;
    selectedGenre.value = id;
    selectedGenreName.value = name;
    fetchData();
};


const getApiFilters = () => {
    const apiFilters = { sort_by: orderMode.value };
    if (selectedGenre.value) apiFilters.with_genres = selectedGenre.value;
    
    if (activeTab.value === 'movies') {
        if (customYearStart.value) apiFilters['primary_release_date.gte'] = `${customYearStart.value}-01-01`;
        if (customYearEnd.value) apiFilters['primary_release_date.lte'] = `${customYearEnd.value}-12-31`;
    } else {
        if (customYearStart.value) apiFilters['first_air_date.gte'] = `${customYearStart.value}-01-01`;
        if (customYearEnd.value) apiFilters['first_air_date.lte'] = `${customYearEnd.value}-12-31`;
    }

    if (minImdbRating.value !== null) apiFilters['vote_average.gte'] = minImdbRating.value;
    if (maxImdbRating.value !== null) apiFilters['vote_average.lte'] = maxImdbRating.value;
    if (minImdbVotes.value !== null) apiFilters['vote_count.gte'] = minImdbVotes.value;
    if (maxImdbVotes.value !== null) apiFilters['vote_count.lte'] = maxImdbVotes.value;

    return apiFilters;
};

const fetchData = async () => {
    const filters = getApiFilters();
    if (activeTab.value === 'movies') {
        moviesLoading.value = true;
        try {
            const data = await getMoviesByProvider(providerId, 1, filters);
            movies.value = data;
        } catch(e) { console.error(e); }
        moviesLoading.value = false;
    } else {
        tvShowsLoading.value = true;
        try {
            const data = await getTvShowsByProvider(providerId, 1, filters);
            tvShows.value = data;
        } catch(e) { console.error(e); }
        tvShowsLoading.value = false;
    }
};

const applyFilters = () => {
    fetchData();
    closeFiltersModal();
};

const clearAllFilters = () => {
    selectedGenre.value = '';
    selectedGenreName.value = '';
    customYearStart.value = null;
    customYearEnd.value = null;
    minImdbRating.value = null;
    maxImdbRating.value = null;
    minImdbVotes.value = null;
    maxImdbVotes.value = null;
    orderMode.value = 'popularity.desc';
    fetchData();
    filtersModalVisible.value = false;
};

const removeFilter = (key) => {
     if (key === 'orderMode') orderMode.value = 'popularity.desc';
     else if (key === 'selectedGenre') { selectedGenre.value = ''; selectedGenreName.value = ''; }
     else if (key === 'imdbRating') { minImdbRating.value = null; maxImdbRating.value = null; }
     else if (key === 'imdbVotes') { minImdbVotes.value = null; maxImdbVotes.value = null; }
     else if (key.includes('Year')) { customYearStart.value = null; customYearEnd.value = null; }
     fetchData();
};

const handleShowRatedModal = () => {
  showRatedItems.value = true;
};

const toggleTab = (event) => {
  activeTab.value = event.target.checked ? 'tvShows' : 'movies';
  if (selectedGenre.value) {
      selectedGenre.value = '';
      selectedGenreName.value = '';
  }
  fetchData();
};

const loadMoreMovies = () => {
  if (movies.value.page >= movies.value.total_pages || moviesLoading.value) return;

  moviesLoading.value = true;
  const nextPage = movies.value.page + 1;
  const filters = getApiFilters();

  getMoviesByProvider(providerId, nextPage, filters)
    .then((response) => {
      if (response.results) {
        movies.value.results = [...movies.value.results, ...response.results];
      }
      movies.value.page = nextPage;
      moviesLoading.value = false;
    })
    .catch(() => {
      moviesLoading.value = false;
    });
};

const loadMoreTVShows = () => {
  if (tvShows.value.page >= tvShows.value.total_pages || tvShowsLoading.value) return;

  tvShowsLoading.value = true;
  const nextPage = tvShows.value.page + 1;
  const filters = getApiFilters();

  getTvShowsByProvider(providerId, nextPage, filters)
    .then((response) => {
      if (response.results) {
        tvShows.value.results = [...tvShows.value.results, ...response.results];
      }
      tvShows.value.page = nextPage;
      tvShowsLoading.value = false;
    })
    .catch(() => {
      tvShowsLoading.value = false;
    });
};

const openFiltersModal = () => { filtersModalVisible.value = true; };
const closeFiltersModal = () => { filtersModalVisible.value = false; };
const selectSort = (val) => { orderMode.value = val; };
const setYearRange = (range) => {
    const [start, end] = range.split('-').map(Number);
    customYearStart.value = start;
    customYearEnd.value = end;
};

onMounted(() => {
  if ($bus && $bus.$on) {
    $bus.$on('show-rated-modal', handleShowRatedModal);
  }
});

onUnmounted(() => {
  if ($bus && $bus.$off) {
    $bus.$off('show-rated-modal', handleShowRatedModal);
  }
});
</script>

<style scoped lang="scss">
.sp-toolbar {
  padding: 0 4%;
  margin: -20px 0 26px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  font-size: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 0 0 auto;
}

.switch input {
  display: none;
}

.switch span {
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: #8F989E;
  font-weight: 500;
  white-space: nowrap;
}

.switch input:not(:checked) ~ span:first-of-type,
.switch input:checked ~ span:last-of-type {
  background-color: #8BE9FD;
  color: #000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.sp-toolbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.sp-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.sp-result-count {
  font-size: 1.2rem;
  color: #80868b;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.sp-refine {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 500;
  color: #ACAFB5;
  background: rgba(3, 4, 6, 0.55);
  border: 1px solid rgba(139, 233, 253, 0.2);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  svg {
    flex: 0 0 auto;
  }

  &.is-on {
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.55);
    background: rgba(139, 233, 253, 0.08);
  }
}

@media (hover: hover) and (pointer: fine) {
  .sp-refine:hover {
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.5);
  }
}

.sp-refine__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #041014;
  background: #8BE9FD;
}

.sp-genres {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;
  scroll-snap-type: x proximity;

  &::-webkit-scrollbar {
    display: none;
  }
}

.sp-genre {
  flex: 0 0 auto;
  scroll-snap-align: start;
  height: 30px;
  padding: 0 13px;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  color: #9aa0a6;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &.is-on {
    color: #041014;
    font-weight: 600;
    background: #8BE9FD;
    border-color: #8BE9FD;
  }
}

@media (hover: hover) and (pointer: fine) {
  .sp-genre:not(.is-on):hover {
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.4);
    background: rgba(139, 233, 253, 0.06);
  }
}

.sp-active {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sp-active__chips {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  min-width: 0;
}

.sp-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 6px 0 11px;
  border-radius: 999px;
  font-size: 1.15rem;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.09);
  border: 1px solid rgba(139, 233, 253, 0.26);
}

.sp-chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 999px;
  color: inherit;
  background: rgba(139, 233, 253, 0.16);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(139, 233, 253, 0.32);
  }
}

.sp-clear-all {
  padding: 0;
  border: none;
  background: none;
  font-size: 1.15rem;
  color: #80868b;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #8BE9FD;
  }
}

.sp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 42px 20px 56px;

  h3 {
    margin: 0 0 8px;
    font-size: 1.7rem;
    font-weight: 600;
    color: #fff;
  }

  p {
    margin: 0;
    max-width: 42ch;
    font-size: 1.35rem;
    line-height: 1.5;
    color: #80868b;
  }
}

.sp-empty__art {
  height: 96px;
  margin-bottom: 18px;
  opacity: 0.4;
}

.sp-empty__action {
  flex: 0 0 auto;
  width: auto;
  min-width: 150px;
  margin-top: 20px;
  padding: 0 22px;
}

.sp-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(2, 6, 9, 0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.sp-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background-color: #040E13;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.06' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E"),
    radial-gradient(110% 80% at 8% 0%, rgba(31, 84, 103, 0.26), transparent 52%),
    linear-gradient(150deg, #071820 0%, #040D12 58%, #02080B 100%);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 233, 253, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.sp-modal__close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.22);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(139, 233, 253, 0.18);
    border-color: rgba(139, 233, 253, 0.45);
  }
}

.sp-modal__head {
  flex: 0 0 auto;
  padding: 22px 60px 16px 24px;

  h3 {
    margin: 0 0 5px;
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1.45;
    color: #80868b;
  }
}

.sp-modal__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sp-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.sp-field__label {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7378;
}

.sp-range {
  display: flex;
  align-items: center;
  gap: 9px;

  input {
    flex: 1 1 0;
    min-width: 0;
    height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    font-size: 1.35rem;
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    appearance: textfield;
    -moz-appearance: textfield;
    transition: border-color 0.2s ease, background 0.2s ease;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      -webkit-appearance: none;
      margin: 0;
    }

    &::placeholder {
      color: #5f676c;
    }

    &:focus {
      outline: none;
      border-color: rgba(139, 233, 253, 0.55);
      background: rgba(139, 233, 253, 0.06);
    }
  }

  em {
    flex: 0 0 auto;
    font-style: normal;
    font-size: 1.15rem;
    color: #6b7378;
  }
}

.sp-quick {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.sp-quick__btn {
  flex: 0 0 auto;
  height: 27px;
  padding: 0 11px;
  border-radius: 999px;
  font-size: 1.1rem;
  white-space: nowrap;
  color: #9aa0a6;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.4);
  }
}

.sp-sort {
  display: grid;
  grid-template-columns: 1fr;
  gap: 7px;
}

.sp-sort__btn {
  height: 36px;
  padding: 0 13px;
  border-radius: 10px;
  font-size: 1.3rem;
  text-align: left;
  color: #ACAFB5;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &.is-on {
    color: #8BE9FD;
    border-color: rgba(139, 233, 253, 0.5);
    background: rgba(139, 233, 253, 0.08);
  }

  &:not(.is-on):hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.sp-modal__foot {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
}

.sp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 36px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.sp-btn--ghost {
  color: #ACAFB5;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
  }
}

.sp-btn--solid {
  padding: 0 22px;
  color: #041014;
  background: #8BE9FD;
  border: 1px solid #8BE9FD;

  &:hover {
    background: #6bd7eb;
    border-color: #6bd7eb;
  }
}

@media (min-width: 640px) {
  .sp-toolbar {
    gap: 14px;
  }

  .sp-modal__head {
    padding: 26px 64px 18px 28px;

    h3 {
      font-size: 2rem;
    }
  }

  .sp-modal__body {
    padding: 4px 28px 22px;
    gap: 22px;
  }

  .sp-modal__foot {
    padding: 16px 28px 22px;
  }

  .sp-sort {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 639px) {
  .sp-modal__foot {
    justify-content: stretch;
  }

  .sp-btn {
    flex: 1 1 0;
    height: 40px;
  }

  .sp-btn--solid {
    flex: 1.4 1 0;
  }

  .switch {
    font-size: 1.25rem;
  }

  .switch span {
    padding: 7px 14px;
  }

  .sp-toolbar {
    margin-top: -8px;
  }

  .sp-toolbar__row {
    flex-wrap: nowrap;
  }

  .sp-result-count {
    font-size: 1.1rem;
  }

  .sp-refine span:not(.sp-refine__count) {
    display: none;
  }

  .sp-refine {
    padding: 0 11px;
  }

  .sp-modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .sp-modal {
    max-width: none;
    max-height: 88vh;
    max-height: 88dvh;
    border-radius: 20px 20px 0 0;
    border-bottom: none;
  }
}
</style>
