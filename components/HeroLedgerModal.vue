<template>
  <Teleport to="body">
    <div class="ledger-overlay" @click.self="$emit('close')">
      <div ref="card" class="ledger-card" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ledger-title">
        <div class="ledger-glow-line"></div>
        <button class="ledger-close" type="button" aria-label="Cerrar" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <header class="ledger-header">
          <h2 id="ledger-title" class="ledger-title">Ledger</h2>
          <p class="ledger-subtitle">
            Todo lo que pasó por la marquesina<template v-if="rows.length"> · {{ rows.length }} títulos desde {{ since }}</template>
            <button type="button" class="ledger-help" :aria-expanded="showAbout" aria-label="¿Qué es el Ledger?" title="¿Qué es el Ledger?" @click="showAbout = !showAbout">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </button>
          </p>
          <div v-if="showAbout" class="ledger-about">
            <p>"Ledger" en español significa "libro de registro". El Ledger es el registro de la marquesina de la portada de la página principal: cada título que pasó por ahí, fechado el día que llegó.</p>
            <p>No es <nuxt-link to="/noir" no-prefetch class="ledger-link" @click="$emit('close')">N.O.I.R.</nuxt-link> Todo título que llega a la marquesina queda archivado en <nuxt-link to="/noir" no-prefetch class="ledger-link" @click="$emit('close')">N.O.I.R.</nuxt-link>, pero <nuxt-link to="/noir" no-prefetch class="ledger-link" @click="$emit('close')">N.O.I.R.</nuxt-link> guarda más de lo que la marquesina llega a mostrar.</p>
          </div>
        </header>

        <p v-if="failed" class="ledger-empty">No se pudo cargar el Ledger.</p>
        <div v-else-if="!rows.length" class="ledger-empty"><Loader :size="40" /></div>

        <section v-for="group in groups" :key="group.month" class="ledger-month">
          <h3 class="ledger-month-label">{{ group.month }}</h3>
          <div class="ledger-grid">
            <div v-for="row in group.rows" :key="`${row.media_type}-${row.tmdb_id}`" class="ledger-row">
              <span class="ledger-day">{{ Number(row.entered.slice(8)) }}</span>
              <img v-if="row.thumb" :src="row.thumb" alt="" loading="lazy" decoding="async" class="ledger-thumb" @error="row.thumb = row.thumb === row.fallback ? null : row.fallback" />
              <span v-else class="ledger-thumb"></span>
              <span class="ledger-text">
                <nuxt-link :to="`/${row.media_type}/${row.tmdb_id}`" no-prefetch class="ledger-name" @click="$emit('close')">{{ row.title_es || row.title }}</nuxt-link>
                <span class="ledger-meta"><template v-if="row.year">{{ row.year }}</template><template v-if="row.year && row.directors.length"> · </template><template v-for="(person, i) in row.directors" :key="person.id"><template v-if="i">, </template><nuxt-link :to="`/person/${person.id}`" no-prefetch class="ledger-person" @click="$emit('close')">{{ person.name }}</nuxt-link></template></span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Loader from '~/components/Loader.vue';

