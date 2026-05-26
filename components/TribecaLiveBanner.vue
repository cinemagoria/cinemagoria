<template>
  <nuxt-link
    to="/festival/tribeca-2026"
    class="tribeca-banner"
    role="banner"
    aria-label="Tribeca 2026 — explorá la cobertura"
  >
    <!-- Fondo: cinemagoria-dark con glows sutiles. Refleja a CannesLiveBanner
         para que ambos banners compartan el mismo lenguaje visual. -->
    <svg
      class="tribeca-banner__bg"
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tribeca-bg-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#000000" />
          <stop offset="50%"  stop-color="#060c0f" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
      </defs>
      <rect width="1200" height="80" fill="url(#tribeca-bg-grad)" />
    </svg>

    <!-- Patrón: reutiliza la textura de Cannes como placeholder hasta tener
         un pattern propio de Tribeca. Reemplazar el background-image en
         .tribeca-banner__pattern cuando esté listo. -->
    <div class="tribeca-banner__pattern" aria-hidden="true" />
    <div class="tribeca-banner__shimmer" aria-hidden="true" />

    <div class="tribeca-banner__inner">
      <!-- Wordmark oficial del Tribeca Festival (Wikimedia Commons), embebido
           como SVG para pintarlo blanco vía el fill del padre — replica cómo
           se entrega el logo del banner de Cannes. -->
      <svg
        class="tribeca-banner__logo"
        viewBox="0 0 300 175.5618"
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffffff"
        aria-hidden="true"
      >
        <g transform="translate(-225,-444.58128)">
          <path d="m 361.32421,620.14308 7.64158,0 0,-175.5618 -7.64158,0 L 361.32502,620.14308 z m 118.77085,-33.78512 -16.89661,0 0,-27.10836 -7.4551,0 0,33.88647 24.35171,0 L 480.09587,586.35796 z m -48.24939,-18.39249 4.50387,10.98604 -9.00369,0 L 431.84648,567.96547 z m 7.16728,17.57361 3.09717,7.59699 7.79563,0 -14.52509,-34.1297 -6.8754,0 -14.52103,34.1297 7.59699,0 3.10123,-7.59699 L 439.01376,585.53908 z m -38.26467,7.83617 13.66161,-34.12565 -7.99832,0 -8.85775,23.86525 -8.85775,-23.86525 -8.2294,0 13.69809,34.12565 L 400.74909,593.37525 z m -78.39817,-27.25025 10.30904,0 0,27.01107 7.45511,0 0,-27.01107 10.31309,0 0,-6.8754 -28.07724,0 L 322.35092,566.125 z m -15.60747,6.7254 c -5.85787,-1.49993 -7.30917,-2.22558 -7.30917,-4.45117 l 0,-0.0973 c 0,-1.64588 1.49994,-2.95529 4.35793,-2.95529 2.85394,0 5.80923,1.26076 8.80911,3.34041 l 3.87146,-5.61058 c -3.4377,-2.7607 -7.64969,-4.31334 -12.58733,-4.31334 -6.91999,0 -11.86168,4.0701 -11.86168,10.2158 l 0,0.0973 c 0,6.72946 4.41063,8.61857 11.23738,10.36174 5.65923,1.4513 6.8227,2.42018 6.8227,4.30524 l 0,0.10118 c 0,1.98235 -1.84046,3.19447 -4.88899,3.19447 -3.87552,0 -7.06593,-1.60129 -10.11851,-4.1147 l -4.40252,5.27411 c 4.062,3.62823 9.24287,5.4241 14.37509,5.4241 7.30916,0 12.44139,-3.77822 12.44139,-10.50768 l 0,-0.0934 c 0,-5.91057 -3.87147,-8.37534 -10.74686,-10.17121 m -41.57671,6.53892 15.97638,0 0,-6.63216 -15.97638,0 0,-6.8754 18.15332,0 0,-6.63216 -25.55977,0 0,33.88646 25.80301,0 0,-6.63216 -18.39656,0 L 265.16675,579.38933 Z M 225,593.15196 l 7.4551,0 0,-13.11839 16.16691,0 0,-6.7781 -16.16691,0 0,-7.21187 18.3479,0 0,-6.78216 -25.803,0 L 225.00081,593.15228 z m 199.99054,-69.30124 9.43746,14.33455 0.19458,0 9.53475,-14.47644 0,22.12208 7.41051,0 0,-33.88647 -8.03481,0 -8.91045,14.3305 -8.91045,-14.3305 -8.03481,0 0,33.88647 7.31322,0 L 424.99135,523.85104 z m -43.10501,-11.90628 0,33.88647 24.35172,0 0,-6.77405 -16.89661,0 0,-27.11242 L 381.88634,511.94477 z m -51.14792,20.76808 13.94132,0 0,-6.7781 -13.94132,0 0,-7.21187 19.14247,0 0,-6.77811 -26.59352,0 0,33.88647 7.45105,0 L 330.73842,532.71284 z m 171.70249,-48.36696 4.50387,-10.99009 4.49982,10.99009 L 502.44091,484.34589 z m 14.76832,14.18456 7.79158,0 -14.52509,-34.12969 -6.8754,0 -14.52103,34.12969 7.60104,0 3.09718,-7.60104 14.3305,0 L 517.20923,498.53045 z m -47.2643,0.57971 c 6.53487,0 10.41039,-2.32288 13.89674,-6.05246 l -4.74711,-4.78764 c -2.65935,2.41612 -5.03493,3.9647 -8.90639,3.9647 -5.80923,0 -9.82663,-4.84034 -9.82663,-10.64957 l 0,-0.0934 c 0,-5.80922 4.1147,-10.55633 9.82663,-10.55633 3.38905,0 6.05245,1.4513 8.66316,3.82282 l 4.7471,-5.4687 c -3.14582,-3.09717 -6.97269,-5.22951 -13.35756,-5.22951 -10.41445,0 -17.67091,7.89292 -17.67091,17.52496 l 0,0.0973 c 0,9.73338 7.40646,17.42767 17.37497,17.42767 m -24.33144,-7.21187 -18.39655,0 0,-7.11458 15.97638,0 0,-6.63622 -15.97638,0 0,-6.87539 18.15331,0 0,-6.63217 -25.55977,0 0,33.89052 25.80301,0 L 445.61349,491.89828 z m -56.47474,-7.36187 8.61452,0 c 3.82281,0 5.52139,1.41076 5.52139,3.68094 l 0,0.0973 c 0,2.51746 -1.9864,3.67688 -5.27816,3.67688 l -8.85775,0 L 389.13875,484.53642 z m 0,-13.35756 7.35781,0 c 3.14582,0 4.88899,1.2567 4.88899,3.48229 l 0,0.0973 c 0,2.51747 -2.07964,3.58364 -5.3714,3.58364 l -6.8754,0 L 389.13875,471.17885 z m 21.54237,18.05602 0,-0.0973 c 0,-4.54847 -2.42017,-6.82675 -6.34028,-8.33075 2.42017,-1.35399 4.45117,-3.48229 4.45117,-7.3051 l 0,-0.0973 c 0,-5.32681 -4.25659,-8.76451 -11.18468,-8.76451 l -15.73315,0 0,33.89052 16.12232,0 c 7.64969,0 12.68462,-3.09717 12.68462,-9.29557 m -67.42834,-12.92785 c 0,2.85799 -2.0837,4.79575 -5.71193,4.79575 l -6.78216,0 0,-9.73339 6.63622,0 c 3.63228,0 5.85787,1.64588 5.85787,4.8444 L 343.25278,476.30702 z m 7.55239,-0.38512 0,-0.0973 c 0,-6.96863 -4.7917,-11.18468 -12.78191,-11.18468 l -14.71967,0 0,33.89052 7.4551,0 0,-10.84415 5.08763,0 7.25646,10.84415 8.71586,0 -8.27398,-12.10086 c 4.30928,-1.60129 7.26051,-5.03898 7.26051,-10.50768 m -52.33571,22.60854 7.4551,0 0,-27.01512 10.3131,0 0,-6.8754 -28.0813,0 0,6.8754 10.3131,0 L 298.46946,498.53045 Z"/>
        </g>
      </svg>

      <div class="tribeca-banner__info">
        <div class="tribeca-banner__pill">
          <span class="tribeca-banner__pill-dot" aria-hidden="true" />
          25<sup class="tribeca-banner__pill-sup">ª</sup> EDICIÓN · 3–14 JUNIO · 2026
        </div>
        <div class="tribeca-banner__tagline" aria-hidden="true">
          Selección oficial, funciones y sedes en NYC —
          <span class="tribeca-banner__tagline-accent">descubrí la programación completa</span>
        </div>
      </div>

      <span class="tribeca-banner__cta" aria-label="Abrir cobertura de Tribeca">
        Explorar
      </span>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  name: 'TribecaLiveBanner',
};
</script>

