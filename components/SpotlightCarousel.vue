<template>
  <div :class="['listing', 'listing--carousel', 'spotlight', { 'listing--compact': compact }]">
    <div
      v-if="title || viewAllUrl"
      class="listing__head">
      <h2
        v-if="title"
        class="listing__title spotlight__title">
        {{ title }}
      </h2>

      <nuxt-link
        v-if="viewAllUrl"
        :to="viewAllUrl"
        class="listing__explore">
        <strong>Explore All</strong>
      </nuxt-link>
    </div>

    <div class="carousel spotlight__carousel">
      <button
        class="carousel__nav carousel__nav--left"
        aria-label="Previous"
        type="button"
        :disabled="disableLeftButton"
        @click="moveToClickEvent('left')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items"
        @scroll="scrollEvent">
        <template
          v-for="(item, idx) in items.results"
          :key="`spot-${item.id}`">
          <div
            v-if="dividerLabel(item, idx)"
            class="spotlight__divider"
            :class="{ 'spotlight__divider--first': idx === 0 }"
            :aria-label="dividerLabel(item, idx)">
            <span class="spotlight__divider-rail"></span>
            <span class="spotlight__divider-text">{{ dividerLabel(item, idx) }}</span>
          </div>
          <Card :item="item" />
        </template>
      </div>

      <button
        class="carousel__nav carousel__nav--right"
        aria-label="Next"
        type="button"
        :disabled="disableRightButton"
        @click="moveToClickEvent('right')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';
import Card from '~/components/Card';

const DEFAULT_LABELS = {
  movie: {
    now_playing: 'Now Playing',
    coming_soon: 'Coming Soon',
    just_out: 'Just Out',
    after_run: 'After Run',
    no_date: 'No Release Date Yet',
  },
  tv: {
    airing: 'Airing',
    premiering: 'Premiering Soon',
    latest_episodes: 'Latest Episodes',
    completed: 'Completed',
    no_date: 'No Air Date Yet',
  },
};

export default {
  components: { Card },

  mixins: [carousel],

  props: {
    title: { type: String, required: false, default: '' },
    viewAllUrl: {
      type: [String, Object],
      required: false,
      default: () => null,
    },
    items: { type: Object, required: true },
    compact: { type: Boolean, required: false, default: false },
    mediaType: {
      type: String,
      required: false,
      default: 'movie',
      validator: (v) => v === 'movie' || v === 'tv',
    },
    // Optional override of phase → label map. If absent, English defaults
    // are used (this is the en repo). The es repo passes Spanish labels.
    phaseLabels: {
      type: Object,
      required: false,
      default: () => null,
    },
  },

  computed: {
    labels() {
      const base = DEFAULT_LABELS[this.mediaType] || {};
      return { ...base, ...(this.phaseLabels || {}) };
    },
    // Dividers count toward the scrollable width — the carousel mixin uses
    // the first child's width for paging math, so we inflate the total count.
    dividerCount() {
      const r = this.items?.results || [];
      let n = 0;
      let last = null;
      for (const item of r) {
        const phase = item.phase || item._phase || null;
        if (!phase) continue;
        if (phase !== last) { n++; last = phase; }
      }
      return n;
    },
  },

  methods: {
    // Returns the label to render BEFORE this card, or '' if no divider here.
    // First card always gets its phase header so the timeline is anchored;
    // the divider's --first variant carries extra left margin to clear
    // the carousel's left navigation arrow.
    dividerLabel(item, idx) {
      const phase = item.phase || item._phase || null;
      if (!phase) return '';
      if (idx === 0) return this.labels[phase] || '';
      const prev = this.items.results[idx - 1];
      const prevPhase = prev?.phase || prev?._phase || null;
      if (prevPhase === phase) return '';
      return this.labels[phase] || '';
    },

    resizeEvent() {
      this.calculateState(this.dividerCount + this.items.results.length);
    },
  },

  mounted() {
    this.calculateState(this.dividerCount + this.items.results.length);
  },

  watch: {
    'items.results.length'(newVal) {
      this.calculateState(this.dividerCount + newVal);
    },
  },
};
</script>

<style scoped>
.listing__explore,
.listing__explore strong {
  color: #8BE9FD !important;
  text-decoration: none;
  transition: color 0.3s;
}

.listing__explore:hover,
.listing__explore:hover strong {
  color: #A2EDFD !important;
}

.spotlight__title {
  position: relative;
}

.spotlight__title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 36px;
  height: 2px;
  background: linear-gradient(90deg, #22d3ee 0%, rgba(34, 211, 238, 0) 100%);
  border-radius: 2px;
}

/* Compact mode — same sizing as ListingCarousel for consistency. */
.listing--compact :deep(.carousel__items .card) {
  width: calc(.25 * (100% - 22px));
}

@media (min-width: 576px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.2 * (100% - 72px));
  }
}

@media (min-width: 840px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.16667 * (100% - 72px));
  }
}

@media (min-width: 1200px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.14286 * (100% - 92px));
  }
}

@media (min-width: 1500px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.125 * (100% - 92px));
  }
}

@media (min-width: 1800px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.1111 * (100% - 92px));
  }
}

@media (min-width: 2500px) {
  .listing--compact :deep(.carousel__items .card) {
    width: calc(.1 * (100% - 92px));
  }
}

/* Timeline divider — slim vertical bar between phase groups. The carousel
   uses inline-block layout (not flex), so the divider must follow the same
   pattern: inline-block, vertical-align: top, fixed width + height. */
.spotlight__divider {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 26px;
  height: 220px;
  margin: 0;
  white-space: normal;
  scroll-snap-align: none;
  user-select: none;
  pointer-events: none;
}

.spotlight__divider-rail {
  position: absolute;
  left: 50%;
  top: 12px;
  bottom: 12px;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg,
    rgba(34, 211, 238, 0) 0%,
    rgba(34, 211, 238, 0.55) 30%,
    rgba(34, 211, 238, 0.55) 70%,
    rgba(34, 211, 238, 0) 100%);
}

/* When the divider is the first item in the carousel, give it enough
   left margin to clear the absolutely-positioned left nav arrow (30px
   mobile / 40px small / 50px large) plus a small breathing gap so the
   rotated label doesn't hug the arrow's edge. This intentionally pushes
   the spotlight carousel slightly to the right vs. the other carousels —
   the timeline is the point of this slider, so the offset earns its
   keep. */
/* First-child margin lives in the unscoped <style> block below — it has to
   be global to win over the global .carousel__items .card:first-child rule. */

.spotlight__divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  transform-origin: center center;
  white-space: nowrap;
  color: #22d3ee;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  line-height: 1;
  padding: 6px 10px;
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.35);
}

@media (min-width: 576px) {
  .spotlight__divider { width: 28px; height: 260px; }
}

@media (min-width: 840px) {
  .spotlight__divider { width: 30px; height: 300px; }
  .spotlight__divider-text { font-size: 10.5px; }
}

@media (min-width: 1200px) {
  .spotlight__divider { width: 32px; height: 340px; }
  .spotlight__divider-text { font-size: 11px; letter-spacing: 0.36em; }
}

@media (min-width: 1800px) {
  .spotlight__divider { height: 380px; }
}

.spotlight .carousel__items {
  left: 5rem !important;
}
</style>

