<script setup>
useHead({
  title: 'Cinemagoria — Festivales de Cine: Selecciones Curadas de Festivales del Mundo',
  meta: [
    { name: 'description', content: 'Explora selecciones curadas de los festivales de cine más importantes del mundo en Cinemagoria — BAFICI, BIFFF, Cannes, Venecia, Berlín y más.' },
    { property: 'og:title', content: 'Cinemagoria — Festivales de Cine' },
    { property: 'og:description', content: 'Selecciones curadas de los festivales de cine más importantes del mundo.' },
  ],
})

const showContent = ref(false)

onMounted(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
        showContent.value = true
    }
})

const festivals = [
  { slug: 'bfi-2026',       name: 'BFI London',     year: 2026, city: 'Londres',    country: 'Reino Unido',
    startDate: '2026-10-07', endDate: '2026-10-18', dateLabel: '7 – 18 oct 2026',
    image: '/festivals/bfi/bfi_backdrop_2026_es.webp' },
  { slug: 'biff-2026',      name: 'BIFF',           year: 2026, city: 'Busan',      country: 'Corea del Sur',
    startDate: '2026-10-06', endDate: '2026-10-15', dateLabel: '6 – 15 oct 2026',
    image: '/festivals/biff/biff_backdrop_2026_es.webp' },
  { slug: 'venice-2026',    name: 'Venice',         year: 2026, city: 'Venecia',    country: 'Italia',
    startDate: '2026-09-02', endDate: '2026-09-12', dateLabel: '2 – 12 sep 2026',
    image: '/festivals/venice/venice_backdrop_2026_es.webp' },
  { slug: 'tiff-2026',      name: 'TIFF',           year: 2026, city: 'Toronto',    country: 'Canadá',
    startDate: '2026-09-10', endDate: '2026-09-20', dateLabel: '10 – 20 sep 2026',
    image: '/festivals/tiff/tiff_backdrop_2026_es.webp' },
  { slug: 'locarno-2026',   name: 'Locarno',        year: 2026, city: 'Locarno',    country: 'Suiza',
    startDate: '2026-08-05', endDate: '2026-08-15', dateLabel: '5 – 15 ago 2026',
    image: '/festivals/locarno/locarno_backdrop_2026_es.webp' },
  { slug: 'bifan-2026',     name: 'BIFAN',          year: 2026, city: 'Bucheon',    country: 'Corea del Sur',
    startDate: '2026-07-02', endDate: '2026-07-12', dateLabel: '2 – 12 jul 2026',
    image: '/festivals/bifan/bifan_backdrop_2026_es.webp' },
  { slug: 'kviff-2026',     name: 'KVIFF',          year: 2026, city: 'Karlovy Vary', country: 'Chequia',
    startDate: '2026-07-03', endDate: '2026-07-11', dateLabel: '3 – 11 jul 2026',
    image: '/festivals/kviff/kviff_backdrop_2026_es.webp' },
  { slug: 'fantasia-2026',  name: 'Fantasia',       year: 2026, city: 'Montreal',    country: 'Canadá',
    startDate: '2026-07-16', endDate: '2026-08-02', dateLabel: '16 jul – 2 ago 2026',
    image: '/festivals/fantasia/fantasia_backdrop_2026_es.webp' },
  { slug: 'frightfest-2026', name: 'FrightFest',    year: 2026, city: 'Londres',     country: 'Reino Unido',
    startDate: '2026-08-27', endDate: '2026-08-31', dateLabel: '27 – 31 ago 2026',
    image: '/festivals/frightfest/frightfest_backdrop_2026_es.webp' },
  { slug: 'tribeca-2026',   name: 'Tribeca',        year: 2026, city: 'Nueva York',    country: 'EE. UU.',
    startDate: '2026-06-03', endDate: '2026-06-14', dateLabel: '3 – 14 jun 2026',
    image: '/festivals/tribeca/tribeca_backdrop_2026_es.webp' },
  { slug: 'cuff-2026',      name: 'CUFF',           year: 2026, city: 'Calgary',       country: 'Canadá',
    startDate: '2026-04-16', endDate: '2026-04-26', dateLabel: '16 – 26 abr 2026',
    image: '/festivals/cuff/cuff_backdrop_2026_es.webp' },
  { slug: 'cannes-2026',    name: 'Cannes',         year: 2026, city: 'Cannes',        country: 'Francia',
    startDate: '2026-05-12', endDate: '2026-05-23', dateLabel: '12 – 23 may 2026',
    image: '/festivals/cannes/cannes_backdrop_2026_es.webp' },
  { slug: 'bafici-2026',    name: 'BAFICI',         year: 2026, city: 'Buenos Aires',  country: 'Argentina',
    startDate: '2026-04-15', endDate: '2026-04-26', dateLabel: '15 – 26 abr 2026',
    image: '/festivals/bafici/bafici_backdrop_2026_es.webp' },
  { slug: 'bifff-2026',     name: 'BIFFF',          year: 2026, city: 'Bruselas',      country: 'Bélgica',
    startDate: '2026-04-03', endDate: '2026-04-18', dateLabel: '3 – 18 abr 2026',
    image: '/festivals/bifff/bifff_backdrop_2026_es.webp' },
  { slug: 'sxsw-2026',      name: 'SXSW',           year: 2026, city: 'Austin',        country: 'EE. UU.',
    startDate: '2026-03-12', endDate: '2026-03-18', dateLabel: '12 – 18 mar 2026',
    image: '/festivals/sxsw/sxsw_backdrop_2026_es.webp' },
  { slug: 'slamdance-2026', name: 'Slamdance',      year: 2026, city: 'Park City',     country: 'EE. UU.',
    startDate: '2026-02-19', endDate: '2026-02-25', dateLabel: '19 – 25 feb 2026',
    image: '/festivals/slamdance/slamdance_backdrop_2026_es.webp' },
  { slug: 'romford-2026',   name: 'Romford Horror', year: 2026, city: 'Romford',       country: 'Reino Unido',
    startDate: '2026-02-19', endDate: '2026-02-22', dateLabel: '19 – 22 feb 2026',
    image: '/festivals/romford/romford_backdrop_2026_es.webp' },
  { slug: 'berlinale-2026', name: 'Berlinale',      year: 2026, city: 'Berlín',        country: 'Alemania',
    startDate: '2026-02-12', endDate: '2026-02-22', dateLabel: '12 – 22 feb 2026',
    image: '/festivals/berlinale/berlinale_backdrop_2026_es.webp' },
  { slug: 'rotterdam-2026', name: 'Rotterdam',      year: 2026, city: 'Róterdam',      country: 'Países Bajos',
    startDate: '2026-01-29', endDate: '2026-02-08', dateLabel: '29 ene – 8 feb 2026',
    image: '/festivals/rotterdam/rotterdam_backdrop_2026_es.webp' },
  { slug: 'sundance-2026',  name: 'Sundance',       year: 2026, city: 'Park City',     country: 'EE. UU.',
    startDate: '2026-01-22', endDate: '2026-02-01', dateLabel: '22 ene – 1 feb 2026',
    image: '/festivals/sundance/sundance_backdrop_2026_es.webp' },
]

