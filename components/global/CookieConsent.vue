<template>
  <Teleport to="body">
    <!-- Backdrop for preferences panel -->
    <Transition name="consent-fade">
      <div
        v-if="consent.showPreferences"
        class="consent-backdrop"
        @click="consent.closePreferences"
      />
    </Transition>

    <!-- Compact banner -->
    <Transition name="consent-slide">
      <div
        v-if="consent.showBanner && !consent.showPreferences"
        class="consent-banner"
        role="dialog"
        aria-label="Cookie consent"
        aria-describedby="consent-description"
      >
        <div class="consent-banner__inner">
          <p id="consent-description" class="consent-banner__text">
            We use cookies to keep the site running and improve your experience.
            You choose what's enabled beyond the essentials.
            <a href="/usage-policies#cookies" class="consent-banner__link">Learn more</a>
          </p>

          <div class="consent-banner__actions">
            <button
              type="button"
              class="consent-btn consent-btn--secondary"
              @click="consent.declineAll"
            >
              Decline all
            </button>

            <button
              type="button"
              class="consent-btn consent-btn--secondary"
              @click="consent.openPreferences"
            >
              Customize
            </button>

            <button
              type="button"
              class="consent-btn consent-btn--primary"
              @click="consent.acceptAll"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Preferences panel -->
    <Transition name="consent-slide">
      <div
        v-if="consent.showPreferences"
        class="consent-panel"
        role="dialog"
        aria-label="Cookie preferences"
        aria-modal="true"
      >
        <div class="consent-panel__accent" />

        <div class="consent-panel__header">
          <h2 class="consent-panel__title">Cookie Preferences</h2>
          <button
            type="button"
            class="consent-panel__close"
            aria-label="Close preferences"
            @click="consent.closePreferences"
          >
            ×
          </button>
        </div>

        <div class="consent-panel__body">
          <p class="consent-panel__description">
            Choose which cookie categories you'd like to allow.
            Essential cookies are always active — they're needed for the site to function.
          </p>

          <!-- Essential -->
          <div class="consent-category">
            <div class="consent-category__header">
              <div>
                <h3 class="consent-category__title">Essential</h3>
                <p class="consent-category__desc">
                  Authentication, security, and core functionality. These cannot be disabled.
                </p>
              </div>
              <span class="consent-toggle consent-toggle--locked">Always on</span>
            </div>
          </div>

          <!-- Analytics -->
          <div class="consent-category">
            <div class="consent-category__header">
              <div>
                <h3 class="consent-category__title">Analytics</h3>
                <p class="consent-category__desc">
                  Anonymous usage data that helps us understand how the platform is used and where to improve.
                </p>
              </div>
              <label class="consent-switch">
                <input
                  v-model="localPrefs.analytics"
                  type="checkbox"
                  class="consent-switch__input"
                >
                <span class="consent-switch__slider" />
              </label>
            </div>
          </div>

          <!-- Personalization -->
          <div class="consent-category">
            <div class="consent-category__header">
              <div>
                <h3 class="consent-category__title">Personalization</h3>
                <p class="consent-category__desc">
                  Remembers your display preferences, layout choices, and browsing context for a tailored experience.
                </p>
              </div>
              <label class="consent-switch">
                <input
                  v-model="localPrefs.personalization"
                  type="checkbox"
                  class="consent-switch__input"
                >
                <span class="consent-switch__slider" />
              </label>
            </div>
          </div>
        </div>

        <div class="consent-panel__footer">
          <button
            type="button"
            class="consent-btn consent-btn--secondary"
            @click="handleDeclineAll"
          >
            Decline all
          </button>

          <button
            type="button"
            class="consent-btn consent-btn--primary"
            @click="handleSaveCustom"
          >
            Save preferences
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useConsentStore } from '~/stores/consent'

const consent = useConsentStore()

const localPrefs = reactive({
  analytics: false,
  personalization: false,
})

// Sync local state when preferences panel opens
watch(() => consent.showPreferences, (open) => {
  if (open) {
    localPrefs.analytics = consent.preferences.analytics
    localPrefs.personalization = consent.preferences.personalization
  }
})

function handleSaveCustom() {
  consent.saveCustom({
    analytics: localPrefs.analytics,
    personalization: localPrefs.personalization,
  })
}

function handleDeclineAll() {
  localPrefs.analytics = false
  localPrefs.personalization = false
  consent.declineAll()
}

