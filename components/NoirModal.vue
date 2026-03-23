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
        <h2 class="noir-modal-title">N.O.I.R.</h2>
        <p class="noir-modal-subtitle">Nothing Out Is Ready</p>

        <div class="noir-modal-divider"></div>

        <p class="noir-modal-text">
          Una selecci&oacute;n de lo que todav&iacute;a no se estren&oacute; &mdash; t&iacute;tulos hasta un a&ntilde;o antes de su lanzamiento.
        </p>

        <p class="noir-modal-text noir-modal-highlight">
          Si ya lo est&aacute;s viendo en el cine, sali&oacute; de N.O.I.R hace m&iacute;nimo un mes.
        </p>
      </div>

      <div class="noir-modal-footer">
        <button class="noir-modal-got-it" @click="$emit('close')">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoirModal'
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(31, 84, 103, 0.5),
              inset 0 0 20px rgba(139, 233, 253, 0.05);
  backdrop-filter: blur(20px);
  text-align: center;
  animation: noirFloatIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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

.noir-modal-title {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.3);
}

.noir-modal-subtitle {
  font-size: 16px;
  font-weight: 400;
  color: #8BE9FD;
  margin: 0 0 4px 0;
  font-style: italic;
  letter-spacing: 0.5px;
}

.noir-modal-subtitle-es {
  font-size: 13px;
  font-weight: 300;
  color: rgba(139, 233, 253, 0.6);
  margin: 0 0 20px 0;
  font-style: italic;
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

.noir-modal-highlight {
  color: #8BE9FD;
  font-weight: 400;
  font-style: italic;
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
}
</style>
