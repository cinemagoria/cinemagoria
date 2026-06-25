<template>
  <!-- Minimalist info trigger, teleported into the festival hero (top-right),
       mirroring the .back-link button that sits top-left of the same backdrop. -->
  <Teleport v-if="heroEl" :to="heroEl">
    <button
      class="hero-info-trigger"
      @click="openCoverage"
      aria-label="Why are some films missing?"
      title="Why are some films missing?"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    </button>
  </Teleport>

  <!-- Catalog-coverage modal -->
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="open" class="cov-overlay" @click.self="closeCoverage">
        <div class="cov-modal" role="dialog" aria-modal="true" aria-labelledby="cov-title">
          <button class="cov-close" @click="closeCoverage" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="cov-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>
          </div>

          <h3 id="cov-title" class="cov-title">Catalog Coverage</h3>

          <p class="cov-text">The number of features and shorts displayed here may not match the festival's official lineup. Our catalog is built from publicly available metadata and third-party sources, which may not cover every title, particularly short films, experimental works, or regional entries.</p>

          <p class="cov-text">This is a technical limitation, not an editorial choice. We don't censor, or intentionally omit any film. <nuxt-link to="/usage-policies" target="_blank" class="accent-link">Read full usage policies</nuxt-link>.</p>

          <div class="cov-actions">
            <button type="button" class="cov-btn cov-btn--report" @click="openReport">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              Report an issue
            </button>
            <button type="button" class="cov-btn cov-btn--gotit" @click="closeCoverage">
              Got it
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Error-report modal -->
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="reportOpen" class="report-overlay" @click.self="closeReport">
        <div class="report-card" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <button type="button" class="cov-close" @click="closeReport" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <transition name="state-fade" mode="out-in">
            <div v-if="reportState === 'form'" key="form" class="state-block">
              <h2 id="report-title" class="report-title">Report an issue</h2>
              <p class="report-subtitle">
                Spotted something off in this lineup? Tell us what's missing or incorrect and we'll review it.
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
                        name="festival-issue-type"
                        :value="opt.value"
                        v-model="form.issueType"
                      />
                      <span class="issue-option-label">{{ opt.label }}</span>
                    </label>
                  </div>
                </fieldset>

                <div class="field-group">
                  <label for="festival-report-description" class="field-label">
                    What's wrong?
                    <span class="field-required">*</span>
                  </label>
                  <textarea
                    id="festival-report-description"
                    v-model="form.description"
                    class="field-textarea"
                    placeholder="Describe what's missing or wrong — the more specific, the faster we can fix it."
                    rows="4"
                    maxlength="2000"
                    required
                  ></textarea>
                  <div class="char-count">{{ form.description.length }} / 2000</div>
                </div>

                <div class="field-row">
                  <div class="field-group">
                    <label for="festival-report-name" class="field-label">
                      Name <span class="field-optional">(optional)</span>
                    </label>
                    <input
                      id="festival-report-name"
                      v-model="form.name"
                      type="text"
                      class="field-input"
                      placeholder="Your name"
                      maxlength="100"
                    />
                  </div>
                  <div class="field-group">
                    <label for="festival-report-email" class="field-label">
                      Email <span class="field-optional">(optional)</span>
                    </label>
                    <input
                      id="festival-report-email"
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
                  <button type="button" class="btn btn-ghost" @click="closeReport" :disabled="submitting">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="!canSubmit || submitting">
                    <span v-if="submitting" class="btn-spinner"></span>
                    <span>{{ submitting ? 'Sending…' : 'Submit report' }}</span>
                  </button>
                </div>
              </form>
            </div>

            <div v-else-if="reportState === 'success'" key="success" class="state-block success-block">
              <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 class="success-title">Report received</h2>
              <p class="success-text">
                Thanks — your report has been submitted and will be reviewed.
              </p>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const route = useRoute();

const heroEl = ref(null);
const open = ref(false);
const reportOpen = ref(false);
const reportState = ref('form');
const submitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  issueType: 'missing',
  description: '',
  name: '',
  email: ''
});

const issueOptions = [
  { value: 'missing', label: 'Missing title' },
  { value: 'incorrect', label: 'Incorrect title' },
  { value: 'section_date', label: 'Wrong section or date' },
  { value: 'other', label: 'Other' }
];

const canSubmit = computed(() => form.description.trim().length >= 5);

// The disclaimer only mounts on /festival/<slug> pages, so the festival
// identity is read straight from the route — no per-page prop wiring needed.
const festivalSlug = computed(() => {
  const m = (route.path || '').match(/festival\/([^/]+)/);
  return m ? m[1] : '';
});

