<template>
  <div class="listing listing--infinite">
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
        <strong>Explorar Todo</strong>
      </nuxt-link>
    </div>

    <div class="carousel">
      <button
        class="carousel__nav carousel__nav--left"
        aria-label="Anterior"
        type="button"
        @click="nudge(-1)">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="viewport"
        class="inf__viewport">
        <div
          ref="track"
          class="inf__track"
          :class="{ 'is-manual': isManual }"
          :style="{
            animationDelay: `${seek}s`,
            '--manual-x': `${manualX}px`,
          }">
          <component
            v-for="(item, i) in duplicated"
            :key="`card-${i}-${item.id}`"
            :is="getCardComponent(item)"
            :item="item" />
        </div>
      </div>

      <button
        class="carousel__nav carousel__nav--right"
        aria-label="Siguiente"
        type="button"
        @click="nudge(1)">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import infiniteScroll from '~/mixins/InfiniteScroll';
import SundanceCard from '~/components/SundanceCard.vue';
import SlamdanceCard from '~/components/SlamdanceCard.vue';
import TribecaCard from '~/components/TribecaCard.vue';
import BerlinaleCard from '~/components/BerlinaleCard.vue';
import RotterdamCard from '~/components/RotterdamCard.vue';
import SxswCard from '~/components/festival/SxswCard.vue';
import RomfordCard from '~/components/RomfordCard.vue';
import BifffCard from '~/components/BifffCard.vue';
import BaficiCard from '~/components/BaficiCard.vue';
import CannesCard from '~/components/CannesCard.vue';

export default {
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
    CannesCard,
  },

  mixins: [infiniteScroll],

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
      infiniteDuration: 69,
    };
  },

  computed: {
    duplicated () {
      return [...this.items.results, ...this.items.results];
    },
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
        cannes: 'CannesCard',
      };
      return cardMap[item.festival_source] || 'SundanceCard';
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

.listing {
  margin-bottom: 2.5rem;
}

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

.inf__viewport {
  overflow: hidden;
  padding: 8px 0;
  touch-action: pan-y;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 90px,
    #000 calc(100% - 90px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 90px,
    #000 calc(100% - 90px),
    transparent 100%
  );
}

.inf__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  gap: 12px;
  animation: inf-scroll-fest 69s linear infinite;
  will-change: transform;

  &:hover,
  &:focus-within {
    animation-play-state: paused;
  }

  &.is-manual {
    animation: none;
    transform: translate3d(var(--manual-x, 0px), 0, 0);
    transition: transform 0.08s linear;
  }
}

@keyframes inf-scroll-fest {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

.inf__track :deep(.card) {
  flex: 0 0 auto;
  width: 150px;
  margin: 0 !important;

  @media (min-width: $breakpoint-xsmall) {
    width: 180px;
  }
  @media (min-width: $breakpoint-medium) {
    width: 210px;
  }
  @media (min-width: $breakpoint-large) {
    width: 230px;
  }
  @media (min-width: 1500px) {
    width: 250px;
  }
  @media (min-width: 1800px) {
    width: 270px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .inf__track {
    animation: none;
  }
}
</style>
