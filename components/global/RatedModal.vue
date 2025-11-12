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
                  <div v-if="editingRating !== index" @click="startEditRating(index, item)" class="rating-badge editable" :title="'Click to edit rating'">
                    {{ item.details.userRatingForDb }}
                  </div>
                  <div v-else class="rating-edit-controls">
                    <select v-model="tempRating" class="rating-select">
                      <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                    </select>
                    <button @click="saveRating(item)" class="edit-btn save-btn"><span style="color:black !important;">✓</span></button>
                    <button @click="cancelEditRating" class="edit-btn cancel-btn">✕</button>
                  </div>
                </div>
              </div>
              <div v-if="editingReview !== index" class="rated-item-review-container">
                <div v-if="item.details.userReview" class="rated-item-review">
                  {{ item.details.userReview }}
                </div>
                <div v-else class="rated-item-review">
                  {{ ratingDescriptions[parseInt(item.details.userRatingForDb) - 1] }}
                </div>
                <br>
                <br>
                <button @click="startEditReview(index, item)" class="edit-review-btn">
                  <span v-if="item.details.userReview">Edit review</span>
                  <span v-else>Add review</span>
                </button>
              </div>
              <div v-else class="review-edit-container">
                <textarea v-model="tempReview" rows="3" class="review-textarea" placeholder="Write your review here..."></textarea>
                <div class="review-btn-container">
                  <button @click="saveReview(item)" class="edit-btn-rvw save-btn">Save</button>
                  <button @click="cancelEditReview" class="edit-btn-rvw cancel-btn">Cancel</button>
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
      editingRating: null,
      editingReview: null,
      tempRating: 1,
      tempReview: '',
      currentEditItem: null,
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
      ]
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
    // Escuchar el evento global para abrir el modal
    this.$root.$on('show-rated-modal', this.show);
    
    const email = localStorage.getItem('email');
    this.userEmail = email || '';
  },
  
  beforeDestroy() {
    // Limpiar el listener
    this.$root.$off('show-rated-modal', this.show);
  },
  
  methods: {
    async show() {
      this.visible = true;
      await this.fetchRatedItems();
    },
    
    close() {
      this.visible = false;
      this.cancelEditRating();
      this.cancelEditReview();
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
              
              // Fetch IMDb rating if needed
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
    
    startEditRating(index, item) {
      this.editingRating = index;
      this.currentEditItem = item;
      this.tempRating = parseInt(item.details.userRatingForDb) || 1;
    },
    
    cancelEditRating() {
      this.editingRating = null;
      this.currentEditItem = null;
      this.tempRating = 1;
    },
    
    async saveRating(item) {
      if (!item || !item.details) return;
      
      try {
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
            favItem[favItemKey].details.userRatingForDb = this.tempRating.toString();
          }
          return favItem;
        });
        
        favoritesObject[itemType] = updatedItems;

        const { error: updateError } = await supabase
          .from('favorites')
          .update({ favorites_json: favoritesObject })
          .eq('user_email', this.userEmail);
          
        if (updateError) throw new Error('Error updating rating: ' + updateError.message);

        item.details.userRatingForDb = this.tempRating.toString();
        this.cancelEditRating();
        
        // Emitir evento para que otras páginas actualicen sus datos
        this.$root.$emit('rated-items-updated');
      } catch(error) {
        console.error('Error saving rating:', error);
      }
    },
    
    startEditReview(index, item) {
      this.editingReview = index;
      this.currentEditItem = item;
      this.tempReview = item.details.userReview || '';
    },
    
    cancelEditReview() {
      this.editingReview = null;
      this.currentEditItem = null;
      this.tempReview = '';
    },
    
    async saveReview(item) {
      if (!item || !item.details) return;
      
      try {
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
            favItem[favItemKey].details.userReview = this.tempReview.trim();
          }
          return favItem;
        });
        
        favoritesObject[itemType] = updatedItems;

        const { error: updateError } = await supabase
          .from('favorites')
          .update({ favorites_json: favoritesObject })
          .eq('user_email', this.userEmail);
          
        if (updateError) throw new Error('Error updating review: ' + updateError.message);

        item.details.userReview = this.tempReview.trim();
        this.cancelEditReview();
        
        // Emitir evento para que otras páginas actualicen sus datos
        this.$root.$emit('rated-items-updated');
      } catch(error) {
        console.error('Error saving review:', error);
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

.edit-review-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  background: transparent;
  border: none;
  color: #8BE9FD;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 3px 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.rated-item-review-container:hover .edit-review-btn {
  opacity: 1;
}

.review-edit-container {
  margin-top: 10px;
}

.review-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  padding: 8px;
  font-size: 1.2rem;
  resize: vertical;
}

.review-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
}

.rating-badge.editable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-badge.editable:hover {
  background: #66deff;
  transform: scale(1.1);
}

.rating-edit-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rating-select {
  background: #041019;
  color: white;
  border: 1px solid #8BE9FD;
  border-radius: 4px;
  padding: 3px;
  width: 40px;
}

.edit-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
}

.edit-btn-rvw {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 15 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 20px;
  border-radius: 15px;
  gap: 20px;
  position: relative;
}

.save-btn {
  background: #8BE9FD;
  color: #000;
}

.save-btn:hover {
  background: #518692;
}

.cancel-btn {
  background: rgba(255, 0, 0, 0.2);
}

.cancel-btn:hover {
  background: rgba(255, 0, 0, 0.4);
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
</style>