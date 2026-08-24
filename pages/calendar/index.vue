<template>
  <div class="calendar-page">
    <UserNav />

    <div class="cal-ambient" aria-hidden="true"></div>

    <main class="cal-main">
      <header class="page-header cal-header">
        <h1 class="page-title">Calendario de estrenos</h1>
        <p class="page-subtitle">Fechas de cine, streaming y festivales, día a día.</p>

        <button class="cal-scope-btn" @click="scopeOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          Qué títulos incluye este calendario
        </button>
      </header>

      <section class="cal-panel cal-nav-panel">
        <div class="cal-nav">
          <button class="cal-step" aria-label="Período anterior" @click="step(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>

          <div class="cal-period">
            <span class="cal-period-main">{{ periodLabel }}</span>
            <span class="cal-period-sub">{{ periodEntries.length }} estrenos</span>
          </div>

          <button class="cal-step" aria-label="Período siguiente" @click="step(1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>

          <div class="cal-modes" role="tablist" aria-label="Vista del calendario">
            <button
              v-for="mode in MODES"
              :key="mode.id"
              role="tab"
              :aria-selected="view === mode.id"
              :class="['cal-mode', { active: view === mode.id }]"
              @click="setView(mode.id)"
            >{{ mode.label }}</button>
          </div>

          <button v-if="!isCurrentPeriod" class="cal-today" @click="goToday">Hoy</button>
        </div>

        <div v-if="view === 'week'" class="cal-strip" role="tablist" aria-label="Día">
          <button
            :class="['cal-strip-item', 'all', { active: selectedDay === null }]"
            role="tab"
            :aria-selected="selectedDay === null"
            @click="selectedDay = null"
          >
            <span class="cal-strip-name">Todo</span>
            <span class="cal-strip-num">7d</span>
            <span class="cal-strip-count">{{ visibleEntries.length }}</span>
          </button>

          <button
            v-for="day in weekDays"
            :key="day.date"
            role="tab"
            :aria-selected="selectedDay === day.date"
            :class="['cal-strip-item', { active: selectedDay === day.date, today: day.date === todayIso, empty: !day.entries.length }]"
            @click="selectedDay = day.date"
          >
            <span class="cal-strip-name">{{ day.weekday }}</span>
            <span class="cal-strip-num">{{ day.dayNumber }}</span>
            <span class="cal-strip-count">{{ day.entries.length }}</span>
          </button>
        </div>

        <div v-else class="cal-grid-wrap">
          <div class="cal-grid-head" aria-hidden="true">
            <span v-for="name in WEEKDAYS" :key="name">{{ name }}</span>
          </div>
          <div class="cal-grid">
            <button
              v-for="cell in monthCells"
              :key="cell.key"
              :class="['cal-cell', {
                outside: cell.outside,
                today: cell.date === todayIso,
                has: cell.entries.length,
                active: effectiveDay === cell.date,
              }]"
              :disabled="!cell.entries.length"
              @click="selectedDay = cell.date"
            >
              <span class="cal-cell-num">{{ cell.dayNumber }}</span>
              <span v-if="cell.entries.length" class="cal-cell-count">{{ cell.entries.length }}</span>
              <span v-if="cell.entries.length" class="cal-cell-bar" aria-hidden="true">
                <i v-for="lens in cell.lenses" :key="lens" :data-lens="lens"></i>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section class="cal-panel cal-filters" aria-label="Filtros">
        <div class="cal-lenses" role="group" aria-label="Tipo de estreno">
          <button
            v-for="lens in LENSES"
            :key="lens.id"
            :class="['cal-lens', { active: activeLens === lens.id }]"
            :disabled="lens.id !== 'all' && !lensCounts[lens.id]"
            @click="activeLens = lens.id"
          >
            <span class="cal-lens-dot" :data-lens="lens.id"></span>
            {{ lens.label }}
            <span class="cal-lens-count">{{ lens.id === 'all' ? periodEntries.length : (lensCounts[lens.id] || 0) }}</span>
          </button>
        </div>

        <div class="cal-controls">
          <div class="cal-search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4a6 6 0 106 6 6 6 0 00-6-6zm4.5 10.5L20 20" /></svg>
            <input v-model="query" type="search" placeholder="Buscar en este período" aria-label="Buscar títulos" />
            <button v-if="query" class="cal-clear" aria-label="Borrar búsqueda" @click="query = ''">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <div ref="territoryBox" class="control-group control-group--territory">
            <span class="control-label">Territorio</span>
            <button
              class="control-trigger"
              :class="{ 'control-trigger--on': territory }"
              :disabled="!territories.length"
              @click.stop="territoryOpen = !territoryOpen"
            >
              <span>{{ territoryLabel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>

            <div v-if="territoryOpen" class="cal-menu" @click.stop>
              <button
                class="cal-option"
                :class="{ 'cal-option--on': !territory }"
                @click="pickTerritory('')"
              >
                <span class="cal-radio"></span>
                Todo el mundo
              </button>
              <button
                v-for="c in territories"
                :key="`t-${c.code}`"
                class="cal-option"
                :class="{ 'cal-option--on': territory === c.code }"
                @click="pickTerritory(c.code)"
              >
                <span class="cal-radio"></span>
                {{ c.name }}
                <em>{{ c.count }}</em>
              </button>
            </div>
          </div>

          <div class="control-group">
            <span class="control-label">Tipo</span>
            <div class="seg">
              <button
                v-for="option in MEDIA_OPTIONS"
                :key="`m-${option.value}`"
                class="seg__btn"
                :class="{ 'seg__btn--on': mediaKind === option.value }"
                @click="mediaKind = option.value"
              >{{ option.label }}</button>
            </div>
          </div>

          <button v-if="hasActiveFilters" class="cal-reset" @click="resetFilters">Limpiar</button>
        </div>
      </section>

      <div v-if="pending" class="cal-state">
        <div class="cal-spinner" aria-hidden="true"></div>
        <p>Cargando {{ periodLabel }}</p>
      </div>

      <div v-else-if="loadError" class="cal-state error">
        <p>{{ loadError }}</p>
        <button class="cal-retry" @click="loadPeriod(true)">Reintentar</button>
      </div>

      <template v-else>
        <section v-for="group in shownGroups" :key="group.date" class="cal-group">
          <header class="cal-group-head">
            <span class="cal-group-num">{{ group.dayNumber }}</span>
            <span class="cal-group-name">
              {{ group.weekdayLong }}
              <em>{{ group.monthLabel }}</em>
            </span>
            <span v-if="group.date === todayIso" class="cal-group-today">Hoy</span>
            <span class="cal-group-count">{{ group.entries.length }}</span>
          </header>

          <div class="cal-cards">
            <CalendarEntry v-for="entry in group.entries" :key="entry.uid" :entry="entry" />
          </div>
        </section>

        <p v-if="!shownGroups.length" class="cal-empty">
          {{ hasActiveFilters ? 'Ningún resultado con estos filtros.' : 'No hay estrenos registrados en este período.' }}
        </p>
      </template>
    </main>

    <CalendarScopeModal v-if="scopeOpen" @close="scopeOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import CalendarEntry from '~/components/calendar/CalendarEntry.vue'
import CalendarScopeModal from '~/components/calendar/CalendarScopeModal.vue'

const MODES = [{ id: 'month', label: 'Mes' }, { id: 'week', label: 'Semana' }]
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const LENSES = [
  { id: 'all', label: 'Todos', types: null },
  { id: 'theatrical', label: 'Cines', types: [2, 3] },
  { id: 'streaming', label: 'Streaming', types: [4] },
  { id: 'festival', label: 'Festivales', types: [1] },
  { id: 'tv', label: 'TV', types: [6, 7] },
]
const MEDIA_OPTIONS = [
  { value: '', label: 'Todo' },
  { value: 'movie', label: 'Películas' },
  { value: 'tv', label: 'Series' },
]
const LENS_BY_TYPE = { 1: 'festival', 2: 'theatrical', 3: 'theatrical', 4: 'streaming', 5: 'physical', 6: 'tv', 7: 'tv' }
const DAY_MS = 86400000

let regionNames = null
const countryName = (code) => {
  if (!code) return ''
  if (!regionNames && typeof Intl !== 'undefined' && Intl.DisplayNames) {
    try { regionNames = new Intl.DisplayNames(['es'], { type: 'region' }) } catch { regionNames = null }
  }
  try { return regionNames ? regionNames.of(code) || code : code } catch { return code }
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const iso = (d) => d.toISOString().slice(0, 10)
const parse = (s) => new Date(`${s}T00:00:00Z`)
const localToday = () => {
  const d = new Date()
  return iso(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())))
}
const todayIso = ref(iso(new Date()))

const view = ref('month')
const anchor = ref(todayIso.value)
const selectedDay = ref(null)
const activeLens = ref('all')
const territory = ref('')
const mediaKind = ref('')
const query = ref('')
const scopeOpen = ref(false)
const territoryOpen = ref(false)
const territoryBox = ref(null)
const pending = ref(true)
const loadError = ref('')
const months = ref(new Map())

function mondayOf(dateIso) {
  const d = parse(dateIso)
  return iso(new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY_MS))
}

