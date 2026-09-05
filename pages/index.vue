<template>
  <main class="main">

    <!-- Oscars 2026 live coverage — visible 5 days from March 15 -->
    <OscarsLiveBanner v-if="showOscarsBanner" />

    <!-- Cannes 2026 coverage — live until palmarès; winners banner after ceremony -->
    <CannesLiveBanner v-if="showCannesLiveBanner" />
    <!-- CannesWinnersBanner retired from display 2026-05-26 — kept as
         reference for future editions; import + computed preserved below. -->
    <!-- <CannesWinnersBanner v-if="showCannesWinnersBanner" /> -->

    <!-- Tribeca 2026 retired from display 2026-06-14 after festival closed —
         kept as reference for future editions; import + computed preserved below. -->
    <!-- <TribecaLiveBanner v-if="showTribecaLiveBanner" /> -->

    <FestivalsRotatingBanner />

    <Hero
      v-if="featured && featured.length"
      :items="featured"
      :initial-item="featured[0]"
      :is-homepage="true" />

    <NewsCarousel />

    <FestivalsCarousel
      v-if="festivalsMovies && festivalsMovies.results.length"
      title="Festival Selections"
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
import { computed } from 'vue';
import Hero from '~/components/Hero';
import SpotlightCarousel from '~/components/SpotlightCarousel';
import FestivalsCarousel from '~/components/FestivalsCarousel';
import NewsCarousel from '~/components/global/NewsCarousel';
import ProductionCompanyCarousel from '~/components/ProductionCompanyCarousel';
import StreamingPlatformCarousel from '~/components/StreamingPlatformCarousel';
import OscarsLiveBanner from '~/components/OscarsLiveBanner';
import CannesLiveBanner from '~/components/CannesLiveBanner';
import CannesWinnersBanner from '~/components/CannesWinnersBanner';
import TribecaLiveBanner from '~/components/TribecaLiveBanner';
import FantasiaLiveBanner from '~/components/FantasiaLiveBanner';
import FestivalsRotatingBanner from '~/components/FestivalsRotatingBanner';
import { SUPPORTED_PRODUCTION_COMPANIES, POPULAR_PRODUCTION_COMPANIES_IDS, STREAMING_PROVIDERS, POPULAR_STREAMING_IDS } from '~/utils/constants';

// ─── Oscars 2026 visibility window ───────────────────────────────────────────
// Show from ceremony start (March 15, 2026 21:00 ARG = UTC-3) to March 20 00:00 ARG
const OSCARS_START  = new Date('2026-03-16T00:00:00Z'); // 21:00 ARG = midnight UTC
const OSCARS_EXPIRY = new Date('2026-03-20T03:00:00Z'); // March 20 00:00 ARG = 03:00 UTC
const _now = new Date();
const showOscarsBanner = computed(() => _now >= OSCARS_START && _now < OSCARS_EXPIRY);

// ─── Cannes 2026 visibility windows ──────────────────────────────────────────
// Live: until festival closes — May 23 2026 23:59 France (CEST → 21:59 UTC)
const CANNES_LIVE_EXPIRY = new Date('2026-05-23T21:59:00Z');
// Winners: from palmarès day evening through post-festival
const CANNES_WINNERS_START = new Date('2026-05-23T16:00:00Z');
const CANNES_WINNERS_EXPIRY = new Date('2026-05-28T21:59:00Z');
const showCannesLiveBanner = computed(() => _now < CANNES_LIVE_EXPIRY && _now < CANNES_WINNERS_START);
const showCannesWinnersBanner = computed(() => _now >= CANNES_WINNERS_START && _now < CANNES_WINNERS_EXPIRY);

// ─── Tribeca 2026 visibility window (retired) ────────────────────────────────
// Festival closed June 14 — banner pulled from display. Constant + computed
// kept as a reference template for future editions.
const TRIBECA_LIVE_EXPIRY = new Date('2026-06-15T03:59:00Z');
const showTribecaLiveBanner = computed(() => _now < TRIBECA_LIVE_EXPIRY);

