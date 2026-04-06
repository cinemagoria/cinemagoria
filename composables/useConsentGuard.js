import { watch } from 'vue'
import { useConsentStore } from '~/stores/consent'

/**
 * Executes a callback only when the user has granted consent for a specific category.
 * Re-evaluates whenever consent preferences change.
 *
 * @param {string} category - 'analytics' | 'personalization'
 * @param {Function} onGranted - Called when consent is granted
 * @param {Function} [onRevoked] - Called when consent is revoked (optional cleanup)
 */
export function useConsentGuard(category, onGranted, onRevoked) {
  const consent = useConsentStore()

  watch(
    () => consent.preferences[category],
    (allowed) => {
      if (allowed) {
        onGranted()
      } else if (onRevoked) {
        onRevoked()
      }
    },
    { immediate: true }
  )
}
