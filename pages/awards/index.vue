<template>
  <main :class="$style.page">
    <nav :class="$style.header">
      <h1 class="title-primary page-title">Premios</h1>
      <h2 class="title-secondary page-subtitle">
        Explora los grandes premios del cine — ganadores y nominados
      </h2>
    </nav>

    <!-- Selector de premios -->
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

    <!-- Selector de edición / año -->
    <div v-if="years.length" :class="$style.yearSection">
      <div :class="$style.yearLabel">Edición</div>
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

    <!-- Barra de estadísticas -->
    <div v-if="items.length" :class="$style.statsBar">
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ totalWinners }}</span>
        <span :class="$style.statLabel">Ganadores</span>
      </div>
      <div :class="$style.statDivider"></div>
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ totalNominees }}</span>
        <span :class="$style.statLabel">Nominados</span>
      </div>
      <div :class="$style.statDivider"></div>
      <div :class="$style.statItem">
        <span :class="$style.statNum">{{ categories.length }}</span>
        <span :class="$style.statLabel">Categorías</span>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="pending" :class="$style.loaderBox">
      <div class="loader"></div>
    </div>

    <!-- Resultados -->
    <div v-else-if="items.length" :class="$style.results">

      <!-- Premios de festival: solo ganadores -->
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
                  <th>Película</th>
                  <th>Director</th>
                  <th :class="$style.countryTh">País</th>
                  <th :class="$style.resultTh">Resultado</th>
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
                  <td><span :class="$style.winnerBadge">GANÓ</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- Oscars / Globos de Oro: agrupados por categoría, columnas: Película | Persona | Resultado -->
      <template v-else>
        <div
          v-for="cat in categories"
          :key="cat"
          :class="$style.categoryBlock"
        >
          <h2 :class="$style.categoryTitle">
            <span :class="$style.goldBar"></span>
            {{ translateCategory(cat) }}
          </h2>
          <div :class="$style.tableWrapper">
            <table :class="$style.table">
              <thead>
                <tr>
                  <th>Película / Serie</th>
                  <th>Persona/s</th>
                  <th :class="$style.resultTh">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in itemsByCategory[cat]"
                  :key="item.id"
                  :class="{ [$style.winnerRow]: item.won }"
                >
                  <!-- Película -->
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

                  <!-- Persona -->
                  <td>
                    <template v-if="selectedAward === 'oscars'">
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

                  <!-- Resultado -->
                  <td>
                    <span v-if="item.won" :class="$style.winnerBadge">GANÓ</span>
                    <span v-else :class="$style.nomineeBadge">Nom.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>

    <!-- Sin datos -->
    <div v-else-if="!pending" :class="$style.empty">
      No se encontraron datos para esta selección.
    </div>
  </main>
</template>

<script setup>
const AWARDS = [
  { key: 'oscars',       name: 'Oscars',         sub: 'Premios de la Academia' },
  { key: 'goldenGlobes', name: 'Globos de Oro',   sub: 'HFPA' },
  { key: 'palme',        name: 'Palma de Oro',    sub: 'Cannes' },
  { key: 'goldenLion',   name: 'León de Oro',     sub: 'Venecia' },
  { key: 'goldenBear',   name: 'Oso de Oro',      sub: 'Berlín' },
];

const route   = useRoute();
const router  = useRouter();

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

function navigateToMovie(tmdbId) { router.push(`/movie/${tmdbId}`); }

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

