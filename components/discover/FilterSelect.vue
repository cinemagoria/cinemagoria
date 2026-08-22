<template>
  <div ref="root" class="fs" :class="[`fs--${size}`, { 'fs--block': block }]">
    <span v-if="label" :id="labelId" class="fs__label">{{ label }}</span>

    <button
      ref="trigger"
      type="button"
      class="fs__trigger"
      :class="{ 'fs__trigger--on': active, 'fs__trigger--open': open }"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-labelledby="label ? `${labelId} ${valueId}` : undefined"
      @click="toggle"
      @keydown.down.prevent="openAndFocusList">
      <span :id="valueId" class="fs__value">{{ currentLabel }}</span>
      <svg
        class="fs__chevron"
        :class="{ 'fs__chevron--up': open }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Teleport v-if="open" to="body">
      <div
        ref="menu"
        class="fs-menu"
        :style="menuStyle"
        role="listbox"
        @click.stop>
        <div v-if="searchable" class="fs-menu__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref="searchInput"
            v-model="term"
            type="text"
            :placeholder="`Filter ${(label || 'options').toLowerCase()}`"
            :aria-label="`Filter ${(label || 'options').toLowerCase()}`"
            @keydown.esc.prevent="closeAndRefocus">
        </div>

        <div ref="list" class="fs-menu__options">
          <button
            v-if="placeholder"
            type="button"
            class="fs-menu__option"
            :class="{ 'fs-menu__option--on': !modelValue }"
            role="option"
            :aria-selected="!modelValue"
            @click="pick('')">
            <span class="fs-menu__radio" aria-hidden="true"></span>
            {{ placeholder }}
          </button>

          <button
            v-for="option in visibleOptions"
            :key="`fs-${option.value}`"
            type="button"
            class="fs-menu__option"
            :class="{ 'fs-menu__option--on': modelValue === option.value }"
            role="option"
            :aria-selected="modelValue === option.value"
            @click="pick(option.value)">
            <span class="fs-menu__radio" aria-hidden="true"></span>
            {{ option.label }}
          </button>

          <p v-if="searchable && !visibleOptions.length" class="fs-menu__empty">No match.</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId } from 'vue';

const MENU_GAP = 8;
const VIEWPORT_MARGIN = 12;
const MIN_MENU_WIDTH = 240;
const MIN_MENU_HEIGHT = 180;
const FLIP_THRESHOLD = 260;

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  fallbackLabel: { type: String, default: 'Select' },
  searchable: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  block: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const uid = useId();
const labelId = `fs-label-${uid}`;
const valueId = `fs-value-${uid}`;

const root = ref(null);
const trigger = ref(null);
const menu = ref(null);
const list = ref(null);
const searchInput = ref(null);
const open = ref(false);
const term = ref('');
const menuStyle = ref({});

const isSet = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined);

const currentLabel = computed(() => {
  if (!isSet.value) return props.placeholder || props.fallbackLabel;
  return props.options.find(option => option.value === props.modelValue)?.label || props.fallbackLabel;
});

const visibleOptions = computed(() => {
  if (!props.searchable || !term.value.trim()) return props.options;
  const needle = term.value.trim().toLowerCase();
  return props.options.filter(option => option.label.toLowerCase().includes(needle));
});

function updatePosition() {
  const element = trigger.value;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceBelow = viewportHeight - rect.bottom - MENU_GAP - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - MENU_GAP - VIEWPORT_MARGIN;
  const flip = spaceBelow < FLIP_THRESHOLD && spaceAbove > spaceBelow;

  const width = Math.min(
    Math.max(rect.width, MIN_MENU_WIDTH),
    viewportWidth - VIEWPORT_MARGIN * 2
  );

  const left = Math.min(
    Math.max(rect.left, VIEWPORT_MARGIN),
    Math.max(VIEWPORT_MARGIN, viewportWidth - width - VIEWPORT_MARGIN)
  );

  menuStyle.value = {
    left: `${Math.round(left)}px`,
    width: `${Math.round(width)}px`,
    maxHeight: `${Math.round(Math.max(MIN_MENU_HEIGHT, flip ? spaceAbove : spaceBelow))}px`,
    ...(flip
      ? { bottom: `${Math.round(viewportHeight - rect.top + MENU_GAP)}px` }
      : { top: `${Math.round(rect.bottom + MENU_GAP)}px` }),
  };
}

