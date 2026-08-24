<template>
  <main class="sv-page">
    <div class="sv-ambient" aria-hidden="true"></div>

    <header class="page-header sv-header">
      <span class="sv-eyebrow">Catálogo</span>
      <h1 class="page-title">Servicios de Streaming</h1>
      <p class="page-subtitle">
        Cada servicio registrado en el catálogo. Busca por nombre o salta directamente a una letra.
      </p>
    </header>

    <div class="sv-gutter">
      <section class="sv-panel" aria-label="Filtrar servicios de streaming">
        <div class="sv-search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="Buscar servicios de streaming"
            aria-label="Buscar servicios de streaming">
          <button v-if="query" type="button" class="sv-search__clear" aria-label="Limpiar búsqueda" @click="query = ''">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div class="sv-alpha" role="group" aria-label="Filtrar por inicial">
          <button
            type="button"
            class="sv-alpha__key"
            :class="{ 'sv-alpha__key--on': !letter }"
            @click="letter = ''">Todas</button>
          <button
            v-for="key in ALPHABET"
            :key="`alpha-${key}`"
            type="button"
            class="sv-alpha__key"
            :class="{ 'sv-alpha__key--on': letter === key }"
            :disabled="!availableInitials.has(key)"
            @click="letter = letter === key ? '' : key">{{ key }}</button>
        </div>
      </section>
    </div>

    <section v-if="showPopular" class="sv-gutter sv-zone">
      <div class="rule">
        <span class="rule__text">Más populares</span>
        <span class="rule__line" aria-hidden="true"></span>
      </div>

      <div class="sv-grid sv-grid--featured">
        <NuxtLink
          v-for="provider in popularProviders"
          :key="`pop-${provider.id}`"
          :to="`/streaming/${provider.slug}`"
          class="sv-card">
          <span class="sv-card__face">
            <img
              v-if="logoFor(provider)"
              :src="logoFor(provider)"
              :alt="provider.name"
              :class="['sv-card__logo', { 'sv-card__logo--raw': !isVectorLogo(provider) }]"
              loading="lazy"
              decoding="async">
            <span v-else class="sv-card__monogram" aria-hidden="true">{{ monogram(provider.name) }}</span>
          </span>
          <span class="sv-card__name">{{ provider.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="sv-gutter sv-zone sv-zone--last">
      <div class="rule">
        <span class="rule__text">{{ resultsLabel }}</span>
        <span class="rule__line" aria-hidden="true"></span>
        <span class="rule__count">{{ filtered.length.toLocaleString('es-ES') }}</span>
        <button v-if="hasFilters" type="button" class="sv-reset" @click="resetFilters">Restablecer</button>
      </div>

      <div v-if="visible.length" class="sv-grid">
        <NuxtLink
          v-for="provider in visible"
          :key="provider.id"
          :to="`/streaming/${provider.slug}`"
          class="sv-card">
          <span class="sv-card__face">
            <img
              v-if="logoFor(provider)"
              :src="logoFor(provider)"
              :alt="provider.name"
              :class="['sv-card__logo', { 'sv-card__logo--raw': !isVectorLogo(provider) }]"
              loading="lazy"
              decoding="async">
            <span v-else class="sv-card__monogram" aria-hidden="true">{{ monogram(provider.name) }}</span>
          </span>
          <span class="sv-card__name">{{ provider.name }}</span>
        </NuxtLink>
      </div>

      <p v-else class="sv-empty">
        Ningún servicio coincide con <strong>{{ query || letter }}</strong>.
      </p>

      <div v-if="hasMore" class="sv-more">
        <button type="button" class="sv-more__btn" @click="page += 1">Cargar más</button>
        <span class="sv-more__meta">{{ visible.length.toLocaleString('es-ES') }} de {{ filtered.length.toLocaleString('es-ES') }}</span>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { STREAMING_PROVIDERS, POPULAR_STREAMING_IDS, STREAMING_CUSTOM_LOGOS } from '~/utils/constants';
import { apiImgUrl } from '~/utils/api';

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];
const PAGE_SIZE = 96;
const MONOGRAM_STOPWORDS = new Set(['of', 'and', 'the', 'for', 'a', 'an', 'de', 'del', 'la', 'le', 'les', 'el']);

const normalize = (value) => value
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toLowerCase();

const initialOf = (name) => {
  const first = normalize(name.trim())[0] || '#';
  return /[a-z]/.test(first) ? first.toUpperCase() : '#';
};

function monogram(name) {
  const words = name
    .replace(/[^\p{L}\p{N} ]+/gu, ' ')
    .split(/\s+/)
    .filter(word => word && !MONOGRAM_STOPWORDS.has(word.toLowerCase()));

  if (!words.length) return name.trim().slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const providers = STREAMING_PROVIDERS
  .map(provider => ({
    ...provider,
    search: normalize(provider.name),
    initial: initialOf(provider.name),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const logoFor = (provider) => STREAMING_CUSTOM_LOGOS[provider.id]
  || (provider.logo_path ? `${apiImgUrl}/w500${provider.logo_path}` : null);

const isVectorLogo = (provider) => Boolean(STREAMING_CUSTOM_LOGOS[provider.id]);

const availableInitials = new Set(providers.map(provider => provider.initial));

const popularProviders = POPULAR_STREAMING_IDS
  .map(id => STREAMING_PROVIDERS.find(provider => provider.id === id))
  .filter(Boolean);

const query = ref('');
const letter = ref('');
const page = ref(1);

const hasFilters = computed(() => Boolean(query.value.trim() || letter.value));
const showPopular = computed(() => !hasFilters.value && popularProviders.length > 0);

const filtered = computed(() => {
  const needle = normalize(query.value.trim());
  return providers.filter((provider) => {
    if (letter.value && provider.initial !== letter.value) return false;
    if (needle && !provider.search.includes(needle)) return false;
    return true;
  });
});

const visible = computed(() => filtered.value.slice(0, page.value * PAGE_SIZE));
const hasMore = computed(() => visible.value.length < filtered.value.length);

const resultsLabel = computed(() => {
  if (query.value.trim()) return 'Resultados de búsqueda';
  if (letter.value) return letter.value === '#' ? 'Números y símbolos' : `Empiezan con ${letter.value}`;
  return 'Todos los servicios';
});

function resetFilters() {
  query.value = '';
  letter.value = '';
}

watch([query, letter], () => { page.value = 1; });

useHead({
  title: 'Cinemagoria — Todos los Servicios de Streaming',
  meta: [
    { name: 'description', content: 'Explora todos los servicios de streaming disponibles en Cinemagoria.' },
  ],
});
</script>

<style lang="scss" scoped>
$cyan: #8BE9FD;
$teal: #1F5467;
$grey: #80868b;

.sv-page {
  position: relative;
  padding-bottom: 6rem;
  min-height: 100vh;
}

.sv-ambient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 58rem;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 14% 8%, rgba(31, 84, 103, 0.24), transparent 38%),
    radial-gradient(circle at 86% 4%, rgba(139, 233, 253, 0.1), transparent 34%);
}

.sv-header {
  position: relative;
  z-index: 1;
}

.sv-eyebrow {
  display: inline-block;
  font-size: var(--page-eyebrow-size);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: $cyan;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  margin-bottom: 1.4rem;
}

.sv-gutter {
  position: relative;
  z-index: 1;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

.sv-panel {
  position: relative;
  padding: 1.8rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(3, 4, 6, 0.6);
  background-image:
    radial-gradient(circle at 10% 0%, rgba(31, 84, 103, 0.2), transparent 46%),
    radial-gradient(circle at 92% 100%, rgba(139, 233, 253, 0.06), transparent 42%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);

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

.sv-search {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 4.8rem;
  padding: 0 1.5rem;
  border-radius: 14px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.4);
  transition: border-color 0.2s ease;

  &:focus-within { border-color: rgba(139, 233, 253, 0.55); }

  > svg { width: 1.8rem; height: 1.8rem; flex: 0 0 auto; color: $grey; }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: #fff;
    font-family: inherit;
    font-size: 1.5rem;
    outline: none;

    &::placeholder { color: $grey; }
    &::-webkit-search-cancel-button { display: none; }
  }
}

.sv-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.12);
  color: $cyan;
  cursor: pointer;

  svg { width: 1.3rem; height: 1.3rem; }
}

.sv-alpha {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.4rem;
}

.sv-alpha__key {
  min-width: 3.4rem;
  height: 3.4rem;
  padding: 0 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(0, 0, 0, 0.3);
  color: #ACAFB5;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &--on {
    background: linear-gradient(135deg, $teal, $cyan);
    border-color: transparent;
    color: #03242C;
    box-shadow: 0 4px 14px -6px rgba(139, 233, 253, 0.9);
  }

  &:disabled { opacity: 0.25; cursor: default; }

  &:focus-visible {
    outline: 2px solid rgba(139, 233, 253, 0.7);
    outline-offset: 2px;
  }
}

