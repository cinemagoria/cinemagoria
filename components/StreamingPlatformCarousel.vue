<template>
  <div class="listing listing--infinite">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">
        Plataformas Streaming Populares
        <NuxtLink
          v-if="viewAllLink"
          :to="viewAllLink"
          class="explore-all">Explorar Todo</NuxtLink>
      </h2>
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
          <NuxtLink
            v-for="(platform, i) in duplicated"
            :key="`sp-${i}-${platform.id}`"
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
import { apiImgUrl } from '~/utils/api';

export default {
  mixins: [infiniteScroll],

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
      infiniteDuration: 69,
      customLogos: {
        11: '/logos/streaming/mubi-logo.svg',
        15: '/logos/streaming/hulu-logo.svg',
        350: '/logos/streaming/apple-tv-logo.svg',
        8: '/logos/streaming/netflix-logo.png',
        9: '/logos/streaming/amazon-prime-video-logo.png',
        1899: '/logos/streaming/hbo-max-logo.svg',
        337: '/logos/streaming/disney-logo.png',
        386: '/logos/streaming/peacock-logo.png',
        99: '/logos/streaming/shudder-logo.svg',
      },
    };
  },
  computed: {
    duplicated () {
      return [...this.items, ...this.items];
    },
  },
  methods: {
    getLogoUrl (platform) {
      const customLogo = this.customLogos[platform.id];
      if (customLogo) return customLogo;
      return platform.logo_path ? `${apiImgUrl}/w500${platform.logo_path}` : null;
    },
  },
};
</script>

<style scoped lang="scss">
@use '~/assets/css/utilities/variables' as *;

.listing {
  margin-bottom: 2.5rem;
}

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

.listing__title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.explore-all {
  font-size: 1.1rem;
  color: #8BE9FD;
  text-decoration: none;
  font-weight: 500;
  margin-left: 1rem;

  &:hover {
    text-decoration: underline;
    color: #A2EDFD;
  }
}

.inf__viewport {
  overflow: hidden;
  padding: 8px 0 18px;
  touch-action: pan-y;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 80px,
    #000 calc(100% - 80px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 80px,
    #000 calc(100% - 80px),
    transparent 100%
  );
}

.inf__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  gap: 20px;
  animation: inf-scroll-sp 69s linear infinite;
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

@keyframes inf-scroll-sp {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

.sp-card {
  display: block;
  flex: 0 0 auto;
  width: 170px;
  height: 95px;
  border-radius: 12px;
  overflow: hidden;
  background: #333;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.sp-logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #8BE9FD;
}

.sp-logo__img {
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

.sp-name {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .inf__track {
    animation: none;
  }
}
</style>