const MS_PER_DAY = 86400000

const today = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

const getStatus = (f) => {
  const start = new Date(f.startDate)
  const end   = new Date(f.endDate)
  if (today < start) return 'upcoming'
  if (today > end)   return 'ended'
  return 'live'
}

const getStatusMeta = (f) => {
  const start = new Date(f.startDate)
  const end   = new Date(f.endDate)
  const status = getStatus(f)

  if (status === 'upcoming') {
    const days = Math.ceil((start - today) / MS_PER_DAY)
    let detail
    if (days === 0) detail = 'Comienza hoy'
    else if (days === 1) detail = 'Comienza mañana'
    else if (days < 7) detail = `En ${days} días`
    else if (days < 30) {
      const w = Math.round(days / 7)
      detail = `En ${w} ${w === 1 ? 'semana' : 'semanas'}`
    }
    else {
      const m = Math.round(days / 30)
      detail = `En ${m} ${m === 1 ? 'mes' : 'meses'}`
    }
    return { status, chipLabel: 'Próximo', detail }
  }
  if (status === 'live') {
    const day   = Math.floor((today - start) / MS_PER_DAY) + 1
    const total = Math.round((end   - start) / MS_PER_DAY) + 1
    return { status, chipLabel: 'En vivo', detail: `Día ${day} de ${total}` }
  }
  const days = Math.floor((today - end) / MS_PER_DAY)
  let detail
  if (days <= 0) detail = 'Terminó hoy'
  else if (days === 1) detail = 'Terminó ayer'
  else if (days < 30) detail = `Hace ${days} días`
  else if (days < 365) {
    const m = Math.round(days / 30)
    detail = `Hace ${m} ${m === 1 ? 'mes' : 'meses'}`
  } else {
    const y = Math.floor(days / 365)
    detail = `Hace ${y} ${y === 1 ? 'año' : 'años'}`
  }
  return { status, chipLabel: 'Finalizado', detail }
}

