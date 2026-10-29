<template>
  <main class="hw">
    <header class="page-header">
      <h1 class="page-title">{{ edit?.event?.title || 'Halloween Marathon' }}</h1>
      <h2 v-if="edit?.event?.description" class="page-subtitle">{{ edit.event.description }}</h2>
    </header>

    <div v-if="error" class="hw-state">
      <h2 class="hw-state__title">The catalog could not be loaded</h2>
      <p class="hw-state__text">This is usually temporary. Try again in a moment.</p>
      <button type="button" class="hw-btn hw-btn--solid" @click="refresh()">Try again</button>
    </div>

    <div v-else-if="pending && !movies.length" class="hw-state">
      <Loader :size="48" />
    </div>

    <div v-else class="hw-layout">
      <button
        type="button"
        class="hw-btn hw-filters-toggle"
        :aria-expanded="sidebarOpen ? 'true' : 'false'"
        aria-controls="hw-sidebar"
        @click="sidebarOpen = !sidebarOpen">
        {{ sidebarOpen ? 'Hide filters' : 'Filters' }}<span v-if="activeCount"> ({{ activeCount }})</span>
      </button>

      <aside id="hw-sidebar" class="hw-sidebar" :class="{ 'hw-sidebar--open': sidebarOpen }" aria-label="Filter the Halloween catalog">
        <div v-if="decades.length > 1" class="hw-panel">
          <h2 class="hw-panel__title">Decade</h2>
          <div class="hw-chips">
            <button
              v-for="d in decades"
              :key="d"
              type="button"
              class="hw-chip"
              :class="{ 'is-active': decade === d }"
              :aria-pressed="decade === d ? 'true' : 'false'"
              :disabled="!countFor('decade', d) && decade !== d"
              @click="decade = decade === d ? null : d">
              {{ d }}s <span class="hw-count">{{ countFor('decade', d) }}</span>
            </button>
          </div>
        </div>

        <div class="hw-panel">
          <label class="hw-label" for="hw-search">Search by title</label>
          <input
            id="hw-search"
            v-model="query"
            class="hw-input"
            type="search"
            placeholder="The Shining, The Exorcist…"
            autocomplete="off">
        </div>

        <nav class="hw-panel" aria-labelledby="hw-genres-title">
          <h2 id="hw-genres-title" class="hw-panel__title">Genres</h2>
          <ul class="hw-tree">
            <li>
              <button
                type="button"
                class="hw-tree__item"
                :class="{ 'is-active': !genre }"
                :aria-pressed="!genre ? 'true' : 'false'"
                @click="selectGenre(null)">
                <span>All horror</span>
                <span class="hw-count">{{ countFor('genre', null) }}</span>
              </button>
            </li>
            <li v-for="g in genres" :key="g.slug">
              <button
                type="button"
                class="hw-tree__item"
                :class="{ 'is-active': genre === g.slug }"
                :aria-pressed="genre === g.slug ? 'true' : 'false'"
                :aria-expanded="genre === g.slug ? 'true' : 'false'"
                :disabled="!countFor('genre', g.slug) && genre !== g.slug"
                @click="selectGenre(genre === g.slug ? null : g.slug)">
                <span>{{ g.name }}</span>
                <span class="hw-count">{{ countFor('genre', g.slug) }}</span>
              </button>
              <ul v-if="genre === g.slug && subsOf(g).length" class="hw-tree hw-tree--sub">
                <li v-for="s in subsOf(g)" :key="s.slug">
                  <button
                    type="button"
                    class="hw-tree__item hw-tree__item--sub"
                    :class="{ 'is-active': sub === s.slug }"
                    :aria-pressed="sub === s.slug ? 'true' : 'false'"
                    :disabled="!countFor('sub', s.slug) && sub !== s.slug"
                    @click="sub = sub === s.slug ? null : s.slug">
                    <span>{{ s.name }}</span>
                    <span class="hw-count">{{ countFor('sub', s.slug) }}</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <div v-if="tags.length" class="hw-panel">
          <h2 class="hw-panel__title">Themes &amp; origins</h2>
          <div class="hw-chips">
            <button
              v-for="t in tags"
              :key="t.slug"
              type="button"
              class="hw-chip"
              :class="{ 'is-active': tag === t.slug }"
              :aria-pressed="tag === t.slug ? 'true' : 'false'"
              :disabled="!countFor('tag', t.slug) && tag !== t.slug"
              @click="tag = tag === t.slug ? null : t.slug">
              {{ t.name }} <span class="hw-count">{{ countFor('tag', t.slug) }}</span>
            </button>
          </div>
        </div>


        <button v-if="activeCount" type="button" class="hw-btn hw-btn--block" @click="clearAll">Clear all filters</button>
      </aside>

      <section class="hw-results" aria-labelledby="hw-results-title">
        <div class="hw-results__bar">
          <div class="hw-results__top">
            <h2 id="hw-results-title" class="hw-results__title">
              <span class="hw-results__name">{{ activeGenre ? activeGenre.name : 'All horror' }}</span>
              <span class="hw-results__count">{{ results.length }} {{ results.length === 1 ? 'film' : 'films' }}</span>
            </h2>
            <div class="hw-results__controls">
              <label class="hw-sort" for="hw-sort">
                <span class="hw-sort__label">Sort by</span>
                <select id="hw-sort" v-model="sort" class="hw-input hw-select">
                  <option v-for="option in SORTS" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </label>
              <label class="hw-toggle">
                <input v-model="groupByDecade" type="checkbox">
                <span>Group by decade</span>
              </label>
            </div>
          </div>
          <p v-if="activeGenre?.description" class="hw-results__desc">{{ activeGenre.description }}</p>

          <ul v-if="activeChips.length" class="hw-active" aria-label="Active filters">
            <li v-for="chip in activeChips" :key="chip.key">
              <button type="button" class="hw-chip is-active" :aria-label="`Remove filter ${chip.label}`" @click="chip.clear()">
                {{ chip.label }} <span aria-hidden="true">×</span>
              </button>
            </li>
            <li>
              <button type="button" class="hw-link" @click="clearAll">Clear all</button>
            </li>
          </ul>
        </div>

        <template v-if="results.length && groupByDecade">
          <section v-for="group in decadeGroups" :key="group.key" class="hw-group" :aria-label="group.label">
            <h3 class="hw-group__title">{{ group.label }} <span class="hw-count">{{ group.total }}</span></h3>
            <div class="hw-grid">
              <Card v-for="movie in group.items" :key="`hw-${movie.id}`" :item="movie" />
            </div>
          </section>
        </template>

        <div v-else-if="results.length" class="hw-grid">
          <Card v-for="movie in results" :key="`hw-${movie.id}`" :item="movie" />
        </div>

        <div v-else class="hw-state hw-state--inline">
          <h3 class="hw-state__title">{{ query ? `Nothing matches “${query}”` : 'No films match these filters' }}</h3>
          <p class="hw-state__text">Try another genre or remove a filter.</p>
          <button type="button" class="hw-btn hw-btn--solid" @click="clearAll">Reset filters</button>
        </div>

      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import Card from '~/components/Card';
