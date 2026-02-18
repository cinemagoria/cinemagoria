<template>
  <div :class="$style.badge">
    <img 
      src="/festivals/sxsw/sxsw_film_festival_2026_logo.png" 
      alt="SXSW Film & TV Festival 2026" 
      :class="$style.logo"
    />
  </div>
</template>

<style lang="scss" module>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0;
  transition: transform 0.2s ease;
  user-select: none;
  cursor: default;

  &:hover {
      transform: translateY(-2px);
  }
}

.logo {
  height: 78px;
  width: auto;
  filter: invert(1);
  object-fit: contain;
  display: block;

  @media (max-width: 1023px) {
    height: 45px;
  }

  &:hover {
      filter: brightness(0) saturate(100%) invert(84%) sepia(21%) saturate(1211%) hue-rotate(179deg) brightness(101%) contrast(104%);
      cursor: pointer;
  }
}
</style>
