<template>
  <div class="listing listing--carousel">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">
        Plataformas Streaming Populares
        <NuxtLink 
          v-if="viewAllLink" 
          :to="viewAllLink" 
          class="explore-all"
        >Explorar Todo</NuxtLink>
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
        
        
        <NuxtLink
          v-for="platform in items"
          :key="platform.id"
          :to="`/streaming/${platform.slug}`"
          class="production-company-card"
        >
          <div class="logo-container">
            <img 
              v-if="getLogoUrl(platform)" 
              :src="getLogoUrl(platform)" 
              :alt="platform.name" 
              :class="['company-logo', { 'company-logo--large': platform.id === 11 || platform.id === 99 }]"
              loading="lazy"
            >
            <span v-else class="company-name">{{ platform.name }}</span>
          </div>
        </NuxtLink>

        <div class="production-company-card explore-card" v-if="viewAllLink">
             <nuxt-link :to="viewAllLink" class="company-link">
               <div class="logo-container explore-container">
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
    },
    viewAllLink: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      apiImgUrl,
      customLogos: {
        11: '/logos/streaming/mubi-logo.svg',
        15: '/logos/streaming/hulu-logo.svg',
        350: '/logos/streaming/apple-tv-logo.svg',
        8: '/logos/streaming/netflix-logo.png',
        9: '/logos/streaming/amazon-prime-video-logo.png',
        1899: '/logos/streaming/hbo-max-logo.svg',
        337: '/logos/streaming/disney-logo.png',
        386: '/logos/streaming/peacock-logo.png',
        99: '/logos/streaming/shudder-logo.svg'
      }
    };
  },
  computed: {
    totalItems() {
      return this.items.length + (this.viewAllLink ? 1 : 0);
    }
  },
  mounted() {
    this.calculateState(this.totalItems);
  },
  methods: {
    resizeEvent() {
      this.calculateState(this.totalItems);
    },
    getLogoUrl(platform) {
      const customLogo = this.customLogos[platform.id];
      if (customLogo) {
        return customLogo;
      }
      return platform.logo_path ? `${apiImgUrl}/w500${platform.logo_path}` : null;
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
  display: block;
  width: 180px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  background: #333;
  margin-right: 20px;
  scroll-snap-align: start;
  text-decoration: none;
  
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

.logo-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #8BE9FD;
}

.company-logo {
  max-width: 120px;
  max-height: 60px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: brightness(0);
  
  &--large {
    max-width: 220px;
    max-height: 110px;
  }
}

.company-name {
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
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
    font-size: 1.1rem;
    background: transparent;
    @media (min-width: $breakpoint-large) {
      font-size: 1.3rem;
    }
}
</style>