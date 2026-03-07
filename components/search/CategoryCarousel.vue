<template>
  <div v-if="items.length > 0" class="category-carousel">
    <div class="section-header" @click="collapsed = !collapsed">
      <h2 class="section-title">{{ title }} ({{ items.length }})</h2>
      <button class="expand-btn" :aria-label="collapsed ? 'Expand' : 'Collapse'">
        <svg v-if="collapsed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
      </button>
    </div>

    <div v-show="!collapsed" class="carousel-wrapper">
      <button
        class="carousel-nav carousel-nav--left"
        aria-label="Previous"
        type="button"
        :disabled="disableLeft"
        @click="scroll('left')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
      </button>

      <div ref="track" class="carousel-track" @scroll="onScroll">
        <div v-for="item in items" :key="`${keyPrefix}-${item.id}`" class="carousel-item">
          <Card :item="item" />
        </div>
        <div v-if="loading && hasMore" class="carousel-loader">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 44 44" stroke="#8BE9FD"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle></g></svg>
        </div>
      </div>

      <button
        class="carousel-nav carousel-nav--right"
        aria-label="Next"
        type="button"
        :disabled="disableRight"
        @click="scroll('right')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Card';
import { debounce } from '~/mixins/Functions';

export default {
  name: 'CategoryCarousel',
  components: { Card },

  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
    keyPrefix: { type: String, required: true },
    hasMore: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },

  emits: ['loadMore'],

  data() {
    return {
      collapsed: false,
      disableLeft: true,
      disableRight: false,
    };
  },

  watch: {
    items() {
      this.$nextTick(() => this.updateNav());
    },
    collapsed(val) {
      if (!val) {
        this.$nextTick(() => this.updateNav());
      }
    },
  },

  mounted() {
    this.$nextTick(() => this.updateNav());
  },

  methods: {
    updateNav() {
      const el = this.$refs.track;
      if (!el) return;
      this.disableLeft = el.scrollLeft <= 10;
      this.disableRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    },

    onScroll: debounce(function() {
      this.updateNav();
      const el = this.$refs.track;
      if (!el) return;
      const nearEnd = el.scrollWidth - (el.scrollLeft + el.clientWidth) < 300;
      if (nearEnd && this.hasMore && !this.loading) {
        this.$emit('loadMore');
      }
    }, 50),

    scroll(direction) {
      const el = this.$refs.track;
      if (!el) return;
      const amount = 350;
      el.scrollTo({
        left: el.scrollLeft + (direction === 'left' ? -amount : amount),
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style scoped>
.category-carousel {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin-bottom: 1rem;
}

.section-header:hover .section-title {
  opacity: 0.8;
}

.section-title {
  color: #8BE9FD;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0;
  padding-left: 5px;
  border-left: 3px solid #8BE9FD;
  line-height: 1.2;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #8BE9FD;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.expand-btn:hover {
  transform: scale(1.1);
}

.carousel-wrapper {
  position: relative;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 4px 0 15px 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 233, 253, 0.3) rgba(255, 255, 255, 0.05);
}

.carousel-track::-webkit-scrollbar {
  height: 6px;
}

.carousel-track::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.carousel-track::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 3px;
}

.carousel-item {
  flex: 0 0 160px;
  width: 160px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  backdrop-filter: blur(4px);
}

.carousel-nav:hover:not(:disabled) {
  background: rgba(139, 233, 253, 0.2);
  border-color: rgba(139, 233, 253, 0.6);
  transform: translateY(-60%) scale(1.1);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-nav--left {
  left: -20px;
}

.carousel-nav--right {
  right: -20px;
}

@media (max-width: 768px) {
  .carousel-nav {
    display: none;
  }

  .carousel-item {
    flex: 0 0 130px;
    width: 130px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    flex: 0 0 110px;
    width: 110px;
  }
}

.carousel-loader {
  flex: 0 0 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
