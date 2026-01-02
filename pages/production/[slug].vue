<template>
  <main class="main">
    <UserNav />
    <TopNav
      :title="metaTitle" />

    <ProductionHero
      v-if="company && company.id"
      :item="company"
      :backdrop-path="heroBackdrop"
      title="Productora" />

    <div class="list-page-controls">
         <div class="column">
             <div class="new-controls-container">
               <label class="switch">
                 <input type="checkbox" :checked="activeTab === 'tvShows'" @change="toggleTab">
                 <span>Películas</span>
                 <span>Series de TV</span>
               </label>
               
               <div class="action-buttons">
                 <button class="control-btn" @click="openFiltersModal">
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                   </svg>
                 </button>
               </div>
            </div>
             
            <div v-if="hasActiveFilters" class="active-filters-indicator">
              <div class="filter-chips">
                <div 
                  v-for="(chip, index) in activeFilterChips" 
                  :key="index" 
                  class="filter-chip"
                >
                  <span>{{ chip.label }}</span>
                  <button @click="removeFilter(chip.value)" class="chip-remove">×</button>
                </div>
              </div>
              <button @click="clearAllFilters" class="clear-all-inline">Limpiar Todo</button>
            </div>
         </div>
    </div>

    <section class="spacing">
      <!-- Movies Section -->
      <div v-if="activeTab === 'movies'" class="content-section">
        <div v-if="movies && movies.results && movies.results.length">
          <Listing
            :items="movies"
            :loading="moviesLoading"
            @loadMore="loadMoreMovies" />
        </div>
        <div v-else-if="!moviesLoading" class="empty-state">
           <img src="/cinema-popcorn.svg" alt="No results" class="empty-state-icon" style="height: 120px; margin-bottom: 20px; opacity: 0.5;">
           <h3 v-if="hasActiveFilters">No se encontraron películas con estos filtros</h3>
           <p v-if="hasActiveFilters">Intenta ajustar tus filtros para ver más resultados.</p>
           <p v-else>No se encontraron películas para esta productora.</p>
           <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-btn" style="margin-top: 20px; width: auto; padding: 10px 20px; display: inline-block;">Limpiar Filtros</button>
        </div>
      </div>

      <!-- TV Shows Section -->
      <div v-if="activeTab === 'tvShows'" class="content-section">
        <div v-if="tvShows && tvShows.results && tvShows.results.length">
          <Listing
            :items="tvShows"
            :loading="tvShowsLoading"
            @loadMore="loadMoreTVShows" />
        </div>
        <div v-else-if="!tvShowsLoading" class="empty-state">
           <img src="/cinema-popcorn.svg" alt="No results" class="empty-state-icon" style="height: 120px; margin-bottom: 20px; opacity: 0.5;">
           <h3 v-if="hasActiveFilters">No se encontraron series con estos filtros</h3>
           <p v-if="hasActiveFilters">Intenta ajustar tus filtros para ver más resultados.</p>
           <p v-else>No se encontraron series para esta productora.</p>
            <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-btn" style="margin-top: 20px; width: auto; padding: 10px 20px; display: inline-block;">Limpiar Filtros</button>
        </div>
      </div>
    </section>

    <!-- Filters Modal -->
    <div v-if="filtersModalVisible" class="modal-overlay" @click="closeFiltersModal">
      <div class="filters-modal" @click.stop>
        <div class="modal-header">
          <h3>Filtros y Orden</h3>
          <button class="close-btn" @click="closeFiltersModal">×</button>
        </div>
        
        <div class="filters-content">
          <div class="filter-group">
            <label class="filter-label">Género</label>
            <div class="custom-select" @click="toggleGenreDropdown">
              <div class="select-display">
                <span class="selected-value">{{ selectedGenreName || 'Todos los géneros' }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': genreDropdownOpen }">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div v-if="genreDropdownOpen" class="dropdown-options">
                <div class="dropdown-option" :class="{ selected: selectedGenre === '' }" @click.stop="selectGenre('', '')">
                  Todos los géneros
                </div>
                <div v-for="genre in currentGenreList" :key="genre.id" class="dropdown-option" :class="{ selected: selectedGenre === genre.id }" @click.stop="selectGenre(genre.id, genre.name)">
                  {{ genre.name }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Años</label>
            <div class="year-inputs">
              <input type="number" v-model.number="customYearStart" :min="1880" :max="currentYear" placeholder="Desde" class="year-input">
              <span class="year-separator">-</span>
              <input type="number" v-model.number="customYearEnd" :min="1880" :max="currentYear" placeholder="Hasta" class="year-input">
            </div>
            <div class="quick-year-options">
              <button v-for="range in yearRanges" :key="range" @click="setYearRange(range)" class="year-quick-btn">
                {{ range }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Rango de Calificación IMDB</label>
            <div class="year-inputs">
              <input 
                type="number" 
                v-model.number="minImdbRating" 
                min="0" 
                max="10"
                placeholder="Min"
                class="year-input"
              >
              <span class="year-separator">-</span>
              <input 
                type="number" 
                v-model.number="maxImdbRating" 
                min="0" 
                max="10"
                placeholder="Max"
                class="year-input"
              >
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Rango de Votos IMDB</label>
            <div class="year-inputs">
              <input 
                type="number" 
                v-model.number="minImdbVotes" 
                min="0"
                placeholder="Min"
                class="year-input"
              >
              <span class="year-separator">-</span>
              <input 
                type="number" 
                v-model.number="maxImdbVotes" 
                min="0"
                placeholder="Max"
                class="year-input"
              >
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Ordenar Por</label>
            <div class="custom-select" @click="toggleSortDropdown">
              <div class="select-display">
                <span class="selected-value">{{ currentSortLabel }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDropdownOpen }">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <div v-if="sortDropdownOpen" class="dropdown-options">
                <div 
                  v-for="option in sortOptions" 
                   :key="option.value" 
                   class="dropdown-option"
                   :class="{ selected: orderMode === option.value }"
                   @click.stop="selectSort(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="filter-actions">
            <button @click="clearAllFilters" class="clear-btn">Limpiar</button>
            <button @click="applyFilters" class="apply-btn">Aplicar</button>
          </div>
        </div>
      </div>
    </div>


  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useAsyncData, useHead, useRuntimeConfig, useNuxtApp, createError } from '#imports';
import { getMoviesByProductionCompany, getTVShowsByProductionCompany, getProductionCompanyDetails } from '~/utils/api';
import { getProductionCompanyBySlug } from '~/utils/constants';
import TopNav from '~/components/global/TopNav';
import Listing from '~/components/Listing';
import ProductionHero from '~/components/ProductionHero';
import UserNav from '@/components/global/UserNav';

const route = useRoute();
const config = useRuntimeConfig();
const { $bus } = useNuxtApp();

const moviesLoading = ref(false);
const tvShowsLoading = ref(false);
const activeTab = ref('movies');
const showRatedItems = ref(false);

const filtersModalVisible = ref(false);
const genreDropdownOpen = ref(false);
const sortDropdownOpen = ref(false);
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
let companyId = null;
const companyInfo = getProductionCompanyBySlug(slug);

if (companyInfo) {
  companyId = companyInfo.id;
} else if (!isNaN(slug)) {
  companyId = slug;
}

if (!companyId) {
  throw createError({ statusCode: 404, message: 'Production company not found' });
}

const { data: asyncDataResult, error } = await useAsyncData(`production-${companyId}`, async () => {
  const [moviesData, tvShowsData, companyDetails] = await Promise.all([
    getMoviesByProductionCompany(companyId, 1, { sort_by: 'popularity.desc' }),
    getTVShowsByProductionCompany(companyId, 1, { sort_by: 'popularity.desc' }),
    getProductionCompanyDetails(companyId),
  ]);

  return {
    movies: moviesData,
    tvShows: tvShowsData,
    company: companyDetails,
  };
});

if (error.value) {
  console.error('Error loading production company data:', error.value);
  throw createError({ statusCode: 500, message: 'Error loading production company data' });
}

const movies = ref(asyncDataResult.value?.movies || {});
const tvShows = ref(asyncDataResult.value?.tvShows || {});
const company = ref(asyncDataResult.value?.company || {});
const metaTitle = computed(() => {
  return company.value && company.value.name ? `${company.value.name} - Productora` : 'Productora';
});

const heroBackdrop = computed(() => {
  if (movies.value && movies.value.results && movies.value.results.length > 0) {
    return movies.value.results[0].backdrop_path;
  }
  return null;
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
  { id: 28, name: "Acción" }, { id: 12, name: "Aventura" }, { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" }, { id: 99, name: "Documental" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" }, { id: 27, name: "Terror" }, { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" }, { id: 10749, name: "Romance" }, { id: 878, name: "Ciencia Ficción" },
  { id: 10770, name: "Película de TV" }, { id: 53, name: "Suspense" }, { id: 10752, name: "Guerra" },
  { id: 37, name: "Western" }
];

const tvGenres = [
  { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" }, { id: 99, name: "Documental" }, { id: 18, name: "Drama" },
  { id: 10751, name: "Familia" }, { id: 10762, name: "Niños" }, { id: 9648, name: "Misterio" },
  { id: 10763, name: "Noticias" }, { id: 10764, name: "Reality" }, { id: 10765, name: "Ciencia Ficción y Fantasía" },
  { id: 10766, name: "Telenovela" }, { id: 10767, name: "Talk Show" }, { id: 10768, name: "Guerra y Política" },
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
    if (customYearStart.value) chips.push({ label: `Desde ${customYearStart.value}`, value: 'customYearStart' });
    if (customYearEnd.value) chips.push({ label: `Hasta ${customYearEnd.value}`, value: 'customYearEnd' });
    
    if (minImdbRating.value !== null || maxImdbRating.value !== null) {
       let label = '';
       if (minImdbRating.value !== null && maxImdbRating.value !== null) {
          label = minImdbRating.value === maxImdbRating.value ? `Calificación: ${minImdbRating.value}` : `Calificación: ${minImdbRating.value}-${maxImdbRating.value}`;
       } else if (minImdbRating.value !== null) {
          label = `Calificación: ≥ ${minImdbRating.value}`;
       } else {
          label = `Calificación: ≤ ${maxImdbRating.value}`;
       }
       chips.push({ label, value: 'imdbRating' });
    }

    if (minImdbVotes.value !== null || maxImdbVotes.value !== null) {
       let label = '';
       if (minImdbVotes.value !== null && maxImdbVotes.value !== null) {
          label = `Votos: ${minImdbVotes.value}-${maxImdbVotes.value}`;
       } else if (minImdbVotes.value !== null) {
          label = `Votos: ≥ ${minImdbVotes.value}`;
       } else {
          label = `Votos: ≤ ${maxImdbVotes.value}`;
       }
       chips.push({ label, value: 'imdbVotes' });
    }
    
    if (orderMode.value !== 'popularity.desc') chips.push({ label: `Orden: ${currentSortLabel.value}`, value: 'orderMode' });
    return chips;
});

const sortOptions = [
    { value: 'popularity.desc', label: 'Popularidad' },
    { value: 'primary_release_date.desc', label: 'Lanzamientos Recientes' },
    { value: 'primary_release_date.asc', label: 'Lanzamientos Antiguos' },
    { value: 'vote_average.desc', label: 'Mejor Calificados' },
    { value: 'vote_average.asc', label: 'Peor Calificados' },
    { value: 'vote_count.desc', label: 'Más Votados' },
    { value: 'vote_count.asc', label: 'Menos Votados' }
];

const currentSortLabel = computed(() => {
    const option = sortOptions.find(opt => opt.value === orderMode.value);
    return option ? option.label : 'Popularidad';
});

const yearRanges = ['1960-1980', '1980-2000', '2000-2010', '2010-2020', '2020-2025'];

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
            const data = await getMoviesByProductionCompany(companyId, 1, filters);
            movies.value = data;
        } catch(e) { console.error(e); }
        moviesLoading.value = false;
    } else {
        tvShowsLoading.value = true;
        try {
            const data = await getTVShowsByProductionCompany(companyId, 1, filters);
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

  getMoviesByProductionCompany(companyId, nextPage, filters)
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

  getTVShowsByProductionCompany(companyId, nextPage, filters)
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
const toggleGenreDropdown = () => { genreDropdownOpen.value = !genreDropdownOpen.value; };
const toggleSortDropdown = () => { sortDropdownOpen.value = !sortDropdownOpen.value; };
const selectGenre = (id, name) => { selectedGenre.value = id; selectedGenreName.value = name; genreDropdownOpen.value = false; };
const selectSort = (val) => { orderMode.value = val; sortDropdownOpen.value = false; };
const setYearRange = (range) => {
    const [start, end] = range.split('-').map(Number);
    customYearStart.value = start;
    customYearEnd.value = end;
};

const closeDropdowns = (e) => {
    if (genreDropdownOpen.value && !e.target.closest('.custom-select')) genreDropdownOpen.value = false;
    if (sortDropdownOpen.value && !e.target.closest('.custom-select')) sortDropdownOpen.value = false;
};

onMounted(() => {
  if ($bus && $bus.$on) {
    $bus.$on('show-rated-modal', handleShowRatedModal);
  }
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  if ($bus && $bus.$off) {
    $bus.$off('show-rated-modal', handleShowRatedModal);
  }
  document.removeEventListener('click', closeDropdowns);
});
</script>

<style scoped lang="scss">



.list-page-controls {
  padding: 0 4%;
  margin-bottom: 30px;
  margin-top: -20px;
  position: relative;
  z-index: 10;
  
  .column {
     display: flex;
     flex-direction: column;
     gap: 20px;
  }
}

.new-controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  flex-direction: row;
  margin: 3rem auto 20px auto;
  min-height: 50px;
  width: fit-content;
  background: rgba(0, 0, 0, 0.307);
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  

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
}

.switch input { display: none; }
.switch span {
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: #8F989E;
  font-weight: 500;
}
.switch input:not(:checked) ~ span:first-of-type,
.switch input:checked ~ span:last-of-type {
  background-color: #8BE9FD;
  color: #000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.action-buttons { 
    display: flex; 
    gap: 1rem; 
    
    @media (max-width: 768px) {
      justify-content: flex-end;
  }
}

.control-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover { 
        background: rgba(139, 233, 253, 0.1);
        border-color: rgba(139, 233, 253, 0.3);
    }
}


.active-filters-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: nowrap;
  margin: 20px auto;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  max-width: 1200px;
}
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.filter-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 20px; padding: 6px 12px;
  color: #8BE9FD; font-size: 1.3rem;
}
.chip-remove { background: none; border: none; color: inherit; cursor: pointer; font-size: 1.5rem; line-height: 0.8; }

