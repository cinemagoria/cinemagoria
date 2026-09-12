<template>
  <main :class="$style.page">
    <nav class="page-header">
      <h1 class="page-title">Awards</h1>
      <h2 class="page-subtitle">
        Browse all major film awards — winners &amp; nominees
      </h2>
    </nav>

    <div :class="$style.bodyRail">
      <button
        v-for="a in AWARDS"
        :key="a.key"
        type="button"
        :class="[$style.bodyCard, selectedAward === a.key && $style.bodyCardActive]"
        @click="selectAward(a.key)"
      >
        <span :class="$style.bodyName">{{ a.name }}</span>
        <span :class="$style.bodySub">{{ a.sub }}</span>
      </button>
    </div>

    <section v-if="years.length" :class="$style.controls">
      <div :class="$style.editionRow">
        <span :class="$style.editionLabel">Edition</span>
        <div :class="$style.editionRail">
          <button
            v-for="y in years"
            :key="y"
            type="button"
            :class="[$style.editionChip, activeYear === y && $style.editionChipActive]"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>

      <div v-if="items.length" :class="$style.toolbar">
        <div :class="$style.stats">
          <span :class="$style.stat">
            <strong :class="$style.statNum">{{ totalWinners }}</strong> Winners
          </span>
          <span :class="$style.statDot"></span>
          <span :class="$style.stat">
            <strong :class="$style.statNum">{{ totalNominees }}</strong> Nominees
          </span>
          <span :class="$style.statDot"></span>
          <span :class="$style.stat">
            <strong :class="$style.statNum">{{ categories.length }}</strong> Categories
          </span>
        </div>

        <div :class="$style.filters">
          <span v-if="isFiltering" :class="$style.resultCount">{{ visibleCount }} shown</span>
          <button
            v-if="!isFestival"
            type="button"
            :class="[$style.toggle, winnersOnly && $style.toggleOn]"
            @click="winnersOnly = !winnersOnly"
          >
            Winners only
          </button>
          <div :class="$style.searchBox">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <input
              v-model="query"
              type="search"
              :class="$style.searchInput"
              placeholder="Filter this edition"
              aria-label="Filter this edition"
            >
          </div>
        </div>
      </div>
    </section>

    <div v-if="pending" :class="$style.loaderBox">
      <div class="loader"></div>
    </div>

    <div v-else-if="sections.length" :class="$style.sections">
      <section v-for="section in sections" :key="section.key" :class="$style.section">
        <header :class="$style.sectionHead">
          <h2 :class="$style.sectionTitle">{{ section.title }}</h2>
          <span :class="$style.sectionCount">{{ section.rows.length }}</span>
        </header>

        <ul :class="[$style.rows, isFestival && $style.rowsFestival]">
          <li
            v-for="row in section.rows"
            :key="row.id"
            :class="[$style.row, row.won && $style.rowWon]"
          >
            <div :class="$style.cellWork">
              <button
                v-if="row.tmdbId && row.workTitle"
                type="button"
                :class="$style.workLink"
                @click="openWork(row)"
              >
                {{ row.workTitle }}
              </button>
              <span v-else-if="row.workTitle" :class="$style.workPlain">{{ row.workTitle }}</span>
              <span v-else :class="$style.cellEmpty">—</span>
              <span v-if="row.originalTitle" :class="$style.workOriginal">{{ row.originalTitle }}</span>
              <span v-if="row.country" :class="$style.workCountry">{{ row.country }}</span>
            </div>

            <div :class="$style.cellRecipients">
              <template v-for="(recipient, index) in row.recipients" :key="index">
                <button
                  v-if="recipient.kind === 'person'"
                  type="button"
                  :class="[$style.chip, $style.chipPerson]"
                  @click="searchPerson(recipient.label)"
                >
                  {{ recipient.label }}
                </button>
                <span
                  v-else-if="recipient.kind === 'country'"
                  :class="[$style.chip, $style.chipCountry]"
                >
                  {{ recipient.label }}
                </span>
                <span
                  v-else-if="recipient.kind === 'song'"
                  :class="[$style.chip, $style.chipSong]"
                >
                  {{ recipient.label }}
                </span>
                <span v-else :class="[$style.chip, $style.chipPlain]">{{ recipient.label }}</span>
              </template>
              <span v-if="!row.recipients.length" :class="$style.cellEmpty">—</span>
            </div>

            <div v-if="isFestival" :class="$style.cellAward">
              <span :class="[$style.awardChip, row.rank === 'silver' ? $style.awardChipSilver : $style.awardChipGold]">
                {{ row.awardLabel }}
              </span>
            </div>

            <div :class="$style.cellResult">
              <span v-if="row.won" :class="$style.badgeWon">Winner</span>
              <span v-else :class="$style.badgeNominee">Nominee</span>
              <span v-if="row.shared" :class="$style.badgeShared">Shared</span>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <div v-else-if="!pending" :class="$style.empty">
      {{ items.length ? 'No entries match this filter.' : 'No data found for this selection.' }}
    </div>
  </main>
