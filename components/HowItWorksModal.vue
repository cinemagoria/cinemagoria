<template>
  <div :class="$style.modalOverlay" @click.self="$emit('close')">
    <div :class="$style.modalContent">
      <button @click="$emit('close')" :class="$style.closeButton" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div :class="$style.modalBody">
        <div :class="$style.intro">
          <h3>How Release Alerts Work</h3>
          <p>Following a person, show, or production company brings their release dates directly to the feed.</p>
        </div>

        <div :class="$style.carouselWrapper">
          <button :class="[$style.carouselArrow, $style.left]" @click="prevSlide" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div :class="$style.carouselTrack">
            <transition
              :enter-from-class="enterFromClass"
              :enter-active-class="$style.slideActive"
              :leave-to-class="leaveToClass"
              :leave-active-class="$style.slideActive"
              mode="out-in"
            >
              <div :class="$style.slide" :key="currentSlide">
                <template v-if="currentSlide === 0">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Step 1 &middot; Following People</span>
                  </div>
                  <p :class="$style.caption">On any director or actor profile, the <strong>Follow</strong> button subscribes the account to their upcoming releases.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_people.webp" width="2100" height="760" alt="Following a director" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 1">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Result &middot; Movie Release Alert</span>
                  </div>
                  <p :class="$style.caption">When a followed person releases a new title, it appears on the feed with its release date.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_movie.webp" width="2100" height="760" alt="Movie release notification" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 2">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Step 2 &middot; Following TV Shows</span>
                  </div>
                  <p :class="$style.caption">On any series page, the <strong>Follow</strong> button subscribes the account to its upcoming episodes.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_tv_show.webp" width="2100" height="760" alt="Following a TV show" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 3">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Result &middot; Episode Alert</span>
                  </div>
                  <p :class="$style.caption">Each new episode of a followed series appears with its season, number, and air date.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_tv.webp" width="2100" height="760" alt="Episode release notification" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 4">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Step 3 &middot; Following Production Companies</span>
                  </div>
                  <p :class="$style.caption">Following a studio (e.g. Film i V&auml;st) tracks every new title it releases.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_follow_prod.webp" width="2100" height="760" alt="Following a production company" loading="lazy" decoding="async">
                  </div>
                </template>

                <template v-else-if="currentSlide === 5">
                  <div :class="$style.slideHeader">
                    <span :class="$style.stepLabel">Result &middot; Studio Release Alert</span>
                  </div>
                  <p :class="$style.caption">Any new title from a followed studio appears on the feed with its release date.</p>
                  <div :class="$style.imageBox">
                    <img src="/onboarding/onboarding_notification_release_prod.webp" width="2100" height="760" alt="Production company release notification" loading="lazy" decoding="async">
                  </div>
                </template>
              </div>
            </transition>
          </div>

          <button :class="[$style.carouselArrow, $style.right]" @click="nextSlide" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div :class="$style.carouselDots">
          <button
            v-for="i in totalSlides"
            :key="i"
            :class="[$style.dot, currentSlide === i - 1 ? $style.active : '']"
            @click="goToSlide(i - 1)"
            :aria-label="`Slide ${i}`"
          ></button>
        </div>

        <div :class="$style.footer">
          <button :class="$style.gotItButton" @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowItWorksModal',
  data() {
    return {
      currentSlide: 0,
      direction: 'next',
      totalSlides: 6
    };
  },
  computed: {
    enterFromClass() {
      return this.direction === 'next' ? this.$style.enterRight : this.$style.enterLeft;
    },
    leaveToClass() {
      return this.direction === 'next' ? this.$style.leaveLeft : this.$style.leaveRight;
    }
  },
  methods: {
    prevSlide() {
      this.direction = 'prev';
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    },
    nextSlide() {
      this.direction = 'next';
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    },
    goToSlide(i) {
      if (i === this.currentSlide) return;
      this.direction = i > this.currentSlide ? 'next' : 'prev';
      this.currentSlide = i;
    }
  }
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 4, 6, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.modalContent {
  position: relative;
  background: rgba(3, 4, 6, 0.85);
  background-image:
    radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border-radius: 20px;
  width: 100%;
  max-width: 760px;
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
  display: block;
}

.modalContent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
  opacity: 0.8;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  pointer-events: none;
}

.closeButton {
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
  z-index: 3;
  padding: 0;

  &:hover {
    background: rgba(255, 95, 95, 0.1);
    border-color: rgba(255, 95, 95, 0.3);
    color: #ff7e7e;
  }
}

.modalBody {
  padding: 32px 28px 24px;
}

.intro {
  text-align: center;
  margin-bottom: 22px;

  h3 {
    font-size: 24px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
    text-shadow: 0 0 20px rgba(139, 233, 253, 0.25);
  }

  p {
    font-size: 14px;
    color: #a0aab2;
    line-height: 1.55;
    margin: 0 auto;
    max-width: 540px;
    font-weight: 300;
  }
}

.carouselWrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.carouselTrack {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.slide {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 233, 253, 0.2);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.slideHeader {
  margin-bottom: 12px;
}

.stepLabel {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #8BE9FD;
  font-weight: 700;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 999px;
  padding: 5px 12px;
  line-height: 1.4;
}

.caption {
  font-size: 14px;
  color: #e0e6ed;
  margin: 0 0 14px;
  line-height: 1.55;
  font-weight: 400;

  strong {
    color: #8BE9FD;
    font-weight: 600;
  }
}

.imageBox {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(139, 233, 253, 0.15);

  img {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 2100 / 760;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
}

.carouselArrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(3, 4, 6, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(139, 233, 253, 0.4);
  color: #8BE9FD;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover {
    background: #ffffff;
    border-color: #ffffff;
    color: #000;
    transform: scale(1.05);
  }
}

.carouselDots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(139, 233, 253, 0.22);
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 0;

  &.active {
    background: #8BE9FD;
    box-shadow: 0 0 8px rgba(139, 233, 253, 0.5);
    transform: scale(1.3);
  }

  &:hover:not(.active) {
    background: rgba(139, 233, 253, 0.45);
  }
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.gotItButton {
  padding: 11px 36px;
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(139, 233, 253, 0.28);
  }
}

.slideActive {
  transition: opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.enterRight { opacity: 0; transform: translateX(60px); }
.leaveLeft  { opacity: 0; transform: translateX(-60px); }
.enterLeft  { opacity: 0; transform: translateX(-60px); }
.leaveRight { opacity: 0; transform: translateX(60px); }

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 768px) {
  .modalOverlay {
    padding: 16px;
    align-items: center;
  }

  .modalContent {
    border-radius: 16px;
    max-height: calc(100vh - 32px);
  }

  .modalBody {
    padding: 28px 16px 20px;
  }

  .intro {
    margin-bottom: 18px;

    h3 { font-size: 20px; line-height: 1.25; }
    p { font-size: 13px; }
  }

  .carouselWrapper { gap: 6px; }

  .slide { padding: 12px; }

  .slideHeader { margin-bottom: 10px; }

  .stepLabel {
    font-size: 10px;
    letter-spacing: 1.2px;
    padding: 4px 10px;
  }

  .caption { font-size: 13px; margin-bottom: 10px; }

  .carouselArrow {
    width: 36px;
    height: 36px;
    background: rgba(3, 4, 6, 0.92);
    border-color: rgba(139, 233, 253, 0.55);
    border-width: 1.5px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);

    svg { width: 18px; height: 18px; }
  }

  .gotItButton {
    padding: 11px 32px;
    font-size: 13px;
    width: 100%;
    max-width: 260px;
  }
}
</style>
