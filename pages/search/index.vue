<template>
  <main class="main">
    <SearchResults
      v-if="items && items.results.length"
      :title="title"
      :items="items"
      :loading="loading"
      :searchQuery="query"
      @loadMore="loadMore" />
    
    <div v-else-if="items && items.results && !items.results.length && !loading" class="no-results-container">
      <SearchResults
        :items="{results: [], page: 1, total_pages: 0}"
        :loading="loading"
        :searchQuery="query" />
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useSearchStore } from '~/stores/search';
import { search } from '~/utils/api';
import SearchResults from '~/components/search/SearchResults.vue';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

useHead({
  title: 'EnterCinema - Search',
  meta: [
    { property: 'og:title', content: 'Search' },
    { property: 'og:url', content: `https://entercinema.com${route.path}` },
  ],
  bodyAttrs: {
    class: 'page page-search',
  },
});

// Data
const loading = ref(false);
const items = ref(null);

// Computed
const query = computed(() => route.query.q || '');
const title = computed(() => query.value ? `Results For: ${query.value}` : '');

// Async Data
const { data: searchData, refresh } = await useAsyncData(`search-${route.query.q}`, async () => {
  if (route.query.q) {
    try {
       const data = await search(route.query.q, 1);
       if (!data.total_results) {
           return {
             results: [],
             page: 1,
             total_pages: 0,
             total_results: 0
           };
       }
       return data;
    } catch(e) {
        console.error(e);
        return null; // Or handle error
    }
  } else {
     // Redirect logic originally in asyncData, but usually handled by layout or middleware.
     // Here we just return null.
     return null; 
  }
}, {
  watch: [() => route.query.q]
});

watch(searchData, (newVal) => {
    items.value = newVal;
}, { immediate: true });


// Methods
const loadMore = () => {
  loading.value = true;

  search(query.value, items.value.page + 1).then((response) => {
    items.value.results = items.value.results.concat(response.results);
    items.value.page = response.page;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

onMounted(() => {
  searchStore.openSearch();
  // searchStore.setFromPage(fromPage); // Logic omitted as simple back usage is common or requires middleware
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
  padding-top: 3rem;

  @media (min-width: $breakpoint-large) {
    padding-top: 8rem;
  }
}

.no-results-container {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
