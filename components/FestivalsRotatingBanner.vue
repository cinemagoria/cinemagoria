<template>
  <nuxt-link
    v-if="activeFestival"
    :to="activeFestival.to"
    class="fest-banner"
    :class="{ 'fest-banner--paused': isPaused }"
    role="banner"
    :aria-label="`${activeFestival.label} — explorá la cobertura`"
  >
    <svg
      class="fest-banner__bg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fest-banner-bg-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#000000" />
          <stop offset="50%"  stop-color="#060c0f" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
      </defs>
      <rect width="1200" height="80" fill="url(#fest-banner-bg-grad)" />
    </svg>

    <div class="fest-banner__shimmer" aria-hidden="true" />

    <div
      v-for="(festival, index) in visibleFestivals"
      :key="festival.key"
      class="fest-banner__slide"
      :class="{ 'fest-banner__slide--active': index === activeIndex }"
      :aria-hidden="index === activeIndex ? 'false' : 'true'"
    >
      <div
        class="fest-banner__pattern"
        :style="{ backgroundImage: `url('${festival.pattern}')` }"
        aria-hidden="true"
      />

      <div class="fest-banner__inner">
        <img
          class="fest-banner__logo"
          :class="{ 'fest-banner__logo--invert': festival.invertLogo }"
          :src="festival.logo"
          alt=""
          aria-hidden="true"
        />

        <div class="fest-banner__info">
          <div class="fest-banner__pill">
            <span class="fest-banner__pill-dot" aria-hidden="true" />
            <span class="fest-banner__pill-text">
              <span class="fest-banner__pill-edition">
                {{ festival.edition }}<sup v-if="festival.editionSuffix" class="fest-banner__pill-sup">{{ festival.editionSuffix }}</sup> EDICIÓN
              </span>
              <span class="fest-banner__pill-sep" aria-hidden="true"> · </span>
              <span class="fest-banner__pill-dates">{{ festival.dates }}</span>
            </span>
          </div>
          <div class="fest-banner__tagline" aria-hidden="true">
            {{ festival.tagline }}
            <span class="fest-banner__tagline-accent">descubrí la cobertura completa</span>
          </div>
        </div>

        <span class="fest-banner__cta" aria-hidden="true">
          Explorar
        </span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
const BANNER_START = new Date('2026-07-30T00:00:00Z');

const FESTIVALS = [
  {
    key: 'frightfest',
    to: '/festival/frightfest-2026',
    label: 'FrightFest 2026',
    logo: '/festivals/frightfest/friightfest_logo_for_banner_2026.png',
    pattern: '/festivals/frightfest/frightfest-banner-pattern.png',
    invertLogo: true,
    edition: '27ª',
    editionSuffix: '',
    dates: '27 – 31 AGOSTO · 2026',
    tagline: 'Estrenos de terror, cinco pantallas y programación diaria —',
    end: new Date('2026-08-31T23:00:00Z'),
  },
  {
    key: 'tiff',
    to: '/festival/tiff-2026',
    label: 'Festival Internacional de Cine de Toronto 2026',
    logo: '/festivals/tiff/tiff_logo_for_banner_2026.png',
    pattern: '/festivals/tiff/tiff-banner-pattern.png',
    invertLogo: true,
    edition: '51ª',
    editionSuffix: '',
    dates: '10 – 20 SEPTIEMBRE · 2026',
    tagline: 'Estrenos mundiales, temporada de premios y programación diaria —',
    end: new Date('2026-09-21T04:00:00Z'),
  },
  {
    key: 'venice',
    to: '/festival/venice-2026',
    label: 'Festival de Venecia 2026',
    logo: '/festivals/venice/venice_logo_for_banner_2026.png',
    pattern: '/festivals/venice/venice-banner-pattern.png',
    invertLogo: false,
    edition: '83ª',
    editionSuffix: '',
    dates: '2 – 12 SEPTIEMBRE · 2026',
    tagline: 'Carrera por el León de Oro, secciones paralelas y programación diaria —',
    end: new Date('2026-09-22T22:00:00Z'),
  },
];

export default {
  name: 'FestivalsRotatingBanner',
  data() {
    return {
      rotationIndex: 0,
      isPaused: false,
      visibleFestivals: [],
    };
  },
  computed: {
    activeIndex() {
      if (!this.visibleFestivals.length) return 0;
      return this.rotationIndex % this.visibleFestivals.length;
    },
    activeFestival() {
      return this.visibleFestivals[this.activeIndex] || null;
    },
  },
  created() {
    const now = new Date();
    if (now < BANNER_START) {
      this.visibleFestivals = [];
      return;
    }
    this.visibleFestivals = FESTIVALS.filter(festival => now < festival.end);
  },
  mounted() {
    this.$bus.$on('hero-advance', this.handleHeroAdvance);
    this.$bus.$on('hero-autoadvance-paused', this.handleHeroPauseState);
  },
  beforeUnmount() {
    this.$bus.$off('hero-advance', this.handleHeroAdvance);
    this.$bus.$off('hero-autoadvance-paused', this.handleHeroPauseState);
  },
  beforeDestroy() {
    this.$bus.$off('hero-advance', this.handleHeroAdvance);
    this.$bus.$off('hero-autoadvance-paused', this.handleHeroPauseState);
  },
  methods: {
    handleHeroAdvance() {
      if (this.visibleFestivals.length <= 1) return;
      this.rotationIndex = (this.rotationIndex + 1) % this.visibleFestivals.length;
    },
    handleHeroPauseState(paused) {
      this.isPaused = Boolean(paused);
    },
  },
};
</script>

