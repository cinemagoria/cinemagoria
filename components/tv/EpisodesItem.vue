<template>
  <div :class="$style.item">
    <div :class="$style.image" style="border-radius:15px; position:relative;">
      <img
        v-if="poster"
        :src="poster"
        loading="lazy"
        :alt="episode.name">

      <img
        v-else
        src="/placeholders/image_not_found_yet_horizontal.webp"
        alt="Image not found"
        style="width: 100%; height: 100%; object-fit: cover; padding: 3rem;">
        
      <div v-if="userEmail" :class="$style.trackOverlayBtn">
        <button :class="$style.trackBtnAbsolute" @click="showModal = true" aria-label="Track Progress" title="Track Progress">
          <div :class="$style.circularProgress">
            <svg viewBox="0 0 36 36" :class="$style.circularSvg">
              <path :class="$style.circleBg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path :class="$style.circleFg"
                :stroke-dasharray="`${localProgress || 0}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span :class="$style.circularPct">{{ localProgress || 0 }}<span style="font-size: 0.6em; margin-left: 1px;">%</span></span>
          </div>
        </button>
      </div>
    </div>

    <h2 :class="$style.name">
      <strong>E{{ numberWithDoubleDigits(episode.episode_number) }}</strong> {{ episode.name }}
    </h2>

    <div :class="$style.overview">
      {{ truncate(episode.overview, 300) }}
    </div>



    <div v-if="showModal" class="ep-modal-overlay" @click.self="showModal = false">
      <div class="ep-modal">
        <div class="ep-modal-header">
          <h3>S{{ numberWithDoubleDigits(episode.season_number) }}E{{ numberWithDoubleDigits(episode.episode_number) }} · {{ episode.name }}</h3>
          <button class="ep-close-btn" @click="showModal = false">×</button>
        </div>
        
        <div class="mpb-section" style="margin-bottom: 20px;">
          <div class="mpb-row">
            <div class="mpb-circle-wrap">
              <svg class="mpb-svg" viewBox="0 0 120 120">
                <defs><linearGradient id="pgE" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8AE8FC"/><stop offset="100%" stop-color="#50C8E8"/></linearGradient></defs>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(138,232,252,0.1)" stroke-width="6"/>
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#pgE)" stroke-width="6" stroke-linecap="round" :stroke-dasharray="2 * Math.PI * 52" :stroke-dashoffset="2 * Math.PI * 52 * (1 - progressPercentage / 100)" style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset .35s ease"/>
              </svg>
              <div class="mpb-pct"><span class="mpb-pct-num">{{ progressPercentage }}</span><span class="mpb-pct-sign">%</span></div>
            </div>
            <div class="mpb-controls">
              <input type="range" class="mpb-slider" min="0" max="100" step="1" v-model.number="progressPercentage" />
            </div>
          </div>
        </div>

        <div class="ep-modal-actions">
          <button class="ep-cancel-btn" @click="showModal = false">Cancel</button>
          <button class="ep-save-btn" @click="saveProgress">Save Progress</button>
        </div>
      </div>
    </div>

    <div
      v-if="episode.air_date"
      :class="$style.aired">
      {{ fullDate(episode.air_date) }}
    </div>
  </div>
</template>

<script>
import { apiImgUrl } from '~/utils/api';

