<template>
  <main class="main" style="top:-50px; position: relative;">
      <UserNav @show-rated-modal="showRatedItems" />
      <nav class="navbar navbar-welcome">
        <h1 class="title-primary" style="position: relative; color: #7FDBF1 !important; top: 23px;">Advanced Search</h1>
        <h2 class="title-secondary" style="color: rgb(172, 175, 181); font-size: 14px; margin-top: 40px; position: relative; text-transform: none; left: -2px; top: -6px;">
        Refine your search criteria for more precise results.
      </h2>
      </nav>

    <div class="adv-search-section" @click="closeAllDropdowns">
      <div class="search-container">
        
        <div v-if="activeFilterChips.length > 0" class="active-filters-indicator">
          <div class="filter-chips">
            <div v-for="(chip, index) in activeFilterChips" :key="index" class="filter-chip">
              <span>{{ chip.label }}</span>
              <button @click="removeFilter(chip)" class="chip-remove">×</button>
            </div>
          </div>
          <button @click="clearAllFilters" class="clear-all-inline">Clear All</button>
        </div>

        <div v-if="!selectedSearchType" class="type-info-banner">
          <div class="banner-content">
            <div class="selection-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Please select a type (Movie or TV Show) to enable other filters.</span>
            </div>
          </div>
        </div>

        <div class="search-filters">
          <div class="filter-item">
            <label>Choose Type</label>
            <div class="custom-select" @click.stop="toggleDropdown('type')">
              <div class="select-display">
                <span>{{ selectedSearchType === 'movie' ? 'Movie' : (selectedSearchType === 'tv' ? 'TV Show' : 'Choose One') }}</span>
                <div class="select-arrow" :class="{ 'rotate-180': dropdowns.type }"></div>
              </div>
              <div v-if="dropdowns.type" class="dropdown-options">
                <div class="dropdown-option" @click.stop="selectType('movie')">Movie</div>
                <div class="dropdown-option" @click.stop="selectType('tv')">TV Show</div>
              </div>
            </div>
          </div>

          <div class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Choose Genre</label>
             <div class="custom-select" @click.stop="!selectedSearchType ? null : toggleDropdown('genre')">
              <div class="select-display">
                <span>{{ formattedGenre(selectedSearchGenre) || 'Optional' }}</span>
                <div class="select-arrow" :class="{ 'rotate-180': dropdowns.genre }"></div>
              </div>
              <div v-if="dropdowns.genre" class="dropdown-options">
                <div class="dropdown-option" @click.stop="selectGenre('')">Optional</div>
                <div 
                    v-for="genre in filteredGenres" 
                    :key="genre.id" 
                    class="dropdown-option"
                    @click.stop="selectGenre(genre.id)"
                >
                  {{ genre.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Release Year Range</label>
            <div class="range-inputs">
              <input 
                type="number" 
                v-model.number="customYearStart" 
                :min="1888" 
                :max="currentYear" 
                placeholder="From"
                class="range-input"
                @change="validateYearInput"
                :disabled="!selectedSearchType"
              >
              <span class="range-separator">-</span>
              <input 
                type="number" 
                v-model.number="customYearEnd" 
                :min="1888" 
                :max="currentYear" 
                placeholder="To"
                class="range-input"
                @change="validateYearInput"
                :disabled="!selectedSearchType"
              >
            </div>
          </div>

          <div class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Sort By</label>
            <div class="custom-select" @click.stop="!selectedSearchType ? null : toggleDropdown('sort')">
              <div class="select-display">
                <span>{{ getSortLabel(selectedSortBy) }}</span>
                <div class="select-arrow" :class="{ 'rotate-180': dropdowns.sort }"></div>
              </div>
              <div v-if="dropdowns.sort" class="dropdown-options">
                 <div class="dropdown-option" @click.stop="selectSort('popularity.desc')">Most Popular</div>
                 <div class="dropdown-option" @click.stop="selectSort('vote_average.desc')">Highest Rated</div>
                 <div class="dropdown-option" @click.stop="selectSort('primary_release_date.desc')">Latest Releases</div>
                 <div class="dropdown-option" @click.stop="selectSort('revenue.desc')">Highest Revenue</div>
                 <div class="dropdown-option" @click.stop="selectSort('vote_count.desc')">Highest Vote Count</div>
                 <div class="dropdown-option" @click.stop="selectSort('vote_count.asc')">Lowest Vote Count</div>
                 <div class="dropdown-option" @click.stop="selectSort('imdb-high')">Highest Rated (IMDb)</div>
                 <div class="dropdown-option" @click.stop="selectSort('imdb-low')">Lowest Rated (IMDb)</div>
              </div>
            </div>
          </div>

          <div class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Origin Country</label>
            <div class="custom-select" @click.stop="!selectedSearchType ? null : toggleDropdown('country')">
              <div class="select-display">
                <span>{{ formattedCountry(selectedOriginCountry) || 'Optional' }}</span>
                <div class="select-arrow" :class="{ 'rotate-180': dropdowns.country }"></div>
              </div>
              <div v-if="dropdowns.country" class="dropdown-options">
                <div class="dropdown-option" @click.stop="selectCountry('')">Optional</div>
                <div class="dropdown-option" @click.stop="selectCountry('US')">United States</div>
                <div class="dropdown-option" @click.stop="selectCountry('GB')">United Kingdom</div>
                <div class="dropdown-option" @click.stop="selectCountry('FR')">France</div>
                <div class="dropdown-option" @click.stop="selectCountry('JP')">Japan</div>
                <div class="dropdown-option" @click.stop="selectCountry('KR')">South Korea</div>
                <div class="dropdown-option" @click.stop="selectCountry('ES')">Spain</div>
                <div class="dropdown-option" @click.stop="selectCountry('AL')">Albania</div>
                <div class="dropdown-option" @click.stop="selectCountry('AR')">Argentina</div>
                <div class="dropdown-option" @click.stop="selectCountry('AU')">Australia</div>
                <div class="dropdown-option" @click.stop="selectCountry('BR')">Brazil</div>
                <div class="dropdown-option" @click.stop="selectCountry('CA')">Canada</div>
                <div class="dropdown-option" @click.stop="selectCountry('CN')">China</div>
                <div class="dropdown-option" @click.stop="selectCountry('DE')">Germany</div>
                <div class="dropdown-option" @click.stop="selectCountry('IN')">India</div>
                <div class="dropdown-option" @click.stop="selectCountry('IT')">Italy</div>
                <div class="dropdown-option" @click.stop="selectCountry('MX')">Mexico</div>
                <div class="dropdown-option" @click.stop="selectCountry('RU')">Russia</div>
                <!-- Add other countries as needed, simplified for brevity -->
              </div>
            </div>
          </div>

          <div v-if="selectedSearchType === 'tv'" class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Choose Network</label>
            <div class="custom-select" @click.stop="!selectedSearchType ? null : toggleDropdown('network')">
              <div class="select-display">
                <span>{{ getNetworkLabel(selectedWatchProvider) || 'Optional' }}</span>
                <div class="select-arrow" :class="{ 'rotate-180': dropdowns.network }"></div>
              </div>
              <div v-if="dropdowns.network" class="dropdown-options">
                <div class="dropdown-option" @click.stop="selectNetwork('')">Optional</div>
                <div class="dropdown-option" @click.stop="selectNetwork('2552')">Apple TV+</div>
                <div class="dropdown-option" @click.stop="selectNetwork('2739')">Disney+</div>
                <div class="dropdown-option" @click.stop="selectNetwork('453')">Hulu</div>
                <div class="dropdown-option" @click.stop="selectNetwork('6783')">Max</div>
                <div class="dropdown-option" @click.stop="selectNetwork('213')">Netflix</div>
                <div class="dropdown-option" @click.stop="selectNetwork('1024')">Prime Video</div>
              </div>
            </div>
          </div>

          <div class="filter-item" :class="{ 'disabled-item': !selectedSearchType }">
            <label>Rating Range (0-10)</label>
            <div class="range-inputs">
              <input 
                type="number" 
                v-model.number="minImdbRating" 
                min="0" 
                max="10" 
                step="0.1"
                placeholder="Min"
                class="range-input"
                @input="validateRatingInput"
                :disabled="!selectedSearchType"
              >
              <span class="range-separator">-</span>
              <input 
                type="number" 
                v-model.number="maxImdbRating" 
                min="0" 
                max="10" 
                step="0.1"
                placeholder="Max"
                class="range-input"
                @input="validateRatingInput"
                :disabled="!selectedSearchType"
              >
            </div>
          </div>
        </div>
        
        <div class="button-container">

          <button
            class="button button--search"
            :disabled="!selectedSearchType || loading"
            :style="{ 'pointer-events': (!selectedSearchType || loading) ? 'none' : 'auto', 'opacity': (!selectedSearchType || loading) ? '0.5' : '1' }"
            @click="searchContent"
          >
            <div v-if="loading" class="spinner"></div>
            <span
              v-else
              :class="{ 'txt': true, 'disabled-color': !selectedSearchType, 'active-color': selectedSearchType }"
            >Search</span>
          </button>
        </div>
      </div>  
    </div>

      <div class="column">
        <br>

        <DynamicSearchCarousel
          v-if="movies.length > 0"
          :title="moviesTitle"
          :items="movies"
          type="movie"
        />

        <DynamicSearchCarousel
          v-if="tvShows.length > 0"
          :title="tvShowsTitle"
          :items="tvShows"
          type="tv"
        />

        <div v-else>
          <p style="text-align: center; font-size: 13px; padding: 4rem; color: #7FDBF1;" v-if="searchPerformed && movies.length === 0 && tvShows.length === 0">
            No results found for these search parameters. Try refining your search.
          </p>
        </div>
      </div>
  </main>
</template>

<script>
  import UserNav from '@/components/global/UserNav';
  import DynamicSearchCarousel from '@/components/DynamicSearchCarousel.vue';
  
  async function getUserAvatar(userEmail) {
    try {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase
        .from('user_data')
        .select('avatar')
        .eq('email', userEmail);
        
      if (error) {
        throw new Error('Error fetching user avatar:', error.message);
      }
  
      const userAvatar = data[0]?.avatar || '/avatars/avatar-ss0.png';
      return userAvatar;
      
    } catch (error) {
      console.error('Error fetching user avatar:', error);
      return '/avatars/avatar-ss0.png';
    }
  }
  
  async function getUserName(userEmail) {
    try {
      const supabase = useSupabaseClient();
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
    head () {
    return {
      title: 'EnterCinema - Advanced Search.',
      meta: [
        { hid: 'og:title', property: 'og:title', content: 'Advanced Search' },
        { hid: 'og:url', property: 'og:url', content: `${this.$config.public.frontendUrl}${this.$route.path}` },
      ],
    };
  },
    components: {
      UserNav,
      DynamicSearchCarousel
    },
    data() {
      return {
        tursoBackendUrl: process.env.TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app/api',
        searchPerformed: false,
        loading: false,
        releaseYear: '',
        currentYear: new Date().getFullYear(), 
        movieGenres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 80, name: 'Crime' },
          { id: 99, name: 'Documentary' },
          { id: 18, name: 'Drama' },
          { id: 10751, name: 'Family' },
          { id: 14, name: 'Fantasy' },
          { id: 36, name: 'History' },
          { id: 27, name: 'Horror' },
          { id: 10402, name: 'Music' },
          { id: 9648, name: 'Mystery' },
          { id: 10749, name: 'Romance' },
          { id: 878, name: 'Science Fiction' },
          { id: 10770, name: 'TV Movie' },
          { id: 53, name: 'Thriller' },
          { id: 10752, name: 'War' },
          { id: 37, name: 'Western' }
        ],
        tvGenres: [
          { id: 10767, name: 'Talk Show' },
          { id: 10765, name: 'Sci-Fi and Fantasy' },
          { id: 10759, name: 'Action & Adventure' },
          { id: 16, name: 'Animation' },
          { id: 35, name: 'Comedy' },
          { id: 99, name: 'Documentary' },
          { id: 80, name: 'Crime' },
          { id: 18, name: 'Drama' },
          { id: 36, name: 'History' },
          { id: 10402, name: 'Music' },
          { id: 9648, name: 'Mystery' },
          { id: 10749, name: 'Romance' },
          { id: 37, name: 'Western' }
        ],
        selectedSearchGenre: '',
        selectedSearchType: '',
        selectedSortBy: 'popularity.desc',
        selectedOriginCountry: '',
        selectedWatchProvider: '',
        ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        customYearStart: null,
        customYearEnd: null,
        minImdbRating: null,
        maxImdbRating: null,
        dropdowns: {
          type: false,
          genre: false,
          sort: false,
          country: false,
          network: false
        },
        asterisk: '*',
        movies: [],
        tvShows: [],
        searchResults: [],
        userEmail: '',
        accessToken: '',
        isLoggedIn: false,
        favorites: [],
        moviesFetched: [],
        tvFetched: [],
        orderText: 'Order Asc',
        currentPage: 1,
        itemsPerPage: 12,
        userFirstName: '', 
        isMenuOpen: false,
        filter: 'movies',
        movieRatings: {}, 
        tvShowRatings: {}, 
        selectedMinRating: 0,
        MinRatingForLabel: 0
      };
    },
    setup() {
      return { supabase: useSupabaseClient() }
    },

    async mounted() {
      if (process.client) {
        const savedState = sessionStorage.getItem('advancedSearchState');
        if (savedState) {
          const state = JSON.parse(savedState);
          this.selectedSearchType = state.selectedSearchType;
          this.selectedSearchGenre = state.selectedSearchGenre;
          this.customYearStart = state.customYearStart;
          this.customYearEnd = state.customYearEnd;
          this.selectedSortBy = state.selectedSortBy;
          this.selectedOriginCountry = state.selectedOriginCountry;
          this.selectedWatchProvider = state.selectedWatchProvider;
          this.minImdbRating = state.minImdbRating;
          this.maxImdbRating = state.maxImdbRating;
          this.movies = state.movies || [];
          this.tvShows = state.tvShows || [];
          this.searchPerformed = state.searchPerformed || false;
          
          if (this.movies.length > 0 || this.tvShows.length > 0) {
          }
        }
      }

      const email = localStorage.getItem('email');
      const accessToken = localStorage.getItem('access_token');
      this.userEmail = email || '';
      this.hasAccessToken = accessToken !== null;
      this.isLoggedIn = accessToken !== null;
      this.userName = await getUserName(this.userEmail);
      if (this.isLoggedIn) {
        this.userName = await getUserName(this.userEmail);
      }
    },
  
    methods: {
      saveState() {
        if (process.client) {
          const state = {
            selectedSearchType: this.selectedSearchType,
            selectedSearchGenre: this.selectedSearchGenre,
            customYearStart: this.customYearStart,
            customYearEnd: this.customYearEnd,
            selectedSortBy: this.selectedSortBy,
            selectedOriginCountry: this.selectedOriginCountry,
            selectedWatchProvider: this.selectedWatchProvider,
            minImdbRating: this.minImdbRating,
            maxImdbRating: this.maxImdbRating,
            movies: this.movies,
            tvShows: this.tvShows,
            searchPerformed: this.searchPerformed
          };
          sessionStorage.setItem('advancedSearchState', JSON.stringify(state));
        }
      },
      clearAllFilters() {
        this.selectedSearchType = '';
        this.selectedSearchGenre = '';
        this.customYearStart = null;
        this.customYearEnd = null;
        this.selectedSortBy = 'popularity.desc';
        this.selectedOriginCountry = '';
        this.selectedWatchProvider = '';
        this.minImdbRating = null;
        this.maxImdbRating = null;
        this.movies = [];
        this.tvShows = [];
        this.searchPerformed = false;
        if (process.client) sessionStorage.removeItem('advancedSearchState');
      },
      removeFilter(chip) {
        switch (chip.type) {
            case 'type': this.selectedSearchType = ''; break;
            case 'genre': this.selectedSearchGenre = ''; break;
            case 'yearStart': this.customYearStart = null; break;
            case 'yearEnd': this.customYearEnd = null; break;
            case 'country': this.selectedOriginCountry = ''; break;
            case 'provider': this.selectedWatchProvider = ''; break;
            case 'minRating': this.minImdbRating = null; break;
            case 'maxRating': this.maxImdbRating = null; break;
        }
      },

      showRatedItems() {
        this.ratedItemsModalVisible = true;
      },
      updateGenres() {
        this.selectedSearchGenre = '';
      },

      getWeightedRating(item) {
        let R = 0; 
        let v = 0; 

        if (item.rating_source === 'imdb' && item.imdb_rating) {
          R = parseFloat(item.imdb_rating);
          
          const votes = item.imdb_votes;
          if (typeof votes === 'number') {
            v = votes;
          } else if (typeof votes === 'string') {
            v = parseInt(votes.replace(/,/g, ''), 10);
          } else {
            v = 0;
          }
        } else {
          R = parseFloat(item.vote_average);
          v = 0;
        }

        const m = 1000; 
        const C = 7.0;  

        return (v / (v + m)) * R + (m / (v + m)) * C;
      },

    async searchMovies() {
        this.searchPerformed = false; 
        this.loading = true;
        this.movies = [];
        const apiKey = this.$config.public.apiKey;

        let apiSortBy = this.selectedSortBy;
        if (this.selectedSortBy === 'imdb-high') {
          apiSortBy = 'vote_average.desc';
        } else if (this.selectedSortBy === 'imdb-low') {
          apiSortBy = 'vote_average.asc';
        }

        let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=${apiSortBy}&vote_count.gte=10&with_genres=${this.selectedSearchGenre}`;
        
        if (this.customYearStart) {
          baseUrl += `&primary_release_date.gte=${this.customYearStart}-01-01`;
        }
        if (this.customYearEnd) {
          baseUrl += `&primary_release_date.lte=${this.customYearEnd}-12-31`;
        }

        if (this.minImdbRating) {
          baseUrl += `&vote_average.gte=${this.minImdbRating}`;
        }
        if (this.maxImdbRating) {
          baseUrl += `&vote_average.lte=${this.maxImdbRating}`;
        }
        
        if (this.selectedOriginCountry) {
          baseUrl += `&with_origin_country=${this.selectedOriginCountry}`;
        }

        try {
          const responses = await Promise.all([
            fetch(`${baseUrl}&page=1`),
            fetch(`${baseUrl}&page=2`),
            fetch(`${baseUrl}&page=3`),
            fetch(`${baseUrl}&page=4`),
          ]);
          const data1 = await responses[0].json();
          const data2 = await responses[1].json();
          const data3 = await responses[2].json();
          const data4 = await responses[3].json();
          
          let allMovies = [...data1.results, ...data2.results, ...data3.results, ...data4.results];
          
          const enrichedMovies = await Promise.all(
            allMovies.map(async (movie) => {
              const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=external_ids`);
              const details = await detailsResponse.json();
              
              if (details.external_ids?.imdb_id) {
                try {
                  const imdbResponse = await fetch(`/api/imdb-rating/${details.external_ids.imdb_id}`);
                  const imdbData = await imdbResponse.json();
                  
                  if (imdbData.found) {
                    movie.imdb_rating = imdbData.score;
                    movie.imdb_votes = imdbData.votes;
                    movie.rating_source = 'imdb';
                  } else {
                    movie.rating_source = 'tmdb';
                  }
                } catch (err) {
                  movie.rating_source = 'tmdb';
                }
              } else {
                movie.rating_source = 'tmdb';
              }
              
              return movie;
            })
          );
          
          let filteredMovies = enrichedMovies;

          if (this.minImdbRating || this.maxImdbRating) {
             filteredMovies = filteredMovies.filter(movie => {
              const rating = movie.rating_source === 'imdb' ? movie.imdb_rating : parseFloat(movie.vote_average);
              const min = this.minImdbRating ? parseFloat(this.minImdbRating) : 0;
              const max = this.maxImdbRating ? parseFloat(this.maxImdbRating) : 10;
              return rating >= min && rating <= max;
            });
          }
          
          this.movies = filteredMovies;

          if (this.selectedSortBy === 'popularity.desc') {
            this.movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          } else if (this.selectedSortBy === 'vote_average.desc') {
            this.movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
          } else if (this.selectedSortBy === 'primary_release_date.desc') {
            this.movies.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
          } else if (this.selectedSortBy === 'revenue.desc') {
            this.movies.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
          } else if (this.selectedSortBy === 'vote_count.desc') {
            this.movies.sort((a, b) => {
               const valA = a.rating_source === 'imdb' ? (typeof a.imdb_votes === 'string' ? parseInt(a.imdb_votes.replace(/,/g, '')) : a.imdb_votes) : a.vote_count;
               const valB = b.rating_source === 'imdb' ? (typeof b.imdb_votes === 'string' ? parseInt(b.imdb_votes.replace(/,/g, '')) : b.imdb_votes) : b.vote_count;
               return (valB || 0) - (valA || 0);
            });
          } else if (this.selectedSortBy === 'vote_count.asc') {
            this.movies.sort((a, b) => {
               const valA = a.rating_source === 'imdb' ? (typeof a.imdb_votes === 'string' ? parseInt(a.imdb_votes.replace(/,/g, '')) : a.imdb_votes) : a.vote_count;
               const valB = b.rating_source === 'imdb' ? (typeof b.imdb_votes === 'string' ? parseInt(b.imdb_votes.replace(/,/g, '')) : b.imdb_votes) : b.vote_count;
               return (valA || 0) - (valB || 0);
            });
          } else if (this.selectedSortBy === 'imdb-high') {
            this.movies.sort((a, b) => {
               const rateA = a.rating_source === 'imdb' ? parseFloat(a.imdb_rating) : a.vote_average;
               const rateB = b.rating_source === 'imdb' ? parseFloat(b.imdb_rating) : b.vote_average;
               return (rateB || 0) - (rateA || 0);
            });
          } else if (this.selectedSortBy === 'imdb-low') {
            this.movies.sort((a, b) => {
               const rateA = a.rating_source === 'imdb' ? parseFloat(a.imdb_rating) : a.vote_average;
               const rateB = b.rating_source === 'imdb' ? parseFloat(b.imdb_rating) : b.vote_average;
               return (rateA || 0) - (rateB || 0);
            });
          }
          
          this.movies.forEach(movie => {
            const rating = movie.rating_source === 'imdb' ? movie.imdb_rating : movie.vote_average;
            this.movieRatings[movie.id] = rating;
          });
          
          this.loading = false;
          this.searchPerformed = true;
          this.saveState();
        } catch (error) {
          console.error('Error fetching movies:', error);
          this.loading = false;
        }
      },

      async searchTv() {
        this.searchPerformed = false; 
        this.loading = true;
        this.tvShows = [];
        const apiKey = this.$config.public.apiKey;
        
        let apiSortBy = this.selectedSortBy;
        if (this.selectedSortBy === 'imdb-high') {
          apiSortBy = 'vote_average.desc';
        } else if (this.selectedSortBy === 'imdb-low') {
          apiSortBy = 'vote_average.asc';
        }

        let baseUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=${apiSortBy}&vote_count.gte=10&with_genres=${this.selectedSearchGenre}`;
        
        if (this.customYearStart) {
          baseUrl += `&first_air_date.gte=${this.customYearStart}-01-01`;
        }
        if (this.customYearEnd) {
          baseUrl += `&first_air_date.lte=${this.customYearEnd}-12-31`;
        }

        if (this.minImdbRating) {
          baseUrl += `&vote_average.gte=${this.minImdbRating}`;
        }
        if (this.maxImdbRating) {
          baseUrl += `&vote_average.lte=${this.maxImdbRating}`;
        }

        if (this.selectedOriginCountry) {
          baseUrl += `&with_origin_country=${this.selectedOriginCountry}`;
        }
        if (this.selectedWatchProvider) {
          baseUrl += `&with_networks=${this.selectedWatchProvider}`;
        }

        try {
          const responses = await Promise.all([
            fetch(`${baseUrl}&page=1`),
            fetch(`${baseUrl}&page=2`)
          ]);
          const data1 = await responses[0].json();
          const data2 = await responses[1].json();
          
          let allTvShows = [...data1.results, ...data2.results];
          
          const enrichedTvShows = await Promise.all(
            allTvShows.map(async (tvShow) => {
              const detailsResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${apiKey}&append_to_response=external_ids`);
              const details = await detailsResponse.json();
              
              if (details.external_ids?.imdb_id) {
                try {
                  const imdbResponse = await fetch(`/api/imdb-rating/${details.external_ids.imdb_id}`);
                  const imdbData = await imdbResponse.json();
                  
                  if (imdbData.found) {
                    tvShow.imdb_rating = imdbData.score;
                    tvShow.imdb_votes = imdbData.votes;
                    tvShow.rating_source = 'imdb';
                  } else {
                    tvShow.rating_source = 'tmdb';
                  }
                } catch (err) {
                  tvShow.rating_source = 'tmdb';
                }
              } else {
                tvShow.rating_source = 'tmdb';
              }
              
              return tvShow;
            })
          );
          
          let filteredTv = enrichedTvShows;

          if (this.minImdbRating || this.maxImdbRating) {
             filteredTv = filteredTv.filter(tvShow => {
              const rating = tvShow.rating_source === 'imdb' ? tvShow.imdb_rating : parseFloat(tvShow.vote_average);
              const min = this.minImdbRating ? parseFloat(this.minImdbRating) : 0;
              const max = this.maxImdbRating ? parseFloat(this.maxImdbRating) : 10;
              return rating >= min && rating <= max;
            });
          }
          
          this.tvShows = filteredTv;

          if (this.selectedSortBy === 'popularity.desc') {
            this.tvShows.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          } else if (this.selectedSortBy === 'vote_average.desc') {
            this.tvShows.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
          } else if (this.selectedSortBy === 'primary_release_date.desc') { 
             this.tvShows.sort((a, b) => new Date(b.first_air_date || 0) - new Date(a.first_air_date || 0));
          } else if (this.selectedSortBy === 'revenue.desc') {
             this.tvShows.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
          } else if (this.selectedSortBy === 'vote_count.desc') {
            this.tvShows.sort((a, b) => {
               const valA = a.rating_source === 'imdb' ? (typeof a.imdb_votes === 'string' ? parseInt(a.imdb_votes.replace(/,/g, '')) : a.imdb_votes) : a.vote_count;
               const valB = b.rating_source === 'imdb' ? (typeof b.imdb_votes === 'string' ? parseInt(b.imdb_votes.replace(/,/g, '')) : b.imdb_votes) : b.vote_count;
               return (valB || 0) - (valA || 0);
            });
          } else if (this.selectedSortBy === 'vote_count.asc') {
            this.tvShows.sort((a, b) => {
               const valA = a.rating_source === 'imdb' ? (typeof a.imdb_votes === 'string' ? parseInt(a.imdb_votes.replace(/,/g, '')) : a.imdb_votes) : a.vote_count;
               const valB = b.rating_source === 'imdb' ? (typeof b.imdb_votes === 'string' ? parseInt(b.imdb_votes.replace(/,/g, '')) : b.imdb_votes) : b.vote_count;
               return (valA || 0) - (valB || 0);
            });
          } else if (this.selectedSortBy === 'imdb-high') {
            this.tvShows.sort((a, b) => {
               const rateA = a.rating_source === 'imdb' ? parseFloat(a.imdb_rating) : a.vote_average;
               const rateB = b.rating_source === 'imdb' ? parseFloat(b.imdb_rating) : b.vote_average;
               return (rateB || 0) - (rateA || 0);
            });
          } else if (this.selectedSortBy === 'imdb-low') {
            this.tvShows.sort((a, b) => {
               const rateA = a.rating_source === 'imdb' ? parseFloat(a.imdb_rating) : a.vote_average;
               const rateB = b.rating_source === 'imdb' ? parseFloat(b.imdb_rating) : b.vote_average;
               return (rateA || 0) - (rateB || 0);
            });
          }
          
          this.tvShows.forEach(tvShow => {
            const rating = tvShow.rating_source === 'imdb' ? tvShow.imdb_rating : tvShow.vote_average;
            this.tvShowRatings[tvShow.id] = rating;
          });
          
          this.loading = false;
          this.searchPerformed = true;
          this.saveState();
        } catch (error) {
          console.error('Error fetching TV shows:', error);
          this.loading = false;
        }
      },
   
      disabledFutureDates(date) {
        const currentYear = new Date().getFullYear();
        const firstMovieYear = 1888;
        return date > new Date() || date.getFullYear() < firstMovieYear || date.getFullYear() > currentYear;
      },

      async searchContent() {
        this.movies = [];
        this.tvShows = [];
        if (this.selectedSearchType === 'movie') {
          this.searchMovies();
        } else if (this.selectedSearchType === 'tv') {
          this.searchTv();
        } else {
          alert('Please select a type (Movie or TV Show) first.');
        }
      },
          
      async checkData() {
        try {
          const response = await fetch(`${this.tursoBackendUrl}/favorites/${this.userEmail}`);
          
          if (!response.ok) {
            throw new Error('Error connecting to database: ' + response.statusText);
          }

          const data = await response.json();
          this.favorites = data.favorites_json;
        } catch (error) {
          console.error(error.message);
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
        this.selectedSearchGenre = event.target.value;
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

      goBack() {
        this.$router.go(-1);
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
          const { data, error } = await this.supabase
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

      formatGenreNames(genreIds, genreList) {
        return genreIds.map(id => {
          const genre = genreList.find(genre => genre.id === id);
          return genre ? genre.name : '';
        }).filter(Boolean).join(', ');
      },

      validateRatingInput() {
        if (this.minImdbRating < 0) this.minImdbRating = 0;
        if (this.minImdbRating > 10) this.minImdbRating = 10;
        if (this.maxImdbRating < 0) this.maxImdbRating = 0;
        if (this.maxImdbRating > 10) this.maxImdbRating = 10;
      },
      
      validateYearInput() {
        const currentYear = new Date().getFullYear();
        if (this.customYearStart && this.customYearStart < 1888) this.customYearStart = 1888;
        if (this.customYearStart > currentYear) this.customYearStart = currentYear;
        if (this.customYearEnd && this.customYearEnd < 1888) this.customYearEnd = 1888;
        if (this.customYearEnd > currentYear) this.customYearEnd = currentYear;
      },

      toggleDropdown(name) {
        Object.keys(this.dropdowns).forEach(key => {
            if (key !== name) this.dropdowns[key] = false;
        });
        this.dropdowns[name] = !this.dropdowns[name];
      },
      
      selectType(val) {
        this.selectedSearchType = val;
        this.dropdowns.type = false;
        this.updateGenres();
      },
      
      selectGenre(id) {
        this.selectedSearchGenre = id;
        this.dropdowns.genre = false;
      },
      
      selectSort(val) {
        this.selectedSortBy = val;
        this.dropdowns.sort = false;
      },
      
      selectCountry(val) {
        this.selectedOriginCountry = val;
        this.dropdowns.country = false;
      },
      
      selectNetwork(val) {
        this.selectedWatchProvider = val;
        this.dropdowns.network = false;
      },
      
      closeAllDropdowns(e) {
        if (!e.target.closest('.custom-select')) {
            Object.keys(this.dropdowns).forEach(key => this.dropdowns[key] = false);
        }
      },

      extractYear(date) {
        return date ? date.split('-')[0] : '';
      },

      truncateTitle(title) {
        return title.length > 28 ? title.slice(0, 28) + '...' : title;
      },
        
      updateRating(value) {
        this.selectedMinRating = value.toString();
        this.MinRatingForLabel = this.selectedMinRating;
        localStorage.setItem('selectedMinRating', this.selectedMinRating);
      },
        
      formattedGenre(genreId) {
        const genres = {
          28: 'Action',
          12: 'Adventure',
          16: 'Animation',
          35: 'Comedy',
          80: 'Crime',
          99: 'Documentary',
          18: 'Drama',
          10751: 'Family',
          14: 'Fantasy',
          36: 'History',
          27: 'Horror',
          10402: 'Music',
          9648: 'Mystery',
          10749: 'Romance',
          878: 'Science Fiction',
          10770: 'TV Movie',
          53: 'Thriller',
          10752: 'War',
          37: 'Western',
          10759: 'Action & Adventure',
          10765: 'Sci-Fi and Fantasy',
          10767: 'Talk Show'
        };
        return genres[genreId] || '';
      },

      getSortLabel(val) {
        const labels = {
            'popularity.desc': 'Most Popular',
            'vote_average.desc': 'Highest Rated',
            'primary_release_date.desc': 'Latest Releases',
            'revenue.desc': 'Highest Revenue',
            'vote_count.desc': 'Highest Vote Count',
            'vote_count.asc': 'Lowest Vote Count',
            'imdb-high': 'Highest Rated (IMDb)',
            'imdb-low': 'Lowest Rated (IMDb)',
        };
        return labels[val] || 'Most Popular';
      },
      
      getNetworkLabel(val) {
        const labels = {
            '2552': 'Apple TV+',
            '2739': 'Disney+',
            '453': 'Hulu',
            '6783': 'Max',
            '213': 'Netflix',
            '1024': 'Prime Video'
        };
        return labels[val] || '';
      },

      formattedCountry(countryCode) {
        const countries = {
          AL: 'Albania',
          AM: 'Armenia',
          AR: 'Argentina',
          AT: 'Austria',
          AU: 'Australia',
          BE: 'Belgium',
          BO: 'Bolivia',
          BR: 'Brazil',
          BG: 'Bulgaria',
          CA: 'Canada',
          CN: 'China',
          CO: 'Colombia',
          CR: 'Costa Rica',
          HR: 'Croatia',
          CZ: 'Czech Republic',
          DK: 'Denmark',
          EC: 'Ecuador',
          EG: 'Egypt',
          FI: 'Finland',
          FR: 'France',
          DE: 'Germany',
          GR: 'Greece',
          HK: 'Hong Kong',
          HU: 'Hungary',
          IN: 'India',
          IR: 'Iran',
          IQ: 'Iraq',
          IE: 'Ireland',
          IL: 'Israel',
          IT: 'Italy',
          JM: 'Jamaica',
          JP: 'Japan',
          KR: 'South Korea',
          MX: 'Mexico',
          MA: 'Morocco',
          NL: 'Netherlands',
          NZ: 'New Zealand',
          NG: 'Nigeria',
          NO: 'Norway',
          PL: 'Poland',
          PT: 'Portugal',
          RO: 'Romania',
          RU: 'Russia',
          ZA: 'South Africa',
          ES: 'Spain',
          SE: 'Sweden',
          CH: 'Switzerland',
          TW: 'Taiwan',
          TH: 'Thailand',
          TR: 'Turkey',
          UA: 'Ukraine',
          GB: 'United Kingdom',
          US: 'United States',
          UY: 'Uruguay',
          VE: 'Venezuela',
          VN: 'Vietnam'
        };
        return countries[countryCode] || '';
      }
    },
    computed: {
      showDefaultMessage() {
        return this.MinRatingForLabel === 0;
      },
        
      formattedReleaseYear() {
        if (!this.releaseYear) return ''; 
        return this.releaseYear instanceof Date ? this.releaseYear.getFullYear().toString() : this.releaseYear.toString();
      },
        
      moviesTitle() {
        let yearStr = 'ALL YEARS';
        if (this.customYearStart && this.customYearEnd) yearStr = `${this.customYearStart}-${this.customYearEnd}`;
        else if (this.customYearStart) yearStr = `After ${this.customYearStart}`;
        else if (this.customYearEnd) yearStr = `Before ${this.customYearEnd}`;

        const genre = this.formattedGenre(this.selectedSearchGenre) || 'ALL GENRES';
        const country = this.formattedCountry(this.selectedOriginCountry) || 'ALL COUNTRIES';
        const count = this.movies.length;
        
        const minRating = this.minImdbRating !== null ? this.minImdbRating : 0;
        const maxRating = this.maxImdbRating !== null ? this.maxImdbRating : 10;

        return `Results (${count}) for Movies of ${genre} from ${country} released in ${yearStr} with rating ${minRating}-${maxRating}/10:`;
      },
        
      tvShowsTitle() {
        let yearStr = 'ALL YEARS';
        if (this.customYearStart && this.customYearEnd) yearStr = `${this.customYearStart}-${this.customYearEnd}`;
        else if (this.customYearStart) yearStr = `After ${this.customYearStart}`;
        else if (this.customYearEnd) yearStr = `Before ${this.customYearEnd}`;

        const genre = this.formattedGenre(this.selectedSearchGenre) || 'ALL GENRES';
        const country = this.formattedCountry(this.selectedOriginCountry) || 'ALL COUNTRIES';
        const count = this.tvShows.length;
        
        const minRating = this.minImdbRating !== null ? this.minImdbRating : 0;
        const maxRating = this.maxImdbRating !== null ? this.maxImdbRating : 10;

        return `Results (${count}) for Tv Shows of ${genre} from ${country} released in ${yearStr} with rating ${minRating}-${maxRating}/10:`;
      },

      activeFilterChips() {
        const chips = [];
        if (this.selectedSearchType) {
            chips.push({ label: `Type: ${this.selectedSearchType === 'movie' ? 'Movie' : 'TV'}`, type: 'type' });
        }
        if (this.selectedSearchGenre) {
            chips.push({ label: `Genre: ${this.formattedGenre(this.selectedSearchGenre)}`, type: 'genre' });
        }
        if (this.customYearStart) {
            chips.push({ label: `From: ${this.customYearStart}`, type: 'yearStart' });
        }
        if (this.customYearEnd) {
            chips.push({ label: `To: ${this.customYearEnd}`, type: 'yearEnd' });
        }
        if (this.selectedOriginCountry) {
            chips.push({ label: `Country: ${this.formattedCountry(this.selectedOriginCountry)}`, type: 'country' });
        }
        if (this.selectedWatchProvider) {
            const providers = { '2552': 'Apple TV+', '2739': 'Disney+', '453': 'Hulu', '6783': 'Max', '213': 'Netflix', '1024': 'Prime Video' };
            chips.push({ label: `Provider: ${providers[this.selectedWatchProvider] || this.selectedWatchProvider}`, type: 'provider' });
        }
        if (this.minImdbRating) {
            chips.push({ label: `Min Rating: ${this.minImdbRating}`, type: 'minRating' });
        }
        if (this.maxImdbRating) {
            chips.push({ label: `Max Rating: ${this.maxImdbRating}`, type: 'maxRating' });
        }
        return chips;
      },

      filteredGenres() {
        return this.selectedSearchType === 'movie' ? this.movieGenres : this.tvGenres;
      },
        
      filteredItems() {
        const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
        return items.filter(item => {
          const matchesGenre = this.selectedSearchGenre === '' || item.details.genresForDb.includes(this.selectedSearchGenre);
          const matchesYear = this.selectedYearRange === '' || (item.details.yearStartForDb >= this.selectedYearRange.split('-')[0] && item.details.yearStartForDb <= this.selectedYearRange.split('-')[1]);
          return matchesGenre && matchesYear;
        }).sort((a, b) => {
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
.adv-search-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 15px;;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 30px;
  width: 90%;
  margin-top: 30px !important;
  position:relative;
  margin: 0 auto;
}

.search-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #acafb5;
  letter-spacing: 0.5px;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select select {
  appearance: none;
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px;
}

.custom-select select:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.custom-select select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #7FDBF1;
  pointer-events: none;
}

.date-picker-custom {
  width: 100% !important;
  position: relative;
}

.date-picker-custom :deep(input) {
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px !important;
  box-sizing: border-box;
  line-height: 21px;
}

.date-picker-custom :deep(.mx-datepicker-popup) {
  min-width: 100% !important;
  width: 100% !important;
  max-width: none !important;
  left: 0 !important;
  right: 0 !important;
}

.date-picker-custom :deep(.mx-calendar-panel-year) {
  width: 100% !important;
  min-width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-content) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-panel-date table) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-panel-year .mx-calendar-content) {
  height: auto !important;
  padding: 10px !important;
}

.date-picker-custom :deep(.mx-datepicker) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-datepicker-popup) {
  top: 45px !important;
  position: absolute !important;
}

.date-picker-custom :deep(input:hover) {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.date-picker-custom :deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.date-picker-custom :deep(.mx-input-wrapper) {
  height: 45px !important;
}

.date-picker-custom :deep(.mx-input) {
  height: 45px !important;
}

.date-picker-custom {
  width: 100% !important;
}

.date-picker-input {
  width: 3rem !important;
  padding: 12px 16px !important;
  background: rgba(8, 45, 62, 0.3) !important;
  border: 1px solid rgba(127, 219, 241, 0.3) !important;
  border-radius: 8px !important;
  color: #fff !important;
  font-size: 14px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  height: 45px !important;
  box-sizing: border-box !important;
}

.date-picker-input:hover {
  background: rgba(8, 45, 62, 0.5) !important;
  border-color: rgba(127, 219, 241, 0.5) !important;
}

.date-picker-input:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2) !important;
  border-color: #7FDBF1 !important;
}

