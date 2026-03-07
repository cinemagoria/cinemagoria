<template>
  <div class="listing">
    <div
      v-if="title"
      class="listing__head">
      <h2
        v-if="title"
        class="listing__title">
        {{ title }}
      </h2>
    </div>

    <div v-if="items.results && items.results.length === 0 && !loading && userResults.length === 0 && localNews.length === 0 && !isLoadingUsers" class="no-results">
      <h2 class="no-results__title">No results found for "{{ searchQuery }}"</h2>
      
      <div v-if="typoCheckInProgress" class="typo-checking">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 44" stroke="#2196f3">
          <g fill="none" fill-rule="evenodd" stroke-width="2">
            <circle cx="22" cy="22" r="1">
              <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
            </circle>
            <circle cx="22" cy="22" r="1">
              <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
              <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
            </circle>
          </g>
        </svg>
      </div>
      
      <div v-if="suggestedCorrection" class="suggestion">
        <p>Did you mean: <a href="#" @click.prevent="useCorrection">{{ suggestedCorrection }}</a>?</p>
      </div>
    </div>

    <div v-if="items.results && items.results.length > 0 && items.results[0].matched_by_id" class="id-match-banner">
        <span>Coincidencia por {{ items.results[0].matched_by_id }} ID</span>
    </div>


    <div class="discover-search-bar">
      <button
        class="filters-toggle-btn"
        :class="{ 'filters-toggle-btn--active': discoverOpen }"
        @click="discoverOpen = !discoverOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.646 20.965a1.67 1.67 0 0 1 -1.321 -1.282a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.728 .177 1.154 .71 1.279 1.303" /><path d="M14.985 11.694a3 3 0 1 0 -3.29 3.29" /><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
        <span>Advanced Search</span>
      </button>
      <transition name="discover-expand">
        <DiscoverSearch v-if="discoverOpen" />
      </transition>
    </div>

    <div v-if="localNews && localNews.length > 0" class="news-section">
      <div class="section-header" @click="toggleSection('news')">
        <h2 class="section-title">News</h2>
        <button class="expand-btn" :aria-label="collapsedSections.news ? 'Expand' : 'Collapse'">
            <svg v-if="collapsedSections.news" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-down-icon lucide-chevrons-down"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-icon lucide-chevrons-up"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
        </button>
      </div>
      <div v-show="!collapsedSections.news" class="news-carousel-wrapper">
        <button
          class="news-nav news-nav--left"
          aria-label="Previous"
          type="button"
          :disabled="disableLeftNewsButton"
          @click="scrollNewsCarousel('left')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"/></svg>
        </button>

        <div 
          ref="newsCarousel"
          class="news-carousel"
          @scroll="onNewsScroll">
           <div v-for="newsItem in sortedNews" :key="newsItem.id" class="news-carousel-item">
              <NewsResultCard :item="newsItem" />
           </div>
           <div v-if="isLoadingNews" class="news-loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 44 44" stroke="#8BE9FD"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/></circle></g></svg>
           </div>
        </div>

        <button
          class="news-nav news-nav--right"
          aria-label="Next"
          type="button"
          :disabled="disableRightNewsButton"
          @click="scrollNewsCarousel('right')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"/></svg>
        </button>
      </div>
    </div>

    <div v-if="userResults.length > 0" class="user-search-section">
      <div class="section-header" @click="collapsedSections.users = !collapsedSections.users">
        <h2 class="section-title">Users</h2>
        <button class="expand-btn" :aria-label="collapsedSections.users ? 'Expand' : 'Collapse'">
          <svg v-if="collapsedSections.users" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
        </button>
      </div>
      <div v-show="!collapsedSections.users" class="user-search-grid">
        <NuxtLink
          v-for="u in userResults"
          :key="u.email"
          :to="u.alias ? `/u/${u.alias}` : '#'"
          class="user-search-card">
          <img :src="u.avatar || '/avatars/avatar-ss0.png'" :alt="u.alias || u.first_name" class="user-search-avatar" />
          <div class="user-search-info">
            <span class="user-search-alias">{{ u.alias ? `@${u.alias}` : (u.first_name || u.email) }}</span>
            <span v-if="u.bio" class="user-search-bio">{{ u.bio }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <CategoryCarousel title="Movies" :items="movies" key-prefix="movie" :has-more="hasMore" :loading="loading" @loadMore="$emit('loadMore')" />
    <CategoryCarousel title="TV Shows" :items="tvShows" key-prefix="tv" :has-more="hasMore" :loading="loading" @loadMore="$emit('loadMore')" />
    <CategoryCarousel title="People" :items="people" key-prefix="person" :has-more="hasMore" :loading="loading" @loadMore="$emit('loadMore')" />
    <CategoryCarousel title="Streaming Services" :items="streamingServices" key-prefix="streaming" :has-more="hasMore" :loading="loading" @loadMore="$emit('loadMore')" />
    <CategoryCarousel title="Production Companies" :items="productionCompanies" key-prefix="company" :has-more="hasMore" :loading="loading" @loadMore="$emit('loadMore')" />
    <CategorySection title="Festivals" :items="festivals" :collapsed="collapsedSections.festivals" key-prefix="festival" @toggle="toggleSection('festivals')" />
    <CategorySection title="Others" :items="others" :collapsed="collapsedSections.others" key-prefix="other" @toggle="toggleSection('others')" />

  </div>
</template>

<script>
import Card from '~/components/Card';
import NewsResultCard from '~/components/search/NewsResultCard.vue';
import CategorySection from '~/components/search/CategorySection.vue';
import CategoryCarousel from '~/components/search/CategoryCarousel.vue';
import DiscoverSearch from '~/components/search/DiscoverSearch.vue';

import axios from 'axios';

export default {
  components: {
    Card,
    NewsResultCard,
    CategorySection,
    CategoryCarousel,
    DiscoverSearch
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },

    items: {
      type: Object,
      required: true,
    },

    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    
    searchQuery: {
      type: String,
      required: false,
      default: '',
    }
  },

  data() {
    return {
      typoCheckInProgress: false,
      suggestedCorrection: null,
      discoverOpen: false,
      collapsedSections: {
        news: false,
        festivals: false,
        others: false,
        users: false
      },
      localNews: [],
      newsPage: 1,
      hasMoreNews: true,
      isLoadingNews: false,
      disableLeftNewsButton: true,
      disableRightNewsButton: false,
      userResults: [],
      isLoadingUsers: false,
    };
  },

  computed: {
    results() {
        return this.items && this.items.results ? this.items.results : [];
    },
    hasMore() {
      return this.items && this.items.page < this.items.total_pages;
    },
    people() {
      return this.results.filter(i => i.media_type === 'person').sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    },
    festivals() {
      return this.results.filter(i => i.media_type === 'festival');
    },
    productionCompanies() {
      return this.results.filter(i => i.media_type === 'production').sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    },
    streamingServices() {
      return this.results.filter(i => i.media_type === 'streaming').sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    },
    movies() {
      return this.results.filter(i => i.media_type === 'movie').sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    },
    tvShows() {
      return this.results.filter(i => i.media_type === 'tv').sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    },
    others() {
      const knownTypes = ['person', 'festival', 'production', 'streaming', 'movie', 'tv'];
      return this.results.filter(i => !knownTypes.includes(i.media_type));
    },
    sortedNews() {
      return [...this.localNews].sort((a, b) => {
        const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
        const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
        return timeB - timeA;
      });
    }
  },

  watch: {
    'items.results': {
      handler(newResults) {
        if (newResults && newResults.length === 0 && !this.loading && this.searchQuery) {
          this.checkForTypos();
        } else {
          this.suggestedCorrection = null;
        }
      },
      deep: true
    },
    'items.news': {
      handler(newNews) {
        if (newNews && newNews.length > 0) {
             this.localNews = [...newNews];
             
             this.newsPage = 1;
             this.hasMoreNews = true;
             this.isLoadingNews = false;
             this.$nextTick(() => {
               this.updateNewsNavButtons();
             });
        }
      },
      immediate: true
    },
    searchQuery: {
      handler(q) {
        this.localNews = [];
        this.newsPage = 1;
        this.hasMoreNews = true;
        this.isLoadingNews = false;
        this.fetchUserResults(q);
      }
    }
  },

  mounted() {
    if (this.items.results && this.items.results.length === 0 && !this.loading && this.searchQuery) {
      this.checkForTypos();
    }
    if (this.searchQuery) this.fetchUserResults(this.searchQuery);
  },

  methods: {
    toggleSection(section) {
        this.collapsedSections[section] = !this.collapsedSections[section];
    },

    onNewsScroll(e) {
        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        
        this.updateNewsNavButtons();
        
        if (scrollWidth - (scrollLeft + clientWidth) < 200 && !this.isLoadingNews) {
            this.loadMoreNews();
        }
    },

    updateNewsNavButtons() {
        if (!this.$refs.newsCarousel) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = this.$refs.newsCarousel;
        
        this.disableLeftNewsButton = scrollLeft <= 10;
        this.disableRightNewsButton = scrollLeft + clientWidth >= scrollWidth - 10;
    },

    scrollNewsCarousel(direction) {
        if (!this.$refs.newsCarousel) return;
        
        const scrollAmount = 350;
        const currentScroll = this.$refs.newsCarousel.scrollLeft;
        
        if (direction === 'left') {
            this.$refs.newsCarousel.scrollTo({
                left: currentScroll - scrollAmount,
                behavior: 'smooth'
            });
        } else {
            this.$refs.newsCarousel.scrollTo({
                left: currentScroll + scrollAmount,
                behavior: 'smooth'
            });
        }
    },

    async loadMoreNews() {
        if (this.isLoadingNews || !this.hasMoreNews || !this.searchQuery) return;

        this.isLoadingNews = true;
        this.newsPage++;

        try {
            const { searchNews } = await import('~/utils/api');
            const data = await searchNews(this.searchQuery, this.newsPage);
            
            if (data.results && data.results.length > 0) {
                const existingIds = new Set(this.localNews.map(item => item.id));
                const newItems = data.results.filter(newItem => !existingIds.has(newItem.id));
                
                if (newItems.length === 0) {
                     this.hasMoreNews = false;
                } else {
                    this.localNews = [...this.localNews, ...newItems];
                    
                    this.$nextTick(() => {
                        this.updateNewsNavButtons();
                    });
                }
            } else {
                this.hasMoreNews = false;
            }
        } catch (error) {
            console.error("Error loading more news:", error);
            this.hasMoreNews = false;
        } finally {
            this.isLoadingNews = false;
        }
    },

    async checkForTypos() {
      if (!this.searchQuery || this.searchQuery.trim().length < 2) return;
      
      try {
        this.typoCheckInProgress = true;
        this.suggestedCorrection = null;

        const response = await axios.post('https://entercinema-assistant-rust.vercel.app/api/typo', {
          query: this.searchQuery
        });
        
        if (response.data && response.data.success && response.data.correction) {
          this.suggestedCorrection = response.data.correction;
        }
      } catch (error) {
        console.error('Error checking for typos:', error);
      } finally {
        this.typoCheckInProgress = false;
      }
    },

    useCorrection() {
      if (this.suggestedCorrection) {
        this.$router.push({
          path: '/search',
          query: { q: this.suggestedCorrection }
        });
        this.$bus.$emit('update-search-query', this.suggestedCorrection);
      }
    },

    async fetchUserResults(q) {
      this.userResults = [];
      this.isLoadingUsers = true;
      try {
        if (!q || q.trim().length < 2) {
          return;
        }
        const resp = await fetch(`https://entercinema-follows-rust.vercel.app/user-search?q=${encodeURIComponent(q.trim())}&limit=6`);
        if (resp.ok) {
          const data = await resp.json();
          this.userResults = data.users || [];
        }
      } catch(e) { console.error('Error fetching user search results:', e); }
      finally {
        this.isLoadingUsers = false;
      }
    }
  },
};
</script>

