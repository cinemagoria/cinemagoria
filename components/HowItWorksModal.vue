<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <div :class="$style.modalHeader">
        <button @click="$emit('close')" :class="$style.closeButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
         <h3>Recibe Notificaciones Personalizadas</h3>
        <p>
          Sigue a personas, productoras, plataformas de streaming y series de TV para recibir notificaciones automáticas sobre nuevos proyectos y episodios, con actualizaciones cada 6 horas.
        </p>
        </div>

        <div :class="$style.guideSection">
          <div :class="$style.guideCard">
            <h4>Seguir a Personas</h4>
            <p>Visita el perfil de cualquier actor, director o creador y haz clic en "Seguir". Recibirás notificaciones sobre sus proyectos recientes y próximos, con actualizaciones cada 6 horas.</p>
            <div :class="$style.guideImage">
              <img src="/onboarding/add-person-es.webp" alt="Guía para seguir a una persona">
            </div>
          </div>

           <div :class="$style.guideCard">
            <p>Recibe una notificación cada vez que alguien a quien sigues estrena una nueva película o proyecto.</p>
            <div :class="$style.guideImage">
              <img src="/onboarding/push-person-es.webp" alt="Push notifications for people guide">
            </div>
          </div>


          <div :class="$style.guideCard">
            <h4>Seguir Series de TV</h4>
            <p>Ve a la página de cualquier serie de TV y haz clic en "Seguir episodios". Recibirás alertas de episodios en una ventana de 7 días alrededor de su fecha de estreno, con actualizaciones cada 6 horas.</p>
            <div :class="$style.guideImage">
              <img src="/onboarding/add-tv-show-es.webp" alt="Guía para seguir una serie de TV">
            </div>
          </div>
        </div>

          <div :class="$style.guideCard">
            <p>Recibe notificaciones cuando se estrenen nuevos episodios o temporadas de las series que sigues.</p>
            <div :class="$style.guideImage">
              <img src="/onboarding/push-tv-show-es.webp" alt="Push notifications for TV shows guide">
            </div>
          </div>

        <div :class="$style.footer">
          <button class="got-it-button" @click="$emit('close')" :class="$style.gotItButton">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowItWorksModal'
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  width: 100%;
  max-width: 900px;
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

  h2 {
    font-size: 2.4rem;
    color: #fff;
    margin: 0;
  }
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
  padding: 2rem;
}

.intro {
  text-align: center;
  margin-bottom: 2rem;

  h3 {
    font-size: 1.9rem;
    color: #8BE9FD;
    margin: 0 0 0.8rem 0;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  p {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin: 0;
    max-width: 520px;
    margin: 0 auto;
  }
}

.guideSection {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.guideCard {
  background: rgba(0, 0, 0, 0.307);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(139, 233, 253, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(139, 233, 253, 0.2);
    border-color: rgba(139, 233, 253, 0.4);
  }

  h4 {
    font-size: 1.8rem;
    color: #fff;
    margin: 1.5rem 0 1rem 0;
  }

  p {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }
}

.guideIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.1);
  border: 2px solid #8BE9FD;
  color: #8BE9FD;
}

.guideImage {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.footer {
  text-align: center;
  margin: 0 auto !important;
  position: relative !important;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.gotItButton {
  padding: 1rem 3rem;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto !important;
  position: relative !important;

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
    margin-bottom: 1.2rem;

    h3 {
      font-size: 1.5rem;
      line-height: 1.3;
      white-space: normal;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    p {
      font-size: 1.25rem;
    }
  }

  .guideCard {
    padding: 0.9rem;

    h4 {
      font-size: 1.4rem;
      margin: 0.6rem 0 0.5rem 0;
    }

    p {
      font-size: 1.2rem;
      margin: 0 0 0.9rem 0;
    }
  }

  .footer {
    margin-top: 1.2rem;
    padding-top: 1rem;
  }

  .guideIcon {
    width: 64px;
    height: 64px;

    svg {
      width: 36px;
      height: 36px;
    }
  }
}

.got-it-button {
    margin: 0 auto !important;
    position: relative !important;
}
</style>