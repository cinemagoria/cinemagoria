<template>
  <div class="listing listing--carousel">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">
        Popular Streaming Services
        <NuxtLink to="/streaming-services" class="explore-all">Explore All</NuxtLink>
      </h2>
    </div>

    <div class="carousel">
      <button
        class="carousel__nav carousel__nav--left"
        aria-label="Previous"
        type="button"
        :disabled="disableLeftButton"
        @click="moveToClickEvent('left')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items"
        @scroll="scrollEvent">
        
        <div
          v-for="platform in items"
          :key="platform.id"
          class="production-company-card"
        >
          <NuxtLink 
            :to="`/streaming/${platform.slug}`"
            class="company-link"
          >
            <div class="logo-container">
              <img 
                v-if="platform.logo_path" 
                :src="`${apiImgUrl}/w500${platform.logo_path}`" 
                :alt="platform.name" 
                class="company-logo"
                loading="lazy"
              >
              <span v-else class="company-name">{{ platform.name }}</span>
            </div>
          </NuxtLink>
        </div>

      </div>

      <button
        class="carousel__nav carousel__nav--right"
        aria-label="Next"
        type="button"
        :disabled="disableRightButton"
        @click="moveToClickEvent('right')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';
import { apiImgUrl } from '~/utils/api';

export default {
  mixins: [carousel],
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      apiImgUrl
    };
  },
  computed: {
    totalItems() {
      return this.items.length;
    }
  },
  mounted() {
    this.calculateState(this.totalItems);
  },
  methods: {
    resizeEvent() {
      this.calculateState(this.totalItems);
    }
  }
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

.listing__title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.explore-all {
  font-size: 1.4rem;
  color: #8BE9FD;
  text-decoration: none;
  font-weight: 500;
  margin-left: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
}

.carousel {
  position: relative;
  
  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    background: rgba(0,0,0,0.5);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s, opacity 0.3s;
    
    &:hover:not(:disabled) {
        background: rgba(0,0,0,0.8);
    }
    
    &:disabled {
        opacity: 0;
        cursor: default;
    }

    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }
  }
  
  &__items {
    display: flex;
    align-items: stretch;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 20px;
    
    scrollbar-width: none; 
    -ms-overflow-style: none;
    &::-webkit-scrollbar { 
      display: none; 
    }
  }
}


.production-company-card {
  width: 180px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background: #333;
  margin-right: 20px;
  scroll-snap-align: start;
  
  &:hover {
    transform: scale(1.05);
  }

  &:first-child {
    margin-left: 15px;

    @media (min-width: $breakpoint-small) {
      margin-left: 40px;
    }

    @media (min-width: $breakpoint-large) {
      margin-left: 50px;
    }
  }
}

.company-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.logo-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #8BE9FD; /* Updated background color */
}

.company-logo {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.company-name {
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
}
</style>
