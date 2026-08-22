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
  title: 'Cinemagoria — Películas: En Cartelera, Próximos Estrenos y Mejor Valoradas',
  meta: [
    { name: 'description', content: 'Explora películas en Cinemagoria — en cartelera, próximos estrenos, mejor valoradas y populares. Filtra por género, año, país y disponibilidad en streaming.' },
    { property: 'og:title', content: 'Cinemagoria — Películas: En Cartelera, Próximos Estrenos y Mejor Valoradas' },
    { property: 'og:description', content: 'Explora películas en Cinemagoria — en cartelera, próximos estrenos, mejor valoradas y populares.' },
    { property: 'og:url', content: `https://es.cinemagoria.com${route.path}` },
  ],
});
</script>
