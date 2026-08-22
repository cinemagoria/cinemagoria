<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent" role="dialog" aria-modal="true" aria-labelledby="cal-scope-title">
      <button @click="$emit('close')" :class="$style.closeButton" aria-label="Cerrar">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div :class="$style.body">
        <header :class="$style.intro">
          <h3 id="cal-scope-title">Qué títulos incluye este calendario</h3>
          <p>Este calendario no reúne todos los estrenos del mundo. Incluye únicamente las películas y series que forman parte de la cobertura del sitio.</p>
        </header>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Origen de los títulos</span>
          <ul :class="$style.list">
            <li>Películas programadas en los festivales que el sitio cubre.</li>
            <li>El archivo de cine clásico, de género y de autor.</li>
            <li>Los títulos destacados en la portada en cada momento.</li>
          </ul>
        </section>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Criterio de selección</span>
          <p>Cada semana se publican miles de fechas de estreno en todo el mundo. En lugar de reproducirlas en su totalidad, el calendario se limita a los títulos incluidos en esa cobertura, lo que permite mantener una información abarcable y pertinente.</p>
        </section>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Qué significa realmente una fecha</span>
          <p>El estreno de una película no se produce en una única fecha. Cada país y cada formato tienen la suya, y la distancia entre ellas puede ser de meses o de años: un título puede permanecer en cartelera en un país mientras continúa su recorrido por festivales en otros.</p>
          <p>Por ese motivo cada entrada indica el país y el tipo de estreno al que corresponde. Mediante el filtro de territorio se podrá visualizar únicamente lo que se estrena en un país determinado.</p>
        </section>

        <section :class="$style.block">
          <span :class="$style.blockLabel">Las etiquetas de cada ficha</span>
          <dl :class="$style.defs">
            <div><dt>Estimada</dt><dd>El proyecto está anunciado pero aún no ha finalizado, por lo que la fecha puede variar.</dd></div>
            <div><dt>Sin anunciar</dt><dd>Figura como fecha prevista, pero todavía no cuenta con confirmación.</dd></div>
            <div><dt>Día sin confirmar</dt><dd>Solo se conoce el mes o el año; el día concreto es orientativo.</dd></div>
            <div><dt>Reposición</dt><dd>Una restauración o un reestreno conmemorativo, no un estreno original.</dd></div>
            <div><dt>Cortometraje</dt><dd>Duración inferior a cuarenta minutos.</dd></div>
          </dl>
        </section>

        <footer :class="$style.foot">
          Las fechas se actualizan a diario. Cuando una fecha se modifica, el cambio queda registrado.
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