import Loader from '~/components/Loader.vue';

const DEFAULT_SORT = 'rating';
const SORTS = [
  { value: 'rating', label: 'IMDb rating' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'added', label: 'Recently added to TMDB' },
  { value: 'title', label: 'Title A–Z' },
];

const route = useRoute();
const router = useRouter();

const { data: edit, pending, error, refresh } = await useAsyncData('halloween', () => $fetch('/api/halloween'));

if (edit.value && !edit.value.event) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

useSeoMeta({
  title: () => edit.value?.event?.title || 'Halloween Marathon',
  description: () => edit.value?.event?.description || 'Horror to binge this Halloween.',
});

const normalize = (value) => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const categories = computed(() => edit.value?.categories || []);
const byId = computed(() => new Map(categories.value.map((c) => [c.id, c])));
const genres = computed(() => categories.value.filter((c) => c.kind === 'genre'));
const tags = computed(() => categories.value.filter((c) => c.kind === 'tag'));
const subsOf = (g) => categories.value.filter((c) => c.kind === 'subgenre' && c.parent_id === g.id);

const movies = computed(() => (edit.value?.movies || []).map((m) => ({
  ...m,
  slugs: new Set(m.category_ids.map((id) => byId.value.get(id)?.slug).filter(Boolean)),
  decade: m.year ? Math.floor(m.year / 10) * 10 : null,
  searchable: normalize(m.title),
})));
const decades = computed(() => [...new Set(movies.value.map((m) => m.decade).filter(Boolean))].sort((a, b) => a - b));