<style scoped>
.tribeca-banner {
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

.tribeca-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px -10px rgba(139, 233, 253, 0.25);
}

.tribeca-banner__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
}

.tribeca-banner__pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url('/festivals/tribeca/tribeca-pattern-bn.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.22;
  mix-blend-mode: screen;
  pointer-events: none;
}

.tribeca-banner__shimmer {
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
  animation: tribeca-shimmer-sweep 5.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes tribeca-shimmer-sweep {
  0%   { background-position: -120% 0; }
  100% { background-position: 220% 0; }
}

.tribeca-banner__inner {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 20px 0 18px;
  gap: 18px;
}

.tribeca-banner__logo {
  height: 52px;
  width: auto;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
          drop-shadow(0 0 14px rgba(139, 233, 253, 0.20));
  animation: tribeca-logo-glow 4.5s ease-in-out infinite;
}

@keyframes tribeca-logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.22))
            drop-shadow(0 0 12px rgba(139, 233, 253, 0.18));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))
            drop-shadow(0 0 18px rgba(139, 233, 253, 0.35));
  }
}

.tribeca-banner__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 18px;
  border-left: 1px solid rgba(139, 233, 253, 0.18);
}

.tribeca-banner__pill {
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

.tribeca-banner__pill-sup {
  font-size: 7px;
  font-weight: 700;
  margin: 0 1px 0 0;
  vertical-align: super;
}

.tribeca-banner__pill-dot {
  width: 6px;
  height: 6px;
  background-color: #8BE9FD;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.7);
  animation: tribeca-pill-pulse 1.8s ease-in-out infinite;
}

@keyframes tribeca-pill-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

.tribeca-banner__tagline {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0.15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tribeca-banner__tagline-accent {
  color: #8BE9FD;
  font-weight: 600;
}

.tribeca-banner__cta {
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

.tribeca-banner:hover .tribeca-banner__cta {
  background: rgba(139, 233, 253, 0.08);
  color: #A2EDFD;
  box-shadow: 0 0 16px rgba(139, 233, 253, 0.30);
}

@media (max-width: 768px) {
  .tribeca-banner__inner {
    height: auto;
    min-height: 64px;
    padding: 10px 14px;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .tribeca-banner__info {
    border-left: none;
    padding-left: 0;
  }

  .tribeca-banner__tagline {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    white-space: normal;
    font-size: 11.5px;
  }

  .tribeca-banner__cta {
    margin-left: auto;
    font-size: 11px;
    padding: 6px 14px;
  }

  .tribeca-banner__logo {
    height: 42px;
  }
}

@media (max-width: 480px) {
  .tribeca-banner__tagline {
    display: none;
  }

  .tribeca-banner__logo {
    height: 36px;
  }
}
</style>
