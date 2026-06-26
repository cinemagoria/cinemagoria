<template>
  <div class="listing listing--carousel">
    <div v-if="pending" class="loading-container">
      <Loader />
    </div>

    <div v-else-if="error" class="error-container">
      <p>Error al cargar noticias. Por favor, inténtelo de nuevo más tarde.</p>
      <button @click="refresh" class="retry-btn">Reintentar</button>
    </div>

    <template v-else>
      <div class="listing__head">
        <h2 class="listing__title">Últimas Noticias</h2>
        <NuxtLink to="/news" class="listing__explore">
          <strong class="strong">Explorar Todo</strong>
        </NuxtLink>
      </div>

      <div class="carousel">
        <button
          class="carousel__nav carousel__nav--left"
          aria-label="Previous"
          type="button"
          :disabled="disableLeftButton"
          @click="manualMove('left')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
        </button>

        <div
          ref="carouselElement"
          class="carousel__items"
          @scroll="scrollEvent"
          @mouseenter="pauseAutoplay"
          @mouseleave="resumeAutoplay">
          
          <div v-for="article in articles" :key="article.id" class="card">
            <div class="release-card">
            
            <NuxtLink 
              :to="{ path: '/news', query: { source: article.source?.name, highlight: article.id } }" 
              class="card-image-link" 
              :class="{ 'has-video': article.video_id }"
            >
              <div v-if="loadingMap[article.id]" class="card-loader">
                <Loader :size="40" />
              </div>
              
              <img 
                  :src="article.image" 
                  :alt="article.title" 
                  class="article-image" 
                  loading="lazy"
                  @load="onImageLoad(article.id)"
                  @error="onImageError(article)"
                  :style="{ opacity: loadingMap[article.id] ? 0 : 1 }"
              />
            </NuxtLink>

            <div class="card-content">
              <div class="card-meta">
                <div v-if="article.editorial_category" class="card-cats-row">
                  <NuxtLink
                    v-for="chip in categoryChips(article)"
                    :key="chip.label"
                    :to="{ path: '/news', query: { category: chip.token } }"
                    class="card-cat-tag"
                  >{{ chip.label }}</NuxtLink>
                </div>
                <span v-else-if="carouselBadge(article)" class="source-badge">{{ carouselBadge(article) }}</span>
                <span class="card-date">{{ formatDate(article.published_at) }}</span>
              </div>
              <NuxtLink 
                :to="{ path: '/news', query: { source: article.source?.name, highlight: article.id } }" 
                class="card-title" 
                :title="article.title"
              >
                {{ article.title }}
              </NuxtLink>
              <div v-if="article.topics?.length" class="card-tags-section">
                <span class="card-tags-label">Temas:</span>
                <div class="card-tags-row">
                  <NuxtLink v-for="topic in article.topics" :key="topic" :to="{ path: '/news', query: { q: topic } }" class="card-topic-tag">{{ topic }}</NuxtLink>
                </div>
              </div>
              <p class="card-description">
                {{ sanitizeDescription(article.description || article.summary) }}
              </p>
            </div>

          </div>
          </div>
        </div>

        <button
          class="carousel__nav carousel__nav--right"
          aria-label="Next"
          type="button"
          :disabled="disableRightButton"
          @click="manualMove('right')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6.1 23.2 17.9 12 6.1.8"/></svg>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from '@/components/Loader';
import carousel from '~/mixins/Carousel';
import striptags from 'striptags';
import { formatDate, handleImageError } from '~/utils/helpers';
import { categoryLabelES } from '~/utils/categoryLabels';

const AUTOPLAY_INTERVAL = 10000;

