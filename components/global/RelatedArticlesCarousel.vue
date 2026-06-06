<template>
  <section v-if="visibleItems.length" class="related-carousel">
    <h3 class="related-carousel__title">{{ heading }}</h3>

    <div class="related-carousel__shell">
      <button
        v-if="showNav"
        class="related-carousel__nav related-carousel__nav--left"
        type="button"
        aria-label="Previous"
        :disabled="atStart"
        @click="scrollByPage(-1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div
        ref="trackEl"
        class="related-carousel__track"
        @scroll.passive="onScroll"
      >
        <NuxtLink
          v-for="item in visibleItems"
          :key="item.slug"
          :to="`/news/${item.slug}`"
          class="rcard"
        >
          <div class="rcard__image-wrap">
            <img
              :src="item.image_url"
              :alt="cardTitle(item)"
              class="rcard__image"
              loading="lazy"
              @error="onImageError($event, item)"
            />
          </div>

          <div class="rcard__body">
            <span v-if="item.published_at" class="rcard__date">{{ formatDate(item.published_at) }}</span>
            <h4 class="rcard__title">{{ cardTitle(item) }}</h4>
            <p v-if="cardDescription(item)" class="rcard__hook">{{ cardDescription(item) }}</p>
            <div v-if="cardTopics(item).length" class="rcard__tags">
              <span
                v-for="topic in cardTopics(item)"
                :key="topic"
                class="rcard__tag"
              >{{ topic }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <button
        v-if="showNav"
        class="related-carousel__nav related-carousel__nav--right"
        type="button"
        aria-label="Next"
        :disabled="atEnd"
        @click="scrollByPage(1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import striptags from 'striptags'

const props = defineProps({
  slugs: { type: Array, default: () => [] },
  locale: { type: String, default: 'en' },
  heading: { type: String, default: 'Related Articles' },
})

const trackEl = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const showNav = ref(false)
const brokenImages = ref(new Set())

const slugsKey = computed(() => props.slugs.join(','))

const { data: res } = await useAsyncData(
  `related-articles-${slugsKey.value}`,
  () => slugsKey.value
    ? $fetch('/api/articles/by-slugs', { params: { slugs: slugsKey.value } })
    : { results: [] },
  { watch: [slugsKey] }
)

const items = computed(() => res.value?.results || [])

const visibleItems = computed(() =>
  items.value.filter(it => !!it.image_url && !brokenImages.value.has(it.slug))
)

function cardTitle(item) {
  if (props.locale === 'es') return item.title_es || item.title_en || ''
  return item.title_en || item.title_es || ''
}

function cardDescription(item) {
  const raw = props.locale === 'es'
    ? (item.description_es || item.description_en)
    : (item.description_en || item.description_es)
  if (!raw) return ''
  const clean = striptags(String(raw)).replace(/\s+/g, ' ').trim()
  if (clean.length <= 120) return clean
  return clean.slice(0, 117).trimEnd() + '…'
}

function cardTopics(item) {
  const t = Array.isArray(item.topics) ? item.topics : []
  return t.slice(0, 3)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString(props.locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return ''
  }
}

function onImageError(ev, item) {
  brokenImages.value.add(item.slug)
}

function measure() {
  const el = trackEl.value
  if (!el) return
  showNav.value = el.scrollWidth - el.clientWidth > 4
  atStart.value = el.scrollLeft <= 2
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
}

function onScroll() {
  measure()
}

function scrollByPage(direction) {
  const el = trackEl.value
  if (!el) return
  const first = el.querySelector('.rcard')
  const step = first ? first.getBoundingClientRect().width + 12 : el.clientWidth
  const visible = Math.max(1, Math.floor(el.clientWidth / step))
  el.scrollBy({ left: direction * step * visible, behavior: 'smooth' })
}

watch(items, async () => {
  if (process.client) {
    await nextTick()
    measure()
  }
}, { immediate: true })

let resizeHandler = null
onMounted(() => {
  resizeHandler = () => measure()
  window.addEventListener('resize', resizeHandler)
  nextTick(measure)
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.related-carousel {
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid rgba(139, 233, 253, 0.18);
}

.related-carousel__title {
  font-size: 14px;
  font-weight: 700;
  color: #8BE9FD;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 16px;
}

.related-carousel__shell {
  position: relative;
}

.related-carousel__track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding: 4px;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.related-carousel__track::-webkit-scrollbar {
  display: none;
}

.related-carousel__nav {
  position: absolute;
  top: 0;
  bottom: 4px;
  z-index: 2;
  width: 36px;
  border: none;
  padding: 0;
  margin: 0;
  background: linear-gradient(to right, rgba(16, 26, 35, 0.95) 35%, rgba(16, 26, 35, 0));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.related-carousel__nav--right {
  background: linear-gradient(to left, rgba(16, 26, 35, 0.95) 35%, rgba(16, 26, 35, 0));
}

.related-carousel__nav--left {
  left: 0;
  justify-content: flex-start;
  padding-left: 2px;
}

.related-carousel__nav--right {
  right: 0;
  justify-content: flex-end;
  padding-right: 2px;
}

.related-carousel__nav svg {
  background: rgba(0, 0, 0, 0.55);
  border-radius: 999px;
  padding: 6px;
  width: 28px;
  height: 28px;
  box-sizing: content-box;
  transition: background 0.2s ease;
}

.related-carousel__nav:hover:not(:disabled) svg {
  background: rgba(139, 233, 253, 0.25);
}

.related-carousel__nav:disabled {
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 600px) {
  .related-carousel__nav {
    display: none;
  }
}

/* ── Card ─────────────────────────────────────────────── */
.rcard {
  flex: 0 0 220px;
  width: 220px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: rgba(16, 26, 35, 0.95);
  border: 1px solid hsla(0, 0%, 100%, .12);
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.rcard:hover {
  transform: translateY(-3px);
  border-color: rgba(139, 233, 253, 0.45);
  box-shadow: 0 10px 28px -12px rgba(139, 233, 253, 0.4);
}

.rcard__image-wrap {
  position: relative;
  width: 100%;
  height: 125px;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}

.rcard__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.rcard:hover .rcard__image {
  transform: scale(1.04);
}

.rcard__body {
  padding: 12px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.rcard__date {
  font-size: 11px;
  color: #80868b;
  letter-spacing: 0.3px;
}

.rcard__title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.rcard:hover .rcard__title {
  color: #8BE9FD;
}

.rcard__hook {
  font-size: 12px;
  line-height: 1.45;
  color: #ACAFB5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rcard__tags {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  overflow: hidden;
  margin-top: auto;
}

.rcard__tag {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  color: #80868b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  text-decoration: none;
}

@media (max-width: 600px) {
  .rcard {
    flex: 0 0 200px;
    width: 200px;
  }
  .rcard__image-wrap {
    height: 112px;
  }
  .related-carousel__title {
    font-size: 13px;
  }
}
</style>