.rating-filter {
  margin-top: 0;
}

.custom-rating-container {
  width: 100%;
  height: 45px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-rating-container:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.rating-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rating-container svg {
  transform: scale(1.1) !important;
  margin: 0 !important;
  position: static !important;
}

.rating {
  transform: scale(1) !important;
  margin: 0 !important;
  position: static !important;
}

.default-rating-note {
  text-align: center;
  font-size: 13px;
  color: #acafb5;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.button--back {
  background: rgba(8, 45, 62, 0.6);
  color: #fff;
}

.button--back:hover {
  background: rgba(8, 45, 62, 0.8);
}

.button--search {
  background: rgba(127, 219, 241, 0.2);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.6);
}

.button--search:hover {
  background: rgba(127, 219, 241, 0.3);
}

.button--search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.navbar-welcome {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-top: 7rem;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.footer {
  height: 50vh !important;
}

.details-container {
  cursor: auto;
  font-weight: normal;
}

.disabled-color {
  color: #d0d0d0;
}

.active-color {
  color: #fff;
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

.movie-card,
.tv-show-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover,
.tv-show-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(31, 97, 135, 0.5);
}

.card-background {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  background: black;
  position: relative;
  box-shadow: 0 7px 10px 0 rgba(31, 104, 135, .37);
  top: -10px;
  padding: 10px;
}

a {
  color: #f3f4f6;
  text-decoration: none;
}

.movie-grid,
.tv-show-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
  gap: 20px;
  justify-content: center;
}

