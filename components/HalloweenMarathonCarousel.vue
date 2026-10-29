<template>
  <SpotlightCarousel
    v-if="active"
    :title="data.event.title_es"
    view-all-url="/halloween"
    :items="{ results: data.movies }"
    compact />
</template>

<script setup>
import SpotlightCarousel from '~/components/SpotlightCarousel';
import { useHalloweenMarathon } from '~/composables/useHalloweenMarathon';

const { data, active } = useHalloweenMarathon();
</script>
