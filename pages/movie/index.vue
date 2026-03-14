<template>
  <main class="main">
    
    <div class="header-container">
      <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">Discover</h1>
      <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
        Find your next favorite movie with precision filters.
      </p>

      <div class="switcher-container">
        <label class="switch">
          <input type="checkbox" :checked="false" @change="navigateToTvShows">
          <span class="slider"></span>
          <span class="label-text">Movies</span>
          <span class="label-text">TV Shows</span>
        </label>

        <button class="filters-toggle-btn" @click="filtersOpen = !filtersOpen" :class="{ 'filters-toggle-btn--active': filtersOpen }">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.646 20.965a1.67 1.67 0 0 1 -1.321 -1.282a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.728 .177 1.154 .71 1.279 1.303" /><path d="M14.985 11.694a3 3 0 1 0 -3.29 3.29" /><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
        </button>
      </div>

      <Discover defaultType="movie" :filtersOpen="filtersOpen" />
    </div>

    <CustomListingCategoriesMovies
      :title="'Browse By Category'"
      :view-all-url="null"/>

    <div v-if="followedMovies && followedMovies.results && followedMovies.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'From the Production companies you follow'"
        :items="followedMovies"
        :view-all-url="{ name: 'movie-followed' }" />
    </div>

    <div v-if="followedStreaming && followedStreaming.results && followedStreaming.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'From the Streaming Services you follow'"
        :items="followedStreaming"
        :view-all-url="{ name: 'streaming-followed', query: { type: 'movie' } }" />
    </div>

    <ListingCarousel
      v-if="nowPlaying && nowPlaying.results.length"
      :title="nowPlayingTitle"
      :view-all-url="nowPlayingUrl"
      :items="nowPlaying" />

    <ListingCarousel
      v-if="upcoming && upcoming.results.length"
      :title="upcomingTitle"
      :view-all-url="upcomingUrl"
      :items="upcoming" />

    <ListingCarousel
      v-if="popular && popular.results.length"
      :title="popularTitle"
      :view-all-url="popularUrl"
      :items="popular" />
     
    <ListingCarousel
      v-if="topRated && topRated.results.length"
      :title="topRatedTitle"
      :view-all-url="topRatedUrl"
      :items="topRated" />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMovies, getListItem, getFollowedProductionCompanies, getMoviesByCompanies, getFollowedStreamingPlatforms, getMoviesByProvider } from '~/utils/api';
import ListingCarousel from '~/components/ListingCarousel.vue';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies.vue';
import Discover from '~/components/Discover.vue';

const router = useRouter();
const route = useRoute();

useHead({
  title: 'Cinemagoria - Movies',
  meta: [
    { property: 'og:title', content: 'Movies' },
    { property: 'og:url', content: `https://cinemagoria.com${route.path}` },
  ],
});

const followedMovies = ref(null);
const followedStreaming = ref(null);
const filtersOpen = ref(false);

const { data: moviesData } = await useAsyncData('movies-home', async () => {
    try {
        const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
             getMovies('popular'),
             getMovies('top_rated'),
             getMovies('upcoming'),
             getMovies('now_playing')
        ]);
        return { popular, topRated, upcoming, nowPlaying };
    } catch (e) {
        console.error(e);
        return { popular: null, topRated: null, upcoming: null, nowPlaying: null };
    }
});

const popular = computed(() => moviesData.value?.popular);
const topRated = computed(() => moviesData.value?.topRated);
const upcoming = computed(() => moviesData.value?.upcoming);
const nowPlaying = computed(() => moviesData.value?.nowPlaying);

const popularTitle = computed(() => getListItem('movie', 'popular').title);
const popularUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'popular' } }));

const topRatedTitle = computed(() => getListItem('movie', 'top_rated').title);
const topRatedUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'top_rated' } }));

const upcomingTitle = computed(() => getListItem('movie', 'upcoming').title);
const upcomingUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'upcoming' } }));

const nowPlayingTitle = computed(() => getListItem('movie', 'now_playing').title);
const nowPlayingUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'now_playing' } }));

const navigateToTvShows = () => {
  router.push({ name: 'tv' });
};


const fetchFollowedContent = async () => {
  if (typeof window === 'undefined') return;
  
  const userEmail = localStorage.getItem('email');
  if (!userEmail) return;

  try {
    const followedCompanies = await getFollowedProductionCompanies(userEmail);
    if (followedCompanies && followedCompanies.length > 0) {
      const companyIds = followedCompanies.map(c => c.company_id).join('|');
      followedMovies.value = await getMoviesByCompanies(companyIds);
    }

    const followedPlatforms = await getFollowedStreamingPlatforms(userEmail);
    if (followedPlatforms && followedPlatforms.length > 0) {
      const providerIds = followedPlatforms.map(p => p.provider_id).join('|');
      followedStreaming.value = await getMoviesByProvider(providerIds);
    }
  } catch (error) {
    console.error('Error fetching followed content:', error);
  }
};

onMounted(() => {
  fetchFollowedContent();
});
</script>

<style scoped lang="scss">
.header-container {
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title-secondary {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
  line-height: 1.5;
  max-width: 600px;
}

.filters-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    background: transparent;
    border: 1px solid rgba(139, 233, 253, 0.25);
    border-radius: 8px;
    color: #8BE9FD;
    cursor: pointer;

  svg {
    stroke: #8BE9FD;
  }

  &:hover {
    border-color: rgba(139, 233, 253, 0.5);
  }

  &--active {
    border-color: rgba(139, 233, 253, 0.5);
    background: rgba(139, 233, 253, 0.07);
  }
}
.switcher-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
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
</style>