<template>
  <button type="button" :class="$style.button" :aria-label="label" :title="label" @click.stop="$emit('open')">
    <span :class="$style.icon" aria-hidden="true" />
  </button>
</template>

<script>
// Gold trophy pill next to a title or a person's name; opens AwardsModal.
export default {
  name: 'AwardsButton',
  props: {
    label: { type: String, default: 'Premios' },
  },
  emits: ['open'],
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 34px;
  padding: 0 15px;
  margin-left: 1.2rem;
  vertical-align: middle;
  background: rgba(3, 4, 6, 0.55);
  border: 1px solid rgba(240, 196, 45, 0.35);
  border-radius: 999px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 0 12px rgba(240, 196, 45, 0.06);
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    background: rgba(240, 196, 45, 0.1);
    border-color: rgba(240, 196, 45, 0.65);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(240, 196, 45, 0.18),
                inset 0 0 12px rgba(240, 196, 45, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #f0c42d;
    outline-offset: 2px;
  }

  @media (max-width: #{$breakpoint-small - 1px}) {
    height: 30px;
    padding: 0 12px;
  }

  @media (min-width: 1650px) {
    height: max(34px, calc(0.72vw + 21px));
  }
}

// Same gold gradient as the festival WinnersCarousel, painted through the icon.
.icon {
  display: block;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #f0c42d 0%, #b8860b 100%);
  -webkit-mask: url('/ui/trophy.svg') center / contain no-repeat;
  mask: url('/ui/trophy.svg') center / contain no-repeat;

  @media (max-width: #{$breakpoint-small - 1px}) {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 1650px) {
    width: max(18px, calc(0.72vw + 5px));
    height: max(18px, calc(0.72vw + 5px));
  }
}
</style>
