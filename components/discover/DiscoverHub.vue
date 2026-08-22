<template>
  <div class="hub">
    <div class="hub__ambient" aria-hidden="true"></div>

    <header class="page-header hub__header">
      <span class="hub__eyebrow">Discover</span>
      <h1 class="page-title">{{ meta.label }}</h1>
      <p class="page-subtitle hub__subtitle">{{ meta.subtitle }}</p>

      <nav class="switch" aria-label="Catalogue type">
        <NuxtLink
          :to="{ name: 'movie' }"
          class="switch__item"
          :class="{ 'switch__item--on': type === 'movie' }"
          :aria-current="type === 'movie' ? 'page' : undefined">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" />
          </svg>
          Movies
        </NuxtLink>

        <NuxtLink
          :to="{ name: 'tv' }"
          class="switch__item"
          :class="{ 'switch__item--on': type === 'tv' }"
          :aria-current="type === 'tv' ? 'page' : undefined">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="7" width="20" height="13" rx="2" />
            <path d="M7 3l5 4 5-4" />
          </svg>
          TV Shows
        </NuxtLink>
      </nav>
    </header>

    <div class="hub__gutter hub__panel">
      <DiscoverPanel :query="query" :type="type" />
    </div>

    <div v-if="query.isActive.value" class="hub__gutter hub__results">
      <DiscoverResults
        :type="type"
        :type-label="meta.label"
        :results="query.results.value"
        :loading="query.loading.value"
        :error="query.error.value"
        :has-more="query.hasMore.value"
        :search-performed="query.searchPerformed.value"
        :total-results="query.totalResults.value"
        :genre-id="query.genre.value"
        :genre-name="query.genreName.value"
        @load-more="query.loadMore()"
        @retry="query.commit()" />
    </div>

    <section v-if="hasFollowRows" class="hub__zone">
      <div class="hub__gutter">
        <div class="rule">
          <span class="rule__text">From what you follow</span>
          <span class="rule__line" aria-hidden="true"></span>
        </div>
      </div>

      <ListingCarousel
        v-if="followedByCompany"
        :title="meta.followedCompaniesTitle"
        :items="followedByCompany"
        :view-all-url="{ name: meta.followedRouteName }"
        :show-explore-card="false"
        compact />

      <ListingCarousel
        v-if="followedByService"
        :title="meta.followedServicesTitle"
        :items="followedByService"
        :view-all-url="{ name: 'streaming-followed', query: { type } }"
        :show-explore-card="false"
        compact />
    </section>

    <section class="hub__zone">
      <div class="hub__gutter">
        <div class="rule">
          <span class="rule__text">{{ meta.zoneLabel }}</span>
          <span class="rule__line" aria-hidden="true"></span>
        </div>
      </div>

      <ListingCarousel
        v-for="row in curatedRows"
        :key="`row-${row.query}`"
        :title="row.title"
        :items="row.items"
        :view-all-url="{ name: meta.categoryRouteName, params: { name: row.query } }"
        :show-explore-card="false"
        compact />

      <p v-if="!curatedRows.length" class="hub__gutter hub__empty">
        These lists are unavailable right now. The catalogue search and the genre pages below still work.
      </p>
    </section>

    <section class="hub__zone hub__zone--last">
      <div class="hub__gutter">
        <div class="rule">
          <span class="rule__text">Browse by genre</span>
          <span class="rule__line" aria-hidden="true"></span>
        </div>

        <GenreGrid :type="type" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ListingCarousel from '~/components/ListingCarousel.vue';
import DiscoverPanel from '~/components/discover/DiscoverPanel.vue';
import DiscoverResults from '~/components/discover/DiscoverResults.vue';
import GenreGrid from '~/components/discover/GenreGrid.vue';
import { useDiscoverQuery } from '~/composables/useDiscoverQuery';
import { CURATED_ROWS, DISCOVER_TYPES } from '~/utils/discover';
import {
  getFollowedProductionCompanies,
  getFollowedStreamingPlatforms,
  getMoviesByCompanies,
  getTvShowsByCompanies,
  getMoviesByProvider,
  getTvShowsByProvider,
} from '~/utils/api';

const props = defineProps({
  type: { type: String, required: true, validator: value => ['movie', 'tv'].includes(value) },
  curated: { type: Object, default: () => ({}) },
});

const isMovie = computed(() => props.type === 'movie');
const meta = computed(() => DISCOVER_TYPES[props.type]);
const rowDefinitions = CURATED_ROWS[props.type];

const query = useDiscoverQuery(props.type);

const followedByCompany = ref(null);
const followedByService = ref(null);
const hasFollowRows = computed(() => Boolean(followedByCompany.value || followedByService.value));

const curatedRows = computed(() => rowDefinitions
  .map(row => ({ ...row, items: props.curated?.[row.query] }))
  .filter(row => row.items?.results?.length));

function withResults(payload) {
  return payload?.results?.length ? payload : null;
}

