<template>
  <div>
    <main class="main">
      <section class="watchlist-section">
        <UserNav @show-rated-modal="showRatedItems" />
        <br>
        <nav class="navbar">
          <h1 class="title-primary">Watchlist</h1>
        </nav>
        <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
          <div class="column">
            <h2 class="title-secondary" style="color: #acafb5;  font-size: 16px;">Favorite {{ filterText }}</h2>
              <div class="new-controls-container" style="margin-top: 3rem;">
              <label class="switch">
                <input type="checkbox" :checked="filter === 'tvShows'" @change="toggleFilterType">
                <span>Movies</span>
                <span>TV Shows</span>
              </label>
              
              <div class="action-buttons">
                <button class="control-btn" @click="openFiltersModal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                  </svg>
                  <span class="btn-label">Filters</span>
                </button>

                <button class="control-btn" @click="toggleOrderMode">
                  <svg v-if="orderText === 'Order Asc'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 16 4 4 4-4"/>
                    <path d="M7 20V4"/>
                    <path d="M17 10V4h-2"/>
                    <path d="M15 10h4"/>
                    <rect x="15" y="14" width="4" height="6" ry="2"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 16 4 4 4-4"/>
                    <path d="M7 20V4"/>
                    <rect x="15" y="4" width="4" height="6" ry="2"/>
                    <path d="M17 20v-6h-2"/>
                    <path d="M15 20h4"/>
                  </svg>
                  <span class="btn-label">{{ orderText === 'Order Asc' ? 'Latest' : 'Earliest' }}</span>
                </button>
              </div>
              </div>
            </div>
            
            <div v-if="filteredItems.length === 0 && (selectedGenre || selectedTmdbRating || selectedUserRating || customYearStart || customYearEnd)" class="no-results-state">
              <img src="~/static/cinema-popcorn.svg" alt="No results" class="no-results-icon">
              <h3>No Results Found</h3>
              <p>We couldn't find any content matching your current filters.</p>
              <p class="suggestion">Try adjusting or clearing some filters to see more results.</p>
              <button @click="clearAllFilters" class="refine-filters-btn">Clear All Filters</button>
            </div>
            
            <div v-else>
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
                    <div class="user-rating-badge" v-if="item.details.userRatingForDb && item.details.userRatingForDb !== '-'" 
                      @click.stop="openRatingModal(item)"
                      :class="{ 'has-review': item.details.userReview }" 
                      :title="item.details.userReview ? 'Has Review' : ''">
                      {{ item.details.userRatingForDb }}
                      <span v-if="item.details.userReview" class="review-indicator"></span>
                    </div>
                    <div class="user-rating-badge empty" @click.stop="openRatingModal(item)" v-else> 
                      <span style="font-size: 7px;">Rate</span>
                    </div>
                    <a :href="getLink(item)" class="item-link">
                      <img 
                        :src="item.details.posterForDb || fallbackImageUrl" 
                        :onerror="handleImageError" 
                        alt="Poster" 
                        class="poster" 
                      />
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
                    <div v-if="item.details.imdb_rating || item.details.starsForDb" class="card__stars">
                      <div :style="{ width: `${calculateStarsWidth(item.details.imdb_rating ? item.details.imdb_rating : formatRating(item.details.starsForDb))}%` }"></div>
                    </div>
                    <div class="card___rating">
                      <p v-if="item.details.rating_source === 'imdb' && item.details.imdb_rating">
                        {{ item.details.imdb_rating.toFixed(1) }} IMDb
                      </p>
                      <p v-else-if="item.details.starsForDb">
                        {{ formatRating(item.details.starsForDb) }} TMDB
                      </p>
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
                      <title>Remove from Watchlist.</title>
                      <path class="cls-1" d="M252.63 71.41C285.88 36.72 309.17 6.75 360.44.86c96.22-11.07 184.7 87.44 136.11 184.43-.43.85-.88 1.71-1.33 2.58-27.38-23.8-63.15-38.22-102.25-38.22-43.06 0-82.07 17.47-110.29 45.7-28.23 28.23-45.7 67.23-45.7 110.29s17.47 82.06 45.7 110.29l.15.15-30.2 29.96-59.71-57.51C121.09 319.33 3.95 232.26.09 124.36-2.62 48.79 57.02.37 125.62 1.27c61.31.8 87.08 31.31 127.01 70.14zm187.32 214.31c5.88-.05 10.08-.59 9.97 6.7l-.28 23.61c.04 7.62-2.37 9.65-9.51 9.56h-94.32c-7.14.09-9.56-1.94-9.51-9.56l-.29-23.61c-.1-7.29 4.1-6.75 9.97-6.7h93.97zm-46.98-99.11c32.87 0 62.63 13.32 84.17 34.86S512 272.77 512 305.64c0 32.88-13.33 62.64-34.86 84.17-21.54 21.54-51.31 34.86-84.17 34.86-32.88 0-62.64-13.32-84.17-34.86-21.54-21.54-34.87-51.3-34.87-84.17 0-32.88 13.33-62.63 34.86-84.17 21.54-21.54 51.31-34.86 84.18-34.86zm71.79 47.23c-18.37-18.37-43.75-29.74-71.79-29.74-28.04 0-53.43 11.37-71.81 29.74-18.37 18.37-29.73 43.76-29.73 71.8s11.36 53.43 29.74 71.8c18.37 18.37 43.75 29.74 71.8 29.74 28.03 0 53.42-11.37 71.8-29.74 18.37-18.37 29.73-43.76 29.73-71.8s-11.36-53.43-29.74-71.8z"/>
                  </svg>
                </div>
                </div>
              </div>
              <br>
              <div class="pagination-footer" v-if="filteredItems.length > itemsPerPage">
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
            </div>
        </div>
        
        <div v-else>
          <p style="text-align: center;">No favorites added yet.</p>
        </div>
        
        <div v-if="ratingModalVisible" class="modal-overlay">
          <div class="rating-modal">
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
                  :placeholder="selectedRating > 0 ? 
                    ratingDescriptions[selectedRating - 1] : 'Select a rating first'"
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

