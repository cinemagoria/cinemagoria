<template>
  <main class="page">
    <UserNav />

    <header class="hero">
      <div class="heroInner">
        <span class="eyebrow">Help &amp; Inquiries</span>
        <h1 class="heroTitle">Contact Support</h1>
        <p class="heroLead">
          Reach out about an account, a watchlist, a missing title, or any other inquiry related to the platform.
        </p>
      </div>
    </header>

    <div class="layout">
      <div class="formCard">
        <form @submit.prevent="submitForm" class="contactForm" novalidate>
          <transition name="state-fade" mode="out-in">
            <div v-if="state === 'success'" key="success" class="successState">
              <div class="successIcon">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 class="successTitle">Message received</h2>
              <p class="successText">The message has been delivered. A reply will follow soon at the email provided.</p>
              <button type="button" class="ghostBtn" @click="resetForm">Send another</button>
            </div>

            <div v-else key="form" class="formBlock">
              <div class="fieldRow">
                <div class="fieldGroup">
                  <label for="name" class="fieldLabel">Name</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="fieldInput"
                    placeholder="Full name"
                    maxlength="100"
                    required
                  />
                </div>

                <div class="fieldGroup">
                  <label for="email" class="fieldLabel">Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="fieldInput"
                    placeholder="name@example.com"
                    maxlength="254"
                    required
                  />
                </div>
              </div>

              <div class="fieldGroup">
                <label for="subject" class="fieldLabel">Subject</label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  class="fieldInput"
                  placeholder="Inquiry topic"
                  maxlength="200"
                  required
                />
              </div>

              <div class="fieldGroup">
                <label for="message" class="fieldLabel">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="fieldTextarea"
                  placeholder="Describe the inquiry &mdash; the more specific, the faster it can be addressed."
                  rows="6"
                  maxlength="5000"
                  required
                ></textarea>
                <div class="charCount">{{ form.message.length }} / 5000</div>
              </div>

              <p v-if="errorMessage" class="errorBanner">{{ errorMessage }}</p>

              <div class="actionRow">
                <button
                  type="submit"
                  class="primaryBtn"
                  :disabled="!canSubmit || loading"
                >
                  <span v-if="loading" class="btnSpinner"></span>
                  <span>{{ loading ? 'Sending…' : 'Send message' }}</span>
                </button>
              </div>
            </div>
          </transition>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import UserNav from '@/components/global/UserNav';

useHead({
  title: 'Contact Support',
  meta: [
    { name: 'description', content: 'Reach the team behind the platform for questions about an account, watchlists, missing titles, festival data, or editorial coverage.' },
    { property: 'og:title', content: 'Contact Support' },
  ],
});

const state = ref('form');
const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const canSubmit = computed(() => {
  return form.name.trim().length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    && form.subject.trim().length >= 2
    && form.message.trim().length >= 10;
});

async function submitForm() {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      state.value = 'success';
      Object.assign(form, { name: '', email: '', subject: '', message: '' });
    } else {
      throw new Error(data.error || 'Failed to send message');
    }
  } catch (err) {
    console.error('Contact error:', err);
    errorMessage.value = 'Could not send the message. Please try again in a moment.';
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  state.value = 'form';
  errorMessage.value = '';
}
</script>

<style scoped lang="scss">
/* ── Page shell ─────────────────────────────────────────────────── */
.page {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 60% at 15% -10%, rgba(31, 84, 103, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 5%, rgba(139, 233, 253, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 60% at 50% 95%, rgba(31, 84, 103, 0.12) 0%, transparent 60%),
    linear-gradient(180deg, #02080d 0%, #010406 100%);
  color: rgba(255, 255, 255, 0.86);
  padding-bottom: 6rem;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* ── Hero ───────────────────────────────────────────────────────── */
.hero {
  padding: var(--page-header-space-top) 1.5rem var(--page-header-space-bottom);
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 240px;
    max-width: 60%;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.45), transparent);
  }
}

.heroInner {
  max-width: 640px;
  margin: 0 auto;
}