<style scoped>
.no-results {
  text-align: center;
  color: #fff;
  margin: 2rem auto;
  max-width: 600px;
}

.no-results__title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.typo-checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
}

.typo-checking p {
  margin-top: 0.5rem;
  opacity: 0.7;
  font-size: 1rem;
}

.suggestion {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(33, 150, 243, 0.15);
  font-size: 1.5rem;
}

.suggestion a {
  color: #7FDBF1;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.suggestion a:hover {
  color: #7FDBF1;
}

.discover-more {
  margin-top: 10px;
  font-size: 14px;
  color: #e0e0e0;
}

.highlight {
  color: #7FDBF1;
  font-weight: 500;
}

.discovery-link {
  color: #7FDBF1;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px dotted rgba(127, 219, 241, 0.4);
}

.discovery-link:hover {
  color: #fff;
  border-bottom-color: #fff;
}

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


.news-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.news-carousel-wrapper {
  position: relative;
}

.news-carousel {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 15px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.news-carousel::-webkit-scrollbar {
  height: 6px;
}

.news-carousel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.news-carousel::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 3px;
}

.news-carousel-item {
  flex: 0 0 310px;
  max-width: 310px;
}

.news-loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 100%;
}

.news-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.news-nav:hover:not(:disabled) {
  background: rgba(139, 233, 253, 0.2);
  border-color: rgba(139, 233, 253, 0.6);
  transform: translateY(-50%) scale(1.1);
}

