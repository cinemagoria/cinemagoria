<template>
  <div class="oscars-banner" role="banner" aria-label="98ª Premios Óscar Cobertura Completa">
    <div class="oscars-banner__shimmer" aria-hidden="true" />

    <div class="oscars-banner__inner">
      <!-- Izquierda: statuette + branding -->
      <div class="oscars-banner__brand">
        <img
          src="/ui/oscars98th.png"
          alt="Statuette del Óscar"
          class="oscars-banner__statuette"
          aria-hidden="true"
        />
        <div class="oscars-banner__title-block">
          <div class="oscars-banner__eyebrow">
            <span v-if="isLive" class="oscars-banner__live-pill">
              <span class="oscars-banner__live-dot" aria-hidden="true" />
              EN VIVO
            </span>
            <span v-else class="oscars-banner__results-pill">
              RESULTADOS
            </span>
          </div>
          <div class="oscars-banner__title">
            <span class="oscars-banner__edition">98ª</span>
            <span class="oscars-banner__academy-text">Premios Óscar</span>
          </div>
        </div>
      </div>

      <!-- Centro: ticker animado -->
      <div class="oscars-banner__ticker-wrap" aria-hidden="true">
        <div class="oscars-banner__ticker">
          <span
            v-for="(item, i) in tickerItems"
            :key="i"
            class="oscars-banner__ticker-item"
          >
            <span class="oscars-banner__ticker-sep">|</span>
            <img src="/ui/oscars98th.png" alt="" class="oscars-banner__ticker-icon" aria-hidden="true" />
            <span class="oscars-banner__ticker-cat">{{ item.cat }}</span>
            <span class="oscars-banner__ticker-div">|</span>
            <span class="oscars-banner__ticker-winner">{{ item.winner }}</span>
            <template v-if="item.film">
              <span class="oscars-banner__ticker-div">|</span>
              <span class="oscars-banner__ticker-film">{{ item.film }}</span>
            </template>
          </span>
          <span
            v-for="(item, i) in tickerItems"
            :key="'dup-' + i"
            class="oscars-banner__ticker-item"
            aria-hidden="true"
          >
            <span class="oscars-banner__ticker-sep">|</span>
            <img src="/ui/oscars98th.png" alt="" class="oscars-banner__ticker-icon" aria-hidden="true" />
            <span class="oscars-banner__ticker-cat">{{ item.cat }}</span>
            <span class="oscars-banner__ticker-div">|</span>
            <span class="oscars-banner__ticker-winner">{{ item.winner }}</span>
            <template v-if="item.film">
              <span class="oscars-banner__ticker-div">|</span>
              <span class="oscars-banner__ticker-film">{{ item.film }}</span>
            </template>
          </span>
        </div>
      </div>

      <!-- Derecha: CTA -->
      <nuxt-link to="/awards" class="oscars-banner__cta" aria-label="Cobertura completa de los Premios Óscar">
        Cobertura completa
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OscarsLiveBanner',
  data() {
    const CEREMONY_END = new Date('2026-03-16T00:00:00Z');
    return {
      isLive: new Date() < CEREMONY_END,
      tickerItems: [
        { cat: 'Mejor Película',         winner: 'Una Batalla Tras Otra' },
        { cat: 'Mejor Director',         winner: 'Paul Thomas Anderson', film: 'Una Batalla Tras Otra' },
        { cat: 'Mejor Actor',            winner: 'Michael B. Jordan',    film: 'Sinners' },
        { cat: 'Mejor Actriz',           winner: 'Jessie Buckley',       film: 'Hamnet' },
        { cat: 'Actor de Reparto',       winner: 'Sean Penn',            film: 'Una Batalla Tras Otra' },
        { cat: 'Actriz de Reparto',      winner: 'Amy Madigan',          film: 'Weapons' },
        { cat: 'Guion Original',         winner: 'Ryan Coogler',         film: 'Sinners' },
        { cat: 'Guion Adaptado',         winner: 'Paul Thomas Anderson', film: 'Una Batalla Tras Otra' },
        { cat: 'Fotografía',             winner: 'Autumn Durald Arkapaw',film: 'Sinners' },
        { cat: 'Banda Sonora',           winner: 'Ludwig Göransson',     film: 'Sinners' },
        { cat: 'Montaje',                winner: 'Andy Jurgensen',       film: 'Una Batalla Tras Otra' },
        { cat: 'Casting',                winner: 'Una Batalla Tras Otra' },
        { cat: 'Película Animada',       winner: 'KPop Demon Hunters' },
        { cat: 'Película Internacional', winner: 'Valor Sentimental' },
        { cat: 'Efectos Visuales',       winner: 'Avatar: Fuego y Ceniza' },
        { cat: 'Sonido',                 winner: 'F1' },
        { cat: 'Diseño de Producción',   winner: 'Frankenstein' },
        { cat: 'Vestuario',              winner: 'Frankenstein' },
        { cat: 'Maquillaje',             winner: 'Frankenstein' },
        { cat: 'Documental',             winner: 'Mr. Nobody Contra Putin' },
        { cat: 'Corto Animado',          winner: 'The Girl Who Cried Pearls' },
        { cat: 'Corto Acción Real',      winner: 'The Singers / Two People Exchanging Saliva' },
        { cat: 'Corto Documental',       winner: 'All the Empty Rooms' },
      ],
    };
  },
};
</script>

