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
        <strong>Explorar Más</strong>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M17.9 23.2 6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items"
        @scroll="scrollEvent">
        <Card
          v-for="item in items.results"
          :key="`card-${item.id}`"
          :item="item" />

        <div
          v-if="viewAllUrl"
          class="card">
          <nuxt-link
            :to="viewAllUrl"
            class="card__link">
            <div class="card__img" style="position: relative; transform: scaleY(1.1); top: 20px;">
              <span>Explorar Más</span>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6.1 23.2 17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';
import Card from '~/components/Card';

export default {
  components: {
    Card,
  },

  mixins: [carousel],

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },

    viewAllUrl: {
      type: Object,
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
</style>
<style>
  .card__img {
    position: relative;
    height: 0;
    padding-top: 150.27%;
    overflow: hidden;
    backdrop-filter: blur(16px);
    border-start-start-radius: 10px;
    border-start-end-radius: 10px;
    transition: transform 0.3s ease-in-out;
  }
  .card__name {
    margin-bottom: 1rem;
    overflow: hidden;
    font-size: 1.3rem;
    background: black;
    text-align: center;
    text-overflow: ellipsis;
    letter-spacing: 0.4px;
    top: -20px;
    white-space: nowrap;
    position: relative;
}

.card__rating {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    background: black;
    box-shadow: 0 8px 10px 0 rgba(31, 104, 135, 0.37);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    bottom: 10px;
    padding-bottom: 0.5rem;
    position: relative;
    top: -30px;

}

.card__stars {
  text-align: center;
}

.card__vote {
  text-align: center;
}

</style>
