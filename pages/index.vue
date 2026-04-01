<template>
  <main class="main">

    <!-- Oscars 2026 live coverage — visible 5 days from March 15 -->
    <br></br>
    <OscarsLiveBanner v-if="showOscarsBanner" />

    <Hero
      v-if="featured && featured.length"
      :items="featured"
      :initial-item="featured[0]"
      :is-homepage="true" />



    <FestivalsCarousel
      v-if="festivalsMovies && festivalsMovies.results.length"
      title="2026 Festival Selections"
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
import { ref, computed, onMounted } from 'vue';
import { getTrending, getMovie, getTvShow, getListItem } from '~/utils/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import FestivalsCarousel from '~/components/FestivalsCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import NewsCarousel from '~/components/global/NewsCarousel';
import ProductionCompanyCarousel from '~/components/ProductionCompanyCarousel';
import StreamingPlatformCarousel from '~/components/StreamingPlatformCarousel';
import OscarsLiveBanner from '~/components/OscarsLiveBanner';
import OscarsCarousel from '~/components/OscarsCarousel';
import { SUPPORTED_PRODUCTION_COMPANIES, POPULAR_PRODUCTION_COMPANIES_IDS, STREAMING_PROVIDERS, POPULAR_STREAMING_IDS } from '~/utils/constants';

// ─── Oscars 2026 visibility window ───────────────────────────────────────────
// Show from ceremony start (March 15, 2026 21:00 ARG = UTC-3) to March 20 00:00 ARG
const OSCARS_START  = new Date('2026-03-16T00:00:00Z'); // 21:00 ARG = midnight UTC
const OSCARS_EXPIRY = new Date('2026-03-20T03:00:00Z'); // March 20 00:00 ARG = 03:00 UTC
const _now = new Date();
const showOscarsBanner = computed(() => _now >= OSCARS_START && _now < OSCARS_EXPIRY);


const userEmail = ref('');
const hasAccessToken = ref(false);
const isLoggedIn = ref(false);
const userName = ref('');

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
    
    const fetchFestivalMovies = async (festivalName, limit = 1000) => {
        try {
            const data = await $fetch(`/api/festival/${festivalName}/films?limit=${limit}`);
            return data.results.map(f => ({ ...f, festival_source: festivalName }));
        } catch (e) {
            console.error(`${festivalName} fetch error`, e);
            return [];
        }
    };

    const fetchHero = async () => { 
        try {
             const data = await $fetch('/api/hero');
             if (data.result && Array.isArray(data.result)) {
                 const duneIndex = data.result.findIndex(item => item.id == 1170608);
                 if (duneIndex > -1) {
                     const dune = data.result.splice(duneIndex, 1)[0];
                     data.result.unshift(dune);
                 }
             }
             return data.result;
        } catch (e) {
             console.error('Hero fetch error', e);
             return null;
        }
    };

    const [sundanceList, berlinaleList, rotterdamList, slamdanceList, sxswList, romfordList, bifffList, baficiList, trendingMovies, trendingTv, featured] = await Promise.all([
        fetchFestivalMovies('sundance'),
        fetchFestivalMovies('berlinale'),
        fetchFestivalMovies('rotterdam'),
        fetchFestivalMovies('slamdance'),
        fetchFestivalMovies('sxsw'),
        fetchFestivalMovies('romford'),
        fetchFestivalMovies('bifff'),
        fetchFestivalMovies('bafici'),
        fetchWithRefill('movie', 20, 3),
        fetchWithRefill('tv', 20, 6),
        fetchHero()
    ]);
    
      const FEATURED_ORDER = [
        // bafici 2026
        'Heysel 85',
        'No Mercy',
        'In-I In Motion',
        'Los caminantes de la calle',
        'El infierno está encantador - Gulp. 1985',
        'Sorella di clausura',
        'Forest High',
        'Hair, Paper, Water...',

        // bifff 2026
        'Orfeo',
        'Nirvanna the Band the Show the Movie',
        'Mārama',
        'Sister',
        'Corporate Retreat',
        'Tristes Tropiques',
        'Sicko',
        'Appofeniacs',
        'Flush',
        'Steal Away',
        'Stronger Than the Devil',
        'Feels Like Home',
        // sxsw 2026
        'Hokum',
        'Chili Finger',
        'I Love Boosters',
        'Mile End Kicks',
        'The Audacity',
        'Obsession',
        'Love Language',
        'Stormbound',
        'Dead Eyes',
        'Seekers of Infinite Love',
        'Never After Dark',
        'Imposters',
        'American Dollhouse',
        'Mickey',
        'Forbidden Fruits',
        'Ugly Cry',
        'Wishful Thinking',
        'Sender',        
        // slamdance 2026
        'Whisperings of the Moon', 
        'The Bulldogs', 
        'Dump of Untitled Pieces', 
        'Zumeca',
        // romford 2026
        'Spoiling You',
        'House of Abraham',
        // berlinale 2026
        'Yellow Letters',
        'Rose',
        'If I Were Alive',
        'In a Whisper',
        'Queen at sea',
        'Nina Roza',
        'A Prayer for the Dying',
        'Wolfram',
        'At the sea',
        'Paradise',
        'Narciso',
        'Lali',
        'The Red Hangar',
        // rotterdam 2026
        'Silent Friend',
        'Tell Me What You Feel',
        'Dead Man\'s Wire',
        'Father Mother Sister Brother',
        'Butterfly',
        '100 Nights of Hero',
        'Projecto Global',
        'Fuori',
        'Los Domingos',
        'Sore: A Wife from the Future',
        'The History of Sound',
        'Late Fame',
        'Magellan',
        'Palestine 36',
        'L\'Étranger',
        'Romería',
        'Supporting Role',
        'Badak',
        'The Arab',
        // sundance 2026
        'Shame and Money',
        'undertone',
        'The Weight',
        'Leviticus',
        'The Undertone',
        'The Gallerist',
        'The Only Living Pickpocket in New York',
        'The AI Doc: Or How I Became an Apocaloptimist',  
        'Tuner',
        'The Invite',
        'To Hold a Mountain',
        'Chasing Summer',
        'Big Girls Don\'t Cry',
        'Time and Water',
        'In the Blink of An Eye',
        'Josephine',
        'Saccharine',
        
    ];

    const norm = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    const allFestivalFilms = [...sundanceList, ...berlinaleList, ...rotterdamList, ...slamdanceList, ...sxswList, ...romfordList, ...bifffList, ...baficiList];
    
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