const activeFilter = ref('all')

const filters = [
  { key: 'all',      label: 'Todos' },
  { key: 'live',     label: 'En vivo' },
  { key: 'upcoming', label: 'Próximos' },
  { key: 'ended',    label: 'Pasados' },
]

const sortedFestivals = computed(() => {
  const order = { live: 0, upcoming: 1, ended: 2 }
  return [...festivals].sort((a, b) => {
    const sa = getStatus(a), sb = getStatus(b)
    if (order[sa] !== order[sb]) return order[sa] - order[sb]
    if (sa === 'upcoming') return new Date(a.startDate) - new Date(b.startDate)
    return new Date(b.endDate) - new Date(a.endDate)
  })
})

const filtered = computed(() => {
  if (activeFilter.value === 'all') return sortedFestivals.value
  return sortedFestivals.value.filter(f => getStatus(f) === activeFilter.value)
})

const FestivalCardLink = resolveComponent('NuxtLink')

const counts = computed(() => ({
  live:     festivals.filter(f => getStatus(f) === 'live').length,
  upcoming: festivals.filter(f => getStatus(f) === 'upcoming').length,
  ended:    festivals.filter(f => getStatus(f) === 'ended').length,
}))
</script>

<template>
  <main v-if="showContent" class="main">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Festivales de Cine</h1>
        <p class="page-subtitle">Explora nuestras selecciones curadas de los festivales más importantes del mundo.</p>
      </div>

      <div class="toolbar">
        <div class="stats-strip">
          <div class="stat">
            <span class="stat__num">{{ festivals.length }}</span>
            <span class="stat__label">Festivales</span>
          </div>
          <div class="stat__divider"></div>
          <div class="stat">
            <span class="stat__num">{{ counts.live }}</span>
            <span class="stat__label stat__label--live"><span class="pulse-dot"></span>En vivo</span>
          </div>
          <div class="stat__divider"></div>
          <div class="stat">
            <span class="stat__num">{{ counts.upcoming }}</span>
            <span class="stat__label">Próximos</span>
          </div>
          <div class="stat__divider"></div>
          <div class="stat">
            <span class="stat__num stat__num--muted">{{ counts.ended }}</span>
            <span class="stat__label">Pasados</span>
          </div>
        </div>

        <div class="filters" role="tablist">
          <button
            v-for="f in filters"
            :key="f.key"
            :class="['filter', activeFilter === f.key && 'filter--active']"
            :aria-pressed="activeFilter === f.key"
            type="button"
            @click="activeFilter = f.key"
          >
            <span v-if="f.key === 'live'" class="pulse-dot pulse-dot--inline"></span>
            {{ f.label }}
            <span v-if="f.key !== 'all'" class="filter__count">{{ counts[f.key] }}</span>
          </button>
        </div>
      </div>

      <div v-if="filtered.length" class="festivals-grid">
        <component
          :is="f.comingSoon ? 'div' : FestivalCardLink"
          v-for="f in filtered"
          :key="f.slug"
          :to="f.comingSoon ? undefined : `/festival/${f.slug}`"
          :class="['festival-card', `festival-card--${getStatus(f)}`, f.comingSoon && 'festival-card--disabled']"
        >
          <div class="card-image-wrapper">
            <img :src="f.image" :alt="`${f.name} ${f.year}`" loading="lazy" />
            <div class="overlay"></div>

            <div class="card-top">
              <span class="location">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                {{ f.city }}, {{ f.country }}
              </span>
              <span :class="['status-chip', `status-chip--${getStatusMeta(f).status}`]">
                <span v-if="getStatusMeta(f).status === 'live'" class="pulse-dot pulse-dot--inline"></span>
                {{ getStatusMeta(f).chipLabel }}
              </span>
            </div>

            <div class="card-content">
              <div class="card-content__text">
                <h2>{{ f.name }} {{ f.year }}</h2>
                <div class="card-meta">
                  <span class="festival-dates">{{ f.dateLabel }}</span>
                  <span :class="['festival-detail', `festival-detail--${getStatusMeta(f).status}`]">{{ getStatusMeta(f).detail }}</span>
                </div>
              </div>
              <span :class="['explore-btn', f.comingSoon && 'explore-btn--disabled']">
                {{ f.comingSoon ? 'Próximamente' : 'Explorar' }}
              </span>
            </div>
          </div>
        </component>
      </div>

      <div v-else class="empty">
        <p>Ningún festival coincide con este filtro.</p>
        <button class="filter filter--active" type="button" @click="activeFilter = 'all'">Ver todos</button>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
    padding-top: 0;
    padding-bottom: 4rem;
    min-height: 80vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ── Toolbar: stats + filters ──────────────────────────────── */
.toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    margin-bottom: 2.5rem;
}

.stats-strip {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem 1.6rem;
    background: rgba(139, 233, 253, 0.04);
    border: 1px solid rgba(139, 233, 253, 0.15);
    border-radius: 14px;
    backdrop-filter: blur(8px);
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    min-width: 54px;
}

.stat__num {
    font-size: 1.75rem;
    font-weight: 800;
    color: #8BE9FD;
    line-height: 1;

    &--muted { color: rgba(255, 255, 255, 0.5); }
}

.stat__label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.75);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;

    &--live { color: #8BE9FD; }
}

.stat__divider {
    width: 1px;
    height: 32px;
    background: rgba(255, 255, 255, 0.12);
}

.filters {
    display: inline-flex;
    gap: 0.3rem;
    padding: 1.4rem 1.6rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    backdrop-filter: blur(8px);
}

.filter {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.3rem;
    border-radius: 999px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover { color: #8BE9FD; }

    &--active {
        background: rgba(139, 233, 253, 0.15);
        color: #8BE9FD;
        box-shadow: inset 0 0 0 1px rgba(139, 233, 253, 0.5);
    }
}

.filter__count {
    font-size: 0.78rem;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    color: inherit;
    font-weight: 700;
    min-width: 22px;
    text-align: center;
}

.filter--active .filter__count { background: rgba(139, 233, 253, 0.22); }

/* ── Pulse dot (cyan) ──────────────────────────────────────── */
.pulse-dot {
    display: inline-block;
    width: 6px;
    top: -0.40px;
    height: 6px;
    position: relative;
    border-radius: 50%;
    background: #8BE9FD;
    box-shadow: 0 0 0 0 rgba(139, 233, 253, 0.75);
    animation: pulse 1.8s ease-out infinite;
    flex-shrink: 0;

    &--inline { width: 7px; height: 7px; }
}

@keyframes pulse {
    0%   { box-shadow: 0 0 0 0    rgba(139, 233, 253, 0.75); }
    70%  { box-shadow: 0 0 0 10px rgba(139, 233, 253, 0);    }
    100% { box-shadow: 0 0 0 0    rgba(139, 233, 253, 0);    }
}

/* ── Grid ──────────────────────────────────────────────────── */
.festivals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 1.8rem;
    justify-content: center;
}