</template>

<script setup>
const AWARDS = [
  { key: 'oscars',       name: 'Oscars',        sub: 'Academy Awards' },
  { key: 'goldenGlobes', name: 'Golden Globes', sub: 'HFPA' },
  { key: 'palme',        name: "Palme d'Or",    sub: 'Cannes' },
  { key: 'goldenLion',   name: 'Golden Lion',   sub: 'Venice' },
  { key: 'goldenBear',   name: 'Golden Bear',   sub: 'Berlin' },
];

const FESTIVAL_AWARDS = ['palme', 'goldenLion', 'goldenBear'];

const FESTIVAL_SILVER_LABELS = {
  palme: 'Grand Prix',
  goldenLion: 'Grand Jury Prize',
  goldenBear: 'Silver Bear (Grand Jury Prize)',
};

const SONG_CATEGORY = /original song/i;
const SONG_QUOTE = /^\s*["\u201C\u201D]\s*([^"\u201C\u201D]+?)\s*["\u201C\u201D]\s*([\s\S]*)$/;
const FOREIGN_FILM_CATEGORY = /foreign (?:film|language)|non-english language/i;
const PERSON_HONORIFIC = /demille|henrietta|carol burnett|star of the year|citizenship|filmstar/i;
const COUNTRY_CATEGORY = /international feature|foreign language film/i;
const ROLE_LABEL = /^(?:screenplay|story|written(?:\s+for\s+the\s+screen)?|adaptation|production design|set decoration|script collaborators?|lyrics?|music)\b\s*(?::|by\s+|-\s*)/i;
const PERSON_CATEGORY = /actor|actress|direct|screenplay|writing|story|cinematograph|editing|score|sound|costume|makeup|production design|art direction|effects|casting|dance/i;

const route = useRoute();
const router = useRouter();

const selectedAward = ref(route.query.award || 'oscars');
const selectedYear  = ref(route.query.year  || '');
const winnersOnly   = ref(false);
const query         = ref('');

const { data, pending } = await useAsyncData(
  () => `awards-${selectedAward.value}-${selectedYear.value || 'latest'}`,
  () => $fetch('/api/awards/index-page', {
    params: { award: selectedAward.value, year: selectedYear.value || undefined }
  }),
  { watch: [selectedAward, selectedYear] }
);

const years        = computed(() => data.value?.years ?? []);
const categories   = computed(() => data.value?.categories ?? []);
const activeYear   = computed(() => data.value?.selectedYear || selectedYear.value);
const currentAward = computed(() => AWARDS.find(a => a.key === selectedAward.value) || AWARDS[0]);
const isFestival   = computed(() => FESTIVAL_AWARDS.includes(selectedAward.value));

const items = computed(() => {
  const raw = data.value?.items ?? [];
  return raw.filter(i => workTitleOf(i) || recipientTextOf(i));
});

const totalWinners  = computed(() => items.value.filter(i => i.won).length);
const totalNominees = computed(() => items.value.filter(i => !i.won).length);

function workTitleOf(item) {
  return (item.film_title || item.film || '').trim();
}

function recipientTextOf(item) {
  return (item.nominee_name || item.nominee || item.director || '').trim();
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitNames(value) {
  return String(value || '')
    .split(/\s*[;,]\s*|\s+&\s+|\s+and\s+/i)
    .map(part => part.replace(ROLE_LABEL, '').trim())
    .filter(Boolean);
}

function looksLikeWork(item, blockTitles) {
  const recipient = normalizeText(recipientTextOf(item));
  if (!recipient) return false;
  if (recipient === normalizeText(workTitleOf(item))) return true;

  const parts = String(recipientTextOf(item)).split(/\s*,\s*/).map(p => p.trim()).filter(Boolean);
  return parts.length > 1 && parts.every(part => blockTitles.has(normalizeText(part)));
}

function countryDirectorParts(value) {
  const parts = String(value || '').split(/\s*,\s*/).map(part => part.trim()).filter(Boolean);
  return parts.length === 2 ? parts : null;
}

function splitSongCredits(text) {
  const quoted = String(text).match(SONG_QUOTE);
  if (quoted) {
    const rest = quoted[2].replace(/^[\s,]+/, '').replace(/^\(([\s\S]*)\)$/, '$1');
    return { song: quoted[1], people: splitNames(rest) };
  }

  const [song, ...rest] = String(text).split(/\s*,\s*/).map(part => part.trim()).filter(Boolean);
  return { song, people: rest.flatMap(splitNames) };
}

function resolveBlock(category, rows) {
  if (SONG_CATEGORY.test(category)) {
    const credited = rows.filter((item) => {
      const text = String(recipientTextOf(item));
      return SONG_QUOTE.test(text) || text.split(',').length > 2;
    }).length;
    return { kind: credited * 2 > rows.length ? 'songCredits' : 'song', inverted: false };
  }

  if (rows.every(item => !workTitleOf(item))) {
    return { kind: PERSON_HONORIFIC.test(category) ? 'person' : 'work', inverted: false };
  }

  if (FOREIGN_FILM_CATEGORY.test(category)) {
    const onTitle = rows.filter(item => countryDirectorParts(workTitleOf(item))).length;
    const onRecipient = rows.filter(item => countryDirectorParts(recipientTextOf(item))).length;
    return { kind: 'foreign', inverted: onTitle > onRecipient };
  }

  const blockTitles = new Set(rows.map(item => normalizeText(workTitleOf(item))).filter(Boolean));
  const workLike = rows.filter(item => looksLikeWork(item, blockTitles)).length;
  if (workLike * 2 > rows.length) return { kind: 'work', inverted: false };

  return { kind: COUNTRY_CATEGORY.test(category) ? 'country' : 'person', inverted: false };
}

function buildRecipients(text, kind, category) {
  if (!text) return [];

  if (kind === 'work') return [];
  if (kind === 'song') return [{ kind: 'song', label: text }];

  if (kind === 'songCredits') {
    const { song, people } = splitSongCredits(text);
    return [
      { kind: 'song', label: song },
      ...people.map(label => ({ kind: 'person', label })),
    ];
  }
  if (kind === 'country') return [{ kind: 'country', label: text }];

  if (kind === 'foreign') {
    const [country, ...rest] = String(text).split(/\s*,\s*/).map(part => part.trim()).filter(Boolean);
    return [
      { kind: 'country', label: country },
      ...rest.flatMap(splitNames).map(label => ({ kind: 'person', label })),
    ];
  }

  const canLink = PERSON_CATEGORY.test(category) || FESTIVAL_AWARDS.includes(selectedAward.value);
  return splitNames(text).map(label => ({
    kind: canLink || label.split(/\s+/).length > 1 ? 'person' : 'plain',
    label,
  }));
}

function buildRow(item, block, category) {
  const sourceTitle = workTitleOf(item);
  const sourceRecipient = recipientTextOf(item);

  const workTitle = block.inverted ? sourceRecipient : sourceTitle;
  const recipientText = block.inverted ? sourceTitle : sourceRecipient;
  const promoted = !workTitle && block.kind !== 'person';

  return {
    id: item.id,
    won: Boolean(item.won),
    shared: Boolean(item.shared),
    rank: item.rank,
    awardLabel: festivalAwardLabel(item),
    tmdbId: item.tmdb_id,
    mediaType: item.media_type === 'tv' ? 'tv' : 'movie',
    workTitle: promoted ? recipientText : workTitle,
    originalTitle: item.original_title && item.original_title !== workTitle ? item.original_title : '',
    country: item.country || '',
    recipients: promoted ? [] : buildRecipients(recipientText, block.kind, category),
  };
}

function festivalAwardLabel(item) {
  if (!isFestival.value) return '';
  if (item.rank === 'silver') {
    return FESTIVAL_SILVER_LABELS[currentAward.value.key] || `${currentAward.value.name} (Runner-up)`;
  }
  return currentAward.value.name;
}

const allSections = computed(() => {
  const grouped = new Map();
  for (const item of items.value) {
    const category = isFestival.value ? currentAward.value.name : (item.category || 'General');
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category).push(item);
  }

  return Array.from(grouped, ([category, rows]) => {
    const block = isFestival.value ? { kind: 'person', inverted: false } : resolveBlock(category, rows);
    return {
      key: category,
      title: category,
      rows: rows
        .map(item => buildRow(item, block, category))
        .sort((a, b) => Number(b.won) - Number(a.won)),
    };
  });
});

const normalizedQuery = computed(() => normalizeText(query.value));
const isFiltering = computed(() => Boolean(normalizedQuery.value) || winnersOnly.value);

function matchesQuery(row, section) {
  if (!normalizedQuery.value) return true;
  const haystack = [section.title, row.workTitle, row.originalTitle, row.country, ...row.recipients.map(r => r.label)];
  return haystack.some(value => normalizeText(value).includes(normalizedQuery.value));
}

const sections = computed(() => allSections.value
  .map(section => ({
    ...section,
    rows: section.rows.filter(row => (!winnersOnly.value || row.won) && matchesQuery(row, section)),
  }))
  .filter(section => section.rows.length));

const visibleCount = computed(() => sections.value.reduce((total, section) => total + section.rows.length, 0));

function selectAward(key) {
  selectedAward.value = key;
  selectedYear.value  = '';
  winnersOnly.value   = false;
  query.value         = '';
  router.replace({ query: { award: key } });
}

function selectYear(y) {
  selectedYear.value = y;
  router.replace({ query: { award: selectedAward.value, year: y } });
}

function openWork(row) {
  router.push(`/${row.mediaType}/${row.tmdbId}`);
}

async function searchPerson(name) {
  if (!name) return;
  try {
    const result = await $fetch('/api/search/person', { params: { query: name } });
    if (result?.results?.length) router.push(`/person/${result.results[0].id}`);
  } catch (e) {
    console.error('person search error', e);
  }
}

useHead({
  title: 'Cinemagoria — Awards: Oscars, Golden Globes, Cannes, Venice & Berlin',
  meta: [{ name: 'description', content: 'Browse all major film awards — Oscars, Golden Globes, Cannes, Venice and Berlin.' }]
});
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.page {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem 6rem;
}

.bodyRail {
  display: flex;
  justify-content: flex-start;
  gap: 0.8rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }

  @media (min-width: $breakpoint-small) {
    justify-content: center;
    flex-wrap: wrap;
    overflow-x: visible;
  }
}

