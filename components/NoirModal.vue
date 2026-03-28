<template>
  <div class="noir-modal-overlay" @click.self="$emit('close')">
    <div class="noir-modal-card">
      <div class="noir-modal-glow-line"></div>
      <button class="noir-modal-close" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="noir-modal-body">
        <div class="noir-modal-header">
          <img src="/ui/noir-selection-500x500.svg" alt="N.O.I.R" class="noir-modal-logo" />
          <div>
            <h2 class="noir-modal-title">N.O.I.R.</h2>
            <p class="noir-modal-subtitle">Nothing Out Is Ready</p>
          </div>
        </div>

        <div class="noir-modal-divider"></div>

        <p class="noir-modal-text">
          De estrenos anticipados a un archivo permanente. Una selecci&oacute;n curada de estrenos exclusivos desde 2024.
        </p>

        <button v-if="!showManifesto" class="noir-manifesto-toggle" @click="showManifesto = true">
          Leer manifiesto
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <transition name="manifesto-expand">
          <div v-if="showManifesto" class="noir-manifesto">
            <div class="noir-manifesto-divider"></div>
            <div class="noir-manifesto-content">
              <transition :name="slideDirection" mode="out-in">
                <div :key="currentStep" class="noir-manifesto-step">
                  <h4 class="noir-manifesto-step-title">{{ manifesto[currentStep].numeral }}. {{ manifesto[currentStep].title }}</h4>
                  <div class="noir-manifesto-lines">
                    <p v-for="(line, i) in manifesto[currentStep].lines" :key="i" class="noir-manifesto-line">
                      {{ line }}
                    </p>
                  </div>
                </div>
              </transition>
            </div>
            <div class="noir-manifesto-nav">
              <button
                class="noir-manifesto-arrow"
                :class="{ 'noir-manifesto-arrow--disabled': currentStep === 0 }"
                :disabled="currentStep === 0"
                @click="prevStep"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div class="noir-manifesto-dots">
                <span
                  v-for="(_, i) in manifesto"
                  :key="i"
                  class="noir-manifesto-dot"
                  :class="{ 'noir-manifesto-dot--active': i === currentStep }"
                  @click="currentStep = i"
                />
              </div>
              <button
                class="noir-manifesto-arrow"
                :class="{ 'noir-manifesto-arrow--disabled': currentStep === manifesto.length - 1 }"
                :disabled="currentStep === manifesto.length - 1"
                @click="nextStep"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </transition>

      </div>

      <div class="noir-modal-footer">
        <button class="noir-modal-got-it" @click="$emit('close')">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoirModal',
  data() {
    return {
      showManifesto: false,
      currentStep: 0,
      slideDirection: 'slide-left',
      manifesto: [
        {
          numeral: 'I',
          title: 'Nada est\u00e1 listo',
          lines: [
            'El cine comercial vive del impacto inmediato.',
            'N.O.I.R. se construye desde la anticipaci\u00f3n.',
            'Reivindicamos lo latente y lo independiente.',
            'Lo que est\u00e1 \u201clisto\u201d ya pertenece al pasado.',
            'Creemos que la obra en su estado m\u00e1s puro es la que a\u00fan no ha sido asimilada.'
          ]
        },
        {
          numeral: 'II',
          title: 'Criterio de selecci\u00f3n',
          lines: [
            'No acumulamos t\u00edtulos: identificamos se\u00f1ales.',
            'Nos movemos en ese umbral previo, cuando una obra todav\u00eda no ha sido completamente estrenada.',
            'Si un t\u00edtulo no propone algo desde su lenguaje o su influencia cultural, no forma parte de esta selecci\u00f3n.',
            'Buscamos lo original, lo inc\u00f3modo y lo genuino.'
          ]
        },
        {
          numeral: 'III',
          title: 'En constante movimiento',
          lines: [
            'La selecci\u00f3n est\u00e1 en constante evoluci\u00f3n.',
            'Los t\u00edtulos ingresan, rotan y se retiran.',
            'Nada se pierde: lo que deja N.O.I.R. pasa a integrar su hist\u00f3rico.'
          ]
        }
      ]
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.manifesto.length - 1) {
        this.slideDirection = 'slide-left';
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.slideDirection = 'slide-right';
        this.currentStep--;
      }
    }
  }
};
</script>

<style scoped>
.noir-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  animation: noirFadeIn 0.3s ease;
}

