<template>
  <button type="button" :class="$style.button" :aria-label="label" :title="label" @click.stop="$emit('open')">
    <span :class="$style.icon" aria-hidden="true" />
  </button>
</template>

<script>
// Trophy chip next to a title or a person's name; opens AwardsModal.
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

$champagne: #f3d38a;
$glass: rgba(12, 13, 17, 0.62);
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);
$spring: cubic-bezier(0.34, 1.56, 0.64, 1);

// Glass chip with a hairline champagne rim (gradient border through border-box).
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 34px;
  padding: 0 15px;
  margin-left: 1.2rem;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient($glass, $glass) padding-box,
    linear-gradient(135deg, rgba($champagne, 0.6), rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0.05) 65%, rgba($champagne, 0.3)) border-box;
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  animation: chipIn 0.55s $ease-out backwards;
  transition: transform 0.35s $spring, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    background:
      linear-gradient(rgba(38, 32, 20, 0.7), rgba(38, 32, 20, 0.7)) padding-box,
      linear-gradient(135deg, rgba($champagne, 0.95), rgba($champagne, 0.25) 45%, rgba(255, 255, 255, 0.08) 65%, rgba($champagne, 0.6)) border-box;
    box-shadow: 0 8px 22px -8px rgba($champagne, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);

    .icon {
      transform: rotate(-12deg) scale(1.12);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid $champagne;
    outline-offset: 3px;
  }

  @media (max-width: #{$breakpoint-small - 1px}) {
    height: 30px;
    padding: 0 12px;
  }

  @media (min-width: 1650px) {
    height: max(34px, calc(0.72vw + 21px));
  }
}

// Brushed champagne trophy; a light band sweeps across it every few seconds.
.icon {
  display: block;
  width: 18px;
  height: 18px;
  background:
    linear-gradient(110deg, transparent 42%, rgba(255, 255, 255, 0.95) 50%, transparent 58%) no-repeat,
    linear-gradient(160deg, #fff3d1 0%, $champagne 38%, #d9a343 72%, #a8711d 100%);
  background-size: 250% 100%, 100% 100%;
  background-position: 0 0, 0 0;
  -webkit-mask: url('/ui/trophy.svg') center / contain no-repeat;
  mask: url('/ui/trophy.svg') center / contain no-repeat;
  animation: glint 6s ease-in-out 1s infinite;
  transition: transform 0.45s $spring;

  @media (max-width: #{$breakpoint-small - 1px}) {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 1650px) {
    width: max(18px, calc(0.72vw + 5px));
    height: max(18px, calc(0.72vw + 5px));
  }
}

@keyframes chipIn {
  from { opacity: 0; transform: translateY(4px) scale(0.85); }
}

// 100% puts the band off the left edge, 0% off the right; most of the cycle is rest.
@keyframes glint {
  0%, 72% { background-position: 100% 0, 0 0; }
  90%, 100% { background-position: 0 0, 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  .button,
  .icon {
    animation: none;
    transition: none;
  }
}
</style>
