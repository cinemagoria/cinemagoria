<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="rated-items-modal" @click.stop>
      <div class="modal-header">
        <h2 class="title-primary">Tus Valoraciones</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="tab-controls">
        <button 
          :class="['tab-btn', { active: currentTab === 'movies' }]" 
          @click="currentTab = 'movies'"
        >
          <span class="tab-labels">Películas</span>
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'tv' }]" 
          @click="currentTab = 'tv'"
        >
          <span class="tab-labels">Series</span>
        </button>
      </div>
      
      <div class="rated-items-content">
        <div v-if="loading" class="loader">
          <Loader :size="60" color="#8BE9FD" />
        </div>
        
        <div v-else-if="filteredRatedItems && filteredRatedItems.length > 0" class="rated-items-list">
          <div v-for="(item, index) in filteredRatedItems" :key="index" class="rated-item">
            <div class="rated-item-image-container">
              <div v-if="isImageLoading(item)" class="card-loader">
                <Loader :size="30" />
              </div>
              <img 
                :src="item.details.posterForDb" 
                class="rated-item-poster" 
                :alt="item.details.nameForDb"
                :style="{ opacity: isImageLoading(item) ? 0 : 1, transition: 'opacity 0.3s ease' }"
                @load="handleImageLoad(item)"
                @error="handleImageLoad(item)"
              >
            </div>
            <div class="rated-item-info">
              <h4 class="rated-item-title">{{ item.details.nameForDb }}</h4>
              <div class="rated-item-meta">
                <span>{{ item.details.yearStartForDb }}</span>
                <div class="rated-item-rating">
                  <span>Valoración:</span>
                  <div @click="openRatingModal(item)" class="rating-badge editable" :title="'Clic para editar valoración'">
                    {{ item.details.userRatingForDb }}
                  </div>
                </div>
              </div>
              <div class="rated-item-review-container">
                <div v-if="item.details.userReview" class="rated-item-review">
                  {{ item.details.userReview }}
                </div>
                <div v-else class="rated-item-review">
                  {{ ratingDescriptions[parseInt(item.details.userRatingForDb) - 1] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <p>Aún no has valorado {{ currentTab === 'movies' ? 'películas' : 'series' }}.</p>
          <p>¡Valora algunas {{ currentTab === 'movies' ? 'películas' : 'series' }} para verlas aquí!</p>
        </div>
      </div>
    </div>

    <div v-if="ratingModalVisible" class="rating-modal-overlay" @click="closeRatingModal">
      <div class="rating-modal" @click.stop>
        <div class="modal-header">
          <h3>Valorar '{{ currentRatingItem?.details?.nameForDb }}'</h3>
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
              :placeholder="selectedRating > 0 ? ratingDescriptions[selectedRating - 1] : 'Selecciona una valoración primero'"
              class="review-textarea"
              maxlength="500"
              :disabled="selectedRating === 0"
            ></textarea>
            <div class="char-count">{{ userReview.length }}/500</div>
          </div>
          
          <div class="rating-modal-buttons">
            <button 
              v-if="currentRatingItem && currentRatingItem.details.userRatingForDb && currentRatingItem.details.userRatingForDb !== '-'"
              @click="removeRating" 
              class="remove-rating-btn"
            >
              <span style="position:relative; margin:0 auto;">Eliminar</span>
            </button>
            
            <button 
              @click="saveRatingAndReview" 
              class="save-btn"
              :disabled="selectedRating === 0"
            >
              <span style="position:relative; margin:0 auto;">Guardar</span>
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
      tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app/api',
      visible: false,
      currentTab: 'movies',
      moviesFetched: [],
      tvFetched: [],
      userEmail: '',
      ratingDescriptions: [
        'Terrible, una completa pérdida de tiempo',
        'Muy mala, difícil de terminar',
        'Mala, pocas cualidades destacables',
        'Mediocre, apenas pasable',
        'Normal, tiene sus momentos',
        'Decente, entretenida pero olvidable',
        'Buena, vale la pena verla',
        'Muy buena, recomendada',
        'Excelente, una gran experiencia',
        'Obra maestra, imprescindible'
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
        const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
        
        if (!response.ok) {
          throw new Error('Error fetching favorites: ' + response.statusText);
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
      if (this.selectedRating === 0) {
        alert('Por favor selecciona una valoración entre 1 y 10');
        return;
      }



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
              rating: this.selectedRating,
              review: this.userReview.trim()
            })
          }
        );

        if (!response.ok) {
          throw new Error('Error updating rating: ' + response.statusText);
        }

        item.details.userRatingForDb = this.selectedRating.toString();
        item.details.userReview = this.userReview.trim();

        this.closeRatingModal();
        await this.fetchRatedItems();
        this.$bus.$emit('rated-items-updated');

      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('Hubo un error al guardar tu valoración. Por favor intenta de nuevo.');
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
        alert('Hubo un error al eliminar tu valoración. Por favor intenta de nuevo.');
      }
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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
}

.rated-items-modal {
  width: 100%;
  max-width: 850px;
  height: auto;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(6, 47, 64, 0.98) 0%, rgba(10, 30, 40, 0.99) 100%);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%237ed2e3' fill-opacity='0.1' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
  box-shadow: 0 12px 40px 0 rgba(31, 104, 135, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
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

.modal-header h3 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  font-family: 'Ortica', 'Roboto', sans-serif;
  font-weight: 300;
  letter-spacing: 0.05em;
  line-height: 1.2;
  color: #8BE9FD;
  text-shadow: 
      0 1px 2px rgba(255, 255, 255, 0.3),
      0 2px 8px rgba(255, 255, 255, 0.2),
      0 4px 16px rgba(139, 233, 253, 0.15);
  flex: 1;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.rated-item {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
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
  padding: 12px;
}

.rated-item-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rated-item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

.rated-item-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-badge {
  background: #8BE9FD;
  color: #000;
  font-size: 12px;
  font-weight: bold;
  width: 24px;
  height: 24px;
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
  margin-top: 10px;
}

.rated-item-review {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-height: 80px;
  overflow-y: auto;
  padding-right: 5px;
  line-height: 1.4;
}

.rated-item-review::-webkit-scrollbar {
  width: 4px;
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.rating-modal {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
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
  height: 100px;
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
  background: #8BE9FD;
  color: #000;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  flex: 1;
  max-width: 120px;
  text-align: center;
}

.save-btn:hover {
  background: #7AD6E9;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-rating-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 0, 0, 0.4);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 30px;
  flex: 1;
  max-width: 120px;
  text-align: center;
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

@media (max-width: 768px) {
  .rated-items-modal {
    max-width: 100%;
    height: 90vh;
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