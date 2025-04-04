<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <div v-if="isLoggedIn" class="user-profile">
        <div class="language-selector" style="position: relative; top: 44px; left: -70px;"> 
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">Es</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'español'" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1" @click="changeLanguage('english')">
              <span>English</span>
            </label>
          </div>
        </div>
        <div class="avatar-container" @click="toggleMenu">
          <span v-if="userEmail !== 'undefined'" class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToHome">
              <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round"><path d="M8.5 23.2H1.3V9L12 .8 22.7 9v14.2h-7.2v-5c0-1.9-1.6-3.4-3.5-3.4s-3.5 1.5-3.5 3.4v5z"/></g></svg>
              <span class="menu-label1">Inicio</span>
            </div>
            <div class="menu-item" @click="showRatedItems">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <span class="menu-label1" style="margin-left: 4px; margin-top: 1px;">VALORACIONES</span>
            </div>
            <div class="menu-item" @click="goToSettings">
              <img src="~/static/icon-settings.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label1">Ajustes</span>
            </div>
            <div class="menu-item" @click="signOut">
              <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
              <span class="menu-label2">Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="user-profile-else">
        <div class="language-selector" style="position: relative; top: -60.9px; left: -70px;"> 
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">Es</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'español'" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1" @click="changeLanguage('english')">
              <span>English</span>
            </label>
          </div>
        </div>
        <div class="avatar-container-else" @click="toggleMenu">
            <div>
              <span class="menu-label1" @click="goToLogin">Iniciar sesión</span>
            </div>
        </div>
      </div>
      <br>
      <nav class="navbar" style="margin-top: 2rem;">
        <h1 class="navbar-welcome">Mi Lista</h1>
      </nav>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <h2 class="text-center" style="color: #acafb5; font-size: 16px;">{{ filterText }} Favoritas</h2>
          <div class="button-container" style="margin-top: 3rem;">
            <select @change="toggleFilter" class="filter-select">
              <option value="movies">&nbsp;&nbsp;&nbsp;Películas</option>
              <option value="tvShows">&nbsp;&nbsp;&nbsp;Series de TV</option>
            </select>
            <select @change="toggleOrder" class="order-select">
              <option value="asc" :selected="orderText === 'Order Asc'">
                <span class="order-word"></span> <span class="order-option">&nbsp;&nbsp;&nbsp;Últimas adiciones</span>
              </option>
              <option value="desc" :selected="orderText === 'Order Desc'">
                <span class="order-word"></span> <span class="order-option">&nbsp;&nbsp;&nbsp;Primeras adiciones</span>
              </option>
            </select>
            <select @change="filterByGenre" class="genre-select">
              <option value="">&nbsp;&nbsp;&nbsp;Todos los géneros</option>
              <option v-for="genre in uniqueGenres" :key="genre" :value="genre">&nbsp;&nbsp;&nbsp;{{ genre }}</option>
            </select>
            <select @change="filterByYear" class="year-select">
              <option value="">&nbsp;&nbsp;&nbsp;Todos los años</option>
              <option v-for="range in yearRanges" :key="range" :value="range">&nbsp;&nbsp;&nbsp;{{ range }}</option>
            </select>
          </div>
          <div class="pagination" v-if="filteredItems.length > itemsPerPage">
            <button @click="goToFirst" :disabled="currentPage === 1">|<</button>
            <button @click="prevPage" :disabled="currentPage === 1"><<</button>
            <span>
              <label for="page" style="font-size:13px;">Page</label>
              <input type="number" id="page" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPage" min="1" :max="totalPages">
            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">>></button>
            <button @click="goToLast" :disabled="currentPage === totalPages">>|</button>
          </div>
          <div class="movie-grid">
              <div v-for="(item, index) in itemsToShow" :key="'item-' + index" class="movie-card">
                <div class="card-background">
                  <div class="user-rating-badge" v-if="item.details && item.details.userRatingForDb && item.details.userRatingForDb !== '-'" 
                    @click.stop="showRatedItems"
                    :class="{ 'has-review': item.details.userReview }" 
                    :title="item.details.userReview ? 'Has Review' : ''">
                    {{ item.details.userRatingForDb }}
                    <span v-if="item.details.userReview" class="review-indicator"></span>
                  </div>
                  <div class="user-rating-badge empty" @click.stop="openRatingModal(item)" v-else> 
                    <span style="font-size: 20px; position: relative; bottom: 2px;">★</span>
                  </div>
                  <a :href="getLink(item)" class="item-link">
                    <img :src="item.details.posterForDb" alt="Poster" class="poster" />
                    <h3>{{ item.details.nameForDb }}</h3>
                  </a>
                <p>
                  {{
                    item.details.yearStartForDb === item.details.yearEndForDb
                    ? item.details.yearEndForDb
                    : (item.details.yearStartForDb + (item.details.yearEndForDb ? `-${item.details.yearEndForDb}` : ''))
                  }}
                </p>

                <div class="card__content">
                  <div v-if="item.details.starsForDb" class="card__stars">
                    <div :style="{ width: `${calculateStarsWidth(formatRating(item.details.starsForDb))}%` }"></div>
                  </div>
                  <div class="card___rating">
                    <p v-if="item.details.starsForDb">{{ formatRating(item.details.starsForDb) }}</p>
                    <p v-else>Not specified.</p>
                  </div>
                </div>

              <svg fill="84E1F6" height="26px" width="26px" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 446.04" @click="removeFavorite(item)" class="delete-icon">
                  <defs>
                      <style>
                          .cls-1 {
                              fill: #84E1F6;
                              stroke: black;
                              stroke-width: 4px;
                          }
                      </style>
                  </defs>
                  <title>Borrar de Mi Lista.</title>
                  <path class="cls-1" d="M252.63 71.41C285.88 36.72 309.17 6.75 360.44.86c96.22-11.07 184.7 87.44 136.11 184.43-.43.85-.88 1.71-1.33 2.58-27.38-23.8-63.15-38.22-102.25-38.22-43.06 0-82.07 17.47-110.29 45.7-28.23 28.23-45.7 67.23-45.7 110.29s17.47 82.06 45.7 110.29l.15.15-30.2 29.96-59.71-57.51C121.09 319.33 3.95 232.26.09 124.36-2.62 48.79 57.02.37 125.62 1.27c61.31.8 87.08 31.31 127.01 70.14zm187.32 214.31c5.88-.05 10.08-.59 9.97 6.7l-.28 23.61c.04 7.62-2.37 9.65-9.51 9.56h-94.32c-7.14.09-9.56-1.94-9.51-9.56l-.29-23.61c-.1-7.29 4.1-6.75 9.97-6.7h93.97zm-46.98-99.11c32.87 0 62.63 13.32 84.17 34.86S512 272.77 512 305.64c0 32.88-13.33 62.64-34.86 84.17-21.54 21.54-51.31 34.86-84.17 34.86-32.88 0-62.64-13.32-84.17-34.86-21.54-21.54-34.87-51.3-34.87-84.17 0-32.88 13.33-62.63 34.86-84.17 21.54-21.54 51.31-34.86 84.18-34.86zm71.79 47.23c-18.37-18.37-43.75-29.74-71.79-29.74-28.04 0-53.43 11.37-71.81 29.74-18.37 18.37-29.73 43.76-29.73 71.8s11.36 53.43 29.74 71.8c18.37 18.37 43.75 29.74 71.8 29.74 28.03 0 53.42-11.37 71.8-29.74 18.37-18.37 29.73-43.76 29.73-71.8s-11.36-53.43-29.74-71.8z"/>
              </svg>
            </div>
          </div>
          </div>          
        </div>
      </div>
      <div v-else>
        <p style="text-align: center;">No hay favoritos agregados todavía.</p>
      </div>
      <div class="pagination" v-if="filteredItems.length > itemsPerPage">
            <button @click="goToFirst" :disabled="currentPage === 1">|<</button>
            <button @click="prevPage" :disabled="currentPage === 1"><<</button>
            <span>
              <label for="page" style="font-size:13px;">Page</label>
              <input type="number" id="page" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPage" min="1" :max="totalPages">
            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">>></button>
            <button @click="goToLast" :disabled="currentPage === totalPages">>|</button>
          </div>
      <br>
      <div v-if="ratingModalVisible" class="modal-overlay">
          <div class="rating-modal">
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
                  :placeholder="selectedRating > 0 ? 
                    ratingDescriptions[selectedRating - 1] : 'Selecciona una valoración primero'"
                  class="review-textarea"
                  maxlength="500"
                  :disabled="selectedRating === 0"
                ></textarea>
                <div class="char-count">{{ userReview.length }}/500</div>
              </div>

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
    </section>
    
    <!-- Modal para valoraciones -->
    <div class="modal-overlay" v-if="ratedItemsModalVisible">
      <div class="rated-items-modal">
        <div class="modal-header">
          <h3>Mis Valoraciones</h3>
          <button class="close-btn" @click="closeRatedItemsModal">&times;</button>
        </div>
        <div class="tab-controls">
          <button 
            class="tab-btn" 
            :class="{ active: ratedItemsTab === 'movies' }" 
            @click="ratedItemsTab = 'movies'"
          >
            Películas
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: ratedItemsTab === 'tv' }" 
            @click="ratedItemsTab = 'tv'"
          >
            Series
          </button>
        </div>
        <div class="rated-items-content">
          <div v-if="filteredRatedItems.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <p>No has valorado ningún {{ ratedItemsTab === 'movies' ? 'película' : 'serie' }} todavía.</p>
          </div>
          <div v-else class="rated-items-list">
            <div v-for="(item, index) in filteredRatedItems" :key="index" class="rated-item">
              <img :src="item.details.posterForDb" alt="Poster" class="rated-item-poster">
              <div class="rated-item-info">
                <h4 class="rated-item-title">{{ item.details.nameForDb }}</h4>
                <div class="rated-item-meta">
                  <span>{{ item.details.yearStartForDb }}</span>
                  <div class="rated-item-rating">
                    <template v-if="editingRating === index">
                      <div class="rating-edit-controls">
                        <select v-model="tempRating" class="rating-select">
                          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                        </select>
                        <button @click="saveRating(item)" class="edit-btn save-btn" title="Guardar">✓</button>
                        <button @click="cancelEditRating" class="edit-btn cancel-btn" title="Cancelar">×</button>
                      </div>
                    </template>
                    <template v-else>
                      <div 
                        class="rating-badge editable" 
                        @click="startEditRating(index, item)"
                        :title="ratingDescriptions[item.details.userRatingForDb - 1]"
                      >
                        {{ item.details.userRatingForDb }}
                      </div>
                    </template>
                  </div>
                </div>
                
                <div class="rated-item-review-container">
                  <template v-if="editingReview === index">
                    <div class="review-edit-container">
                      <textarea 
                        v-model="tempReview" 
                        class="review-textarea" 
                        rows="4"
                        maxlength="500"
                        placeholder="Escribe tu reseña aquí..."
                      ></textarea>
                      <div class="review-btn-container">
                        <button @click="saveReview(item)" class="edit-btn-rvw save-btn">Guardar</button>
                        <button @click="cancelEditReview" class="edit-btn-rvw cancel-btn">Cancelar</button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div v-if="item.details.userReview" class="rated-item-review">
                      {{ item.details.userReview }}
                    </div>
                    <div v-else class="rated-item-review" style="font-style: italic; opacity: 0.7;">
                      No has escrito una reseña todavía.
                    </div>
                    <button @click="startEditReview(index, item)" class="edit-review-btn">
                      {{ item.details.userReview ? 'Editar' : 'Añadir' }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import supabase from '@/services/supabase';

async function getUserAvatar(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('avatar')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user avatar:', error.message);
    }

    const userAvatar = data && data.length > 0 ? data[0]?.avatar : '/avatars/avatar-ss0.png';
    return userAvatar;
    
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return '/avatars/avatar-ss0.png';
  }
}