.bodyCard {
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  min-width: 13rem;
  padding: 1.1rem 1.6rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .bodyCard:not(.bodyCardActive):hover {
    border-color: rgba(139, 233, 253, 0.4);
    background: rgba(139, 233, 253, 0.06);
  }
}

.bodyCardActive {
  border-color: rgba(139, 233, 253, 0.55);
  background: rgba(139, 233, 253, 0.1);
  box-shadow: 0 0 24px rgba(139, 233, 253, 0.12);

  .bodyName { color: $cyan-color; }
}

.bodyName {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
}

.bodySub {
  font-size: 1.15rem;
  color: #80868b;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.6rem 1.8rem;
  margin-bottom: 2.8rem;
  border-radius: 16px;
  border: 1px solid rgba(139, 233, 253, 0.12);
  background: rgba(3, 4, 6, 0.55);
  background-image: radial-gradient(120% 140% at 4% 0%, rgba(31, 84, 103, 0.22), transparent 58%);
}

.editionRow {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  min-width: 0;
}

.editionLabel {
  flex: 0 0 auto;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #80868b;
}

.editionRail {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }
}

.editionChip {
  flex: 0 0 auto;
  scroll-snap-align: start;
  height: 30px;
  padding: 0 1.3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #9aa0a6;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .editionChip:not(.editionChipActive):hover {
    color: $cyan-color;
    border-color: rgba(139, 233, 253, 0.5);
  }
}

