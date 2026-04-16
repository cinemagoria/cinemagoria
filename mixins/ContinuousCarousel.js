import smoothscroll from 'smoothscroll-polyfill';

export default {
  data() {
    return {
      elementWidth: 0,
      carouselWidth: 0,
      visibleWidth: 0,
      disableLeftButton: false,
      disableRightButton: false,
      
      // Auto-scroll logic
      isHovered: false,
      autoScrollSpeed: 1, 
      rAF: null,
      exactScrollLeft: 0,
      duplicationCount: 2,
    };
  },

  mounted() {
    smoothscroll.polyfill();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeEvent);
      // Wait for images to load before starting
      this.$nextTick(() => {
        setTimeout(() => {
          this.calculateState();
          this.startAutoScroll();
        }, 500);
      });
    }
  },

  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeEvent);
      this.stopAutoScroll();
    }
  },
  
  beforeUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeEvent);
      this.stopAutoScroll();
    }
  },

  methods: {
    calculateState() {
      const el = this.$refs.carouselElement;
      if (!el) return;

      const singleGroup = el.querySelector('.carousel__group');
      if (!singleGroup) return;

      // Use getBoundingClientRect for the most accurate width measurement including subpixels
      const groupRect = singleGroup.getBoundingClientRect();
      const groupWidth = groupRect.width;
      
      this.visibleWidth = el.offsetWidth;
      this.carouselWidth = groupWidth; 
      
      if (this.carouselWidth > 0 && this.visibleWidth > 0) {
        // We need enough copies so that (duplicationCount * groupWidth) - visibleWidth >= groupWidth
        // This ensures the browser never hits the 'real' scroll wall before we can jump back/forward.
        const needed = Math.ceil(this.visibleWidth / this.carouselWidth) + 2;
        this.duplicationCount = Math.max(3, needed);
      }
    },

    startAutoScroll() {
      if (this.rAF) cancelAnimationFrame(this.rAF);
      
      const el = this.$refs.carouselElement;
      if (el) this.exactScrollLeft = el.scrollLeft;
      
      const loop = () => {
        const currentEl = this.$refs.carouselElement;
        if (!currentEl || this.isHovered) {
          this.rAF = requestAnimationFrame(loop);
          return;
        }

        // If user manually scrolled (delta > 2px), sync our internal counter
        if (Math.abs(currentEl.scrollLeft - Math.round(this.exactScrollLeft)) > 2) {
          this.exactScrollLeft = currentEl.scrollLeft;
        }

        // Increment exact floating-point position
        this.exactScrollLeft += this.autoScrollSpeed;

        // Apply rounded position to DOM
        currentEl.scrollLeft = this.exactScrollLeft;

        // Infinite loop snap: if we passed the first duplicated group
        if (this.exactScrollLeft >= this.carouselWidth && this.carouselWidth > 0) {
          this.exactScrollLeft -= this.carouselWidth;
          currentEl.scrollLeft = this.exactScrollLeft;
        } 
        else if (this.exactScrollLeft <= 0 && this.carouselWidth > 0) {
          this.exactScrollLeft += this.carouselWidth;
          currentEl.scrollLeft = this.exactScrollLeft;
        }

        this.scrollEvent();
        this.rAF = requestAnimationFrame(loop);
      };

      this.rAF = requestAnimationFrame(loop);
    },

    stopAutoScroll() {
      if (this.rAF) cancelAnimationFrame(this.rAF);
      this.rAF = null;
    },

    pauseAutoScroll() {
      this.isHovered = true;
    },

    resumeAutoScroll() {
      this.isHovered = false;
    },

    moveTo(width) {
      if (!this.$refs.carouselElement) return;
      this.$refs.carouselElement.scrollTo({
        left: width,
        behavior: 'smooth',
      });
    },

    moveToClickEvent(direction) {
      if (!this.$refs.carouselElement) return;
      const el = this.$refs.carouselElement;
      
      const moveAmount = this.visibleWidth * 0.8; // Move 80% of view width
      const target = el.scrollLeft + (direction === 'left' ? -moveAmount : moveAmount);

      el.scrollTo({
        left: target,
        behavior: 'smooth',
      });
      
      // Pause auto-scroll briefly when the user interact manually
      this.pauseAutoScroll();
      if (this.manualPauseTimeout) clearTimeout(this.manualPauseTimeout);
      this.manualPauseTimeout = setTimeout(() => {
        this.resumeAutoScroll();
      }, 3000); // Wait 3s before resuming loop
    },

    scrollEvent() {
      // Intentionally kept arrows enabled since it's an infinite carousel now
      this.disableLeftButton = false;
      this.disableRightButton = false;
    },

    resizeEvent() {
      this.calculateState();
    }
  },
};