<div v-if="filtersModalVisible" class="modal-overlay" @click="closeFiltersModal">
  <div class="filters-modal" @click.stop>
    <div class="modal-header">
      <h3>Filters</h3>
      <button class="close-btn" @click="closeFiltersModal">×</button>
    </div>
    
    <div class="filters-content">
      <div class="filter-group">
        <label class="filter-label">Genre</label>
        <div class="custom-select" @click="toggleGenreDropdown">
          <div class="select-display">
            <span>{{ selectedGenre || 'All genres' }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': genreDropdownOpen }">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
          <div v-if="genreDropdownOpen" class="dropdown-options">
            <div 
              class="dropdown-option" 
              :class="{ selected: selectedGenre === '' }"
              @click.stop="selectGenre('')"
            >
              All genres
            </div>
            <div 
              v-for="genre in uniqueGenres" 
              :key="genre" 
              class="dropdown-option"
              :class="{ selected: selectedGenre === genre }"
              @click.stop="selectGenre(genre)"
            >
              {{ genre }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Years</label>
        <div class="year-inputs">
          <input 
            type="number" 
            v-model.number="customYearStart" 
            :min="1880" 
            :max="currentYear"
            placeholder="From"
            class="year-input"
          >
          <span class="year-separator">-</span>
          <input 
            type="number" 
            v-model.number="customYearEnd" 
            :min="1880" 
            :max="currentYear"
            placeholder="To"
            class="year-input"
          >
        </div>
        <div class="quick-year-options">
          <button 
            v-for="range in yearRanges" 
            :key="range" 
            @click="setYearRange(range)"
            class="year-quick-btn"
          >
            {{ range }}
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">Rating</label>
        <select v-model="selectedTmdbRating" class="filter-input">
          <option value="">All ratings</option>
          <option value="9-10">9+</option>
          <option value="8-8.9">8+</option>
          <option value="7-7.9">7+</option>
          <option value="6-6.9">6+</option>
          <option value="5-5.9">5+</option>
          <option value="0-4.9">< 5</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label class="filter-label">My Rating</label>
        <select v-model="selectedUserRating" class="filter-input">
          <option value="">All my ratings</option>
          <option value="10">My Rating: 10</option>
          <option value="9">My Rating: 9</option>
          <option value="8">My Rating: 8</option>
          <option value="7">My Rating: 7</option>
          <option value="6">My Rating: 6</option>
          <option value="5">My Rating: 5</option>
          <option value="1-4">My Rating: < 5</option>
          <option value="not-rated">Not Rated</option>
        </select>
      </div>
      
      <div class="filter-actions">
        <button @click="clearAllFilters" class="clear-btn">Clear</button>
        <button @click="closeFiltersModal" class="apply-btn">Apply</button>
      </div>
    </div>
  </div>
</div>
      </section>
    </main>
  </div>
</template>
<script>
import supabase from '@/services/supabase';
import UserNav from '@/components/global/UserNav';


async function getUserName(userEmail) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('first_name')
      .eq('email', userEmail);
      
    if (error) {
      throw new Error('Error fetching user first name:', error.message);
    }

    const userName = data[0]?.first_name|| '';
    return userName;
    
  } catch (error) {
    console.error('Error fetching user first_name:', error);
  }
}