const pick = (value, allowed) => (typeof value === 'string' && allowed.includes(value) ? value : null);
const genre = ref(pick(route.query.genre, genres.value.map((c) => c.slug)));
const sub = ref(pick(route.query.sub, categories.value.filter((c) => c.kind === 'subgenre').map((c) => c.slug)));
const tag = ref(pick(route.query.tag, tags.value.map((c) => c.slug)));
const decade = ref(decades.value.includes(Number(route.query.decade)) ? Number(route.query.decade) : null);
const query = ref(typeof route.query.q === 'string' ? route.query.q.slice(0, 80) : '');
const sort = ref(pick(route.query.sort, SORTS.map((s) => s.value)) || DEFAULT_SORT);
const groupByDecade = ref(route.query.group !== 'none');
const sidebarOpen = ref(false);

if (sub.value) {
  const parent = byId.value.get(categories.value.find((c) => c.slug === sub.value)?.parent_id);
  if (parent && genre.value !== parent.slug) genre.value = parent.slug;
}

const filters = computed(() => ({ genre: genre.value, sub: sub.value, tag: tag.value, decade: decade.value, q: normalize(query.value) }));

function matches(movie, f, skip = []) {
  if (!skip.includes('genre') && f.genre && !movie.slugs.has(f.genre)) return false;
  if (!skip.includes('sub') && f.sub && !movie.slugs.has(f.sub)) return false;
  if (!skip.includes('tag') && f.tag && !movie.slugs.has(f.tag)) return false;
  if (!skip.includes('decade') && f.decade && movie.decade !== f.decade) return false;
  if (f.q && !movie.searchable.includes(f.q)) return false;
  return true;
}

const SKIPS = { genre: ['genre', 'sub'], sub: ['sub'], tag: ['tag'], decade: ['decade'] };
function countFor(kind, value) {
  const pool = movies.value.filter((m) => matches(m, filters.value, SKIPS[kind]));
  if (value === null) return pool.length;
  if (kind === 'decade') return pool.filter((m) => m.decade === value).length;
  return pool.filter((m) => m.slugs.has(value)).length;
}

const SORTERS = {
  rating: (a, b) => a.rank - b.rank,
  newest: (a, b) => String(b.release_date || '').localeCompare(String(a.release_date || '')) || a.rank - b.rank,
  oldest: (a, b) => String(a.release_date || '9999').localeCompare(String(b.release_date || '9999')) || a.rank - b.rank,
  added: (a, b) => b.id - a.id,
  title: (a, b) => String(a.title).localeCompare(String(b.title)),
};

const byDecade = (a, b) => (sort.value === 'oldest' ? 1 : -1) * ((a.decade || 0) - (b.decade || 0));
const results = computed(() => {
  const sorted = movies.value.filter((m) => matches(m, filters.value)).sort(SORTERS[sort.value]);
  return groupByDecade.value ? sorted.sort((a, b) => byDecade(a, b) || SORTERS[sort.value](a, b)) : sorted;
});
const decadeGroups = computed(() => {
  const groups = new Map();
  for (const m of results.value) {
    if (!groups.has(m.decade)) groups.set(m.decade, { key: String(m.decade), label: m.decade ? `${m.decade}s` : 'Undated', total: 0, items: [] });
    const group = groups.get(m.decade);
    group.items.push(m);
    group.total += 1;
  }
  return [...groups.values()];
});

