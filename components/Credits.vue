<template>
  <div
    v-if="people && people.length"
    class="listing listing--carousel credits-container">
    <div class="listing__head">
      <h2 class="listing__title">
        Cast
      </h2>
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
        class="carousel__items"
        @scroll="scrollEvent">
        <CreditsItem
          v-for="person in people"
          :key="`credit-${person.id}`"
          :person="person" />
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
import { debounce } from '~/mixins/Functions';
import CreditsItem from '~/components/CreditsItem';

export default {
  components: {
    CreditsItem,
  },

  mixins: [carousel],

  props: {
    people: {
      type: Array,
      required: true,
    },
  },

  mounted () {
    this.calculateState(this.people.length);
  },

  methods: {
    resizeEvent: debounce(function () {
      this.calculateState(this.people.length);
    }, 100),
  },
};
</script>

<style lang="scss" scoped>
.credits-container {
  position: relative;
  background: rgba(3, 4, 6, 0.55);
  background-image:
    radial-gradient(circle at 10% 0%, rgba(31, 84, 103, 0.16), transparent 32%),
    radial-gradient(circle at 90% 100%, rgba(139, 233, 253, 0.06), transparent 30%);
  border-radius: 20px;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 20px rgba(139, 233, 253, 0.04);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.credits-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
}

.listing__head {
  padding-left: 2rem;
}

.listing__title {
  color: #fff;
  font-weight: 700;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.18);
}

.carousel {
  padding: 0 1rem;
  margin-top: -10px;
}

.carousel__items {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: -10px;
}
</style>
