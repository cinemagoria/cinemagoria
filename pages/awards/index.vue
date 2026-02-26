<template>
  <main :class="$style.page">
    <nav :class="$style.header">
      <h1 class="title-primary page-title">Awards</h1>
      <h2 class="title-secondary page-subtitle">
        Browse all major film awards — winners &amp; nominees
      </h2>
    </nav>

    <!-- Award selector -->
    <div :class="$style.awardSelector">
      <button
        v-for="a in AWARDS"
        :key="a.key"
        :class="[$style.awardCard, selectedAward === a.key && $style.awardCardActive]"
        @click="selectAward(a.key)"
      >
        <span :class="$style.awardName">{{ a.name }}</span>
        <span :class="$style.awardSub">{{ a.sub }}</span>
      </button>
    </div>

    <!-- Edition picker -->
    <div v-if="years.length" :class="$style.yearSection">
      <div :class="$style.yearLabel">Edition</div>
      <div :class="$style.yearScroller">
        <button
          v-for="y in years"
          :key="y"
          :class="[$style.yearChip, selectedYear === y && $style.yearChipActive]"
          @click="selectYear(y)"
        >
          {{ y }}
        </button>
      </div>
    </div>

    <!-- Stats bar -->
    <div v-if="items.length" :class="$style.statsBar">
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ totalWinners }}</span>
        <span :class="$style.statLabel">Winners</span>
      </div>
      <div :class="$style.statDivider"></div>
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ totalNominees }}</span>
        <span :class="$style.statLabel">Nominees</span>
      </div>
      <div :class="$style.statDivider"></div>
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ categories.length }}</span>
        <span :class="$style.statLabel">Categories</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" :class="$style.loaderBox">
      <div class="loader"></div>
    </div>

    <!-- Results -->
    <div v-else-if="items.length" :class="$style.results">

      <!-- Festival-type awards (Palme, Golden Lion, Golden Bear): only winners -->
      <template v-if="isFestival">
        <div :class="$style.categoryBlock">
          <h2 :class="$style.categoryTitle">
            <span :class="$style.goldBar"></span>
            {{ currentAward.name }}
          </h2>
          <div :class="$style.tableWrapper">
            <table :class="$style.table">
              <thead>
                <tr>
                  <th>Film</th>
                  <th>Director</th>
                  <th :class="$style.countryTh">Country</th>
                  <th :class="$style.resultTh">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  :class="$style.winnerRow"
                >
                  <td>
                    <span
                      v-if="item.tmdb_id"
                      :class="$style.clickable"
                      @click="navigateToMovie(item.tmdb_id)"
                    >{{ item.film_title }}</span>
                    <span v-else>{{ item.film_title }}</span>
                    <span v-if="item.original_title && item.original_title !== item.film_title" :class="$style.originalTitle"> — {{ item.original_title }}</span>
                  </td>
                  <td>
                    <span :class="$style.clickable" @click="searchPerson(item.director)">{{ item.director }}</span>
                  </td>
                  <td :class="$style.mutedCell">{{ item.country }}</td>
                  <td><span :class="$style.winnerBadge">WON</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- Oscars / Golden Globes: grouped by category, unified Film | Person | Result layout -->
      <template v-else>
        <div
          v-for="cat in categories"
          :key="cat"
          :class="$style.categoryBlock"
        >
          <h2 :class="$style.categoryTitle">
            <span :class="$style.goldBar"></span>
            {{ cat }}
          </h2>
          <div :class="$style.tableWrapper">
            <table :class="$style.table">
              <thead>
                <tr>
                  <th>Film / Series</th>
                  <th>Person/s</th>
                  <th :class="$style.resultTh">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in itemsByCategory[cat]"
                  :key="item.id"
                  :class="{ [$style.winnerRow]: item.won }"
                >
                  <!-- Film cell — works for both Oscars (film_title) and Golden Globes (film) -->
                  <td>
                    <template v-if="selectedAward === 'oscars'">
                      <span
                        v-if="item.tmdb_id && item.film_title"
                        :class="$style.clickable"
                        @click="navigateToMovie(item.tmdb_id)"
                      >{{ item.film_title }}</span>
                      <span v-else-if="item.film_title">{{ item.film_title }}</span>
                      <span v-else :class="$style.mutedCell">—</span>
                    </template>
                    <template v-else-if="selectedAward === 'goldenGlobes'">
                      <span
                        v-if="item.tmdb_id && item.film"
                        :class="$style.clickable"
                        @click="navigateToMedia(item.tmdb_id, item.category)"
                      >{{ item.film }}</span>
                      <span v-else-if="item.film">{{ item.film }}</span>
                      <span v-else :class="$style.mutedCell">—</span>
                    </template>
                  </td>

                  <!-- Person cell — works for both Oscars (nominee_name) and Golden Globes (nominee) -->
                  <td>
                    <template v-if="selectedAward === 'oscars'">
                      <!-- For Best Picture the nominee IS the film title; skip person link -->
                      <span
                        v-if="item.nominee_name && item.nominee_name !== item.film_title"
                        :class="$style.clickable"
                        @click="searchPerson(item.nominee_name)"
                      >{{ item.nominee_name }}</span>
                      <span v-else :class="$style.mutedCell">—</span>
                    </template>
                    <template v-else-if="selectedAward === 'goldenGlobes'">
                      <span
                        v-if="item.nominee"
                        :class="$style.clickable"
                        @click="searchPerson(item.nominee)"
                      >{{ item.nominee }}</span>
                      <span v-else :class="$style.mutedCell">—</span>
                    </template>
                  </td>

                  <!-- Result -->
                  <td>
                    <span v-if="item.won" :class="$style.winnerBadge">WON</span>
                    <span v-else :class="$style.nomineeBadge">Nom.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- Empty state -->
    <div v-else-if="!pending" :class="$style.empty">
      No data found for this selection.
    </div>
  </main>
