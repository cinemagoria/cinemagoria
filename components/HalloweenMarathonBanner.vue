<template>
  <nuxt-link
    v-if="active"
    to="/halloween"
    class="hw-banner"
    :aria-label="`${data.event.title_es} — ${data.total} películas de terror, abrir la maratón`">
    <div class="hw-banner__pattern" aria-hidden="true" />
    <div class="hw-banner__veil" aria-hidden="true" />
    <div class="hw-banner__shimmer" aria-hidden="true" />

    <div class="hw-banner__inner">
      <div class="hw-banner__info">
        <span class="hw-banner__pill">
          <span class="hw-banner__dot" aria-hidden="true" />
          {{ data.event.title_es }}<span class="hw-banner__date">&nbsp;· hasta el {{ lastDay }}</span>
        </span>
        <p class="hw-banner__tagline">
          {{ data.total }} películas de terror — J-Horror, giallo, slashers, horror cósmico y los clásicos.
          <span class="hw-banner__accent">Elegí tu miedo.</span>
        </p>
      </div>

      <span class="hw-banner__cta" aria-hidden="true">
        Empezar la maratón
      </span>
    </div>
  </nuxt-link>
  <slot v-else-if="!pending" />
</template>

<script setup>
import { computed } from 'vue';
import { useHalloweenMarathon } from '~/composables/useHalloweenMarathon';

const { data, pending, active } = useHalloweenMarathon();

const lastDay = computed(() => new Date(Date.parse(data.value.event.ends_at) - 1)
  .toLocaleDateString('es-AR', { day: 'numeric', month: 'short', timeZone: 'UTC' }));
</script>

<style scoped>
.hw-banner {
  --hw-tile-w: 800px;
  --hw-tile-h: 88px;
  position: relative;
  display: block;
  width: 100%;
  margin-top: 16px;
  border: 1px solid transparent;
  border-radius: 15px;
  background:
    linear-gradient(#000, #000) padding-box,
    linear-gradient(to right, #1E5164, #8AE8FC) border-box;
  overflow: hidden;
  isolation: isolate;
  z-index: 10;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.hw-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(139, 233, 253, 0.16);
}

.hw-banner:focus-visible {
  outline: 2px solid #8BE9FD;
  outline-offset: 2px;
}

.hw-banner__pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + var(--hw-tile-w));
  height: 100%;
  background: url('/seasonal/halloween/halloween_pattern_skulls_live_banner.webp') repeat-x left center / var(--hw-tile-w) var(--hw-tile-h);
  opacity: 0.5;
  z-index: 1;
  pointer-events: none;
  animation: hw-drift 42s linear infinite;
  will-change: transform;
}

.hw-banner__veil {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(70% 160% at 0% 50%, rgba(139, 233, 253, 0.16), transparent 60%),
    linear-gradient(90deg, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.84) 40%, rgba(0, 0, 0, 0.42) 72%, rgba(0, 0, 0, 0.7) 100%);
}

.hw-banner__shimmer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 35%, rgba(139, 233, 253, 0.14) 48%, rgba(255, 255, 255, 0.08) 50%, transparent 62%);
  background-size: 250% 100%;
  animation: hw-shimmer 7s ease-in-out infinite;
}

.hw-banner__inner {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  height: 72px;
  padding: 0 20px 0 22px;
}

.hw-banner__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
}

.hw-banner__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 2px 10px 2px 8px;
  border: 1px solid rgba(139, 233, 253, 0.35);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  color: #8BE9FD;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.hw-banner__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #8BE9FD;
  box-shadow: 0 0 0 0 rgba(139, 233, 253, 0.6);
  animation: hw-pulse 1.8s ease-out infinite;
}

.hw-banner__tagline {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.72);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.hw-banner__accent {
  color: #8BE9FD;
  font-weight: 600;
}

.hw-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 8px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #8BE9FD 0%, #4FC3DC 100%);
  color: #041019;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  white-space: nowrap;
  animation: hw-glow 2.6s ease-in-out infinite;
  transition: transform 0.25s ease;
}

.hw-banner:hover .hw-banner__cta {
  transform: scale(1.04);
}

@keyframes hw-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(calc(-1 * var(--hw-tile-w)), 0, 0); }
}

@keyframes hw-shimmer {
  0%, 15% { background-position: 120% 0; }
  65%, 100% { background-position: -20% 0; }
}

@keyframes hw-pulse {
  0% { box-shadow: 0 0 0 0 rgba(139, 233, 253, 0.6); }
  70%, 100% { box-shadow: 0 0 0 7px rgba(139, 233, 253, 0); }
}

@keyframes hw-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139, 233, 253, 0.0), 0 0 14px rgba(139, 233, 253, 0.25); }
  50% { box-shadow: 0 0 0 4px rgba(139, 233, 253, 0.12), 0 0 24px rgba(139, 233, 253, 0.45); }
}

@media (max-width: 768px) {
  .hw-banner__inner {
    gap: 12px;
    height: auto;
    min-height: 64px;
    padding: 10px 12px 10px 14px;
  }

  .hw-banner__pill {
    font-size: 9px;
    letter-spacing: 0.9px;
  }

  .hw-banner__tagline {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 11px;
    white-space: normal;
  }

  .hw-banner__cta {
    padding: 7px 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .hw-banner__date {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hw-banner__pattern,
  .hw-banner__shimmer,
  .hw-banner__dot,
  .hw-banner__cta {
    animation: none;
  }
}
</style>
