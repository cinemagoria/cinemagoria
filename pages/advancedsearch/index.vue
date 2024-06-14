<template>
  <main class="main" style="top:-50px; position: relative;">
    <div v-if="isLoggedIn" class="user-profile">
        <div class="language-selector" @click="toggleLanguageMenu" style="position: relative; top: 59px; left: -70px;"> 
          <div class="selected-language">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">{{ selectedLanguage === 'spanish' ? 'Es' : 'En' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'english'" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1" @click="changeLanguage('spanish')">
              <span>Español</span>
            </label>
          </div>
        </div>
        <div class="avatar-container" @click="toggleMenu">
          <span class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToProfile">
              <img src="~/static/icon-profile.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label1">Profile</span>
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
        <div class="language-selector" @click="toggleLanguageMenu" style="position: relative; top: -35px; left: -69px;">
          <div class="selected-language">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">{{ selectedLanguage === 'spanish' ? 'Es' : 'En' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" v-show="showLanguageMenu || selectedLanguage === 'english'" style="width: 24px; height: 24px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu">
            <label class="menu-label1"  @click="changeLanguage('spanish')">
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
      </nav>
      <h2 class="text-center" style="color: rgb(172, 175, 181); font-size: 14px; margin-top: 30px; position: relative; text-transform: none; left: -2px; top: -6px;">
        Refine your search criteria for more precise results.
    </h2>
    <div class="adv-search-section">
      <div class="centered-container">
        <div style="margin-left: 20px; font-size: 12px;">
          <p for="searchType">Choose Type:</p>
          <select v-model="selectedSearchType" class="genre-select" id="searchType" @change="updateGenres">
            <option value="">Choose One</option>
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
          </select>
        </div>

        <div v-if="selectedSearchType" style="margin-left: 20px; font-size: 12px;">
          <p for="searchGenre">Choose Genre:</p>
          <select v-model="selectedSearchGenre" class="genre-select" id="searchGenre">
            <option value="">Optional</option>
            <option v-for="genre in filteredGenres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>

        <div v-if="selectedSearchType" style="margin-left: 20px; font-size: 12px;">
        <p for="year">Release Year:</p>
        <date-picker
          v-model="releaseYear"
          type="year"
          :disabled-date="disabledFutureDates"
          :placeholder="formattedReleaseYear"
        />
        </div>

        <div v-if="selectedSearchType" style="margin-left: 20px; font-size: 12px;">
          <p for="sortBy">Sort By:</p>
          <select v-model="selectedSortBy" class="genre-select" id="sortBy">
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Latest Releases</option>
            <option value="revenue.desc">Highest Revenue</option>
          </select>
        </div>

        <div v-if="selectedSearchType" style="margin-left: 20px; font-size: 12px;">
          <p for="originCountry">Origin Country:</p>
          <select v-model="selectedOriginCountry" class="genre-select" id="originCountry">
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
        </div>

        <div v-if="selectedSearchType" style="margin-left: 40px; font-size: 12px;">
          <p style="position: relative; left: -22px;">
            Minimum Rating: ({{ MinRatingForLabel }}/10)<span v-if="MinRatingForLabel === 0">{{ asterisk }}</span>
          </p>
          <div>
          <svg style="display: none; transform: scale(1.5); margin: 0 auto; left: 7px;">
            <symbol viewBox="0 0 60 60" id="shape-star"><title> Star </title> <g> <path d="M46.645 54.568L29.65 45.633l-16.997 8.935L15.9 35.643 2.15 22.24l19-2.76 8.5-17.22 8.497 17.22 19.002 2.76L43.4 35.643z"></path> </g> </symbol></svg>
          <div class="rating" style="transform: scale(1.5); margin: 0 auto; left: 7px;">
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
        <br>
        <br>
        <div>
          <div class="button-container">
            <button type="button" class="button button--icon" @click.prevent="goBack">
            <!-- eslint-disable-next-line -->
              <span class="txt">Back</span>
            </button>
            <button
              class="button button--icon"
              :disabled="!selectedSearchType"
              :style="{ 'pointer-events': !selectedSearchType ? 'none' : 'auto', 'opacity': !selectedSearchType ? '0.5' : '1' }"
              @click="searchContent"
            >
              <span
                :class="{ 'txt': true, 'disabled-color': !selectedSearchType, 'active-color': selectedSearchType }"
              >See Results</span>
            </button>
          </div>
        </div>
        <div v-if="MinRatingForLabel === 0" style="bottom: 17px; position: relative; top: -12px; max-width:320px;">
          *For best results, the default minimum rating value is 7/10. *Up to 40 results per search.
        </div>
      </div>  
      </div>
      <div class="column">
      <br>
      <div v-if="movies.length > 0">
        <br>
        <h3 style="width: 90%; margin: 0 auto;">{{ moviesTitle }}</h3>
        <br>
        <div class="movie-grid" style="width: 90%; margin: 0 auto;">
          <router-link v-for="movie in movies" :key="movie.id" :to="'/movie/' + movie.id" target="_blank">
            <div class="movie-card">
              <div v-if="movie.backdrop_path" class="movie-image-container">
                <img :src="'https://image.tmdb.org/t/p/w500' + movie.backdrop_path" :alt="movie.title" class="movie-image">
                <h3>{{ truncateTitle(movie.title) }}</h3>
                <div class="details-container">
                  <p>{{ extractYear(movie.release_date) }}</p>
                  <p v-if="movieRatings[movie.id]">Rating: {{ movieRatings[movie.id].toFixed(1) }}</p>
                </div>
              </div>
              <div v-else class="movie-card">
                <img src="~/static/image_not_found.png" :alt="movie.title" class="movie-image">
                <h3>{{ truncateTitle(movie.title) }}</h3>
                <div class="details-container">
                  <p>{{ extractYear(movie.release_date) }}</p>
                  <p v-if="movieRatings[movie.id]">Rating: {{ movieRatings[movie.id].toFixed(1) }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="tvShows.length > 0">
        <br>
        <h3 style="width: 90%; margin: 0 auto;">{{ tvShowsTitle }}</h3>
        <br>
        <div class="tv-show-grid" style="width: 90%; margin: 0 auto;">
          <router-link v-for="tvShow in tvShows" :key="tvShow.id" :to="'/tv/' + tvShow.id" target="_blank">
            <div class="tv-show-card">
              <div v-if="tvShow.backdrop_path" class="movie-image-container">
                <img :src="'https://image.tmdb.org/t/p/w500' + tvShow.backdrop_path" :alt="tvShow.name" class="tv-show-image">
                <h3>{{ truncateTitle(tvShow.name) }}</h3>
                <div class="details-container">
                  <p>{{ extractYear(tvShow.first_air_date) }}</p>
                  <p v-if="tvShowRatings[tvShow.id]">Rating: {{ tvShowRatings[tvShow.id].toFixed(1) }}</p>
                </div>
              </div>
              <div v-else class="tv-show-card">
                <img src="~/static/image_not_found.png" :alt="tvShow.name" class="tv-show-image">
                <h3>{{ truncateTitle(tvShow.name) }}</h3>
                <div class="details-container">
                  <p>{{ extractYear(tvShow.first_air_date) }}</p>
                  <p v-if="tvShowRatings[tvShow.id]">Rating: {{ tvShowRatings[tvShow.id].toFixed(1) }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-else>
        <p style="text-align: center; font-size: 13px; padding: 4rem; color: #7FDBF1;" v-if="searchPerformed && movies.length === 0 && tvShows.length === 0">No results found for these search parameters. Try refining your search.</p>
      </div>
    </div>
  </main>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import supabase from '@/services/supabase';
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
      DatePicker
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
        ratings: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        selectedMinRating: localStorage.getItem('selectedMinRating') || '7',
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
      this.MinRatingForLabel = this.selectedMinRating !== '7' ? this.selectedMinRating : 0;
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
          fetch(`${baseUrl}&page=2`)
        ]);
        const data1 = await responses[0].json();
        const data2 = await responses[1].json();
        this.movies = [...data1.results, ...data2.results];
        this.movies.forEach(movie => {
          this.$set(this.movieRatings, movie.id, movie.vote_average);
        });   
        this.loading = false;
        this.searchPerformed = true; 
      } catch (error) {
        console.error('Error fetching movies:', error);
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

      try {
        const responses = await Promise.all([
          fetch(`${baseUrl}&page=1`),
          fetch(`${baseUrl}&page=2`)
        ]);
        const data1 = await responses[0].json();
        const data2 = await responses[1].json();
        this.tvShows = [...data1.results, ...data2.results];
        
        this.tvShows.forEach(tvShow => {
          this.$set(this.tvShowRatings, tvShow.id, tvShow.vote_average);
        });
        this.loading = false;
        this.searchPerformed = true; 
      } catch (error) {
        console.error('Error fetching TV shows:', error);
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
        const menu = this.$refs.languageMenu;
        if (menu) {
          menu.style.display = this.showLanguageMenu ? 'block' : 'none';
        }
      },
      changeLanguage(language) {
        this.selectedLanguage = language;
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

      goToProfile() {
      this.$router.push('/profile');
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
        window.location.href = 'https://cinemathe.space/';
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
          return `https://cinemathe.space/movie/${item.details.idForDb}`;
        } else if (item.details.typeForDb === 'tv') {
          return `https://cinemathe.space/tv/${item.details.idForDb}`;
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
          '2020-2024',
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
    background: rgba( 82, 71, 71, 0 );
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

  .adv-search-section {
    background: rgba(6, 47, 64, 0.15);
    box-shadow: 0 8px 32px 0 rgba(31, 97, 135, 0.37);
    backdrop-filter: blur(13.5px);
    -webkit-backdrop-filter: blur(13.5px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 20px;
    width: 90%;
    margin: 0 auto;
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

  .centered-container {
      display: flex;
      flex-direction: column; 
      justify-content: center;
      align-items: center;
      gap: 20px; 
      margin: 0 auto;
    }
    

    @media screen and (max-width: 600px) {
      .centered-container {
        margin-top: 10px; 
        gap: 10px; 
      }
    }
  
    .avatar-container {
    position: relative;
    top: 26px;
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

  .user-profile {
    position: absolute;
    right: 5%; 
    margin-top: 3rem;
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

  .login-icon {
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


  .dropdown-menu {
    position: relative; 
    width: 113.574px;
    top: 100%;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 3px 15px 0 rgba(31, 97, 135, 0.37); 
    border: 1px solid #acafb5;
    border-radius: 5px;
    z-index: 100;
    display: none;
  }

  .dropdown-menu {
    display: block;
    margin-left: 30px;
  }

  .input-for-year {
    border-radius: 10px;
    padding: 10px;
    height: 31.0709px;
    text-align: center;
    border: 1px solid #ccc;
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

  .disabled-color {
    color: #082D3E;
  }

  .active-color {
    color: #fff;
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

  .selected-min-rating {
    display: none;
  }

  @media screen and (max-width: 600px) {
  .navbar-title {
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

@media screen and (max-width: 767px) {
    .nav-button-container {
      margin-top: 30px; 
    }
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
      transform: translateY(-50%);
      right: 20px; 
    }
  
    .user-profile {
      position: absolute;
      right: 3%; 
      top: -117.5px;
      margin-left: 2rem;
      margin-top: 0.3rem;
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
      width: 170.626px;
      height: 34.6172px;
      text-align: center;
      padding: 0.8rem 3.5rem 0.8rem 1.5rem;
      font-size: 1.3rem;
      color: #fff;
      margin-left: 5px;
      background: rgba( 82, 71, 71, 0 );
      box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
      backdrop-filter: blur( 16px );
      -webkit-backdrop-filter: blur( 16px );
      border-radius: 5px;
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
      border-radius: 5px;
      width: 165.626px;
      text-align: center;
      margin-right: 5px;
      border: 1px solid rgba( 255, 255, 255, 0.18 );
      border-radius: 5px;
    }
  
    .filter-select:hover{
      background-color: #084a66; 
    }
  
    .genre-select {
      background: rgba( 82, 71, 71, 0 );
      box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
      backdrop-filter: blur( 16px );
      -webkit-backdrop-filter: blur( 16px );
      border-radius: 5px;
      text-align: center;
      width: 165.626px;
      margin-right: 15px;
      border: 1px solid rgba( 255, 255, 255, 0.18 );
      border-radius: 5px;
    }
  
    .genre-select:hover{
      background-color: #084a66; 
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
      border-radius: 5px;
    }
  
    .year-select:hover{
      background-color: #084a66; 
    }
  
    .button:hover{
      background-color: #084a66; 
    }

    
  
    .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
  
    gap: 0.5rem;
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
      color: #f3f4f6;
      text-decoration: none;
    }
  
    p {
      margin-block-start: 0.3em;
      margin-block-end: 0.3em;
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
  
  
    .button {
      border-radius: 10px;
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
      margin-bottom: 20px; 
    }
  
    .custom-center {
      text-align: center;
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
  
    .movie-card img,
    .tv-show-card img {
      width: 60%; 
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
      backdrop-filter: blur( 16px );
      -webkit-backdrop-filter: blur( 16px );
      border: 1px solid rgba( 255, 255, 255, 0.18 );
    }

    .spinner {
  display: inline-block;
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
}

.spinner::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #f3f3f3;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite, dots 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots {
  0%, 20% { border-top-color: #fff; }
  40% { border-top-color: #aaa; }
  60% { border-top-color: #fff; }
  80%, 100% { border-top-color: #aaa; }
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
}
.rating-stars {
  font-size: 0;
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
  </style>