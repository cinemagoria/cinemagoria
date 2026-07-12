<template>
  <nuxt-link
    to="/festival/fantasia-2026"
    class="fantasia-banner"
    role="banner"
    aria-label="Fantasia 2026 — explorá la cobertura"
  >
    <svg
      class="fantasia-banner__bg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fantasia-bg-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#000000" />
          <stop offset="50%"  stop-color="#060c0f" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
      </defs>
      <rect width="1200" height="80" fill="url(#fantasia-bg-grad)" />
    </svg>

    <div class="fantasia-banner__pattern" aria-hidden="true" />
    <div class="fantasia-banner__shimmer" aria-hidden="true" />

    <div class="fantasia-banner__inner">
      <img
        class="fantasia-banner__logo"
        src="/festivals/fantasia/fantasia_film_festival_2026_logo.png"
        alt=""
        aria-hidden="true"
      />

      <div class="fantasia-banner__info">
        <div class="fantasia-banner__pill">
          <span class="fantasia-banner__pill-dot" aria-hidden="true" />
          30<sup class="fantasia-banner__pill-sup">ª</sup> EDICIÓN · 16 JULIO – 2 AGOSTO · 2026
        </div>
        <div class="fantasia-banner__tagline" aria-hidden="true">
          Cine de género, premieres mundiales y programación diaria —
          <span class="fantasia-banner__tagline-accent">descubrí la cobertura completa</span>
        </div>
      </div>

      <span class="fantasia-banner__cta" aria-label="Abrir cobertura de Fantasia">
        Explorar
      </span>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'FantasiaLiveBanner',
};
</script>

<style scoped>
.fantasia-banner {
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

.fantasia-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px -10px rgba(139, 233, 253, 0.25);
}

.fantasia-banner__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.fantasia-banner__pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url('/festivals/fantasia/fantasia-banner-pattern.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.1;
  mix-blend-mode: screen;
  pointer-events: none;
}

.fantasia-banner__shimmer {
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
  animation: fantasia-shimmer-sweep 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes fantasia-shimmer-sweep {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}

.fantasia-banner__inner {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 20px 0 18px;
  gap: 18px;
}

.fantasia-banner__logo {
  height: 52px;
  width: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
          drop-shadow(0 0 14px rgba(139, 233, 253, 0.20));
  animation: fantasia-logo-glow 4.5s ease-in-out infinite;
}

@keyframes fantasia-logo-glow {
  0%, 100% {
    filter: invert(1) drop-shadow(0 0 6px rgba(255, 255, 255, 0.22))
            drop-shadow(0 0 12px rgba(139, 233, 253, 0.18));
  }
  50% {
    filter: invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))
            drop-shadow(0 0 18px rgba(139, 233, 253, 0.35));
  }
}

.fantasia-banner__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 18px;
  border-left: 1px solid rgba(139, 233, 253, 0.18);
}

.fantasia-banner__pill {
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

.fantasia-banner__pill-sup {
  font-size: 7px;
  font-weight: 700;
  margin: 0 1px 0 0;
  vertical-align: super;
}

.fantasia-banner__pill-dot {
  width: 6px;
  height: 6px;
  background-color: #8BE9FD;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.7);
  animation: fantasia-pill-pulse 1.8s ease-in-out infinite;
}

@keyframes fantasia-pill-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

.fantasia-banner__tagline {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fantasia-banner__tagline-accent {
  color: #8BE9FD;
  font-weight: 600;
}

.fantasia-banner__cta {
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

.fantasia-banner:hover .fantasia-banner__cta {
  background: rgba(139, 233, 253, 0.08);
  color: #A2EDFD;
  box-shadow: 0 0 16px rgba(139, 233, 253, 0.30);
}

@media (max-width: 768px) {
  .fantasia-banner__inner {
    height: auto;
    min-height: 64px;
    padding: 10px 14px;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .fantasia-banner__info {
    border-left: none;
    padding-left: 0;
  }

  .fantasia-banner__tagline {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    white-space: normal;
    font-size: 11.5px;
  }

  .fantasia-banner__cta {
    margin-left: auto;
    font-size: 11px;
    padding: 6px 14px;
  }

  .fantasia-banner__logo {
    height: 64px;
  }
}

@media (max-width: 480px) {
  .fantasia-banner__tagline {
    display: none;
  }

  .fantasia-banner__logo {
    height: 56px;
  }
}
</style>
