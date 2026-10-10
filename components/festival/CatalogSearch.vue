<template>
  <div v-if="hasCards" ref="rootRef" class="catalog-search" :class="{ 'catalog-search--open': open }">
    <button type="button" class="catalog-search__label" @click="openSearch">Find a title</button>

    <div class="catalog-search__wrapper">
      <button
        type="button"
        class="catalog-search__toggle"
        :class="{ active: open }"
        aria-label="Search this catalog"
        :aria-expanded="open"
        @click="toggle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <div class="catalog-search__field" :class="{ show: open }">
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="catalog-search__input"
          placeholder="Search titles…"
          autocomplete="off"
          spellcheck="false"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="catalog-search-results"
          :aria-expanded="showResults"
          :tabindex="open ? 0 : -1"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="go(results[active])"
          @keydown.esc="close"
        >
        <button v-if="query" type="button" class="catalog-search__clear" aria-label="Clear search" @click="clear">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>

    <ul v-if="showResults" id="catalog-search-results" class="catalog-search__results" role="listbox">
      <li
        v-for="(r, i) in results"
        :key="r.key"
        class="catalog-search__result"
        :class="{ active: i === active }"
        role="option"
        :aria-selected="i === active"
        @mousedown.prevent="go(r)"
        @mouseenter="active = i"
      >
        <span class="catalog-search__title">{{ r.title }}</span>
        <span v-if="r.section" class="catalog-search__section">{{ r.section }}</span>
      </li>
      <li v-if="!results.length" class="catalog-search__empty">No titles match "<strong>{{ query.trim() }}</strong>"</li>
      <li v-else-if="total > results.length" class="catalog-search__more">Showing {{ results.length }} of {{ total }} matches</li>
    </ul>
  </div>
</template>

<script setup>
// Find-in-page for a festival catalog. It reads the cards already rendered in
// the tab it sits in, so it makes no request and costs nothing until opened.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const MAX_RESULTS = 12;
const HIT_CLASS = 'catalog-search-hit';

const rootRef = ref(null);
const inputRef = ref(null);
const hasCards = ref(true);
const open = ref(false);
const query = ref('');
const active = ref(0);
const index = ref([]);
let hitEl = null;
let hitTimer = null;

const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// The catalog is whatever wraps this component: one pass over its cards.
function buildIndex () {
  const scope = rootRef.value?.parentElement;
  if (!scope) return [];
  return [...scope.querySelectorAll('.card')].map((el, i) => {
    const title = el.querySelector('.card__name')?.textContent.trim() || '';
    const section = el.closest('.sel-section')?.querySelector('.sel-section-title')?.textContent.trim() || '';
    return { key: i, el, title, section, folded: fold(title) };
  }).filter((c) => c.title);
}

const matches = computed(() => {
  const words = fold(query.value).split(' ').filter(Boolean);
  if (!words.length) return [];
  const first = words[0];
  return index.value
    .filter((c) => words.every((w) => c.folded.includes(w)))
    // Titles that start with the query first, then by where it appears.
    .sort((a, b) => a.folded.indexOf(first) - b.folded.indexOf(first) || a.title.localeCompare(b.title));
});
const total = computed(() => matches.value.length);
const results = computed(() => matches.value.slice(0, MAX_RESULTS));
const showResults = computed(() => open.value && query.value.trim().length > 0);

watch(query, () => { active.value = 0; });

function openSearch () {
  index.value = buildIndex();
  open.value = true;
  nextTick(() => inputRef.value?.focus());
}
function close () {
  open.value = false;
  query.value = '';
}
function toggle () { open.value ? close() : openSearch(); }
function clear () {
  query.value = '';
  nextTick(() => inputRef.value?.focus());
}
function move (step) {
  if (!results.value.length) return;
  active.value = (active.value + step + results.value.length) % results.value.length;
}

async function go (result) {
  if (!result) return;
  const el = result.el;
  close();
  // On small screens a section can be collapsed: open it through its own header
  // and let it finish sliding open, or the scroll lands short.
  if (el.offsetParent === null) {
    el.closest('.sel-section')?.querySelector('.sel-section-header')?.click();
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clearHit();
    hitEl = el;
    el.classList.add(HIT_CLASS);
    hitTimer = setTimeout(clearHit, 3200);
  });
}
function clearHit () {
  clearTimeout(hitTimer);
  hitEl?.classList.remove(HIT_CLASS);
  hitEl = null;
}

function onOutside (e) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target)) close();
}

