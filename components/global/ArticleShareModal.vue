<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="open" class="share-overlay" @click.self="close">
        <div class="share-card" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <button type="button" class="close-btn" @click="close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <h2 id="share-title" class="share-title">Share this article</h2>
          <p class="share-subtitle">Send the link to a friend, post it, or copy it.</p>

          <!-- Link + copy -->
          <div class="field-group">
            <label class="field-label" for="share-link-input">Link</label>
            <div class="link-row">
              <input
                id="share-link-input"
                ref="linkInput"
                type="text"
                :value="shareUrl"
                readonly
                class="link-input"
                @click="selectLink"
              />
              <button
                type="button"
                class="copy-btn"
                :class="{ 'is-success': copySuccess }"
                @click="copyLink"
                :aria-label="copySuccess ? 'Copied' : 'Copy link'"
              >
                <svg v-if="!copySuccess" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ copySuccess ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <!-- Editable title -->
          <div class="field-group">
            <label class="field-label" for="share-custom-title">Title</label>
            <input
              id="share-custom-title"
              v-model="customTitle"
              type="text"
              class="field-input"
              maxlength="200"
            />
          </div>

          <!-- Editable message -->
          <div class="field-group">
            <label class="field-label" for="share-custom-message">Message</label>
            <textarea
              id="share-custom-message"
              v-model="customMessage"
              class="field-textarea"
              rows="3"
              maxlength="800"
            ></textarea>
          </div>

          <!-- Social buttons -->
          <div class="field-group">
            <label class="field-label">Share on</label>
            <div class="social-row">
              <button
                v-if="canNativeShare"
                type="button"
                class="social-btn social-native"
                @click="nativeShare"
                aria-label="Share with your device"
                title="Device share"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>

              <button
                type="button"
                class="social-btn social-wa"
                @click="shareTo('whatsapp')"
                aria-label="Share on WhatsApp"
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>

              <button
                type="button"
                class="social-btn social-tg"
                @click="shareTo('telegram')"
                aria-label="Share on Telegram"
                title="Telegram"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>

              <button
                type="button"
                class="social-btn social-x"
                @click="shareTo('twitter')"
                aria-label="Share on X"
                title="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              <button
                type="button"
                class="social-btn social-fb"
                @click="shareTo('facebook')"
                aria-label="Share on Facebook"
                title="Facebook"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                </svg>
              </button>

              <button
                type="button"
                class="social-btn social-em"
                @click="shareTo('email')"
                aria-label="Share via Email"
                title="Email"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 7l-10 6L2 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  articleTitle: { type: String, default: '' },
  articleDescription: { type: String, default: '' },
  articleSlug: { type: String, required: true }
})

const emit = defineEmits(['close'])

const customTitle = ref('')
const customMessage = ref('')
const copySuccess = ref(false)
const linkInput = ref(null)

const shareUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/news/${props.articleSlug}`
})

const canNativeShare = computed(() => {
  if (typeof navigator === 'undefined') return false
  return typeof navigator.share === 'function'
})

function buildDefaults() {
  const title = props.articleTitle || 'this article'
  customTitle.value = `I'd like to share "${title}" from Cinemagoria`
  customMessage.value = props.articleDescription || ''
}

function close() {
  emit('close')
}

function selectLink() {
  if (linkInput.value) linkInput.value.select()
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch (err) {
    try {
      if (linkInput.value) {
        linkInput.value.select()
        document.execCommand('copy')
        copySuccess.value = true
        setTimeout(() => { copySuccess.value = false }, 2000)
      }
    } catch (e) {
      console.error('Could not copy link', e)
    }
  }
}

