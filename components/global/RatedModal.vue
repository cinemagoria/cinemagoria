<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="rated-items-modal" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h2 class="title-primary">Your Rated Picks</h2>
          <p class="modal-subtitle">
            Manage your ratings and reviews.
          </p>
        </div>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="tab-controls">
        <button 
          :class="['tab-btn', { active: currentTab === 'movies' }]" 
          @click="currentTab = 'movies'"
        >
          <span class="tab-labels">Movies</span>
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'tv' }]" 
          @click="currentTab = 'tv'"
        >
          <span class="tab-labels">TV Shows</span>
        </button>
      </div>
      
      <div class="rated-items-content">
        <div v-if="loading" class="loader">
          <Loader :size="60" color="#8BE9FD" />
        </div>
        
        <div v-else-if="filteredRatedItems && filteredRatedItems.length > 0" class="rated-items-list">
        <div v-for="(item, index) in filteredRatedItems" :key="index" class="rated-item">
            <div class="rated-item-image-container">
              <button
                type="button"
                class="external-link-btn"
                title="Open in new tab"
                @click.stop.prevent="openExternal(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>
                </svg>
              </button>
              <div v-if="isImageLoading(item)" class="card-loader">
                <Loader :size="30" />
              </div>
              <img
                :src="getPosterUrl(item.details.posterForDb)"
                class="rated-item-poster"
                :alt="item.details.nameForDb"
                loading="lazy"
                decoding="async"
                :style="{ opacity: isImageLoading(item) ? 0 : 1, transition: 'opacity 0.3s ease' }"
                @load="handleImageLoad(item)"
                @error="handleImageLoad(item)"
              >
            </div>
            <div class="rated-item-info">
              <h4 class="rated-item-title" @click="navigateToItem(item)">{{ item.details.nameForDb }}</h4>
              <div class="rated-item-meta">
                <span>{{ item.details.yearStartForDb }}</span>
                <div class="rated-item-rating">
                  <span>Rating:</span>
                  <div @click="openRatingModal(item)" class="rating-badge editable" :title="'Click to edit rating'">
                    {{ item.details.userRatingForDb }}
                  </div>
                </div>
              </div>
              <div class="rated-item-review-container">
                <div v-if="item.details.userReview" class="rated-item-review">
                  {{ item.details.userReview }}
                </div>

              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <p>No rated {{ currentTab === 'movies' ? 'movies' : 'TV shows' }} yet.</p>
          <p>Rate some {{ currentTab === 'movies' ? 'movies' : 'TV shows' }} to see them here!</p>
        </div>
      </div>
    </div>

    <div v-if="ratingModalVisible" class="rating-modal-overlay" @click="closeRatingModal">
      <div class="rating-modal" @click.stop>
        <div class="modal-header">
          <h3>Rate '{{ currentRatingItem?.details?.nameForDb }}'</h3>
          <button class="close-btn" @click="closeRatingModal">×</button>
        </div>
        
        <div class="rating-content">
          <div class="rating-selector">
            <div class="rating-numbers">
              <button 
                v-for="n in 10" 
                :key="n" 
                @click="setRating(n)"
                @mouseover="previewRating(n)"
                @mouseout="resetPreview()"
                :class="[
                  'rating-btn', 
                  { 'rating-btn-active': n <= (hoverRating || selectedRating) }
                ]"
              >
                {{ n }}
              </button>
            </div>
          </div>
          

          <div class="review-section">
            <textarea
              v-model="userReview"
              :placeholder="selectedRating > 0 ? ratingDescriptions[selectedRating - 1] : 'Select a rating first'"
              class="review-textarea"
              maxlength="2000"
            ></textarea>
            <div class="char-count">{{ userReview.length }}/2000</div>
          </div>
          
          <div class="rating-modal-buttons">
            <button 
              v-if="currentRatingItem && currentRatingItem.details.userRatingForDb && currentRatingItem.details.userRatingForDb !== '-'"
              @click="removeRating" 
              class="remove-rating-btn"
            >
              <span style="position:relative; margin:0 auto;">Remove Rating</span>
            </button>
            
            <button 
              @click="saveRatingAndReview" 
              class="save-btn"
            >
              <span style="position:relative; margin:0 auto;">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Loader from '@/components/Loader';

