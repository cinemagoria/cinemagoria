import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'cookie_consent_preferences'

const DEFAULT_PREFERENCES = {
  essential: true,
  analytics: false,
  personalization: false,
}

export const useConsentStore = defineStore('consent', () => {
  const preferences = ref({ ...DEFAULT_PREFERENCES })
  const hasInteracted = ref(false)
  const showBanner = ref(false)
  const showPreferences = ref(false)

  const isAcceptedAll = computed(() =>
    preferences.value.analytics && preferences.value.personalization
  )

  const isDeclinedAll = computed(() =>
    !preferences.value.analytics && !preferences.value.personalization
  )

  function load() {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        preferences.value = {
          essential: true,
          analytics: !!parsed.analytics,
          personalization: !!parsed.personalization,
        }
        hasInteracted.value = true
        showBanner.value = false
      } else {
        // Migrate from legacy consent key
        const legacy = localStorage.getItem('cookieconsent')
        if (legacy) {
          const accepted = legacy === 'accepted'
          preferences.value = {
            essential: true,
            analytics: accepted,
            personalization: accepted,
          }
          hasInteracted.value = true
          showBanner.value = false
          save()
          localStorage.removeItem('cookieconsent')
        } else {
          showBanner.value = true
        }
      }
    } catch {
      showBanner.value = true
    }
  }

  function save() {
    if (typeof window === 'undefined') return

    const data = {
      essential: true,
      analytics: preferences.value.analytics,
      personalization: preferences.value.personalization,
      timestamp: new Date().toISOString(),
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage unavailable — consent still applied for this session
    }

    hasInteracted.value = true
    showBanner.value = false
    showPreferences.value = false
  }

  function acceptAll() {
    preferences.value.analytics = true
    preferences.value.personalization = true
    save()
  }

  function declineAll() {
    preferences.value.analytics = false
    preferences.value.personalization = false
    save()
  }

  function saveCustom(prefs) {
    preferences.value.analytics = !!prefs.analytics
    preferences.value.personalization = !!prefs.personalization
    save()
  }

  function openPreferences() {
    showPreferences.value = true
  }

  function closePreferences() {
    showPreferences.value = false
  }

  function resetConsent() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    preferences.value = { ...DEFAULT_PREFERENCES }
    hasInteracted.value = false
    showBanner.value = true
    showPreferences.value = false
  }

  function isAllowed(category) {
    return !!preferences.value[category]
  }

  return {
    preferences,
    hasInteracted,
    showBanner,
    showPreferences,
    isAcceptedAll,
    isDeclinedAll,
    load,
    acceptAll,
    declineAll,
    saveCustom,
    openPreferences,
    closePreferences,
    resetConsent,
    isAllowed,
  }
})
