<template>
  <span class="halloween-pill">
    <svg class="halloween-pill__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12.5 17-.5-1-.5 1h1z"/>
      <path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/>
      <circle cx="15" cy="12" r="1"/>
      <circle cx="9" cy="12" r="1"/>
    </svg>
    Especial de Halloween
  </span>
</template>

<style scoped>
.halloween-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 13px 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background:
    linear-gradient(rgba(6, 9, 11, 0.82), rgba(6, 9, 11, 0.82)) padding-box,
    linear-gradient(140deg, rgba(240, 196, 45, 0.85), rgba(184, 134, 11, 0.6) 55%, rgba(240, 196, 45, 0.3)) border-box;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45), 0 0 24px -10px rgba(240, 196, 45, 0.45);
  color: #f0c42d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.halloween-pill__icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(240, 196, 45, 0.45));
}
</style>
