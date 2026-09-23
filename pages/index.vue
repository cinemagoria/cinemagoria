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


const HOMEPAGE_SSR_DEADLINE_MS = 8000;
const HOMEPAGE_FETCH_TIMEOUT_MS = import.meta.server ? 9000 : 30000;
const PARTIAL_HOMEPAGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=30';
const homepageCacheControl = useResponseHeader('Cache-Control');

const { data: pageData, error: pageError, refresh: refreshHomepage } = useAsyncData('homepage', async () => {
  let partial = false;
  const withinDeadline = (promise, fallback) => {
    if (!import.meta.server) return promise;
    let timer;
    const deadline = new Promise((resolve) => {
      timer = setTimeout(() => {
        partial = true;
        resolve(fallback);
      }, HOMEPAGE_SSR_DEADLINE_MS);
    });
    return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
  };

  try {
    // Spotlight carousels are curated manually via pins in
    // cinemagoria-candidates-selections (spotlight-manual-pinned.json,
    // spotlight-reorder.mjs). /api/spotlight/{movies,tv} reads the
    // spotlight_movies / spotlight_tv tables ordered by sort_index.
    const fetchSpotlight = async (file) => {
      try {
        const data = await $fetch(file, { timeout: HOMEPAGE_FETCH_TIMEOUT_MS });
        return { results: data?.results ?? [] };
      } catch (e) {
        console.error(`Spotlight fetch error (${file}):`, e);
        return { results: [] };
      }
    };

    const fetchFestivalSelections = async () => {
        try {
            const data = await $fetch('/api/festival/featured', { timeout: HOMEPAGE_FETCH_TIMEOUT_MS });
            return data?.results ?? [];
        } catch (e) {
            console.error('Festival selections fetch error', e);
            return [];
        }
    };

    const fetchHero = async () => {
        try {
             const data = await $fetch('/api/hero', { timeout: HOMEPAGE_FETCH_TIMEOUT_MS });
             return data?.result ?? null;
        } catch (e) {
             console.error('Hero fetch error', e);
             return null;
        }
    };

    const [festivalSelections, trendingMovies, trendingTv, featured] = await Promise.all([
        withinDeadline(fetchFestivalSelections(), []),
        withinDeadline(fetchSpotlight('/api/spotlight/movies'), { results: [] }),
        withinDeadline(fetchSpotlight('/api/spotlight/tv'), { results: [] }),
        withinDeadline(fetchHero(), null)
    ]);

    if (import.meta.server && partial) homepageCacheControl.value = PARTIAL_HOMEPAGE_CACHE_CONTROL;
    return { trendingMovies, trendingTv, featured, festivalsMovies: { results: festivalSelections }, partial };
  } catch (error) {
    console.error('Homepage data load error:', error);
    if (import.meta.server) homepageCacheControl.value = PARTIAL_HOMEPAGE_CACHE_CONTROL;
    return { trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null, festivalsMovies: { results: [] }, partial: true };
  }
}, {
  lazy: true,
  default: () => ({ trendingMovies: { results: [] }, trendingTv: { results: [] }, featured: null, festivalsMovies: { results: [] } })
});

const featured = computed(() => pageData.value?.featured);
const festivalsMovies = computed(() => pageData.value?.festivalsMovies);

onMounted(() => {
  if (pageData.value?.partial) refreshHomepage();
});

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
