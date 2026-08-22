<template>
  <div class="genres">
    <NuxtLink
      v-for="tile in tiles"
      :key="`genre-tile-${tile.genreId}`"
      :to="`/genre/${tile.genreId}/${type}`"
      class="genres__tile">
      <img
        :src="tile.image"
        :alt="''"
        loading="lazy"
        decoding="async"
        aria-hidden="true">
      <span class="genres__label">{{ tile.label }}</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { GENRE_TILES } from '~/utils/discover';

const props = defineProps({
  type: { type: String, required: true },
});

const tiles = computed(() => GENRE_TILES[props.type] || []);
</script>

<style lang="scss" scoped>
.genres {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.genres__tile {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 1.1rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(139, 233, 253, 0.16);
  background: #08141A;
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;

  img {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 24%;
    filter: grayscale(100%) contrast(1.08) brightness(1.02);
    transition: transform 0.45s ease, filter 0.35s ease;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(145deg, #8BE9FD 0%, #35A7C4 48%, #1F5467 100%);
    mix-blend-mode: color;
    opacity: 0.92;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(180deg, rgba(2, 10, 14, 0) 44%, rgba(2, 10, 14, 0.52) 73%, rgba(2, 8, 12, 0.94) 100%),
      linear-gradient(145deg, rgba(139, 233, 253, 0.14), transparent 52%);
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid rgba(139, 233, 253, 0.7);
    outline-offset: 2px;
  }
}

.genres__label {
  position: relative;
  z-index: 3;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
  text-wrap: balance;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95), 0 1px 3px rgba(0, 0, 0, 0.9);
}

@media (min-width: 560px) {
  .genres { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.2rem; }
  .genres__label { font-size: 1.35rem; }
}

@media (min-width: 900px) {
  .genres { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1200px) {
  .genres { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}

@media (hover: hover) and (pointer: fine) {
  .genres__tile:hover {
    border-color: rgba(139, 233, 253, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 14px 30px -14px rgba(139, 233, 253, 0.55);
  }

  .genres__tile:hover img {
    transform: scale(1.05);
    filter: grayscale(0%) contrast(1.04) brightness(1);
  }

  .genres__tile:hover::before { opacity: 0.22; }
}
</style>
