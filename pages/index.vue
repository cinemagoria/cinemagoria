<template>
  <main class="main">
    <!-- Oscars 2026 live coverage — visible 5 days from March 15 -->
    <OscarsLiveBanner v-if="showOscarsBanner" />

    <Hero
      v-if="featured && featured.length"
      :items="featured"
      :initial-item="featured[0]"
      :is-homepage="true" />

    <NewsCarousel />

    <FestivalsCarousel
      v-if="festivalsMovies && festivalsMovies.results.length"
      title="Selección de Festivales"
      view-all-url="/festival"
      :items="festivalsMovies" />

    <ProductionCompanyCarousel
      v-if="popularProductionCompanies.length"
      :items="popularProductionCompanies"
      view-all-link="/production-companies"
    />

    <SpotlightCarousel
      v-if="trendingMovies && trendingMovies.results.length"
      :title="trendingMoviesTitle"
      :view-all-url="trendingMoviesUrl"
      :items="trendingMovies"
      compact />

    <StreamingPlatformCarousel
      v-if="popularStreamingProviders.length"
      :items="popularStreamingProviders"
      view-all-link="/streaming-services"
    />

    <SpotlightCarousel
      v-if="trendingTv && trendingTv.results.length"
      :title="trendingTvTitle"
      :view-all-url="trendingTvUrl"
      :items="trendingTv"
      compact />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getMovie, getTvShow, getListItem, translateText } from '~/utils/api';
import Hero from '~/components/Hero';
import ListingsCarousel from '~/components/ListingCarousel';
import SpotlightCarousel from '~/components/SpotlightCarousel';
import FestivalsCarousel from '~/components/FestivalsCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import NewsCarousel from '~/components/global/NewsCarousel';
import ProductionCompanyCarousel from '~/components/ProductionCompanyCarousel';
import StreamingPlatformCarousel from '~/components/StreamingPlatformCarousel';
import OscarsLiveBanner from '~/components/OscarsLiveBanner';
import OscarsCarousel from '~/components/OscarsCarousel';
import { SUPPORTED_PRODUCTION_COMPANIES, POPULAR_PRODUCTION_COMPANIES_IDS, STREAMING_PROVIDERS, POPULAR_STREAMING_IDS } from '~/utils/constants';

// ─── Óscar 98 — ventana de visibilidad ───────────────────────────────────────
// Mostrar desde la ceremonia (15 mar 2026 21:00 ARG = UTC-3) hasta 20 mar 00:00 ARG
const OSCARS_START  = new Date('2026-03-16T00:00:00Z');
const OSCARS_EXPIRY = new Date('2026-03-20T03:00:00Z');
const _now = new Date();
const showOscarsBanner = computed(() => _now >= OSCARS_START && _now < OSCARS_EXPIRY);

const userEmail = ref('');
const hasAccessToken = ref(false);
const isLoggedIn = ref(false);
const userName = ref('');