</template>

<script setup>
const AWARDS = [
  { key: 'oscars',       name: 'Oscars',        sub: 'Academy Awards' },
  { key: 'goldenGlobes', name: 'Golden Globes',  sub: 'HFPA' },
  { key: 'palme',        name: "Palme d'Or",     sub: 'Cannes' },
  { key: 'goldenLion',   name: 'Golden Lion',    sub: 'Venice' },
  { key: 'goldenBear',   name: 'Golden Bear',    sub: 'Berlin' },
];

const route = useRoute();
const router = useRouter();

const selectedAward = ref(route.query.award || 'oscars');
const selectedYear  = ref(route.query.year  || '');

const { data, pending } = await useAsyncData(
  'awards-index',
  () => $fetch('/api/awards/index-page', {
    params: { award: selectedAward.value, year: selectedYear.value || undefined }
  }),
  { watch: [selectedAward, selectedYear] }
);

const years      = computed(() => data.value?.years      ?? []);
const categories = computed(() => data.value?.categories ?? []);
const items      = computed(() => data.value?.items      ?? []);

watch(data, (val) => {
  if (val?.selectedYear && !selectedYear.value) selectedYear.value = val.selectedYear;
}, { immediate: true });

const currentAward = computed(() => AWARDS.find(a => a.key === selectedAward.value) || AWARDS[0]);
const isFestival   = computed(() => ['palme', 'goldenLion', 'goldenBear'].includes(selectedAward.value));

const itemsByCategory = computed(() => {
  const map = {};
  for (const item of items.value) {
    const cat = item.category || 'General';
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  }
  for (const cat of Object.keys(map)) {
    map[cat].sort((a, b) => (b.won || 0) - (a.won || 0));
  }
  return map;
});

const totalWinners  = computed(() => items.value.filter(i => i.won).length);
const totalNominees = computed(() => items.value.filter(i => !i.won).length);

function selectAward(key) {
  selectedAward.value = key;
  selectedYear.value  = '';
  router.replace({ query: { award: key } });
}

function selectYear(y) {
  selectedYear.value = y;
  router.replace({ query: { award: selectedAward.value, year: y } });
}

function navigateToMovie(tmdbId) {
  router.push(`/movie/${tmdbId}`);
}

function navigateToMedia(tmdbId, category) {
  const isTV = /television|series|miniseries/i.test(category || '');
  router.push(isTV ? `/tv/${tmdbId}` : `/movie/${tmdbId}`);
}

async function searchPerson(name) {
  if (!name) return;
  try {
    const res  = await fetch(`/api/search/person?query=${encodeURIComponent(name)}`);
    const json = await res.json();
    if (json.results?.length) router.push(`/person/${json.results[0].id}`);
  } catch (e) { console.error('person search error', e); }
}

useHead({
  title: 'Awards | Entercinema',
  meta: [{ name: 'description', content: 'Browse all major film awards — Oscars, Golden Globes, Cannes, Venice and Berlin.' }]
});
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

