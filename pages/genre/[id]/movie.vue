<template>
  <main class="main">
    <TopNav
      :title="metaTitle" />

    <Listing
      v-if="items && items.results && items.results.length"
      :title="title"
      :items="items"
      :loading="loading"
      @loadMore="loadMore" />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getMediaByGenre, getGenreList } from '~/utils/api';
import TopNav from '~/components/global/TopNav';
import Listing from '~/components/Listing';

const route = useRoute();
const loading = ref(false);

// Async Data Fetching
const { data: pageData, error } = await useAsyncData(`genre-movie-${route.params.id}`, async () => {
  try {
    const items = await getMediaByGenre('movie', route.params.id);
    const genres = await getGenreList('movie');
    const genre = genres.find(g => g.id === parseInt(route.params.id));

    if (genre) {
      return { items, genre };
    } else {
      throw createError({ statusCode: 404, message: 'Page not found', fatal: true });
    }
  } catch (err) {
    throw createError({ statusCode: 504, message: 'Data not available', fatal: true });
  }
});

const items = computed(() => pageData.value?.items || null);
const genre = computed(() => pageData.value?.genre || null);

// Computed Properties
const title = computed(() => {
  if (genre.value) {
    return `Movie Genre: ${genre.value.name}`;
  } else {
    return `Movie Genre`;
  }
});

const metaTitle = computed(() => title.value);

// Methods
const loadMore = () => {
  if (!items.value) return;
  
  loading.value = true;

  getMediaByGenre('movie', route.params.id, items.value.page + 1).then((response) => {
    // We need to mutate the items ref. Since it's derived from pageData, we should update pageData
    if (pageData.value && pageData.value.items) {
        pageData.value.items.results = pageData.value.items.results.concat(response.results);
        pageData.value.items.page = response.page;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

// Head Management
const config = useRuntimeConfig();

useHead({
  title: metaTitle,
  meta: [
    { property: 'og:title', content: metaTitle },
    { property: 'og:url', content: `${config.public.frontendUrl}${route.path}` },
  ],
  bodyAttrs: {
    class: 'topnav-active',
  },
});
</script>
