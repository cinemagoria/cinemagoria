<template>
  <div class="article-page">
    <!-- Loading -->
    <div v-if="pending" class="article-loading">
      <div class="loading-shimmer">
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

    <!-- Error / Not Found -->
    <div v-else-if="error || !article" class="article-error">
      <div class="error-container">
        <span class="error-icon">🎬</span>
        <h1>Article Not Found</h1>
        <p>This article doesn't exist or has been removed.</p>
        <NuxtLink to="/news" class="btn-back">← Back to News</NuxtLink>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else class="article-wrapper">
      <!-- Cover Image -->
      <div v-if="article.image_url" class="article-cover">
        <img
          :src="article.image_url"
          :alt="article.title_en"
          class="cover-img"
          loading="eager"
        />
        <div class="cover-overlay"></div>
      </div>

      <div class="article-inner">
        <!-- Header -->
        <header class="article-header">
          <div class="article-meta">
            <span class="meta-badge">Cinemagoria News</span>
            <time :datetime="article.published_at" class="meta-date">
              {{ formatDate(article.published_at) }}
            </time>
          </div>
          <h1 class="article-title">{{ article.title_en }}</h1>
          <p class="article-lead">{{ article.description_en }}</p>
          
          <!-- Topics -->
          <div v-if="article.topics?.length" class="article-tags">
            <span v-for="topic in article.topics" :key="topic" class="tag">{{ topic }}</span>
          </div>
        </header>

        <!-- Divider -->
        <div class="article-divider">
          <span class="divider-film"></span>
        </div>

        <!-- Body (Markdown rendered) -->
        <div class="article-body" v-html="renderedBody"></div>

        <!-- Footer -->
        <footer class="article-footer">
          <div class="footer-inner">
            <div class="footer-logo">
              <span class="logo-icon">🎬</span>
              <span>Cinemagoria Editorial</span>
            </div>
            <NuxtLink
              :to="`https://es.cinemagoria.com/news/${article.slug}`"
              external
              class="lang-link"
            >
              🇪🇸 Leer en español
            </NuxtLink>
          </div>
        </footer>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ breaks: true })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error } = await useFetch(`/api/article/${slug.value}`, {
  key: `article-${slug.value}`,
})

const article = computed(() => (data.value as any)?.article || null)

const renderedBody = computed(() => {
  if (!article.value?.body_en) return ''
  try {
    return md.render(article.value.body_en)
  } catch {
    return article.value.body_en
  }
})

// Format date
function formatDate(dateStr: string): string {
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

// SEO
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
/* ── Page shell ─────────────────────────────────────────────────── */
.article-page {
  min-height: 100vh;
  background: #0a0a0f;
  color: #e8e8f0;
  font-family: 'Outfit', 'Roboto', sans-serif;
}

/* ── Loading shimmer ────────────────────────────────────────────── */
.article-loading {
  max-width: 860px;
  margin: 0 auto;
  padding: 80px 24px 40px;
}

.shimmer-cover {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  background: linear-gradient(90deg, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  margin-bottom: 32px;
}

.shimmer-content { padding: 0 8px; }

.shimmer-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  margin-bottom: 12px;
}

.shimmer-line.title { height: 40px; width: 70%; margin-bottom: 20px; }
.shimmer-line.meta  { height: 14px; width: 30%; margin-bottom: 24px; }
.shimmer-line.body  { width: 100%; }
.shimmer-line.short { width: 60%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Error state ────────────────────────────────────────────────── */
.article-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 24px;
}

.error-container {
  text-align: center;
  max-width: 500px;
}

.error-icon { font-size: 64px; display: block; margin-bottom: 16px; }

.error-container h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #e8e8f0;
  margin-bottom: 12px;
}

.error-container p {
  color: #8888a8;
  margin-bottom: 24px;
}

.btn-back {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #c8c8e8;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateX(-2px);
}

/* ── Cover ──────────────────────────────────────────────────────── */
.article-cover {
  position: relative;
  width: 100%;
  max-height: 480px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, #0a0a0f 100%);
}

/* ── Article inner ──────────────────────────────────────────────── */
.article-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ── Header ─────────────────────────────────────────────────────── */
.article-header {
  padding: 48px 0 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.12);
  border: 1px solid rgba(167, 139, 250, 0.25);
  padding: 4px 10px;
  border-radius: 20px;
}

.meta-date {
  font-size: 0.85rem;
  color: #6868a0;
}

.article-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  color: #f0f0ff;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.article-lead {
  font-size: 1.15rem;
  line-height: 1.65;
  color: #a0a0c8;
  margin: 0 0 24px;
  font-weight: 300;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #7070b0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 12px;
  letter-spacing: 0.03em;
}

/* ── Divider ─────────────────────────────────────────────────────── */
.article-divider {
  margin: 32px 0;
  display: flex;
  align-items: center;
}

.divider-film {
  display: block;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(167, 139, 250, 0.4), transparent);
}

/* ── Body ───────────────────────────────────────────────────────── */
.article-body {
  font-size: 1.05rem;
  line-height: 1.85;
  color: #c8c8e0;
}

.article-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e8e8f8;
  margin: 36px 0 14px;
  letter-spacing: -0.01em;
}

.article-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 600;
  color: #d0d0f0;
  margin: 28px 0 10px;
}

.article-body :deep(p) {
  margin: 0 0 20px;
}

.article-body :deep(strong) {
  color: #e8e8ff;
  font-weight: 600;
}

.article-body :deep(em) {
  color: #b0b0d8;
}

.article-body :deep(a) {
  color: #a78bfa;
  text-decoration: underline;
  text-decoration-color: rgba(167, 139, 250, 0.4);
  transition: color 0.2s;
}

.article-body :deep(a:hover) {
  color: #c4b5fd;
}

.article-body :deep(blockquote) {
  border-left: 3px solid rgba(167, 139, 250, 0.5);
  padding: 4px 0 4px 20px;
  margin: 24px 0;
  color: #9090c0;
  font-style: italic;
}

/* ── Footer ─────────────────────────────────────────────────────── */
.article-footer {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6868a0;
}

.lang-link {
  font-size: 0.85rem;
  color: #8080b8;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 14px;
  border-radius: 20px;
  transition: all 0.2s;
}

.lang-link:hover {
  color: #a0a0d8;
  background: rgba(255,255,255,0.05);
}

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .article-inner { padding: 0 16px 60px; }
  .article-title { font-size: 1.7rem; }
  .footer-inner { flex-direction: column; align-items: flex-start; }
}
</style>