const FANTASIA_LIVE_START  = new Date('2026-07-09T04:00:00Z');
const FANTASIA_LIVE_EXPIRY = new Date('2026-08-03T03:59:00Z');
const showFantasiaLiveBanner = computed(() => _now >= FANTASIA_LIVE_START && _now < FANTASIA_LIVE_EXPIRY);


const { data: pageData, error: pageError } = useAsyncData('homepage', async () => {
  try {
    // Spotlight carousels are curated manually via pins in
    // cinemagoria-candidates-selections (spotlight-manual-pinned.json,
    // spotlight-reorder.mjs). /api/spotlight/{movies,tv} reads the
    // spotlight_movies / spotlight_tv tables ordered by sort_index.
    const fetchSpotlight = async (file) => {
      try {
        const data = await $fetch(file, { timeout: 9000 });
        return { results: data?.results ?? [] };
      } catch (e) {
        console.error(`Spotlight fetch error (${file}):`, e);
        return { results: [] };
      }
    };

    // Batched: 1 HTTP request + 1 Turso `IN` query for all 11 festivals.
    // Replaces the previous fan-out of 11 parallel /api/festival/{slug}/films
    // calls that was bottlenecking the homepage at 35-38s on the slow wave.
    const FESTIVAL_SLUGS = ['sundance','berlinale','rotterdam','slamdance','sxsw','romford','bifff','bafici','cannes','tribeca','cuff','kviff','fantasia','frightfest','venice','tiff','locarno','bifan','biff','bfi','sitges'];
    const fetchAllFestivalsBatched = async (limit = 1000) => {
        try {
            // fields=card keeps only what the carousel cards consume — the
            // full tmdb_data spread (cast/crew/videos/companies) was inflating
            // the serialized Nuxt payload by hundreds of KB per page view.
            const data = await $fetch(`/api/festival/films-batch?festivals=${FESTIVAL_SLUGS.join(',')}&limit=${limit}&fields=card`, { timeout: 9000 });
            const buckets = data?.results || {};
            return Object.fromEntries(
                Object.entries(buckets).map(([slug, films]) => [
                    slug,
                    films.map(f => ({ ...f, festival_source: slug }))
                ])
            );
        } catch (e) {
            console.error('Festivals batch fetch error', e);
            return {};
        }
    };

    const fetchHero = async () => {
        try {
             const data = await $fetch('/api/hero', { timeout: 9000 });
             return data?.result ?? null;
        } catch (e) {
             console.error('Hero fetch error', e);
             return null;
        }
    };

    const [festivalsBuckets, trendingMovies, trendingTv, featured] = await Promise.all([
        fetchAllFestivalsBatched(),
        fetchSpotlight('/api/spotlight/movies'),
        fetchSpotlight('/api/spotlight/tv'),
        fetchHero()
    ]);

    const sundanceList = festivalsBuckets.sundance || [];
    const berlinaleList = festivalsBuckets.berlinale || [];
    const rotterdamList = festivalsBuckets.rotterdam || [];
    const slamdanceList = festivalsBuckets.slamdance || [];
    const sxswList = festivalsBuckets.sxsw || [];
    const romfordList = festivalsBuckets.romford || [];
    const bifffList = festivalsBuckets.bifff || [];
    const baficiList = festivalsBuckets.bafici || [];
    const cannesList = festivalsBuckets.cannes || [];
    const tribecaList = festivalsBuckets.tribeca || [];
    const cuffList = festivalsBuckets.cuff || [];
    const kviffList = festivalsBuckets.kviff || [];
    const fantasiaList = festivalsBuckets.fantasia || [];
    const frightfestList = festivalsBuckets.frightfest || [];
    const veniceList = festivalsBuckets.venice || [];
    const tiffList = festivalsBuckets.tiff || [];
    const locarnoList = festivalsBuckets.locarno || [];
    const bifanList = festivalsBuckets.bifan || [];
    const biffList = festivalsBuckets.biff || [];
    const bfiList = festivalsBuckets.bfi || [];
    const sitgesList = festivalsBuckets.sitges || [];

 const FEATURED_ORDER = [
    // tiff 2026
    'Bad Lieutenant: Tokyo',
    'Inherit',
    // venice 2026
    'The Echo Chamber',
    'Wild Horse Nine',
    // frightfest 2026
    'Ithaqua',
    'Salmokji: Whispering Water',
    'Nervous',
    // locarno 2026
    'Hearing',
    'Demons',
    'Bloody Tennis',
    'Fire Flower',
    // fantasia 2026
    'Hot Spot',
    'Ferine',
    'Our Effed Up World',
    'The Village of Eight Gravestones',
    'The Eyes',
    'Ancestral Beasts',
    // bifan 2026
    'Korean Haunted Hospital',
    'The Fertilizer Home',
    'The Mage',
    // kviff 2026
    'Rose of Nevada',
    'Fruit Gathering',
    'Hijamat',
    // tribeca 2026
    'The Last Day',
    'Breeder',
    'Recluse',
    // cannes 2026
    'Hope|cannes',
    'Atonement',
    'Victorian Psycho',
    'Minotaur',
    'Fatherland',
    'Fjord',
    'Paper Tiger',
    'The Unknown',
    'Teenage Sex and Death at Camp Miasma',
    'Titanic Ocean',
    // cuff 2026
    'Lucid',
    'The Weed Eaters',
    'Mag Mag',
    // bafici 2026
    'Nova \'78',
    'El infierno está encantador - Gulp. 1985',
    // bifff 2026
    'Mārama',
    'Sicko',
    // sxsw 2026
    'Hokum',
    'Obsession',
    'Never After Dark',
    'The Peril at Pincer Point',
    'Dead Eyes',
    // romford 2026
    'Adorable Humans',
    'Spoiling You',
    // berlinale 2026
    'Yellow Letters',
    'Rose',
    'Heysel 85',
    'Nightborn',
    'If I Were Alive',
    'Salvation',
    // rotterdam 2026
    'Krakatoa',
    'Butterfly',
    'Silent Friend',
    // sundance 2026
    'The Weight',
    'Night Nurse',
    'Shame and Money',
    'The Only Living Pickpocket in New York',
];  
    
    const norm = (s) => s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    const allFestivalFilms = [...sundanceList, ...berlinaleList, ...rotterdamList, ...slamdanceList, ...sxswList, ...romfordList, ...bifffList, ...baficiList, ...cannesList, ...tribecaList, ...cuffList, ...kviffList, ...fantasiaList, ...frightfestList, ...veniceList, ...tiffList, ...locarnoList, ...bifanList, ...biffList, ...bfiList, ...sitgesList];
    
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
    console.error('Homepage data load error:', error);
    return { trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null, festivalsMovies: { results: [] } };
  }
}, {
  lazy: true,
  default: () => ({ trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null, festivalsMovies: { results: [] } })
});

