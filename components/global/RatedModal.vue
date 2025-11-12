<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="rated-items-modal" @click.stop>
      <div class="modal-header">
        <h3 class="title-primary">Your Rated Picks</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="tab-controls">
        <button 
          :class="['tab-btn', { active: currentTab === 'movies' }]" 
          @click="currentTab = 'movies'"
        >
          <span style="position:relative; margin:0 auto;">Movies</span>
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'tv' }]" 
          @click="currentTab = 'tv'"
        >
          <span style="position:relative; margin:0 auto;">TV Shows</span>
        </button>
      </div>
      
      <div class="rated-items-content">
        <div v-if="filteredRatedItems && filteredRatedItems.length > 0" class="rated-items-list">
          <div v-for="(item, index) in filteredRatedItems" :key="index" class="rated-item">
            <img :src="item.details.posterForDb" class="rated-item-poster" :alt="item.details.nameForDb">
            <div class="rated-item-info">
              <h4 class="rated-item-title">{{ item.details.nameForDb }}</h4>
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
          <p>No rated {{ currentTab === 'movies' ? 'movies' : 'TV shows' }} yet.</p>
          <p>Rate some {{ currentTab === 'movies' ? 'movies' : 'TV shows' }} to see them here!</p>
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
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
              <span style="position:relative; margin:0 auto;">Remove Rating</span>
            </button>
            
            <button 
              @click="saveRatingAndReview" 
              class="save-btn"
              :disabled="selectedRating === 0"
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
import supabase from '@/services/supabase';

