<template>
  <div :class="$style.group">
    <div :class="[$style.year, { [$style.cyan]: group.year }]">
      {{ group.year ? group.year : '—' }}
    </div>

    <div :class="$style.items">
      <SoundtrackItem
        v-for="item in group.items"
        :key="item.id"
        :item="item" />
    </div>
  </div>
</template>

<script>
import SoundtrackItem from '~/components/music/SoundtrackItem';

export default {
  components: {
    SoundtrackItem,
  },

  props: {
    group: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" module>
@use '~/assets/css/utilities/variables' as *;

.group {
  display: flex;
  margin-bottom: 2rem;
  
  @media (min-width: $breakpoint-large) {
    margin-bottom: 3rem;
  }
}

.year {
  width: 6rem;
  min-width: 6rem;
  font-size: 1.6rem;
  font-weight: 500;
  color: #999;
  padding-top: 0.5rem;
}

.cyan {
  color: #8BE9FD;
}

.items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-left: 2px solid #333;
  padding-left: 2rem;
}
</style>