const periodRange = computed(() => {
  if (view.value === 'week') {
    const from = mondayOf(anchor.value)
    return { from, to: iso(new Date(parse(from).getTime() + 6 * DAY_MS)) }
  }
  const d = parse(anchor.value)
  return {
    from: iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))),
    to: iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))),
  }
})

const monthName = (d) => capitalize(d.toLocaleDateString('es-ES', { month: 'long', timeZone: 'UTC' }))

const periodLabel = computed(() => {
  const start = parse(periodRange.value.from)
  if (view.value === 'month') {
    return `${monthName(start)} de ${start.getUTCFullYear()}`
  }
  const end = parse(periodRange.value.to)
  const sameMonth = start.getUTCMonth() === end.getUTCMonth()
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear()
  if (sameMonth) {
    return `${start.getUTCDate()} – ${end.getUTCDate()} de ${monthName(start).toLowerCase()} de ${end.getUTCFullYear()}`
  }
  if (sameYear) {
    return `${start.getUTCDate()} de ${monthName(start).toLowerCase()} – ${end.getUTCDate()} de ${monthName(end).toLowerCase()} de ${end.getUTCFullYear()}`
  }
  return `${start.getUTCDate()} de ${monthName(start).toLowerCase()} de ${start.getUTCFullYear()} – ${end.getUTCDate()} de ${monthName(end).toLowerCase()} de ${end.getUTCFullYear()}`
})