function shareTo(platform) {
  const url = shareUrl.value
  const title = customTitle.value.trim()
  const message = customMessage.value.trim()
  const body = [title, message].filter(Boolean).join('. ')

  let target = ''
  if (platform === 'whatsapp') {
    target = `https://wa.me/?text=${encodeURIComponent(`${body} ${url}`)}`
  } else if (platform === 'telegram') {
    target = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(body)}`
  } else if (platform === 'twitter') {
    target = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${body} ${url}`)}`
  } else if (platform === 'facebook') {
    target = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(body)}`
  } else if (platform === 'email') {
    target = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`
  }
  if (target) window.open(target, '_blank', 'noopener,noreferrer')
}

async function nativeShare() {
  try {
    await navigator.share({
      title: customTitle.value,
      text: customMessage.value,
      url: shareUrl.value
    })
  } catch (err) {
    if (err?.name !== 'AbortError') console.error(err)
  }
}

function handleEsc(e) {
  if (e.key === 'Escape' && props.open) close()
}

watch(() => props.open, (isOpen) => {
  if (typeof window === 'undefined') return
  if (isOpen) {
    buildDefaults()
    copySuccess.value = false
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleEsc)
  }
})

watch(() => [props.articleTitle, props.articleDescription], () => {
  if (props.open) buildDefaults()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ── Overlay + card (mirrors ArticleAIDisclosure modal) ───────── */
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.share-card {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  padding: 32px 28px 26px;
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(31, 84, 103, 0.5),
    inset 0 0 24px rgba(139, 233, 253, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.share-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a0aab2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.close-btn:hover {
  background: rgba(255, 95, 95, 0.1);
  border-color: rgba(255, 95, 95, 0.3);
  color: #ff7e7e;
}

/* ── Headings ──────────────────────────────────────────────────── */
.share-title {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
}

.share-subtitle {
  color: #a0aab2;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 22px;
  font-weight: 300;
}

/* ── Fields ────────────────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field-label {
  display: block;
  color: #e0e6ed;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
}

.field-input,
.field-textarea,
.link-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 10px;
  padding: 11px 14px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.field-input:focus,
.field-textarea:focus,
.link-input:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12);
  background: rgba(0, 0, 0, 0.4);
}

/* ── Link row ──────────────────────────────────────────────────── */
.link-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.link-input {
  flex: 1;
  min-width: 0;
  color: #8BE9FD;
  font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
  font-size: 13px;
  cursor: text;
}

.copy-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.copy-btn:hover {
  background: rgba(139, 233, 253, 0.15);
  border-color: #8BE9FD;
}

.copy-btn.is-success {
  background: rgba(76, 217, 100, 0.12);
  border-color: rgba(76, 217, 100, 0.55);
  color: #6ee07d;
}

/* ── Socials ───────────────────────────────────────────────────── */
.social-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.18);
  color: #e0e6ed;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.social-btn:hover {
  transform: translateY(-2px);
  border-color: #8BE9FD;
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  box-shadow: 0 4px 14px rgba(139, 233, 253, 0.18);
}

.social-native:hover { color: #8BE9FD; }
.social-wa:hover { color: #25D366; border-color: rgba(37, 211, 102, 0.6); box-shadow: 0 4px 14px rgba(37, 211, 102, 0.25); }
.social-tg:hover { color: #29A9EB; border-color: rgba(41, 169, 235, 0.6); box-shadow: 0 4px 14px rgba(41, 169, 235, 0.25); }
.social-x:hover  { color: #fff;    border-color: rgba(255, 255, 255, 0.55); box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15); }
.social-fb:hover { color: #1877F2; border-color: rgba(24, 119, 242, 0.6); box-shadow: 0 4px 14px rgba(24, 119, 242, 0.25); }
.social-em:hover { color: #ffb74d; border-color: rgba(255, 183, 77, 0.55); box-shadow: 0 4px 14px rgba(255, 183, 77, 0.18); }

/* ── Animations / transitions ──────────────────────────────────── */
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .share-card {
    padding: 28px 20px 22px;
    border-radius: 16px;
  }
  .share-title {
    font-size: 20px;
  }
  .share-subtitle {
    font-size: 13px;
    margin-bottom: 18px;
  }
  .social-btn {
    width: 42px;
    height: 42px;
    border-radius: 11px;
  }
  .copy-btn span {
    display: none;
  }
  .copy-btn {
    padding: 0 12px;
  }
}
</style>
