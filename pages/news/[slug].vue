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
            <h3 class="not-found-title">Article Not Found</h3>
            <p class="not-found-text">This article doesn't exist or has been removed.</p>
            <NuxtLink to="/news" class="back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to News
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <template v-else>
      <!-- Cover Image — Hero style -->
      <div v-if="article.image_url" class="article-hero">
        <img :src="article.image_url" :alt="article.title_en" class="hero-img" loading="eager" />
        <div class="hero-overlay"></div>
        <NuxtLink to="/news" class="hero-back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          News
        </NuxtLink>
      </div>

      <div class="news-section">
        <div class="content-wrapper">
          <!-- Sidebar -->
          <aside class="article-sidebar">
            <div class="sidebar-card">

              <!-- Article info -->
              <h3 class="sidebar-title">Article</h3>
              <div class="sidebar-meta-list">
                <div class="sidebar-meta-item">
                  <span class="sidebar-meta-label">Published</span>
                  <span class="sidebar-meta-value">{{ formatDate(article.published_at) }}</span>
                </div>
                <div v-if="article.topics?.length" class="sidebar-meta-item">
                  <span class="sidebar-meta-label">Topics</span>
                  <div class="sidebar-tags">
                    <span v-for="topic in article.topics" :key="topic" class="sidebar-tag">{{ topic }}</span>
                  </div>
                </div>
              </div>

              <!-- Sources -->
              <h3 v-if="parsedSources.length" class="sidebar-title" style="margin-top: 20px;">Sources</h3>
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
              <h3 class="sidebar-title" style="margin-top: 20px;">Language</h3>
              <div class="lang-switcher">
                <NuxtLink
                  :to="`https://es.cinemagoria.com/news/${article.slug}`"
                  external
                  class="lang-toggle"
                >
                  <span class="lang-option">English</span>
                  <span class="lang-track">
                    <span class="lang-knob"></span>
                  </span>
                  <span class="lang-option inactive">Espa&ntilde;ol</span>
                </NuxtLink>
              </div>
            </div>
          </aside>

          <!-- Main article -->
          <div class="article-main">
            <div class="article-card">
              <header class="article-header">
                <time :datetime="article.published_at" class="article-date">
                  {{ formatDate(article.published_at) }}
                </time>
                <h1 class="article-title">{{ article.title_en }}</h1>
                <p class="article-lead">{{ article.description_en }}</p>

                <div v-if="article.topics?.length" class="article-tags">
                  <span v-for="topic in article.topics" :key="topic" class="tag">{{ topic }}</span>
                </div>
              </header>

              <div class="article-divider"></div>

              <div class="article-byline">
                <img src="/icons/favicon-192.png" alt="Cinemagoria" class="byline-logo" />
                <span>By Cinemagoria Lab</span>
              </div>

              <!-- Trailer embed -->
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

              <!-- Body -->
              <div class="article-body" v-html="renderedBody"></div>
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

const md = new MarkdownIt({ breaks: true })
const route = useRoute()
const isMounted = ref(false)

onMounted(() => { isMounted.value = true })

const { data, pending, error } = await useAsyncData(`article-${route.params.slug}`, () =>
  $fetch(`/api/article/${route.params.slug}`)
)

const article = computed(() => data.value?.article || null)

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
    return 'Source'
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
  if (!article.value?.body_en) return ''
  try {
    return md.render(article.value.body_en)
  } catch {
    return article.value.body_en
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
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
    title: `${article.value.title_en} — Cinemagoria News`,
    meta: [
      { name: 'description', content: article.value.description_en },
      { property: 'og:title', content: article.value.title_en },
      { property: 'og:description', content: article.value.description_en },
      { property: 'og:image', content: article.value.image_url || 'https://cinemagoria.com/og-image.jpg' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `https://cinemagoria.com/news/${article.value.slug}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.value.title_en },
      { name: 'twitter:description', content: article.value.description_en },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [
      { rel: 'canonical', href: `https://cinemagoria.com/news/${article.value?.slug}` },
      { rel: 'alternate', hreflang: 'es', href: `https://es.cinemagoria.com/news/${article.value?.slug}` },
    ],
  }
})
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────── */
.news-section {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: 80vh;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 30px;
}

/* ── Hero — matches homepage Hero.vue ────────────────────────────── */
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
  height: 0;
  padding-bottom: 35%;
}

.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
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

.hero-back-btn:hover {
  background: rgba(0, 0, 0, 0.65);
  border-color: rgba(139, 233, 253, 0.5);
  color: #8BE9FD;
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
.article-sidebar {
  width: 250px;
  flex-shrink: 0;
}

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

.sidebar-meta-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
}