const isCurrentPeriod = computed(() => {
  const { from, to } = periodRange.value
  return todayIso.value >= from && todayIso.value <= to
})

const monthKeys = (from, to) => [...new Set([from.slice(0, 7), to.slice(0, 7)])]

async function loadPeriod(force = false) {
  const { from, to } = periodRange.value
  const missing = monthKeys(from, to).filter((k) => force || !months.value.has(k))
  if (!missing.length) { pending.value = false; return }
  pending.value = true
  loadError.value = ''
  try {
    const loaded = await Promise.all(missing.map((k) => $fetch(`/api/calendar/${k}`)))
    const next = new Map(months.value)
    missing.forEach((k, i) => next.set(k, loaded[i]))
    months.value = next
  } catch {
    loadError.value = 'No se ha podido cargar este período.'
  } finally {
    pending.value = false
  }
}

const periodEvents = computed(() => {
  const { from, to } = periodRange.value
  const out = []
  for (const key of monthKeys(from, to)) {
    const payload = months.value.get(key)
    if (!payload) continue
    for (const e of payload.events || []) {
      if (e.d < from || e.d > to) continue
      const meta = payload.titles?.[e.i] || {}
      out.push({
        id: e.i,
        media: e.i.startsWith('t') ? 'tv' : 'movie',
        tmdbId: e.i.slice(1),
        date: e.d,
        type: e.k,
        lens: LENS_BY_TYPE[e.k] || 'other',
        country: e.c || '',
        season: e.s,
        episode: e.e,
        note: e.n || '',
        precision: e.q || 'day',
        confidence: e.f || 'confirmed',
        rerelease: Boolean(e.r),
        title: meta.t || 'Untitled',
        year: meta.y || null,
        poster: meta.p || null,
        short: Boolean(meta.h),
      })
    }
  }
  return out
})

