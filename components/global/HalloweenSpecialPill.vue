<template>
  <span class="halloween-pill">
    <svg class="halloween-pill__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.5 6c.97 0 1.87.5 2.61 1.38c.55-.59 1.2-1.02 1.89-1.23V4a2 2 0 0 1 2-2h2v2h-2v2.15c.69.21 1.34.64 1.89 1.23C15.63 6.5 16.53 6 17.5 6C20 6 22 9.36 22 13.5S20 21 17.5 21c-.97 0-1.87-.5-2.61-1.38C14.08 20.5 13.08 21 12 21s-2.08-.5-2.89-1.38C8.37 20.5 7.47 21 6.5 21C4 21 2 17.64 2 13.5S4 6 6.5 6M9 10l-1.25 2.25h2.5zm6 0l-1.25 2.25h2.5zm-7 7h2l1-1l1 1h2l1-1l1 1l1.5-3l-3.58.62L13 16l-1-1h-2l-1 1l-1-1l-2-1z"/>
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
