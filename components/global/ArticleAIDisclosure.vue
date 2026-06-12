<template>
  <div class="ai-disclosure">
    <div class="disclosure-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v3"/>
        <circle cx="12" cy="2" r="0.6" fill="currentColor" stroke="none"/>
        <rect x="4" y="6" width="16" height="13" rx="2.5"/>
        <circle cx="8.8" cy="12" r="1.2"/>
        <circle cx="15.2" cy="12" r="1.2"/>
        <path d="M9.5 16h5"/>
        <path d="M2 13h2"/>
        <path d="M20 13h2"/>
      </svg>
    </div>
    <div class="disclosure-body">
      <p class="disclosure-text">
        This article was generated with the assistance of AI. Errors or inaccuracies may occur. If an issue is found, it can be reported for correction.
      </p>
      <button type="button" class="report-btn" @click="openModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
        Report an issue
      </button>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="isOpen" class="report-overlay" @click.self="closeModal">
          <div class="report-card" role="dialog" aria-modal="true" aria-labelledby="report-title">
            <button type="button" class="close-btn" @click="closeModal" aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <transition name="state-fade" mode="out-in">
              <div v-if="state === 'form'" key="form" class="state-block">
                <h2 id="report-title" class="report-title">Report an issue</h2>
                <p class="report-subtitle">
                  Help us correct this article. Pick what's off and tell us a bit more.
                </p>

                <form @submit.prevent="submitReport" class="report-form">
                  <fieldset class="issue-type-group">
                    <legend class="field-label">Type of issue</legend>
                    <div class="issue-options">
                      <label
                        v-for="opt in issueOptions"
                        :key="opt.value"
                        class="issue-option"
                        :class="{ 'is-selected': form.issueType === opt.value }"
                      >
                        <input
                          type="radio"
                          name="issue-type"
                          :value="opt.value"
                          v-model="form.issueType"
                        />
                        <span class="issue-option-label">{{ opt.label }}</span>
                      </label>
                    </div>
                  </fieldset>

                  <div class="field-group">
                    <label for="report-description" class="field-label">
                      What's wrong?
                      <span class="field-required">*</span>
                    </label>
                    <textarea
                      id="report-description"
                      v-model="form.description"
                      class="field-textarea"
                      placeholder="Describe the inaccuracy — the more specific, the faster we can fix it."
                      rows="4"
                      maxlength="2000"
                      required
                    ></textarea>
                    <div class="char-count">{{ form.description.length }} / 2000</div>
                  </div>

                  <div class="field-row">
                    <div class="field-group">
                      <label for="report-name" class="field-label">
                        Name <span class="field-optional">(optional)</span>
                      </label>
                      <input
                        id="report-name"
                        v-model="form.name"
                        type="text"
                        class="field-input"
                        placeholder="Your name"
                        maxlength="100"
                      />
                    </div>
                    <div class="field-group">
                      <label for="report-email" class="field-label">
                        Email <span class="field-optional">(optional)</span>
                      </label>
                      <input
                        id="report-email"
                        v-model="form.email"
                        type="email"
                        class="field-input"
                        placeholder="you@example.com"
                        maxlength="254"
                      />
                    </div>
                  </div>

                  <p v-if="errorMessage" class="error-banner">{{ errorMessage }}</p>

                  <div class="action-row">
                    <button type="button" class="btn btn-ghost" @click="closeModal" :disabled="submitting">
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="!canSubmit || submitting">
                      <span v-if="submitting" class="btn-spinner"></span>
                      <span>{{ submitting ? 'Sending…' : 'Submit report' }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div v-else-if="state === 'success'" key="success" class="state-block success-block">
                <div class="success-icon-wrap">
                  <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 class="success-title">Report received</h2>
                <p class="success-text">
                  The report has been submitted. It will be reviewed and the article corrected if necessary.
                </p>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  articleId: { type: [Number, String], required: true },
  articleSlug: { type: String, required: true },
  articleTitle: { type: String, default: '' }
})

const isOpen = ref(false)
const state = ref('form')
const submitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  issueType: 'information',
  description: '',
  name: '',
  email: ''
})

const issueOptions = [
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
  { value: 'information', label: 'Information' },
  { value: 'other', label: 'Other' }
]

const canSubmit = computed(() => form.description.trim().length >= 5)

function openModal() {
  resetForm()
  isOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

function closeModal() {
  if (submitting.value) return
  isOpen.value = false
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

function resetForm() {
  state.value = 'form'
  submitting.value = false
  errorMessage.value = ''
  form.issueType = 'information'
  form.description = ''
  form.name = ''
  form.email = ''
}

async function submitReport() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch('/api/article-report', {
      method: 'POST',
      body: {
        article_id: props.articleId,
        article_slug: props.articleSlug,
        article_title: props.articleTitle,
        locale: 'en',
        issue_type: form.issueType,
        description: form.description.trim(),
        reporter_name: form.name.trim() || null,
        reporter_email: form.email.trim() || null
      }
    })

    if (res?.success) {
      state.value = 'success'
      setTimeout(() => {
        if (state.value === 'success') closeModal()
      }, 3500)
    } else {
      errorMessage.value = res?.message || 'Something went wrong. Please try again.'
    }
  } catch (err) {
    errorMessage.value = err?.data?.statusMessage || err?.message || 'Could not send the report. Please try again.'
  } finally {
    submitting.value = false
  }
}

