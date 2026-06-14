<template>
  <section v-if="groups.length > 0" class="winners-carousel">
    <!-- Heading -->
    <div class="wc-header">
      <div class="wc-header-left">
        <div class="wc-eyebrow">
          <span class="wc-eyebrow-bar"></span>
          <span class="wc-eyebrow-text">Distinctions</span>
        </div>
        <h2 class="wc-title">
          Winners <span class="wc-title-year">{{ year }}</span>
        </h2>
      </div>
      <div v-if="stat" class="wc-stat">
        <div class="wc-stat-main">{{ stat.main }}</div>
        <div class="wc-stat-sub">{{ stat.sub }}</div>
      </div>
    </div>

    <!-- Track -->
    <div class="wc-track-wrapper">
      <button
        class="wc-nav wc-nav-prev"
        :class="{ 'wc-nav-disabled': !canScrollLeft }"
        @click="scrollByDir(-1)"
        aria-label="Scroll left"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div ref="trackEl" class="wc-track" @scroll="onScroll">
        <component
          :is="g.cinemagoria_url ? 'a' : 'div'"
          v-for="g in groups"
          :key="g.key"
          :href="g.cinemagoria_url || undefined"
          :target="g.cinemagoria_url ? '_blank' : undefined"
          :rel="g.cinemagoria_url ? 'noopener' : undefined"
          class="wc-card"
          :class="cardClassesForGroup(g)"
        >
          <!-- Poster (left) -->
          <div class="wc-card-poster">
            <img
              v-if="g.poster"
              :src="g.poster"
              :alt="g.title"
              class="wc-poster-img"
              loading="lazy"
              @error="onPosterError"
            />
            <div v-else class="wc-poster-fallback">
              <span>{{ g.title }}</span>
            </div>

            <!-- Top-left badge — driven by the highest-priority award -->
            <div v-if="g.primary.is_grand_prize" class="wc-badge wc-badge-gold">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 7.5h7.5l-6 4.5 2.5 7.5-6.5-4.8-6.5 4.8 2.5-7.5-6-4.5h7.5z"/></svg>
              Winner
            </div>
            <div v-else-if="g.primary.is_honorable_mention" class="wc-badge wc-badge-mention">
              ★ Mention
            </div>
            <div v-else-if="g.primary.award_type === 'audience'" class="wc-badge wc-badge-audience">
              ♥ Audience
            </div>
            <div v-else-if="g.primary.award_type === 'critics'" class="wc-badge wc-badge-critics">
              Critics
            </div>
            <div v-else-if="g.primary.award_type === 'directing' || g.primary.award_type === 'acting'" class="wc-badge wc-badge-craft">
              {{ g.primary.award_type === 'directing' ? 'Directing' : 'Acting' }}
            </div>

            <!-- Count chip (bottom-right) for multi-award films -->
            <div v-if="g.awards.length > 1" class="wc-badge wc-badge-count">×{{ g.awards.length }}</div>
            <div v-else-if="g.primary.is_tie" class="wc-badge wc-badge-tie">ex aequo</div>
          </div>

          <!-- Content (right) -->
          <div class="wc-card-body">
            <!-- SINGLE AWARD: original layout (chip → title → recipient/director → quote) -->
            <template v-if="g.awards.length === 1">
              <div class="wc-award-chip" :class="awardChipClass(g.primary)">
                {{ shortAwardLabel(g.primary) }}
              </div>

              <h3 class="wc-card-title">{{ g.title }}</h3>

              <div v-if="g.primary.recipient_name" class="wc-card-recipient">
                {{ g.primary.recipient_name }}<span v-if="g.primary.recipient_role" class="wc-card-recipient-role"> · {{ g.primary.recipient_role }}</span>
              </div>
              <div v-else-if="g.director" class="wc-card-director">dir. {{ g.director }}</div>

              <p v-if="g.primary.description" class="wc-card-quote">
                &ldquo;{{ g.primary.description }}&rdquo;
              </p>
            </template>

            <!-- MULTI-AWARD: stacked award list -->
            <template v-else>
              <h3 class="wc-card-title wc-card-title-compact">{{ g.title }}</h3>
              <div v-if="g.director" class="wc-card-director">dir. {{ g.director }}</div>

              <ul class="wc-card-awards">
                <li v-for="a in g.awards" :key="a.id" class="wc-award-row">
                  <span class="wc-award-marker" :class="awardChipClass(a)" aria-hidden="true"></span>
                  <span class="wc-award-text">
                    <span class="wc-award-name">{{ shortAwardLabel(a) }}</span>
                    <span v-if="a.recipient_name" class="wc-award-recipient-inline"> · {{ a.recipient_name }}</span>
                  </span>
                </li>
              </ul>
            </template>
          </div>
        </component>
      </div>

      <button
        class="wc-nav wc-nav-next"
        :class="{ 'wc-nav-disabled': !canScrollRight }"
        @click="scrollByDir(1)"
        aria-label="Scroll right"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  awards: { type: Array, default: () => [] },
  year: { type: [String, Number], default: 2026 },
  stat: { type: Object, default: null },
});