const { data: pageData, error: pageError } = await useAsyncData('homepage', async () => {
  try {
    // Spotlight curado manualmente via pins en cinemagoria-candidates-selections
    // (spotlight-manual-pinned.json, spotlight-reorder.mjs).
    // /api/spotlight/{movies,tv} lee las tablas spotlight_movies / spotlight_tv
    // ordenadas por sort_index, devolviendo title_es/overview_es para el Card.
    const fetchSpotlight = async (file) => {
      try {
        const data = await $fetch(file);
        const results = (data?.results ?? []).map((item) => ({
          ...item,
          title: item.title_es || item.title,
          overview: item.overview_es || item.overview,
        }));
        return { results };
      } catch (e) {
        console.error(`Spotlight fetch error (${file}):`, e);
        return { results: [] };
      }
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
             return data.result;
        } catch (e) {
             console.error('Hero fetch error', e);
             return null;
        }
    };

    const [sundanceList, berlinaleList, rotterdamList, slamdanceList, sxswList, romfordList, bifffList, baficiList, cannesList, tribecaList, cuffList, trendingMovies, trendingTv, featured] = await Promise.all([
        fetchFestivalMovies('sundance'),
        fetchFestivalMovies('berlinale'),
        fetchFestivalMovies('rotterdam'),
        fetchFestivalMovies('slamdance'),
        fetchFestivalMovies('sxsw'),
        fetchFestivalMovies('romford'),
        fetchFestivalMovies('bifff'),
        fetchFestivalMovies('bafici'),
        fetchFestivalMovies('cannes'),
        fetchFestivalMovies('tribeca'),
        fetchFestivalMovies('cuff'),
        fetchSpotlight('/api/spotlight/movies'),
        fetchSpotlight('/api/spotlight/tv'),
        fetchHero()
    ]);
    
     const FEATURED_ORDER = [
        // tribeca 2026
        // 'In the Hand of Dante',
        // 'Only What We Carry',
        // 'The Last Day',  
        // 'Breeder',
        // 'Recluse',
        // 'The Revisionist',
        // cannes 2026
        'Victorian Psycho',
        'Hope|cannes',
        'Colony',
        'Minotaur',
        'Fatherland',
        'Fjord',
        'Parallel Tales',
        'Paper Tiger',
        'El Partido',
        'Bitter Christmas',
        'All of a Sudden',
        'The Unknown',
        'Gentle Monster',
        'Teenage Sex and Death at Camp Miasma',
        'Her Private Hell',
        // cuff 2026
        'Lucid',
        'Thanks for Nothing',
        'The Weed Eaters',
        'Hangashore',
        'Mag Mag',
        'Affection',
        // bafici 2026
        'Nova \'78',
        'El infierno está encantador - Gulp. 1985',
        // bifff 2026
        'Corporate Retreat',
        'Mārama',
        'Sicko',
        // sxsw 2026
        'Hokum',
        'Obsession',
        'Never After Dark',
        'Stormbound',
        'Chili Finger',
        'Dead Eyes',
        'Wishful Thinking',       
        // slamdance 2026
        'Whisperings of the Moon',
        'Zumeca',
        // romford 2026
        'Spoiling You',
        // berlinale 2026
        'Yellow Letters',
        'Rose',
        'Nina Roza',
        'Queen at sea',
        'Heysel 85',
        'In a Whisper',
        'If I Were Alive',
        'Forest High',
        'Paradise',
        'At the sea',
        'Salvation',
        
        'Lali',
        'The Red Hangar',
        'Matapanki',
        // rotterdam 2026
        'Variations on a theme',
        'Silent Friend',
        'Tell Me What You Feel',
        'Father Mother Sister Brother',
        'Butterfly',
        'Fuori',
        'Sore: A Wife from the Future',
        'Late Fame',
        // sundance 2026
        'To Hold a Mountain',
        'The Weight',
        'Zi',
        'Shame and Money',
        'undertone',
        'The Undertone',
        'The Only Living Pickpocket in New York',
        'Leviticus',
        'The AI Doc: Or How I Became an Apocaloptimist',  
        'Tuner',
        'Time and Water',
        'Josephine',
        'One in a Million',
        'The Invite',
        'Saccharine',
    ];
    
    const norm = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    const allFestivalFilms = [...sundanceList, ...berlinaleList, ...rotterdamList, ...slamdanceList, ...sxswList, ...romfordList, ...bifffList, ...baficiList, ...cannesList, ...tribecaList, ...cuffList];
    
    let mixedFestivalFilms = allFestivalFilms.filter(f => {
        const t = norm(f.title);
        if (f.title.includes('Kurtulu')) return true; 
        if (f.title.includes('A voix basse') || f.title.includes('À voix basse')) return true;
        return FEATURED_ORDER.some(o => {
            const [oTitle, oFest] = o.split('|');
            if (oFest) return norm(oTitle) === t && f.festival_source === oFest;
            return norm(oTitle) === t;
        });
    });
    
    mixedFestivalFilms.sort((a, b) => {
        const getIdx = (title, festival) => {
             const t = norm(title);
             if (title.includes('Kurtulu')) return FEATURED_ORDER.findIndex(x => x.startsWith('Kurtul'));
             if (title.includes('voix basse')) return FEATURED_ORDER.findIndex(x => x.includes('voix basse'));
             
             return FEATURED_ORDER.findIndex(o => {
                 const [oTitle, oFest] = o.split('|');
                 if (oFest) return norm(oTitle) === t && festival === oFest;
                 return norm(oTitle) === t;
             });
        };
        
        let idxA = getIdx(a.title, a.festival_source);
        let idxB = getIdx(b.title, b.festival_source);
        
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

const trendingMoviesTitle = computed(() => 'Películas Destacadas');
const trendingMoviesUrl = computed(() => '/movie');
const trendingTvTitle = computed(() => 'Series Destacadas');
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