.sv-zone { margin-top: 3.6rem; }
.sv-zone--last { margin-top: 3.6rem; }

.rule {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-bottom: 2rem;
}

.rule__text {
  flex: 0 0 auto;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: $cyan;
}

.rule__line {
  flex: 1 1 auto;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.45), rgba(139, 233, 253, 0.04));
}

.rule__count {
  flex: 0 0 auto;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: $grey;
}

.sv-reset {
  flex: 0 0 auto;
  height: 3.2rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #ACAFB5;
  font-family: inherit;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.sv-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;
}

.sv-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  text-decoration: none;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sv-card__face {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 10;
  padding: 1.6rem;
  border-radius: 14px;
  overflow: hidden;
  background: var(--logo-surface);
  transition: box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(3, 36, 44, 0.85), rgba(31, 84, 103, 0.7), transparent);
    opacity: 0.9;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
}

.sv-card__logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(0);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sv-card__logo--raw {
  filter: none;
  max-width: 72%;
  max-height: 78%;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(2, 12, 18, 0.28);
}

.sv-card__monogram {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  color: rgba(3, 36, 44, 0.82);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sv-card__name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  color: #cfd6dc;
  text-wrap: balance;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.25s ease;
}

.sv-empty {
  margin: 0;
  padding: 5rem 2rem;
  text-align: center;
  color: $grey;
  font-size: 1.45rem;

  strong { color: $cyan; font-weight: 600; }
}