const trackEl = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

// Group awards by film identity. tmdb_id wins, then imdb_id, then title+director.
// Ensures Cotton Fever / Labrador / Jail Time / Summer of Three render as one card each.
const groupKey = (a) => {
  if (a.tmdb_id) return `tmdb:${a.tmdb_id}`;
  if (a.imdb_id) return `imdb:${a.imdb_id}`;
  const t = String(a.title || '').toLowerCase().trim();
  const d = String(a.director || '').toLowerCase().trim();
  return `td:${t}|${d}`;
};

// Higher = more prestigious. Drives both the on-poster badge and quote selection.
const priorityOf = (a) => (a.is_grand_prize ? 3 : 0) + (!a.is_honorable_mention && !a.is_grand_prize ? 1 : 0);

const groups = computed(() => {
  const map = new Map();
  for (const a of props.awards || []) {
    const k = groupKey(a);
    let g = map.get(k);
    if (!g) {
      g = {
        key: k,
        title: a.title,
        director: a.director,
        poster: a.poster || null,
        cinemagoria_url: a.cinemagoria_url || null,
        awards: [],
        primary: a,
      };
      map.set(k, g);
    }
    g.awards.push(a);
    if (priorityOf(a) > priorityOf(g.primary)) g.primary = a;
    if (!g.poster && a.poster) g.poster = a.poster;
    if (!g.cinemagoria_url && a.cinemagoria_url) g.cinemagoria_url = a.cinemagoria_url;
  }
  // Within each group, render awards in priority/display order.
  for (const g of map.values()) {
    g.awards.sort((x, y) => {
      const pd = priorityOf(y) - priorityOf(x);
      if (pd !== 0) return pd;
      return (x.display_order || 0) - (y.display_order || 0);
    });
  }
  return Array.from(map.values());
});

const cardClassesForGroup = (g) => ({
  'wc-card-grand': g.primary.is_grand_prize,
  'wc-card-mention': g.primary.is_honorable_mention,
  'wc-card-audience': g.primary.award_type === 'audience',
  'wc-card-link': !!g.cinemagoria_url,
  'wc-card-multi': g.awards.length > 1,
});

const awardChipClass = (a) => ({
  'wc-chip-gold': a.is_grand_prize,
  'wc-chip-mention': a.is_honorable_mention,
  'wc-chip-audience': a.award_type === 'audience',
});

const shortAwardLabel = (a) => {
  if (!a.award_name) return '';
  let label = a.award_name;
  // Strip "Mention" prefixes — the badge/marker already conveys it
  label = label.replace(/^Honorable Mention\s*[—\-]\s*/i, '');
  label = label.replace(/^Special Jury Mention\s*[—\-]\s*/i, '');
  label = label.replace(/^Audience Award\s*[—\-]\s*/i, '');
  // Drop "(Audience)" suffix
  label = label.replace(/\s*\(Audience\)\s*$/i, '');
  // Drop trailing "in a/an/the … Feature" qualifier (redundant — same section)
  label = label.replace(/\s+in\s+(an?|the)\s+.+?\s+Feature\s*$/i, '');
  return label.trim();
};

const onPosterError = (event) => {
  const img = event.target;
  if (!img) return;
  img.style.display = 'none';
};

const onScroll = () => {
  const el = trackEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 4;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
};

const scrollByDir = (dir) => {
  const el = trackEl.value;
  if (!el) return;
  const card = el.querySelector('.wc-card');
  const step = card ? card.getBoundingClientRect().width + 12 : 320;
  el.scrollBy({ left: dir * step * 1.5, behavior: 'smooth' });
};

