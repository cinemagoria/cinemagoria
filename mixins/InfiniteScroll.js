/**
 * InfiniteScroll — mixin for CSS-animated infinite horizontal carousels.
 *
 * Provides:
 *   - hover / focus pause (via the consumer's own :hover, :focus-within styles)
 *   - "on-the-fly" manual drag (pointer) and wheel (Magic Mouse horizontal swipe)
 *     — animation pauses, the track tracks the user's finger/wheel, and after
 *     an idle window (~1.4s) the animation resumes from the new position
 *   - arrow-button seek (nudge forward/backward via animation-delay)
 *
 * Consumer contract — every component that uses this mixin must:
 *   1. Define `infiniteDuration` (seconds) in `data()`, matching the CSS
 *      animation duration on `.inf__track`.
 *   2. Render the viewport and track with refs:
 *        <div class="inf__viewport" ref="viewport">
 *          <div
 *            class="inf__track"
 *            ref="track"
 *            :class="{ 'is-manual': isManual }"
 *            :style="{
 *              animationDelay: `${seek}s`,
 *              '--manual-x': `${manualX}px`,
 *            }">
 *            ...duplicated items...
 *          </div>
 *        </div>
 *   3. In its SCSS, ship a `.inf__track.is-manual` variant that disables
 *      the animation and uses `translate3d(var(--manual-x), 0, 0)` instead.
 *
 * Why `animation-delay` for resume: it's a pure-CSS seek — the browser handles
 * the frame-by-frame animation, JS just moves the playhead. No rAF/setInterval.
 */

const IDLE_RESUME_MS = 1400;

export default {
  data () {
    return {
      seek: 0,        // negative seconds → seek forward in animation cycle
      manualX: 0,     // pixel translate used while in manual mode
      isManual: false,
    };
  },

  mounted () {
    if (typeof window === 'undefined') return;
    const vp = this.$refs.viewport;
    if (!vp) return;

    this._infBound = {
      wheel: (e) => this._infOnWheel(e),
      pointerDown: (e) => this._infOnPointerDown(e),
      pointerMove: (e) => this._infOnPointerMove(e),
      pointerUp: () => this._infOnPointerUp(),
    };

    vp.addEventListener('wheel', this._infBound.wheel, { passive: false });
    vp.addEventListener('pointerdown', this._infBound.pointerDown);
    window.addEventListener('pointermove', this._infBound.pointerMove);
    window.addEventListener('pointerup', this._infBound.pointerUp);
    window.addEventListener('pointercancel', this._infBound.pointerUp);
  },

  beforeUnmount () {
    const vp = this.$refs.viewport;
    if (vp && this._infBound) {
      vp.removeEventListener('wheel', this._infBound.wheel);
      vp.removeEventListener('pointerdown', this._infBound.pointerDown);
    }
    if (this._infBound) {
      window.removeEventListener('pointermove', this._infBound.pointerMove);
      window.removeEventListener('pointerup', this._infBound.pointerUp);
      window.removeEventListener('pointercancel', this._infBound.pointerUp);
    }
    clearTimeout(this._infIdleTimer);
  },

  methods: {
    // Arrow-button seek — jumps the animation playhead forward / backward.
    nudge (dir) {
      // dir === 1 (right) → advance playback; dir === -1 (left) → rewind
      this.seek -= dir * 3;
    },

    _infEnterManual () {
      if (this.isManual) return;
      const track = this.$refs.track;
      if (!track) return;
      // Snapshot the animation's current transform so the switch to manual
      // mode is seamless (no visual jump).
      const matrix = new DOMMatrix(getComputedStyle(track).transform);
      this.manualX = matrix.m41;
      this.isManual = true;
    },

    _infExitManual () {
      const track = this.$refs.track;
      const duration = this.infiniteDuration || 60;
      if (track) {
        // scrollWidth / 2 because we render items twice to get the seamless loop.
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          // Normalise manualX into [-halfWidth, 0] so we can map to progress.
          let norm = this.manualX % halfWidth;
          if (norm > 0) norm -= halfWidth;
          const progress = Math.abs(norm) / halfWidth; // 0 → 1 through cycle
          this.seek = -(progress * duration);
        }
      }
      this.isManual = false;
      this.manualX = 0;
    },

    _infScheduleExit () {
      clearTimeout(this._infIdleTimer);
      this._infIdleTimer = setTimeout(() => this._infExitManual(), IDLE_RESUME_MS);
    },

    _infOnWheel (e) {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      // Only hijack when horizontal motion dominates — vertical wheel should
      // continue scrolling the page.
      if (absX < 2 || absX < absY) return;
      e.preventDefault();
      this._infEnterManual();
      // Natural: swiping right on Magic Mouse (positive deltaX) reveals the
      // right-side content → track moves left → manualX decreases.
      this.manualX -= e.deltaX;
      this._infScheduleExit();
    },

    _infOnPointerDown (e) {
      // Only primary button for mouse; always track touch/pen.
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      this._infPointerActive = true;
      this._infLastX = e.clientX;
      this._infEnterManual();
      clearTimeout(this._infIdleTimer);
    },

    _infOnPointerMove (e) {
      if (!this._infPointerActive) return;
      const dx = e.clientX - this._infLastX;
      this._infLastX = e.clientX;
      // Dragging finger/cursor right → track follows the hand → manualX grows.
      this.manualX += dx;
    },

    _infOnPointerUp () {
      if (!this._infPointerActive) return;
      this._infPointerActive = false;
      this._infScheduleExit();
    },
  },
};
