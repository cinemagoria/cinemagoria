<template>
  <main class="main">
    <DiscoverHub type="tv" :curated="curated" />
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router';
import DiscoverHub from '~/components/discover/DiscoverHub.vue';
import { useCuratedRows } from '~/composables/useCuratedRows';

const route = useRoute();

const { data: curated } = await useCuratedRows('tv');

useHead({
  title: 'Cinemagoria — TV Shows: Airing Today, On the Air & Top Rated',
  meta: [
    { name: 'description', content: 'Discover TV shows on Cinemagoria — airing today, currently on the air, top rated, and popular series. Filter by genre, network, and streaming platform.' },
    { property: 'og:title', content: 'Cinemagoria — TV Shows: Airing Today, On the Air & Top Rated' },
    { property: 'og:description', content: 'Discover TV shows on Cinemagoria — airing today, currently on the air, top rated, and popular series.' },
    { property: 'og:url', content: `https://cinemagoria.com${route.path}` },
  ],
});
</script>
