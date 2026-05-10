<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <button @click="$emit('close')" :class="$style.closeButton" aria-label="Cerrar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
          <h3>Sigue y rec&iacute;be alertas</h3>
          <p>Sigue a una persona, serie o productora &mdash; te avisamos en tu feed cuando haya un nuevo estreno.</p>
        </div>

        <div :class="$style.carouselWrapper">
          <button :class="[$style.carouselArrow, $style.left]" @click="prevSlide" aria-label="Anterior">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div :class="$style.carouselTrack">
            <transition
              :enter-from-class="enterFromClass"
              :enter-active-class="$style.slideActive"
              :leave-to-class="leaveToClass"
              :leave-active-class="$style.slideActive"
              mode="out-in"
            >
              <div :class="$style.slide" :key="currentSlide">
                <template v-if="currentSlide === 0">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Paso 1 &middot; Seguir</span>
                    <h4>Personas</h4>
                  </div>
                  <p :class="$style.caption">Entra al perfil de un director o actor y toca <strong>Seguir</strong>.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_people_es.webp" width="2100" height="760" alt="Siguiendo a un director" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 1">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Resultado &middot; Nueva pel&iacute;cula</span>
                    <h4>Aviso de estreno</h4>
                  </div>
                  <p :class="$style.caption">Un nuevo t&iacute;tulo de alguien que sigues aparece en tu feed con su fecha de estreno.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_movie_es.webp" width="2100" height="760" alt="Notificaci&oacute;n de estreno de pel&iacute;cula" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 2">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Paso 2 &middot; Seguir</span>
                    <h4>Series de TV</h4>
                  </div>
                  <p :class="$style.caption">En la p&aacute;gina de una serie, toca <strong>Seguir</strong> para suscribirte a sus episodios.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_tv_show_es.webp" width="2100" height="760" alt="Siguiendo una serie de TV" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 3">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Resultado &middot; Nuevo episodio</span>
                    <h4>Aviso de episodio</h4>
                  </div>
                  <p :class="$style.caption">Cada episodio nuevo aparece con su temporada, n&uacute;mero y fecha de emisi&oacute;n.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_tv_es.webp" width="2100" height="760" alt="Notificaci&oacute;n de estreno de episodio" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 4">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Paso 3 &middot; Seguir</span>
                    <h4>Productoras</h4>
                  </div>
                  <p :class="$style.caption">Suscr&iacute;bete a una productora (ej. Film i V&auml;st) para seguir todo lo que estrenan.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_prod_es.webp" width="2100" height="760" alt="Siguiendo una productora" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 5">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Resultado &middot; Estreno de productora</span>
                    <h4>Aviso de estreno</h4>
                  </div>
                  <p :class="$style.caption">Cualquier nuevo t&iacute;tulo de esa productora se muestra con su fecha de estreno.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_prod_es.webp" width="2100" height="760" alt="Notificaci&oacute;n de estreno de productora" loading="lazy" decoding="async">
                  </div>
                </template>
              </div>
            </transition>
          </div>

          <button :class="[$style.carouselArrow, $style.right]" @click="nextSlide" aria-label="Siguiente">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div :class="$style.carouselDots">
          <button
            v-for="i in totalSlides"
            :key="i"
            :class="[$style.dot, currentSlide === i - 1 ? $style.active : '']"
            @click="goToSlide(i - 1)"
            :aria-label="`Diapositiva ${i}`"
          ></button>
        </div>

        <div :class="$style.footer">
          <button :class="$style.gotItButton" @click="$emit('close')">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowItWorksModal',
  data() {
    return {
      currentSlide: 0,
      direction: 'next',
      totalSlides: 6
    };
  },
  computed: {
    enterFromClass() {
      return this.direction === 'next' ? this.$style.enterRight : this.$style.enterLeft;
    },
    leaveToClass() {
      return this.direction === 'next' ? this.$style.leaveLeft : this.$style.leaveRight;
    }
  },
  methods: {
    prevSlide() {
      this.direction = 'prev';
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    },
    nextSlide() {
      this.direction = 'next';
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    },
    goToSlide(i) {
      if (i === this.currentSlide) return;
      this.direction = i > this.currentSlide ? 'next' : 'prev';
      this.currentSlide = i;
    }
  }
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
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modalContent {
  position: relative;
  background: linear-gradient(135deg, rgba(3, 18, 26, 0.99) 0%, rgba(2, 10, 16, 0.995) 100%);
  box-shadow:
    0 24px 60px 0 rgba(0, 0, 0, 0.85),
    0 8px 24px 0 rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(139, 233, 253, 0.08);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(127, 219, 241, 0.22);
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
}