onMounted(() => {
  setTimeout(onScroll, 100);
  window.addEventListener('resize', onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', onScroll);
});
</script>

<style lang="scss" scoped>
// Compact landscape card. Solves the 2:3 poster crop issue and packs more
// cards into the viewport. Whole card is the clickable surface.
$wc-card-w: 360px;
$wc-card-h: 175px;
$wc-poster-w: 117px; // 2:3 of $wc-card-h → no cropping
$wc-radius: 10px;
$wc-cyan: #8AE8FC;
$wc-primary: #18729f;
$wc-gold: #f0c42d;
$wc-bg-card: linear-gradient(180deg, #0d1418 0%, #06090b 100%);

// ROOT — escape the parent flex-column container's `align-items: center`.
// max-width: 1000px aligns the carousel with .festival-hero, .schedule-container
// and .info-container (all use the same width). margin: auto horizontally centers.
.winners-carousel {
  width: 100%;
  max-width: 1200px;
  min-width: 0;
  align-self: stretch;
  box-sizing: border-box;
  margin: 10px auto 8px;
  padding: 0 4px;
  position: relative;
  overflow: hidden;
}

// ============== HEADER ==============
.wc-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.wc-header-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}
.wc-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
}
.wc-eyebrow-bar {
  width: 3px;
  height: 12px;
  background: linear-gradient(180deg, $wc-gold 0%, #b8860b 100%);
  border-radius: 2px;
}
.wc-eyebrow-text {
  font-size: 9px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba($wc-gold, 0.85);
  font-weight: 700;
}
.wc-title {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: #fff;
  margin: 0;
}
.wc-title-year {
  color: #6b7785;
  font-weight: 300;
  font-size: 18px;
}
.wc-stat {
  text-align: right;
  align-self: flex-end;
}
.wc-stat-main { font-size: 11px; font-weight: 600; color: #d6dade; }
.wc-stat-sub { font-size: 10px; color: #6b7785; margin-top: 2px; }

// ============== TRACK ==============
.wc-track-wrapper {
  position: relative;
  width: 100%;
  min-width: 0;
}
.wc-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  padding: 4px 4px 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: rgba($wc-primary, 0.5) transparent;

  &::-webkit-scrollbar { height: 5px; }
  &::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba($wc-primary, 0.5); border-radius: 3px; }
  &::-webkit-scrollbar-thumb:hover { background: $wc-primary; }
}

// ============== NAV BUTTONS ==============
.wc-nav {
  position: absolute;
  top: calc(#{$wc-card-h} / 2 - 14px);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(13, 20, 24, 0.96);
  border: 1px solid rgba(138, 232, 252, 0.18);
  color: $wc-cyan;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  padding: 0;

  &:hover:not(.wc-nav-disabled) {
    background: $wc-primary;
    color: #fff;
    transform: scale(1.1);
    border-color: $wc-primary;
  }
}
.wc-nav-prev { left: 4px; }
.wc-nav-next { right: 4px; }
.wc-nav-disabled { opacity: 0; pointer-events: none; }

// ============== CARD ==============
.wc-card {
  position: relative;
  flex: 0 0 $wc-card-w;
  width: $wc-card-w;
  height: $wc-card-h;
  background: $wc-bg-card;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: $wc-radius;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  flex-direction: row;        // ← landscape layout: poster left, content right
  text-decoration: none;
  color: inherit;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);
}
.wc-card-link {
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba($wc-cyan, 0.32);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  }
  &:active { transform: translateY(0); }
}

.wc-card-grand {
  border-color: rgba($wc-gold, 0.22);
  box-shadow:
    0 0 0 1px rgba($wc-gold, 0.10),
    0 8px 28px rgba(0, 0, 0, 0.5),
    0 0 36px -18px rgba($wc-gold, 0.25);
  &.wc-card-link:hover {
    border-color: rgba($wc-gold, 0.4);
    box-shadow:
      0 0 0 1px rgba($wc-gold, 0.25),
      0 12px 36px rgba(0, 0, 0, 0.6),
      0 0 60px -20px rgba($wc-gold, 0.4);
  }
}

// ============== POSTER ==============
.wc-card-poster {
  position: relative;
  width: $wc-poster-w;
  height: 100%;
  flex-shrink: 0;
  background: #0a0f12;
  overflow: hidden;
}
.wc-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;  // center, not top — keeps faces visible
  display: block;
}
.wc-poster-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2226 0%, #0a0f12 100%);
  color: #4a5560;
  font-size: 10px;
  text-align: center;
  padding: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

