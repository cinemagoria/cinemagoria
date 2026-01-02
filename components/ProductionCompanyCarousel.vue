<template>
  <div class="listing listing--carousel">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">
        Popular Production Companies
      </h2>

      <nuxt-link
        v-if="viewAllLink"
        :to="viewAllLink"
        class="listing__explore">
        <strong class="strong">Explore All</strong>
      </nuxt-link>
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
          v-for="company in items"
          :key="company.id"
          class="production-company-card"
        >
          <nuxt-link 
            :to="`/production/${company.slug}`"
            class="company-link"
          >
            <div class="logo-container">
               <img 
                 v-if="company.logo_path" 
                 :src="`https://image.tmdb.org/t/p/w500${company.logo_path}`" 
                 :alt="company.name" 
                 class="company-logo"
                 loading="lazy"
               />
               <span v-else class="company-name">{{ company.name }}</span>
            </div>
          </nuxt-link>
        </div>

        <!-- 'Explore All' Card -->
        <div class="production-company-card explore-card" v-if="viewAllLink">
             <nuxt-link :to="viewAllLink" class="company-link explore-link">
               <div class="logo-container explore-container">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import carousel from '~/mixins/Carousel';

export default {
  mixins: [carousel],
  props: {
    items: {
      type: Array,
      required: true
    },
    viewAllLink: {
      type: String,
      default: null
    }
  },
  mounted() {
    const totalItems = this.items.length + (this.viewAllLink ? 1 : 0);
    this.calculateState(totalItems);
  },
  methods: {
    resizeEvent() {
      const totalItems = this.items.length + (this.viewAllLink ? 1 : 0);
      this.calculateState(totalItems);
    }
  }
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

.strong {
    color: #8BE9FD;
}

.carousel {
  position: relative;
  
  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5; /* Added Z-index as requested */
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
    padding-bottom: 20px; /* Space for scrollbar or shadow */
    
    /* Hide scrollbar */
    scrollbar-width: none; 
    -ms-overflow-style: none;
    &::-webkit-scrollbar { 
      display: none; 
    }
  }
}


.production-company-card {
  width: 250px; 
  height: 140px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background: #8BE9FD;
  margin-right: 20px;
  scroll-snap-align: start;
  
  &:hover {
    transform: scale(1.03);
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
}

.company-logo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  filter: brightness(0);
}

.company-name {
  color: #000;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}

.explore-card {
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
        background: #111;
    }
}

.explore-container {
    flex-direction: column;
    gap: 10px;
    color: #fff;
    font-weight: 500;
    font-size: 1.3rem;
    @media (min-width: $breakpoint-large) {
      font-size: 1.6rem;
    }
}
</style>
