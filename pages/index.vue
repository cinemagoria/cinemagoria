<template>
  <main class="main">
    <UserNav @show-rated-modal="showRatedItems" />
    <FeatureDescription />

    <Hero
      v-if="featured && featured.length"
      :items="featured"
      :initial-item="featured[0]"
      :is-homepage="true" />

    <FestivalsCarousel
      v-if="festivalsMovies && festivalsMovies.results.length"
      title="Festivales Sundance y Berlinale 2026"
      view-all-url="/festival"
      :items="festivalsMovies" />

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

    <StreamingPlatformCarousel 
      v-if="popularStreamingProviders.length"
      :items="popularStreamingProviders"
      view-all-link="/streaming-services"
    />

    <NewsCarousel />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import UserNav from '@/components/global/UserNav';
import { getTrending, getMovie, getTvShow, getListItem, translateText } from '~/utils/api';
import Hero from '~/components/Hero';
import ListingsCarousel from '~/components/ListingCarousel';
import FestivalsCarousel from '~/components/FestivalsCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import NewsCarousel from '~/components/global/NewsCarousel';
import ProductionCompanyCarousel from '~/components/ProductionCompanyCarousel';
import StreamingPlatformCarousel from '~/components/StreamingPlatformCarousel';
import { SUPPORTED_PRODUCTION_COMPANIES, POPULAR_PRODUCTION_COMPANIES_IDS, STREAMING_PROVIDERS, POPULAR_STREAMING_IDS } from '~/utils/constants';

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
    
    const filterCarouselItems = (items, mediaType) => {
      const minRating = 6.0;
      
      return items.filter(item => {
        const genreIds = item.genre_ids || [];
        const hasAnimation = genreIds.includes(16);
        
        const hasImdb = item.rating_source === 'imdb';
        const imdbRating = item.imdb_rating ? parseFloat(item.imdb_rating) : 0;

        return !hasAnimation && hasImdb && imdbRating >= minRating;
      });
    };
    
    const fetchWithRefill = async (mediaType, minItems = 20, maxPages = 5) => {
      let allResults = [];
      const seenIds = new Set();
      let asianShowCount = 0;
      let currentBatch = 1;
      const batchSize = 3;
      
      while (allResults.length < minItems && currentBatch <= maxPages) {
        const pagesToFetch = [];
        for (let i = 0; i < batchSize && currentBatch <= maxPages; i++) {
          pagesToFetch.push(currentBatch++);
        }
        
        const batchResults = await Promise.all(
          pagesToFetch.map(page => getTrending(mediaType, page))
        );
        
        for (const data of batchResults) {
          if (data?.results) {
            const yearFiltered = filterRecentYears(data.results);
            let carouselFiltered = filterCarouselItems(yearFiltered, mediaType);
            
            if (mediaType === 'tv') {
              carouselFiltered = carouselFiltered.filter(item => {
                const isAsian = ['ko', 'zh', 'ja'].includes(item.original_language);
                
                if (isAsian) {
                  if (asianShowCount < 1) {
                    asianShowCount++;
                    return true;
                  }
                  return false;
                }
                return true;
              });
            }
            
            for (const item of carouselFiltered) {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                allResults.push(item);
              }
            }
          }
        }
        
        if (allResults.length >= minItems) {
          break;
        }
      }
      
      return { results: allResults };
    };
    
    const fetchSundanceMovies = async () => {
        try {
            const data = await $fetch('/api/festival/sundance/films?limit=100');
            return data.results.map(f => ({ ...f, festival_source: 'sundance' }));
        } catch (e) {
            console.error('Sundance fetch error', e);
            return [];
        }
    };

    const fetchBerlinaleMovies = async () => {
        try {
            const data = await $fetch('/api/festival/berlinale/films?limit=100');
            return data.results.map(f => ({ ...f, festival_source: 'berlinale' }));
        } catch (e) {
            console.error('Berlinale fetch error', e);
            return [];
        }
    };

    const fetchHero = async () => { 
        try {
             const data = await $fetch('/api/hero');
             return data.result;
        } catch (e) {
             console.error('Hero fetch error', e);
             return null;
        }
    };

    const [sundanceList, berlinaleList, trendingMovies, trendingTv, featured] = await Promise.all([
        fetchSundanceMovies(),
        fetchBerlinaleMovies(),
        fetchWithRefill('movie', 20, 3),
        fetchWithRefill('tv', 20, 6),
        fetchHero()
    ]);
    
    const FEATURED_ORDER = [
        'Yellow Letters',
        'Everybody Digs Bill Evans',
        'Rosebush Pruning',
        'Nightborn',
        'At the sea',
        'Kurtuluş',
        'À voix basse',
        'Rose',
        'Queen at sea',
        'The Weight',
        'Leviticus',
        'The Undertone',
        'The Gallerist',
        'Tuner',
        'The Invite',
        'The Only Living Pickpocket in New York',
        'Time and Water',
        'In the Blink of An Eye',
        'Give Me the Ball!',
        'Queen of Chess',
        'Broken English',
        'Antiheroine',
        'Saccharine',
        'The Moment',
        'Josephine',
        'The Shitheads'
    ];
    
    const norm = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    const allFestivalFilms = [...sundanceList, ...berlinaleList];
    
    let mixedFestivalFilms = allFestivalFilms.filter(f => {
        const t = norm(f.title);
        if (f.title.includes('Kurtulu')) return true; 
        if (f.title.includes('A voix basse') || f.title.includes('À voix basse')) return true;
        return FEATURED_ORDER.some(o => norm(o) === t);
    });
    
    mixedFestivalFilms.sort((a, b) => {
        const getIdx = (title) => {
             const t = norm(title);
             if (title.includes('Kurtulu')) return FEATURED_ORDER.findIndex(x => x.startsWith('Kurtul'));
             if (title.includes('voix basse')) return FEATURED_ORDER.findIndex(x => x.includes('voix basse'));
             
             return FEATURED_ORDER.findIndex(o => norm(o) === t);
        };
        
        let idxA = getIdx(a.title);
        let idxB = getIdx(b.title);
        
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        
        return idxA - idxB;
    });
    
    const uniqueMixed = [];
    const seenTitles = new Set();
    for (const f of mixedFestivalFilms) {
        if (!seenTitles.has(norm(f.title))) {
            seenTitles.add(norm(f.title));
            uniqueMixed.push(f);
        }
    }

    return { trendingMovies, trendingTv, featured, festivalsMovies: { results: uniqueMixed } };
  } catch (error) {
    console.error('Data Loading Error:', error);
    return { trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null, festivalsMovies: { results: [] } };
  }
});

const featured = computed(() => pageData.value?.featured);
const festivalsMovies = computed(() => pageData.value?.festivalsMovies);
const trendingMovies = computed(() => pageData.value?.trendingMovies);
const trendingTv = computed(() => pageData.value?.trendingTv);

const trendingMoviesTitle = computed(() => getListItem('movie', 'trending').title);
const trendingMoviesUrl = computed(() => '/movie');
const trendingTvTitle = computed(() => getListItem('tv', 'trending').title);
const trendingTvUrl = computed(() => '/tv');

const popularProductionCompanies = computed(() => {
  return POPULAR_PRODUCTION_COMPANIES_IDS.map(id => SUPPORTED_PRODUCTION_COMPANIES[id]).filter(Boolean);
});

const popularStreamingProviders = computed(() => {
  return POPULAR_STREAMING_IDS.map(id => STREAMING_PROVIDERS.find(p => p.id === id)).filter(Boolean);
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
