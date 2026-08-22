<template>
  <section class="panel" aria-label="Búsqueda en el catálogo">
    <div class="panel__primary">
      <FilterSelect
        label="Género"
        size="lg"
        block
        :model-value="genre"
        :active="Boolean(genre)"
        :options="genreOptions"
        placeholder="Todos los géneros"
        @update:modelValue="set('genre', $event)" />

      <FilterSelect
        label="Ordenar por"
        block
        :model-value="sort"
        :active="sort !== DEFAULT_SORT"
        :options="sortOptions"
        fallback-label="Mejor valoradas (IMDb)"
        @update:modelValue="set('sort', $event)" />

      <div class="panel__actions">
        <button
          type="button"
          class="panel__toggle"
          :class="{ 'panel__toggle--on': expanded }"
          :aria-expanded="expanded"
          aria-controls="discover-refinements"
          @click="expanded = !expanded">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="10" cy="12" r="2" />
            <circle cx="16" cy="18" r="2" />
          </svg>
          <span class="panel__toggle-text">Refinar</span>
          <span v-if="refinementCount" class="panel__badge">{{ refinementCount }}</span>
        </button>

        <button
          v-if="isActive"
          type="button"
          class="panel__clear"
          @click="clearAll()">
          Limpiar
        </button>
      </div>
    </div>

    <p v-if="!isActive" class="panel__hint">
      Elige un género — o abre <strong>Refinar</strong> — para buscar en todo el catálogo {{ typeMeta.catalogueLabel }}.
    </p>

    <div v-show="expanded" id="discover-refinements" class="panel__refinements">
      <div class="panel__grid">
        <FilterSelect
          label="País"
          block
          searchable
          :model-value="country"
          :active="Boolean(country)"
          :options="countryOptions"
          placeholder="Todos los países"
          @update:modelValue="set('country', $event)" />

        <FilterSelect
          label="Idioma original"
          block
          :model-value="language"
          :active="Boolean(language)"
          :options="languageOptions"
          placeholder="Todos los idiomas"
          @update:modelValue="set('language', $event)" />

        <FilterSelect
          v-if="isMovie"
          label="Streaming (ES)"
          block
          :model-value="provider"
          :active="Boolean(provider)"
          :options="networkOptions"
          placeholder="Todos los servicios"
          @update:modelValue="set('provider', $event)" />

        <FilterSelect
          v-else
          label="Canal"
          block
          :model-value="network"
          :active="Boolean(network)"
          :options="networkOptions"
          placeholder="Todos los canales"
          @update:modelValue="set('network', $event)" />

        <FilterSelect
          label="Votos mín."
          block
          :model-value="minVotes"
          :active="minVotes !== DEFAULT_MIN_VOTES"
          :options="minVoteOptions"
          fallback-label="10+ votos"
          @update:modelValue="set('minVotes', $event)" />

        <div v-if="isMovie" class="cell">
          <span class="cell__label">Formato</span>
          <div class="seg" role="group" aria-label="Formato">
            <button
              v-for="option in formatOptions"
              :key="`format-${option.value}`"
              type="button"
              class="seg__btn"
              :class="{ 'seg__btn--on': format === option.value }"
              @click="set('format', option.value)">
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="cell">
          <span class="cell__label">Años de estreno</span>
          <div class="range">
            <input
              type="text"
              inputmode="numeric"
              class="range__input"
              :value="yearFrom || ''"
              placeholder="1888"
              aria-label="Año desde"
              @change="commitNumber('yearFrom', $event, 'int')"
              @keydown.enter="commitNumber('yearFrom', $event, 'int')">
            <span class="range__sep" aria-hidden="true">–</span>
            <input
              type="text"
              inputmode="numeric"
              class="range__input"
              :value="yearTo || ''"
              :placeholder="String(currentYear)"
              aria-label="Año hasta"
              @change="commitNumber('yearTo', $event, 'int')"
              @keydown.enter="commitNumber('yearTo', $event, 'int')">
          </div>
        </div>

        <div class="cell">
          <span class="cell__label">Puntuación</span>
          <div class="range">
            <input
              type="text"
              inputmode="decimal"
              class="range__input"
              :value="ratingMin !== null ? ratingMin : ''"
              placeholder="0"
              aria-label="Puntuación mínima"
              @change="commitNumber('ratingMin', $event, 'float')"
              @keydown.enter="commitNumber('ratingMin', $event, 'float')">
            <span class="range__sep" aria-hidden="true">–</span>
            <input
              type="text"
              inputmode="decimal"
              class="range__input"
              :value="ratingMax !== null ? ratingMax : ''"
              placeholder="10"
              aria-label="Puntuación máxima"
              @change="commitNumber('ratingMax', $event, 'float')"
              @keydown.enter="commitNumber('ratingMax', $event, 'float')">
          </div>
        </div>
      </div>

      <button
        v-if="refinementCount"
        type="button"
        class="panel__reset"
        @click="clearRefinements()">
        Restablecer refinamientos
      </button>
    </div>

    <div v-if="chips.length" class="panel__chips">
      <span
        v-for="chip in chips"
        :key="`chip-${chip.key}`"
        class="chip">
        {{ chip.label }}
        <button
          type="button"
          class="chip__remove"
          :aria-label="`Quitar ${chip.label}`"
          @click="reset(chip.key)">×</button>
      </span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import FilterSelect from '~/components/discover/FilterSelect.vue';
import { countries } from '~/utils/countries';
import {
  DISCOVER_SORTS,
  DISCOVER_LANGUAGES,
  DISCOVER_NETWORKS,
  MIN_VOTE_OPTIONS,
  FORMAT_OPTIONS,
  DISCOVER_TYPES,
  DEFAULT_SORT,
  DEFAULT_MIN_VOTES,
} from '~/utils/discover';