.sidebar-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-meta-label {
  font-size: 12px;
  color: #80868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-meta-value {
  font-size: 14px;
  color: #fff;
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sidebar-tag {
  font-size: 12px;
  color: #80868b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
}

.sidebar-sources {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
}

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

.source-btn:hover {
  background: rgba(0, 0, 0, 0.307);
  color: #fff;
}

.active-source {
  background: rgba(139, 233, 253, 0.08);
  color: #8BE9FD;
  border-color: rgba(139, 233, 253, 0.2);
}

.active-source:hover {
  background: rgba(139, 233, 253, 0.15);
  color: #8BE9FD;
}

/* ── Language switcher ────────────────────────────────────────────── */
.lang-switcher {
  display: flex;
  justify-content: center;
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
  padding: 6px 0;
}

.lang-option {
  font-size: 13px;
  font-weight: 700;
  color: #8BE9FD;
  letter-spacing: 0.5px;
}

.lang-option.inactive {
  color: #80868b;
}

.lang-track {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(139, 233, 253, 0.15);
  border-radius: 24px;
  border: 1px solid rgba(139, 233, 253, 0.3);
  transition: all 0.2s ease;
}

.lang-knob {
  position: absolute;
  top: 2px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: #8BE9FD;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 0 6px rgba(139, 233, 253, 0.4);
}

.lang-toggle:hover .lang-track {
  background: rgba(139, 233, 253, 0.25);
  border-color: #8BE9FD;
}

.lang-toggle:hover .lang-knob {
  transform: translateX(4px);
}

/* ── Main article ────────────────────────────────────────────────── */
.article-main {
  flex-grow: 1;
  min-width: 0;
}

/* ── Article card ────────────────────────────────────────────────── */
.article-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.article-header {
  margin-bottom: 8px;
}

.article-date {
  display: block;
  font-size: 14px;
  color: #80868b;
  margin-bottom: 16px;
}

.article-title {
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.article-lead {
  font-size: 18px;
  line-height: 1.7;
  color: #ACAFB5;
  margin: 0 0 24px;
  font-weight: 400;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  font-size: 13px;
  font-weight: 600;
  color: #80868b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 14px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

/* ── Divider ─────────────────────────────────────────────────────── */
.article-divider {
  margin: 32px 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(139, 233, 253, 0.4), transparent 80%);
}

/* ── Byline ──────────────────────────────────────────────────────── */
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

.article-byline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 13px;
  font-weight: 600;
  color: #80868b;
}

.byline-logo {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

/* ── Body ───────────────────────────────────────────────────────── */
.article-body {
  font-size: 17px;
  line-height: 1.9;
  color: #e0e0e0;
}

.article-body :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 40px 0 16px;
}

.article-body :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  color: #fafafa;
  margin: 32px 0 12px;
}

.article-body :deep(p) {
  margin: 0 0 22px;
}

.article-body :deep(strong) {
  color: #fff;
  font-weight: 600;
}

.article-body :deep(em) {
  color: #ACAFB5;
}

.article-body :deep(a) {
  color: #8BE9FD;
  text-decoration: underline;
  text-decoration-color: rgba(139, 233, 253, 0.3);
  transition: color 0.2s;
}

.article-body :deep(a:hover) {
  color: #7FDBF1;
}

.article-body :deep(blockquote) {
  border-left: 4px solid rgba(139, 233, 253, 0.4);
  padding: 8px 0 8px 24px;
  margin: 28px 0;
  color: #ACAFB5;
  font-style: italic;
  font-size: 18px;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 0 0 22px;
  padding-left: 28px;
  color: #e0e0e0;
}

.article-body :deep(li) {
  margin-bottom: 10px;
}

/* ── Not Found ─────────────────────────────────────────────────── */
.not-found-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 500px;
  padding: 4rem;
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.not-found-title {
  color: #8BE9FD;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.not-found-text {
  font-size: 16px;
  color: #aaa;
  margin-bottom: 28px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 30px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8BE9FD;
  border-radius: 25px;
  color: #8BE9FD;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.15);
}

/* ── Loading ─────────────────────────────────────────────────────── */
.article-loading-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 15px;
  padding: 40px;
  backdrop-filter: blur(10px);
  width: 100%;
}

.shimmer-cover {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(16, 26, 35, 0.4) 25%, rgba(16, 26, 35, 0.8) 50%, rgba(16, 26, 35, 0.4) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  margin-bottom: 32px;
}

.shimmer-content { padding: 0 8px; }

.shimmer-line {
  height: 18px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(16, 26, 35, 0.4) 25%, rgba(16, 26, 35, 0.8) 50%, rgba(16, 26, 35, 0.4) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  margin-bottom: 14px;
}

.shimmer-line.title { height: 44px; width: 70%; margin-bottom: 24px; }
.shimmer-line.meta  { height: 16px; width: 30%; margin-bottom: 28px; }
.shimmer-line.body  { width: 100%; }
.shimmer-line.short { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
  }

  .article-sidebar {
    width: 100%;
  }

  .sidebar-card {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 15px;
  }

  .sidebar-title {
    width: 100%;
    margin-top: 8px !important;
  }

  .sidebar-meta-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .article-card {
    padding: 24px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-lead {
    font-size: 16px;
  }

  .article-body {
    font-size: 16px;
  }

  .article-hero {
    width: 100%;
    border-radius: 0;
    border: none;
    background: none;
    margin-top: 0;
    padding-bottom: 50%;
  }
}

@media (min-width: 901px) and (max-width: 1200px) {
  .article-hero {
    padding-bottom: 40%;
  }
}
</style>