async function getUserName(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('first_name')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user first name:', error.message);
    }

    const userName = data && data.length > 0 ? data[0]?.first_name || '' : '';
    return userName;
    
  } catch (error) {
    console.error('Error fetching user first_name:', error);
    return '';
  }
}

export default {
  data() {
    return {
      showLanguageMenu: false,
      selectedLanguage: 'español',
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
      favorites: [],
      moviesFetched: [],
      tvFetched: [],
      orderText: 'Order Asc',
      currentPage: 1,
      itemsPerPage: 20,
      itemsPerRow: 4,
      userAvatar: '/avatars/avatar-ss0.png',
      userFirstName: '', 
      isMenuOpen: false,
      filter: 'movies',
      selectedGenre: '',
      selectedYearRange: '',
      genres: [],
      years: [],
      resizeObserver: null,
      ratedItemsModalVisible: false,
      ratedItemsTab: 'movies',
      editingRating: null,
      editingReview: null,
      tempRating: 1,
      tempReview: '',
      currentEditItem: null,
      ratingModalVisible: false,
      currentRatingItem: null,
      selectedRating: 0,
      hoverRating: 0,
      userReview: '',
      ratingDescriptions: [
        'Terrible, una completa pérdida de tiempo',
        'Muy mala, difícil de ver',
        'Mala, poco interesante',
        'Mediocre, apenas pasable',
        'Regular, tiene sus momentos',
        'Decente, entrenenida pero olvidable',
        'Buena, vale la pena mirar',
        'Muy buena, recomendable',
        'Excelente, una gran experiencia',
        'Impresionante, obligatorio ver'
      ],
      filteredSeriesDetails: []
    };
  },
  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    const authProvider = localStorage.getItem('auth_provider') || 'native';
    
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.authProvider = authProvider;

    await this.checkData();
    this.userAvatar = await getUserAvatar(this.userEmail);
    this.userName = await getUserName(this.userEmail);

    if (authProvider === 'native') {
      await this.fetchUserFirstName();
    } 

    this.$nextTick(() => {
      this.calculateItemsPerRow();
      
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        const gridElement = document.querySelector('.movie-grid');
        if (gridElement) {
          this.resizeObserver.observe(gridElement);
        }
      } else {
        window.addEventListener('resize', this.handleResize);
      }
    });

    await this.fetchAndStoreSeriesDetails();
  },

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize);
    }
  },
  
  methods: {
    openRatingModal(item) {
      this.currentRatingItem = item;
      this.selectedRating = 0;
      this.hoverRating = 0;
      this.userReview = '';
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
        await this.checkData();
        
      } catch (error) {
        console.error('Error saving rating and review:', error);
        alert('There was an error saving your rating. Please try again.');
      }
    },
    async fetchAndStoreSeriesDetails() {
      try {
        if (!this.tvFetched || this.tvFetched.length === 0) return;
        
        const detailsArray = this.tvFetched.map(({ details }) => details).filter(Boolean);
        const currentYear = new Date().getFullYear();
        const pastYearsLimit = currentYear - 5;

        const filteredArray = detailsArray.filter(item => 
          item && item.yearEndForDb && item.yearEndForDb >= pastYearsLimit
        );

        const additionalSeries = detailsArray.filter(item => 
          item && item.nextEpisode !== null && item.nextEpisode !== undefined
        );

        const uniqueSeries = [...new Set([...filteredArray, ...additionalSeries])];
        const seriesIds = uniqueSeries.map(item => item.idForDb).filter(Boolean);

        if (seriesIds.length === 0) return;

        const seriesDetails = await this.fetchSeriesDetailsForIds(seriesIds);
        this.filteredSeriesDetails = seriesDetails;

        if (this.userEmail) {
          await this.storeSeriesDetailsInDatabase();
        }
      } catch (error) {
        console.error('Error en fetchAndStoreSeriesDetails:', error);
      }
    },

    async fetchSeriesDetails(seriesId) {
      try {
        const apiKey = process.env.API_KEY;
        const apiLang = process.env.API_LANG;
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=${apiLang}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
          }
        };

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error al obtener detalles de la serie:', error);
        return null;
      }
    },

    async fetchSeriesDetailsForIds(seriesIds) {
      try {
        const seriesPromises = seriesIds.map(id => this.fetchSeriesDetails(id));
        const seriesDetails = await Promise.all(seriesPromises);

        return seriesDetails
          .filter(Boolean)
          .map(series => ({
            name: series.name,
            genres: series.genres ? series.genres.map(genre => ({ id: genre.id, name: genre.name })) : [],
            nextEpisode: series.next_episode_to_air,
            stillPath: series.still_path,
            numberOfEpisodes: series.number_of_episodes,
            numberOfSeasons: series.number_of_seasons,
            firstAirDate: series.first_air_date,
            lastEpisode: series.last_episode_to_air
          }))
          .filter(series => series.nextEpisode !== undefined && series.nextEpisode !== null);
      } catch (error) {
        console.error('Error al obtener y filtrar detalles de las series:', error);
        return [];
      }
    },

    async storeSeriesDetailsInDatabase() {
      try {
        const { error } = await supabase
          .from('notifications')
          .upsert([{
            user_email: this.userEmail,
            series_releases_details: this.filteredSeriesDetails,
          }], { 
            onConflict: ['user_email'],
          });

        if (error) {
          throw new Error('Error al guardar en la base de datos: ' + error.message);
        }
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error.message);
      }
    },

    showRatedItems() {
      this.ratedItemsModalVisible = true;
    },
    
    closeRatedItemsModal() {
      this.ratedItemsModalVisible = false;
      this.cancelEditRating();
      this.cancelEditReview();
    },
    
    startEditRating(index, item) {
      if (!item || !item.details) return;
      
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

        await this.checkData();
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
        
        await this.checkData();
      } catch(error) {
        console.error('Error saving review:', error);
      }
    },
    handleResize() {
      this.calculateItemsPerRow();
      this.adjustItemsPerPage();
    },

    calculateItemsPerRow() {
      const gridElement = document.querySelector('.movie-grid');
      if (!gridElement) return;
      
      const gridWidth = gridElement.offsetWidth;
      const cardWidth = 200;
      const gap = 20;

      const calculatedItemsPerRow = Math.floor(gridWidth / (cardWidth + gap));

      this.itemsPerRow = Math.max(1, calculatedItemsPerRow);
      
      this.adjustItemsPerPage();
    },

    adjustItemsPerPage() {
      const rowsToShow = 5;
      
      const newItemsPerPage = this.itemsPerRow * rowsToShow;

      if (this.itemsPerPage !== newItemsPerPage) {
        this.itemsPerPage = newItemsPerPage;

        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }
      }
    },
    
    async checkData() {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail);

        if (error) {
          throw new Error('Error al conectar con la base de datos: ' + error.message);
        }

        const moviesFetched = [];
        const tvFetched = [];
        const genres = new Set();
        const years = new Set();
        data.forEach((row) => {
          if (row.favorites_json.movies) {
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movie[movieKey]);
              genres.add(...movie[movieKey].details.genresForDb.split(', '));
              years.add(movie[movieKey].details.yearStartForDb);
            });
          }

          if (row.favorites_json.tv) {
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvShow[tvKey]);
              genres.add(...tvShow[tvKey].details.genresForDb.split(', '));
              years.add(tvShow[tvKey].details.yearStartForDb);
            });
          }
        });
        this.moviesFetched = moviesFetched.reverse();
        this.tvFetched = tvFetched.reverse();
        this.genres = Array.from(genres);
        this.years = Array.from(years).sort();
      } catch (error) {
        console.error(error.message);
      }
    },

    removeFavorite(item) {
      if (!item || !item.details) {
        console.error('Item or item details are undefined:', item);
        return;
      }

      try {
        const { typeForDb, idForDb } = item.details;
        const keyToDelete = `${typeForDb}/${idForDb}`;
        this.deleteFavorite(keyToDelete);
      } catch (error) {
        console.error('Error removing favorite:', error.message);
      }
    },

    async deleteFavorite(keyToDelete) {
      try {
        const { data: favoritesData, error } = await supabase
          .from('favorites')
          .select('favorites_json')
          .eq('user_email', this.userEmail);

        if (error) {
          throw new Error('Error al obtener favoritos:', error.message);
        }

        if (!favoritesData || favoritesData.length === 0) {
          console.error('No se encontraron favoritos para el usuario:', this.userEmail);
          return;
        }

        const favoritesObject = favoritesData[0].favorites_json || {};
        const favoriteType = keyToDelete.includes('tv') ? 'tv' : 'movies';
        if (!favoritesObject[favoriteType]) {
          console.error(`No se encontraron favoritos de tipo ${favoriteType} para el usuario`);
          return;
        }

        favoritesObject[favoriteType] = favoritesObject[favoriteType].filter(item => {
          const itemKey = Object.keys(item)[0];
          return itemKey !== keyToDelete;
        });

        const { error: updateError } = await supabase
          .from('favorites')
          .update({ favorites_json: favoritesObject })
          .eq('user_email', this.userEmail);

        if (updateError) {
          throw new Error('Error al actualizar favoritos:', updateError.message);
        }

        await this.checkData();

        return Promise.resolve(); 
      } catch (error) {
        console.error('Error al eliminar favorito:', error.message);
        return Promise.reject(error); 
      }
    },

    toggleLanguageMenu() {
          this.showLanguageMenu = !this.showLanguageMenu;
          const menu = this.$refs.languageMenu;
          if (menu) {
            menu.style.display = this.showLanguageMenu ? 'block' : 'none';
          }
        },

    changeLanguage(language) {
          const currentPath = this.$route.path;
          const currentOrigin = window.location.origin;
          const isSpanish = currentOrigin.includes('es.');

          if (isSpanish) {
            const newOrigin = currentOrigin.replace('es.', '');
            const newUrl = `${newOrigin}${currentPath}`;
            window.location.href = newUrl;
          } else {
            console.log("La URL no tiene el prefijo 'es.', no se necesita ninguna acción.");
          }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    goToHome() {
      this.$router.push({ path: '/' });
    },

    goToSettings() {
      this.$router.push({ path: '/settings' });
    },

    goToLogin() {
        this.$router.push('/login');
      },


    signOut() {
      localStorage.removeItem('email');
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_provider');

      this.$router.push({ path: '/login' });
    },

    toggleOrder(event) {
      this.orderText = event.target.value === 'asc' ? 'Order Asc' : 'Order Desc';
      if (this.orderText === 'Order Asc') {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
      } else {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
      }
    },

    filterByGenre(event) {
      this.selectedGenre = event.target.value;
    },
    filterByYear(event) {
      this.selectedYearRange = event.target.value;
    },

    toggleFilter(event) {
      this.filter = event.target.value;
      this.currentPage = 1;
    },

    formatRating(stars) {
      return (stars / 10).toFixed(1);
    },

    calculateStarsWidth(rating) {
      const maxRating = 10;
      const starWidth = 100 / maxRating;
      const ratingInteger = Math.floor(rating);
      const ratingDecimal = rating - ratingInteger;
      let width = ratingInteger * starWidth;
      if (ratingDecimal > 0) {
        width += starWidth * ratingDecimal;
      }
      return width;
    },

    goToFirst() {
      this.currentPage = 1;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    goToLast() {
      this.currentPage = this.totalPages;
    },

    getLink(item) {
      if (item.details.typeForDb === 'movie') {
        return `https://es.entercinema.com/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
        return `https://es.entercinema.com.com/tv/${item.details.idForDb}`;
      } else {
        return '#'; 
      }
    },
    async fetchUserFirstName() {
      try {
        const { data, error } = await supabase
          .from('auth_user')
          .select('first_name')
          .eq('email', this.userEmail);
        
        if (error) {
          throw new Error('Error connecting to the database: ' + error.message);
        }
        
        this.userFirstName = data.length > 0 ? data[0].first_name : null;
      } catch (error) {
        console.error('Error fetching user first name:', error);
      }
    },
  },
  
  computed: {
    filteredRatedItems() {
      const items = this.ratedItemsTab === 'movies' ? this.moviesFetched : this.tvFetched;
      if (!items) return [];
      return items.filter(item => 
        item && item.details && 
        item.details.userRatingForDb && 
        item.details.userRatingForDb !== '-' && 
        parseInt(item.details.userRatingForDb) > 0
      );
    },

    filteredItems() {
      const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
      if (!items) return [];
      return items.filter(item => {
        if (!item || !item.details) return false;
        const matchesGenre = this.selectedGenre === '' || (item.details.genresForDb && item.details.genresForDb.includes(this.selectedGenre));
        const matchesYear = this.selectedYearRange === '' || 
          (item.details.yearStartForDb && 
           this.selectedYearRange.split('-')[0] && 
           this.selectedYearRange.split('-')[1] && 
           item.details.yearStartForDb >= this.selectedYearRange.split('-')[0] && 
           item.details.yearStartForDb <= this.selectedYearRange.split('-')[1]);
        return matchesGenre && matchesYear;
      }).sort((a, b) => {
        if (!a.addedAt || !b.addedAt) return 0;
        return this.orderText === 'Order Asc' ? new Date(a.addedAt) - new Date(b.addedAt) : new Date(b.addedAt) - new Date(a.addedAt);
      });
    },

    yearRanges() {
      return [
        '1888-1960',
        '1960-1980',
        '1980-2000',
        '2000-2010',
        '2010-2020',
        '2020-2025',
      ];
    },
    uniqueGenres() {
      return Array.from(new Set(this.genres));
    },
    
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },

    itemsToShow() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },

    filterText() {
      return this.filter === 'tvShows' ? 'Series de TV' : 'Películas';
    }
  },
};
</script>