function handleEsc(e) {
  if (e.key === 'Escape' && isOpen.value) closeModal()
}

watch(isOpen, (open) => {
  if (typeof window === 'undefined') return
  if (open) window.addEventListener('keydown', handleEsc)
  else window.removeEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ── Inline disclosure ─────────────────────────────────────────── */
.ai-disclosure {
  margin: 36px 0 8px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px 20px;
  background: linear-gradient(135deg, rgba(31, 84, 103, 0.18), rgba(31, 84, 103, 0.06));
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.ai-disclosure::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.4), transparent);
}

.disclosure-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.22);
  color: #8BE9FD;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.disclosure-body {
  flex: 1;
  min-width: 0;
}

.disclosure-text {
  margin: 0 0 10px;
  color: #ACAFB5;
  font-size: 13.5px;
  line-height: 1.6;
  font-weight: 400;
}

.report-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.35);
  color: #8BE9FD;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.report-btn:hover {
  background: rgba(139, 233, 253, 0.1);
  border-color: #8BE9FD;
  transform: translateY(-1px);
}

/* ── Modal overlay ─────────────────────────────────────────────── */
.report-overlay {
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

.report-card {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  padding: 32px 28px 28px;
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

.report-card::before {
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

/* ── State container ───────────────────────────────────────────── */
.state-block {
  display: block;
}

.report-title {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
}

.report-subtitle {
  color: #a0aab2;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 22px;
  font-weight: 300;
}

/* ── Form ──────────────────────────────────────────────────────── */
.report-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.issue-type-group {
  border: none;
  padding: 0;
  margin: 0;
}

.field-label {
  display: block;
  color: #e0e6ed;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
}

.field-required {
  color: #8BE9FD;
  margin-left: 2px;
}

.field-optional {
  color: #6b7480;
  font-weight: 400;
  font-size: 12px;
}

.issue-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.issue-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.issue-option input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(139, 233, 253, 0.5);
  margin: 0;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  background: transparent;
}

.issue-option input[type="radio"]:checked {
  border-color: #8BE9FD;
}

.issue-option input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: #8BE9FD;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.6);
}

.issue-option-label {
  font-size: 13.5px;
  color: #e0e6ed;
  font-weight: 500;
}

.issue-option:hover {
  border-color: rgba(139, 233, 253, 0.4);
  background: rgba(31, 84, 103, 0.18);
}

.issue-option.is-selected {
  border-color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
}

.issue-option.is-selected .issue-option-label {
  color: #fff;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field-input,
.field-textarea {
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
  min-height: 90px;
  line-height: 1.5;
}

.field-input:focus,
.field-textarea:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12);
  background: rgba(0, 0, 0, 0.4);
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: rgba(160, 170, 178, 0.4);
}

.char-count {
  margin-top: 5px;
  text-align: right;
  font-size: 11px;
  color: #6b7480;
}

.error-banner {
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.25);
  color: #ff9999;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  margin: 0;
}

/* ── Actions ───────────────────────────────────────────────────── */
.action-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: #a0aab2;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.btn-primary {
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  color: #03242C;
  border-color: rgba(139, 233, 253, 0.5);
  box-shadow: 0 4px 16px rgba(139, 233, 253, 0.18);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(3, 36, 44, 0.3);
  border-top-color: #03242C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ── Success state ─────────────────────────────────────────────── */
.success-block {
  text-align: center;
  padding: 12px 0 8px;
}

.success-icon-wrap {
  width: 88px;
  height: 88px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.3);
  color: #8BE9FD;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 0 12px rgba(139, 233, 253, 0.3));
}

.success-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.success-text {
  color: #a0aab2;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
}

/* ── Animations ────────────────────────────────────────────────── */
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.state-fade-enter-active,
.state-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.state-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.state-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .ai-disclosure {
    padding: 14px 14px;
    gap: 10px;
    margin: 28px 0 4px;
  }
  .disclosure-icon {
    width: 30px;
    height: 30px;
  }
  .disclosure-icon svg {
    width: 16px;
    height: 16px;
  }
  .disclosure-text {
    font-size: 12.5px;
  }
  .report-card {
    padding: 28px 20px 22px;
    border-radius: 16px;
  }
  .report-title {
    font-size: 20px;
  }
  .report-subtitle {
    font-size: 13px;
    margin-bottom: 18px;
  }
  .issue-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .issue-option {
    padding: 9px 10px;
  }
  .issue-option-label {
    font-size: 12.5px;
  }
  .field-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .action-row {
    flex-direction: column-reverse;
    gap: 8px;
  }
  .btn {
    width: 100%;
  }
}
</style>