const featured = computed(() => pageData.value?.featured);
const festivalsMovies = computed(() => pageData.value?.festivalsMovies);

// Preload the first hero backdrop so the browser fetches the LCP image at
// highest priority, before hydration reveals it.
const firstBackdropUrl = computed(() => {
  const bp = featured.value?.[0]?.backdrop_path;
  if (!bp) return null;
  return bp.startsWith('http') ? bp : `https://image.tmdb.org/t/p/original${bp}`;
});
useHead(() => ({
  link: firstBackdropUrl.value
    ? [{ rel: 'preload', as: 'image', href: firstBackdropUrl.value, fetchpriority: 'high' }]
    : [],
}));
const trendingMovies = computed(() => pageData.value?.trendingMovies);
const trendingTv = computed(() => pageData.value?.trendingTv);

const trendingMoviesTitle = computed(() => 'Spotlight Movies');
const trendingMoviesUrl = computed(() => '/movie');
const trendingTvTitle = computed(() => 'Spotlight TV Shows');
const trendingTvUrl = computed(() => '/tv');

const popularProductionCompanies = computed(() => {
  return POPULAR_PRODUCTION_COMPANIES_IDS.map(id => SUPPORTED_PRODUCTION_COMPANIES[id]).filter(Boolean);
});

const popularStreamingProviders = computed(() => {
  return POPULAR_STREAMING_IDS.map(id => STREAMING_PROVIDERS.find(p => p.id === id)).filter(Boolean);
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
