<template>
  <main class="main">
    <DiscoverHub type="movie" :curated="curated" />
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import DiscoverHub from '~/components/discover/DiscoverHub.vue';
import { useCuratedRows } from '~/composables/useCuratedRows';

const route = useRoute();

const { data: curated } = await useCuratedRows('movie');

useHead({
  title: 'Cinemagoria — Movies: Now Playing, Upcoming & Top Rated',
  meta: [
    { name: 'description', content: 'Explore movies on Cinemagoria — now playing, upcoming releases, top rated, and popular films. Filter by genre, year, country, and streaming availability.' },
    { property: 'og:title', content: 'Cinemagoria — Movies: Now Playing, Upcoming & Top Rated' },
    { property: 'og:description', content: 'Explore movies on Cinemagoria — now playing, upcoming releases, top rated, and popular films.' },
    { property: 'og:url', content: `https://cinemagoria.com${route.path}` },
  ],
});
</script>
