<template>
  <div class="media-progress-bar">
    <div class="mpb-header">
      <h4 class="mpb-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        VIEWING PROGRESS
      </h4>
    </div>

    <div class="mpb-content">
      <div class="mpb-circle-wrap">
        <svg class="mpb-svg" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8AE8FC" />
              <stop offset="100%" stop-color="#50C8E8" />
            </linearGradient>
          </defs>
          <circle class="mpb-track" cx="60" cy="60" r="52" />
          <circle
            class="mpb-fill"
            cx="60" cy="60" r="52"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="mpb-percent-label">
          <span class="mpb-percent-value">{{ currentProgress }}</span>
          <span class="mpb-percent-sign">%</span>
        </div>
      </div>

      <div class="mpb-details">
        <div class="mpb-slider-row">
          <input
            type="range"
            class="mpb-slider"
            min="0"
            max="100"
            step="1"
            :value="currentProgress"
            @input="onSliderInput"
          />
        </div>

        <div class="mpb-time-stats" v-if="hasDuration">
          <div class="mpb-stat">
            <span class="mpb-stat-label">Watched</span>
            <span class="mpb-stat-value">{{ formattedElapsed }}</span>
          </div>
          <div class="mpb-stat">
            <span class="mpb-stat-label">Remaining</span>
            <span class="mpb-stat-value">{{ formattedRemaining }}</span>
          </div>
        </div>
        <div class="mpb-time-stats mpb-time-stats--no-duration" v-else>
          <span class="mpb-no-duration">Duration not available</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaProgressBar',

  props: {
    totalDurationInMinutes: {
      type: Number,
      default: 0,
    },
    initialProgressPercentage: {
      type: Number,
      default: 0,
    },
    mediaType: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      currentProgress: this.clamp(this.initialProgressPercentage),
    };
  },

  computed: {
    circumference() {
      return 2 * Math.PI * 52;
    },
    dashOffset() {
      return this.circumference * (1 - this.currentProgress / 100);
    },
    hasDuration() {
      return this.totalDurationInMinutes > 0;
    },
    elapsedMinutes() {
      if (!this.hasDuration) return 0;
      return this.totalDurationInMinutes * this.currentProgress / 100;
    },
    remainingMinutes() {
      if (!this.hasDuration) return 0;
      return this.totalDurationInMinutes - this.elapsedMinutes;
    },
    formattedElapsed() {
      return this.formatTime(this.elapsedMinutes);
    },
    formattedRemaining() {
      return this.formatTime(this.remainingMinutes);
    },
  },

  watch: {
    initialProgressPercentage(val) {
      this.currentProgress = this.clamp(val);
    },
  },

  methods: {
    clamp(val) {
      return Math.min(100, Math.max(0, Math.round(val || 0)));
    },
    formatTime(minutes) {
      if (!minutes || minutes < 0) return '0m';
      const m = Math.round(minutes);
      if (m < 60) return `${m}m`;
      const h = Math.floor(m / 60);
      const rem = m % 60;
      return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
    },
    onSliderInput(e) {
      this.currentProgress = this.clamp(Number(e.target.value));
      this.$emit('progress-updated', {
        percentage: this.currentProgress,
        elapsedMinutes: Math.round(this.elapsedMinutes),
        remainingMinutes: Math.round(this.remainingMinutes),
      });
    },
  },
};
</script>

<style scoped>
.media-progress-bar {
  background: linear-gradient(135deg, rgba(10, 30, 38, 0.8), rgba(17, 50, 63, 0.6));
  border: 1px solid rgba(138, 232, 252, 0.15);
  border-radius: 14px;
  padding: 1.6rem 2rem;
  margin: 2rem 0;
  transition: border-color 0.3s;
}
.media-progress-bar:hover {
  border-color: rgba(138, 232, 252, 0.3);
}

.mpb-header {
  margin-bottom: 1.2rem;
}
.mpb-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin: 0;
}
.mpb-title svg {
  color: #8AE8FC;
}

.mpb-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.mpb-circle-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
.mpb-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.mpb-track {
  fill: none;
  stroke: rgba(138, 232, 252, 0.1);
  stroke-width: 6;
}
.mpb-fill {
  fill: none;
  stroke: url(#progressGrad);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.35s ease;
}

.mpb-percent-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1;
}
.mpb-percent-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}
.mpb-percent-sign {
  font-size: 1.2rem;
  color: rgba(138, 232, 252, 0.8);
  font-weight: 600;
}

.mpb-details {
  flex: 1;
  min-width: 0;
}

.mpb-slider-row {
  margin-bottom: 1rem;
}
.mpb-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(138, 232, 252, 0.12);
  outline: none;
  cursor: pointer;
}
.mpb-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid rgba(10, 30, 38, 0.9);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(138, 232, 252, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.mpb-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 14px rgba(138, 232, 252, 0.6);
}
.mpb-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #8AE8FC;
  border: 2px solid rgba(10, 30, 38, 0.9);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(138, 232, 252, 0.4);
}

.mpb-time-stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.mpb-time-stats--no-duration {
  justify-content: center;
}
.mpb-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.mpb-stat-label {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}
.mpb-stat-value {
  font-size: 1.5rem;
  color: #fff;
  font-weight: 600;
}
.mpb-no-duration {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
}

@media (max-width: 480px) {
  .mpb-content {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .mpb-circle-wrap {
    width: 90px;
    height: 90px;
  }
  .mpb-details {
    width: 100%;
  }
}
</style>