const props = defineProps({
  query: { type: Object, required: true },
  type: { type: String, required: true },
});

const query = props.query;

const {
  genres,
  currentYear,
  genre,
  sort,
  country,
  network,
  provider,
  language,
  minVotes,
  format,
  yearFrom,
  yearTo,
  ratingMin,
  ratingMax,
  chips,
  refinementCount,
  isActive,
  set,
  reset,
  clearAll,
  clearRefinements,
} = query;

const expanded = ref(false);

const isMovie = computed(() => props.type === 'movie');
const typeMeta = computed(() => DISCOVER_TYPES[props.type]);

const genreOptions = computed(() => genres.map(item => ({ value: item.id, label: item.name })));
const sortOptions = DISCOVER_SORTS.map(option => ({ value: option.value, label: option.label }));
const countryOptions = countries.map(item => ({ value: item.code, label: item.name }));
const languageOptions = DISCOVER_LANGUAGES.map(item => ({ value: item.code, label: item.name }));
const networkOptions = DISCOVER_NETWORKS.map(item => ({ value: item.id, label: item.name }));
const minVoteOptions = MIN_VOTE_OPTIONS.map(option => ({ value: option.value, label: option.label }));
const formatOptions = FORMAT_OPTIONS;

function commitNumber(key, event, kind) {
  const trimmed = String(event.target.value).trim();

  if (trimmed === '') {
    if (query[key].value !== null) set(key, null);
    return;
  }

  const parsed = kind === 'int' ? parseInt(trimmed, 10) : parseFloat(trimmed);

  if (Number.isNaN(parsed)) {
    event.target.value = query[key].value ?? '';
    return;
  }

  if (query[key].value === parsed) return;
  set(key, parsed);
}

watch(refinementCount, (count) => {
  if (count > 0) expanded.value = true;
});
</script>

<style lang="scss" scoped>
$cyan: #8BE9FD;
$teal: #1F5467;
$grey: #80868b;

.panel {
  position: relative;
  z-index: 20;
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 10% 0%, rgba(31, 84, 103, 0.2), transparent 46%),
    radial-gradient(circle at 92% 100%, rgba(139, 233, 253, 0.06), transparent 42%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  padding: 1.8rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $cyan, $teal, transparent);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    pointer-events: none;
  }
}

.panel__primary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  align-items: end;
}

.panel__actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.panel__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  flex: 1 1 auto;
  height: 4.2rem;
  padding: 0 1.6rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.35);
  color: #cfd6dc;
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  svg { width: 1.8rem; height: 1.8rem; flex: 0 0 auto; }

  &--on {
    border-color: rgba(139, 233, 253, 0.5);
    background: rgba(139, 233, 253, 0.1);
    color: $cyan;
  }
}

.panel__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, $teal, $cyan);
  color: #03242C;
  font-size: 1.1rem;
  font-weight: 700;
}

.panel__clear {
  flex: 0 0 auto;
  height: 4.2rem;
  padding: 0 1.6rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #ACAFB5;
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.panel__hint {
  margin: 1.4rem 0 0;
  color: $grey;
  font-size: 1.25rem;
  line-height: 1.5;

  strong { color: $cyan; font-weight: 600; }
}

.panel__refinements {
  margin-top: 1.8rem;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(139, 233, 253, 0.12);
}

.panel__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
}

.cell__label {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.seg {
  display: inline-flex;
  align-items: center;
  height: 4.2rem;
  padding: 4px;
  gap: 2px;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.35);
}

.seg__btn {
  flex: 1;
  height: 100%;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #8F989E;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;

  &--on {
    background: linear-gradient(135deg, $teal, $cyan);
    color: #03242C;
    box-shadow: 0 2px 10px rgba(139, 233, 253, 0.22);
  }
}

.range {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  height: 4.2rem;
  padding: 0 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.35);
  transition: border-color 0.2s ease;

  &:focus-within { border-color: rgba(139, 233, 253, 0.55); }
}

.range__input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: 0;
  background: transparent;
  color: #fff;
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 600;
  text-align: center;
  outline: none;

  &::placeholder { color: $grey; font-weight: 500; }
}

.range__sep { color: $grey; flex: 0 0 auto; }

.panel__reset {
  margin-top: 1.4rem;
  height: 3.8rem;
  padding: 0 1.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #ACAFB5;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
}

.panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(139, 233, 253, 0.12);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.5rem 0.4rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  background: rgba(139, 233, 253, 0.1);
  color: $cyan;
  font-size: 1.2rem;
  font-weight: 600;
}

.chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.14);
  color: inherit;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

@media (min-width: 640px) {
  .panel__primary { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); }
  .panel__actions { grid-column: 1 / -1; }
  .panel__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 900px) {
  .panel { padding: 2rem 2.2rem; }
  .panel__primary { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto; }
  .panel__actions { grid-column: auto; }
  .panel__toggle { flex: 0 0 auto; }
  .panel__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 1400px) {
  .panel__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (max-width: 400px) {
  .panel { padding: 1.4rem 1.2rem; border-radius: 16px; }
  .panel__toggle-text { display: none; }
}

@media (hover: hover) and (pointer: fine) {
  .panel__toggle:hover { border-color: rgba(139, 233, 253, 0.45); color: #fff; }
  .panel__clear:hover,
  .panel__reset:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }
  .seg__btn:hover:not(.seg__btn--on) { color: #fff; }
  .chip__remove:hover { background: rgba(139, 233, 253, 0.28); }
}
</style>