// ============== BADGES ==============
.wc-badge {
  position: absolute;
  top: 7px;
  left: 7px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 800;
  z-index: 2;
  backdrop-filter: blur(6px);
  line-height: 1;
}
.wc-badge-gold {
  background: linear-gradient(135deg, $wc-gold 0%, #b8860b 100%);
  color: #0d0a08;
  box-shadow: 0 1px 8px rgba($wc-gold, 0.4);
}
.wc-badge-mention {
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.wc-badge-audience { background: rgba($wc-primary, 0.92); color: #fff; }
.wc-badge-critics {
  background: rgba(0, 0, 0, 0.75);
  color: $wc-cyan;
  border: 1px solid rgba($wc-cyan, 0.3);
}
.wc-badge-craft {
  background: rgba(0, 0, 0, 0.75);
  color: #d6dade;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.wc-badge-tie {
  top: auto;
  left: auto;
  bottom: 7px;
  right: 7px;
  background: rgba(0, 0, 0, 0.75);
  color: rgba(240, 196, 45, 0.95);
  border: 1px solid rgba(240, 196, 45, 0.3);
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: lowercase;
}
// Count chip for multi-award films (bottom-right of poster)
.wc-badge-count {
  top: auto;
  left: auto;
  bottom: 7px;
  right: 7px;
  background: rgba(0, 0, 0, 0.78);
  color: $wc-cyan;
  border: 1px solid rgba($wc-cyan, 0.35);
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 9px;
  padding: 3px 7px;
}

// ============== CARD BODY ==============
.wc-card-body {
  padding: 11px 13px 11px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}
.wc-award-chip {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  color: $wc-cyan;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}
.wc-chip-gold { color: $wc-gold; }
.wc-chip-mention { color: rgba(255, 255, 255, 0.5); }
.wc-chip-audience { color: $wc-cyan; }

.wc-card-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  margin: 0 0 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wc-card-recipient {
  font-size: 11px;
  color: $wc-cyan;
  margin-bottom: 6px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wc-card-recipient-role {
  color: #6b7785;
  font-weight: 400;
  text-transform: capitalize;
  font-size: 10px;
}
.wc-card-director {
  font-size: 10px;
  color: #6b7785;
  margin-bottom: 6px;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wc-card-quote {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 11px;
  line-height: 1.4;
  color: rgba(214, 218, 222, 0.78);
  border-left: 2px solid rgba($wc-primary, 0.6);
  padding-left: 7px;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

// ============== MULTI-AWARD LAYOUT ==============
// Tighter title — leaves room for the stacked award list below.
.wc-card-title-compact {
  font-size: 13px;
  -webkit-line-clamp: 1;
  margin-bottom: 2px;
}
.wc-card-awards {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}
.wc-award-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 10.5px;
  line-height: 1.32;
}
.wc-award-marker {
  flex: 0 0 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 4px;
  background: $wc-cyan;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);

  &.wc-chip-gold { background: $wc-gold; box-shadow: 0 0 6px rgba($wc-gold, 0.45); }
  &.wc-chip-mention { background: rgba(255, 255, 255, 0.45); }
  &.wc-chip-audience { background: $wc-primary; }
}
.wc-award-text {
  flex: 1 1 auto;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.wc-award-name {
  color: #d6dade;
  font-weight: 600;
}
.wc-award-recipient-inline {
  color: #8a9aa8;
  font-weight: 400;
}

// Slightly more generous height when several awards land on one film.
.wc-card-multi {
  height: auto;
  min-height: $wc-card-h;
  max-height: 240px;
}

// ============== RESPONSIVE ==============
@media (max-width: 768px) {
  .wc-card { flex: 0 0 320px; width: 320px; height: 160px; }
  .wc-card-poster { width: 107px; }
  .wc-card-title { font-size: 13px; }
  .wc-card-quote { -webkit-line-clamp: 3; }
  .wc-nav { display: none; }
}
@media (max-width: 480px) {
  .winners-carousel { margin: 20px 0 4px; padding: 0 2px; }
  .wc-title { font-size: 19px; }
  .wc-title-year { font-size: 15px; }
  .wc-card { flex: 0 0 280px; width: 280px; height: 150px; }
  .wc-card-poster { width: 100px; }
  .wc-card-body { padding: 9px 11px; }
  .wc-card-quote { -webkit-line-clamp: 2; font-size: 10px; }
}
</style>

<!-- Switcher-container override moved to assets/css/global.scss
     (uses .disclaimer-bar--top as anchor — applies to all festival pages,
     not just those with WinnersCarousel). -->

