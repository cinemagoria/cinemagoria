<template>
  <div class="news-card">
    <NuxtLink 
      :to="{ path: '/news', query: { source: item.source?.name, highlight: item.id } }" 
      class="news-card__link">
      
      <div class="news-card__img-container">
        <img 
          v-if="item.image" 
          :src="item.image" 
          :alt="item.title" 
          class="news-card__img" 
          loading="lazy"
          @error="$event.target.src = '/placeholders/placeholder_news.webp'"
        />
        <img v-else src="/placeholders/placeholder_news.webp" alt="Placeholder" class="news-card__img" />
        
        <span v-if="item.source && item.source.name" class="news-card__source">{{ item.source.name }}</span>
      </div>

      <div class="news-card__content">
        <span class="news-card__date">{{ formatDate(item.published_at) }}</span>
        <h3 class="news-card__title" :title="item.title">{{ item.title }}</h3>
        <p class="news-card__description">{{ sanitizeDescription(item.description || item.summary) }}</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
import striptags from 'striptags';
import { formatDate } from '~/utils/helpers';

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return formatDate(date);
    },
    sanitizeDescription(desc) {
      if (!desc) return '';
      return striptags(desc);
    }
  }
}
</script>

<style lang="scss" scoped>
.news-card {
  background: rgba(16, 26, 35, 0.85);
  border: 1px solid hsla(0, 0%, 100%, .18);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(139, 233, 253, 0.15);
    border-color: rgba(139, 233, 253, 0.4);

    .news-card__title {
      color: #8BE9FD;
    }
    
    .news-card__img {
        transform: scale(1.05);
    }
  }
}

.news-card__link {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
}

.news-card__img-container {
  height: 160px;
  position: relative;
  overflow: hidden;
}

.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card__source {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #8BE9FD;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.news-card__content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.news-card__date {
  font-size: 0.85rem;
  color: #aaa;
}

.news-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.news-card__description {
  font-size: 0.9rem;
  color: #b0b0b0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: auto; 
}
</style>
