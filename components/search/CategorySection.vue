<template>
  <div v-if="items.length > 0" class="category-section">
    <div class="section-header" @click="$emit('toggle')">
      <h2 class="section-title">{{ title }} ({{ items.length }})</h2>
      <button class="expand-btn" :aria-label="collapsed ? 'Expand' : 'Collapse'">
        <svg v-if="collapsed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
      </button>
    </div>
    <div v-show="!collapsed" class="listing__items">
      <Card v-for="item in items" :key="`${keyPrefix}-${item.id}`" :item="item" />
    </div>
  </div>
</template>

<script>
import Card from '~/components/Card';

export default {
  components: { Card },
  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
    keyPrefix: { type: String, required: true }
  },
  emits: ['toggle']
}
</script>

<style lang="scss" scoped>
.category-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
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
</style>
