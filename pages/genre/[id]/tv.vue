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

const { data: pageData, error } = await useAsyncData(`genre-tv-${route.params.id}`, async () => {
  try {
    const items = await getMediaByGenre('tv', route.params.id);
    const genres = await getGenreList('tv');
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

const title = computed(() => {
  if (genre.value) {
    return `TV Genre: ${genre.value.name}`;
  } else {
    return `TV Genre`;
  }
});

const metaTitle = computed(() => title.value);

const loadMore = () => {
  if (!items.value) return;

  loading.value = true;

  getMediaByGenre('tv', route.params.id, items.value.page + 1).then((response) => {
     if (pageData.value && pageData.value.items) {
        pageData.value.items.results = pageData.value.items.results.concat(response.results);
        pageData.value.items.page = response.page;
     }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

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