<style scoped>
.card__content {
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin: -5px;
  position: relative;
  top: -3px;
}

.card__stars {
  width: 7.3rem;
  height: 1.2rem;
  background-image: url('~assets/images/stars.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  position: relative;
  margin-right: 0.5rem; 
}

.card__stars > div {
  height: 100%;
  background-image: url('~assets/images/stars-filled.png');
  background-repeat: no-repeat;
  background-size: auto 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.card__rating {
  margin-top: 0.30rem;
}

.card___rating {
  position: relative;
  top: 1px;
}


.avatar-container-else {
    position: relative;
    top: -82.5px;
    font-size: 11.5px;
    left: 10px;
    cursor: pointer;
  }

 .user-profile-else {
    position: absolute;
    right: 4.10%;
  }

  .avatar-else {
    width: 40px;
    border: 1px solid rgba(255, 255, 255, 0.654);
    height: 40px;
    box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
    border-radius: 50%;
    margin-left: 50px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .dropdown-menu-else {
    position: relative; 
    top: 100%;
    height: 38px;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 3px 15px 0 rgba(31, 97, 135, 0.37); 
    border: 1px solid #acafb5;
    border-radius: 5px;
    z-index: 100;
    display: none;
  }

  .dropdown-menu-else.block + .avatar-else {
    margin-left: 20px;
  }

  .dropdown-menu-else {
    display: block;
    left: 5px;
    top: 2px;
  }

.world-icon {
    width: 13px;
    height: 13px;
    position: relative;
    top: 1px;
    left: 2px;
  }

  .language {
    margin-right: 0.5rem;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 11px; 
    text-transform: uppercase;
    border-radius: 15px;
    color: #94999d;
    position: relative;
    top: 1px;
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
  }

  .language-selector {
    position: relative;
    cursor: pointer;
  }

  .language-menu {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    z-index: 1000;
    display: none;
  }

    .language-menu label {
      display: block;
      padding: 0.5rem;
      cursor: pointer;
    }

  .language-menu.active {
    display: block;
  }

.movie-card {
   position: relative;
}

.delete-icon {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

@media screen and (min-width: 724px) {
  .delete-icon:hover,
  .delete-icon:hover .cls-1 {
    fill: #ff0000;
  }
}


.navbar-welcome {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.avatar-container {
  top: 10.5px;
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: relative; 
  width: 149.574px;
  top: 100%;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 5px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  z-index: 100;
  display: none;
}

.dropdown-menu {
  display: block;
  margin-left: 20px;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center-grey {
  text-align: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.menu-label1 {
  color: #94999d;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative; 
  top: 1px;
}

.menu-label1:hover {
  color: #ffffff;
}

.menu-label2 {
  color: #94999d;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 3px;
}

.menu-label2:hover {
  color: #ffffff;
}


.welcome-text {
    text-align: center;
}

.h1 {
  text-align: center;
}

.order-word {
    color: #fff;
}

.order-option {
    color: #94999d;
}

.navbar {
    background-color: transparent;
    margin-top: 3rem;
    text-align: center;
    max-width: 800px; 
    margin: 0 auto; 
    left: 68px;
    top: 8px;
    transition: none 0s ease 0s;
  } 

  .navbar-title {
    color: #fff;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .user-email {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 13px; 
    border-radius: 15px;
    margin-top: 2rem;
    color: #94999d;
    text-align: center;
  }

  .nav-button-container {
    position: absolute; 
    top: 50%;
    transform: translateY(-50%);
    right: 20px; 
  }

  .button-container {
    top: 50%;
    right: 20px; 
  }

  .button-container select {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }



  @media screen and (max-width: 800px) {
    .button-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .button-container select {
      width: 40%;
      margin: 0.5rem;
    }
  }

  .user-profile {
    position: absolute;
    right: 3%; 
    top: -26px;
  }

  .avatar {
    width: 40px;
    border: 1px solid rgba(255, 255, 255, 0.654);
    height: 40px;
    box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
    border-radius: 50%;
    margin-left: 1rem;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .button-logout {
    background-color: #062F40;
    color: #fff;
    border: none;
    margin-left: 8px;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;
    font-weight: bold; 
    font-size: 13px; 
    border-radius: 15px;
  }

  .button-logout:hover {
    background-color: #B22727;
  }

  .logout-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .settings-icon {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }

  .order-select {
    cursor: pointer;
    width: 172.626px;
    height: 34.6172px;
    text-align: center;
    padding: 0.8rem 3.5rem 0.8rem 1.5rem;
    font-size: 1.3rem;
    color: #fff;
    margin-right: 15px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .order-select:hover{
    background-color: #084a66; 
  }

  .filter-select {
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: none !important;
    border-bottom-right-radius: none !important; 
    width: 165.626px;
    text-align: center;
    margin-right: 15px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .filter-select:hover{
    background-color: #084a66; 
  }

  .genre-select {
    width: 168px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    text-align: center;
    width: 165.626px;
    margin-right: 15px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .genre-select:hover{
    background-color: #084a66; 
  }

  .year-select {
    width: 172.626px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    margin-right: 5px;
    text-align: center;
    border: 1px solid rgba( 255, 255, 255, 0.18 );

  }

  .year-select:hover{
    background-color: #084a66; 
  }

  .button:hover{
    background-color: #084a66; 
  }

  .pagination {
    display: flex;
    /* background: black; */
    justify-content: center;
    align-items: center;
    /* border-radius: 15px; */
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    /* border-radius: 15px; */
    width: 90% !important;
    margin: 0 auto;
    background: rgba(82, 71, 71, 0);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    /* width: 80%; */
    /* position: relative; */
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    /* left: -10px; */
    /* top: 40px; */
    margin-top: 1rem;
    position: relative;
    bottom: 0.7rem;
    position: relative;
}

.pagination-footer {
    display: flex;
    /* background: black; */
    justify-content: center;
    align-items: center;
    /* border-radius: 15px; */
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    /* border-radius: 15px; */
    width: 90% !important;
    margin: 0 auto;
    background: rgba(82, 71, 71, 0);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    /* width: 80%; */
    /* position: relative; */
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    /* left: -10px; */
    /* top: 40px; */
    position: relative;
}


.pagination button {
  padding: 0.5rem 1rem;
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 5px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  color: #fff;
  margin: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-footer button {
  padding: 0.5rem 1rem;
  background: rgba( 82, 71, 71, 0 );
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur( 16px );
  -webkit-backdrop-filter: blur( 16px );
  border-radius: 5px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  color: #fff;
  margin: 5px;
  cursor: pointer;
}


  .button,
  a.button {
    display: inline-block;
    padding: 1.5rem 1.5rem;
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1;
    color: #fff;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    }


  .order-button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: bold;
  }

  .order-button svg {
    width: 20px;
    height: 14px;
    margin-left: 5px;
    transition: transform 0.3s ease;
  }

  .order-button span {
    transition: color 0.3s ease;
  }

  .rotate-180 {
    transform: rotate(180deg);
  }
  
  a {
    font-weight: 600;
    color: #80868b;
    text-decoration: none;
  }

  p {
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
  }

  a:hover {
    color: #ffffff;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px; 
    letter-spacing: 2px;
  }

  h3 {
    margin-top: 5px;
    text-align: center;
    letter-spacing: 1.5px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  .button {
    margin: 0 10px; 
    font-size: 14px; 
  }

  @media screen and (max-width: 800px) {
  .navbar {
    left: 68px;
    top: 8px;
    transition: none 0s ease 0s;
  } 
}

@media screen and (max-width: 600px) {
  .button .navbar-title {
    font-size: 12px; 
  }

  
  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    right: 1;
    text-align: center;
  }

  .navbar-title {
    text-align: center;
  }
}

@media screen and (max-width: 375px) {
  .button {
    font-size: 12px; 
  }
}

@media screen and (max-width: 767px) {
    .nav-button-container {
      position: static;
      margin-top: 30px; 
    }
  }


  .profile-section {
    padding: 10px;
    
  }

  .movie-card h3,
  .tv-show-card h3 {
    margin-top: 5px;
    color: #8BE9FD;
    font-size: 14px; 
    margin-top: 10px; 
    text-align: center; 
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis; 
  }

  .movie-card h3:hover,
  .tv-show-card h3:hover {
    color: #ffffff; 
    cursor: pointer; 
  }

  .movie-card p,
  .tv-show-card p {
    font-size: 12px;
    margin: 5px auto; 
    text-align: center;
  }


  .column {
    margin-top: 3rem;
    margin: 0 auto;
    text-align: center;
  }

  h2 {
    text-align: center;
    letter-spacing: 2px;
    font-size: 13px;
    text-transform: uppercase;
    margin: 0 auto; 
    max-width: 800px; 
  }

  .custom-center {
    text-align: center;
  }

  .card-background {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: black;
  }

  .movie-grid,
  .tv-show-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    gap: 20px;
    justify-content: center;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card-background {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: black;
    position: relative;
  }
  
  .user-rating-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #000;
    color: #88E9FD;
    border: 3px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    z-index: 4;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .user-rating-badge:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(139, 233, 253, 0.5);
  }
  
  .user-rating-badge.has-review {
    overflow: visible;
  }
  
  .review-indicator {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #041019;
  }
  
  .user-rating-badge.empty {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #000;
    color: #88E9FD;
    border: 3px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    z-index: 4;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .movie-card img,
  .tv-show-card img {
    width: 60%; 
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    text-align: center;
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .item-link {
    display: block;
    text-decoration: none;
    color: inherit;
    text-align: center;
    transition: transform 0.2s ease;
  }
  
  .item-link:hover {
    transform: translateY(-5px);
  }
  
  /* Rated Items Modal */
  .rated-items-btn {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 30px;
    padding: 8px 15px;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    bottom: -65px;
    right: 40%;
    transition: all 0.2s ease;
  }
  
  .rated-items-btn:hover {
    background: rgba(139, 233, 253, 0.2);
    border-color: #8BE9FD;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .rated-items-btn svg {
    fill: #8BE9FD;
  }
  
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
    background: linear-gradient(to bottom right, #092739, #061720);
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
    color: #8BE9FD;
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
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
    transform: rotate(90deg);
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
    border-radius: 8px;
    overflow: hidden;
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
    bottom: 9px;
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
    bottom: 9px;
    position: relative;
  }
  
  .save-btn {
    background: #8BE9FD;
    color: #000;
  }
  
  .save-btn:hover {
    background: #518692

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
    
    .rated-items-btn {
      right: 30%;
    }
  }
  
  @media (max-width: 480px) {
    .rated-items-btn {
      right: 15%;
      font-size: 1.1rem;
      padding: 6px 12px;
    }
    
    .modal-header h3 {
      font-size: 1.4rem;
    }
    
    .tab-btn {
      font-size: 1.3rem;
    }
  }

  @media screen and (max-width: 600px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  }

  .movie-card,
  .tv-show-card {
    width: 100%;
    max-width: none; 
  }

  .movie-card img,
  .tv-show-card img {
    width: 100%; 
    max-width: none; 
  }
}

@media screen and (min-width: 601px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  }

  .movie-card,
  .tv-show-card {
    width: 100%; 
    max-width: none;
  }
  
  .movie-card img,
  .tv-show-card img {
    width: 100%; 
    max-width: none; 
  }
}

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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h3 {
  margin: 0;
  color: #8BE9FD;
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 3rem;
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
  transform: rotate(90deg);
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
}
</style>


