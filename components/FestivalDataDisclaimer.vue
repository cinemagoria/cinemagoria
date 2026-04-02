<template>
  <div class="disclaimer-wrapper">
    <button class="disclaimer-trigger" @click="open = true" aria-label="Why are some films missing?">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span>Why are some films missing?</span>
    </button>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="open" class="disclaimer-overlay" @click.self="open = false">
          <div class="disclaimer-modal">
            <button class="disclaimer-close" @click="open = false" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="disclaimer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>

            <h3 class="disclaimer-title">Catalog Coverage</h3>

            <p class="disclaimer-text">The number of features and shorts displayed here may not match the festival's official lineup. Our catalog is built from publicly available metadata and third-party sources, which may not cover every title, particularly short films, experimental works, or regional entries.</p>

            <p class="disclaimer-text">This is a technical limitation, not an editorial choice. We don't censor, or intentionally omit any film. <nuxt-link to="/usage-policies" target="_blank" class="accent-link">Read full usage policies</nuxt-link>.</p>

            <button class="disclaimer-got-it" @click="open = false">
              Got it
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>

<style scoped>
.disclaimer-wrapper {
  display: flex;
  justify-content: flex-end; /* Align to the right edge */
  width: 100%;
  margin: 0.5rem 0 1rem 0; /* Tighten spacing so it feels connected to the content */
}

.disclaimer-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent; /* Remove background */
  border: none; /* Remove border */
  color: rgba(255, 255, 255, 0.7); /* Lighter gray for better legibility */
  padding: 6px 8px; /* Minimal padding */
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.disclaimer-trigger:hover {
  color: #8BE9FD; /* Highlight on hover */
  background: rgba(139, 233, 253, 0.05); /* Very subtle hover background */
}

.disclaimer-trigger svg {
  width: 16px;
  height: 16px;
  opacity: 0.8;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.disclaimer-trigger:hover svg {
  opacity: 1;
}

@media (min-width: 768px) {
  .disclaimer-trigger {
    font-size: 1rem;
    padding: 8px 12px;
    gap: 8px;
  }
  
  .disclaimer-trigger svg {
    width: 20px;
    height: 20px;
  }
}

/* Overlay */
.disclaimer-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  padding: 1rem;
}

/* Modal */
.disclaimer-modal {
  position: relative;
  max-width: 480px;
  width: 100%;
  background: #0d1b22;
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 20px;
  padding: 2.2rem 2rem 1.8rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 233, 253, 0.05);
}

.disclaimer-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.disclaimer-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.disclaimer-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.disclaimer-title {
  text-align: center;
  color: #8BE9FD;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 1.2rem;
}

.disclaimer-text {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 0.9rem;
  text-align: center;
}

.accent-link {
  color: #8BE9FD;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.accent-link:hover {
  text-decoration: underline;
}

.disclaimer-got-it {
  display: block;
  width: 100%;
  margin-top: 1.5rem;
  padding: 12px;
  background: #8BE9FD;
  color: #0a161b; /* Dark text for contrast */
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.25s ease;
}

.disclaimer-got-it:hover {
  background: #fff;
  transform: translateY(-2px);
}

/* Transitions */
.modal-fade-enter-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-active .disclaimer-modal {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-leave-active .disclaimer-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-enter-from .disclaimer-modal {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-leave-to .disclaimer-modal {
  opacity: 0;
  transform: scale(0.95);
}
</style>