.sv-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.sv-more__btn {
  height: 4.4rem;
  padding: 0 2.8rem;
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

.sv-more__meta {
  color: $grey;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
}

@media (min-width: 560px) {
  .sv-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.6rem; }
}

@media (min-width: 768px) {
  .sv-gutter { margin-left: 4rem; margin-right: 4rem; }
  .sv-panel { padding: 2rem 2.2rem; }
}

@media (min-width: 900px) {
  .sv-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1200px) {
  .sv-gutter { margin-left: 5rem; margin-right: 5rem; }
  .sv-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .sv-zone { margin-top: 4.4rem; }
}

@media (min-width: 1600px) {
  .sv-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
}

@media (max-width: 420px) {
  .sv-gutter { margin-left: 1.2rem; margin-right: 1.2rem; }
  .sv-panel { padding: 1.4rem 1.2rem; border-radius: 16px; }
  .sv-alpha__key { min-width: 3rem; height: 3rem; font-size: 1.15rem; }
}

@media (hover: hover) and (pointer: fine) {
  .sv-card:hover { transform: translateY(-4px); }

  .sv-card:hover .sv-card__face {
    box-shadow: 0 16px 34px -14px rgba(139, 233, 253, 0.6);
    filter: brightness(1.06) saturate(1.08);
  }

  .sv-card:hover .sv-card__face::before { opacity: 1; }

  .sv-card:hover .sv-card__logo,
  .sv-card:hover .sv-card__monogram { transform: scale(1.06); }

  .sv-card:hover .sv-card__name { color: $cyan; }

  .sv-alpha__key:not(:disabled):not(.sv-alpha__key--on):hover {
    color: #fff;
    border-color: rgba(139, 233, 253, 0.4);
  }

  .sv-search__clear:hover { background: rgba(139, 233, 253, 0.25); }
  .sv-reset:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }
  .sv-more__btn:hover { background: rgba(139, 233, 253, 0.12); border-color: rgba(139, 233, 253, 0.6); }
}
</style>
