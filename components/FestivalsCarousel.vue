<template>
  <div class="listing listing--carousel">
    <div
      v-if="title || viewAllUrl"
      class="listing__head">
      <h2
        v-if="title"
        class="listing__title">
        {{ title }}
      </h2>

      <nuxt-link
        v-if="viewAllUrl"
        :to="viewAllUrl"
        class="listing__explore">
        <strong>Explore All</strong>
      </nuxt-link>
    </div>

    <div class="carousel">
      <button
        class="carousel__nav carousel__nav--left"
        aria-label="Previous"
        type="button"
        :disabled="disableLeftButton"
        @click="manualMove('left')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items"
        @scroll="scrollEvent"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay">
        <component
          v-for="item in items.results"
          :key="item.id"
          :is="getCardComponent(item)"
          :item="item" />
      </div>

      <button
        class="carousel__nav carousel__nav--right"
        aria-label="Next"
        type="button"
        :disabled="disableRightButton"
        @click="manualMove('right')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';
import SundanceCard from '~/components/SundanceCard.vue';
import SlamdanceCard from '~/components/SlamdanceCard.vue';
import TribecaCard from '~/components/TribecaCard.vue';
import BerlinaleCard from '~/components/BerlinaleCard.vue';
import RotterdamCard from '~/components/RotterdamCard.vue';
import SxswCard from '~/components/festival/SxswCard.vue';
import RomfordCard from '~/components/RomfordCard.vue';
import BifffCard from '~/components/BifffCard.vue';
import BaficiCard from '~/components/BaficiCard.vue';
import CuffCard from '~/components/CuffCard.vue';
import CannesCard from '~/components/CannesCard.vue';
import CannesCriticsChoiceCard from '~/components/CannesCard.vue';
import KviffCard from '~/components/KviffCard.vue';
import FantasiaCard from '~/components/FantasiaCard.vue';
import FrightfestCard from '~/components/FrightfestCard.vue';
import VeniceCard from '~/components/VeniceCard.vue';
import TiffCard from '~/components/TiffCard.vue';
import LocarnoCard from '~/components/LocarnoCard.vue';
import BifanCard from '~/components/BifanCard.vue';
import BiffCard from '~/components/BiffCard.vue';

const AUTOPLAY_INTERVAL = 10000;

export default {
  name: 'FestivalsCarousel',

  mixins: [carousel],

  components: {
    SundanceCard,
    SlamdanceCard,
    TribecaCard,
    BerlinaleCard,
    RotterdamCard,
    SxswCard,
    RomfordCard,
    BifffCard,
    BaficiCard,
    CuffCard,
    CannesCard,
    CannesCriticsChoiceCard,
    KviffCard,
    FantasiaCard,
    FrightfestCard,
    VeniceCard,
    TiffCard,
    LocarnoCard,
    BifanCard,
    BiffCard,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    viewAllUrl: {
      type: [String, Object],
      required: false,
      default: null,
    },
    items: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      autoplayInterval: null,
    };
  },

  mounted () {
    this.$nextTick(() => {
      if (this.items && this.items.results && this.items.results.length > 0) {
        this.calculateState(this.items.results.length);
        if (typeof window !== 'undefined') {
          this.startAutoplay();
        }
      }
    });
  },

  beforeUnmount () {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
  },

  methods: {
    getCardComponent (item) {
      const cardMap = {
        berlinale: 'BerlinaleCard',
        rotterdam: 'RotterdamCard',
        slamdance: 'SlamdanceCard',
        tribeca: 'TribecaCard',
        sxsw: 'SxswCard',
        romford: 'RomfordCard',
        bifff: 'BifffCard',
        bafici: 'BaficiCard',
        cuff: 'CuffCard',
        cannes: 'CannesCard',
        'cannes-critics-choice': 'CannesCriticsChoiceCard',
        kviff: 'KviffCard',
        fantasia: 'FantasiaCard',
        frightfest: 'FrightfestCard',
        venice: 'VeniceCard',
        tiff: 'TiffCard',
        locarno: 'LocarnoCard',
        bifan: 'BifanCard',
        biff: 'BiffCard',
      };
      return cardMap[item.festival_source] || 'SundanceCard';
    },
    resizeEvent () {
      if (this.items && this.items.results) {
        this.calculateState(this.items.results.length);
      }
    },
    manualMove (direction) {
      this.moveToClickEvent(direction);
      this.resetAutoplay();
    },
    startAutoplay () {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval);
      this.autoplayInterval = setInterval(() => {
        if (!this.disableRightButton) {
          this.moveToClickEvent('right');
        } else {
          this.moveTo(0);
        }
      }, AUTOPLAY_INTERVAL);
    },
    pauseAutoplay () {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    },
    resumeAutoplay () {
      this.startAutoplay();
    },
    resetAutoplay () {
      this.pauseAutoplay();
      this.resumeAutoplay();
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

/* Cyan gradient accent line at the top of each card, mirroring the news carousel. */
:deep(.card__link) {
  position: relative;

  &::before {
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

  &:hover::before {
    opacity: 1;
  }
}

.listing {
  margin-bottom: 2.5rem;
}

:deep(.carousel__items) {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 12px;
  padding: 8px 0;
}

:deep(.card) {
  flex: 0 0 auto;
  width: 130px;
  padding: 0 !important;
  scroll-snap-align: start;

  @media (min-width: $breakpoint-xsmall) {
    width: 160px;
  }
  @media (min-width: $breakpoint-medium) {
    width: 185px;
  }
  @media (min-width: $breakpoint-large) {
    width: 205px;
  }
  @media (min-width: 1500px) {
    width: 220px;
  }
  @media (min-width: 1800px) {
    width: 240px;
  }
}

</style>