export default {
  name: 'NewsCarousel',
  mixins: [carousel],
  components: {
    Loader
  },
  data() {
    return {
      autoplayInterval: null,
      data: null,
      pending: true,
      error: null,
      loadingMap: {},
    }
  },
  async created() {
    await this.fetchNews();
  },
  computed: {
    articles() {
      if (!this.data) return []
      let allItems = this.data.results || this.data.articles || []

      allItems = allItems.filter(item => !!item.image);
      
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 15);
      
      allItems.sort((a, b) => {
        return new Date(b.published_at) - new Date(a.published_at);
      });

      allItems = allItems.filter(item => {
        const pubDate = new Date(item.published_at);
        return pubDate >= dateLimit;
      });

      return allItems.sort((a, b) => {
        return new Date(b.published_at) - new Date(a.published_at);
      });
    }
  },
  methods: {
    async fetchNews() {
      try {
        this.pending = true;
        this.error = null;
        const data = await $fetch('/api/news', { params: { source: 'Cinemagoria' } });
        this.data = data;
        if (data && data.results) {
          data.results.forEach(a => {
            if(a.image) {
              this.loadingMap[a.id] = true;
            }
          });
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.pending = false;
        this.$nextTick(() => {
          if (this.articles.length > 0) {
            this.calculateState(this.articles.length);
            if (typeof window !== 'undefined') {
              this.startAutoplay();
            }
          }
        });
      }
    },
    refresh() {
      this.fetchNews();
    },
    formatDate(date) {
      return formatDate(date, 'es-ES');
    },
    sanitizeDescription(desc) {
      if (!desc) return '';
      return striptags(desc);
    },
    // Display badge: prefer the editorial category for internal articles
    // (replaces the brand-redundant "CINEMAGORIA" label), fall back to the
    // publisher name for external aggregated items. The .source-badge CSS
    // uppercases the result.
    carouselBadge(article) {
      if (article?.editorial_category) {
        return categoryLabelES(article.editorial_category);
      }
      return article?.source?.name || '';
    },
    // Primary editorial category (compound label split per segment) followed by
    // any secondary categories, as { label, token } chips. Each links to /news
    // filtered by its token.
    categoryChips(article) {
      const out = [];
      const seen = new Set();
      const add = (raw) => {
        const token = String(raw || '').trim().toLowerCase();
        if (!token) return;
        categoryLabelES(token)
          .split('/')
          .map((seg) => seg.trim())
          .filter(Boolean)
          .forEach((label) => {
            const key = label.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            out.push({ label, token });
          });
      };
      add(article?.editorial_category);
      (Array.isArray(article?.secondary_categories) ? article.secondary_categories : []).forEach(add);
      return out;
    },
    onImageLoad(id) {
       this.loadingMap[id] = false; 
    },
    onImageError(article) {
       this.loadingMap[article.id] = false;
       handleImageError(article);
    },
    resizeEvent () {
      this.calculateState(this.articles.length);
    },
    manualMove(direction) {
      this.moveToClickEvent(direction);
      this.resetAutoplay();
    },
    startAutoplay() {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval);
      this.autoplayInterval = setInterval(() => {
        if (!this.disableRightButton) {
           this.moveToClickEvent('right');
        } else {
           this.moveTo(0);
        }
      }, AUTOPLAY_INTERVAL); 
    },
    pauseAutoplay() {
      if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    },
    resumeAutoplay() {
      this.startAutoplay();
    },
    resetAutoplay() {
      this.pauseAutoplay();
      this.resumeAutoplay();
    },
  },
  beforeUnmount() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
/* Stretch the gradient arrow panels to cover the full carousel height.
   The global defaults leave a visible gap against the tall news cards. */
.carousel {
  position: relative;

  :deep(.carousel__nav) {
    top: 0;
    bottom: 0;
  }

  :deep(.carousel__nav--left),
  :deep(.carousel__nav--right) {
    bottom: 0;
    margin-bottom: 0;
  }
}

:deep(.carousel__items) {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-top: 8px;
  padding-bottom: 4px;
}

:deep(.card) {
  padding-right: 12px !important;
  height: auto !important;
  display: block !important;
  flex-shrink: 0;
}
@media (max-width: 767px) {
  :deep(.card) {
    width: 85vw !important;
    max-width: 350px;
  }
}
.release-card {
  position: relative;
  background: rgba(3, 4, 6, 0.7);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(31, 84, 103, 0.2), transparent 55%);
  border: 1px solid rgba(139, 233, 253, 0.18);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;

  display: flex !important;
  flex-direction: column;
  width: 100%;

  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.85;
    z-index: 3;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 233, 253, 0.5);
    background: rgba(3, 4, 6, 0.85);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(139, 233, 253, 0.15);

    &::before {
      opacity: 1;
    }
  }
}

.card-image-link {
  display: block;
  width: 100%;
  height: 160px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0; 
  cursor: pointer;
}

.card-loader {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #0000004e;
  z-index: 5;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.release-card:hover .article-image {
  transform: scale(1.05);
}

.article-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
}

.card-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1; 
  gap: 10px;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.source-badge {
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.4);
  color: #8BE9FD;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  line-height: 1.2;
  display: inline-block;
}

.card-cats-row {
  display: flex;
  gap: 5px;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.card-cats-row::-webkit-scrollbar { display: none; }

.card-cat-tag {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.08);
  border: 1px solid rgba(139, 233, 253, 0.35);
  padding: 3px 9px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s ease;
}

.card-cat-tag:hover {
  color: #aef2ff;
  background: rgba(139, 233, 253, 0.16);
  border-color: rgba(139, 233, 253, 0.55);
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  transition: color 0.2s ease;

  &:hover {
    color: #8BE9FD;
  }
}

.strong {
  color: #8BE9FD
}

.card-description {
  font-size: 14px;
  color: #b0b0b0;
  line-height: 1.5;
  
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  margin-top: auto;
}

.card-tags-section {
  padding-top: 6px;
  margin-bottom: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.card-tags-label {
  font-size: 10px;
  font-weight: 700;
  color: #80868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.card-tags-row {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 2px;
}

.card-tags-row::-webkit-scrollbar {
  display: none;
}

.card-topic-tag {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  color: #80868b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s ease;
}

.card-topic-tag:hover {
  color: #8BE9FD;
  background: rgba(139, 233, 253, 0.1);
  border-color: rgba(139, 233, 253, 0.3);
}

.card-footer {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8BE9FD;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  
  border: 1px solid #8BE9FD;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;

  &:hover {
    background: rgba(139, 233, 253, 0.1);
    text-decoration: none;
  }
}

@media (max-width: 600px) {
  .card-content {
    padding: 15px;
  }
  
  .card-title {
    font-size: 14px;
  }

  .card-description {
    font-size: 13px;
    line-height: 1.4;
  }
}
</style>