.movie-card h3,
.tv-show-card h3 {
  margin-top: 5px;
  color: #8BE9FD;
  font-size: 14px; 
  padding: 4px;
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
  padding: 1px;
  margin: 5px auto; 
  text-align: center;
}

.movie-card img,
.tv-show-card img {
  width: 100%; 
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
}

.column {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

body {
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  height: 100vh;
  background: linear-gradient(to bottom, #eee 0%,#ccc 100%);
  font-family: Arial;
}

h1 {
  margin-bottom: 0;
}

.rating {
  position: relative;
  display: inline-block;
  padding: 0.6rem;
}

.rating-stars {
  font-size: 0;
  padding: 0.6rem;
}

.icon-star {
  width: 2rem;
  height: 2rem;
  stroke-width: 2px;
  stroke: #0485b9;
  fill: none;
}

.icon-star-full {
  fill: #0485b9;
}

.rating-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0.6rem;
}

.rating-labels label {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  text-indent: -999em;
}

.rating-labels input[type="radio"] {
  position: absolute;
  top: -999rem;
}

input:focus + label {
  outline: 1px dotted #666;
}

label[for="radio_1"] {
  z-index: 10;
}

label:hover ~ .rating-stars {
  opacity: 0.8;
}

label[for="radio_1"],
label[for="radio_1"]:hover ~ .rating-stars,
.radio-rating-1:checked ~ .rating-stars {
  width: 10%;
}

label[for="radio_2"] {
  z-index: 9;
}

label[for="radio_2"],
label[for="radio_2"]:hover ~ .rating-stars,
.radio-rating-2:checked ~ .rating-stars {
  width: 20%;
}

label[for="radio_3"] {
  z-index: 8;
}

label[for="radio_3"],
label[for="radio_3"]:hover ~ .rating-stars,
.radio-rating-3:checked ~ .rating-stars {
  width: 30%;
}

label[for="radio_4"] {
  width: 40%;
  z-index: 7;
}

label[for="radio_4"],
label[for="radio_4"]:hover ~ .rating-stars,
.radio-rating-4:checked ~ .rating-stars {
  width: 40%;
}

label[for="radio_5"] {
  z-index: 6;
}

label[for="radio_5"],
label[for="radio_5"]:hover ~ .rating-stars,
.radio-rating-5:checked ~ .rating-stars {
  width: 50%;
}

label[for="radio_6"] {
  z-index: 5;
}

label[for="radio_6"],
label[for="radio_6"]:hover ~ .rating-stars,
.radio-rating-6:checked ~ .rating-stars {
  width: 60%;
}

label[for="radio_7"] {
  z-index: 4;
}

label[for="radio_7"],
label[for="radio_7"]:hover ~ .rating-stars,
.radio-rating-7:checked ~ .rating-stars {
  width: 70%;
}

label[for="radio_8"] {
  z-index: 3;
}

label[for="radio_8"],
label[for="radio_8"]:hover ~ .rating-stars,
.radio-rating-8:checked ~ .rating-stars {
  width: 80%;
}

label[for="radio_9"] {
  z-index: 2;
}

label[for="radio_9"],
label[for="radio_9"]:hover ~ .rating-stars,
.radio-rating-9:checked ~ .rating-stars {
  width: 90%;
}

label[for="radio_10"] {
  z-index: 1;
}

label[for="radio_10"],
label[for="radio_10"]:hover ~ .rating-stars,
.radio-rating-10:checked ~ .rating-stars {
  width: 100%;
}

.rating-labels .rating-stars {
  width: 0;
  white-space: nowrap;
  overflow: hidden;
}

#helper-text {
  display: none;
  font-size: 0.8rem;
}

