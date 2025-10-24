<template>
  <main class="main" style="top:-50px; position: relative;">
    <div v-if="isLoggedIn" class="user-profile">
        <div class="language-selector" style="position: relative; top: -53.60px; left: -62px;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">En</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
            <label class="menu-label1" @click="changeLanguage('spanish')">
              <span>Español</span>
            </label>
          </div>
        </div>
        <div class="avatar-container" @click="toggleMenu">
          <span class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToWatchlist">
              <img src="~/static/icon-watchlist.png" alt="Watchlist Icon" class="settings-icon">
              <span class="menu-label1">watchlist</span>
            </div>
            <div class="menu-item" @click="goToSettings">
              <img src="~/static/icon-settings.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label1">Settings</span>
            </div>
            <div class="menu-item" @click="signOut">
              <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
              <span class="menu-label2">Log out</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="user-profile-else">
        <div class="language-selector" style="position: relative; top: -35.200px; left: -57px;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">En</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
            <label class="menu-label1" @click="changeLanguage('spanish')">
              <span>Español</span>
            </label>
          </div>
        </div>
        <div class="avatar-container-else" @click="toggleMenu">
            <div>
              <span class="menu-label1" @click="goToLogin">Sign In</span>
            </div>
        </div>
      </div>

      <nav class="navbar">
        <h1 class="navbar-welcome" style="position: relative; top: 23px;">Advanced Search</h1>
        <h2 class="text-center" style="color: rgb(172, 175, 181); font-size: 14px; margin-top: 30px; position: relative; text-transform: none; left: -2px; top: -6px;">
        Refine your search criteria for more precise results.
      </h2>
      </nav>

    <div class="adv-search-section">
      <div class="search-container">
        <div class="search-filters">
          <div class="filter-item">
            <label for="searchType">Choose Type</label>
            <div class="custom-select">
              <select v-model="selectedSearchType" id="searchType" @change="updateGenres">
                <option value="">Choose One</option>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="filter-item">
            <label for="searchGenre">Choose Genre</label>
            <div class="custom-select">
              <select v-model="selectedSearchGenre" id="searchGenre">
                <option value="">Optional</option>
                <option v-for="genre in filteredGenres" :key="genre.id" :value="genre.id">
                  {{ genre.name }}
                </option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <year-picker
            v-model="releaseYear"
            :min-year="1888"
          />

          <div class="filter-item">
            <label for="sortBy">Sort By</label>
            <div class="custom-select">
              <select v-model="selectedSortBy" id="sortBy">
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="primary_release_date.desc">Latest Releases</option>
                <option value="revenue.desc">Highest Revenue</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="filter-item">
            <label for="originCountry">Origin Country</label>
            <div class="custom-select">
              <select v-model="selectedOriginCountry" id="originCountry">
                <option value="">Optional</option>
                <option value="AL">Albania</option>
                <option value="AM">Armenia</option>
                <option value="AR">Argentina</option>
                <option value="AT">Austria</option>
                <option value="AU">Australia</option>
                <option value="BE">Belgium</option>
                <option value="BO">Bolivia</option>
                <option value="BR">Brazil</option>
                <option value="BG">Bulgaria</option>
                <option value="CA">Canada</option>
                <option value="CN">China</option>
                <option value="CO">Colombia</option>
                <option value="CR">Costa Rica</option>
                <option value="HR">Croatia</option>
                <option value="CZ">Czech Republic</option>
                <option value="DK">Denmark</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="GR">Greece</option>
                <option value="HK">Hong Kong</option>
                <option value="HU">Hungary</option>
                <option value="IN">India</option>
                <option value="IR">Iran</option>
                <option value="IQ">Iraq</option>
                <option value="IE">Ireland</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="MX">Mexico</option>
                <option value="MA">Morocco</option>
                <option value="NL">Netherlands</option>
                <option value="NZ">New Zealand</option>
                <option value="NG">Nigeria</option>
                <option value="NO">Norway</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="ZA">South Africa</option>
                <option value="ES">Spain</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="TW">Taiwan</option>
                <option value="TH">Thailand</option>
                <option value="TR">Turkey</option>
                <option value="UA">Ukraine</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="UY">Uruguay</option>
                <option value="VE">Venezuela</option>
                <option value="VN">Vietnam</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div v-if="selectedSearchType === 'tv'" class="filter-item">
            <label for="watchProvider">Choose Network</label>
            <div class="custom-select">
              <select v-model="selectedWatchProvider" id="watchProvider">
                <option value="">Optional</option>
                <option value="2552">Apple TV+</option>
                <option value="2739">Disney+</option>
                <option value="453">Hulu</option>
                <option value="6783">Max</option>
                <option value="213">Netflix</option>
                <option value="1024">Prime Video</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="filter-item rating-filter">
            <label>
              Minimum Rating: ({{ MinRatingForLabel }}/10)<span v-if="MinRatingForLabel === 0">{{ asterisk }}</span>
            </label>
            <div class="custom-rating-container">
              <div class="rating-container">
                <svg style="display: none; transform: scale(1.5);">
                  <symbol viewBox="0 0 60 60" id="shape-star"><title>Star</title> <g> <path d="M46.645 54.568L29.65 45.633l-16.997 8.935L15.9 35.643 2.15 22.24l19-2.76 8.5-17.22 8.497 17.22 19.002 2.76L43.4 35.643z"></path> </g> </symbol>
                </svg>
                <div class="rating">
                  <div class="rating-stars">
                    <svg class="icon icon-star" aria-hidden="true">
                      <use class="header-shape-star" xlink:href="#shape-star"></use>
                    </svg>
                    <svg class="icon icon-star" aria-hidden="true">
                      <use class="header-shape-star" xlink:href="#shape-star"></use>
                    </svg>
                    <svg class="icon icon-star" aria-hidden="true">
                      <use class="header-shape-star" xlink:href="#shape-star"></use>
                    </svg>
                    <svg class="icon icon-star" aria-hidden="true">
                      <use class="header-shape-star" xlink:href="#shape-star"></use>
                    </svg>
                    <svg class="icon icon-star" aria-hidden="true">
                      <use class="header-shape-star" xlink:href="#shape-star"></use>
                    </svg>
                  </div>
                  <div class="rating-labels" aria-describedby="helper-text">
                    <input type="radio" name="rating" id="radio_1" class="radio-rating-1" value="1" @change="updateRating(1)">
                    <label for="radio_1">1</label>
                    <input type="radio" name="rating" id="radio_2" class="radio-rating-2" value="2" @change="updateRating(2)">
                    <label for="radio_2">2</label>
                    <input type="radio" name="rating" id="radio_3" class="radio-rating-3" value="3" @change="updateRating(3)">
                    <label for="radio_3">3</label>
                    <input type="radio" name="rating" id="radio_4" class="radio-rating-4" value="4" @change="updateRating(4)">
                    <label for="radio_4">4</label>
                    <input type="radio" name="rating" id="radio_5" class="radio-rating-5" value="5" @change="updateRating(5)">
                    <label for="radio_5">5</label>
                    <input type="radio" name="rating" id="radio_6" class="radio-rating-6" value="6" @change="updateRating(6)">
                    <label for="radio_6">6</label>
                    <input type="radio" name="rating" id="radio_7" class="radio-rating-7" value="7" @change="updateRating(7)">
                    <label for="radio_7">7</label>
                    <input type="radio" name="rating" id="radio_8" class="radio-rating-8" value="8" @change="updateRating(8)">
                    <label for="radio_8">8</label>
                    <input type="radio" name="rating" id="radio_9" class="radio-rating-9" value="9" @change="updateRating(9)">
                    <label for="radio_9">9</label>
                    <input type="radio" name="rating" id="radio_10" class="radio-rating-10" value="10" @change="updateRating(10)">
                    <label for="radio_10">Radio 10</label>
                    <div class="rating-stars">
                      <svg class="icon icon-star icon-star-full" aria-hidden="true">
                        <use class="header-shape-star" xlink:href="#shape-star"></use>
                      </svg>
                      <svg class="icon icon-star icon-star-full" aria-hidden="true">
                        <use class="header-shape-star" xlink:href="#shape-star"></use>
                      </svg>
                      <svg class="icon icon-star icon-star-full" aria-hidden="true">
                        <use class="header-shape-star" xlink:href="#shape-star"></use>
                      </svg>
                      <svg class="icon icon-star icon-star-full" aria-hidden="true">
                        <use class="header-shape-star" xlink:href="#shape-star"></use>
                      </svg>
                      <svg class="icon icon-star icon-star-full" aria-hidden="true">
                        <use class="header-shape-star" xlink:href="#shape-star"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="button-container">
          <button type="button" class="button button--back" @click.prevent="goBack">
            <span class="txt">Back</span>
          </button>
          <button
            class="button button--search"
            :disabled="!selectedSearchType"
            :style="{ 'pointer-events': !selectedSearchType ? 'none' : 'auto', 'opacity': !selectedSearchType ? '0.5' : '1' }"
            @click="searchContent"
          >
            <span
              :class="{ 'txt': true, 'disabled-color': !selectedSearchType, 'active-color': selectedSearchType }"
            >See Results</span>
          </button>
        </div>
        
        <div v-if="MinRatingForLabel === 0" class="default-rating-note">
          *For optimal results, the default minimum rating is set to 6/10, with up to 40 results per search.
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
  import DatePicker from 'vue2-datepicker';
  import supabase from '@/services/supabase';
  import DynamicSearchCarousel from '@/components/DynamicSearchCarousel.vue';
  import 'vue2-datepicker/index.css';
  import '@/assets/css/components/_datepicker.scss';
  
  async function getUserAvatar(userEmail) {
    try {
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
      DatePicker,
      DynamicSearchCarousel
    },
    data() {
      return {
        showLanguageMenu: false,
        selectedLanguage: 'english',
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
        selectedMinRating: localStorage.getItem('selectedMinRating') || '6',
        MinRatingForLabel: 0,
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
        userAvatar: '/avatars/avatar-ss0.png',
        userFirstName: '', 
        isMenuOpen: false,
        filter: 'movies',
        movieRatings: {}, 
        tvShowRatings: {}, 
      };
    },

    async mounted() {
      localStorage.removeItem('selectedMinRating');
      this.MinRatingForLabel = this.selectedMinRating !== '6' ? this.selectedMinRating : 0;
      const email = localStorage.getItem('email');
      const accessToken = localStorage.getItem('access_token');
      this.userEmail = email || '';
      this.hasAccessToken = accessToken !== null;
      this.isLoggedIn = accessToken !== null;
      this.userAvatar = await getUserAvatar(this.userEmail);
      this.userName = await getUserName(this.userEmail);
      if (this.isLoggedIn) {
        this.userAvatar = await getUserAvatar(this.userEmail);
        this.userName = await getUserName(this.userEmail);
      }
    },
  
    methods: {
      updateGenres() {
        this.selectedSearchGenre = '';
      },

      async searchMovies() {
        this.searchPerformed = false; 
        this.loading = true;
        this.movies = [];
        const apiKey = process.env.API_KEY;
        const year = this.releaseYear instanceof Date ? this.releaseYear.getFullYear() : this.releaseYear; 
        let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=${this.selectedSortBy}&vote_count.gte=10&with_genres=${this.selectedSearchGenre}&primary_release_year=${year}`;
        if (this.selectedMinRating) {
          baseUrl += `&vote_average.gte=${this.selectedMinRating}`;
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
          
          if (this.selectedMinRating) {
            this.movies = enrichedMovies.filter(movie => {
              const rating = movie.rating_source === 'imdb' ? movie.imdb_rating : parseFloat(movie.vote_average);
              return rating >= parseFloat(this.selectedMinRating);
            });
          } else {
            this.movies = enrichedMovies;
          }
          
          this.movies.forEach(movie => {
            const rating = movie.rating_source === 'imdb' ? movie.imdb_rating : movie.vote_average;
            this.$set(this.movieRatings, movie.id, rating);
          });
          
          this.loading = false;
          this.searchPerformed = true;
        } catch (error) {
          console.error('Error fetching movies:', error);
          this.loading = false;
        }
      },

      async searchTv() {
        this.searchPerformed = false; 
        this.loading = true;
        this.tvShows = [];
        const apiKey = process.env.API_KEY;
        const year = this.releaseYear instanceof Date ? this.releaseYear.getFullYear() : this.releaseYear;
        let baseUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=${this.selectedSortBy}&vote_count.gte=10&with_genres=${this.selectedSearchGenre}&first_air_date_year=${year}`;
        if (this.selectedMinRating) {
          baseUrl += `&vote_average.gte=${this.selectedMinRating}`;
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
          
          if (this.selectedMinRating) {
            this.tvShows = enrichedTvShows.filter(tvShow => {
              const rating = tvShow.rating_source === 'imdb' ? tvShow.imdb_rating : parseFloat(tvShow.vote_average);
              return rating >= parseFloat(this.selectedMinRating);
            });
          } else {
            this.tvShows = enrichedTvShows;
          }
          
          this.tvShows.forEach(tvShow => {
            const rating = tvShow.rating_source === 'imdb' ? tvShow.imdb_rating : tvShow.vote_average;
            this.$set(this.tvShowRatings, tvShow.id, rating);
          });
          
          this.loading = false;
          this.searchPerformed = true;
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
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_email', this.userEmail);

          if (error) {
            throw new Error('Error al conectar con la base de datos: ' + error.message);
          }
        } catch (error) {
          console.error(error.message);
        }
      },

      toggleLanguageMenu() {
        this.showLanguageMenu = !this.showLanguageMenu;
      },
        
      changeLanguage(language) {
        const currentPath = this.$route.path;
        const currentOrigin = window.location.origin;
        const spanishUrl = `${currentOrigin.replace(
          '://',
          '://es.'
        )}${currentPath}`;
        window.location.href = spanishUrl; 
      },

      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },

      goToWatchlist() {
        this.$router.push('/watchlist');
      },

      goToSettings() {
        this.$router.push('/settings');
      },

      goToLogin() {
        this.$router.push('/login');
      },

      signOut() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        window.location.href = 'https://entercinema.com/';
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
        if (item.details.typeForDb === 'movie') {
          return `https://entercinema.com/movie/${item.details.idForDb}`;
        } else if (item.details.typeForDb === 'tv') {
          return `https://entercinema.com/tv/${item.details.idForDb}`;
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

      formatGenreNames(genreIds, genreList) {
        return genreIds.map(id => {
          const genre = genreList.find(genre => genre.id === id);
          return genre ? genre.name : '';
        }).filter(Boolean).join(', ');
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
        const year = this.releaseYear instanceof Date ? this.releaseYear.getFullYear() : 'ALL YEARS';
        const genre = this.formattedGenre(this.selectedSearchGenre) || 'ALL GENRES';
        const country = this.formattedCountry(this.selectedOriginCountry) || 'ALL COUNTRIES';
        const count = this.movies.length;
        const minRating = this.selectedMinRating;

        return `Results (${count}) for Movies of ${genre} from ${country} released in ${year} with a minimum rating of ${minRating}/10:`;
      },
        
      tvShowsTitle() {
        const year = this.releaseYear instanceof Date ? this.releaseYear.getFullYear() : 'ALL YEARS';
        const genre = this.formattedGenre(this.selectedSearchGenre) || 'ALL GENRES';
        const country = this.formattedCountry(this.selectedOriginCountry) || 'ALL COUNTRIES';
        const count = this.tvShows.length;
        const minRating = this.selectedMinRating;

        return `Results (${count}) for Tv Shows of ${genre} from ${country} released in ${year} with a minimum rating of ${minRating}/10:`;
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
.world-icon {
  width: 13px;
  height: 13px;
  position: relative;
  top: 1px;
  left: 2px;
}

.language {
  margin-right: 0.2rem;
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
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
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

.adv-search-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 30px;
  width: 90%;
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

.date-picker-custom /deep/ input {
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

.date-picker-custom /deep/ .mx-datepicker-popup {
  min-width: 100% !important;
  width: 100% !important;
  max-width: none !important;
  left: 0 !important;
  right: 0 !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-year {
  width: 100% !important;
  min-width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-content {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-date table {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-year .mx-calendar-content {
  height: auto !important;
  padding: 10px !important;
}

.date-picker-custom /deep/ .mx-datepicker {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-datepicker-popup {
  top: 45px !important;
  position: absolute !important;
}

.date-picker-custom /deep/ input:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.date-picker-custom /deep/ input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.date-picker-custom /deep/ .mx-input-wrapper {
  height: 45px !important;
}

.date-picker-custom /deep/ .mx-input {
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
  color: transparent;
  margin-top: 7rem;
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

.avatar-container {
  position: relative;
  bottom: 87px;
  cursor: pointer;
}

.avatar-container-else {
  position: relative;
  top: -56.5px;
  font-size: 11.5px;
  left: 10px;
  cursor: pointer;
}

.user-email {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Tahoma', sans-serif;
  font-size: 13px; 
  border-radius: 15px;
  margin-top: 2rem;
  color: #94999d;
  text-align: center;
}

.footer {
  height: 50vh !important;
}

.user-profile {
  position: absolute;
  right: 5%; 
}

.user-profile-else {
  position: absolute;
  right: 4.10%;
  top: -19.9px;
}

.details-container {
  cursor: auto;
  font-weight: normal;
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

.disabled-color {
  color: #d0d0d0;
}

.active-color {
  color: #fff;
}

.dropdown-menu {
  position: relative;
  width: 122.574px;
  top: 100%;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 3px 15px 0 rgba(163, 189, 205, 0.37);
  border: 1px solid #acafb5;
  border-radius: 5px;
  z-index: 100;
  display: none;
}

.dropdown-menu {
  display: block;
  margin-left: 30px;
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

.avatar {
  width: 40px;
  border: 1px solid rgba(255, 255, 255, 0.654);
  height: 40px;
  box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
  border-radius: 50%;
  margin-left: 8px;
  margin-bottom: 5px;
  cursor: pointer;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
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

.language-menu {
  position: absolute;
  background: rgba(82, 71, 71, 0);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
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

.adv-search-section {
  background: rgba(6, 47, 64, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 30px;
  width: 90%;
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

.date-picker-custom /deep/ input {
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

.date-picker-custom /deep/ .mx-datepicker-popup {
  min-width: 100% !important;
  width: 100% !important;
  max-width: none !important;
  left: 0 !important;
  right: 0 !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-year {
  width: 100% !important;
  min-width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-content {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-date table {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-calendar-panel-year .mx-calendar-content {
  height: auto !important;
  padding: 10px !important;
}

.date-picker-custom /deep/ .mx-datepicker {
  width: 100% !important;
}

.date-picker-custom /deep/ .mx-datepicker-popup {
  top: 45px !important;
  position: absolute !important;
}

.date-picker-custom /deep/ input:hover {
  background: rgba(8, 45, 62, 0.5);
  border-color: rgba(127, 219, 241, 0.5);
}

.date-picker-custom /deep/ input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(127, 219, 241, 0.2);
  border-color: #7FDBF1;
}

.date-picker-custom /deep/ .mx-input-wrapper {
  height: 45px !important;
}

.date-picker-custom /deep/ .mx-input {
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
  color: transparent;
  margin-top: 7rem;
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

.avatar-container {
  position: relative;
  bottom: 87px;
  cursor: pointer;
}

.avatar-container-else {
  position: relative;
  top: -57.5px;
  font-size: 11.5px;
  left: 10px;
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
</style>

