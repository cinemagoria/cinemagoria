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
        @click="moveToClickEvent('left')">
        <!-- eslint-disable-next-line -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items carousel__items--flex"
        @scroll="scrollEvent">
        <component
            v-for="item in items.results"
            :key="`card-${item.id}`"
            :is="getCardComponent(item)" 
            :item="item" 
        />

        <div
          v-if="viewAllUrl"
          class="card card--explore">
          <nuxt-link
            :to="viewAllUrl"
            class="card__link">
            <div class="card__img">
              <span>Explore All</span>
            </div>
          </nuxt-link>
        </div>
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
import SundanceCard from '~/components/SundanceCard.vue';
import SlamdanceCard from '~/components/SlamdanceCard.vue';
import BerlinaleCard from '~/components/BerlinaleCard.vue';
import RotterdamCard from '~/components/RotterdamCard.vue';
import SxswCard from '~/components/festival/SxswCard.vue';
import RomfordCard from '~/components/RomfordCard.vue';

export default {
  components: {
    SundanceCard,
    SlamdanceCard,
    BerlinaleCard,
    RotterdamCard,
    SxswCard,
    RomfordCard
  },

  mixins: [carousel],

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },

    viewAllUrl: {
      type: [String, Object],
      required: false,
      default: function () {
        return null;
      },
    },

    items: {
      type: Object,
      required: true,
    },
  },

  mounted () {
    const count = this.viewAllUrl ? this.items.results.length + 1 : this.items.results.length;
    this.calculateState(count);
  },

  methods: {
    resizeEvent () {
      const count = this.viewAllUrl ? this.items.results.length + 1 : this.items.results.length;
      this.calculateState(count);
    },
    getCardComponent(item) {
      const cardMap = {
        berlinale: 'BerlinaleCard',
        rotterdam: 'RotterdamCard',
        slamdance: 'SlamdanceCard',
        sxsw: 'SxswCard',
        romford: 'RomfordCard',
      };
      return cardMap[item.festival_source] || 'SundanceCard';
    }
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

.carousel__items--flex {
  display: flex !important;
  align-items: stretch;
}

.carousel__items--flex .card {
  height: auto;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.card--explore .card__link {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}

.card--explore .card__img {
  flex: 1;
  padding-top: 0 !important;
  height: calc(100% - 30px) !important;
  flex-basis: calc(100% - 30px);
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  border-radius: 15px;
}

.card--explore .card__img span {
  position: static;
  width: auto;
  height: auto;
  font-weight: 700;
  color: #fff;
  font-size: 1.3rem; 
  display: block; 
}
</style>