.festival-card {
    display: block;
    text-decoration: none;
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: #0b0b0f;
    position: relative;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(139, 233, 253, 0.25);
        border-color: rgba(139, 233, 253, 0.35);

        .explore-btn:not(.explore-btn--disabled) {
            background: #8BE9FD;
            color: #0a0a0f;
            border-color: #8BE9FD;
            box-shadow: 0 6px 22px rgba(139, 233, 253, 0.45);
        }

        img { transform: scale(1.04); opacity: 0.78; }
    }

    &--live {
        border-color: rgba(139, 233, 253, 0.35);
        box-shadow: 0 0 0 1px rgba(139, 233, 253, 0.15), 0 0 24px rgba(139, 233, 253, 0.08);
    }

    &--disabled {
        cursor: default;
        &:hover {
            transform: none;
            box-shadow: none;
            border-color: rgba(255, 255, 255, 0.08);
            img { transform: none; opacity: 0.82; }
        }
    }
}

.card-image-wrapper {
    position: relative;
    padding-top: 56.25%;
    background: #000;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.82;
        transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease;
    }
}

.overlay {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(to top,    rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 32%, rgba(0, 0, 0, 0.15) 65%, transparent 100%),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, transparent 35%);
    pointer-events: none;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 20%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.42) 55%, transparent 100%);
        pointer-events: none;
    }
}

/* ── Card top row: location + status ────────────────────── */
.card-top {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    z-index: 2;
}

.location {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.8rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.01em;

    svg { opacity: 0.85; flex-shrink: 0; }
}

.status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    backdrop-filter: blur(10px);

    &--live {
        background: rgba(139, 233, 253, 0.2);
        color: #CFF5FE;
        border: 1px solid rgba(139, 233, 253, 0.6);
        box-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
    }

    &--upcoming {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    &--ended {
        background: rgba(0, 0, 0, 0.55);
        color: rgba(255, 255, 255, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.14);
    }
}

/* ── Card content ──────────────────────────────────────────── */
.card-content {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    padding: 1.6rem 1.8rem 1.8rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    z-index: 2;

    h2 {
        font-size: 2.1rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 0.45rem;
        letter-spacing: 0.01em;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
        line-height: 1.1;
    }
}

.card-content__text { min-width: 0; }

.card-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem 0.9rem;
}

.festival-dates {
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #8BE9FD;
    text-transform: uppercase;
    text-shadow: 0 1px 4px rgba(139, 233, 253, 0.25);
}

.festival-detail {
    display: inline-flex;
    align-items: center;
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.02em;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        margin-right: 0.65rem;
        opacity: 0.6;
    }

    &--live     { color: #8BE9FD; }
    &--upcoming { color: rgba(255, 255, 255, 0.85); }
    &--ended    { color: rgba(255, 255, 255, 0.5); }
}

/* ── Explore CTA ─────────────────────────────────────────── */
.explore-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 1.8rem;
    border-radius: 999px;
    background: rgba(11, 11, 15, 0.55);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 233, 253, 0.55);
    color: #8BE9FD;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    flex-shrink: 0;
    line-height: 1;
    position: relative;
    left: 5px;
    bottom: 1.5px;

    &--disabled {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.3);
        cursor: default;
        pointer-events: none;
    }
}

/* ── Empty state ───────────────────────────────────────────── */
.empty {
    text-align: center;
    padding: 4rem 1rem;
    color: rgba(255, 255, 255, 0.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;

    p { margin: 0; font-size: 1.05rem; }
}

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 775px) {
    .toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 1.25rem;
    }

    .stats-strip {
        justify-content: center;
        gap: 0.75rem;
        padding: 0.85rem 1rem;
    }

    .stat { min-width: 0; }
    .stat__num { font-size: 1.5rem; }
    .stat__label { font-size: 0.74rem; }

    .filters { 
        justify-content: center; 
        flex-wrap: wrap; 
        padding: 1rem 1.6rem;
    }
}

@media (max-width: 600px) {
    .festivals-grid {
        grid-template-columns: 1fr;
        gap: 1.3rem;
    }

    .card-top { top: 0.75rem; left: 0.75rem; right: 0.75rem; }

    .card-content {
        padding: 1.2rem 1.3rem 1.3rem;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;

        h2 { font-size: 1.65rem; }
    }

    .explore-btn { align-self: flex-start; padding: 0.75rem 1.3rem; }
}
</style>
