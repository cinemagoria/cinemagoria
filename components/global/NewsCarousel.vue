<template>
  <div class="listing listing--carousel">
    <div v-if="pending" class="loading-container">
      <Loader />
    </div>

    <div v-else-if="error" class="error-container">
      <p>Failed to load news. Please try again later.</p>
      <button @click="refresh" class="retry-btn">Retry</button>
    </div>

    <template v-else>
      <div class="listing__head">
        <h2 class="listing__title">Latest News</h2>
        <NuxtLink to="/news" class="listing__explore">
          <strong class="strong">Explore All</strong>
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
            
            <!-- Image Top -> Redirects to Internal Feed -->
            <NuxtLink 
              :to="{ path: '/news', query: { source: article.source?.name, highlight: article.id } }" 
              class="card-image-link" 
              :class="{ 'has-video': article.video_id }"
            >
              <div v-if="loadingMap[article.id]" class="card-loader">
                <Loader :size="40" />
              </div>
              
              <img 
                  v-if="article.image" 
                  :src="article.image" 
                  :alt="article.title" 
                  class="article-image" 
                  loading="lazy"
                  @load="onImageLoad(article.id)"
                  @error="onImageError(article)"
                  :style="{ opacity: loadingMap[article.id] ? 0 : 1 }"
              />
              <div v-else class="article-image-placeholder"></div>
            </NuxtLink>

            <div class="card-content">
              <!-- Meta: Source & Date -->
              <div class="card-meta">
                <span v-if="article.source && article.source.name" class="source-badge">{{ article.source.name }}</span>
                <span class="card-date">{{ formatDate(article.published_at) }}</span>
              </div>

              <!-- Title -->
              <!-- Title -> Redirects to Internal Feed -->
              <NuxtLink 
                :to="{ path: '/news', query: { source: article.source?.name, highlight: article.id } }" 
                class="card-title" 
                :title="article.title"
              >
                {{ article.title }}
              </NuxtLink>

              <!-- Description -->
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
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

const AUTOPLAY_INTERVAL = 15000;

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
      
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 7);
      
      allItems = allItems.filter(item => {
        const pubDate = new Date(item.published_at);
        return pubDate >= dateLimit;
      });

      const seenSources = new Set();
      const distinctItems = [];

      for (const item of allItems) {
        const sourceName = item.source ? item.source.name : 'Unknown';
        if (!seenSources.has(sourceName)) {
            seenSources.add(sourceName);
            distinctItems.push(item);
        }
      }

      return distinctItems;
    }
  },
  methods: {
    async fetchNews() {
      try {
        this.pending = true;
        this.error = null;
        const data = await $fetch('/api/news');
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
      return formatDate(date);
    },
    sanitizeDescription(desc) {
      if (!desc) return '';
      return striptags(desc);
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
          // Removed equalizeHeights
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.carousel__items) {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

:deep(.card) {
  padding-right: 24px !important;
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
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, .1);
  backdrop-filter: blur(10px);
  overflow: hidden; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  display: flex !important; 
  flex-direction: column;
  width: 100%;
  
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(139, 233, 253, 0.15);
    border-color: rgba(139, 233, 253, 0.4);
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
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
  padding: 3px 8px; 
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2; 
  display: inline-block; 
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  line-height: 1.3;
  
  white-space: normal;
  overflow: visible;
  
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
  -webkit-line-clamp: 4; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  margin-bottom: auto;
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