onMounted(() => {
  nextTick(() => { hasCards.value = !!rootRef.value?.parentElement?.querySelector('.card'); });
  document.addEventListener('mousedown', onOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutside);
  clearHit();
});
</script>

<style lang="scss" scoped>
.catalog-search {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin: 0.5rem 0 1.75rem;
    padding: 8px 14px;
    min-height: 48px;
    background: rgba(16, 26, 35, 0.6);
    border: 1px solid rgba(139, 233, 253, 0.12);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: border-color 0.25s ease;
    z-index: 20;
}

.catalog-search--open {
    border-color: rgba(139, 233, 253, 0.28);
}

.catalog-search__label {
    font-family: inherit;
    font-size: 12px;
    color: #aab1b8;
    background: rgba(255, 255, 255, 0.04);
    border: none;
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    cursor: pointer;
    white-space: nowrap;

    &:hover { color: #eafbff; }
}

.catalog-search__wrapper {
    display: flex;
    align-items: center;
    position: relative;
    min-width: 0;
}

.catalog-search__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(139, 233, 253, 0.08);
    color: #8BE9FD;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(139, 233, 253, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    padding: 0;

    &:hover {
        background: rgba(139, 233, 253, 0.18);
        box-shadow: 0 4px 12px rgba(139, 233, 253, 0.1);
    }

    &.active {
        background: rgba(139, 233, 253, 0.22);
        border-color: #8BE9FD;
    }
}

.catalog-search__field {
    position: relative;
    width: 0;
    overflow: hidden;
    opacity: 0;
    margin-left: 0;
    transition: width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, margin-left 0.3s ease;

    &.show {
        width: 280px;
        opacity: 1;
        margin-left: 8px;
    }
}

.catalog-search__input {
    width: 100%;
    height: 36px;
    background: rgba(16, 26, 35, 0.7);
    border: 1px solid rgba(139, 233, 253, 0.25);
    color: #fff;
    padding: 8px 32px 8px 14px;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #8BE9FD;
        box-shadow: 0 0 0 2px rgba(139, 233, 253, 0.2);
        background: rgba(16, 26, 35, 0.85);
    }

    &::placeholder { color: rgba(255, 255, 255, 0.35); }
}

.catalog-search__clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    padding: 4px;

    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
    }
}

.catalog-search__results {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: min(420px, 100%);
    max-height: min(60vh, 420px);
    overflow-y: auto;
    margin: 0;
    padding: 6px;
    list-style: none;
    background: rgba(8, 14, 20, 0.97);
    border: 1px solid rgba(139, 233, 253, 0.28);
    border-radius: 12px;
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);
}

.catalog-search__result {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 9px 12px;
    border-left: 3px solid transparent;
    border-radius: 0 8px 8px 0;
    cursor: pointer;

    &.active {
        background: rgba(139, 233, 253, 0.12);
        border-left-color: #8BE9FD;
    }
}

.catalog-search__title {
    font-size: 14px;
    color: #fff;
    line-height: 1.3;
}

.catalog-search__section {
    font-size: 11px;
    letter-spacing: 0.3px;
    color: rgba(139, 233, 253, 0.8);
}

.catalog-search__empty,
.catalog-search__more {
    padding: 10px 12px;
    font-size: 12px;
    color: #aab1b8;

    strong { color: #fff; }
}

.catalog-search__more {
    border-top: 1px solid rgba(139, 233, 253, 0.1);
    margin-top: 4px;
}

@media (max-width: 600px) {
    .catalog-search__field.show {
        width: calc(100vw - 140px);
        max-width: 240px;
    }

    .catalog-search--open .catalog-search__label { display: none; }

    .catalog-search--open { justify-content: flex-end; }
}
</style>

<style lang="scss">
/* The card belongs to another component, so its marker cannot be scoped.
   A line under the card, outside it: nothing to fit to the card's own shape. */
.card.catalog-search-hit {
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0.4rem;
        right: 0.4rem;
        bottom: 0;
        height: 3px;
        border-radius: 3px;
        background: #8BE9FD;
        box-shadow: 0 0 12px rgba(139, 233, 253, 0.75);
        transform-origin: center;
        animation: catalog-search-hit 3.2s ease forwards;
        pointer-events: none;
    }
}

@keyframes catalog-search-hit {
    0% { transform: scaleX(0); opacity: 1; }
    12% { transform: scaleX(1); opacity: 1; }
    35% { opacity: 0.45; }
    55% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .card.catalog-search-hit::after { animation: none; }
}
</style>