.clear-all-inline {
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid rgba(255, 0, 0, 0.4);
    color: #fff;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: flex-start;
    &:hover { background: rgba(255, 0, 0, 0.4); }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.filters-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  /* overflow: hidden; Removed to fix dropdown cutoff */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.05), transparent);
  
  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #fff;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.3s;
    
    &:hover {
      color: #fff;
    }
  }
}

.filters-content {
  padding: 20px;
  /* overflow-y: auto; Removed to prevent dropdown clipping */
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* max-height: 80vh; Removed to prevent clipping */
}

.filter-group {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  color: #8BE9FD;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.custom-select {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.select-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgba(139, 233, 253, 0.5);
  }
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #092739;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.307);
  }
 
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 233, 253, 0.3);
    border-radius: 3px;
  }
}

.dropdown-option {
  padding: 10px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1.3rem;
  
  &:hover {
    background: rgba(139, 233, 253, 0.1);
  }
  
  &.selected {
    background: rgba(139, 233, 253, 0.2);
    color: #8BE9FD;
  }
}

.year-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.year-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(139, 233, 253, 0.5);
  }
}

.year-separator {
  color: rgba(255, 255, 255, 0.7);
  font-weight: bold;
}

.quick-year-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-quick-btn {
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(139, 233, 253, 0.2);
    border-color: #8BE9FD;
  }
}

.filter-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  appearance: none;
  cursor: pointer;
  
  option {
      background: #000;
  }
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.clear-btn, .apply-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.clear-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
}

.apply-btn {
  background: #8BE9FD;
  color: #000;
}

.content-section {
  margin-bottom: 4rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.6rem;
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