onMounted(() => {
  consent.load()
})
</script>

<style lang="scss" scoped>
@use '~/assets/css/utilities/variables' as *;

// --- Transitions ---
.consent-fade-enter-active,
.consent-fade-leave-active {
  transition: opacity 0.2s ease;
}
.consent-fade-enter-from,
.consent-fade-leave-to {
  opacity: 0;
}

.consent-slide-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.consent-slide-leave-active {
  transition: transform 0.2s ease, opacity 0.15s ease;
}
.consent-slide-enter-from,
.consent-slide-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}

// --- Backdrop ---
.consent-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
}

// --- Compact Banner ---
.consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  padding: 0 1rem 1rem;
  pointer-events: none;
}

.consent-banner__inner {
  max-width: 72rem;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 50%);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 1.2rem;
  padding: 1.6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  pointer-events: auto;
  box-shadow: 0 12px 40px rgba(31, 104, 135, 0.3);
  backdrop-filter: blur(15px);

  @media (min-width: $breakpoint-small) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 2rem;
  }
}

.consent-banner__text {
  font-size: 1.3rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.consent-banner__link {
  color: #7FDBF1;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
}

.consent-banner__actions {
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-small) {
    justify-content: flex-end;
  }
}

// --- Preferences Panel ---
.consent-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 50%);
  border-top: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 1.6rem 1.6rem 0 0;
  box-shadow: 0 -12px 40px rgba(31, 104, 135, 0.4);
  backdrop-filter: blur(15px);

  @media (min-width: $breakpoint-medium) {
    bottom: auto;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: 52rem;
    max-height: 70vh;
    border-radius: 1.6rem;
    border: 1px solid rgba(127, 219, 241, 0.3);
  }
}

.consent-panel__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-radius: 1.6rem 1.6rem 0 0;
}

.consent-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.5rem 0;
}

.consent-panel__title {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #7FDBF1;
  margin: 0;
  letter-spacing: 0.5px;
}

.consent-panel__close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 3.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
}

.consent-panel__body {
  padding: 1.4rem 2.5rem;
}

.consent-panel__description {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0 0 1.6rem;
}

// --- Category rows ---
.consent-category {
  border-top: 1px solid rgba(127, 219, 241, 0.1);
  padding: 1.4rem 0;
}

.consent-category__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
}

.consent-category__title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.3rem;
}

.consent-category__desc {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.45;
  margin: 0;
  max-width: 36rem;
}

// --- Toggle locked ---
.consent-toggle--locked {
  font-size: 1.1rem;
  color: #7FDBF1;
  white-space: nowrap;
  padding-top: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  opacity: 0.8;
}

// --- Toggle switch ---
.consent-switch {
  position: relative;
  flex-shrink: 0;
  width: 4.2rem;
  height: 2.4rem;
  cursor: pointer;
  margin-top: 0.1rem;
}

.consent-switch__input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.consent-switch__slider {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(127, 219, 241, 0.15);
  border-radius: 1.2rem;
  transition: all 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0.3rem;
    top: 0.25rem;
    width: 1.8rem;
    height: 1.8rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.consent-switch__input:checked + .consent-switch__slider {
  background: rgba(127, 219, 241, 0.25);
  border-color: rgba(127, 219, 241, 0.5);

  &::after {
    transform: translateX(1.8rem);
    background: #7FDBF1;
    box-shadow: 0 0 8px rgba(127, 219, 241, 0.4);
  }
}

.consent-switch__input:focus-visible + .consent-switch__slider {
  outline: 2px solid #7FDBF1;
  outline-offset: 2px;
}

// --- Panel footer ---
.consent-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 0 2.5rem 2rem;
}

// --- Shared buttons ---
.consent-btn {
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0.9rem 2rem;
  border-radius: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.consent-btn--primary {
  background: linear-gradient(315deg, #0A1E26, #11323F, #1A4453);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.5);

  &:hover {
    background: linear-gradient(135deg, rgba(127, 219, 241, 0.5) 0%, rgba(0, 136, 204, 0.5) 100%);
    border-color: rgba(127, 219, 241, 0.8);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 0 3px rgba(156, 156, 156, 0.269);
  }
}

.consent-btn--secondary {
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(127, 219, 241, 0.15);

  &:hover {
    background: rgba(11, 75, 103, 0.25);
    border-color: rgba(127, 219, 241, 0.4);
    color: #fff;
  }
}
</style>