.editionChipActive {
  color: #041014;
  font-weight: 600;
  background: $cyan-color;
  border-color: $cyan-color;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding-top: 1.4rem;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
}

.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: #80868b;
}

.stat { white-space: nowrap; }

.statNum {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: $cyan-color;
  margin-right: 0.3rem;
}

.statDot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.resultCount {
  font-size: 1.2rem;
  color: #80868b;
  white-space: nowrap;
}

.toggle {
  height: 34px;
  padding: 0 1.4rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.2);
  background: rgba(3, 4, 6, 0.55);
  color: #ACAFB5;
  font-size: 1.25rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .toggle:hover {
    color: $cyan-color;
    border-color: rgba(139, 233, 253, 0.5);
  }
}

.toggleOn {
  color: $cyan-color;
  border-color: rgba(139, 233, 253, 0.55);
  background: rgba(139, 233, 253, 0.08);
}

.searchBox {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  height: 34px;
  padding: 0 1.3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #80868b;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: rgba(139, 233, 253, 0.5);
    color: $cyan-color;
  }
}

.searchInput {
  width: 15rem;
  max-width: 40vw;
  border: 0;
  background: none;
  color: #fff;
  font-family: inherit;
  font-size: 1.25rem;
  outline: none;

  &::placeholder { color: #80868b; }
  &::-webkit-search-cancel-button { -webkit-appearance: none; }
}

.loaderBox {
  display: flex;
  justify-content: center;
  padding: 6rem 0;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  border-radius: 16px;
  border: 1px solid rgba(139, 233, 253, 0.1);
  background: rgba(3, 4, 6, 0.5);
  background-image: radial-gradient(120% 160% at 0% 0%, rgba(31, 84, 103, 0.16), transparent 56%);
  overflow: hidden;
}

.sectionHead {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.8rem;
  border-bottom: 1px solid rgba(139, 233, 253, 0.1);
}

.sectionTitle {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #fff;
  margin: 0;
}

.sectionCount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.1);
  color: $cyan-color;
  font-size: 1.1rem;
  font-weight: 600;
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) 11rem;
  align-items: center;
  gap: 0.8rem 1.6rem;
  padding: 1.2rem 1.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child { border-bottom: none; }
}