input:not(:checked):focus ~ #helper-text {
  display: block;
}

@media screen and (max-width: 1200px) {
  .search-filters {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .search-filters {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .button-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .button {
    width: 100%;
  }
  
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .adv-search-section {
    padding: 20px 15px;
  }

  .column {
    padding: 0 15px;
  }
}

@media screen and (max-width: 576px) {
  .search-filters {
    grid-template-columns: 1fr;
  }
  
  .navbar {
    left: 0;
  }
  
  .rating-container {
    transform: scale(0.9);
  }

  .column {
    padding: 0 10px;
  }
}

.adv-search-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 15px;;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 30px;
  width: 90%;
  margin: 0 auto;
  position: relative;
  z-index: 5;
}

.column {
  position: relative;
  z-index: 1;
}

.search-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #acafb5;
  letter-spacing: 0.5px;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select select {
  appearance: none;
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px;
}

.custom-select select:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.custom-select select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #7FDBF1;
  pointer-events: none;
}

.date-picker-custom {
  width: 100% !important;
  position: relative;
}

.date-picker-custom :deep(input) {
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 45px !important;
  box-sizing: border-box;
  line-height: 21px;
}

.date-picker-custom :deep(.mx-datepicker-popup) {
  min-width: 100% !important;
  width: 100% !important;
  max-width: none !important;
  left: 0 !important;
  right: 0 !important;
}

