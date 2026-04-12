<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <div :class="$style.modalHeader">
        <button @click="$emit('close')" :class="$style.closeButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
          <h3>Guía de Búsqueda</h3>
          <p>Cinemagoria ofrece múltiples formas de buscar películas, series, personas y más.</p>
        </div>

        <div :class="$style.guideSection">
          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M18.5 18.5l2.5 2.5" /><path d="M4 6h16" /><path d="M4 12h4" /><path d="M4 18h4" /></svg>
              </div>
              <h4>Búsqueda Directa</h4>
            </div>
            <p>Escribe el nombre de una película, serie de TV, persona. productora o servicio de streaming. Los resultados se organizan por categoría.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">Ejemplo</span>
              <code>El Padrino</code>
            </div>
          </div>

          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.36 20.213l-2.36 .787v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414" /><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
              </div>
              <h4>Búsqueda Contextual</h4>
            </div>
            <p>Agrega un año de estreno para priorizar una entrada específica. Usa <code>+</code> seguido del nombre de una persona para priorizar títulos en los que participa.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">Por Año</span>
              <code>El Padrino 1990</code>
              <span :class="$style.exampleHint">Prioriza El Padrino III (1990)</span>
            </div>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">Por Persona</span>
              <code>El Padrino + Robert De Niro</code>
              <span :class="$style.exampleHint">Prioriza El Padrino II donde actúa De Niro</span>
            </div>
          </div>

          <div :class="$style.guideCard">
            <div :class="$style.guideCardHeader">
              <div :class="$style.guideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" /><path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" /><path d="M12 11v2a14 14 0 0 0 2.5 8" /><path d="M8 15a18 18 0 0 0 1.8 6" /><path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" /></svg>
              </div>
              <h4>Búsqueda por ID</h4>
            </div>
            <p>Ingresa un ID de IMDb (que comienza con <code>tt</code>) o un ID numérico de TMDB para ir directamente a un título específico.</p>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">IMDb ID</span>
              <code>tt0068646</code>
              <span :class="$style.exampleHint">Encuentra El Padrino a través de su ID de IMDb</span>
            </div>
            <div :class="$style.exampleBlock">
              <span :class="$style.exampleLabel">TMDB ID</span>
              <code>238</code>
              <span :class="$style.exampleHint">Va directamente a El Padrino (TMDB ID: 238)</span>
            </div>
          </div>
        </div>

        <div :class="$style.footer">
          <button @click="$emit('close')" :class="$style.gotItButton">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchGuideModal'
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modalContent {
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.closeButton {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #8BE9FD;
  }
}

.modalBody {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.intro {
  text-align: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.8rem;
    color: #8BE9FD;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0 auto;
    max-width: 480px;
  }
}

.guideSection {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}

.guideCard {
  background: rgba(0, 0, 0, 0.307);
  border-radius: 12px;
  padding: 1.4rem;
  border: 1px solid rgba(139, 233, 253, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(139, 233, 253, 0.12);
    border-color: rgba(139, 233, 253, 0.35);
  }

  p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0.6rem 0 0.8rem 0;
  }

  code {
    background: rgba(139, 233, 253, 0.12);
    color: #8BE9FD;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 1.15rem;
  }
}

.guideCardHeader {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  h4 {
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
  }
}

.guideIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.1);
  border: 1.5px solid rgba(139, 233, 253, 0.3);
  color: #8BE9FD;
  flex-shrink: 0;

  svg { width: 16px; height: 16px; }
}

.exampleBlock {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(139, 233, 253, 0.12);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  code {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.exampleLabel {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(139, 233, 253, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.exampleHint {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  width: 100%;
  margin-top: 0.1rem;
}

.footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.gotItButton {
  padding: 0.8rem 2.2rem;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #7DD4E8;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
  }
}

@media (max-width: 768px) {
  .modalOverlay {
    padding: 0.8rem;
    align-items: flex-start;
    padding-top: 4rem;
  }

  .modalContent {
    max-width: 100%;
    max-height: 90vh;
  }

  .modalBody {
    padding: 1rem;
  }

  .intro {
    margin-bottom: 1rem;
    h3 { font-size: 1.5rem; }
    p { font-size: 1.2rem; }
  }

  .guideCard {
    padding: 1rem;
    p { font-size: 1.15rem; }
  }

  .guideCardHeader h4 { font-size: 1.3rem; }
}
</style>