const activeGenre = computed(() => genres.value.find((g) => g.slug === genre.value) || null);
const nameOf = (slug) => categories.value.find((c) => c.slug === slug)?.name || slug;
const activeChips = computed(() => [
  genre.value && { key: 'genre', label: nameOf(genre.value), clear: () => selectGenre(null) },
  sub.value && { key: 'sub', label: nameOf(sub.value), clear: () => { sub.value = null; } },
  tag.value && { key: 'tag', label: nameOf(tag.value), clear: () => { tag.value = null; } },
  decade.value && { key: 'decade', label: `${decade.value}s`, clear: () => { decade.value = null; } },
  query.value.trim() && { key: 'q', label: `“${query.value.trim()}”`, clear: () => { query.value = ''; } },
].filter(Boolean));
const activeCount = computed(() => activeChips.value.length);

function selectGenre(slug) {
  genre.value = slug;
  sub.value = null;
}

function clearAll() {
  genre.value = null;
  sub.value = null;
  tag.value = null;
  decade.value = null;
  query.value = '';
}

watch([filters, sort, groupByDecade], () => {
  const next = {
    genre: genre.value || undefined,
    sub: sub.value || undefined,
    tag: tag.value || undefined,
    decade: decade.value || undefined,
    q: query.value.trim() || undefined,
    sort: sort.value !== DEFAULT_SORT ? sort.value : undefined,
    group: groupByDecade.value ? undefined : 'none',
  };
  router.replace({ query: Object.fromEntries(Object.entries(next).filter(([, v]) => v !== undefined)) });
});

</script>

<style scoped>
.hw {
  --hw-accent: #8BE9FD;
  --hw-line: rgba(139, 233, 253, 0.18);
  --hw-soft: rgba(139, 233, 253, 0.1);
  --hw-text: #e0e6ed;
  --hw-muted: #9aa5b1;
  max-width: 1800px;
  margin: 0 auto;
  padding: 2.4rem 4rem 6rem;
  color: var(--hw-text);
}

.hw-layout {
  display: grid;
  grid-template-columns: 28rem minmax(0, 1fr);
  gap: 3rem;
  align-items: start;
}

.hw-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.hw-panel {
  padding: 1.6rem;
  border: 1px solid var(--hw-line);
  border-radius: 1.2rem;
  background: rgba(3, 4, 6, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.hw-panel__title,
.hw-label {
  display: block;
  margin: 0 0 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: var(--hw-text);
}

.hw-label:not(:first-child) {
  margin-top: 1.4rem;
}

.hw-input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.3);
  color: var(--hw-text);
  font-size: 1.4rem;
  transition: border-color 0.2s ease;
}

.hw-input:focus {
  outline: none;
  border-color: var(--hw-accent);
}

.hw-select option {
  background: #0a1e26;
}

.hw-results__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.4rem 2rem;
}

.hw-results__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem 2rem;
}

.hw-sort {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hw-sort__label {
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--hw-muted);
}

.hw-sort .hw-select {
  width: auto;
  min-width: 21rem;
}

.hw-toggle {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  white-space: nowrap;
  font-size: 1.3rem;
  color: #cfd6dc;
  cursor: pointer;
}

.hw-toggle input {
  width: 1.6rem;
  height: 1.6rem;
  accent-color: var(--hw-accent);
  cursor: pointer;
}

.hw-group + .hw-group {
  margin-top: 3.2rem;
}

.hw-group__title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1.4rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--hw-line);
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--hw-accent);
}

.hw-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hw-tree--sub {
  margin: 0.2rem 0 0.6rem 0.8rem;
  padding-left: 0.8rem;
  border-left: 1px solid var(--hw-line);
}

.hw-tree__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 0;
  border-radius: 0.8rem;
  background: transparent;
  color: #cfd6dc;
  font-size: 1.35rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.hw-tree__item--sub {
  font-size: 1.25rem;
  padding: 0.55rem 0.8rem;
}

.hw-tree__item:hover:not(:disabled) {
  background: rgba(139, 233, 253, 0.06);
  color: #fff;
}

.hw-tree__item.is-active {
  background: var(--hw-soft);
  color: var(--hw-accent);
  font-weight: 600;
}