async function loadFollowedContent() {
  const userEmail = localStorage.getItem('email');
  if (!userEmail) return;

  try {
    const companies = await getFollowedProductionCompanies(userEmail);
    if (companies?.length) {
      const companyIds = companies.map(company => company.company_id).join('|');
      const byCompany = isMovie.value
        ? await getMoviesByCompanies(companyIds)
        : await getTvShowsByCompanies(companyIds);
      followedByCompany.value = withResults(byCompany);
    }

    const platforms = await getFollowedStreamingPlatforms(userEmail);
    if (platforms?.length) {
      const providerIds = platforms.map(platform => platform.provider_id).join('|');
      const byProvider = isMovie.value
        ? await getMoviesByProvider(providerIds)
        : await getTvShowsByProvider(providerIds);
      followedByService.value = withResults(byProvider);
    }
  } catch (error) {
    console.error('Error fetching followed content:', error);
  }
}

onMounted(() => {
  query.hydrateFromUrl();
  loadFollowedContent();
});
</script>

<style lang="scss" scoped>
$cyan: #8BE9FD;
$teal: #1F5467;
$grey: #80868b;

.hub {
  position: relative;
  padding-bottom: 4rem;
}

.hub__ambient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72rem;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 14% 8%, rgba(31, 84, 103, 0.24), transparent 38%),
    radial-gradient(circle at 86% 4%, rgba(139, 233, 253, 0.1), transparent 34%);
}

.hub__header {
  position: relative;
  z-index: 1;
  padding-bottom: 0;
}

.hub__eyebrow {
  display: inline-block;
  font-size: var(--page-eyebrow-size);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: $cyan;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  margin-bottom: 1.4rem;
}

.hub__subtitle { margin-bottom: 2rem; }

.switch {
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.5rem;
  margin-bottom: var(--page-header-space-bottom);
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.switch__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 4.4rem;
  padding: 0 2.2rem;
  border-radius: 999px;
  color: #ACAFB5;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: background 0.25s ease, color 0.25s ease;

  svg { width: 1.8rem; height: 1.8rem; flex: 0 0 auto; }

  &--on {
    background: linear-gradient(90deg, $teal, rgba(139, 233, 253, 0.4));
    color: #fff;
    box-shadow: 0 6px 18px -8px rgba(139, 233, 253, 0.7);
  }

  &:focus-visible {
    outline: 2px solid rgba(139, 233, 253, 0.7);
    outline-offset: 2px;
  }
}

.hub__gutter {
  position: relative;
  z-index: 1;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

.hub__panel { z-index: 30; }

.hub__results { margin-top: 3.2rem; }

.hub__zone {
  position: relative;
  z-index: 1;
  margin-top: 4rem;
}

.hub__zone--last { margin-top: 4.4rem; }

.hub__zone :deep(.listing) {
  margin-top: 0;
  margin-bottom: 3rem;
}

.hub__zone :deep(.listing:last-child) { margin-bottom: 0; }

.hub :deep(.card__stars) {
  width: 6.4rem;
  height: 1.2rem;
  background-image: none;
  background-color: rgba(139, 233, 253, 0.18);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
  -webkit-mask-size: 20% 100%;
  -webkit-mask-repeat: repeat-x;
  -webkit-mask-position: 0 0;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
  mask-size: 20% 100%;
  mask-repeat: repeat-x;
  mask-position: 0 0;
}

.hub :deep(.card__stars > div) {
  height: 100%;
  background-image: none;
  background-color: $cyan;
}

.hub :deep(.card__vote) {
  margin-left: 0.7rem;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.hub :deep(.card__vote)::after {
  content: '/10';
  margin-left: 0.15rem;
  font-size: 0.8em;
  font-weight: 500;
  color: #7f8b93;
}

.rule {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-bottom: 2rem;
}

.rule__text {
  flex: 0 0 auto;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: $cyan;
}

.rule__line {
  flex: 1 1 auto;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.45), rgba(139, 233, 253, 0.04));
}

.hub__empty {
  margin: 0;
  color: $grey;
  font-size: 1.35rem;
}


@media (min-width: 768px) {
  .hub__gutter { margin-left: 4rem; margin-right: 4rem; }
  .hub__zone :deep(.listing) { margin-bottom: 3.6rem; }
}

@media (min-width: 1200px) {
  .hub__gutter { margin-left: 5rem; margin-right: 5rem; }
  .hub__zone { margin-top: 5rem; }
  .hub__zone :deep(.listing) { margin-bottom: 5rem; }
  .hub :deep(.card__stars) { width: 7.2rem; height: 1.35rem; }
  .hub :deep(.card__vote) { font-size: 1.35rem; }
}

@media (max-width: 560px) {
  .switch { width: 100%; }
  .switch__item { flex: 1; padding: 0 1.2rem; }
}

@media (max-width: 400px) {
  .hub__gutter { margin-left: 1.2rem; margin-right: 1.2rem; }
  .switch__item { font-size: 1.3rem; gap: 0.6rem; }
}

@media (hover: hover) and (pointer: fine) {
  .switch__item:not(.switch__item--on):hover { background: rgba(139, 233, 253, 0.08); color: #fff; }
}
</style>
