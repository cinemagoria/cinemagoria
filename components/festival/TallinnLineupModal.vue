<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent" role="dialog" aria-modal="true" aria-labelledby="tallinn-lineup-title">
      <button @click="$emit('close')" :class="$style.closeButton" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div :class="$style.body">
        <p :class="$style.notice">
          <span>Primera ola</span>
          El festival publica su programa completo el 31 de octubre. Todo lo que sigue es lo que difundió hasta ahora, así que los títulos, las funciones y las cantidades van a seguir creciendo hasta esa fecha.
        </p>

        <header :class="$style.intro">
          <h3 id="tallinn-lineup-title">Sobre este catálogo</h3>
          <p>Black Nights publica su programación por etapas y no de una sola vez. Esta página se arma con las fichas que ya están en el sitio del festival, así que los títulos que siguen son oficiales, y sus horarios también.</p>
        </header>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Qué incluye</span>
          <ul :class="$style.list">
            <li>La película de apertura y las competencias principales: <a href="https://poff.ee/en/film/the-opening-ceremony-of-the-30th-pff-and-the-opening-film-ulya/" target="_blank" rel="noopener">Película de apertura</a>, <a href="https://poff.ee/en/official-selection/" target="_blank" rel="noopener">Selección Oficial – Competencia</a>, <a href="https://poff.ee/en/first-feature-competition/" target="_blank" rel="noopener">Competencia de Óperas Primas</a></li>
            <li>Just Film, para el público infantil y juvenil: <a href="https://poff.ee/en/international-youth-competition-programme/" target="_blank" rel="noopener">Competencia Internacional Juvenil</a>, <a href="https://poff.ee/en/childrens-competition-programme/" target="_blank" rel="noopener">Competencia Infantil</a>, <a href="https://poff.ee/en/juniors-competition-programme/" target="_blank" rel="noopener">Competencia Juniors</a>, <a href="https://poff.ee/en/ecfa-competition-programme/" target="_blank" rel="noopener">Competencia ECFA</a>, <a href="https://poff.ee/en/youth-programme-1/" target="_blank" rel="noopener">Programa Juvenil</a>, <a href="https://poff.ee/en/children-s-programme-1/" target="_blank" rel="noopener">Programa Infantil</a>, <a href="https://poff.ee/en/children-s-rights-programme-1/" target="_blank" rel="noopener">Programa de Derechos de la Infancia</a>, <a href="https://poff.ee/en/doc-just/" target="_blank" rel="noopener">Doc@Just</a>, <a href="https://poff.ee/en/just-anime/" target="_blank" rel="noopener">Just Anime</a>, <a href="https://poff.ee/en/youngfilmmaker/" target="_blank" rel="noopener">#youngfilmmaker</a></li>
            <li>PÖFF Shorts: <a href="https://poff.ee/en/shorts-live-action-competition-1/" target="_blank" rel="noopener">Competencia de Cortos de Acción Real</a>, <a href="https://poff.ee/en/shorts-animation-competition-1/" target="_blank" rel="noopener">Competencia de Cortos de Animación</a>, <a href="https://poff.ee/en/shorts-new-talents-competition-live-action-1/" target="_blank" rel="noopener">Competencia Nuevos Talentos: Acción Real</a>, <a href="https://poff.ee/en/shorts-new-talents-competition-animation-1/" target="_blank" rel="noopener">Competencia Nuevos Talentos: Animación</a>, <a href="https://poff.ee/en/shorts-kids-animation-competition-1/" target="_blank" rel="noopener">Competencia de Cortos de Animación Infantil</a></li>
          </ul>
        </section>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Qué falta todavía</span>
          <dl :class="$style.defs">
            <div><dt>Más títulos</dt><dd>Películas que el festival todavía no anunció, incluidas las que se conozcan con el programa completo.</dd></div>
            <div><dt>Horarios</dt><dd>Las funciones de esas películas. Las que ya figuran vienen del festival, que todavía puede ajustarlas.</dd></div>
          </dl>
        </section>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Por qué publicarlo ahora</span>
          <p>Porque las competencias y sus funciones ya son públicas, y una vista parcial que dice con claridad lo que es sirve más que esperar al último anuncio para mostrar algo.</p>
          <p>Lo que no es, es un reemplazo del programa oficial.</p>
        </section>

        <footer :class="$style.foot">
          Cuando salga el programa completo, este catálogo se concilia contra él, se suman los títulos y horarios nuevos y este aviso desaparece.
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style lang="scss" module>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modalContent {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  width: 100%;
  max-width: 660px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.modalContent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.closeButton {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: #8BE9FD;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 3;
  padding: 0;
}

.closeButton:hover {
  background: rgba(139, 233, 253, 0.18);
  border-color: rgba(139, 233, 253, 0.5);
  color: #fff;
}

.body { padding: 3.2rem 3rem 2.6rem; }

.intro {
  margin-bottom: 2.4rem;
  padding-right: 3rem;

  h3 {
    font-family: var(--font-display);
    margin: 0 0 0.8rem;
    color: #8BE9FD;
    font-size: 2.2rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-shadow: 0 0 24px rgba(139, 233, 253, 0.18);
  }

  p { margin: 0; color: #cfd6dc; font-size: 1.45rem; line-height: 1.6; }
}

.notice {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin: 0 0 2.2rem;
  padding: 1.4rem 1.6rem;
  border-radius: 14px;
  border: 1px solid rgba(251, 191, 119, 0.28);
  background: linear-gradient(90deg, rgba(251, 191, 119, 0.12), rgba(251, 191, 119, 0.03));
  color: #e4d5c2;
  font-size: 1.3rem;
  line-height: 1.55;

  span {
    align-self: flex-start;
    color: #FBBF77;
    font-size: 1.05rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
}

.block {
  padding: 1.8rem 0;
  border-top: 1px solid rgba(139, 233, 253, 0.1);

  p { margin: 0 0 0.9rem; color: #ACAFB5; font-size: 1.35rem; line-height: 1.62; }
  p:last-child { margin-bottom: 0; }
}

.blockLabel {
  display: block;
  color: #8BE9FD;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  li {
    position: relative;
    padding-left: 1.8rem;
    color: #cfd6dc;
    font-size: 1.35rem;
    line-height: 1.55;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.75rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: #8BE9FD;
    opacity: 0.65;
  }

  a {
    color: #cfd6dc;
    text-decoration: underline;
    text-decoration-color: rgba(139, 233, 253, 0.4);
    text-underline-offset: 0.3rem;
    transition: color 0.2s ease;
  }

  a:hover { color: #8BE9FD; }
}

.defs {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;

  div { display: flex; gap: 1.2rem; align-items: baseline; flex-wrap: wrap; }

  dt {
    flex: 0 0 auto;
    color: #FBBF77;
    border: 1px solid rgba(251, 191, 119, 0.28);
    border-radius: 999px;
    padding: 0.2rem 1rem;
    font-size: 1.05rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  dd { flex: 1 1 20rem; margin: 0; color: #ACAFB5; font-size: 1.3rem; line-height: 1.55; }
}

.foot {
  margin-top: 1.8rem;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(139, 233, 253, 0.1);
  color: #80868b;
  font-size: 1.25rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .modalOverlay { padding: 12px; align-items: flex-end; }
  .modalContent { max-height: calc(100vh - 24px); }
  .body { padding: 2.6rem 1.8rem 2.2rem; }
  .intro h3 { font-size: 1.9rem; }
  .defs div { gap: 0.6rem; }
}
</style>
