<template>
  <div :class="$style.nav">
    <button
      v-for="(item, index) in menu"
      :key="`tab-${index}`"
      :class="[$style.button, { [$style.buttonActive] : active === index }]"
      type="button"
      @click="clicked(index, item)">
      {{ item }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      required: true,
    },
    activeLabel: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      active: 0,
    };
  },

  methods: {
    clicked (index, item) {
      this.active = index;
      this.$emit('clicked', item.replace(/\s+/g, '-').toLowerCase());
    },

    syncActiveFromLabel () {
      if (!this.activeLabel) return;
      const index = this.menu.findIndex(item => item.replace(/\s+/g, '-').toLowerCase() === this.activeLabel);
      if (index !== -1) {
        this.active = index;
      }
    },
  },

  watch: {
    activeLabel: {
      handler() {
        this.syncActiveFromLabel();
      },
      immediate: true,
    },
    menu: {
      handler() {
        this.syncActiveFromLabel();
      },
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.nav {
  display: flex;
  height: 4.8rem;
  background-color: black;

  @media (min-width: $breakpoint-large) {
    justify-content: center;
    margin-bottom: 0.5rem;
    background: black;
  }
}

.nav:global(.hero-attached) {
  border: 1px solid transparent;
  border-top: 0;
  border-radius: 0 0 15px 15px;
  background: linear-gradient(#000, #000) padding-box,
              linear-gradient(to right, #1E5164, #8AE8FC) border-box;
}

.button {
  position: relative;
  display: block;
  flex: 1 1 0;
  min-width: 0;
  padding: 0 0.3rem;
  margin: 0;
  font-size: clamp(0.85rem, 2.4vw, 1.3rem);
  font-weight: 600;
  color: #6b7a83;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  background: none;
  border: 0;
  outline: 0;
  transition: color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0.5rem;
    width: 60%;
    max-width: 9rem;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, #8BE9FD, transparent);
    transform: translateX(-50%) scaleX(0);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    pointer-events: none;
  }

  @media (min-width: $breakpoint-large) {
    flex: 0 0 auto;
    width: auto;
    min-width: 9rem;
    padding: 0;
    margin: 0 2.4rem;
    font-size: 1.4rem;
    letter-spacing: 0.14em;
  }

  &:hover,
  &:focus {
    color: #8AE8FC;
  }
}

.buttonActive {
  color: #fff;
  text-shadow: 0 0 18px rgba(139, 233, 253, 0.35);

  &::after {
    transform: translateX(-50%) scaleX(1);
    opacity: 1;
  }
}
</style>
