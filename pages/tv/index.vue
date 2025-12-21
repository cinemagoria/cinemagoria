<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    
    <div class="header-container">
      <h1 class="title-primary" style="text-align: center; margin-bottom: 0.5rem;">TV Shows</h1>
      <p class="title-secondary" style="text-align: center; margin-bottom: 2rem;">
        Find your next binge-worthy series, latest episodes, and more.
      </p>

      <div class="switcher-container">
        <label class="switch">
          <input type="checkbox" :checked="true" @change="navigateToMovies">
          <span class="slider"></span>
          <span class="label-text">Movies</span>
          <span class="label-text">TV Shows</span>
        </label>
      </div>
    </div>
    <br>

    <CustomListingCategoriesSeries
      :title="'Browse By Category'"
      :view-all-url="null"/>

    <div v-if="followedTvShows && followedTvShows.results && followedTvShows.results.length > 0" class="followed-section">
      <ListingCarousel
        :title="'From the Production companies you follow'"
        :items="followedTvShows"
        :view-all-url="{ name: 'tv-followed' }" />
    </div>

    <ListingCarousel
      v-if="onAir && onAir.results.length"
      :title="onAirTitle"
      :view-all-url="onAirUrl"
      :items="onAir" />

    <ListingCarousel
      v-if="popular && popular.results.length"
      :title="popularTitle"
      :view-all-url="popularUrl"
      :items="popular" />

    <ListingCarousel
      v-if="airingToday && airingToday.results.length"
      :title="airingTodayTitle"
      :view-all-url="airingTodayUrl"
      :items="airingToday" />

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
import { getTvShows, getListItem, getFollowedProductionCompanies, getTvShowsByCompanies } from '~/utils/api';
import ListingCarousel from '~/components/ListingCarousel.vue';
import CustomListingCategoriesSeries from '~/components/CustomListingCategoriesSeries.vue';

const router = useRouter();
const route = useRoute();

useHead({
  title: 'EnterCinema - TV Shows',
  meta: [
    { property: 'og:title', content: 'TV Shows' },
    { property: 'og:url', content: `https://entercinema.com${route.path}` },
  ],
});

// Data
const followedTvShows = ref(null);
const ratedItemsModalVisible = ref(false);

// Async Data Fetching
const { data: tvData } = await useAsyncData('tv-home', async () => {
    try {
        const [popular, topRated, onAir, airingToday] = await Promise.all([
             getTvShows('popular'),
             getTvShows('top_rated'),
             getTvShows('on_the_air'),
             getTvShows('airing_today')
        ]);
        return { popular, topRated, onAir, airingToday };
    } catch (e) {
        console.error(e);
        return { popular: null, topRated: null, onAir: null, airingToday: null };
    }
});

const popular = computed(() => tvData.value?.popular);
const topRated = computed(() => tvData.value?.topRated);
const onAir = computed(() => tvData.value?.onAir);
const airingToday = computed(() => tvData.value?.airingToday);


// Computed Props for Titles/URLs
const popularTitle = computed(() => getListItem('tv', 'popular').title);
const popularUrl = computed(() => ({ name: 'tv-category-name', params: { name: 'popular' } }));

const topRatedTitle = computed(() => getListItem('tv', 'top_rated').title);
const topRatedUrl = computed(() => ({ name: 'tv-category-name', params: { name: 'top_rated' } }));

const onAirTitle = computed(() => getListItem('tv', 'on_the_air').title);
const onAirUrl = computed(() => ({ name: 'tv-category-name', params: { name: 'on_the_air' } }));

const airingTodayTitle = computed(() => getListItem('tv', 'airing_today').title);
const airingTodayUrl = computed(() => ({ name: 'tv-category-name', params: { name: 'airing_today' } }));


// Methods
const navigateToMovies = () => {
  router.push({ name: 'movie' });
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
      followedTvShows.value = await getTvShowsByCompanies(companyIds);
    }
  } catch (error) {
    console.error('Error fetching followed TV shows:', error);
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