<style scoped>
.oscars-banner {
  position: relative;
  width: 100%;
  background: #000;
  border-bottom: 1px solid rgba(201, 168, 76, 0.3);
  border-top: 1px solid rgba(201, 168, 76, 0.12);
  overflow: hidden;
  z-index: 10;
  border-radius: 15px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 2px;
  border: 1px solid #8BE9FD;
}

.oscars-banner__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(201, 168, 76, 0.05) 50%,
    transparent 65%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer-sweep {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

/* ─── Inner layout ─────────────────────────────────────────────────── */
.oscars-banner__inner {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px 0 10px;
  gap: 0;
}

/* ─── Brand ────────────────────────────────────────────────────────── */
.oscars-banner__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-right: 16px;
  border-right: 1px solid rgba(201, 168, 76, 0.18);
}

.oscars-banner__statuette {
  height: 46px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(201, 168, 76, 0.4));
}

.oscars-banner__title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.oscars-banner__eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
}

.oscars-banner__live-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(220, 38, 38, 0.45);
  color: #f87171;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1.8px;
  padding: 2px 7px 2px 5px;
  border-radius: 20px;
  text-transform: uppercase;
}

.oscars-banner__live-dot {
  width: 6px;
  height: 6px;
  background-color: #ef4444;
  border-radius: 50%;
  flex-shrink: 0;
  animation: live-pulse 1.4s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  50%       { opacity: 0.75; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0); }
}

.oscars-banner__results-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.35);
  color: #C9A84C;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1.8px;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}

.oscars-banner__title {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.oscars-banner__edition {
  color: #C9A84C;
  font-size: 14px;
  font-weight: 800;
}

.oscars-banner__academy-text {
  color: rgba(255, 255, 255, 0.92);
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

/* ─── Ticker ───────────────────────────────────────────────────────── */
.oscars-banner__ticker-wrap {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  align-items: center;
  mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
}

.oscars-banner__ticker {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation: ticker-scroll 42s linear infinite;
  will-change: transform;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.oscars-banner__ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.15px;
}

.oscars-banner__ticker-icon {
  height: 16px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(201, 168, 76, 0.5));
  opacity: 0.9;
}

.oscars-banner__ticker-cat {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  white-space: nowrap;
}

.oscars-banner__ticker-div {
  color: #8BE9FD;
  font-weight: 300;
  opacity: 0.6;
  font-size: 11px;
}

.oscars-banner__ticker-winner {
  color: #8BE9FD;
  font-weight: 600;
  white-space: nowrap;
}

.oscars-banner__ticker-film {
  color: rgba(139, 233, 253, 0.65);
  font-weight: 400;
  white-space: nowrap;
  font-style: italic;
}

.oscars-banner__ticker-sep {
  color: rgba(201, 168, 76, 0.4);
  font-size: 12px;
  font-weight: 300;
}

/* ─── CTA ──────────────────────────────────────────────────────────── */
.oscars-banner__cta {
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
  padding: 7px 16px;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 10px;
  transition: background 0.2s ease, color 0.2s ease;
  margin-left: 16px;
}

.oscars-banner__cta:hover {
  background: rgba(139, 233, 253, 0.1);
  color: #A2EDFD;
}

/* ─── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .oscars-banner__inner {
    height: auto;
    padding: 8px 12px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .oscars-banner__ticker-wrap {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    height: 26px;
  }

  .oscars-banner__brand {
    border-right: none;
    padding-right: 0;
  }

  .oscars-banner__cta {
    margin-left: auto;
    font-size: 11px;
    padding: 6px 12px;
  }

  .oscars-banner__statuette {
    height: 38px;
  }
}

@media (max-width: 480px) {
  .oscars-banner__statuette {
    height: 32px;
  }

  .oscars-banner__academy-text {
    font-size: 12px;
  }
}
</style>
