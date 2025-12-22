<template>
  <main class="main">
    <UserNav />
    <TopNav
      :title="metaTitle" />

    <ProductionHero
      v-if="company && company.id"
      :item="company"
      :backdrop-path="heroBackdrop"
      title="Production" />

    <div class="switcher-container">
      <label class="switch">
        <input type="checkbox" :checked="activeTab === 'tvShows'" @change="toggleTab">
        <span class="slider"></span>
        <span class="label-text">Movies</span>
        <span class="label-text">TV Shows</span>
      </label>
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
          <p>No movies found for this production company.</p>
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
          <p>No TV shows found for this production company.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
    getMoviesByProductionCompany(companyId, 1),
    getTVShowsByProductionCompany(companyId, 1),
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
  return company.value && company.value.name ? `${company.value.name} - Production Company` : 'Production Company';
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

const handleShowRatedModal = () => {
  showRatedItems.value = true;
};

const toggleTab = (event) => {
  activeTab.value = event.target.checked ? 'tvShows' : 'movies';
};

const loadMoreMovies = () => {
  if (movies.value.page >= movies.value.total_pages || moviesLoading.value) return;

  moviesLoading.value = true;
  const nextPage = movies.value.page + 1;

  getMoviesByProductionCompany(companyId, nextPage)
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

  getTVShowsByProductionCompany(companyId, nextPage)
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
.switcher-container {
  display: flex;
  justify-content: center;
}

.switch {
  position: relative;
  display: inline-flex;
  width: 240px;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 22px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  padding: 4px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #8BE9FD;
  border-radius: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: none;
}

.switch input:checked ~ .slider {
  transform: translateX(100%);
}

.label-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  color: #80868b;
  font-size: 1.4rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.switch input:not(:checked) ~ .label-text:nth-of-type(2) {
  color: #000;
}

.switch input:checked ~ .label-text:nth-of-type(3) {
  color: #000;
}

.section-title {
  font-size: 3rem;
  color: #8BE9FD;
  margin-bottom: 3rem;
  text-align: center;
  letter-spacing: 0.1em;
}

.content-section {
  margin-bottom: 4rem;
}

.subsection-title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.6rem;
}
</style>
