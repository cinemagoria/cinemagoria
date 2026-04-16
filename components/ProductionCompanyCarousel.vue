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

    <div class="carousel" @mouseenter="pauseAutoScroll" @mouseleave="resumeAutoScroll" @touchstart="pauseAutoScroll" @touchend="resumeAutoScroll">
      <button
        class="carousel__nav carousel__nav--left"
        aria-label="Previous"
        type="button"
        @click="moveToClickEvent('left')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div
        ref="carouselElement"
        class="carousel__items carousel__items--continuous"
        @scroll="scrollEvent">
        
        <div v-for="gi in duplicationCount" :key="'group-' + gi" class="carousel__group" :aria-hidden="gi !== 1 ? 'true' : null">
          <div
            v-for="company in items"
            :key="gi + '-' + company.id"
            class="production-company-card"
          >
            <nuxt-link
              :to="`/production/${company.slug}`"
              class="company-link"
            >
              <div class="logo-container">
                <img
                  v-if="company.logo_path"
                  :src="`${apiImgUrl}/w500${company.logo_path}`"
                  :alt="company.name"
                  class="company-logo"
                  loading="lazy"
                />
                <span v-else class="company-name">{{ company.name }}</span>
              </div>
            </nuxt-link>
          </div>
        </div>

      </div>

      <button
        class="carousel__nav carousel__nav--right"
        aria-label="Next"
        type="button"
        @click="moveToClickEvent('right')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import ContinuousCarousel from '~/mixins/ContinuousCarousel';
import { apiImgUrl } from '~/utils/api';

export default {
  mixins: [ContinuousCarousel],
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
  data() {
    return {
      autoScrollSpeed: 0.8,
      apiImgUrl,
    };
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
  mask-image: linear-gradient(
    to right,
    transparent 0,
    black 4%,
    black 96%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    black 4%,
    black 96%,
    transparent 100%
  );
  
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
    
    &:hover {
        background: rgba(0,0,0,0.8);
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
    padding-bottom: 20px;
    
    scrollbar-width: none; 
    -ms-overflow-style: none;
    &::-webkit-scrollbar { 
      display: none; 
    }
  }

  &__group {
    display: flex;
    flex-shrink: 0;
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

  &:hover {
    transform: scale(1.03);
  }

  &:first-child {
    margin-left: 0 !important;
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
</style>