const periodEntries = computed(() => {
  const groups = new Map()
  for (const e of periodEvents.value) {
    const key = `${e.id}|${e.date}|${e.type}|${e.season ?? ''}|${e.episode ?? ''}`
    if (!groups.has(key)) groups.set(key, { ...e, uid: key, countries: [], notes: new Set() })
    const g = groups.get(key)
    if (e.country) g.countries.push(e.country)
    if (e.note) g.notes.add(e.note)
  }
  return [...groups.values()].map((g) => {
    const codes = [...new Set(g.countries)].sort()
    return { ...g, countries: codes, countryNames: codes.map(countryName), note: [...g.notes][0] || '' }
  }).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))
})

const lensCounts = computed(() => {
  const counts = {}
  for (const e of periodEntries.value) counts[e.lens] = (counts[e.lens] || 0) + 1
  return counts
})

const territories = computed(() => {
  const counts = new Map()
  for (const e of periodEntries.value) for (const c of e.countries) counts.set(c, (counts.get(c) || 0) + 1)
  return [...counts.entries()]
    .map(([code, count]) => ({ code, count, name: countryName(code) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const territoryLabel = computed(() => {
  if (!territory.value) return 'Todo el mundo'
  return territories.value.find((c) => c.code === territory.value)?.name || territory.value
})

function pickTerritory(code) {
  territory.value = code
  territoryOpen.value = false
}

function onDocumentClick(event) {
  if (!territoryOpen.value) return
  if (territoryBox.value && !territoryBox.value.contains(event.target)) territoryOpen.value = false
}

const hasActiveFilters = computed(() =>
  activeLens.value !== 'all' || Boolean(territory.value) || Boolean(mediaKind.value) || Boolean(query.value.trim()))

const visibleEntries = computed(() => {
  const lens = LENSES.find((l) => l.id === activeLens.value)
  const needle = query.value.trim().toLowerCase()
  return periodEntries.value.filter((e) => {
    if (lens?.types && !lens.types.includes(e.type)) return false
    if (mediaKind.value && e.media !== mediaKind.value) return false
    if (territory.value && e.type !== 7 && !e.countries.includes(territory.value)) return false
    if (needle && !e.title.toLowerCase().includes(needle) && !e.note.toLowerCase().includes(needle)) return false
    return true
  })
})

const byDay = computed(() => {
  const map = new Map()
  for (const e of visibleEntries.value) {
    if (!map.has(e.date)) map.set(e.date, [])
    map.get(e.date).push(e)
  }
  return map
})

function describeDay(date) {
  const d = parse(date)
  return {
    date,
    dayNumber: d.getUTCDate(),
    weekday: capitalize(d.toLocaleDateString('es-ES', { weekday: 'short', timeZone: 'UTC' })).replace('.', ''),
    weekdayLong: capitalize(d.toLocaleDateString('es-ES', { weekday: 'long', timeZone: 'UTC' })),
    monthLabel: `${monthName(d)} de ${d.getUTCFullYear()}`,
    entries: byDay.value.get(date) || [],
  }
}

const weekDays = computed(() => {
  const start = parse(periodRange.value.from)
  return Array.from({ length: 7 }, (_, i) => describeDay(iso(new Date(start.getTime() + i * DAY_MS))))
})

const monthCells = computed(() => {
  const first = parse(periodRange.value.from)
  const gridStart = parse(mondayOf(periodRange.value.from))
  const month = first.getUTCMonth()
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart.getTime() + i * DAY_MS)
    const date = iso(d)
    const entries = byDay.value.get(date) || []
    return {
      key: date,
      date,
      dayNumber: d.getUTCDate(),
      outside: d.getUTCMonth() !== month,
      entries,
      lenses: [...new Set(entries.map((e) => e.lens))].slice(0, 4),
    }
  })
})

const effectiveDay = computed(() => {
  if (selectedDay.value) return selectedDay.value
  if (view.value !== 'month') return null
  const days = [...byDay.value.keys()].sort()
  if (!days.length) return null
  return days.includes(todayIso.value) ? todayIso.value : days[0]
})

const shownGroups = computed(() => {
  if (effectiveDay.value) {
    const entries = byDay.value.get(effectiveDay.value) || []
    return entries.length ? [describeDay(effectiveDay.value)] : []
  }
  return [...byDay.value.keys()].sort().map(describeDay)
})

function setView(next) {
  view.value = next
  selectedDay.value = null
  syncUrl()
}

function step(direction) {
  const d = parse(anchor.value)
  anchor.value = view.value === 'week'
    ? iso(new Date(d.getTime() + direction * 7 * DAY_MS))
    : iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + direction, 1)))
  selectedDay.value = null
  syncUrl()
}