.date-picker-custom :deep(.mx-calendar-panel-year) {
  width: 100% !important;
  min-width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-content) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-panel-date table) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-calendar-panel-year .mx-calendar-content) {
  height: auto !important;
  padding: 10px !important;
}

.date-picker-custom :deep(.mx-datepicker) {
  width: 100% !important;
}

.date-picker-custom :deep(.mx-datepicker-popup) {
  top: 45px !important;
  position: absolute !important;
}

.date-picker-custom :deep(input:hover) {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.date-picker-custom :deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.date-picker-custom :deep(.mx-input-wrapper) {
  height: 45px !important;
}

.date-picker-custom :deep(.mx-input) {
  height: 45px !important;
}

.date-picker-custom {
  width: 100% !important;
}

.date-picker-input {
  width: 3rem !important;
  padding: 12px 16px !important;
  background: rgba(8, 45, 62, 0.3) !important;
  border: 1px solid rgba(127, 219, 241, 0.3) !important;
  border-radius: 8px !important;
  color: #fff !important;
  font-size: 14px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  height: 45px !important;
  box-sizing: border-box !important;
}

.date-picker-input:hover {
  background: rgba(8, 45, 62, 0.5) !important;
  border-color: rgba(127, 219, 241, 0.5) !important;
}

.date-picker-input:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2) !important;
  border-color: #7FDBF1 !important;
}

