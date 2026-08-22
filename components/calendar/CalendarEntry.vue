<template>
  <NuxtLink :to="href" class="entry" :data-lens="entry.lens">
    <span class="entry-art">
      <img v-if="entry.poster" :src="posterUrl" :alt="entry.title" loading="lazy" decoding="async" />
      <span v-else class="entry-art-fallback" aria-hidden="true">{{ initials }}</span>
    </span>

    <span class="entry-body">
      <span class="entry-kind">
        <i aria-hidden="true"></i>
        {{ kindLabel }}
        <em v-if="episodeLabel">{{ episodeLabel }}</em>
      </span>

      <span class="entry-title">{{ entry.title }}</span>

      <span class="entry-sub">
        <span v-if="entry.year" class="entry-year">{{ entry.year }}</span>
        <span v-if="placeLabel" class="entry-place">{{ placeLabel }}</span>
      </span>

      <span v-if="entry.note" class="entry-note">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 5v14l4-2 4 2 4-2 4 2V5" /></svg>
        <em>{{ entry.note }}</em>
      </span>

      <span v-if="flags.length" class="entry-flags">
        <span v-for="flag in flags" :key="flag" class="entry-flag">{{ flag }}</span>
      </span>
    </span>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  entry: { type: Object, required: true },
})

const KIND_LABEL = {
  1: 'Festival',
  2: 'Estreno limitado',
  3: 'En cines',
  4: 'Streaming',
  5: 'Formato físico',
  6: 'En televisión',
  7: 'Nuevo episodio',
}

const href = computed(() => `/${props.entry.media}/${props.entry.tmdbId}`)
const posterUrl = computed(() => `https://image.tmdb.org/t/p/w154${props.entry.poster}`)
const initials = computed(() => props.entry.title.slice(0, 2).toUpperCase())
const kindLabel = computed(() => KIND_LABEL[props.entry.type] || 'Estreno')

const episodeLabel = computed(() => {
  if (props.entry.season === undefined || props.entry.season === null) return ''
  return `S${props.entry.season}E${props.entry.episode}`
})

const placeLabel = computed(() => {
  const names = props.entry.countryNames || []
  if (!names.length) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return names.join(' · ')
  return `${names[0]} +${names.length - 1} más`
})

const flags = computed(() => {
  const out = []
  if (props.entry.rerelease) out.push('reposición')
  if (props.entry.short) out.push('cortometraje')
  if (props.entry.precision === 'year') out.push('día sin confirmar')
  if (props.entry.confidence === 'speculative') out.push('sin anunciar')
  else if (props.entry.confidence === 'estimated') out.push('estimada')
  return out
})
</script>

<style scoped lang="scss">
$cyan: #8BE9FD;
$teal: #1F5467;
$subtle: #ACAFB5;
$grey: #80868b;

.entry {
  position: relative;
  display: flex;
  gap: 1.4rem;
  padding: 1.4rem;
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid rgba(139, 233, 253, 0.12);
  background: rgba(3, 4, 6, 0.5);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  transition: border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;

  --lens: #{$cyan};
  &[data-lens='streaming'] { --lens: #A78BFA; }
  &[data-lens='festival'] { --lens: #FBBF77; }
  &[data-lens='tv'] { --lens: #7DD3A0; }
  &[data-lens='physical'] { --lens: #{$grey}; }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--lens), transparent);
    opacity: 0.55;
  }
}

@media (hover: hover) and (pointer: fine) {
  .entry:hover {
    border-color: rgba(139, 233, 253, 0.34);
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);

    &::before { opacity: 1; }
  }
}

.entry-art {
  flex: 0 0 auto;
  width: 6.4rem;
  height: 9.6rem;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(160deg, rgba(31, 84, 103, 0.5), rgba(0, 0, 0, 0.4));
  display: flex;
  align-items: center;
  justify-content: center;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.entry-art-fallback {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(139, 233, 253, 0.45);
  letter-spacing: 0.05em;
}

.entry-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  padding-top: 0.2rem;
}

.entry-kind {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--lens);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  i { width: 0.7rem; height: 0.7rem; border-radius: 50%; background: var(--lens); flex: 0 0 auto; }

  em {
    font-style: normal;
    color: #fff;
    background: rgba(139, 233, 253, 0.16);
    border-radius: 5px;
    padding: 0.1rem 0.6rem;
    letter-spacing: 0.02em;
  }
}

.entry-title {
  font-family: var(--font-display);
  color: #fff;
  font-size: 1.7rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-sub {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.25rem;
  min-width: 0;
}

.entry-year { color: $grey; font-weight: 600; flex: 0 0 auto; }

.entry-place {
  color: $subtle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entry-note {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 0.2rem;
  color: #e4eaee;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.4;

  svg {
    width: 1.4rem;
    height: 1.4rem;
    flex: 0 0 auto;
    margin-top: 0.2rem;
    color: var(--lens);
    opacity: 0.9;
  }

  em {
    font-style: normal;
    min-width: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.entry-flags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.2rem; }

.entry-flag {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #FBBF77;
  border: 1px solid rgba(251, 191, 119, 0.28);
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .entry { padding: 1.2rem; gap: 1.2rem; }
  .entry-art { width: 5.6rem; height: 8.4rem; }
  .entry-title { font-size: 1.6rem; }
}
</style>