const translateCategory = (category) => {
  if (!category) return '';
  const t = {
    // ── Oscars (nombres modernos) ─────────────────────────────────────────
    'Actor in a Leading Role': 'Mejor Actor',
    'Actor in a Supporting Role': 'Mejor Actor de Reparto',
    'Actress in a Leading Role': 'Mejor Actriz',
    'Actress in a Supporting Role': 'Mejor Actriz de Reparto',
    'Animated Feature Film': 'Mejor Película de Animación',
    'Animated Short Film': 'Mejor Cortometraje de Animación',
    'Casting': 'Mejor Casting',
    'Cinematography': 'Mejor Fotografía',
    'Costume Design': 'Mejor Diseño de Vestuario',
    'Directing': 'Mejor Dirección',
    'Documentary Feature Film': 'Mejor Documental',
    'Documentary Short Film': 'Mejor Cortometraje Documental',
    'Film Editing': 'Mejor Montaje',
    'International Feature Film': 'Mejor Película Internacional',
    'Live Action Short Film': 'Mejor Cortometraje de Acción Real',
    'Makeup and Hairstyling': 'Mejor Maquillaje y Peluquería',
    'Music (Original Score)': 'Mejor Banda Sonora Original',
    'Music (Original Song)': 'Mejor Canción Original',
    'Production Design': 'Mejor Diseño de Producción',
    'Sound': 'Mejor Sonido',
    'Visual Effects': 'Mejores Efectos Visuales',
    'Writing (Adapted Screenplay)': 'Mejor Guion Adaptado',
    'Writing (Original Screenplay)': 'Mejor Guion Original',
    // ── Oscars (nombres históricos) ───────────────────────────────────────
    'Best Picture': 'Mejor Película',
    'Best Actor': 'Mejor Actor',
    'Best Actress': 'Mejor Actriz',
    'Best Supporting Actor': 'Mejor Actor de Reparto',
    'Best Supporting Actress': 'Mejor Actriz de Reparto',
    'Best Director': 'Mejor Director',
    'Best Adapted Screenplay': 'Mejor Guion Adaptado',
    'Best Original Screenplay': 'Mejor Guion Original',
    'Best Screenplay': 'Mejor Guion',
    'Best Score': 'Mejor Banda Sonora',
    'Best Original Score': 'Mejor Banda Sonora Original',
    'Best Production Design': 'Mejor Diseño de Producción',
    'Best Production Design (Color)': 'Mejor Diseño de Producción',
    'Best Production Design (Black and White)': 'Mejor Diseño de Producción',
    'Best Cinematography': 'Mejor Fotografía',
    'Best Cinematography (Color)': 'Mejor Fotografía',
    'Best Cinematography (Black and White)': 'Mejor Fotografía',
    'Best Film Editing': 'Mejor Montaje',
    'Best Sound Mixing': 'Mejor Mezcla de Sonido',
    'Best Sound Editing': 'Mejor Edición de Sonido',
    'Best Makeup and Hairstyling': 'Mejor Maquillaje y Peluquería',
    'Best Costume Design': 'Mejor Diseño de Vestuario',
    'Best Costume Design (Color)': 'Mejor Diseño de Vestuario',
    'Best Visual Effects': 'Mejores Efectos Visuales',
    'Best Visual/Special Effects': 'Mejores Efectos Visuales',
    'Best Animated Feature': 'Mejor Película de Animación',
    'Best Foreign Language Film': 'Mejor Película Extranjera',
    'Best Documentary Feature': 'Mejor Documental',
    'Best Original Song': 'Mejor Canción Original',
    'Best Original Story': 'Mejor Historia Original',
    'Unique and Artistic Production': 'Producción Única y Artística',
    // ── Golden Globes (nombres modernos) ──────────────────────────────────
    'Best Motion Picture - Drama': 'Mejor Película - Drama',
    'Best Motion Picture - Musical or Comedy': 'Mejor Película - Musical o Comedia',
    'Best Motion Picture - Animated': 'Mejor Película de Animación',
    'Best Motion Picture - Non-English Language': 'Mejor Película en Lengua No Inglesa',
    'Best Motion Picture - Foreign Language': 'Mejor Película en Lengua Extranjera',
    'Best Actor - Motion Picture Drama': 'Mejor Actor - Drama',
    'Best Actress - Motion Picture Drama': 'Mejor Actriz - Drama',
    'Best Actor - Motion Picture Musical or Comedy': 'Mejor Actor - Musical o Comedia',
    'Best Actress - Motion Picture Musical or Comedy': 'Mejor Actriz - Musical o Comedia',
    'Best Supporting Actor - Motion Picture': 'Mejor Actor de Reparto',
    'Best Supporting Actress - Motion Picture': 'Mejor Actriz de Reparto',
    'Best Director - Motion Picture': 'Mejor Director',
    'Best Screenplay - Motion Picture': 'Mejor Guion',
    'Best Original Score - Motion Picture': 'Mejor Banda Sonora Original',
    'Best Original Song - Motion Picture': 'Mejor Canción Original',
    'Cinematic and Box Office Achievement': 'Logro Cinematográfico y de Taquilla',
    // ── Golden Globes TV ──────────────────────────────────────────────────
    'Best Television Series - Drama': 'Mejor Serie TV - Drama',
    'Best Television Series - Musical or Comedy': 'Mejor Serie TV - Musical o Comedia',
    'Best Mini-Series or Motion Picture Made for Television': 'Mejor Miniserie o Película para TV',
    'Best Miniseries or Television Film': 'Mejor Miniserie o Película de TV',
    'Best Actor - Television Series Drama': 'Mejor Actor - Serie TV Drama',
    'Best Actress - Television Series Drama': 'Mejor Actriz - Serie TV Drama',
    'Best Actor - Television Series Musical or Comedy': 'Mejor Actor - Serie TV Musical o Comedia',
    'Best Actress - Television Series Musical or Comedy': 'Mejor Actriz - Serie TV Musical o Comedia',
    'Best Actor - Miniseries or Television Film': 'Mejor Actor - Miniserie o Película de TV',
    'Best Actress - Miniseries or Television Film': 'Mejor Actriz - Miniserie o Película de TV',
    'Best Supporting Actor - Television': 'Mejor Actor de Reparto - TV',
    'Best Supporting Actress - Television': 'Mejor Actriz de Reparto - TV',
    'Best Performance by an Actor in a Motion Picture - Drama': 'Mejor Actor - Drama',
    'Best Performance by an Actress in a Motion Picture - Drama': 'Mejor Actriz - Drama',
    'Best Performance by an Actor in a Motion Picture - Musical or Comedy': 'Mejor Actor - Musical o Comedia',
    'Best Performance by an Actress in a Motion Picture - Musical or Comedy': 'Mejor Actriz - Musical o Comedia',
    'Best Performance by an Actor in a Supporting Role in any Motion Picture': 'Mejor Actor de Reparto',
    'Best Performance by an Actress in a Supporting Role in any Motion Picture': 'Mejor Actriz de Reparto',
    'Best Performance by an Actor In A Television Series - Drama': 'Mejor Actor en Serie TV - Drama',
    'Best Performance by an Actress In A Television Series - Drama': 'Mejor Actriz en Serie TV - Drama',
    'Best Performance by an Actor In A Television Series - Musical or Comedy': 'Mejor Actor en Serie TV - Musical o Comedia',
    'Best Performance by an Actress In A Television Series - Musical or Comedy': 'Mejor Actriz en Serie TV - Musical o Comedia',
    'Best Performance by an Actor in a Mini-Series or Motion Picture Made for Television': 'Mejor Actor en Miniserie o Película para TV',
    'Best Performance by an Actress in a Mini-Series or Motion Picture Made for Television': 'Mejor Actriz en Miniserie o Película para TV',
    'Best Performance by an Actor in a Supporting Role in a Series, Mini-Series or Motion Picture Made for Television': 'Mejor Actor de Reparto en Serie o Miniserie',
    'Best Performance by an Actress in a Supporting Role in a Series, Mini-Series or Motion Picture Made for Television': 'Mejor Actriz de Reparto en Serie o Miniserie',
    'Best Performance by an Actor in a Supporting Role in a Series, Limited Series or Motion Picture Made for Television': 'Mejor Actor de Reparto en Serie Limitada',
    'Best Performance by an Actress in a Supporting Role in a Series, Limited Series or Motion Picture Made for Television': 'Mejor Actriz de Reparto en Serie Limitada',
  };
  return t[category] || category;
};