.noir-modal-card {
  position: relative;
  background: rgba(3, 4, 6, 0.6);
  border-radius: 20px;
  padding: 40px 30px 30px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(31, 84, 103, 0.5),
              inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(20px);
  text-align: center;
  animation: noirFloatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition: max-height 0.4s ease;
}

.noir-modal-card::-webkit-scrollbar {
  width: 4px;
}

.noir-modal-card::-webkit-scrollbar-track {
  background: transparent;
}

.noir-modal-card::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.2);
  border-radius: 4px;
}

.noir-modal-glow-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-radius: 20px 20px 0 0;
}

.noir-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.noir-modal-close:hover {
  color: #8BE9FD;
}

.noir-modal-body {
  margin-top: 10px;
}

.noir-modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 20px;
}

.noir-modal-logo {
  width: 82px;
  height: 82px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.7));
  align-self: center;
  margin-top: 6px;
}

.noir-modal-title {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 4px 0;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.3);
  text-align: left;
}

.noir-modal-subtitle {
  font-size: 16px;
  font-weight: 400;
  color: #8BE9FD;
  margin: -8px 0 0 0;
  font-style: italic;
  letter-spacing: 0.5px;
  text-align: left;
}

.noir-modal-divider {
  width: 60px;
  height: 1px;
  background: rgba(139, 233, 253, 0.3);
  margin: 0 auto 20px;
}

.noir-modal-text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
  margin: 0 0 14px 0;
}

/* Manifesto Toggle */
.noir-manifesto-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #8BE9FD;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.noir-manifesto-toggle:hover {
  background: rgba(139, 233, 253, 0.08);
  transform: translateY(1px);
}

.noir-manifesto-toggle svg {
  transition: transform 0.3s ease;
}

.noir-manifesto-toggle:hover svg {
  transform: translateY(2px);
}

/* Manifesto Section */
.noir-manifesto {
  margin-top: 8px;
}

.noir-manifesto-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.2), transparent);
  margin: 0 0 20px 0;
}

.noir-manifesto-content {
  min-height: 160px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.noir-manifesto-step {
  width: 100%;
  text-align: center;
}

.noir-manifesto-step-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
  text-align: center;
}

.noir-manifesto-lines {
  max-width: 360px;
  margin: 0 auto;
  text-align: center;
}

.noir-manifesto-line {
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  font-weight: 300;
  line-height: 1.55;
  margin: 0 0 4px 0;
}

/* Navigation */
.noir-manifesto-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 18px;
}

.noir-manifesto-arrow {
  background: none;
  border: 1px solid rgba(139, 233, 253, 0.2);
  color: #8BE9FD;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.noir-manifesto-arrow:hover:not(:disabled) {
  background: rgba(139, 233, 253, 0.1);
  border-color: rgba(139, 233, 253, 0.4);
}

.noir-manifesto-arrow--disabled {
  opacity: 0.2;
  cursor: default;
}

.noir-manifesto-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.noir-manifesto-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.noir-manifesto-dot--active {
  background: #8BE9FD;
  box-shadow: 0 0 8px rgba(139, 233, 253, 0.5);
  transform: scale(1.3);
}

/* Transitions */
.manifesto-expand-enter-active {
  animation: expandIn 0.4s ease;
}

.manifesto-expand-leave-active {
  animation: expandIn 0.3s ease reverse;
}

@keyframes expandIn {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 400px;
    transform: translateY(0);
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.noir-modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.noir-modal-got-it {
  padding: 10px 36px;
  background: #8BE9FD;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Outfit', sans-serif;
}

.noir-modal-got-it:hover {
  background: #7DD4E8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 233, 253, 0.4);
}

@keyframes noirFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes noirFloatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media screen and (max-width: 576px) {
  .noir-modal-card {
    width: 95%;
    padding: 35px 20px 25px;
  }
  .noir-modal-logo {
    width: 50px;
    height: 50px;
  }
  .noir-modal-header {
    gap: 12px;
  }
  .noir-modal-title {
    font-size: 28px;
    letter-spacing: 3px;
  }
  .noir-modal-subtitle {
    font-size: 14px;
  }
  .noir-modal-text {
    font-size: 13px;
  }
  .noir-manifesto-content {
    min-height: 200px;
  }
  .noir-manifesto-line {
    font-size: 12px;
  }
}
</style>