function bindViewportListeners() {
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
}

function unbindViewportListeners() {
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, { capture: true });
}

function close() {
  if (!open.value) return;
  open.value = false;
  term.value = '';
  unbindViewportListeners();
}

function closeAndRefocus() {
  close();
  trigger.value?.focus();
}

function reveal(focusFirstOption = false) {
  updatePosition();
  open.value = true;
  bindViewportListeners();
  nextTick(() => {
    if (props.searchable) searchInput.value?.focus();
    else if (focusFirstOption) list.value?.querySelector('.fs-menu__option')?.focus();
  });
}

function toggle() {
  if (props.disabled) return;
  if (open.value) close();
  else reveal();
}

function openAndFocusList() {
  if (props.disabled || open.value) return;
  reveal(true);
}

function pick(value) {
  emit('update:modelValue', value);
  closeAndRefocus();
}

function onDocumentClick(event) {
  if (!open.value) return;
  if (root.value?.contains(event.target)) return;
  if (menu.value?.contains(event.target)) return;
  close();
}

function onKeydown(event) {
  if (event.key === 'Escape' && open.value) closeAndRefocus();
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
  unbindViewportListeners();
});
</script>

<style lang="scss" scoped>
$cyan: #8BE9FD;
$grey: #80868b;

.fs {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
}

.fs--block { width: 100%; }

.fs__label {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.fs__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  height: 4.2rem;
  padding: 0 1.4rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 233, 253, 0.18);
  background: rgba(0, 0, 0, 0.35);
  color: #cfd6dc;
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  &--on {
    border-color: rgba(139, 233, 253, 0.55);
    background: rgba(139, 233, 253, 0.1);
    color: $cyan;
  }

  &--open {
    border-color: rgba(139, 233, 253, 0.7);
    color: #fff;
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }

  &:focus-visible {
    outline: 2px solid rgba(139, 233, 253, 0.7);
    outline-offset: 2px;
  }
}

.fs--lg .fs__trigger {
  height: 4.8rem;
  font-size: 1.5rem;
  border-radius: 14px;
}

.fs__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fs__chevron {
  width: 1.4rem;
  height: 1.4rem;
  flex: 0 0 auto;
  transition: transform 0.2s ease;

  &--up { transform: rotate(180deg); }
}

.fs-menu {
  position: fixed;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  padding: 6px;
  background: #070C11;
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.fs-menu__search {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 0 0 auto;
  padding: 0 1rem;
  height: 3.6rem;
  margin-bottom: 6px;
  border-radius: 8px;
  border: 1px solid rgba(139, 233, 253, 0.16);
  background: #0C141B;

  svg { width: 1.5rem; height: 1.5rem; flex: 0 0 auto; color: $grey; }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: #fff;
    font-family: inherit;
    font-size: 1.3rem;
    outline: none;

    &::placeholder { color: $grey; }
  }
}

.fs-menu__options {
  flex: 1 1 auto;
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(139, 233, 253, 0.3); border-radius: 2px; }
}

.fs-menu__option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 3.6rem;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #cfd6dc;
  font-family: inherit;
  font-size: 1.3rem;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;

  &--on { color: #fff; }

  &:focus-visible {
    outline: 2px solid rgba(139, 233, 253, 0.7);
    outline-offset: -2px;
  }
}

.fs-menu__radio {
  position: relative;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(139, 233, 253, 0.4);
  transition: border-color 0.18s ease;
}

.fs-menu__option--on .fs-menu__radio {
  border-color: $cyan;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: $cyan;
    box-shadow: 0 0 8px rgba(139, 233, 253, 0.6);
  }
}

.fs-menu__empty {
  margin: 0;
  padding: 1.2rem 1rem;
  color: $grey;
  font-size: 1.3rem;
  text-align: center;
}

@media (hover: hover) and (pointer: fine) {
  .fs__trigger:hover:not(:disabled) {
    border-color: rgba(139, 233, 253, 0.45);
    background: rgba(139, 233, 253, 0.08);
    color: #fff;
  }

  .fs-menu__option:hover { background: rgba(139, 233, 253, 0.12); color: #fff; }
}
</style>