function goToday() {
  anchor.value = todayIso.value
  selectedDay.value = null
  syncUrl()
}

function resetFilters() {
  activeLens.value = 'all'
  territory.value = ''
  mediaKind.value = ''
  query.value = ''
}

function syncUrl() {
  if (!process.client) return
  window.history.replaceState({}, '', `${window.location.pathname}?view=${view.value}&on=${anchor.value}`)
}

watch(periodRange, () => loadPeriod(), { deep: true })
watch(territory, (value) => {
  if (!process.client) return
  if (value) localStorage.setItem('calendar-territory', value)
  else localStorage.removeItem('calendar-territory')
})

onMounted(() => {
  const local = localToday()
  if (local !== todayIso.value) {
    const anchoredToToday = anchor.value === todayIso.value
    todayIso.value = local
    if (anchoredToToday) anchor.value = local
  }
  const params = new URLSearchParams(window.location.search)
  const onParam = params.get('on')
  const viewParam = params.get('view')
  if (viewParam === 'month' || viewParam === 'week') view.value = viewParam
  if (onParam && /^\d{4}-\d{2}-\d{2}$/.test(onParam)) anchor.value = onParam
  const saved = localStorage.getItem('calendar-territory')
  if (saved) territory.value = saved
  document.addEventListener('click', onDocumentClick)
  loadPeriod()
})

onBeforeUnmount(() => {
  if (process.client) document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped lang="scss">
$cyan: #8BE9FD;
$teal: #1F5467;
$ink: #092C3D;
$subtle: #ACAFB5;
$grey: #80868b;

svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.calendar-page { position: relative; min-height: 100vh; }

.cal-ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 12% 18%, rgba(31, 84, 103, 0.22), transparent 34%),
    radial-gradient(circle at 88% 12%, rgba(139, 233, 253, 0.1), transparent 32%),
    radial-gradient(circle at 50% 95%, rgba(31, 84, 103, 0.14), transparent 42%);
}

.cal-main {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 9rem;
}

.cal-header { padding-left: 0; padding-right: 0; }

.cal-scope-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  margin: -0.6rem auto 2.4rem;
  padding: 0.8rem 1.8rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.22);
  background: rgba(31, 84, 103, 0.3);
  color: $cyan;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  svg { width: 1.7rem; height: 1.7rem; flex: 0 0 auto; }
}

.cal-panel {
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(3, 4, 6, 0.6);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);

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

.cal-nav-panel { margin-bottom: 1.4rem; position: relative; z-index: 10; }

.cal-nav {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.6rem 1.8rem;
  flex-wrap: wrap;
}

