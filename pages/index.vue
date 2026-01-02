<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <FeatureDescription />

    <Hero
      v-if="featured"
      :item="featured" />

    <ListingCarousel
      v-if="trendingMovies && trendingMovies.results.length"
      :title="trendingMoviesTitle"
      :view-all-url="trendingMoviesUrl"
      :items="trendingMovies" />

    <ListingCarousel
      v-if="trendingTv && trendingTv.results.length"
      :title="trendingTvTitle"
      :view-all-url="trendingTvUrl"
      :items="trendingTv" />

    <ProductionCompanyCarousel 
      v-if="popularProductionCompanies.length"
      :items="popularProductionCompanies"
      view-all-link="/production-companies"
    />

    <NewsCarousel />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import UserNav from '@/components/global/UserNav';
import { getTrending, getMovie, getTvShow, getListItem } from '~/utils/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import NewsCarousel from '~/components/global/NewsCarousel';
import ProductionCompanyCarousel from '~/components/ProductionCompanyCarousel';
import { SUPPORTED_PRODUCTION_COMPANIES, POPULAR_PRODUCTION_COMPANIES_IDS } from '~/utils/constants';


const userEmail = ref('');
const hasAccessToken = ref(false);
const isLoggedIn = ref(false);
const userName = ref('');
const ratedItemsModalVisible = ref(false);

const showRatedItems = () => {
  ratedItemsModalVisible.value = true;
};

const { data: pageData, error: pageError } = await useAsyncData('homepage', async () => {
  try {
    const trendingMovies = await getTrending('movie');
    const trendingTv = await getTrending('tv');
    
    const filterRecentYears = (items) => {
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      
      return items.filter(item => {
        const dateField = item.release_date || item.first_air_date;
        if (!dateField) return false;
        
        const year = new Date(dateField).getFullYear();
        return year === currentYear || year === previousYear;
      });
    };
    
    if (trendingMovies?.results) {
        trendingMovies.results = filterRecentYears(trendingMovies.results);
    }
    if (trendingTv?.results) {
        trendingTv.results = filterRecentYears(trendingTv.results);
    }
    
    const recentItems = [...(trendingMovies?.results || []), ...(trendingTv?.results || [])];
    
    let featured = null;
    if (recentItems.length > 0) {
      const randomItem = recentItems[Math.floor(Math.random() * recentItems.length)];
      const media = randomItem.title ? 'movie' : 'tv';
      
      if (media === 'movie') {
        featured = await getMovie(randomItem.id);
      } else {
        featured = await getTvShow(randomItem.id);
      }
    }
    
    return { trendingMovies, trendingTv, featured };
  } catch (error) {
    console.error('Data Loading Error:', error);
    return { trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null };
  }
});

const featured = computed(() => pageData.value?.featured);
const trendingMovies = computed(() => pageData.value?.trendingMovies);
const trendingTv = computed(() => pageData.value?.trendingTv);

const trendingMoviesTitle = computed(() => getListItem('movie', 'trending').title);
const trendingMoviesUrl = computed(() => ({ name: 'movie-category-name', params: { name: 'trending' } }));
const trendingTvTitle = computed(() => getListItem('tv', 'trending').title);
const trendingTvUrl = computed(() => ({ name: 'tv-category-name', params: { name: 'trending' } }));

const popularProductionCompanies = computed(() => {
  return POPULAR_PRODUCTION_COMPANIES_IDS.map(id => SUPPORTED_PRODUCTION_COMPANIES[id]).filter(Boolean);
});

async function getUserAvatar(userEmail) {
  try {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from('user_data')
      .select('avatar')
      .eq('email', userEmail);
    if (error) throw new Error(error.message);
    return data[0]?.avatar || '/avatars/avatar-ss0.png';
  } catch (error) {
    return '/avatars/avatar-ss0.png';
  }
}

async function getUserName(email) {
  try {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from('user_data')
      .select('first_name')
      .eq('email', email);
    if (error) throw new Error(error.message);
    return data[0]?.first_name || 'undefined';
  } catch (error) {
    console.error('Error fetching user first_name:', error);
  }
}

onMounted(async () => {
  if (process.client) {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    userEmail.value = email || '';
    hasAccessToken.value = accessToken !== null;
    isLoggedIn.value = accessToken !== null;
    
    if (isLoggedIn.value) {
      userName.value = await getUserName(userEmail.value);
    }
  }
});
</script>
<style scoped>
  @media screen and (max-width: 600px) {
  .navbar-title {
    font-size: 12px; 
  }

  
  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    right: 1;
    text-align: center;
  }

  .navbar-title {
    text-align: center;
  }
}

@media screen and (max-width: 767px) {
    .nav-button-container {
      margin-top: 30px; 
    }
  }

</style>
