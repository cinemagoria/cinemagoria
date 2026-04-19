<template>
  <div class="listing listing--infinite">
    <div
      v-if="items && items.length"
      class="listing__head">
      <h2 class="listing__title">
        Productoras Populares
      </h2>

      <nuxt-link
        v-if="viewAllLink"
        :to="viewAllLink"
        class="listing__explore">
        <strong class="strong">Explorar Todo</strong>
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
          <div
            v-for="(company, i) in duplicated"
            :key="`pc-${i}-${company.id}`"
            class="pc-card">
            <nuxt-link
              :to="`/production/${company.slug}`"
              class="pc-link">
              <div class="pc-logo">
                <img
                  v-if="company.logo_path"
                  :src="`${apiImgUrl}/w500${company.logo_path}`"
                  :alt="company.name"
                  class="pc-logo__img"
                  loading="lazy">
                <span v-else class="pc-name">{{ company.name }}</span>
              </div>
            </nuxt-link>
          </div>
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
    };
  },
  computed: {
    duplicated () {
      return [...this.items, ...this.items];
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

.strong {
  color: #8BE9FD;
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
  animation: inf-scroll-pc 69s linear infinite;
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

@keyframes inf-scroll-pc {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

.pc-card {
  flex: 0 0 auto;
  width: 230px;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
  background: #8BE9FD;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
}

.pc-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.pc-logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.pc-logo__img {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  filter: brightness(0);
}

.pc-name {
  color: #000;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .inf__track {
    animation: none;
  }
}
</style>
