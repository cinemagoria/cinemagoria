<template>
  <section class="results" aria-label="Resultados de búsqueda">
    <header class="results__head">
      <div class="results__headings">
        <h2 class="results__title">{{ headline }}</h2>
        <p class="results__meta">{{ metaLine }}</p>
      </div>

      <NuxtLink
        v-if="genreLink"
        :to="genreLink"
        class="listing__explore results__link">
        <strong>Catálogo completo de {{ genreName }}</strong>
      </NuxtLink>
    </header>

    <div v-if="error" class="results__state results__state--error">
      <p>Algo salió mal al buscar en el catálogo.</p>
      <button type="button" class="results__retry" @click="$emit('retry')">Reintentar</button>
    </div>

    <div v-else-if="loading && !results.length" class="results__grid" aria-hidden="true">
      <div v-for="index in 12" :key="`skeleton-${index}`" class="skeleton">
        <div class="skeleton__poster"></div>
        <div class="skeleton__line"></div>
        <div class="skeleton__line skeleton__line--short"></div>
      </div>
    </div>

    <div v-else-if="results.length" class="results__grid">
      <Card
        v-for="item in results"
        :key="`result-${item.id}`"
        :item="item" />
    </div>

    <p v-else-if="searchPerformed" class="results__state">
      Ningún título coincide con estos filtros. Prueba a ampliar el rango de años o a quitar un refinamiento.
    </p>

    <div v-if="results.length" class="results__foot">
      <div v-if="loading" class="results__spinner" aria-label="Cargando más resultados"></div>
      <button v-else-if="hasMore" type="button" class="results__more" @click="$emit('load-more')">Cargar más</button>
      <span v-else class="results__end">Todos los resultados cargados</span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import Card from '~/components/Card';

const props = defineProps({
  type: { type: String, required: true },
  results: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  searchPerformed: { type: Boolean, default: false },
  totalResults: { type: Number, default: 0 },
  genreId: { type: [String, Number], default: '' },
  genreName: { type: String, default: '' },
  typeLabel: { type: String, required: true },
});

defineEmits(['load-more', 'retry']);

const headline = computed(() => {
  if (props.genreName) return `${props.typeLabel} de ${props.genreName}`;
  return 'Resultados de búsqueda';
});

const metaLine = computed(() => {
  if (props.loading && !props.results.length) return 'Buscando en el catálogo…';
  if (!props.results.length) return 'Sin coincidencias';
  const total = props.totalResults > props.results.length
    ? ` de ${props.totalResults.toLocaleString('es-ES')}`
    : '';
  return `${props.results.length}${total} título${props.results.length === 1 ? '' : 's'}`;
});

const genreLink = computed(() => {
  if (!props.genreId) return null;
  return `/genre/${props.genreId}/${props.type}`;
});
</script>

<style lang="scss" scoped>
$cyan: #8BE9FD;
$grey: #80868b;

.results {
  position: relative;
  z-index: 1;
}

.results__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
}

.results__headings { min-width: 0; }

.results__title {
  font-family: var(--font-display);
  font-size: var(--section-title-size);
  font-weight: var(--section-title-weight);
  line-height: var(--section-title-leading);
  color: #fff;
  margin: 0;
}

.results__meta {
  margin: 0.4rem 0 0;
  color: $cyan;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.results__link { flex: 0 0 auto; }

.results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.2rem;
}

.results__grid :deep(.card) { margin-bottom: 0; }

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skeleton__poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 15px;
  background: linear-gradient(100deg, rgba(139, 233, 253, 0.05) 30%, rgba(139, 233, 253, 0.13) 50%, rgba(139, 233, 253, 0.05) 70%);
  background-size: 220% 100%;
  animation: results-shimmer 1.4s ease-in-out infinite;
}

.skeleton__line {
  height: 1.1rem;
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);

  &--short { width: 45%; }
}

@keyframes results-shimmer {
  from { background-position: 140% 0; }
  to { background-position: -40% 0; }
}

.results__state {
  margin: 0;
  padding: 4rem 2rem;
  text-align: center;
  color: $grey;
  font-size: 1.4rem;

  &--error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;

    p { margin: 0; color: #ff7070; }
  }
}

.results__retry {
  border: 1px solid rgba(139, 233, 253, 0.32);
  background: transparent;
  color: $cyan;
  border-radius: 999px;
  padding: 0.9rem 2.2rem;
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
}

.results__foot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 5rem;
  margin-top: 1.6rem;
}

.results__more {
  height: 4.4rem;
  padding: 0 2.6rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.35);
  background: transparent;
  color: $cyan;
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.results__end {
  color: $grey;
  font-size: 1.25rem;
  letter-spacing: 0.04em;
}

.results__spinner {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid rgba(139, 233, 253, 0.18);
  border-top-color: $cyan;
  animation: results-spin 0.85s linear infinite;
}

@keyframes results-spin { to { transform: rotate(360deg); } }

@media (min-width: 640px) {
  .results__grid { grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: 1.6rem; }
}

@media (min-width: 1200px) {
  .results__grid { grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); }
}

@media (max-width: 560px) {
  .results__head { flex-direction: column; align-items: flex-start; }
}

@media (hover: hover) and (pointer: fine) {
  .results__more:hover,
  .results__retry:hover { background: rgba(139, 233, 253, 0.12); border-color: rgba(139, 233, 253, 0.6); }
}
</style>
