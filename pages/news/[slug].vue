<template>
  <div>
  <main class="main">
    <UserNav v-if="isMounted" />

    <!-- Loading -->
    <div v-if="pending" class="news-section">
      <div class="content-wrapper">
        <div class="article-main">
          <div class="article-loading-card">
            <div class="shimmer-cover"></div>
            <div class="shimmer-content">
              <div class="shimmer-line title"></div>
              <div class="shimmer-line meta"></div>
              <div class="shimmer-line body"></div>
              <div class="shimmer-line body short"></div>
              <div class="shimmer-line body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error / Not Found -->
    <div v-else-if="error || !article" class="news-section">
      <div class="content-wrapper">
        <div class="article-main">
          <div class="not-found-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.4; margin-bottom: 24px;">
              <path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/>
            </svg>
            <h3 class="not-found-title">Art&iacute;culo no encontrado</h3>
            <p class="not-found-text">Este art&iacute;culo no existe o ha sido eliminado.</p>
            <NuxtLink to="/news" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Volver a Noticias
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <template v-else>
      <!-- Cover Image — Hero style -->
      <div v-if="article.image_url" class="article-hero">
        <img :src="article.image_url" :alt="article.title_es" class="hero-img" loading="eager" />
        <div class="hero-overlay"></div>
        <NuxtLink to="/news" class="hero-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Noticias
        </NuxtLink>
        <ClientOnly>
          <button
            v-if="userEmail"
            class="hero-save-btn"
            :class="{ 'is-saved': isArticleSaved }"
            @click="toggleSave"
            :title="isArticleSaved ? 'Eliminar de guardados' : 'Guardar artículo'"
          >
            <svg v-if="!isArticleSaved" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="is-saved-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
          </button>
        </ClientOnly>
      </div>

      <div class="news-section">
        <div class="content-wrapper">
          <!-- Sidebar -->
          <aside class="article-sidebar">
            <div class="sidebar-card">

              <h3 class="sidebar-title">Art&iacute;culo</h3>
              <div class="sidebar-meta-list">
                <div class="sidebar-meta-item">
                  <span class="sidebar-meta-label">Publicado</span>
                  <span class="sidebar-meta-value">{{ formatDate(article.published_at) }}</span>
                </div>
                <div v-if="article.topics?.length" class="sidebar-meta-item">
                  <span class="sidebar-meta-label">Temas</span>
                  <div class="sidebar-tags">
                    <span v-for="topic in article.topics" :key="topic" class="sidebar-tag">{{ topic }}</span>
                  </div>
                </div>
              </div>

              <h3 v-if="parsedSources.length" class="sidebar-title" style="margin-top: 20px;">Fuentes</h3>
              <div v-if="parsedSources.length" class="sidebar-sources">
                <a
                  v-for="src in parsedSources"
                  :key="src.url"
                  :href="src.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="source-btn active-source"
                >
                  {{ src.name }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>

              <!-- Language -->
              <h3 class="sidebar-title" style="margin-top: 20px;">Idioma</h3>
              <div class="lang-switcher">
                <NuxtLink
                  :to="`https://cinemagoria.com/news/${article.slug}`"
                  external
                  class="lang-toggle"
                >
                  <span class="lang-option inactive">English</span>
                  <span class="lang-track">
                    <span class="lang-knob"></span>
                  </span>
                  <span class="lang-option">Espa&ntilde;ol</span>
                </NuxtLink>
              </div>
            </div>
          </aside>

          <!-- Main article -->
          <div class="article-main">
            <div class="article-card">
              <header class="article-header">
                <div class="mobile-header-row">
                  <NuxtLink to="/news" class="mobile-back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Noticias
                  </NuxtLink>
                  <ClientOnly>
                    <button
                      v-if="userEmail"
                      class="mobile-save-btn"
                      :class="{ 'is-saved': isArticleSaved }"
                      @click="toggleSave"
                      :title="isArticleSaved ? 'Eliminar de guardados' : 'Guardar artículo'"
                    >
                      <svg v-if="!isArticleSaved" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="15" x2="9" y1="10" y2="10"/></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="is-saved-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/></svg>
                    </button>
                  </ClientOnly>
                </div>
                <time :datetime="article.published_at" class="article-date">
                  {{ formatDate(article.published_at) }}
                </time>
                <h1 class="article-title">{{ article.title_es }}</h1>

                <!-- Cover image inline for mobile -->
                <div v-if="article.image_url" class="mobile-hero">
                  <img :src="article.image_url" :alt="article.title_es" loading="eager" />
                </div>

                <p class="article-lead">{{ article.description_es }}</p>

                <div v-if="article.topics?.length" class="article-tags">
                  <span v-for="topic in article.topics" :key="topic" class="tag">{{ topic }}</span>
                </div>

                <!-- Related TMDB entities -->
                <div v-if="relatedEntities.length" class="related-entities">
                  <h4 class="related-entities-label">EN ESTE ARTÍCULO:</h4>
                  <div class="related-entities-list">
                    <a
                      v-for="entity in relatedEntities"
                      :key="`${entity.type}-${entity.id}`"
                      :href="`/${entity.type}/${entity.id}`"
                      target="_blank"
                      class="related-entity"
                    >
                      <img
                        v-if="entity.image"
                        :src="entity.image"
                        :alt="entity.name"
                        class="related-entity-img"
                        loading="lazy"
                      />
                      <img v-else src="/placeholders/image_not_found_yet_es.webp" :alt="entity.name" class="related-entity-img" loading="lazy" />
                      <div class="related-entity-info">
                        <span class="related-entity-name">{{ entity.name }}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </header>

              <div class="article-divider"></div>

              <div class="article-byline">
                <img src="/icons/favicon-192.png" alt="Cinemagoria" class="byline-logo" />
                <span>Por Cinemagoria Lab</span>
              </div>

              <!-- Trailer embed (siempre arriba cuando existe trailer) -->
              <div v-if="article.trailer_youtube_id" class="article-trailer">
                <div class="trailer-wrapper">
                  <iframe
                    :src="`https://www.youtube.com/embed/${article.trailer_youtube_id}`"
                    title="Trailer"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>

              <!-- Carousel arriba (solo cuando no hay trailer) -->
              <div v-if="article.carousel_assets?.length && !article.trailer_youtube_id" class="article-carousel">
                <div class="carousel-viewport">
                  <div class="carousel-track" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
                    <div v-for="(img, i) in article.carousel_assets" :key="i" class="carousel-slide">
                      <img :src="img" :alt="`${article.title_es} — imagen ${i + 1}`" loading="lazy" />
                    </div>
                  </div>
                  <template v-if="article.carousel_assets.length > 1">
                    <button class="carousel-btn carousel-btn-prev" :disabled="carouselIndex === 0" @click="carouselIndex--" aria-label="Imagen anterior">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14 6l-6 6l6 6v-12" /></svg>
                    </button>
                    <button class="carousel-btn carousel-btn-next" :disabled="carouselIndex === article.carousel_assets.length - 1" @click="carouselIndex++" aria-label="Siguiente imagen">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M10 18l6 -6l-6 -6v12" /></svg>
                    </button>
                  </template>
                </div>
                <div v-if="article.carousel_assets.length > 1" class="carousel-dots">
                  <button
                    v-for="(_, i) in article.carousel_assets"
                    :key="i"
                    class="carousel-dot"
                    :class="{ active: i === carouselIndex }"
                    @click="carouselIndex = i"
                    :aria-label="`Ir a imagen ${i + 1}`"
                  ></button>
                </div>
              </div>

              <!-- Body -->
              <div class="article-body" v-html="renderedBody"></div>

              <!-- Carousel al final (cuando hay trailer y carousel) -->
              <div v-if="article.trailer_youtube_id && article.carousel_assets?.length" class="article-carousel">
                <div class="carousel-viewport">
                  <div class="carousel-track" :style="{ transform: `translateX(-${carouselIndex * 100}%)` }">
                    <div v-for="(img, i) in article.carousel_assets" :key="i" class="carousel-slide">
                      <img :src="img" :alt="`${article.title_es} — imagen ${i + 1}`" loading="lazy" />
                    </div>
                  </div>
                  <template v-if="article.carousel_assets.length > 1">
                    <button class="carousel-btn carousel-btn-prev" :disabled="carouselIndex === 0" @click="carouselIndex--" aria-label="Imagen anterior">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14 6l-6 6l6 6v-12" /></svg>
                    </button>
                    <button class="carousel-btn carousel-btn-next" :disabled="carouselIndex === article.carousel_assets.length - 1" @click="carouselIndex++" aria-label="Siguiente imagen">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M10 18l6 -6l-6 -6v12" /></svg>
                    </button>
                  </template>
                </div>
                <div v-if="article.carousel_assets.length > 1" class="carousel-dots">
                  <button
                    v-for="(_, i) in article.carousel_assets"
                    :key="i"
                    class="carousel-dot"
                    :class="{ active: i === carouselIndex }"
                    @click="carouselIndex = i"
                    :aria-label="`Ir a imagen ${i + 1}`"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
  </div>
</template>

<script setup>
import UserNav from '@/components/global/UserNav';
import MarkdownIt from 'markdown-it'
import { apiImgUrl } from '@/utils/api'

const md = new MarkdownIt({ breaks: true })
const route = useRoute()
const config = useRuntimeConfig()
const { $bus } = useNuxtApp()
const isMounted = ref(false)
const isArticleSaved = ref(false)
const savedLink = ref(null)
const userEmail = ref(null)
const carouselIndex = ref(0)

watch(() => route.params.slug, () => {
  carouselIndex.value = 0
})

const handleAuthChange = () => {
  const email = localStorage.getItem('email')?.replace(/['"]+/g, '')
  userEmail.value = email || null
  checkSavedStatus()
}

onMounted(async () => {
  isMounted.value = true
  handleAuthChange()
  await checkSavedStatus()

  if (typeof window !== 'undefined') {
    window.addEventListener('auth-changed', handleAuthChange)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('auth-changed', handleAuthChange)
  }
})

async function checkSavedStatus() {
  const email = localStorage.getItem('email')?.replace(/['"]+/g, '')
  if (email) {
    try {
      const res = await fetch(`${config.public.tursoBackendUrl}/news/saved/${email}`)
      const data = await res.json()
      if (data.success && data.articles) {
        const match = data.articles.find(a => a.link === `/news/${route.params.slug}` || a.link?.includes(route.params.slug))
        if (match) {
          isArticleSaved.value = true
          savedLink.value = match.link
        } else {
          isArticleSaved.value = false
          savedLink.value = null
        }
      }
    } catch (e) {
      console.error('Error checking saved status:', e)
    }
  } else {
    isArticleSaved.value = false
    savedLink.value = null
  }
}

async function toggleSave() {
  const email = localStorage.getItem('email')?.replace(/['"]+/g, '')
  if (!email) {
    $bus.$emit('show-auth-modal')
    return
  }

  const link = `/news/${route.params.slug}`
  const wasSaved = isArticleSaved.value
  isArticleSaved.value = !wasSaved

  try {
    const url = `${config.public.tursoBackendUrl}/news/saved`
    const method = wasSaved ? 'DELETE' : 'POST'

    let body
    if (wasSaved) {
      body = { userEmail: email, link: savedLink.value || link }
    } else {
      body = {
        userEmail: email,
        article: {
          title: article.value?.title_es || '',
          link: link,
          image: article.value?.image_url || '',
          source: 'Cinemagoria',
          published_at: article.value?.published_at,
        }
      }
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error('Failed to update')

    if (wasSaved) {
      savedLink.value = null
    } else {
      savedLink.value = link
    }
  } catch (e) {
    console.error('Error toggling save:', e)
    isArticleSaved.value = wasSaved
  }
}

const { data, pending, error } = await useAsyncData(`article-es-${route.params.slug}`, () =>
  $fetch(`/api/article/${route.params.slug}`)
)

const article = computed(() => data.value?.article || null)

const relatedEntities = ref([])

async function fetchRelatedEntities() {
  relatedEntities.value = []
  const ids = article.value?.related_tmdb_ids
  if (!ids?.length) return

  const apiKey = config.public.apiKey

  const results = await Promise.all(
    ids.map(async (entity) => {
      try {
        const endpoint = entity.type === 'movie'
          ? `https://api.themoviedb.org/3/movie/${entity.id}`
          : entity.type === 'tv'
            ? `https://api.themoviedb.org/3/tv/${entity.id}`
            : `https://api.themoviedb.org/3/person/${entity.id}`

        const res = await $fetch(endpoint, { params: { api_key: apiKey } })

        const name = res.title || res.name || 'Desconocido'
        const imagePath = entity.type === 'person' ? res.profile_path : res.poster_path
        const image = imagePath ? `${apiImgUrl}/w185${imagePath}` : null

        return { type: entity.type, id: entity.id, name, image }
      } catch {
        return null
      }
    })
  )
  relatedEntities.value = results.filter(Boolean)
}

watch(article, () => {
  if (process.client) fetchRelatedEntities()
}, { immediate: true })

const SOURCE_NAMES = {
  'deadline.com': 'Deadline',
  'variety.com': 'Variety',
  'hollywoodreporter.com': 'Hollywood Reporter',
  'screenrant.com': 'Screen Rant',
  'collider.com': 'Collider',
  'darkhorizons.com': 'Dark Horizons',
  'indiewire.com': 'IndieWire',
  'ign.com': 'IGN',
  'thewrap.com': 'The Wrap',
  'ew.com': 'Entertainment Weekly',
  'slashfilm.com': 'SlashFilm',
  'theplaylist.net': 'The Playlist',
  'empireonline.com': 'Empire',
  'comingsoon.net': 'ComingSoon',
  'cinemablend.com': 'CinemaBlend',
  'gamesradar.com': 'GamesRadar+',
  'theringer.com': 'The Ringer',
  'vulture.com': 'Vulture',
  'avclub.com': 'The A.V. Club',
  'rollingstone.com': 'Rolling Stone',
  'nytimes.com': 'NY Times',
  'theguardian.com': 'The Guardian',
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'reuters.com': 'Reuters',
  'apnews.com': 'AP News',
}

function extractSourceName(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return SOURCE_NAMES[hostname] || hostname.split('.').slice(0, -1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
  } catch {
    return 'Fuente'
  }
}

const parsedSources = computed(() => {
  if (!article.value?.sources) return []
  return article.value.sources.map(src => {
    if (typeof src === 'string') {
      return { url: src, name: extractSourceName(src) }
    }
    return { url: src.url || src.link || '#', name: src.name || src.source || extractSourceName(src.url || '') }
  })
})

const renderedBody = computed(() => {
  if (!article.value?.body_es) return ''
  try {
    return md.render(article.value.body_es)
  } catch {
    return article.value.body_es
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

useHead(() => {
  if (!article.value) return {}
  return {
    title: `${article.value.title_es} — Cinemagoria Noticias`,
    meta: [
      { name: 'description', content: article.value.description_es },
      { property: 'og:title', content: article.value.title_es },
      { property: 'og:description', content: article.value.description_es },
      { property: 'og:image', content: article.value.image_url || 'https://es.cinemagoria.com/og-image.jpg' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `https://es.cinemagoria.com/news/${article.value.slug}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.value.title_es },
      { name: 'twitter:description', content: article.value.description_es },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [
      { rel: 'canonical', href: `https://es.cinemagoria.com/news/${article.value?.slug}` },
      { rel: 'alternate', hreflang: 'en', href: `https://cinemagoria.com/news/${article.value?.slug}` },
    ],
  }
})
</script>

<style scoped>
.news-section { display: flex; justify-content: center; padding: 40px 20px; min-height: 80vh; }
.content-wrapper { width: 100%; max-width: 1400px; display: flex; gap: 30px; }

.article-hero {
  position: relative;
  width: calc(100% - 40px);
  max-width: 1400px;
  margin: 20px auto 0;
  border-radius: 15px;
  border: 1px solid transparent;
  background: linear-gradient(#000, #000) padding-box,
              linear-gradient(to right, #1E5164, #8AE8FC) border-box;
  overflow: hidden;
  aspect-ratio: 21 / 9;
  max-height: 500px;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%);
  border-radius: 15px;
}

.hero-back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px 7px 10px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.hero-save-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-save-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  border-color: #8BE9FD;
  color: #8BE9FD;
  transform: scale(1.08);
}

.hero-save-btn.is-saved {
  background: #8BE9FD;
  border-color: #8BE9FD;
  color: #000;
}

.hero-save-btn.is-saved:hover {
  background: #a5eefe;
  transform: scale(1.08);
}

.hero-save-btn .is-saved-icon {
  stroke: #000;
}

.hero-back-btn:hover {
  background: rgba(0, 0, 0, 0.65);
  border-color: rgba(139, 233, 253, 0.5);
  color: #8BE9FD;
}

.article-sidebar { width: 250px; flex-shrink: 0; }

.sidebar-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 20px 15px;
  position: sticky;
  top: 100px;
  backdrop-filter: blur(10px);
}

.sidebar-title {
  color: #8BE9FD;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(139, 233, 253, 0.3);
  padding-bottom: 8px;
}

.sidebar-meta-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 4px; }
.sidebar-meta-item { display: flex; flex-direction: column; gap: 4px; }
.sidebar-meta-label { font-size: 12px; color: #80868b; text-transform: uppercase; letter-spacing: 0.5px; }
.sidebar-meta-value { font-size: 14px; color: #fff; }
.sidebar-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.sidebar-tag { font-size: 12px; color: #80868b; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 10px; }
.sidebar-sources { display: flex; flex-direction: column; gap: 4px; margin-bottom: 4px; }

.source-btn {
  background: transparent;
  border: 1px solid transparent;
  color: #a0a0a0;
  padding: 8px 10px;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
}

.source-btn:hover { background: rgba(0,0,0,0.307); color: #fff; }
.active-source { background: rgba(139,233,253,0.08); color: #8BE9FD; border-color: rgba(139,233,253,0.2); }
.active-source:hover { background: rgba(139,233,253,0.15); color: #8BE9FD; }

.lang-switcher { display: flex; justify-content: center; }

.lang-toggle {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; cursor: pointer; padding: 6px 0;
}

.lang-option { font-size: 13px; font-weight: 700; color: #8BE9FD; letter-spacing: 0.5px; }
.lang-option.inactive { color: #80868b; }

.lang-track {
  position: relative; width: 44px; height: 24px;
  background: rgba(139,233,253,0.15); border-radius: 24px;
  border: 1px solid rgba(139,233,253,0.3); transition: all 0.2s ease;
}

.lang-knob {
  position: absolute; top: 2px; right: 3px;
  width: 18px; height: 18px; background: #8BE9FD;
  border-radius: 50%; transition: transform 0.2s ease;
  box-shadow: 0 0 6px rgba(139,233,253,0.4);
}

.lang-toggle:hover .lang-track { background: rgba(139,233,253,0.25); border-color: #8BE9FD; }
.lang-toggle:hover .lang-knob { transform: translateX(-4px); }

.article-main { flex-grow: 1; min-width: 0; }

.article-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.article-header { margin-bottom: 8px; }
.article-date { display: block; font-size: 14px; color: #80868b; margin-bottom: 16px; }

.article-title {
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.article-lead { font-size: 18px; line-height: 1.7; color: #ACAFB5; margin: 0 0 24px; font-weight: 400; }
.article-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.tag { font-size: 13px; font-weight: 600; color: #80868b; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 5px 14px; border-radius: 20px; }
.article-divider { margin: 32px 0; height: 1px; background: linear-gradient(90deg, rgba(139,233,253,0.4), transparent 80%); }

.article-trailer {
  margin: 28px 0;
}

.trailer-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
}

.trailer-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.article-byline { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; font-size: 13px; font-weight: 600; color: #80868b; }
.byline-logo { width: 18px; height: 18px; border-radius: 3px; }

.article-body { font-size: 17px; line-height: 1.9; color: #e0e0e0; }
.article-body :deep(h2) { font-size: 24px; font-weight: 700; color: #fff; margin: 40px 0 16px; }
.article-body :deep(h3) { font-size: 20px; font-weight: 600; color: #fafafa; margin: 32px 0 12px; }
.article-body :deep(p) { margin: 0 0 22px; }
.article-body :deep(strong) { color: #fff; font-weight: 600; }
.article-body :deep(em) { color: #ACAFB5; }
.article-body :deep(a) { color: #8BE9FD; text-decoration: underline; text-decoration-color: rgba(139,233,253,0.3); transition: color 0.2s; }
.article-body :deep(a:hover) { color: #7FDBF1; }
.article-body :deep(blockquote) { border-left: 4px solid rgba(139,233,253,0.4); padding: 8px 0 8px 24px; margin: 28px 0; color: #ACAFB5; font-style: italic; font-size: 18px; }
.article-body :deep(ul), .article-body :deep(ol) { margin: 0 0 22px; padding-left: 28px; color: #e0e0e0; }
.article-body :deep(li) { margin-bottom: 10px; }

/* ── Carousel ── */
.article-carousel { margin: 28px 0; }
.carousel-viewport { position: relative; overflow: hidden; border-radius: 10px; background: #000; }
.carousel-track { display: flex; transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.carousel-slide { min-width: 100%; aspect-ratio: 16 / 9; }
.carousel-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.carousel-btn {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; min-width: 36px; min-height: 36px; border-radius: 50%;
  background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0;
  backdrop-filter: blur(4px);
}
.carousel-btn-prev { left: 10px; }
.carousel-btn-next { right: 10px; }
.carousel-btn svg { min-width: 20px; min-height: 20px; flex-shrink: 0; }
.carousel-btn:hover:not(:disabled) { background: rgba(0, 0, 0, 0.65); border-color: rgba(255, 255, 255, 0.3); }
.carousel-btn:disabled { opacity: 0.25; cursor: default; }
@media (max-width: 768px) {
  .carousel-btn { width: 30px; height: 30px; min-width: 30px; min-height: 30px; }
  .carousel-btn svg { min-width: 16px; min-height: 16px; }
  .carousel-btn-prev { left: 6px; }
  .carousel-btn-next { right: 6px; }
}
.carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 12px; }
.carousel-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.2); border: none; padding: 0;
  cursor: pointer; transition: all 0.2s ease;
}
.carousel-dot.active { background: #8BE9FD; box-shadow: 0 0 6px rgba(139, 233, 253, 0.4); }
.carousel-dot:hover:not(.active) { background: rgba(255, 255, 255, 0.4); }

.not-found-card {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; width: 100%; min-height: 500px; padding: 4rem;
  background: rgba(16,26,35,0.85); border: 1px solid hsla(0,0%,100%,.18);
  border-radius: 15px; backdrop-filter: blur(10px);
}

.not-found-title { color: #8BE9FD; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.not-found-text { font-size: 16px; color: #aaa; margin-bottom: 28px; }

.back-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 12px 30px;
  background: rgba(139,233,253,0.1); border: 1px solid #8BE9FD; border-radius: 25px;
  color: #8BE9FD; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s ease;
}

.back-btn:hover { background: rgba(139,233,253,0.2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(139,233,253,0.15); }

.article-loading-card {
  background: rgba(16,26,35,0.85); border: 1px solid hsla(0,0%,100%,.18);
  border-radius: 15px; padding: 40px; backdrop-filter: blur(10px); width: 100%;
}

.shimmer-cover {
  width: 100%; height: 300px; border-radius: 12px;
  background: linear-gradient(90deg, rgba(16,26,35,0.4) 25%, rgba(16,26,35,0.8) 50%, rgba(16,26,35,0.4) 75%);
  background-size: 200% 100%; animation: shimmer 1.6s infinite; margin-bottom: 32px;
}

.shimmer-content { padding: 0 8px; }

.shimmer-line {
  height: 18px; border-radius: 8px;
  background: linear-gradient(90deg, rgba(16,26,35,0.4) 25%, rgba(16,26,35,0.8) 50%, rgba(16,26,35,0.4) 75%);
  background-size: 200% 100%; animation: shimmer 1.6s infinite; margin-bottom: 14px;
}

.shimmer-line.title { height: 44px; width: 70%; margin-bottom: 24px; }
.shimmer-line.meta  { height: 16px; width: 30%; margin-bottom: 28px; }
.shimmer-line.body  { width: 100%; }
.shimmer-line.short { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Mobile-only elements (hidden on desktop) ───────────────────── */
.mobile-back-btn {
  display: none;
}

.mobile-hero {
  display: none;
}

.mobile-save-btn {
  display: none;
}

.mobile-header-row {
  display: none;
}

@media (max-width: 900px) {
  .content-wrapper { flex-direction: column; }
  .article-sidebar { width: 100%; order: 2; }
  .article-main { order: 1; }
  .article-hero { display: none; }
  .mobile-hero { display: block; margin: 16px 0; border-radius: 10px; overflow: hidden; }
  .mobile-hero img { width: 100%; height: auto; display: block; border-radius: 10px; }
  .mobile-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .mobile-back-btn { display: inline-flex; align-items: center; gap: 4px; color: #8BE9FD; font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 0; }
  .mobile-back-btn:hover { opacity: 0.8; }
  .mobile-save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(139, 233, 253, 0.1);
    border: 1px solid rgba(139, 233, 253, 0.2);
    color: #8BE9FD;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    margin-bottom: 0;
  }
  .mobile-save-btn:hover { background: rgba(139, 233, 253, 0.2); border-color: #8BE9FD; }
  .mobile-save-btn.is-saved { background: #8BE9FD; border-color: #8BE9FD; color: #000; }
  .mobile-save-btn .is-saved-icon { stroke: #000; }
  .sidebar-card { position: static; display: flex; flex-wrap: wrap; gap: 12px; padding: 15px; }
  .sidebar-title { width: 100%; margin-top: 8px !important; }
  .sidebar-meta-list { flex-direction: row; flex-wrap: wrap; gap: 16px; }
  .article-card { padding: 24px; }
  .article-title { font-size: 24px; }
  .article-lead { font-size: 16px; }
  .article-body { font-size: 16px; }
}

/* ── Related TMDB entities ──────────────────────────────────────── */
.related-entities {
  margin-top: 24px;
}

.related-entities-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8BE9FD;
  margin: 0 0 14px;
}

.related-entities-list {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.related-entities-list::-webkit-scrollbar {
  display: none;
}

.related-entity {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  flex-shrink: 0;
  width: 110px;
  scroll-snap-align: start;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.related-entity:hover {
  border-color: #8BE9FD;
}

.related-entity-img {
  width: 100%;
  height: 165px;
  object-fit: cover;
  background: #0d0d0d;
  display: block;
}

.related-entity-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #444;
}

.related-entity-info {
  background: rgba(0, 0, 0, 0.9);
  padding: 10px 6px;
}

.related-entity-name {
  font-size: 12px;
  font-weight: 500;
  color: #8BE9FD;
  text-align: center;
  line-height: 1.3;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.related-entity:hover .related-entity-name {
  color: #fff;
}

@media (max-width: 768px) {
  .related-entity {
    width: 90px;
    border-radius: 8px;
  }
  .related-entity-img {
    height: 135px;
  }
  .related-entity-info {
    padding: 8px 4px;
  }
  .related-entity-name {
    font-size: 11px;
    max-width: 90px;
  }
}

@media (min-width: 901px) and (max-width: 1200px) {
  .article-hero { max-height: 400px; }
}
</style>