.eyebrow {
  display: inline-block;
  font-size: var(--page-eyebrow-size);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 999px;
  background: rgba(139, 233, 253, 0.08);
  margin-bottom: 1.4rem;
}

.heroTitle {
  font-family: var(--font-display);
  font-size: var(--page-title-size);
  font-weight: var(--page-title-weight);
  color: var(--page-title-color);
  margin: 0 0 var(--page-header-space-title);
  letter-spacing: var(--page-title-tracking);
  line-height: var(--page-title-leading);
  text-shadow: var(--page-title-glow);
  text-wrap: balance;
}

.heroLead {
  font-family: var(--font-display);
  font-size: var(--page-subtitle-size);
  line-height: var(--page-subtitle-leading);
  letter-spacing: var(--page-subtitle-tracking);
  color: var(--page-subtitle-color);
  margin: 0 auto;
  max-width: var(--page-subtitle-measure);
  font-weight: var(--page-subtitle-weight);
  text-wrap: pretty;
}

/* ── Layout: centered single column ────────────────────────────── */
.layout {
  max-width: 720px;
  margin: 2.5rem auto 0;
  padding: 0 1.5rem;

  @media (max-width: 920px) {
    margin-top: 1.5rem;
  }
}

/* ── Form card ─────────────────────────────────────────────────── */
.formCard {
  position: relative;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.18), transparent 50%),
    radial-gradient(circle at 90% 95%, rgba(139, 233, 253, 0.06), transparent 40%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 18px;
  padding: 2.4rem 2.2rem 2rem;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.85;
    pointer-events: none;
  }
}

.contactForm {
  display: block;
}

.formBlock {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.fieldRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.fieldGroup {
  display: flex;
  flex-direction: column;
}

.fieldLabel {
  display: block;
  color: #e0e6ed;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.2px;
}

.fieldInput,
.fieldTextarea {
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

.fieldTextarea {
  resize: vertical;
  min-height: 130px;
  line-height: 1.55;
}

.fieldInput:focus,
.fieldTextarea:focus {
  border-color: rgba(139, 233, 253, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.12);
  background: rgba(0, 0, 0, 0.4);
}

.fieldInput::placeholder,
.fieldTextarea::placeholder {
  color: rgba(160, 170, 178, 0.45);
}

.charCount {
  margin-top: 5px;
  text-align: right;
  font-size: 11px;
  color: #6b7480;
}

.errorBanner {
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.25);
  color: #ff9999;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  margin: 0;
}

.actionRow {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.primaryBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #1F5467, #8BE9FD);
  border: 1px solid rgba(139, 233, 253, 0.5);
  border-radius: 10px;
  color: #03242C;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(139, 233, 253, 0.18);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.btnSpinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(3, 36, 44, 0.3);
  border-top-color: #03242C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Success state ─────────────────────────────────────────────── */
.successState {
  text-align: center;
  padding: 1.5rem 0 0.5rem;
}

.successIcon {
  width: 92px;
  height: 92px;
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

@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.successTitle {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.successText {
  color: #a0aab2;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 auto 22px;
  max-width: 380px;
  font-weight: 300;
}

.ghostBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 22px;
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.35);
  border-radius: 10px;
  color: #8BE9FD;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: rgba(139, 233, 253, 0.08);
    border-color: #8BE9FD;
  }
}

.state-fade-enter-active,
.state-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.state-fade-enter-from { opacity: 0; transform: translateY(10px); }
.state-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* ── Responsive ────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero { padding-right: 1rem; padding-left: 1rem; }
  .layout { padding: 0 1rem; }
  .formCard { padding: 1.8rem 1.3rem 1.5rem; border-radius: 16px; }
}

@media (max-width: 480px) {
  .eyebrow { padding: 5px 12px; margin-bottom: 1rem; }
  .formCard { padding: 1.6rem 1rem 1.3rem; }
  .primaryBtn { width: 100%; padding: 13px 24px; }
  .actionRow { justify-content: stretch; }
}
</style>