.closeButton {
  position: absolute;
  top: 0.6rem;
  right: 0.7rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: color 0.2s ease;

  &:hover {
    color: #8BE9FD;
  }
}

.modalBody {
  padding: 1.6rem 1.6rem 1.4rem;
}

.intro {
  text-align: center;
  margin-bottom: 1.2rem;

  h3 {
    font-size: 1.55rem;
    color: #8BE9FD;
    margin: 0 0 0.4rem 0;
  }

  p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.45;
    margin: 0 auto;
    max-width: 480px;
  }
}

.carouselWrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.carouselTrack {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.slide {
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(139, 233, 253, 0.14);
  border-radius: 14px;
  padding: 1rem;
  backdrop-filter: blur(12px);
  box-shadow:
    inset 0 0 24px rgba(0, 0, 0, 0.55),
    0 8px 22px rgba(0, 0, 0, 0.55);
}

.slideHeader {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.55rem;

  h4 {
    font-size: 1.15rem;
    color: #fff;
    margin: 0;
    font-weight: 600;
  }
}

.stepLabel {
  font-size: 0.7rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
}

.caption {
  font-size: 1.02rem;
  color: rgba(255, 255, 255, 0.78);
  margin: 0 0 0.7rem 0;
  line-height: 1.4;

  strong {
    color: #fff;
  }
}

.imageBox {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(139, 233, 253, 0.14);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);

  img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 2100 / 760;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
}

.carouselArrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid #8BE9FD;
  background: rgba(0, 0, 0, 0.6);
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 0 14px rgba(139, 233, 253, 0.25), 0 4px 12px rgba(0, 0, 0, 0.55);

  &:hover {
    background: rgba(139, 233, 253, 0.18);
    border-color: #8BE9FD;
    color: #fff;
    transform: scale(1.1);
    box-shadow: 0 0 22px rgba(139, 233, 253, 0.55), 0 4px 14px rgba(0, 0, 0, 0.6);
  }
}

.carouselDots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 0.9rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(139, 233, 253, 0.2);
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;

  &.active {
    background: #8BE9FD;
    box-shadow: 0 0 8px rgba(139, 233, 253, 0.5);
    transform: scale(1.3);
  }

  &:hover:not(.active) {
    background: rgba(139, 233, 253, 0.45);
  }
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 1.1rem;
}

.gotItButton {
  padding: 0.7rem 2.4rem;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #021018;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.35);

  &:hover {
    background: #7DD4E8;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(139, 233, 253, 0.5);
  }
}

.slideActive {
  transition: opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.enterRight { opacity: 0; transform: translateX(60px); }
.leaveLeft  { opacity: 0; transform: translateX(-60px); }
.enterLeft  { opacity: 0; transform: translateX(-60px); }
.leaveRight { opacity: 0; transform: translateX(60px); }

@media (max-width: 768px) {
  .modalOverlay {
    padding: 0.8rem;
    align-items: flex-start;
    padding-top: 3rem;
  }

  .modalContent {
    max-width: 100%;
  }

  .modalBody {
    padding: 1.2rem 0.9rem 1rem;
  }

  .intro {
    margin-bottom: 0.9rem;

    h3 { font-size: 1.25rem; line-height: 1.3; }
    p { font-size: 0.98rem; }
  }

  .carouselWrapper { gap: 0.4rem; }

  .slide { padding: 0.8rem; }

  .slideHeader {
    gap: 0.45rem;
    margin-bottom: 0.45rem;
    h4 { font-size: 1rem; }
  }

  .stepLabel { font-size: 0.62rem; letter-spacing: 1px; }
  .caption { font-size: 0.92rem; margin-bottom: 0.6rem; }

  .carouselArrow {
    width: 36px;
    height: 36px;
    svg { width: 18px; height: 18px; }
  }

  .gotItButton {
    padding: 0.65rem 2rem;
    font-size: 0.98rem;
  }
}
</style>