const festivalName = computed(() =>
  festivalSlug.value
    .split('-')
    .map(p => (/^\d{4}$/.test(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ')
);

function lockScroll(lock) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = lock ? 'hidden' : '';
}

function openCoverage() {
  open.value = true;
  lockScroll(true);
}

function closeCoverage() {
  open.value = false;
  if (!reportOpen.value) lockScroll(false);
}

function openReport() {
  resetForm();
  open.value = false;
  reportOpen.value = true;
  lockScroll(true);
}

function closeReport() {
  if (submitting.value) return;
  reportOpen.value = false;
  lockScroll(false);
}

function resetForm() {
  reportState.value = 'form';
  submitting.value = false;
  errorMessage.value = '';
  form.issueType = 'missing';
  form.description = '';
  form.name = '';
  form.email = '';
}

async function submitReport() {
  if (!canSubmit.value || submitting.value) return;
  submitting.value = true;
  errorMessage.value = '';

  try {
    const res = await $fetch('/api/festival-report', {
      method: 'POST',
      body: {
        festival_slug: festivalSlug.value,
        festival_name: festivalName.value,
        locale: 'en',
        issue_type: form.issueType,
        description: form.description.trim(),
        reporter_name: form.name.trim() || null,
        reporter_email: form.email.trim() || null
      }
    });

    if (res?.success) {
      reportState.value = 'success';
      setTimeout(() => {
        if (reportState.value === 'success') closeReport();
      }, 3500);
    } else {
      errorMessage.value = res?.message || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    errorMessage.value = err?.data?.statusMessage || err?.message || 'Could not send the report. Please try again.';
  } finally {
    submitting.value = false;
  }
}

function handleEsc(e) {
  if (e.key !== 'Escape') return;
  if (reportOpen.value) closeReport();
  else if (open.value) closeCoverage();
}

watch([open, reportOpen], ([a, b]) => {
  if (typeof window === 'undefined') return;
  if (a || b) window.addEventListener('keydown', handleEsc);
  else window.removeEventListener('keydown', handleEsc);
});

onMounted(async () => {
  await nextTick();
  // Anchor the trigger to the festival hero; if a page has no hero the
  // trigger simply doesn't render (graceful — every festival page has one).
  heroEl.value = document.querySelector('.festival-hero');
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleEsc);
  }
  lockScroll(false);
});
</script>

<style scoped>
/* ── Hero info trigger (mirrors .back-link, top-right of the backdrop) ── */
.hero-info-trigger {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-info-trigger svg {
  width: 20px;
  height: 20px;
}

.hero-info-trigger:hover {
  background: #fff;
  color: #000;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border-color: #fff;
}

@media (max-width: 768px) {
  .hero-info-trigger {
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
  }
  .hero-info-trigger svg {
    width: 18px;
    height: 18px;
  }
}

/* ── Shared overlay ──────────────────────────────────────────────── */
.cov-overlay,
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

/* ── Catalog-coverage modal (glassmorphism) ──────────────────────── */
.cov-modal {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  padding: 34px 28px 26px;
  width: 100%;
  max-width: 480px;
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
  text-align: center;
}

.cov-modal::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

/* ── Close button — red X, clearly visible on the dark card ──────── */
.cov-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 95, 95, 0.08);
  border: 1px solid rgba(255, 95, 95, 0.22);
  color: #ff5f5f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 3;
  padding: 0;
}

.cov-close:hover {
  background: rgba(255, 95, 95, 0.18);
  border-color: rgba(255, 95, 95, 0.5);
  color: #ff8585;
}

.cov-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 4px auto 16px;
  border-radius: 50%;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.25);
  color: #8BE9FD;
  filter: drop-shadow(0 0 10px rgba(139, 233, 253, 0.18));
}

.cov-title {
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.3px;
  margin: 0 0 14px;
  text-shadow: 0 0 20px rgba(139, 233, 253, 0.22);
}

.cov-text {
  color: #a0aab2;
  font-size: 14.5px;
  line-height: 1.65;
  margin: 0 0 12px;
  font-weight: 300;
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

.cov-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 22px;
}

.cov-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: 1px solid transparent;
}

.cov-btn--report {
  background: transparent;
  color: #8BE9FD;
  border-color: rgba(139, 233, 253, 0.35);
}

.cov-btn--report:hover {
  background: rgba(139, 233, 253, 0.1);
  border-color: #8BE9FD;
  transform: translateY(-1px);
}

.cov-btn--gotit {
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  color: #03242C;
  border-color: rgba(139, 233, 253, 0.5);
  box-shadow: 0 4px 16px rgba(139, 233, 253, 0.18);
}

.cov-btn--gotit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
}

/* ── Error-report modal ──────────────────────────────────────────── */
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
  margin: 0 auto;
  max-width: 380px;
}

/* ── Animations ──────────────────────────────────────────────────── */
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

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .cov-modal {
    padding: 30px 20px 22px;
    border-radius: 16px;
  }
  .cov-title {
    font-size: 20px;
  }
  .cov-text {
    font-size: 13.5px;
  }
  .cov-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }
  .cov-btn {
    width: 100%;
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

<!--
  Non-scoped layout override, kept from the original component. The ancestral
  `.switcher-container { top: 3.5rem }` is a visual-only offset (position:relative)
  that doesn't push siblings, so the switcher + WinnersCarousel below it overlap.
  We kill that offset and replace it with flow margin for a clean, tight rhythm.
  Loaded on every festival page because this component mounts on all of them.
-->
<style>
.switcher-container:has(~ .disclaimer-bar--top) {
  top: 0 !important;
  margin-top: 22px;
}
</style>