.cal-step {
  width: 4rem;
  height: 4rem;
  flex: 0 0 auto;
  padding: 1.1rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.2);
  background: rgba(31, 84, 103, 0.3);
  color: $cyan;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.cal-period { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }

.cal-period-main {
  font-family: var(--font-display);
  color: #fff;
  font-size: 2.2rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.cal-period-sub { color: $grey; font-size: 1.2rem; margin-top: 0.2rem; }

.cal-modes {
  display: inline-flex;
  padding: 0.4rem;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(139, 233, 253, 0.16);
  background: rgba(31, 84, 103, 0.3);
  flex: 0 0 auto;
}

.cal-mode {
  font-family: var(--font-display);
  border: 0;
  background: transparent;
  color: $subtle;
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &.active {
    background: linear-gradient(90deg, $teal, rgba(139, 233, 253, 0.35));
    color: #fff;
  }
}

.cal-today {
  flex: 0 0 auto;
  border: 1px solid rgba(139, 233, 253, 0.3);
  background: transparent;
  color: $cyan;
  border-radius: 999px;
  padding: 0.9rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
}

.cal-strip {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0.8rem;
  padding: 0 1.8rem 1.8rem;
}

.cal-strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.1rem 0.4rem;
  border-radius: 14px;
  border: 1px solid rgba(139, 233, 253, 0.1);
  background: rgba(139, 233, 253, 0.03);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;

  &.today { border-color: rgba(139, 233, 253, 0.34); }
  &.empty { opacity: 0.4; }

  &.active {
    border-color: rgba(139, 233, 253, 0.55);
    background: linear-gradient(180deg, rgba(31, 84, 103, 0.55), rgba(139, 233, 253, 0.1));
    box-shadow: 0 0 20px rgba(139, 233, 253, 0.15);
  }
}

.cal-strip-name {
  color: $grey;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cal-strip-num {
  font-family: var(--font-display);
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1;
}

.cal-strip-count {
  color: $cyan;
  font-size: 1.1rem;
  font-weight: 700;
  min-height: 1.6rem;
}

.cal-strip-item.empty .cal-strip-count { color: $grey; }

.cal-grid-wrap { padding: 0 1.8rem 1.8rem; }

.cal-grid-head {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 0.8rem;

  span { color: $grey; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; text-align: center; }
}

.cal-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.6rem; }

.cal-cell {
  position: relative;
  min-height: 6.4rem;
  padding: 0.8rem 0.6rem 1.4rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.08);
  background: rgba(139, 233, 253, 0.02);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:disabled { cursor: default; opacity: 0.35; }
  &.outside { opacity: 0.22; }
  &.today { border-color: rgba(139, 233, 253, 0.36); }
  &.has { background: rgba(31, 84, 103, 0.24); }

  &.active {
    border-color: rgba(139, 233, 253, 0.55);
    background: linear-gradient(180deg, rgba(31, 84, 103, 0.6), rgba(139, 233, 253, 0.1));
    box-shadow: 0 0 20px rgba(139, 233, 253, 0.15);
  }
}