export default {
  name: 'RatedModal',
  
  data() {
    return {
      visible: false,
      currentTab: 'movies',
      moviesFetched: [],
      tvFetched: [],
      userEmail: '',
      ratingDescriptions: [
        'Terrible, a complete waste of time',
        'Very bad, hard to finish',
        'Bad, few redeeming qualities',
        'Mediocre, barely passable',
        'Average, has its moments',
        'Decent, entertaining but forgettable',
        'Good, worth watching',
        'Very good, recommended',
        'Excellent, a great experience',
        'Masterpiece, must-see'
      ],
      // Rating modal state
      ratingModalVisible: false,
      currentRatingItem: null,
      selectedRating: 0,
      hoverRating: 0,
      userReview: ''
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
    this.$root.$on('show-rated-modal', this.show);
    
    const email = localStorage.getItem('email');
    this.userEmail = email || '';
  },
  
  beforeDestroy() {
    this.$root.$off('show-rated-modal', this.show);
  },
  
  methods: {
    async show() {
      this.visible = true;
      await this.fetchRatedItems();
    },
    
    close() {
      this.visible = false;
    },
    
    async fetchRatedItems() {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail);

        if (error) throw new Error('Error fetching favorites: ' + error.message);

        const moviesFetched = [];
        const tvFetched = [];
        
        for (const row of data) {
          if (row.favorites_json.movies) {
            for (const movie of row.favorites_json.movies) {
              const movieKey = Object.keys(movie)[0];
              const movieData = movie[movieKey];
              
              if (!movieData || !movieData.details) continue;
              
              if (movieData.details.external_ids?.imdb_id && !movieData.details.rating_source) {
                try {
                  const response = await fetch(`/api/imdb-rating/${movieData.details.external_ids.imdb_id}`);
                  const imdbData = await response.json();
                  
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

          if (row.favorites_json.tv) {
            for (const tvShow of row.favorites_json.tv) {
              const tvKey = Object.keys(tvShow)[0];
              const tvData = tvShow[tvKey];
              
              if (!tvData || !tvData.details) continue;
              
              if (tvData.details.external_ids?.imdb_id && !tvData.details.rating_source) {
                try {
                  const response = await fetch(`/api/imdb-rating/${tvData.details.external_ids.imdb_id}`);
                  const imdbData = await response.json();
                  
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
        }
        
        this.moviesFetched = moviesFetched.reverse();
        this.tvFetched = tvFetched.reverse();
      } catch (error) {
        console.error('Error fetching rated items:', error);
      }
    },
    
    // Rating modal methods
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
        alert('Please select a rating between 1 and 10');
        return;
      }

      if (!this.userReview.trim()) {
        this.userReview = this.ratingDescriptions[this.selectedRating - 1];
      }

      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;
        const itemKey = `${typeForDb}/${idForDb}`;

        const { data: favoritesData, error } = await supabase
          .from('favorites')
          .select('favorites_json')
          .eq('user_email', this.userEmail);
        
        if (error) {
          throw new Error('Error fetching favorites: ' + error.message);
        }
        
        if (!favoritesData || !favoritesData.length) {
          throw new Error('No favorites found for user');
        }
        
        const favoritesObject = favoritesData[0].favorites_json || {};
        const itemType = typeForDb === 'tv' ? 'tv' : 'movies';
        
        if (!favoritesObject[itemType]) {
          throw new Error(`No favorites of type ${itemType} found`);
        }
        
        const updatedItems = favoritesObject[itemType].map(favItem => {
          const favItemKey = Object.keys(favItem)[0];
          if (favItemKey === itemKey) {
            favItem[favItemKey].details.userRatingForDb = this.selectedRating.toString();
            favItem[favItemKey].details.userReview = this.userReview.trim();
          }
          return favItem;
        });
        
        favoritesObject[itemType] = updatedItems;
        
        const { error: updateError } = await supabase
          .from('favorites')
          .update({ favorites_json: favoritesObject })
          .eq('user_email', this.userEmail);
        
        if (updateError) {
          throw new Error('Error updating rating: ' + updateError.message);
        }
        
        item.details.userRatingForDb = this.selectedRating.toString();
        item.details.userReview = this.userReview.trim();
        
        this.closeRatingModal();
        await this.fetchRatedItems();
        this.$root.$emit('rated-items-updated');
        
      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('There was an error saving your rating. Please try again.');
      }
    },

    async removeRating() {
      try {
        const item = this.currentRatingItem;
        const { typeForDb, idForDb } = item.details;
        const itemKey = `${typeForDb}/${idForDb}`;

        const { data: favoritesData, error } = await supabase
          .from('favorites')
          .select('favorites_json')
          .eq('user_email', this.userEmail);
        
        if (error) throw new Error('Error fetching favorites: ' + error.message);
        if (!favoritesData || !favoritesData.length) return;
        
        const favoritesObject = favoritesData[0].favorites_json || {};
        const itemType = typeForDb === 'tv' ? 'tv' : 'movies';
        
        if (!favoritesObject[itemType]) return;

        const updatedItems = favoritesObject[itemType].map(favItem => {
          const favItemKey = Object.keys(favItem)[0];
          if (favItemKey === itemKey) {
            delete favItem[favItemKey].details.userRatingForDb;
            delete favItem[favItemKey].details.userReview;
          }
          return favItem;
        });
        
        favoritesObject[itemType] = updatedItems;
        
        const { error: updateError } = await supabase
          .from('favorites')
          .update({ favorites_json: favoritesObject })
          .eq('user_email', this.userEmail);
        
        if (updateError) throw new Error('Error removing rating: ' + updateError.message);
        
        item.details.userRatingForDb = '-';
        item.details.userReview = '';
        
        this.closeRatingModal();
        await this.fetchRatedItems();
        this.$root.$emit('rated-items-updated');
        
      } catch (error) {
        console.error('Error removing rating:', error);
        alert('There was an error removing your rating. Please try again.');
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
  z-index: 1000;
  padding: 20px;
  font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
}

.rated-items-modal {
  width: 100%;
  max-width: 850px;
  height: auto;
  max-height: 90vh;
  background: linear-gradient(to bottom right, #092739, #000000);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  font-family: 'GrandCru', 'Roboto', sans-serif;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  font-family: 'GrandCru', 'Roboto', sans-serif;
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

.rated-item-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
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
  background: rgba(255, 255, 255, 0.05);
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

/* Rating Modal Styles */
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
</style>