<style scoped>
.fest-banner {
  position: relative;
  display: block;
  width: 100%;
  border-radius: 15px;
  border: 1px solid transparent;
  background:
    linear-gradient(#000, #000) padding-box,
    linear-gradient(to right, #1E5164, #8AE8FC) border-box;
  overflow: hidden;
  z-index: 10;
  margin-top: 16px;
  text-decoration: none;
  isolation: isolate;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.fest-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px -10px rgba(139, 233, 253, 0.25);
}

.fest-banner__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.fest-banner__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.65s ease;
}

.fest-banner__slide--active {
  position: relative;
  opacity: 1;
}

.fest-banner__pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.1;
  mix-blend-mode: screen;
  pointer-events: none;
}

.fest-banner__shimmer {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(139, 233, 253, 0.07) 50%,
    transparent 65%
  );
  background-size: 220% 100%;
  animation: fest-banner-shimmer-sweep 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes fest-banner-shimmer-sweep {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}

.fest-banner__inner {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 20px 0 18px;
  gap: 18px;
}

.fest-banner__logo {
  height: 52px;
  width: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
          drop-shadow(0 0 14px rgba(139, 233, 253, 0.20));
  animation: fest-banner-logo-glow 4.5s ease-in-out infinite;
}

.fest-banner__logo--invert {
  filter: invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
          drop-shadow(0 0 14px rgba(139, 233, 253, 0.20));
  animation: fest-banner-logo-glow-invert 4.5s ease-in-out infinite;
}

@keyframes fest-banner-logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.22))
            drop-shadow(0 0 12px rgba(139, 233, 253, 0.18));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))
            drop-shadow(0 0 18px rgba(139, 233, 253, 0.35));
  }
}

@keyframes fest-banner-logo-glow-invert {
  0%, 100% {
    filter: invert(1) drop-shadow(0 0 6px rgba(255, 255, 255, 0.22))
            drop-shadow(0 0 12px rgba(139, 233, 253, 0.18));
  }
  50% {
    filter: invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))
            drop-shadow(0 0 18px rgba(139, 233, 253, 0.35));
  }
}

.fest-banner__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 18px;
  border-left: 1px solid rgba(139, 233, 253, 0.18);
}

.fest-banner__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1.8px;
  padding: 2px 10px 2px 7px;
  border-radius: 20px;
  text-transform: uppercase;
}

.fest-banner__pill-text {
  min-width: 0;
}

.fest-banner__pill-edition {
  white-space: nowrap;
}

.fest-banner__pill-sup {
  font-size: 0.62em;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0;
  vertical-align: baseline;
  position: relative;
  top: -0.45em;
}

.fest-banner__pill-dot {
  width: 6px;
  height: 6px;
  background-color: #8BE9FD;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.7);
  animation: fest-banner-pill-pulse 1.8s ease-in-out infinite;
}

@keyframes fest-banner-pill-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

.fest-banner__tagline {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fest-banner__tagline-accent {
  color: #8BE9FD;
  font-weight: 600;
}

.fest-banner__cta {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #8BE9FD;
  color: #8BE9FD;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  padding: 7px 18px;
  white-space: nowrap;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.fest-banner:hover .fest-banner__cta {
  background: rgba(139, 233, 253, 0.08);
  color: #A2EDFD;
  box-shadow: 0 0 16px rgba(139, 233, 253, 0.30);
}

.fest-banner--paused .fest-banner__shimmer,
.fest-banner--paused .fest-banner__logo,
.fest-banner--paused .fest-banner__pill-dot {
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .fest-banner__inner {
    height: auto;
    min-height: 64px;
    padding: 10px 14px;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .fest-banner__info {
    border-left: none;
    padding-left: 0;
  }

  .fest-banner__tagline {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    white-space: normal;
    font-size: 11.5px;
  }

  .fest-banner__cta {
    margin-left: auto;
    font-size: 11px;
    padding: 6px 14px;
  }

  .fest-banner__logo {
    height: 46px;
  }
}

@media (max-width: 480px) {
  .fest-banner__tagline {
    display: none;
  }

  .fest-banner__logo {
    height: 42px;
  }

  .fest-banner__inner {
    padding: 10px 12px;
    gap: 8px 10px;
  }

  .fest-banner__pill {
    align-items: flex-start;
    gap: 7px;
    padding: 4px 10px 4px 8px;
    font-size: 10px;
    letter-spacing: 0.3px;
    line-height: 1.45;
  }

  .fest-banner__pill-dot {
    margin-top: 4px;
  }

  .fest-banner__pill-text {
    display: flex;
    flex-direction: column;
  }

  .fest-banner__pill-sep {
    display: none;
  }

  .fest-banner__cta {
    padding: 6px 12px;
  }
}

@media (max-width: 400px) {
  .fest-banner__logo {
    height: 38px;
  }

  .fest-banner__pill {
    font-size: 9.5px;
    letter-spacing: 0.2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fest-banner__slide {
    transition: none;
  }

  .fest-banner__shimmer,
  .fest-banner__logo,
  .fest-banner__pill-dot {
    animation: none;
  }
}
</style>
