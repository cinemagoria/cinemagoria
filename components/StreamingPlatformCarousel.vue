<template>
  <div class="listing listing--carousel">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">Popular Streaming Services</h2>
      <NuxtLink
        v-if="viewAllLink"
        :to="viewAllLink"
        class="explore-all">Explore All</NuxtLink>
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
        <div
          v-for="platform in items"
          :key="`sp-${platform.id}`"
          class="card">
          <NuxtLink
            :to="`/streaming/${platform.slug}`"
            class="sp-card">
            <div class="sp-logo">
              <img
                v-if="getLogoUrl(platform)"
                :src="getLogoUrl(platform)"
                :alt="platform.name"
                :class="['sp-logo__img', { 'sp-logo__img--large': platform.id === 11 || platform.id === 99 }]"
                loading="lazy">
              <span v-else class="sp-name">{{ platform.name }}</span>
            </div>
          </NuxtLink>
        </div>
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
import { apiImgUrl } from '~/utils/api';
import { STREAMING_CUSTOM_LOGOS } from '~/utils/constants';

const AUTOPLAY_INTERVAL = 10000;

export default {
  name: 'StreamingPlatformCarousel',

  mixins: [carousel],

  props: {
    items: {
      type: Array,
      required: true,
    },
    viewAllLink: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      apiImgUrl,
      autoplayInterval: null,
      customLogos: STREAMING_CUSTOM_LOGOS,
    };
  },

  mounted () {
    this.$nextTick(() => {
      if (this.items && this.items.length > 0) {
        this.calculateState(this.items.length);
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
    getLogoUrl (platform) {
      const customLogo = this.customLogos[platform.id];
      if (customLogo) return customLogo;
      return platform.logo_path ? `${apiImgUrl}/w500${platform.logo_path}` : null;
    },
    resizeEvent () {
      if (this.items) {
        this.calculateState(this.items.length);
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

.listing {
  margin-bottom: 2.5rem;
}

/* Modern Explore All button styles are centralized in
   assets/css/components/_listing.scss (.listing__explore, .explore-all). */

/* Stretch the gradient arrow panels to cover the full carousel height. */
.carousel {
  position: relative;

  :deep(.carousel__nav) {
    top: 0;
    bottom: 0;
  }

  :deep(.carousel__nav--left),
  :deep(.carousel__nav--right) {
    bottom: 0;
    margin-bottom: 0;
  }
}

:deep(.carousel__items) {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 20px;
  padding: 8px 0 18px;
}

:deep(.carousel__items .card) {
  flex: 0 0 auto;
  width: 170px;
  padding: 0 !important;
  scroll-snap-align: start;
}

.sp-card {
  position: relative;
  display: block;
  width: 170px;
  height: 95px;
  border-radius: 12px;
  overflow: hidden;
  background: #333;
  text-decoration: none;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(3, 36, 44, 0.85), rgba(31, 84, 103, 0.7), transparent);
    opacity: 0.9;
    z-index: 3;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
}

.sp-logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: var(--logo-surface);
}

.sp-logo__img {
  max-width: 120px;
  max-height: 60px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: brightness(0);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &--large {
    max-width: 220px;
    max-height: 110px;
  }
}

.sp-name {
  color: #03242C;
  font-weight: 700;
  font-family: var(--font-display);
  font-size: 1rem;
  text-align: center;
}

@media (hover: hover) and (pointer: fine) {
  .sp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 34px -14px rgba(139, 233, 253, 0.6);
    filter: brightness(1.06) saturate(1.08);
  }

  .sp-card:hover::before { opacity: 1; }

  .sp-card:hover .sp-logo__img { transform: scale(1.06); }
}
</style>