useHead({
  title: 'Premios | Entercinema',
  meta: [{ name: 'description', content: 'Explora todos los grandes premios del cine: Oscars, Globos de Oro, Cannes, Venecia y Berlín.' }]
});
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.page {
  min-height: 100vh;
  padding: 0 3rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

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
  &:hover { border-color: rgba(255,215,0,0.35); background: rgba(255,215,0,0.06); transform: translateY(-2px); }
}

.awardCardActive {
  border-color: #FFD700;
  background: rgba(255,215,0,0.1);
  box-shadow: 0 0 18px rgba(255,215,0,0.18);
}

.awardName { font-size: 1.3rem; font-weight: 700; color: #fff; text-align: center; }
.awardSub  { font-size: 1.05rem; color: #B7B7B7; }

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

.loaderBox { display: flex; justify-content: center; padding: 5rem 0; }
.results   { display: flex; flex-direction: column; gap: 2.8rem; }

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

.resultTh  { width: 80px; }
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

.originalTitle { color: #555; font-size: 1.1rem; }
.mutedCell     { color: #B7B7B7; }

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

.nomineeBadge { color: #B7B7B7; font-size: 1rem; text-transform: uppercase; }

.empty { text-align: center; color: #B7B7B7; font-size: 1.4rem; padding: 5rem 0; }

@media (max-width: 768px) {
  .page { padding: 0 1.5rem 5rem; }
  .awardSelector { gap: 0.5rem; }
  .awardCard { padding: 0.9rem 1rem; min-width: 90px; }
  .statsBar { gap: 1rem; padding: 0.9rem; }
}
</style>