let ledgerPromise;
const thumb = (path) => {
  if (!path) return null;
  if (path.startsWith('/')) return `https://image.tmdb.org/t/p/w300${path}`;
  return path.includes('res.cloudinary.com/') ? path.replace('/image/upload/', '/image/upload/c_fill,w_192,h_108,q_auto,f_auto/') : path;
};
const monthLabel = (ymd) => new Date(`${ymd.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export default {
  name: 'HeroLedgerModal',
  components: { Loader },
  emits: ['close'],
  data() {
    return { rows: [], failed: false, showAbout: false };
  },
  computed: {
    groups() {
      const groups = [];
      for (const row of this.rows) {
        const month = monthLabel(row.entered);
        if (groups.at(-1)?.month !== month) groups.push({ month, rows: [] });
        groups.at(-1).rows.push(row);
      }
      return groups;
    },
    since() {
      return this.rows.length ? monthLabel(this.rows.at(-1).entered) : '';
    },
  },
  async mounted() {
    this.prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.onKeydown);
    // Keyboard users land inside the dialog instead of on the page behind it.
    this.$refs.card?.focus({ preventScroll: true });
    try {
      ledgerPromise ||= fetch('/data/hero-history.json').then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });
      const data = await ledgerPromise;
      // The file is newest-first and keeps every stay; a title shows once, at its latest arrival.
      const seen = new Set();
      this.rows = data.filter((r) => r.title && !seen.has(`${r.media_type}:${r.tmdb_id}`) && seen.add(`${r.media_type}:${r.tmdb_id}`)).map((r) => {
        const fallback = thumb(r.tmdb_backdrop);
        return { ...r, directors: r.directors || [], thumb: thumb(r.backdrop_path) || fallback, fallback };
      });
    } catch {
      ledgerPromise = null;
      this.failed = true;
    }
  },
  beforeUnmount() {
    document.body.style.overflow = this.prevOverflow;
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape') this.$emit('close');
    },
  },
};
</script>

<style scoped>
.ledger-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  animation: ledgerFadeIn 0.3s ease;
}

.ledger-card {
  position: relative;
  background: rgba(3, 4, 6, 0.6);
  border-radius: 20px;
  padding: 32px 22px 22px;
  width: 90%;
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(31, 84, 103, 0.5),
              inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(20px);
  animation: ledgerFloatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.ledger-card:focus {
  outline: none;
}

.ledger-card::-webkit-scrollbar {
  width: 4px;
}

.ledger-card::-webkit-scrollbar-track {
  background: transparent;
}

.ledger-card::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.2);
  border-radius: 4px;
}

.ledger-glow-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-radius: 20px 20px 0 0;
}

.ledger-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 6px;
  display: flex;
  transition: color 0.3s ease;
}

.ledger-close:hover {
  color: #8BE9FD;
}

.ledger-header {
  text-align: center;
  margin-bottom: 8px;
}

.ledger-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #fff;
}

.ledger-subtitle {
  margin: 6px 0 0;
  text-wrap: balance;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.ledger-help {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  margin-left: 2px;
  display: inline-flex;
  vertical-align: middle;
  transition: opacity 0.3s ease;
}

.ledger-help:hover {
  opacity: 0.7;
}

.ledger-help:focus:not(:focus-visible) {
  outline: none;
}

.ledger-help:focus-visible {
  border-radius: 50%;
}

.ledger-about {
  max-width: 560px;
  margin: 14px auto 4px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(31, 84, 103, 0.5);
  background: rgba(139, 233, 253, 0.04);
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
  text-align: left;
  text-wrap: pretty;
  animation: ledgerFadeIn 0.3s ease;
}

.ledger-about p {
  margin: 0;
}

.ledger-about p + p {
  margin-top: 8px;
}

.ledger-link {
  color: #8BE9FD;
  text-decoration: none;
}

.ledger-link:hover {
  text-decoration: underline;
}

.ledger-empty {
  display: flex;
  justify-content: center;
  margin: 28px 0 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.ledger-month-label {
  margin: 20px 8px 6px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(139, 233, 253, 0.7);
}

.ledger-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: 12px;
}

.ledger-row {
  position: relative;
  display: grid;
  grid-template-columns: 22px 96px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 6px 8px;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.ledger-row:hover,
.ledger-row:has(.ledger-name:focus-visible) {
  background: rgba(139, 233, 253, 0.06);
}

.ledger-day {
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: rgba(255, 255, 255, 0.45);
}

.ledger-thumb {
  display: block;
  width: 96px;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.04);
}

.ledger-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ledger-name,
.ledger-meta {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ledger-name {
  font-size: 15px;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* The title link covers the whole row; the director links sit above it. */
.ledger-name::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
}

.ledger-row:hover .ledger-name {
  color: #8BE9FD;
}

.ledger-row:has(.ledger-person:hover) .ledger-name {
  color: #fff;
}

.ledger-person {
  position: relative;
  z-index: 1;
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.ledger-person:hover,
.ledger-person:focus-visible {
  color: #8BE9FD;
}

.ledger-meta {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.5);
}

@media (min-width: 960px) {
  .ledger-card {
    max-width: 980px;
  }

  .ledger-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .ledger-card {
    width: 100%;
    padding: 30px 12px 14px;
  }

  .ledger-row {
    grid-template-columns: 18px 72px minmax(0, 1fr);
    gap: 10px;
  }

  .ledger-thumb {
    width: 72px;
  }
}

@keyframes ledgerFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ledgerFloatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
