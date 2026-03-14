<template>
  <main class="discover-page">
    <p v-if="props.filtersOpen && !selectedGenre" class="default-note">Selecciona un género para descubrir {{ selectedType === 'movie' ? 'Películas' : 'Series' }}</p>

    <div v-show="props.filtersOpen" class="discover-controls">

      <div v-show="props.filtersOpen" class="filters-grid" :class="{ 'filters-grid--disabled': !selectedType }">

        <div class="filter-cell">
          <span class="filter-label">Género</span>
          <div class="custom-select" @click.stop="selectedType ? toggleDropdown('genre') : null">
            <div class="select-display" :class="{ 'select-display--active': selectedGenre }">
              <span>{{ selectedGenre ? getGenreName(selectedGenre) : 'Selecciona un género' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.genre }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.genre" class="dropdown-options">
              <div class="dropdown-option" @click.stop="selectGenre('')">Selecciona un género</div>
              <div
                v-for="genre in currentGenres"
                :key="genre.id"
                class="dropdown-option"
                :class="{ 'dropdown-option--selected': selectedGenre === genre.id }"
                @click.stop="selectGenre(genre.id)"
              >{{ genre.name }}</div>
            </div>
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Ordenar por</span>
          <div class="custom-select" @click.stop="selectedType ? toggleDropdown('sort') : null">
            <div class="select-display select-display--active">
              <span>{{ getSortLabel(selectedSort) }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.sort }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.sort" class="dropdown-options">
              <div
                v-for="opt in sortOptions"
                :key="opt.value"
                class="dropdown-option"
                :class="{ 'dropdown-option--selected': selectedSort === opt.value }"
                @click.stop="selectSort(opt.value)"
              >{{ opt.label }}</div>
            </div>
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">País</span>
          <div class="custom-select" @click.stop="selectedType ? toggleDropdown('country') : null">
            <div class="select-display" :class="{ 'select-display--active': selectedCountry }">
              <span>{{ selectedCountry ? getCountryName(selectedCountry) : 'Todos los países' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.country }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.country" class="dropdown-options dropdown-options--tall">
              <div class="dropdown-option" @click.stop="selectCountry('')">Todos los países</div>
              <div
                v-for="country in countries"
                :key="country.code"
                class="dropdown-option"
                :class="{ 'dropdown-option--selected': selectedCountry === country.code }"
                @click.stop="selectCountry(country.code)"
              >{{ country.name }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedType === 'tv'" class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Canal</span>
          <div class="custom-select" @click.stop="toggleDropdown('network')">
            <div class="select-display" :class="{ 'select-display--active': selectedNetwork }">
              <span>{{ selectedNetwork ? getNetworkLabel(selectedNetwork) : 'Todos los canales' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.network }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.network" class="dropdown-options">
              <div class="dropdown-option" @click.stop="selectNetwork('')">Todos los canales</div>
              <div v-for="net in networks" :key="net.id" class="dropdown-option" :class="{ 'dropdown-option--selected': selectedNetwork === net.id }" @click.stop="selectNetwork(net.id)">{{ net.name }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedType === 'movie'" class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Streaming (ES)</span>
          <div class="custom-select" @click.stop="toggleDropdown('provider')">
            <div class="select-display" :class="{ 'select-display--active': selectedProvider }">
              <span>{{ selectedProvider ? getNetworkLabel(selectedProvider) : 'Todos los servicios' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.provider }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.provider" class="dropdown-options">
              <div class="dropdown-option" @click.stop="selectProvider('')">Todos los servicios</div>
              <div v-for="net in networks" :key="net.id" class="dropdown-option" :class="{ 'dropdown-option--selected': selectedProvider === net.id }" @click.stop="selectProvider(net.id)">{{ net.name }}</div>
            </div>
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Idioma original</span>
          <div class="custom-select" @click.stop="selectedType ? toggleDropdown('language') : null">
            <div class="select-display" :class="{ 'select-display--active': selectedLanguage }">
              <span>{{ selectedLanguage ? getLanguageName(selectedLanguage) : 'Todos los idiomas' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.language }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.language" class="dropdown-options dropdown-options--tall">
              <div class="dropdown-option" @click.stop="selectLanguage('')">Todos los idiomas</div>
              <div
                v-for="lang in languages"
                :key="lang.code"
                class="dropdown-option"
                :class="{ 'dropdown-option--selected': selectedLanguage === lang.code }"
                @click.stop="selectLanguage(lang.code)"
              >{{ lang.name }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedType === 'movie'" class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Formato</span>
          <div class="custom-select" @click.stop="toggleDropdown('format')">
            <div class="select-display select-display--active">
              <span>{{ formatType === 'feature' ? 'Largometrajes' : 'Cortometrajes' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.format }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.format" class="dropdown-options">
              <div class="dropdown-option" :class="{ 'dropdown-option--selected': formatType === 'feature' }" @click.stop="selectFormat('feature')">Largometrajes</div>
              <div class="dropdown-option" :class="{ 'dropdown-option--selected': formatType === 'short' }" @click.stop="selectFormat('short')">Cortometrajes</div>
            </div>
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Año desde</span>
          <div class="input-wrap">
            <span class="input-display">{{ yearFrom || '1888' }}</span>
            <input
              type="text"
              inputmode="numeric"
              :value="yearFrom || ''"
              placeholder="1888"
              :disabled="!selectedType"
              @input="yearFrom = $event.target.value ? parseInt($event.target.value) : null"
              @change="onYearChange"
            >
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Año hasta</span>
          <div class="input-wrap">
            <span class="input-display">{{ yearTo || currentYear }}</span>
            <input
              type="text"
              inputmode="numeric"
              :value="yearTo || ''"
              :placeholder="currentYear"
              :disabled="!selectedType"
              @input="yearTo = $event.target.value ? parseInt($event.target.value) : null"
              @change="onYearChange"
            >
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Puntuación mín.</span>
          <div class="input-wrap">
            <span class="input-display">{{ ratingMin !== null ? ratingMin : '0' }}</span>
            <input
              type="text"
              inputmode="decimal"
              :value="ratingMin !== null ? ratingMin : ''"
              placeholder="0"
              :disabled="!selectedType"
              @input="ratingMin = $event.target.value !== '' ? parseFloat($event.target.value) : null"
              @change="onRatingChange"
            >
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Puntuación máx.</span>
          <div class="input-wrap">
            <span class="input-display">{{ ratingMax !== null ? ratingMax : '10' }}</span>
            <input
              type="text"
              inputmode="decimal"
              :value="ratingMax !== null ? ratingMax : ''"
              placeholder="10"
              :disabled="!selectedType"
              @input="ratingMax = $event.target.value !== '' ? parseFloat($event.target.value) : null"
              @change="onRatingChange"
            >
          </div>
        </div>

        <div class="filter-cell" :class="{ 'filter-cell--disabled': !selectedGenre }">
          <span class="filter-label">Votos mín.</span>
          <div class="custom-select" @click.stop="selectedType ? toggleDropdown('minVotes') : null">
            <div class="select-display" :class="{ 'select-display--active': selectedMinVotes !== 10 }">
              <span>{{ getMinVotesLabel(selectedMinVotes) }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'arrow-up': dropdowns.minVotes }"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div v-if="dropdowns.minVotes" class="dropdown-options">
              <div
                v-for="opt in minVoteOptions"
                :key="opt.value"
                class="dropdown-option"
                :class="{ 'dropdown-option--selected': selectedMinVotes === opt.value }"
                @click.stop="selectMinVotes(opt.value)"
              >{{ opt.label }}</div>
            </div>
          </div>
        </div>

        <div v-if="activeChips.length > 0" class="filter-cell filter-cell--clear">
          <span class="filter-label">&nbsp;</span>
          <button class="clear-btn" @click="clearAllFilters">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Limpiar todo
          </button>
        </div>

      </div>

      <div v-if="activeChips.length > 0" class="chips-row">
        <div v-for="chip in activeChips" :key="chip.type" class="chip">
          <span>{{ chip.label }}</span>
          <button class="chip-remove" @click="removeChip(chip)">×</button>
        </div>
      </div>
    </div>

    <div v-if="results.length > 0 || loading" class="results-section">
      <div class="results-meta" v-if="results.length > 0">
        <span>{{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} cargado{{ results.length !== 1 ? 's' : '' }}</span>
      </div>

      <ListingCarousel
        v-if="results.length > 0"
        :items="{ results }"
      />

      <div class="grid-loader" v-if="loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 44 44" stroke="#8BE9FD"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle></g></svg>
      </div>

      <div v-if="!loading && currentPage < totalPages" class="load-more-row">
        <button class="load-more-btn" @click="loadMore">Cargar más</button>
      </div>

      <div v-if="!loading && currentPage >= totalPages && results.length > 0" class="end-of-results">
        Todos los resultados cargados
      </div>
    </div>

    <div v-else-if="searchPerformed && !loading" class="empty-state">
      <p>Sin resultados. Intenta ajustar los filtros.</p>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { countries } from '~/utils/countries';
import ListingCarousel from '~/components/ListingCarousel.vue';

const props = defineProps({
  defaultType: { type: String, required: true, validator: (value) => ['movie', 'tv'].includes(value) },
  filtersOpen: { type: Boolean, default: false }
});

const route = useRoute();
const router = useRouter();

useHead({
  title: 'Cinemagoria - Descubrir',
  meta: [
    { property: 'og:title', content: 'Descubrir' },
    { property: 'og:url', content: `https://es.cinemagoria.com${route.path}` },
  ],
  bodyAttrs: {
    class: 'page page-discover',
  },
});

const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.apiKey;
const apiLang = runtimeConfig.public.apiLang || 'es-ES';
const apiUrl = 'https://api.themoviedb.org/3';

const selectedType = ref(props.defaultType);
const selectedGenre = ref('');
const selectedSort = ref('imdb_rating.desc');
const selectedCountry = ref('');
const selectedNetwork = ref('');
const selectedLanguage = ref('');
const selectedProvider = ref('');
const selectedMinVotes = ref(10);
const formatType = ref('feature');
const yearFrom = ref(null);
const yearTo = ref(null);
const ratingMin = ref(null);
const ratingMax = ref(null);

const results = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const searchPerformed = ref(false);
const currentYear = new Date().getFullYear();

const dropdowns = ref({
  genre: false,
  sort: false,
  country: false,
  network: false,
  format: false,
  language: false,
  provider: false,
  minVotes: false,
});

const movieGenres = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 14, name: 'Fantasía' },
  { id: 36, name: 'Historia' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 10770, name: 'Película de TV' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Bélica' },
  { id: 37, name: 'Western' },
];

const tvGenres = [
  { id: 10759, name: 'Acción y aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 36, name: 'Historia' },
  { id: 10402, name: 'Música' },
  { id: 10749, name: 'Romance' },
  { id: 10765, name: 'Ciencia ficción y fantasía' },
  { id: 10767, name: 'Talk Show' },
  { id: 37, name: 'Western' },
];

const networks = [
  { id: '2552', name: 'Apple TV+' },
  { id: '2739', name: 'Disney+' },
  { id: '453', name: 'Hulu' },
  { id: '6783', name: 'Max' },
  { id: '213', name: 'Netflix' },
  { id: '1024', name: 'Prime Video' },
];

const sortOptions = [
  { value: 'popularity.desc', label: 'Más populares' },
  { value: 'primary_release_date.desc', label: 'Últimos estrenos' },
  { value: 'revenue.desc', label: 'Mayor recaudación' },
  { value: 'imdb_rating.desc', label: 'Mejor valoradas (IMDb)' },
  { value: 'imdb_rating.asc', label: 'Peor valoradas (IMDb)' },
  { value: 'imdb_votes.desc', label: 'Más votadas (IMDb)' },
  { value: 'imdb_votes.asc', label: 'Menos votadas (IMDb)' },
];

const languages = [
  { code: 'en', name: 'Inglés' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Francés' },
  { code: 'ja', name: 'Japonés' },
  { code: 'ko', name: 'Coreano' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Alemán' },
  { code: 'zh', name: 'Chino' },
  { code: 'pt', name: 'Portugués' },
];

const minVoteOptions = [
  { value: 0, label: 'Cualquiera (0+)' },
  { value: 10, label: '10+ votos' },
  { value: 100, label: '100+ votos' },
  { value: 500, label: '500+ votos' },
  { value: 1000, label: '1K+ votos' },
  { value: 5000, label: '5K+ votos' },
  { value: 10000, label: '10K+ votos' },
];

const CLIENT_SORT_API_FALLBACK = 'popularity.desc';
const CLIENT_SORT_PAGES = 3;

function isClientSort(sortValue) {
  return sortValue.startsWith('imdb_');
}

function applyClientSort(items, sortValue) {
  const sorted = [...items];

  const getRating = item => {
    if (item.imdb_rating) return parseFloat(item.imdb_rating);
    if (item.vote_average) return parseFloat(item.vote_average);
    return 0;
  };

  const getVotes = item => {
    if (item.imdb_votes) {
      return typeof item.imdb_votes === 'string'
        ? parseInt(item.imdb_votes.replace(/,/g, ''), 10)
        : Number(item.imdb_votes) || 0;
    }
    return item.vote_count || 0;
  };

  if (sortValue === 'imdb_rating.desc') sorted.sort((a, b) => getRating(b) - getRating(a));
  else if (sortValue === 'imdb_rating.asc') sorted.sort((a, b) => getRating(a) - getRating(b));
  else if (sortValue === 'imdb_votes.desc') sorted.sort((a, b) => getVotes(b) - getVotes(a));
  else if (sortValue === 'imdb_votes.asc') sorted.sort((a, b) => getVotes(a) - getVotes(b));
  return sorted;
}

const currentGenres = computed(() =>
  selectedType.value === 'movie' ? movieGenres : tvGenres
);

const activeChips = computed(() => {
  const chips = [];
  if (selectedGenre.value) chips.push({ label: getGenreName(selectedGenre.value), type: 'genre' });
  if (selectedSort.value !== 'imdb_rating.desc') chips.push({ label: getSortLabel(selectedSort.value), type: 'sort' });
  if (selectedCountry.value) chips.push({ label: getCountryName(selectedCountry.value), type: 'country' });
  if (selectedNetwork.value) chips.push({ label: getNetworkLabel(selectedNetwork.value), type: 'network' });
  if (selectedProvider.value) chips.push({ label: getNetworkLabel(selectedProvider.value), type: 'provider' });
  if (selectedLanguage.value) chips.push({ label: getLanguageName(selectedLanguage.value), type: 'language' });
  if (selectedMinVotes.value !== 10) chips.push({ label: getMinVotesLabel(selectedMinVotes.value), type: 'minVotes' });
  if (yearFrom.value) chips.push({ label: `Desde ${yearFrom.value}`, type: 'yearFrom' });
  if (yearTo.value) chips.push({ label: `Hasta ${yearTo.value}`, type: 'yearTo' });
  if (ratingMin.value) chips.push({ label: `Puntuación ≥ ${ratingMin.value}`, type: 'ratingMin' });
  if (ratingMax.value) chips.push({ label: `Puntuación ≤ ${ratingMax.value}`, type: 'ratingMax' });
  return chips;
});

function getGenreName(id) {
  return currentGenres.value.find(g => g.id === id)?.name || '';
}

function getLanguageName(code) {
  return languages.find(l => l.code === code)?.name || code;
}

function getMinVotesLabel(val) {
  return minVoteOptions.find(o => o.value === val)?.label || `${val}+ votos`;
}

function getSortLabel(value) {
  return sortOptions.find(o => o.value === value)?.label || 'Mejor valoradas';
}

function getCountryName(code) {
  return countries.find(c => c.code === code)?.name || code;
}

function getNetworkLabel(id) {
  return networks.find(n => n.id === id)?.name || '';
}

function toggleDropdown(key) {
  const current = dropdowns.value[key];
  Object.keys(dropdowns.value).forEach(k => dropdowns.value[k] = false);
  dropdowns.value[key] = !current;
}

function closeAllDropdowns() {
  Object.keys(dropdowns.value).forEach(k => dropdowns.value[k] = false);
}

function selectGenre(id) {
  selectedGenre.value = id;
  dropdowns.value.genre = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectSort(value) {
  const newIsClientSort = isClientSort(value);
  selectedSort.value = value;
  dropdowns.value.sort = false;
  syncToUrl();
  if (newIsClientSort && results.value.length > 0) {
    results.value = applyClientSort(results.value, value);
  } else {
    fetchResults(1, true);
  }
}

function selectCountry(code) {
  selectedCountry.value = code;
  dropdowns.value.country = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectNetwork(id) {
  selectedNetwork.value = id;
  dropdowns.value.network = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectProvider(id) {
  selectedProvider.value = id;
  dropdowns.value.provider = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectLanguage(code) {
  selectedLanguage.value = code;
  dropdowns.value.language = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectMinVotes(val) {
  selectedMinVotes.value = val;
  dropdowns.value.minVotes = false;
  syncToUrl();
  fetchResults(1, true);
}

function selectFormat(value) {
  formatType.value = value;
  dropdowns.value.format = false;
  syncToUrl();
  fetchResults(1, true);
}

function onYearChange() {
  syncToUrl();
  fetchResults(1, true);
}

function onRatingChange() {
  syncToUrl();
  fetchResults(1, true);
}

function clearAllFilters() {
  selectedGenre.value = '';
  selectedSort.value = 'imdb_rating.desc';
  selectedCountry.value = '';
  selectedNetwork.value = '';
  selectedProvider.value = '';
  selectedLanguage.value = '';
  selectedMinVotes.value = 10;
  yearFrom.value = null;
  yearTo.value = null;
  ratingMin.value = null;
  ratingMax.value = null;
  syncToUrl();
  fetchResults(1, true);
}

function removeChip(chip) {
  switch (chip.type) {
    case 'genre': selectedGenre.value = ''; break;
    case 'sort': selectedSort.value = 'imdb_rating.desc'; break;
    case 'country': selectedCountry.value = ''; break;
    case 'network': selectedNetwork.value = ''; break;
    case 'provider': selectedProvider.value = ''; break;
    case 'language': selectedLanguage.value = ''; break;
    case 'minVotes': selectedMinVotes.value = 10; break;
    case 'yearFrom': yearFrom.value = null; break;
    case 'yearTo': yearTo.value = null; break;
    case 'ratingMin': ratingMin.value = null; break;
    case 'ratingMax': ratingMax.value = null; break;
  }
  syncToUrl();
  fetchResults(1, true);
}

function buildParams(page) {
  const isMovie = selectedType.value === 'movie';
  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('language', apiLang);
  params.set('include_adult', 'false');
  params.set('vote_count.gte', selectedMinVotes.value.toString());
  params.set('page', page);

  let apiSort = selectedSort.value;
  if (isClientSort(selectedSort.value)) {
    apiSort = CLIENT_SORT_API_FALLBACK;
  } else if (selectedSort.value === 'revenue.desc' && !isMovie) {
    apiSort = 'popularity.desc';
  }
  params.set('sort_by', apiSort);

  if (selectedGenre.value) params.set('with_genres', selectedGenre.value);
  if (selectedCountry.value) params.set('with_origin_country', selectedCountry.value);
  if (selectedLanguage.value) params.set('with_original_language', selectedLanguage.value);

  if (selectedNetwork.value && !isMovie) params.set('with_networks', selectedNetwork.value);
  if (selectedProvider.value && isMovie) {
    params.set('with_watch_providers', selectedProvider.value);
    params.set('watch_region', 'ES');
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
    if (formatType.value === 'feature') {
      params.set('with_runtime.gte', 40);
    } else {
      params.set('with_runtime.lte', 39);
    }
  }

  return params.toString();
}

async function fetchWithTimeout(url, ms = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function enrichItem(item, type) {
  item.media_type = type;
  item.vote_average = parseFloat(item.vote_average).toFixed(1);
  item.rating_source = 'tmdb';

  try {
    const detailsRes = await fetchWithTimeout(
      `${apiUrl}/${type}/${item.id}?api_key=${apiKey}&append_to_response=external_ids`
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
  }

  return item;
}

async function fetchPageRaw(type, page) {
  const params = buildParams(page);
  const res = await fetch(`${apiUrl}/discover/${type}?${params}`);
  const data = await res.json();
  return data;
}

async function fetchResults(page = 1, reset = false) {
  if (!selectedType.value || !selectedGenre.value) {
    results.value = [];
    return;
  }
  loading.value = true;
  if (reset) {
    results.value = [];
    currentPage.value = 1;
    totalPages.value = 1;
  }

  const EXCLUDED_TV_IDS = [276880];

  try {
    const type = selectedType.value;
    const clientSort = isClientSort(selectedSort.value);

    if (clientSort) {
      const pagesToFetch = reset ? CLIENT_SORT_PAGES : 1;
      const startPage = reset ? 1 : currentPage.value + 1;
      const pageNums = Array.from({ length: pagesToFetch }, (_, i) => startPage + i);

      const allData = await Promise.all(pageNums.map(p => fetchPageRaw(type, p)));
      const firstData = allData[0];
      totalPages.value = firstData.total_pages || 1;
      currentPage.value = pageNums[pageNums.length - 1];
      searchPerformed.value = true;

      let allResults = allData.flatMap(d => d.results || []);
      const seenIds = new Set();
      allResults = allResults.filter(item => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });

      if (type === 'tv') {
        allResults = allResults.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
      }

      allResults.sort((a, b) => parseFloat(b.vote_average || 0) - parseFloat(a.vote_average || 0));
      
      const enriched = [];
      const CHUNK_SIZE = 20;
      for (let i = 0; i < allResults.length; i += CHUNK_SIZE) {
        const chunk = allResults.slice(i, i + CHUNK_SIZE);
        const chunkEnriched = await Promise.all(chunk.map(item => enrichItem(item, type)));
        enriched.push(...chunkEnriched);
      }

      let finalResults = enriched;
      if (ratingMin.value || ratingMax.value) {
        const min = ratingMin.value ? parseFloat(ratingMin.value) : 0;
        const max = ratingMax.value ? parseFloat(ratingMax.value) : 10;
        finalResults = enriched.filter(item => {
          const r = item.imdb_rating ? parseFloat(item.imdb_rating) : parseFloat(item.vote_average);
          return r >= min && r <= max;
        });
      }

      const sorted = applyClientSort(finalResults, selectedSort.value);
      results.value = reset ? sorted : applyClientSort([...results.value, ...sorted], selectedSort.value);

    } else {
      const data = await fetchPageRaw(type, page);
      totalPages.value = data.total_pages || 1;
      currentPage.value = data.page || page;
      searchPerformed.value = true;

      let pageResults = data.results || [];
      if (type === 'tv') {
        pageResults = pageResults.filter(item => !EXCLUDED_TV_IDS.includes(item.id));
      }

      pageResults.sort((a, b) => parseFloat(b.vote_average || 0) - parseFloat(a.vote_average || 0));
      
      const enriched = [];
      const CHUNK_SIZE = 20;
      for (let i = 0; i < pageResults.length; i += CHUNK_SIZE) {
        const chunk = pageResults.slice(i, i + CHUNK_SIZE);
        const chunkEnriched = await Promise.all(chunk.map(item => enrichItem(item, type)));
        enriched.push(...chunkEnriched);
      }

      if (ratingMin.value || ratingMax.value) {
        const min = ratingMin.value ? parseFloat(ratingMin.value) : 0;
        const max = ratingMax.value ? parseFloat(ratingMax.value) : 10;
        const filtered = enriched.filter(item => {
          const r = item.imdb_rating ? parseFloat(item.imdb_rating) : parseFloat(item.vote_average);
          return r >= min && r <= max;
        });
        results.value = reset ? filtered : [...results.value, ...filtered];
      } else {
        results.value = reset ? enriched : [...results.value, ...enriched];
      }
    }
  } catch (err) {
    console.error('Discover fetch error:', err);
  } finally {
    loading.value = false;
  }
}

async function loadMore() {
  if (loading.value || currentPage.value >= totalPages.value) return;
  await fetchResults(currentPage.value + 1, false);
}

function syncToUrl() {
  const query = {};
  if (selectedGenre.value) query.genre = selectedGenre.value;
  if (selectedSort.value !== 'imdb_rating.desc') query.sort = selectedSort.value;
  if (selectedCountry.value) query.country = selectedCountry.value;
  if (selectedNetwork.value) query.network = selectedNetwork.value;
  if (selectedProvider.value) query.provider = selectedProvider.value;
  if (formatType.value !== 'feature') query.format = formatType.value;
  if (selectedLanguage.value) query.language = selectedLanguage.value;
  if (selectedMinVotes.value !== 10) query.minVotes = selectedMinVotes.value;
  if (yearFrom.value) query.yearFrom = yearFrom.value;
  if (yearTo.value) query.yearTo = yearTo.value;
  if (ratingMin.value) query.ratingMin = ratingMin.value;
  if (ratingMax.value) query.ratingMax = ratingMax.value;

  router.replace({ query });
}

function loadFromUrl() {
  const q = route.query;
  if (q.genre) selectedGenre.value = Number(q.genre);
  if (q.sort) selectedSort.value = q.sort;
  if (q.country) selectedCountry.value = q.country;
  if (q.network) selectedNetwork.value = q.network;
  if (q.provider) selectedProvider.value = q.provider;
  if (q.format) formatType.value = q.format;
  if (q.language) selectedLanguage.value = q.language;
  if (q.minVotes) selectedMinVotes.value = Number(q.minVotes);
  if (q.yearFrom) yearFrom.value = Number(q.yearFrom);
  if (q.yearTo) yearTo.value = Number(q.yearTo);
  if (q.ratingMin) ratingMin.value = Number(q.ratingMin);
  if (q.ratingMax) ratingMax.value = Number(q.ratingMax);

  if (selectedGenre.value) {
    fetchResults(1, true);
  }
}

function onDocClick() {
  closeAllDropdowns();
}

onMounted(() => {
  loadFromUrl();
  document.addEventListener('click', onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
});
</script>
<style lang="scss" scoped>
.default-note {
  text-align: center;
  font-size: 13px;
  color: #acafb5;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.discover-page {
  width: 100%;
  box-sizing: border-box;
}

.discover-controls {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(127, 219, 241, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 0 1.5rem 2rem;
}

.type-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.type-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  border-radius: 30px;
  border: 1px solid rgba(127, 219, 241, 0.25);
  background: transparent;
  color: #acafb5;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(127, 219, 241, 0.5);
    color: #fff;
  }

  &--active {
    background: rgba(127, 219, 241, 0.15);
    border-color: #7FDBF1;
    color: #7FDBF1;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: end;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.filter-cell {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;

  &--clear {
    justify-content: flex-end;
  }

  &--disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.filter-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #5a6472;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.custom-select {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.select-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  box-sizing: border-box;
  height: 40px;
  min-height: 40px;
  padding: 0 1rem;
  background: rgba(3, 37, 48, 0.6);
  border: 1px solid rgba(127, 219, 241, 0.2);
  border-radius: 8px;
  color: #acafb5;
  font-size: 1.3rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &.arrow-up {
      transform: rotate(180deg);
    }
  }

  &:hover {
    border-color: rgba(127, 219, 241, 0.5);
    color: #fff;
  }

  &--active {
    border-color: #7FDBF1;
    color: #7FDBF1;
  }
}

.dropdown-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  background: #092739;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

  &--tall {
    max-height: 280px;
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(139, 233, 253, 0.3); border-radius: 2px; }
}

.dropdown-option {
  padding: 0.75rem 1rem;
  color: #e0e0e0;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(139, 233, 253, 0.1);
    color: #8BE9FD;
  }

  &--selected {
    color: #7FDBF1;
    background: rgba(127, 219, 241, 0.08);
  }
}

.year-range {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 40px;
  padding: 0 1rem;
  background: rgba(3, 37, 48, 0.6);
  border: 1px solid rgba(127, 219, 241, 0.2);
  border-radius: 8px;
  color: #acafb5;
  font-size: 1.3rem;
  transition: border-color 0.2s;
  cursor: text;

  &:focus-within {
    border-color: #7FDBF1;
    box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.15);
    color: #fff;
  }

  &:hover {
    border-color: rgba(127, 219, 241, 0.5);
  }

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0 1rem;
    background: transparent;
    border: none;
    outline: none;
    color: #acafb5;
    font-size: 1.3rem;
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    box-sizing: border-box;
    caret-color: #7FDBF1;

    &::placeholder { color: #5a6472; }
    &:focus { color: #fff; }
    &:disabled { cursor: not-allowed; opacity: 0.4; }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  }
}

.input-display {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 0 1rem;
  background: rgba(255, 60, 60, 0.15);
  border: 1px solid rgba(255, 60, 60, 0.3);
  border-radius: 8px;
  color: #ff7070;
  font-size: 1.3rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 60, 60, 0.25);
    border-color: rgba(255, 60, 60, 0.5);
  }
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 20px;
  color: #8BE9FD;
  font-size: 1.2rem;
}

.chip-remove {
  background: none;
  border: none;
  color: #8BE9FD;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.15s;

  &:hover { opacity: 1; }
}

.results-section {
  margin-top: 0;
  display: flex;
  flex-direction: column;

  :deep(.listing) {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}

.results-meta {
  font-size: 1.8rem;
  color: #8BE9FD;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 1.2rem;
  margin-left: 1.5rem;

  @media (min-width: 768px) {
    margin-left: 4rem;
  }

  @media (min-width: 1200px) {
    font-size: 2.4rem;
    margin-left: 5rem;
  }
}

.grid-loader {
  display: flex;
  justify-content: center;
  padding: 1rem 0 0 0;
}

.load-more-row {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0 0 0;
}

.load-more-btn {
  padding: 0.8rem 2.5rem;
  background: transparent;
  border: 1px solid rgba(127, 219, 241, 0.4);
  border-radius: 30px;
  color: #7FDBF1;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(127, 219, 241, 0.1);
    border-color: #7FDBF1;
  }
}

.end-of-results {
  text-align: center;
  padding: 1rem 0 0 0;
  font-size: 1.3rem;
  color: #5a6472;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 1rem;
  color: #5a6472;
  text-align: center;

  svg { opacity: 0.4; }

  p {
    font-size: 1.5rem;
    margin: 0;

    strong { color: #7FDBF1; }
  }
}

@media (max-width: 768px) {
  .discover-page {
    padding: 1.5rem 1rem 3rem;
  }

  .discover-title {
    font-size: 2.2rem;
  }

  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>