export default {
  components: {
    UserNav,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      genreDropdownOpen: false,
      filteredSeriesDetails: [],
      filtersModalVisible: false,
      customYearStart: null,
      customYearEnd: null,
      currentYear: new Date().getFullYear(),
      selectedLanguage: 'english',
      fallbackImageUrl: "https://github.com/imprvhub/entercinema/blob/main/static/image_not_found_yet.png?raw=true",
      handleImageError: "this.src='https://github.com/imprvhub/entercinema/blob/main/static/image_not_found_yet.png?raw=true'",
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
      userFirstName: '', 
      isMenuOpen: false,
      filter: 'movies',
      selectedGenre: '',
      selectedYearRange: '',
      genres: [],
      years: [],
      resizeObserver: null,
      ratingModalVisible: false,
      currentRatingItem: null,
      userReview: '',
      selectedRating: 0,
      hoverRating: 0,
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
      selectedTmdbRating: '',
      selectedUserRating: '',
      tmdbRatingRanges: [
        '9-10', '8-8.9', '7-7.9', '6-6.9', '5-5.9', '0-4.9'
      ],
      userRatingRanges: [
        '10', '9', '8', '7', '6', '5', '1-4'
      ]
    };
  },
  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkData();
    await this.fetchUserFirstName();
    
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

    const detailsArray = this.tvFetched.map(({ details }) => details);
    const currentYear = new Date().getFullYear();
    const pastYearsLimit = currentYear - 5;

    const filteredArray = detailsArray.filter(item => item.yearEndForDb >= pastYearsLimit);

    const additionalSeries = detailsArray.filter(item => item.nextEpisode !== null && item.nextEpisode !== undefined);

    const uniqueSeries = [...new Set([...filteredArray, ...additionalSeries])];

    const seriesIds = uniqueSeries.map(item => item.idForDb);

    async function fetchSeriesDetails(seriesId) {
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

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener detalles de la serie:', error);
            return null;
        }
    }

    async function fetchSeriesDetailsForIds(seriesIds) {
        const seriesPromises = seriesIds.map(async id => await fetchSeriesDetails(id));
        const seriesDetails = await Promise.all(seriesPromises);

        function filterSeriesDetails(seriesDetails) {
            return seriesDetails
                .map(series => ({
                    name: series.name,
                    genres: series.genres.map(genre => ({ id: genre.id, name: genre.name })),
                    nextEpisode: series.next_episode_to_air,
                    stillPath: series.still_path,
                    numberOfEpisodes: series.number_of_episodes,
                    numberOfSeasons: series.number_of_seasons,
                    firstAirDate: series.first_air_date,
                    lastEpisode: series.last_episode_to_air
                }))
                .filter(series => series.nextEpisode !== undefined && series.nextEpisode !== null);
        }

        return filterSeriesDetails(seriesDetails);
    }

    const filteredSeriesDetails = await fetchSeriesDetailsForIds(seriesIds).catch(err => {
        console.error('Error al obtener y filtrar detalles de las series:', err);
        return [];
    });

    this.filteredSeriesDetails = filteredSeriesDetails;
    
    try {
      const { data, error } = await supabase
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
    this.$root.$on('rated-items-updated', this.checkData);
},

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize);
    }
    this.$root.$off('rated-items-updated', this.checkData);
  },
  
  
  methods: {
    toggleFilterType(event) {
      this.filter = event.target.checked ? 'tvShows' : 'movies';
      this.currentPage = 1;
    },
    toggleGenreDropdown() {
      this.genreDropdownOpen = !this.genreDropdownOpen;
    },

    selectGenre(genre) {
      this.selectedGenre = genre;
      this.genreDropdownOpen = false;
    },
    openFiltersModal() {
      this.filtersModalVisible = true;
    },

    closeFiltersModal() {
      this.filtersModalVisible = false;
    },

    toggleOrderMode() {
      this.orderText = this.orderText === 'Order Asc' ? 'Order Desc' : 'Order Asc';
      this.moviesFetched.reverse();
      this.tvFetched.reverse();
    },

    setYearRange(range) {
      const [start, end] = range.split('-').map(Number);
      this.customYearStart = start;
      this.customYearEnd = end;
    },

    clearAllFilters() {
      this.selectedGenre = '';
      this.selectedTmdbRating = '';
      this.selectedUserRating = '';
      this.customYearStart = null;
      this.customYearEnd = null;
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

    filterByTmdbRating(event) {
      this.selectedTmdbRating = event.target.value;
    },
    
    filterByUserRating(event) {
      this.selectedUserRating = event.target.value;
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
        await this.checkData();
        
      } catch (error) {
        console.error('Error removing rating:', error);
        alert('There was an error removing your rating. Please try again.');
      }
    },
    showRatedItems() {
      this.$root.$emit('show-rated-modal');
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
        
        for (const row of data) {
          if (row.favorites_json.movies) {
            for (const movie of row.favorites_json.movies) {
              const movieKey = Object.keys(movie)[0];
              const movieData = movie[movieKey];
              
              if (!movieData || !movieData.details) {
                console.warn('Skipping invalid movie entry:', movie);
                continue;
              }
              
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
                  console.error('Error fetching IMDb rating:', err);
                  movieData.details.rating_source = 'tmdb';
                }
              } else if (!movieData.details.rating_source) {
                movieData.details.rating_source = movieData.details.imdb_rating ? 'imdb' : 'tmdb';
              }
              
              moviesFetched.push(movieData);
              
              if (movieData.details.genresForDb) {
                const genresList = movieData.details.genresForDb.split(', ');
                genresList.forEach(g => genres.add(g));
              }
              
              if (movieData.details.yearStartForDb) {
                years.add(movieData.details.yearStartForDb);
              }
            }
          }

          if (row.favorites_json.tv) {
            for (const tvShow of row.favorites_json.tv) {
              const tvKey = Object.keys(tvShow)[0];
              const tvData = tvShow[tvKey];
              
              if (!tvData || !tvData.details) {
                console.warn('Skipping invalid TV entry:', tvShow);
                continue;
              }
              
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
                  console.error('Error fetching IMDb rating:', err);
                  tvData.details.rating_source = 'tmdb';
                }
              } else if (!tvData.details.rating_source) {
                tvData.details.rating_source = tvData.details.imdb_rating ? 'imdb' : 'tmdb';
              }
              
              tvFetched.push(tvData);
              
              if (tvData.details.genresForDb) {
                const genresList = tvData.details.genresForDb.split(', ');
                genresList.forEach(g => genres.add(g));
              }
              
              if (tvData.details.yearStartForDb) {
                years.add(tvData.details.yearStartForDb);
              }
            }
          }
        }
        
        this.moviesFetched = moviesFetched.reverse();
        this.tvFetched = tvFetched.reverse();
        this.genres = Array.from(genres);
        this.years = Array.from(years).sort();

        if (data.length > 0) {
          const favoritesObject = { ...data[0].favorites_json };
          let needsUpdate = false;
          
          if (favoritesObject.movies && moviesFetched.length > 0) {
            const moviesReversed = [...moviesFetched].reverse();
            
            favoritesObject.movies = favoritesObject.movies.map((originalMovie, index) => {
              const movieKey = Object.keys(originalMovie)[0];
              const matchingMovie = moviesReversed.find((m, i) => {
                const mKey = Object.keys(favoritesObject.movies[i] || {})[0];
                return mKey === movieKey;
              });
              
              if (matchingMovie) {
                const oldRatingSource = originalMovie[movieKey].details.rating_source;
                const newRatingSource = matchingMovie.details.rating_source;
                
                if (oldRatingSource !== newRatingSource) {
                  needsUpdate = true;
                }
                
                return {
                  [movieKey]: matchingMovie
                };
              }
              
              return originalMovie;
            });
          }
          
          if (favoritesObject.tv && tvFetched.length > 0) {
            const tvReversed = [...tvFetched].reverse();
            
            favoritesObject.tv = favoritesObject.tv.map((originalTv, index) => {
              const tvKey = Object.keys(originalTv)[0];
              const matchingTv = tvReversed.find((t, i) => {
                const tKey = Object.keys(favoritesObject.tv[i] || {})[0];
                return tKey === tvKey;
              });
              
              if (matchingTv) {
                const oldRatingSource = originalTv[tvKey].details.rating_source;
                const newRatingSource = matchingTv.details.rating_source;
                
                if (oldRatingSource !== newRatingSource) {
                  needsUpdate = true;
                }
                
                return {
                  [tvKey]: matchingTv
                };
              }
              
              return originalTv;
            });
          }
          
          if (needsUpdate) {
            await supabase
              .from('favorites')
              .update({ favorites_json: favoritesObject })
              .eq('user_email', this.userEmail);
          }
        }
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

    goToLogin() {
        this.$router.push('/login');
      },

    getLink(item) {
      const locOrigin = window.location.origin;
      if (item.details.typeForDb === 'movie') {
        return `${locOrigin}/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
        return `${locOrigin}/tv/${item.details.idForDb}`;
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

      const matchesGenre = this.selectedGenre === '' || 
        (item.details.genresForDb && item.details.genresForDb.includes(this.selectedGenre));
      
      const matchesYear = (!this.customYearStart && !this.customYearEnd) || 
        (item.details.yearStartForDb && 
        item.details.yearStartForDb >= (this.customYearStart || 1880) && 
        item.details.yearStartForDb <= (this.customYearEnd || this.currentYear));

      let matchesTmdbRating = true;
      if (this.selectedTmdbRating !== '') {
        let rating;
        if (item.details.rating_source === 'imdb' && item.details.imdb_rating) {
          rating = item.details.imdb_rating;
        } else if (item.details.starsForDb) {
          rating = this.formatRating(item.details.starsForDb);
        }
        
        if (!rating) {
          matchesTmdbRating = false;
        } else {
          const [min, max] = this.selectedTmdbRating.split('-').map(Number);
          matchesTmdbRating = rating >= min && rating <= max;
        }
      }
      
      let matchesUserRating = true;
      if (this.selectedUserRating !== '') {
        if (this.selectedUserRating === 'not-rated') {
          matchesUserRating = !item.details.userRatingForDb || 
                            item.details.userRatingForDb === '-';
        } else {
          if (!item.details.userRatingForDb || item.details.userRatingForDb === '-') {
            matchesUserRating = false;
          } else {
            const userRating = parseInt(item.details.userRatingForDb);
            if (this.selectedUserRating.includes('-')) {
              const [min, max] = this.selectedUserRating.split('-').map(Number);
              matchesUserRating = userRating >= min && userRating <= max;
            } else {
              matchesUserRating = userRating === parseInt(this.selectedUserRating);
            }
          }
        }
      }
      
      return matchesGenre && matchesYear && matchesTmdbRating && matchesUserRating;
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
      return this.filter === 'tvShows' ? 'TV Shows' : 'Movies';
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
  margin-top: 20px;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
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
    margin-top: 4rem;
    top: 1rem;
    position: relative;
    text-align: center;
    max-width: 800px; 
    margin: 0 auto; 
    top: 8px;
    transition: none 0s ease 0s;
  } 

  .navbar-title {
    color: #fff;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
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
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

@media screen and (max-width: 1024px) {
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

  .order-select {
    cursor: pointer;
    width: 170.626px;
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
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
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
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .genre-select {
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
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .year-select {
    width: 165.626px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    margin-right: 5px;
    text-align: center;

    border: 1px solid rgba( 255, 255, 255, 0.18 );
  }

  .year-select:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .button:hover{
    background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453); 
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    width: 97% !important;
    margin: 0 auto;
    background: rgba(82, 71, 71, 0);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: 2px;
    position: relative;
    margin-bottom: 0.5rem;
}

.pagination-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    width: 97% !important;
    margin: 0 auto;
    background: rgba(16, 20, 33, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    padding: 8px;
    gap: 0.5rem;
    border: 0.5px #31414C solid;
    top: -10px;
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

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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


  .watchlist-section {
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
    max-width: 800px; 
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

  .movie-grid,
  .tv-show-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
    gap: 20px;
    background-color: black;
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur(16px);
    justify-content: center;
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
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
    background-color: #000;
    color: #88E9FD;
    border: 2px solid;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 9px;
    text-transform: uppercase;
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
    z-index: 1001;
    padding: 20px;
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;
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
    background: #518692

  }
  
  .cancel-btn {
    background: rgba(255, 0, 0, 0.2);
  }
  
  .cancel-btn:hover {
    background: rgba(255, 0, 0, 0.4);
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
.poster {
  width: 60%; 
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  min-height: 200px;
  object-fit: cover;
}

.tmdb-rating-select,
.user-rating-select {
  width: 165.626px;
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 5px;
  text-align: center;
  margin-right: 15px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  padding: 0.8rem 1.5rem; 
  cursor: pointer;
  font-size: 1.3rem;
}

.tmdb-rating-select:hover,
.user-rating-select:hover {
  background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453);
}

select.tmdb-rating-select,
select.user-rating-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2.5rem;
}

@media screen and (max-width: 1024px) {
  .tmdb-rating-select,
  .user-rating-select {
    width: 40%;
    margin: 0.5rem;
    font-size: 1.1rem;
    padding: 0.7rem 1.2rem;
  }
}


.new-controls-container {
 display: flex;
 justify-content: center;
 align-items: center;
 gap: 20px;
 flex-wrap: wrap;
 margin-top: 3rem;
 min-height: 50px;
}

.content-type-switch {
 display: flex;
 background: rgba(0, 0, 0, 0.2);
 border-radius: 25px;
 padding: 2px;
 border: 1px solid rgba(255, 255, 255, 0.18);
}

.switch {
  --_switch-bg-clr: rgba(0, 0, 0, 0);
  --_switch-padding: 3px;
  --_slider-bg-clr: rgba(31, 104, 135, 0.4);
  --_slider-bg-clr-on: #8BE9FD;
  --_slider-txt-clr: #ffffff;
  --_label-padding: 10px 20px;
  --_switch-easing: cubic-bezier(0.47, 1.64, 0.41, 0.8);
  
  color: rgba(255, 255, 255, 0.7);
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  position: relative;
  isolation: isolate;
  border-radius: 25px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-size: 1.3rem;
  align-self: center;
  margin: 0;
}

.switch input[type="checkbox"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch > span {
  display: grid;
  place-content: center;
  transition: all 300ms ease-in-out;
  padding: var(--_label-padding);
  white-space: nowrap;
  z-index: 1;
}

.switch::before,
.switch::after {
  content: "";
  position: absolute;
  border-radius: inherit;
  transition: inset 150ms ease-in-out;
}

.switch::before {
  background-color: var(--_slider-bg-clr-on);
  inset: var(--_switch-padding) 50% var(--_switch-padding) var(--_switch-padding);
  transition: inset 500ms var(--_switch-easing), background-color 500ms ease-in-out;
  z-index: 0;
  border-radius: 22px;
}

.switch::after {
  background-color: var(--_switch-bg-clr);
  inset: 0;
  z-index: -1;
}

.switch:hover {
  transform: translateY(-1px);
}

.switch:has(input:checked)::before {
  background-color: var(--_slider-bg-clr-on);
  inset: var(--_switch-padding) var(--_switch-padding) var(--_switch-padding) 50%;
}

.switch > span:first-of-type {
  opacity: 1;
  color: #000;
  font-weight: 500;
}

.switch > span:last-of-type {
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7);
}

.switch:has(input:checked) > span:first-of-type {
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7);
  font-weight: normal;
}

.switch:has(input:checked) > span:last-of-type {
  color: #000;
  opacity: 1;
  font-weight: 500;
}

.switch-btn {
 background: transparent;
 border: none;
 color: rgba(255, 255, 255, 0.7);
 border-radius: 23px;
 cursor: pointer;
 transition: all 0.3s ease;
 font-size: 1.3rem;
 display: flex;
 align-items: center;
 justify-content: center;
 white-space: nowrap;
 flex: 1;
 padding: 8px 16px;
}

.switch-btn.active {
  background: #8BE9FD;
  color: #000;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.3rem;
  align-self: center;
  margin: 0;
}

.control-btn:hover {
  background: linear-gradient(
315deg, #0A1E26, #11323F, #1A4453);
}

.filters-modal {
  width: 100%;
  max-width: 500px;
  background: linear-gradient(to bottom right, #092739, #061720);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.filters-content {
  padding: 20px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  color: #8BE9FD;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.filter-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
}

.year-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.year-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
}

.year-separator {
  color: rgba(255, 255, 255, 0.7);
  font-weight: bold;
}

.quick-year-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-quick-btn {
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.year-quick-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  border-color: #8BE9FD;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.clear-btn, .apply-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.clear-btn {
  background: rgba(255, 0, 0, 0.2);
  color: #fff;
}

.apply-btn {
  background: #8BE9FD;
  color: #000;
}

@media (max-width: 768px) {
  .new-controls-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .control-btn {
    justify-content: center;
  }
}
.custom-select {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.select-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: all 0.2s ease;
}

.select-display:hover {
  border-color: rgba(139, 233, 253, 0.5);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #092739;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dropdown-option {
  padding: 10px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1.3rem;
}

.dropdown-option:hover {
  background: rgba(139, 233, 253, 0.1);
}

.dropdown-option.selected {
  background: rgba(139, 233, 253, 0.2);
  color: #8BE9FD;
}

.year-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 1.3rem;
  transition: border-color 0.2s ease;
}

.year-input:focus {
  outline: none;
  border-color: rgba(139, 233, 253, 0.5);
}

.year-input::-webkit-outer-spin-button,
.year-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.year-input[type=number] {
  -moz-appearance: textfield;
}

.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 233, 253, 0.5);
}

.new-controls-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  flex-direction: row;
  margin: 3rem auto 0 auto;
  min-height: 50px;
  width: fit-content;
}

@media (max-width: 800px) {
  .new-controls-container {
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 3rem auto 0 auto;
    width: fit-content;
    gap: 15px;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 15px;
  }
  
  .control-btn span {
    display: none;
  }
  
  .control-btn {
    padding: 12px;
    min-width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
  }
  
  .control-btn svg {
    margin: 0;
    width: 18px;
    height: 18px;
  }
  .btn-label {
    display: none;
  }
}

.rating-modal-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.rating-modal-buttons .save-btn {
  flex: 1;
  max-width: 120px;
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

@media (max-width: 400px) {
  .rating-modal-buttons {
    flex-direction: column;
  }
  
  .rating-modal-buttons .save-btn,
  .remove-rating-btn {
    max-width: 100%;
  }
}

.no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin: 20px auto;
  max-width: 600px;
}

.no-results-icon {
  width: 240px;
  height: 240px;
  margin-bottom: 25px;
  opacity: 0.7;
}

.no-results-state h3 {
  color: #8BE9FD;
  font-size: 2rem;
  margin: 0 auto 15px;
  letter-spacing: 1px;
  text-align: center;
}

.no-results-state p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.4rem;
  margin: 8px auto;
  line-height: 1.5;
  text-align: center;
}

.no-results-state .suggestion {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.3rem;
  margin: 15px auto 0;
  font-style: italic;
  text-align: center;
}

.refine-filters-btn {
  margin: 25px auto 0;
  padding: 12px 30px;
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8BE9FD;
  border-radius: 25px;
  color: #8BE9FD;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: block;
}

.refine-filters-btn:hover {
  background: rgba(139, 233, 253, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 233, 253, 0.3);
}

@media (max-width: 768px) {
  .no-results-state {
    padding: 40px 15px;
    min-height: 300px;
  }
  
  .no-results-icon {
    width: 192px;
    height: 192px;
  }
  
  .no-results-state h3 {
    font-size: 1.6rem;
  }
  
  .no-results-state p {
    font-size: 1.2rem;
  }
}
</style>