export default {
  props: {
    episode: {
      type: Object,
      required: true,
    },
    userEmail: {
      type: String,
      default: '',
    }
  },
  
  data() {
    return {
      progressPercentage: 0,
      localProgress: 0,
      progressLoading: false,
      showModal: false
    };
  },

  computed: {
    poster () {
      if (this.episode.still_path) {
        return `${apiImgUrl}/w400${this.episode.still_path}`;
      } else {
        return null;
      }
    },
  },

  mounted() {
    if (this.userEmail) {
      this.loadProgress();
    }
  },
  
  watch: {
    userEmail(newVal) {
      if (newVal) this.loadProgress();
    },
    showModal(newVal) {
      if (newVal) {
        this.progressPercentage = this.localProgress;
      }
    }
  },

  methods: {
    async loadProgress() {
      if (!this.userEmail || !this.episode?.id) return;
      this.progressLoading = true;
      try {
        const resp = await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/episode/${this.episode.id}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.found) {
            this.progressPercentage = data.progress_percentage || 0;
            this.localProgress = data.progress_percentage || 0;
          }
        }
      } catch (e) { /* silent */ } finally {
        this.progressLoading = false;
      }
    },
    async saveProgress() {
      if (!this.userEmail || !this.episode?.id) return;
      const dur = this.episode.runtime || 0;
      const elapsed = dur ? Math.round(dur * this.progressPercentage / 100) : 0;
      try {
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/episode/${this.episode.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            progress_percentage: this.progressPercentage, 
            elapsed_minutes: elapsed, 
            total_duration_minutes: dur,
            tv_id: this.$route.params.id || null,
            season_number: this.episode.season_number || null,
            episode_number: this.episode.episode_number || null
          })
        });
        this.localProgress = this.progressPercentage;
        this.showModal = false;
        
        // Let the parent know for the "Mark Season" functionality to be aware, though we can skip emitting for now.
        this.$emit('progress-saved', { id: this.episode.id, percentage: this.progressPercentage });
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (e) { /* silent */ }
    },

    async setProgressWithoutModal(percentage) {
      if (!this.userEmail || !this.episode?.id) return;
      this.progressPercentage = percentage;
      this.localProgress = percentage;
      const dur = this.episode.runtime || 0;
      const elapsed = dur ? Math.round(dur * percentage / 100) : 0;
      try {
        await fetch(`/api/progress/${encodeURIComponent(this.userEmail)}/episode/${this.episode.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            progress_percentage: percentage, 
            elapsed_minutes: elapsed, 
            total_duration_minutes: dur,
            tv_id: this.$route.params.id || null,
            season_number: this.episode.season_number || null,
            episode_number: this.episode.episode_number || null
          })
        });
        window.dispatchEvent(new CustomEvent('progress-updated'));
      } catch (e) { /* silent */ }
    },

    numberWithDoubleDigits(number) {
      if (number < 10) {
        return `0${number}`;
      }
      return number;
    },

    truncate(text, length, clamp) {
      text = text || '';
      clamp = clamp || '...';
      length = length || 30;

      if (text.length <= length) return text;

      let tcText = text.slice(0, length - clamp.length);
      let last = tcText.length - 1;

      while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1;

      last = last || length - clamp.length;

      tcText = tcText.slice(0, last);

      return tcText + clamp;
    },

    fullDate(string) {
      if (!string) return '';
      const dateArray = string.split('-');
      const date = dateArray[2].substr(0, 1) === '0' ? dateArray[2].substr(1, 1) : dateArray[2];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      return `${date} ${months[dateArray[1] - 1]} ${dateArray[0]}`;
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 2rem;

  @media (min-width: $breakpoint-xsmall) {
    width: 50%;
  }

  @media (min-width: $breakpoint-medium) {
    width: 33.3333333%;
  }

  @media (min-width: 1450px) {
    width: 25%;
  }

  @media (min-width: 2000px) {
    width: 20%;
  }

  @media (min-width: 3000px) {
    width: 16.6666667%;
  }
}

.image {
  position: relative;
  height: 0;
  padding-top: 56.25%;
  margin-bottom: 1.5rem;
  overflow: hidden;
  background-color: $secondary-color;

  img,
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.trackOverlayBtn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.trackBtnAbsolute {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #fff;
  border: 1px solid rgba(138, 232, 252, 0.3);
  border-radius: 50%;
  width: 72px;
  height: 72px;
  padding: 0;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.trackBtnAbsolute:hover {
  background-color: #0d1218;
  border-color: #8AE8FC;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
}

.circularProgress {
  position: relative;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circularSvg {
  width: 100%;
  height: 100%;
  transform: rotate(0deg);
}

.circleBg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2.5;
}

.circleFg {
  fill: none;
  stroke: #8AE8FC;
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.circularPct {
  position: absolute;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: baseline;
}

.name {
  margin-bottom: 1rem;
  font-size: 1.6rem;
  letter-spacing: $letter-spacing;

  strong {
    color: $cyan-color;
  }
}

.overview {
  flex: 1 0 auto;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: $text-color;
}

.aired {
  font-size: 1.2rem;
  color: $text-color-grey;
  letter-spacing: $letter-spacing;

  @media (min-width: $breakpoint-large) {
    font-size: 1.4rem;
  }
}

.trackBtn {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  background: rgba(138,232,252,0.1);
  color: #8AE8FC;
  border: 1px solid rgba(138,232,252,0.2);
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    background: rgba(138,232,252,0.2);
    border-color: rgba(138,232,252,0.4);
  }
}
</style>

<style lang="scss">
.ep-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.ep-modal {
  background: #0d1218;
  border: 1px solid rgba(138, 232, 252, 0.3);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.ep-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.ep-close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;

  &:hover { opacity: 1; }
}

.ep-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.ep-cancel-btn {
  padding: 10px 16px;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover { background: rgba(255,255,255,0.1); }
}

.ep-save-btn {
  padding: 10px 20px;
  background: #8BE9FD;
  color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;

  &:hover { background: #6CE0F9; }
}

/* ── Progress tracking in modal ──────────────────────────── */
.mpb-section {
  width: 100%;
  background: rgba(0,0,0,0.15);
  border: 1px solid rgba(138,232,252,0.1);
  border-radius: 10px;
  padding: 14px 16px;
}
.mpb-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.mpb-circle-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.mpb-svg { width: 100%; height: 100%; }
.mpb-pct {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  line-height: 1;
}
.mpb-pct-num { font-size: 1.8rem; font-weight: 700; color: #fff; }
.mpb-pct-sign { font-size: 1rem; color: rgba(138,232,252,0.8); font-weight: 600; }
.mpb-controls { flex: 1; min-width: 0; }
.mpb-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: rgba(138,232,252,0.12);
  outline: none;
  cursor: pointer;
  margin-bottom: 10px;
}
.mpb-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid rgba(10,30,38,0.9);
  cursor: pointer;
  box-shadow: 0 0 6px rgba(138,232,252,0.4);
}
.mpb-slider::-moz-range-thumb {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid rgba(10,30,38,0.9);
  cursor: pointer;
}
</style>
