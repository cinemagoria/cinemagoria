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
        <Card
          v-for="item in items.results"
          :key="`spot-${item.id}`"
          :item="item" />
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
  },

  methods: {
    resizeEvent() {
      this.calculateState(this.items.results.length);
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.calculateState(this.items.results.length);
    });
  },

  watch: {
    'items.results.length'(newVal) {
      this.$nextTick(() => {
        this.calculateState(newVal);
      });
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
</style>