// ─── Page shell ─────────────────────────────────────────────────────────────
.page {
  min-height: 100vh;
  padding: 0 3rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

// ─── Header (reuses global title-primary / title-secondary) ─────────────────
.header {
  text-align: center;
  padding-top: 30px;
  margin-bottom: 3rem;

  :global(.page-subtitle) {
    color: rgb(172, 175, 181);
    font-size: 14px;
    max-width: 600px;
    margin: 10px auto 0;
  }
}

// ─── Award selector ──────────────────────────────────────────────────────────
.awardSelector {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3rem;
}

.awardCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 1.2rem 1.8rem;
  border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  transition: all 0.18s ease;
  min-width: 120px;

  &:hover {
    border-color: rgba(255, 215, 0, 0.35);
    background: rgba(255, 215, 0, 0.06);
    transform: translateY(-2px);
  }
}

.awardCardActive {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 18px rgba(255, 215, 0, 0.18);
}

.awardName {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.awardSub {
  font-size: 1.05rem;
  color: #B7B7B7;
}

// ─── Year scroller ───────────────────────────────────────────────────────────
.yearSection { margin-bottom: 2.5rem; }

.yearLabel {
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #aaa;
  margin-bottom: 0.7rem;
}

.yearScroller {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,215,0,0.3) transparent;
  &::-webkit-scrollbar        { height: 3px; }
  &::-webkit-scrollbar-thumb  { background: rgba(255,215,0,0.3); border-radius: 999px; }
}

.yearChip {
  flex-shrink: 0;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: #bbb;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.13s ease;
  white-space: nowrap;
  &:hover { border-color: rgba(255,215,0,0.4); color: #FFD700; }
}

.yearChipActive {
  border-color: #FFD700;
  background: rgba(255,215,0,0.13);
  color: #FFD700;
  font-weight: 600;
}

// ─── Stats bar ───────────────────────────────────────────────────────────────
.statsBar {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255,215,0,0.05);
  border: 1px solid rgba(255,215,0,0.13);
  border-radius: 10px;
  padding: 1.1rem 2rem;
  margin-bottom: 3rem;
}

.statItem  { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
.statNum   { font-size: 2rem; font-weight: 800; color: #FFD700; line-height: 1; }
.statLabel { font-size: 1rem; color: #bbb; text-transform: uppercase; letter-spacing: 0.5px; }
.statDivider { width: 1px; height: 34px; background: rgba(255,255,255,0.15); }

// ─── Loader ──────────────────────────────────────────────────────────────────
.loaderBox { display: flex; justify-content: center; padding: 5rem 0; }

// ─── Results ─────────────────────────────────────────────────────────────────
.results { display: flex; flex-direction: column; gap: 2.8rem; }

// ─── Category block ──────────────────────────────────────────────────────────
.categoryTitle {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.9rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.goldBar {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background: #FFD700;
  border-radius: 2px;
  flex-shrink: 0;
}

// ─── Table ───────────────────────────────────────────────────────────────────
.tableWrapper {
  border-radius: 8px;
  background: rgba(0,0,0,0.22);
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.3rem;
  color: #ccc;

  th {
    text-align: left;
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    color: #8AE8FC;
    font-size: 1.05rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  td {
    padding: 0.8rem 1.1rem;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
}

.resultTh  { width: 80px;  }
.countryTh { width: 120px; }

.winnerRow {
  background: linear-gradient(90deg, rgba(255,215,0,0.09) 0%, transparent 100%);
  td { color: #fff; }
}

.clickable {
  color: #8AE8FC;
  cursor: pointer;
  text-underline-offset: 2px;
  text-decoration: underline;
  text-decoration-color: rgba(138,232,252,0.3);
  transition: all 0.13s ease;
  &:hover { color: #fff; text-decoration-color: #8AE8FC; }
}

.originalTitle {
  color: #555;
  font-size: 1.1rem;
}

.mutedCell { color: #B7B7B7; }

.winnerBadge {
  background: #FFD700;
  color: #000;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  text-transform: uppercase;
  white-space: nowrap;
}

.nomineeBadge {
  color: #B7B7B7;
  font-size: 1rem;
  text-transform: uppercase;
}

// ─── Empty ───────────────────────────────────────────────────────────────────
.empty { text-align: center; color: #B7B7B7; font-size: 1.4rem; padding: 5rem 0; }

// ─── Responsive ──────────────────────────────────────────────────────────────
@media (max-width: 768px) {
  .page { padding: 0 1.5rem 5rem; }
  .awardSelector { gap: 0.5rem; }
  .awardCard { padding: 0.9rem 1rem; min-width: 90px; }
  .statsBar { gap: 1rem; padding: 0.9rem; }
}
</style>