.news-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.news-nav--left {
  left: -20px;
}

.news-nav--right {
  right: -20px;
}

@media (max-width: 768px) {
  .news-nav {
    display: none;
  }
}

.id-match-banner {
    background: rgba(139, 233, 253, 0.15);
    border: 1px solid rgba(139, 233, 253, 0.3);
    color: #8BE9FD;
    padding: 10px 15px;
    border-radius: 6px;
    margin: 0 0 20px 0;
    text-align: left;
    font-weight: 500;
    width: fit-content;
}

.discover-search-bar {
  margin-bottom: 2rem;
}

.filters-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 38px;
  padding: 0 1.2rem;
  background: transparent;
  border: 1px solid rgba(139, 233, 253, 0.25);
  border-radius: 8px;
  color: #8BE9FD;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.2rem;

  svg {
    stroke: #8BE9FD;
    flex-shrink: 0;
  }

  &:hover {
    border-color: rgba(139, 233, 253, 0.5);
  }

  &--active {
    border-color: rgba(139, 233, 253, 0.5);
    background: rgba(139, 233, 253, 0.07);
  }
}

.discover-expand-enter-active,
.discover-expand-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.discover-expand-enter-from,
.discover-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.user-search-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.user-search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.user-search-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(139,233,253,0.12);
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba(139,233,253,0.4);
    background: rgba(139,233,253,0.06);
  }
}

.user-search-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(139,233,253,0.3);
  flex-shrink: 0;
}

.user-search-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-search-alias {
  font-size: 1.3rem;
  font-weight: 600;
  color: #8BE9FD;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-search-bio {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

