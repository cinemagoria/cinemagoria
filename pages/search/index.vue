<template>
  <main class="main">
    <div :class="{ 'no-results-container': items && items.results && !items.results.length && !loading }">
      <transition name="search-fade" mode="out-in">
        <div v-if="pending && !items" key="loading" class="search-loading-container">
          <div class="search-loading-card">
            <div class="spinner-wrapper">
              <div class="spinner"></div>
            </div>
            <h2 class="glow-text">Buscando</h2>
            <p v-if="query" class="subtitle">
              Buscando las mejores coincidencias para <span class="highlight">"{{ query }}"</span>
            </p>
            <p v-else class="subtitle">
              Buscando películas, series, personas y más...
            </p>
          </div>
        </div>
        <SearchResults
          v-else-if="items && items.results"
          key="results"
          :title="title"
          :items="items"
          :loading="loading"
          :searchQuery="query"
          @loadMore="loadMore" />
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useSearchStore } from '~/stores/search';
import { search, searchNews } from '~/utils/api';
import SearchResults from '~/components/search/SearchResults.vue';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

useHead({
  title: 'Cinemagoria - Search',
  meta: [
    { property: 'og:title', content: 'Search' },
    { property: 'og:url', content: `https://es.cinemagoria.com${route.path}` },
  ],
  bodyAttrs: {
    class: 'page page-search',
  },
});

const loading = ref(false);
const items = ref(null);

const query = computed(() => route.query.q || '');
const title = computed(() => query.value ? `Resultados para: ${query.value}` : '');

const { data: searchData, pending, refresh } = useAsyncData(`search-${route.query.q}`, async () => {
  if (!route.query.q) return null;

  try {
    const [data, newsData] = await Promise.all([
      search(route.query.q, 1),
      searchNews(route.query.q)
    ]);

    if (!data.total_results) {
      return {
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0,
        news: newsData.results || []
      };
    }
    return {
      ...data,
      news: newsData.results || []
    };
  } catch (e) {
    console.error('Search failed:', e);
    return null;
  }
}, {
  lazy: true,
  watch: [() => route.query.q]
});

watch(searchData, (newVal) => {
    items.value = newVal;
}, { immediate: true });

const loadMore = () => {
  loading.value = true;

  search(query.value, items.value.page + 1).then((response) => {
    const existingIds = new Set(items.value.results.map(r => `${r.id}-${r.media_type}`));
    const newResults = (response.results || []).filter(r => !existingIds.has(`${r.id}-${r.media_type}`));
    
    items.value.results = items.value.results.concat(newResults);
    items.value.page = response.page;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

onMounted(() => {
  searchStore.openSearch();
});

onBeforeRouteLeave((to, from, next) => {
  const searchEl = document.getElementById('search');

  if (searchEl && searchEl.value.length) {
    searchStore.closeSearch();
  }
  next();
});
</script>

<style lang="scss">
@use '~/assets/css/utilities/variables' as *;

.page-search .main {
  padding-top: 1rem;
}

.no-results-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

// ─── Modern loading state (mirrors auth-success.vue aesthetic) ────────────
.search-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 4rem 1rem;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.search-loading-card {
  position: relative;
  background: rgba(3, 4, 6, 0.6);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(31, 84, 103, 0.5),
              inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(20px);
  text-align: center;
  overflow: hidden;
  animation: searchLoadingFloatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-loading-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
}

.search-loading-card .spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.4rem;
  height: 10rem;
}

.search-loading-card .spinner {
  width: 5.6rem;
  height: 5.6rem;
  border: 4px solid rgba(31, 84, 103, 0.3);
  border-radius: 50%;
  border-top-color: #8BE9FD;
  animation: searchLoadingSpin 1s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.2);
}

.search-loading-card .glow-text {
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.8rem 0;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.3);
}

.search-loading-card .subtitle {
  color: #a0aab2;
  font-size: 1.4rem;
  font-weight: 300;
  margin: 0;
  line-height: 1.5;
}

.search-loading-card .highlight {
  color: #8BE9FD;
  font-weight: 500;
}

@keyframes searchLoadingFloatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes searchLoadingSpin {
  to { transform: rotate(360deg); }
}

.search-fade-enter-active, .search-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.search-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.search-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
