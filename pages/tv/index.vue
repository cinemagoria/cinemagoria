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
  title: 'Cinemagoria — Series de TV: En Emisión, Próximas y Mejor Valoradas',
  meta: [
    { name: 'description', content: 'Descubre series en Cinemagoria — en emisión hoy, actualmente al aire, mejor valoradas y populares. Filtra por género, cadena y plataforma de streaming.' },
    { property: 'og:title', content: 'Cinemagoria — Series de TV: En Emisión, Próximas y Mejor Valoradas' },
    { property: 'og:description', content: 'Descubre series en Cinemagoria — en emisión hoy, actualmente al aire, mejor valoradas y populares.' },
    { property: 'og:url', content: `https://es.cinemagoria.com${route.path}` },
  ],
});
</script>