.rowsFestival .row {
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr) 20rem 11rem;
}

.rowWon {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.07), transparent 60%);
  box-shadow: inset 3px 0 0 rgba(255, 215, 0, 0.55);
}

.cellWork {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.workLink {
  padding: 0;
  border: 0;
  background: none;
  color: #fff;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .workLink:hover { color: $cyan-color; }
}

.workPlain {
  color: #ddd;
  font-size: 1.4rem;
  font-weight: 500;
}

.workOriginal {
  font-size: 1.15rem;
  color: #6b7177;
}

.workCountry {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5f666b;
}

.cellRecipients {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: 26px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 1.2rem;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chipPerson {
  border-color: rgba(139, 233, 253, 0.22);
  background: rgba(139, 233, 253, 0.07);
  color: #8AE8FC;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .chipPerson:hover {
    color: #041014;
    background: $cyan-color;
    border-color: $cyan-color;
  }
}

.chipCountry {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #ACAFB5;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 1.1rem;
}

.chipSong {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: #9aa0a6;
  font-style: italic;
}

.chipPlain {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  color: #9aa0a6;
}

.cellAward { min-width: 0; }

.awardChip {
  display: inline-block;
  max-width: 100%;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.awardChipGold {
  border-color: rgba(255, 215, 0, 0.4);
  background: rgba(255, 215, 0, 0.12);
  color: #FFD700;
}

.awardChipSilver {
  border-color: rgba(192, 192, 192, 0.38);
  background: rgba(192, 192, 192, 0.1);
  color: #D7D7D7;
}

.cellResult {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badgeWon {
  padding: 0.25rem 0.7rem;
  border-radius: 4px;
  background: #FFD700;
  color: #041014;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.badgeNominee {
  font-size: 1.15rem;
  color: #6b7177;
  white-space: nowrap;
}

.badgeShared {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8AE8FC;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cellEmpty { color: #4d5358; }

.empty {
  padding: 6rem 0;
  text-align: center;
  color: #80868b;
  font-size: 1.4rem;
}

@media (max-width: $breakpoint-small) {
  .page { padding: 0 1.5rem 5rem; }

  .controls { padding: 1.4rem; }

  .editionRow {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }

  .toolbar { align-items: flex-start; }

  .filters {
    width: 100%;
    margin-left: 0;
    flex-wrap: wrap;
  }

  .searchInput { max-width: none; flex: 1; }

  .row,
  .rowsFestival .row {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 1.4rem;
  }

  .cellRecipients,
  .cellAward { grid-column: 1 / -1; }

  .cellResult { align-self: start; }
}
</style>
