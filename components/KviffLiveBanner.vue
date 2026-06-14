<template>
  <nuxt-link
    to="/festival/kviff-2026"
    class="kviff-banner"
    role="banner"
    aria-label="KVIFF 2026 — explore the coverage"
  >
    <!-- Background: cinemagoria-dark with subtle radial glows. Mirrors
         TribecaLiveBanner so all festival banners share the same visual
         language. -->
    <svg
      class="kviff-banner__bg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kviff-bg-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#000000" />
          <stop offset="50%"  stop-color="#060c0f" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
      </defs>
      <rect width="1200" height="80" fill="url(#kviff-bg-grad)" />
    </svg>

    <!-- Pattern: banner-specific asset at kviff-banner-pattern.png.
         Currently a copy of the Tribeca texture as placeholder — replace
         the PNG in place when the final KVIFF banner pattern is ready. -->
    <div class="kviff-banner__pattern" aria-hidden="true" />
    <div class="kviff-banner__shimmer" aria-hidden="true" />

    <div class="kviff-banner__inner">
      <!-- KVIFF 2026 banner logo: dedicated file separate from the
           festival-page logo so the banner artwork can diverge. The SVG
           wraps a bitmap, so `fill` won't recolor it — the existing
           sizing + drop-shadow glow still apply through CSS. -->
      <img
        class="kviff-banner__logo"
        src="/festivals/kviff/kviff-banner-logo.svg"
        alt=""
        aria-hidden="true"
      />

      <div class="kviff-banner__info">
        <div class="kviff-banner__pill">
          <span class="kviff-banner__pill-dot" aria-hidden="true" />
          60<sup class="kviff-banner__pill-sup">TH</sup> EDITION · JULY 3–11 · 2026
        </div>
        <div class="kviff-banner__tagline" aria-hidden="true">
          Coverage expands as KVIFF progressively confirms its lineup —
          <span class="kviff-banner__tagline-accent">explore the announced titles</span>
        </div>
      </div>

      <span class="kviff-banner__cta" aria-label="Open KVIFF coverage">
        Explore
      </span>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'KviffLiveBanner',
};
</script>

<style scoped>
.kviff-banner {
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

.kviff-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px -10px rgba(139, 233, 253, 0.25);
}

.kviff-banner__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.kviff-banner__pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url('/festivals/kviff/kviff-banner-pattern.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.22;
  mix-blend-mode: screen;
  pointer-events: none;
}

.kviff-banner__shimmer {
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
  animation: kviff-shimmer-sweep 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes kviff-shimmer-sweep {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}

.kviff-banner__inner {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 20px 0 18px;
  gap: 18px;
}

.kviff-banner__logo {
  height: 52px;
  width: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
          drop-shadow(0 0 14px rgba(139, 233, 253, 0.20));
  animation: kviff-logo-glow 4.5s ease-in-out infinite;
}

@keyframes kviff-logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.22))
            drop-shadow(0 0 12px rgba(139, 233, 253, 0.18));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))
            drop-shadow(0 0 18px rgba(139, 233, 253, 0.35));
  }
}

.kviff-banner__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 18px;
  border-left: 1px solid rgba(139, 233, 253, 0.18);
}

.kviff-banner__pill {
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

.kviff-banner__pill-sup {
  font-size: 7px;
  font-weight: 700;
  margin: 0 1px 0 0;
  vertical-align: super;
}

.kviff-banner__pill-dot {
  width: 6px;
  height: 6px;
  background-color: #8BE9FD;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.7);
  animation: kviff-pill-pulse 1.8s ease-in-out infinite;
}

@keyframes kviff-pill-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

.kviff-banner__tagline {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kviff-banner__tagline-accent {
  color: #8BE9FD;
  font-weight: 600;
}

.kviff-banner__cta {
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

.kviff-banner:hover .kviff-banner__cta {
  background: rgba(139, 233, 253, 0.08);
  color: #A2EDFD;
  box-shadow: 0 0 16px rgba(139, 233, 253, 0.30);
}

@media (max-width: 768px) {
  .kviff-banner__inner {
    height: auto;
    min-height: 64px;
    padding: 10px 14px;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .kviff-banner__info {
    border-left: none;
    padding-left: 0;
  }

  .kviff-banner__tagline {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    white-space: normal;
    font-size: 11.5px;
  }

  .kviff-banner__cta {
    margin-left: auto;
    font-size: 11px;
    padding: 6px 14px;
  }

  .kviff-banner__logo {
    height: 64px;
  }
}

@media (max-width: 480px) {
  .kviff-banner__tagline {
    display: none;
  }

  .kviff-banner__logo {
    height: 56px;
  }
}
</style>
