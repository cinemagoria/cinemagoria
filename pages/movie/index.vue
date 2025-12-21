<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    
    <div class="header-container">
      <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">Movies</h1>
      <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
        Discover the latest blockbusters, classics, and everything in between.
      </p>

      <div class="switcher-container">
        <label class="switch">
          <input type="checkbox" :checked="false" @change="navigateToTvShows">
          <span class="slider"></span>
          <span class="label-text">Movies</span>
          <span class="label-text">TV Shows</span>
        </label>
      </div>
    </div>
    <br>

    <CustomListingCategoriesMovies
      :title="'Browse By Category'"
      :view-all-url="null"/>

    <div v-if="followedMovies && followedMovies.results && followedMovies.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'From the Production companies you follow'"
        :items="followedMovies"
        :view-all-url="{ name: 'movie-followed' }" />
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
import UserNav from '@/components/global/UserNav.vue';
import { getMovies, getListItem, getFollowedProductionCompanies, getMoviesByCompanies } from '~/utils/api';
import ListingCarousel from '~/components/ListingCarousel.vue';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies.vue';

const router = useRouter();
const route = useRoute();

useHead({
  title: 'EnterCinema - Movies',
  meta: [
    { property: 'og:title', content: 'Movies' },
    // Note: process.env.FRONTEND_URL might need runtimeConfig replacement
    { property: 'og:url', content: `https://entercinema.com${route.path}` },
  ],
});

// Data
const followedMovies = ref(null);
const ratedItemsModalVisible = ref(false); // Was missing in original data but referenced in method

// Async Data Fetching
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


// Computed Props for Titles/URLs
const popularTitle = computed(() => getListItem('movie', 'popular').title);
const popularUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'popular' } }));

const topRatedTitle = computed(() => getListItem('movie', 'top_rated').title);
const topRatedUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'top_rated' } }));

const upcomingTitle = computed(() => getListItem('movie', 'upcoming').title);
const upcomingUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'upcoming' } }));

const nowPlayingTitle = computed(() => getListItem('movie', 'now_playing').title);
const nowPlayingUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'now_playing' } }));


// Methods
const navigateToTvShows = () => {
  router.push({ name: 'tv' });
};

const showRatedItems = () => {
  ratedItemsModalVisible.value = true;
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
  } catch (error) {
    console.error('Error fetching followed movies:', error);
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

.switcher-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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