.hw-tree__item:disabled,
.hw-chip:disabled {
  opacity: 0.35;
  cursor: default;
}

.hw-count {
  flex-shrink: 0;
  min-width: 2.4rem;
  padding: 0.1rem 0.6rem;
  border-radius: 99rem;
  background: rgba(255, 255, 255, 0.06);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  color: var(--hw-muted);
}

.is-active .hw-count {
  background: rgba(139, 233, 253, 0.18);
  color: var(--hw-accent);
}

.hw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.hw-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.1rem;
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 99rem;
  background: rgba(0, 0, 0, 0.3);
  color: #cfd6dc;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.hw-chip:hover:not(:disabled) {
  border-color: rgba(139, 233, 253, 0.4);
}

.hw-chip.is-active {
  border-color: rgba(139, 233, 253, 0.3);
  background: var(--hw-soft);
  color: var(--hw-accent);
}

.hw-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.8rem 1.6rem;
  border: 1px solid rgba(139, 233, 253, 0.22);
  border-radius: 99rem;
  background: rgba(3, 4, 6, 0.5);
  color: var(--hw-accent);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.hw-btn:hover {
  background: var(--hw-soft);
  border-color: rgba(139, 233, 253, 0.4);
}

.hw-btn--solid {
  background: var(--hw-soft);
}

.hw-btn--block {
  width: 100%;
}

.hw-link {
  padding: 0.4rem;
  border: 0;
  background: none;
  color: var(--hw-accent);
  font-size: 1.2rem;
  cursor: pointer;
}

.hw-link:hover {
  text-decoration: underline;
}

.hw button:focus-visible,
.hw-grid :deep(a:focus-visible) {
  outline: 2px solid var(--hw-accent);
  outline-offset: 2px;
}

.hw-filters-toggle {
  display: none;
}

.hw-results__bar {
  margin-bottom: 2rem;
  padding: 1.8rem 2rem;
  border: 1px solid var(--hw-line);
  border-radius: 1.4rem;
  background: linear-gradient(135deg, rgba(139, 233, 253, 0.07) 0%, rgba(3, 4, 6, 0.55) 55%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.hw-results__title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin: 0;
}

.hw-results__name {
  font-family: var(--font-display);
  font-size: var(--section-title-size, 2.2rem);
  font-weight: var(--section-title-weight, 700);
  letter-spacing: var(--section-title-tracking, 0);
  line-height: 1.2;
  color: #fff;
}

.hw-results__count {
  padding: 0.3rem 1.1rem;
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 99rem;
  background: rgba(139, 233, 253, 0.08);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--hw-accent);
}

.hw-results__desc {
  margin: 0.6rem 0 0;
  font-size: 1.4rem;
  color: var(--hw-muted);
}

.hw-active {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin: 1.4rem 0 0;
  padding: 1.4rem 0 0;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
  list-style: none;
}

.hw-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 2rem 1.2rem;
}

.hw-grid :deep(.card) {
  width: 100%;
  padding: 0;
  margin: 0;
}

.hw-grid :deep(.card__link) {
  position: relative;
}

.hw-grid :deep(.card__link)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.85;
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.hw-grid :deep(.card__link):hover::before {
  opacity: 1;
}

.hw-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 2rem;
  text-align: center;
}

.hw-state--inline {
  border: 1px dashed var(--hw-line);
  border-radius: 1.2rem;
}

.hw-state__title {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
}

.hw-state__text {
  margin: 0;
  font-size: 1.4rem;
  color: var(--hw-muted);
}

@media (max-width: 900px) {
  .hw {
    padding: 1.6rem 1.5rem 5rem;
  }

  .hw-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.4rem;
  }

  .hw-filters-toggle {
    display: inline-flex;
    justify-self: start;
  }

  .hw-sidebar {
    display: none;
  }

  .hw-results__bar {
    padding: 1.4rem 1.6rem;
  }

  .hw-sidebar--open {
    display: flex;
  }

  .hw-grid {
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: 1.6rem 1rem;
  }
}
</style>