.rating-filter {
  margin-top: 0;
}

.custom-rating-container {
  width: 100%;
  height: 45px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-rating-container:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.rating-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rating-container svg {
  transform: scale(1.1) !important;
  margin: 0 !important;
  position: static !important;
}

.rating {
  transform: scale(1) !important;
  margin: 0 !important;
  position: static !important;
}

.default-rating-note {
  text-align: center;
  font-size: 13px;
  color: #acafb5;
  margin-top: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.button--back {
  background: rgba(8, 45, 62, 0.6);
  color: #fff;
}

.button--back:hover {
  background: rgba(8, 45, 62, 0.8);
}

.button--search {
  background: rgba(127, 219, 241, 0.2);
  color: #fff;
  border: 1px solid rgba(127, 219, 241, 0.6);
}

.button--search:hover {
  background: rgba(127, 219, 241, 0.3);
}

.button--search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.navbar-welcome {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-top: 7rem;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

@media screen and (max-width: 768px) {
  .search-container,
  .advanced-search,
  .filters-container {
    width: 100%;
    max-width: 100%;
    padding: 0 1rem;
    margin: 0;
  }

  .search-filters,
  .filter-row,
  .search-options {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .filter-group,
  .select-group {
    width: 100%;
    margin-bottom: 1rem;
  }

  .search-select,
  .filter-select,
  select {
    width: 100%;
    min-width: unset;
    max-width: 100%;
    font-size: 16px;
    padding: 12px;
    box-sizing: border-box;
  }

  .search-input,
  input[type="text"],
  input[type="search"] {
    width: 100%;
    font-size: 16px;
    padding: 12px;
    box-sizing: border-box;
  }

  .search-button,
  .filter-button {
    width: 100%;
    margin-top: 1rem;
    padding: 12px;
    font-size: 16px;
  }
}

@media screen and (max-width: 576px) {
  .search-container {
    padding: 0 0.5rem;
  }

  .filter-group {
    margin-bottom: 0.8rem;
  }

  .search-select,
  .search-input {
    font-size: 16px;
    padding: 10px;
  }

  .search-filters {
    gap: 0.8rem;
  }
}

@media screen and (max-width: 480px) {
  .advanced-search-form {
    padding: 1rem 0.5rem;
  }

  .search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .select-wrapper {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

@media screen and (max-width: 800px) {
  .search-filters {
    grid-template-columns: 1fr;
  }
  
  .navbar {
    left: 0;
  }
  
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
  }
  
  .movie-card h3,
  .tv-show-card h3 {
    font-size: 12px;
  }
  
  .movie-card p,
  .tv-show-card p {
    font-size: 10px;
  }
  
  .rating-container {
    transform: scale(0.9);
  }
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 45, 62, 0.3);
  border: 1px solid rgba(127, 219, 241, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  height: 45px;
  color-scheme: dark;
}

.range-input:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.range-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.range-separator {
  color: #acafb5;
  font-weight: bold;
}

.active-filters-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: nowrap;
  margin: 20px auto;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  max-width: 1200px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  color: #8BE9FD;
  font-size: 1.3rem;
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
  background-color: #032530;
  border: 1px solid #144066;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  color: #c9d1d9;
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.select-display:hover {
  border-color: #8BE9FD;
}

.select-arrow {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #8BE9FD;
  transition: transform 0.3s ease;
}

.select-arrow.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #092739;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 5px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.active-filters-indicator {
  max-width: 100%;
  width: 100%;
  margin: 0 0 20px 0;
  box-sizing: border-box;
}

.type-info-banner {
  background: rgba(139, 233, 253, 0.15);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  width: 100%;
  margin: 0 0 20px 0;
  box-sizing: border-box;
}

.type-info-banner .banner-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-info-banner .selection-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8BE9FD;
  font-size: 1.4rem;
  font-weight: 500;
}

.type-info-banner .selection-info svg {
  color: #8BE9FD;
}

.disabled-item {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.5);
}

.dropdown-option {
  padding: 12px 15px;
  color: #e0e0e0;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 1.3rem;
}

.dropdown-option:hover {
  background: rgba(139, 233, 253, 0.1);
  color: #8BE9FD;
}

.dropdown-options::-webkit-scrollbar {
  width: 6px;
}
.dropdown-options::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.307);
}
.dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(139, 233, 253, 0.3);
  border-radius: 3px;
}


.chip-remove {
  background: none;
  border: none;
  color: #8BE9FD;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.chip-remove:hover {
  color: #fff;
}

.clear-all-inline {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.4);
  color: #fff;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
}

.clear-all-inline:hover {
  background: rgba(255, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .active-filters-indicator {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
  }
  
  .filter-chips {
    justify-content: flex-start;
  }
  
  .clear-all-inline {
    align-self: center;
    justify-content: center;
    width: auto;
    min-width: 120px;
  }
}
</style>