export default {
  name: 'RatedModal',

  components: {
    Loader
  },
  
  data() {
    return {
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://cinemagoria-favorites-746175915741.us-east1.run.app/api',
      visible: false,
      currentTab: 'movies',
      moviesFetched: [],
      tvFetched: [],
      userEmail: '',
      ratingDescriptions: [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ],
      ratingModalVisible: false,
      currentRatingItem: null,
      selectedRating: 0,
      hoverRating: 0,
      userReview: '',
      loading: false,
      imageLoadingStates: {}
    };
  },
  
  computed: {
    filteredRatedItems() {
      const items = this.currentTab === 'movies' ? this.moviesFetched : this.tvFetched;
      if (!items) return [];
      return items.filter(item => 
        item && item.details && 
        item.details.userRatingForDb && 
        item.details.userRatingForDb !== '-' && 
        parseInt(item.details.userRatingForDb) > 0
      );
    }
  },
  
  mounted() {
    this.$bus.$on('show-rated-modal', this.show);
    
    const email = localStorage.getItem('email');
    this.userEmail = email || '';
  },
  
  beforeDestroy() {
    this.$bus.$off('show-rated-modal', this.show);
  },
  
  methods: {
    getUniqueId(item) {
      if (!item || !item.details) return null;
      return `${item.details.typeForDb}_${item.details.idForDb}`;
    },

    getPosterUrl(path) {
      if (!path) return '/placeholders/image_not_found_yet.webp';
      if (path.startsWith('http')) return path;
      return `https://image.tmdb.org/t/p/w342${path.startsWith('/') ? '' : '/'}${path}`;
    },

    openExternal(item) {
      if (typeof window === 'undefined' || !item?.details) return;
      const { typeForDb, idForDb } = item.details;
      if (!typeForDb || !idForDb) return;
      window.open(`/${typeForDb}/${idForDb}`, '_blank', 'noopener,noreferrer');
    },

    isImageLoading(item) {
      const id = this.getUniqueId(item);
      if (!id) return false;
      return this.imageLoadingStates[id] !== false;
    },

    handleImageLoad(item) {
      const id = this.getUniqueId(item);
      if (id) {
        this.imageLoadingStates[id] = false; 
      }
    },

    async show() {
      this.visible = true;
      await this.fetchRatedItems();
    },
    
    close() {
      this.visible = false;
    },
    
    async fetchRatedItems() {
      this.loading = true;
      this.imageLoadingStates = {};
      try {
        const response = await fetch(`${this.tursoBackendUrl}/ratings/${this.userEmail}`);
        
        if (!response.ok) {
          throw new Error('Error fetching ratings: ' + response.statusText);
        }

        const data = await response.json();

        const moviesFetched = [];
        const tvFetched = [];
        
        if (data.favorites_json.movies) {
          for (const movie of data.favorites_json.movies) {
            const movieKey = Object.keys(movie)[0];
            const movieData = movie[movieKey];
            
            if (!movieData || !movieData.details) continue;
            
            if (movieData.details.external_ids?.imdb_id && !movieData.details.rating_source) {
              try {
                const imdbResponse = await fetch(`/api/imdb-rating/${movieData.details.external_ids.imdb_id}`);
                const imdbData = await imdbResponse.json();
                
                if (imdbData.found) {
                  movieData.details.imdb_rating = imdbData.score;
                  movieData.details.imdb_votes = imdbData.votes;
                  movieData.details.rating_source = 'imdb';
                } else {
                  movieData.details.rating_source = 'tmdb';
                }
              } catch (err) {
                movieData.details.rating_source = 'tmdb';
              }
            } else if (!movieData.details.rating_source) {
              movieData.details.rating_source = movieData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            moviesFetched.push(movieData);
          }
        }

        if (data.favorites_json.tv) {
          for (const tvShow of data.favorites_json.tv) {
            const tvKey = Object.keys(tvShow)[0];
            const tvData = tvShow[tvKey];
            
            if (!tvData || !tvData.details) continue;
            
            if (tvData.details.external_ids?.imdb_id && !tvData.details.rating_source) {
              try {
                const imdbResponse = await fetch(`/api/imdb-rating/${tvData.details.external_ids.imdb_id}`);
                const imdbData = await imdbResponse.json();
                
                if (imdbData.found) {
                  tvData.details.imdb_rating = imdbData.score;
                  tvData.details.imdb_votes = imdbData.votes;
                  tvData.details.rating_source = 'imdb';
                } else {
                  tvData.details.rating_source = 'tmdb';
                }
              } catch (err) {
                tvData.details.rating_source = 'tmdb';
              }
            } else if (!tvData.details.rating_source) {
              tvData.details.rating_source = tvData.details.imdb_rating ? 'imdb' : 'tmdb';
            }
            
            tvFetched.push(tvData);
          }
        }
        
        this.moviesFetched = moviesFetched;
        this.tvFetched = tvFetched;
      } catch (error) {
        console.error('Error fetching rated items:', error);
      } finally {
        this.loading = false;
      }
    },
    
    openRatingModal(item) {
      this.currentRatingItem = item;
      
      if (item.details.userRatingForDb && item.details.userRatingForDb !== '-') {
        this.selectedRating = parseInt(item.details.userRatingForDb);
        this.userReview = item.details.userReview || '';
      } else {
        this.selectedRating = 0;
        this.userReview = '';
      }
      
      this.hoverRating = 0;
      this.ratingModalVisible = true;
    },

    closeRatingModal() {
      this.ratingModalVisible = false;
      this.currentRatingItem = null;
      this.selectedRating = 0;
      this.hoverRating = 0;
      this.userReview = '';
    },

    setRating(rating) {
      this.selectedRating = rating;
    },

    previewRating(rating) {
      this.hoverRating = rating;
    },

    resetPreview() {
      this.hoverRating = 0;
    },

    async saveRatingAndReview() {
      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;
        
        if (this.selectedRating > 0) {
          const response = await fetch(
            `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${typeForDb}/${idForDb}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                rating: this.selectedRating,
                review: this.userReview.trim(),
                item: item.details
              })
            }
          );
          if (!response.ok) throw new Error('Error updating rating');
          item.details.userRatingForDb = this.selectedRating.toString();
          item.details.userReview = this.userReview.trim();
        }

        this.closeRatingModal();
        await this.fetchRatedItems();
        this.$bus.$emit('rated-items-updated');

      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('There was an error saving your rating. Please try again.');
      }
    },

    async removeRating() {
      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;

        const response = await fetch(
          `${this.tursoBackendUrl}/favorites/rating/${this.userEmail}/${typeForDb}/${idForDb}`,
          {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              rating: null, 
              review: '' 
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error removing rating: ' + response.statusText);
        }

        item.details.userRatingForDb = '-';
        item.details.userReview = '';

        this.closeRatingModal();
        await this.fetchRatedItems();
        this.$bus.$emit('rated-items-updated');

      } catch (error) {
        console.error('Error removing rating:', error);
        alert('There was an error removing your rating. Please try again.');
      }
    },

    navigateToItem(item) {
      if (!item?.details) return;
      const { typeForDb, idForDb } = item.details;
      if (!typeForDb || !idForDb) return;
      this.close();
      this.$router.push(`/${typeForDb}/${idForDb}`);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(3, 4, 6, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
  font-family: var(--font-display);
}

.rated-items-modal {
    position: relative;
  width: 100%;
  max-width: 850px;
  height: auto;
  max-height: 90vh;
  background: rgba(3, 4, 6, 0.85);
    background-image:
      radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
      radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(31, 84, 103, 0.5),
      inset 0 0 24px rgba(139, 233, 253, 0.04);
  border-radius: 20px;
  border: 1px solid rgba(127, 219, 241, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.307);
}

.modal-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2.4rem;
  font-weight: 500;
  font-family: 'Ortica', 'Roboto', sans-serif;
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1.2;
  color: #8BE9FD;
  text-shadow: 
      0 1px 2px rgba(255, 255, 255, 0.3),
      0 2px 8px rgba(255, 255, 255, 0.2),
      0 4px 16px rgba(139, 233, 253, 0.15);
  text-align: center;
}

.header-content {
  flex: 1;
  text-align: center;
}

.modal-subtitle {
  color: rgb(172, 175, 181);
  font-size: 13px;
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 4rem;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}

.tab-controls {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.307);
  text-align: center;
  position: relative;
  padding-left: 10px;
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.4rem;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-align: center;
  font-family: 'Ortica', 'Roboto', sans-serif;
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-shadow: 
      0 1px 2px rgba(255, 255, 255, 0.3),
      0 2px 8px rgba(255, 255, 255, 0.2),
      0 4px 16px rgba(139, 233, 253, 0.15);
}

.tab-btn.active {
  color: #8BE9FD;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #8BE9FD;
}

.rated-items-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.rated-items-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.rated-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  border: 0.5px solid #8AE8FC;
  transition: transform 0.2s ease;
  position: relative;
}

.rated-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.rated-item-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
}

.external-link-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  z-index: 5;
  opacity: 0.85;
  transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.external-link-btn:hover {
  opacity: 1;
  background: #8BE9FD;
  color: #000;
}

.external-link-btn svg {
  display: block;
}

.rated-item-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  background-color: #0d1a22;
  z-index: 2;
}

.rated-item-info {
  padding: 10px;
}

.rated-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.rated-item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.rated-item-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-badge {
  background: #8BE9FD;
  color: #000;
  font-size: 11px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-badge.editable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-badge.editable:hover {
  background: #66deff;
  transform: scale(1.1);
}

.rated-item-review-container {
  position: relative;
  margin-top: 8px;
}

.rated-item-review {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  max-height: 60px;
  overflow-y: auto;
  padding-right: 4px;
  line-height: 1.3;
}

.rated-item-review::-webkit-scrollbar {
  width: 3px;
}

.rated-item-review::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.307);
}

.rated-item-review::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.5);
  border-radius: 2px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.empty-state svg {
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.4rem;
  margin: 0;
}

.rating-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.rating-modal {
  width: 100%;
  max-width: 360px;
  background: rgba(3, 4, 6, 0.85);
    background-image:
      radial-gradient(circle at 15% 20%, rgba(31, 84, 103, 0.18), transparent 35%),
      radial-gradient(circle at 85% 80%, rgba(139, 233, 253, 0.08), transparent 30%);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(31, 84, 103, 0.5),
      inset 0 0 24px rgba(139, 233, 253, 0.04);
  display: flex;
  flex-direction: column;
}

.rating-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-selector {
  width: 100%;
  margin-bottom: 20px;
}

.rating-numbers {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.rating-numbers::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: rgba(255, 255, 255, 0.07);
  transform: translateY(-50%);
  z-index: 0;
}

.rating-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #041019;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  z-index: 2;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-btn-active {
  background: #8BE9FD;
  color: #000;
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
}

.rating-btn:hover {
  transform: scale(1.15);
}

.review-section {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}

.review-textarea {
  width: 100%;
  height: 160px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-size: 1.3rem;
  resize: none;
  transition: border-color 0.2s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
}

.review-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.4);
}

.rating-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.save-btn {
  background: rgba(139, 233, 253, 0.12);
  color: #8BE9FD;
  border: 1px solid rgba(139, 233, 253, 0.35);
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.8rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn:hover {
  background: rgba(139, 233, 253, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 233, 253, 0.2);
}

.save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.remove-rating-btn {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
  border: 1px solid rgba(255, 107, 107, 0.35);
  font-size: 1.3rem;
  font-weight: 600;
  padding: 0.8rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 70vh;
}

.remove-rating-btn:hover {
  background: rgba(255, 0, 0, 0.4);
  border-color: rgba(255, 0, 0, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
}

@media (max-width: 600px) {
  .modal-overlay {
    padding: 10px;
  }

  .rated-items-modal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #8BE9FD, #1F5467, transparent);
    opacity: 0.8;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    pointer-events: none;
    z-index: 2;
  }

  .rated-items-modal {
    max-width: 100%;
    max-height: 80vh;
    max-height: 80dvh;
    border-radius: 12px;
  }
  
  .rated-items-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .rated-item-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 400px) {
  .rating-modal {
    max-width: 300px;
  }
  
  .rating-btn {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
  
  .modal-header h3 {
    font-size: 1.4rem;
  }
  
  .review-textarea {
    font-size: 1.2rem;
  }
  
  .rating-modal-buttons {
    flex-direction: column;
  }
  
  .rating-modal-buttons .save-btn,
  .remove-rating-btn {
    max-width: 100%;
  }
}

.title-primary {
  margin: 0 auto;
  font-size: 2.4rem;
}

.tab-labels {
  text-transform: uppercase;
  margin: 0 auto;
  position: relative;
  font-size: 1.6rem;
}

</style>