
<template>
  <div class="feature-description">
    <div class="title-wrapper">
      <div class="cinematic-light"></div>
      <h1 class="metal-gradient">El instante en el que descubres qué ver.</h1>
    </div>
    <div class="subtitle-wrapper">
      <div class="cinematic-light-subtle"></div>
      <p class="feature-text">
        Sigue estrenos y recibe recomendaciones personalizadas desde múltiples plataformas, en un solo lugar.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureDescription',
};
</script>

<style scoped>
@font-face {
  font-family: 'Ortica';
  src: url('@/assets/fonts/OrticaLinear-Bold.otf') format('opentype');
  font-weight: normal;
  font-style: italic;
}

.feature-description {
  text-align: center;
  margin-top: 22px;
  padding-bottom: 20px;
  position: relative;
}

.title-wrapper {
  position: relative;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.cinematic-light {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
      background: radial-gradient(ellipse at center, rgba(4, 42, 46, 0.3) 0%, rgba(100, 80, 200, 0.2) 30%, rgba(120, 60, 180, 0.12) 50%, transparent 75%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
  animation: glow-pulse 4s ease-in-out infinite;
}

.metal-gradient {
  font-size: 46.8px;
  font-family: 'Ortica', 'Tahoma', sans-serif;
  font-weight: 800;
  margin: 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(
    to bottom, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(240, 240, 245, 0.98) 25%,
    rgba(214, 214, 218, 0.92) 50%,
    rgba(183, 183, 187, 0.85) 75%,
    rgba(144, 144, 149, 0.8) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 
    0 1px 2px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 8px 16px rgba(0, 0, 0, 0.6),
    0 12px 24px rgba(0, 0, 0, 0.5),
    0 16px 32px rgba(0, 0, 0, 0.4),
    0 -1px 1px rgba(255, 255, 255, 0.15);
  filter: brightness(1.1) contrast(1.05);
  letter-spacing: -0.02em;
}

.subtitle-wrapper {
  position: relative;
  width: 90%;
  padding-bottom: 40px;
  margin: 0 auto;
}

.cinematic-light-subtle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 200px;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 80, 200, 0.25) 0%,
    rgba(100, 101, 180, 0.15) 20%,
    rgba(80, 120, 200, 0.08) 30%,
    transparent 80%
  );
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
  animation: glow-pulse-subtle 5s ease-in-out infinite;
}

.feature-text {
  font-size: 19.8px;
  margin: 0;
  position: relative;
  z-index: 1;
  background: linear-gradient(
    to bottom, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(220, 220, 230, 0.9) 30%,
    rgba(180, 180, 190, 0.85) 60%,
    rgba(140, 140, 150, 0.8) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 
    0 1px 2px rgba(255, 255, 255, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.35),
    0 8px 16px rgba(0, 0, 0, 0.3),
    0 12px 20px rgba(0, 0, 0, 0.25);
  filter: brightness(1.08) contrast(1.03) drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
  letter-spacing: -0.01em;
  font-family: 'Ortica', 'Tahoma', sans-serif;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes glow-pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@media screen and (min-width: 200px) and (max-width: 460px) {
  .metal-gradient {
    font-size: 16.2px;
  }

  .feature-text {
    font-size: 12.6px;
  }
  
  .cinematic-light {
    width: 300px;
    height: 250px;
  }
  
  .cinematic-light-subtle {
    width: 250px;
    height: 150px;
  }
}

@media screen and (max-width: 799px) {
  .metal-gradient {
    font-size: 28.8px; 
  }
  
  .feature-text {
    font-size: 14.4px;
  }
  
  .cinematic-light {
    width: 450px;
    height: 300px;
  }
  
  .cinematic-light-subtle {
    width: 350px;
    height: 180px;
  }
}
</style>