.cal-cell-num { font-family: var(--font-display); color: #fff; font-size: 1.6rem; font-weight: 600; line-height: 1; }
.cal-cell-count { color: $cyan; font-size: 1.1rem; font-weight: 700; }

.cal-cell-bar {
  position: absolute;
  left: 0.8rem;
  right: 0.8rem;
  bottom: 0.7rem;
  display: flex;
  gap: 0.2rem;
  height: 0.3rem;

  i {
    flex: 1;
    border-radius: 999px;
    background: $cyan;

    &[data-lens='streaming'] { background: #A78BFA; }
    &[data-lens='festival'] { background: #FBBF77; }
    &[data-lens='tv'] { background: #7DD3A0; }
    &[data-lens='physical'] { background: $grey; }
  }
}

.cal-filters { padding: 1.6rem 1.8rem; margin-bottom: 2.4rem; position: relative; z-index: 30; }

.cal-lenses { display: flex; gap: 0.8rem; flex-wrap: wrap; }

.cal-lens {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(139, 233, 253, 0.03);
  color: $subtle;
  border-radius: 999px;
  padding: 0.8rem 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  &.active {
    border-color: rgba(139, 233, 253, 0.45);
    background: linear-gradient(90deg, rgba(31, 84, 103, 0.6), rgba(139, 233, 253, 0.12));
    color: #fff;
  }

  &:disabled { opacity: 0.3; cursor: default; }
}

.cal-lens-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: $cyan;

  &[data-lens='all'] { background: $subtle; }
  &[data-lens='streaming'] { background: #A78BFA; }
  &[data-lens='festival'] { background: #FBBF77; }
  &[data-lens='tv'] { background: #7DD3A0; }
}

.cal-lens-count { color: $grey; font-size: 1.1rem; font-weight: 700; }

.cal-controls { display: flex; gap: 1rem; margin-top: 1.4rem; flex-wrap: wrap; }

.cal-search {
  flex: 1 1 24rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0 1.4rem;
  height: 4.4rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: rgba(0, 0, 0, 0.35);

  svg { width: 1.7rem; height: 1.7rem; flex: 0 0 auto; color: $grey; }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: #fff;
    font-family: inherit;
    font-size: 1.4rem;
    outline: none;

    &::placeholder { color: $grey; }
    &::-webkit-search-cancel-button { display: none; }
  }
}

.cal-clear {
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: $grey;
  cursor: pointer;
  flex: 0 0 auto;
}

.control-group { display: flex; align-items: center; gap: 0.8rem; position: relative; }

.control-label {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.seg {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 999px;
  padding: 4px;
  gap: 2px;
}

.seg__btn {
  border: 0;
  background: transparent;
  color: #cfd6dc;
  border-radius: 999px;
  padding: 0.6rem 1.4rem;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &--on { background: linear-gradient(90deg, $teal, rgba(139, 233, 253, 0.35)); color: #fff; }
}

.control-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #cfd6dc;
  border-radius: 10px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &--on { border-color: rgba(139, 233, 253, 0.5); color: #fff; }
  &:disabled { opacity: 0.4; cursor: default; }
  svg { width: 14px; height: 14px; flex: 0 0 auto; }
}

.cal-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 40;
  min-width: 230px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
  background: rgba(6, 9, 12, 0.96);
  border: 1px solid rgba(139, 233, 253, 0.24);
  border-radius: 12px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.cal-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: transparent;
  border: none;
  color: #cfd6dc;
  font-family: inherit;
  font-size: 1.3rem;
  text-align: left;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;

  &--on { color: #fff; }
  em { margin-left: auto; font-style: normal; color: $grey; font-size: 1.1rem; font-weight: 700; }
}

.cal-radio {
  position: relative;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(139, 233, 253, 0.4);
  transition: border-color 0.18s ease;
}

.cal-option--on .cal-radio {
  border-color: #8BE9FD;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: #8BE9FD;
    box-shadow: 0 0 8px rgba(139, 233, 253, 0.6);
  }
}

.cal-reset {
  flex: 0 0 auto;
  height: 4.4rem;
  padding: 0 1.8rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: $subtle;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
}

.cal-group { margin-bottom: 3.2rem; }

.cal-group-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.4rem 2rem;
  margin-bottom: 1.6rem;
  border-radius: 16px;
  border: 1px solid rgba(139, 233, 253, 0.14);
  background: linear-gradient(90deg, rgba(31, 84, 103, 0.4), rgba(3, 4, 6, 0.5) 60%);
  backdrop-filter: blur(12px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, $cyan, transparent);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    opacity: 0.5;
    pointer-events: none;
  }
}

.cal-group-num {
  font-family: var(--font-display);
  color: $cyan;
  font-size: 3.2rem;
  font-weight: 600;
  line-height: 1;
  text-shadow: 0 0 24px rgba(139, 233, 253, 0.18);
}

.cal-group-name {
  font-family: var(--font-display);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;

  em { color: $subtle; font-size: 1.25rem; font-style: normal; font-weight: 500; letter-spacing: 0.02em; }
}

.cal-group-today {
  color: #fff;
  background: linear-gradient(90deg, $teal, rgba(139, 233, 253, 0.4));
  border-radius: 999px;
  padding: 0.3rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cal-group-count {
  margin-left: auto;
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  font-family: var(--font-display);
  color: #fff;
  font-size: 2.4rem;
  font-weight: 600;
  line-height: 1;

  &::after {
    content: 'estrenos';
    color: $grey;
    font-family: inherit;
    font-size: 1.15rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}

.cal-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  gap: 1.2rem;
}

.cal-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  padding: 8rem 2rem;
  color: $grey;

  p { margin: 0; font-size: 1.4rem; }
  &.error p { color: #ff5f5f; }
}

.cal-spinner {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  border: 2px solid rgba(139, 233, 253, 0.18);
  border-top-color: $cyan;
  animation: cal-spin 0.85s linear infinite;
  box-shadow: 0 0 15px rgba(139, 233, 253, 0.2);
}

@keyframes cal-spin { to { transform: rotate(360deg); } }

.cal-retry {
  border: 1px solid rgba(139, 233, 253, 0.32);
  background: transparent;
  color: $cyan;
  border-radius: 999px;
  padding: 0.9rem 2.2rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
}

.cal-empty { text-align: center; color: $grey; padding: 6rem 2rem; margin: 0; font-size: 1.4rem; }

@media (hover: hover) and (pointer: fine) {
  .cal-step:hover, .cal-today:hover, .cal-retry:hover { background: rgba(139, 233, 253, 0.14); border-color: rgba(139, 233, 253, 0.4); }
  .cal-mode:hover:not(.active) { color: #fff; }
  .cal-scope-btn:hover { background: rgba(139, 233, 253, 0.16); border-color: rgba(139, 233, 253, 0.45); }
  .cal-lens:hover:not(:disabled):not(.active) { border-color: rgba(139, 233, 253, 0.32); }
  .cal-strip-item:hover:not(.active) { border-color: rgba(139, 233, 253, 0.3); transform: translateY(-2px); }
  .cal-cell:not(:disabled):hover:not(.active) { border-color: rgba(139, 233, 253, 0.3); }
  .cal-reset:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }
  .control-trigger:hover:not(:disabled) { background: rgba(139, 233, 253, 0.1); border-color: rgba(139, 233, 253, 0.4); }
  .cal-option:hover { background: rgba(139, 233, 253, 0.1); color: #fff; }
  .seg__btn:hover:not(.seg__btn--on) { color: #fff; }
}

@media (max-width: 1024px) {
  .cal-strip { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .cal-main { padding: 0 1.6rem 8rem; }
  .cal-nav { padding: 1.4rem; gap: 1rem; }
  .cal-strip, .cal-grid-wrap { padding: 0 1.4rem 1.4rem; }
  .cal-filters { padding: 1.4rem; }
  .cal-period { order: -1; flex: 1 1 100%; }
  .cal-modes { flex: 1 1 auto; }
  .cal-mode { flex: 1; text-align: center; }
  .cal-cards { grid-template-columns: 1fr; }
  .cal-group-num { font-size: 2.8rem; }
}

@media (max-width: 640px) {
  .cal-main { padding: 0 1.2rem 7rem; }
  .cal-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cal-strip-item.empty { display: none; }
  .cal-grid, .cal-grid-head { gap: 0.4rem; }
  .cal-cell { min-height: 5.4rem; padding: 0.6rem 0.3rem 1.2rem; }
  .cal-cell-num { font-size: 1.4rem; }
  .cal-controls { gap: 0.8rem; }
  .control-group { flex: 1 1 100%; justify-content: space-between; }
  .cal-menu { left: auto; right: 0; }
  .cal-period-main { font-size: 1.9rem; }
}
</style>
