<template>
  <main class="main">
    <section class="upcoming-section">
      <div v-if="isLoggedIn" class="user-profile">
        <div class="language-selector" style="position: relative; top: 44px; left: -70px;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">Es</span>  
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
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
        <div class="language-selector" style="position: relative;top: -45.2px; left: -57px;">
          <div class="selected-language" @click="toggleLanguageMenu">
            <img src="~static/langpicker-icon.png" alt="World icon" class="world-icon" style="margin-bottom: 3px; margin-right: 4px;">
            <span class="language">Es</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#585858" class="arrow-icon" style="width: 24px; height: 24px; left: -70px;">
              <path d="M7 10l5 5 5-5z" style="transform: translate(-8px); z-index: 1000;" />
            </svg>
          </div>
          <div ref="languageMenu" class="language-menu" :style="{ display: showLanguageMenu ? 'block' : 'none' }">
            <label class="menu-label1" @click="changeLanguage('spanish')">
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
      <h1 class="navbar-welcome">Cronología de Estrenos</h1>
        <h2 class="subtitle">Mantente informado sobre todos los estrenos de películas y nuevos episodios de series.</h2>
      <div>
        <div class="loader" v-if="!imagesLoaded">
          <div class="modern-spinner">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
        <div class="listing" style="position:relative; top: -20px;">
          <div class="listing__head">
            <h3 class="listing__title" style="z-index: 3 !important; padding: 15px !important;">Estrenos de Películas:</h3>
          </div>
          <div v-if="combinedMovies && combinedMovies.length" class="calendar-container" style="background-color: black !important;">
            <div class="calendar-controls">
              <button @click="prevDate" class="calendar-nav calendar-nav--left">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"></path>
                </svg>
                <span class="nav-label">Día Anterior</span>
              </button>
              <h4 class="calendar-title">{{ formatDateForDisplay(selectedDate) }}</h4>
              <button @click="nextDate" class="calendar-nav calendar-nav--right">
                <span class="nav-label">Día Siguiente</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="none" stroke="#8BE9FD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"></path>
                </svg>
              </button>
            </div>
            
            <div v-if="selectedDateMovies.length > 0" class="day-movies">
              <div class="movies-carousel">
                <button 
                  v-if="selectedDateMovies.length > 8"
                  class="carousel-button carousel-button--left" 
                  @click="scrollMoviesLeft">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"></path>
                  </svg>
                </button>
                
                <div ref="moviesCarouselContent" class="movies-carousel-content">
                  <div v-for="movie in selectedDateMovies" :key="movie.id" class="movie-card" @click="redirectMovie(movie.id)">
                    <div class="movie-poster">
                      <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
                      <img v-else src="~/static/image_not_found_yet.png" alt="Image Not Found" />
                    </div>
                    <h2 class="movie-title">{{ formatTitle(movie.title) }}</h2>
                  </div>
                </div>
                
                <button 
                  v-if="selectedDateMovies.length > 8"
                  class="carousel-button carousel-button--right" 
                  @click="scrollMoviesRight">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Remove pagination info -->
            </div>
            <div v-else class="no-movies-message">
              <p>No hay estrenos programados para {{ formatDateForDisplay(selectedDate) }}.</p>
              <button @click="resetToToday" class="reset-button">Volver a Hoy.</button>
            </div>
          </div>
          <div v-else>
            <p>No hay estrenos disponibles.</p>
          </div>
        </div>
      </div>
      
      <div v-if="trendingSeriesList.length > 0">
      <div class="upcoming-series-container" v-for="series in paginatedTrendingSeries" :key="series.id">
        <div class="listing__head">
            <h3 class="listing__title" style="top: 2.5rem; padding-top: 1.5rem;">Estrenos de Series:</h3>
        </div>
        <div class="series-header">
          <div class="series-title-container">
            <div class="series-title" @click="redirectTv(series.id)">
              {{ series.name }}
            </div>
            <span class="series-year">({{ formatYearRange(series.firstAirDate, series.nextEpisode.air_date) }})</span>
          </div>
        </div>
        
        <button @click="prevTrendingPage" :disabled="currentTrendingPage === 1" class="calendar-nav calendar-nav--left series-nav-left" style="position: relative; z-index:3 !important; bottom: 0.5rem !important; margin-left:1rem !important;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"></path>
          </svg>
        </button>
        
        <button @click="nextTrendingPage" :disabled="currentTrendingPage === totalTrendingPages" class="calendar-nav calendar-nav--right right-arrow series-nav-right" style="z-index:3 !important">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"></path>
          </svg>
        </button>
        <div style="position: relative !important; bottom: 13.8rem !important;">
          <div class="info-header-details">
            <button class="button-details" @click="redirectTv(series.id)">Más Información</button>
          </div>
          <div class="previos-episode-label" style="color: #8BE9FD; text-align: center; background: black; width: 100%;">
              TEMPORADA {{ series.numberOfSeasons }}
          </div>
          <div class="arrows-header">
            <div class="previous-episode-label">
              Episodio Anterior:
            </div>
            <div class="upcoming-episode-label">
              Próximo Episodio:
            </div>
          </div>
          <li class="series-item">
            <div class="series-details-left">
              <div class="series-image series-image-last">
                <img v-if="series.lastEpisode.still_path" :src="`https://image.tmdb.org/t/p/w400${series.lastEpisode.still_path}`" alt="Series Last Episode Image">
                <img v-else src="~/static/image_not_found.png" alt="Image Not Found">
              </div>
              <div class="episode-details">
                <p class="episode-name episode-name-last">{{ series.lastEpisode.episode_number }}. {{ series.lastEpisode.name }}</p>
              </div>
              <div class="additional-details">
                <p>Duración: {{ series.lastEpisode.runtime ? series.lastEpisode.runtime + ' mins.' : 'Not specified.' }}</p>
                <p>Fecha de estreno: {{ formatDate(series.lastEpisode.air_date) }}</p>
                <p>Sinopsis: {{ series.lastEpisode.overview ? series.lastEpisode.overview : 'Not specified.' }}</p>
              </div>
            </div>
            <div class="series-divider"></div>
            <div class="series-details-right">
              <div class="arrows-header-mobile">
                <div class="previous-episode-label">
                  Episodio Anterior:
                </div>
                <div class="upcoming-episode-label">
                  Próximo Episodio:
                </div>
              </div>
              <div class="series-image series-image-next">
                <img v-if="series.nextEpisode.still_path" :src="`https://image.tmdb.org/t/p/w400${series.nextEpisode.still_path}`" alt="Series Next Episode Image">
                <img v-else src="~/static/image_not_found.png" alt="Image Not Found">
              </div>
              <div class="episode-details">
                <p class="episode-name episode-name-next">{{ series.nextEpisode.episode_number }}. {{ series.nextEpisode.name }}</p>
              </div>
              <div class="additional-details">
                <p>Duración: {{ series.nextEpisode.runtime ? series.nextEpisode.runtime + ' mins.' : 'No especificado.' }}</p>
                <p>Fecha de estreno: {{ formatDate(series.nextEpisode.air_date) }}</p>
                <p>Sinopsis: {{ series.nextEpisode.overview ? series.nextEpisode.overview : 'No especificado.' }}</p>
              </div>
            </div>
          </li>
        </div>
        </div>
        </div>
  </section>
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
    data() {
      return {
        imagesLoaded: false,
        currentPage: 1,
        currentTrendingPage: 1,
        currentMoviePage: 1,
        moviesPerPage: 8,
        showLanguageMenu: false,
        selectedLanguage: 'english',
        userEmail: '',
        accessToken: '',
        isLoggedIn: false,
        seriesList: [],
        userAvatar: '/avatars/avatar-ss0.png',
        userFirstName: '',
        isMenuOpen: false,
        trendingTVShows: [],
        trendingTVIds: [],
        filteredSeriesDetails: [],
        trendingSeriesList: [],
        combinedMovies: [],
        selectedDate: new Date(),
        selectedDateMovies: [],
        nextActionMovies: [],
        nextAdventureMovies: [],
        nextHorrorMovies: [],
        nextScienceFictionMovies: [],
        nextThrillerMovies: [],
        nextDocumentaryMovies: [],
        nextCrimeMovies: [],
        nextDramaMovies: [],
        nextHistoryMovies: [],
        nextRomanceMovies: [],
        nextComedyMovies: [],
        nextWesternMovies: [],
        nextWarMovies: [],
        nextMysteryMovies: [],
        genresList: [
          { name: 'nextActionMovies', displayName: 'Action' },
          { name: 'nextAdventureMovies', displayName: 'Adventure' },
          { name: 'nextComedyMovies', displayName: 'Comedy' },
          { name: 'nextCrimeMovies', displayName: 'Crime' },
          { name: 'nextDocumentaryMovies', displayName: 'Documentary' },
          { name: 'nextDramaMovies', displayName: 'Drama' },
          { name: 'nextHistoryMovies', displayName: 'History' },
          { name: 'nextHorrorMovies', displayName: 'Horror' },
          { name: 'nextRomanceMovies', displayName: 'Romance' },
          { name: 'nextScienceFictionMovies', displayName: 'Science Fiction' },
          { name: 'nextThrillerMovies', displayName: 'Thriller' },
          { name: 'nextWesternMovies', displayName: 'Western' },
          { name: 'nextWarMovies', displayName: 'War' },
          { name: 'nextMysteryMovies', displayName: 'Mystery' }
      ],
      currentIndexes: {
        nextActionMovies: 0,
        nextAdventureMovies: 0,
        nextComedyMovies: 0,
        nextCrimeMovies: 0,
        nextDocumentaryMovies: 0,
        nextDramaMovies: 0,
        nextHistoryMovies: 0,
        nextHorrorMovies: 0,
        nextRomanceMovies: 0,
        nextScienceFictionMovies: 0,
        nextThrillerMovies: 0,
        nextWesternMovies: 0,
        nextWarMovies: 0,
        nextMysteryMovies: 0
      },
      addedMovieIds: new Set() 
     };
    },
    async mounted() {
        window.addEventListener('resize', this.updateItemsPerPage);
        this.updateItemsPerPage();
        const email = localStorage.getItem('email');
        const accessToken = localStorage.getItem('access_token');
        this.userEmail = email || '';
        this.hasAccessToken = accessToken !== null;
        this.isLoggedIn = accessToken !== null;
        this.userAvatar = await getUserAvatar(this.userEmail);
        await this.fetchUserFirstName();
        await this.fetchUpcomingMovies();
        await this.fetchTrendingTV();
        await this.fetchSeriesDetailsForIds();
        this.updateSelectedDateMovies();
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.updateItemsPerPage);
    },

    computed: {
      movies() {
      return {
        nextActionMovies: this.nextActionMovies,
        nextAdventureMovies: this.nextAdventureMovies,
        nextComedyMovies: this.nextComedyMovies,
        nextCrimeMovies: this.nextCrimeMovies,
        nextDocumentaryMovies: this.nextDocumentaryMovies,
        nextDramaMovies: this.nextDramaMovies,
        nextHistoryMovies: this.nextHistoryMovies,
        nextHorrorMovies: this.nextHorrorMovies,
        nextRomanceMovies: this.nextRomanceMovies,
        nextScienceFictionMovies: this.nextScienceFictionMovies,
        nextThrillerMovies: this.nextThrillerMovies,
        nextWesternMovies: this.nextWesternMovies,
        nextWarMovies: this.nextWarMovies,
        nextMysteryMovies: this.nextMysteryMovies
      };
      },
      paginatedMovies() {
        const start = (this.currentMoviePage - 1) * this.moviesPerPage;
        const end = start + this.moviesPerPage;
        return this.selectedDateMovies.slice(start, end);
      },
      totalMoviePages() {
        return Math.ceil(this.selectedDateMovies.length / this.moviesPerPage);
      },
      paginatedSeries() {
        const start = (this.currentPage - 1) * 1;
        const end = start + 1;
        return this.sortedSeriesList.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.seriesList.length / 1);
      },

      totalTrendingPages() {
        return Math.ceil(this.trendingSeriesList.length / 1);
      },
      sortedSeriesList() {
        return this.seriesList.slice().sort((a, b) => {
          const dateA = new Date(a.nextEpisode.air_date);
          const dateB = new Date(b.nextEpisode.air_date);
          return dateA - dateB;
        });
      },
      paginatedTrendingSeries() {
        const start = (this.currentTrendingPage - 1) * 1;
        const end = start + 1;
        return this.sortedTrendingSeriesList.slice(start, end);
      },

      totalTrendingPage() {
        return Math.ceil(this.trendingSeriesList.length / this.itemsPerPage);
      },
      sortedTrendingSeriesList() {
        return this.trendingSeriesList.slice().sort((a, b) => {
          const dateA = new Date(a.nextEpisode.air_date);
          const dateB = new Date(b.nextEpisode.air_date);
          return dateA - dateB;
        });
      },
    },
    methods: {
      formatDateToYYYYMMDD(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      
      async fetchUpcomingMovies() {
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - 180);
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 180);
        
        const todayStr = this.formatDateToYYYYMMDD(today);
        const pastDateStr = this.formatDateToYYYYMMDD(pastDate);
        const futureDateStr = this.formatDateToYYYYMMDD(futureDate);
        
        
        const apiKey = process.env.API_KEY;
        const apiLang = process.env.API_LANG;

        const genres = {
          horror: 27,
          adventure: 12,
          scienceFiction: 878,
          action: 28,
          comedy: 35,
          crime: 80,
          documentary: 99,
          drama: 18,
          history: 36,
          romance: 10749,
          thriller: 53,
          western: 37,
          war: 10752,
          mystery: 9648
        };

        const genreIdMap = Object.fromEntries(
          Object.entries(genres).map(([name, id]) => [id, `next${name.charAt(0).toUpperCase() + name.slice(1)}Movies`])
        );

        const movieOptions = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
          }
        };

        const fetchMoviesByGenre = async (genreId) => {
          const currentMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${apiLang}&page=1&primary_release_date.gte=${pastDateStr}&primary_release_date.lte=${todayStr}&sort_by=primary_release_date.desc&with_genres=${genreId}`;
          const upcomingMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${apiLang}&page=1&primary_release_date.gte=${todayStr}&primary_release_date.lte=${futureDateStr}&sort_by=primary_release_date.asc&with_genres=${genreId}`;
          
          try {
            const [currentResponse, upcomingResponse] = await Promise.all([
              fetch(currentMoviesUrl, movieOptions),
              fetch(upcomingMoviesUrl, movieOptions)
            ]);
            
            if (!currentResponse.ok || !upcomingResponse.ok) {
              throw new Error(`Error en la respuesta de la API de películas para género ${genreId}`);
            }
            
            const currentData = await currentResponse.json();
            const upcomingData = await upcomingResponse.json();
            
            const allMovies = [
              ...(currentData.results || []),
              ...(upcomingData.results || [])
            ];
            
            const dates = allMovies.map(m => m.release_date);

            return allMovies;
          } catch (error) {
            console.error(`Error al obtener películas para género ${genreId}:`, error);
            return [];
          }
        };

        const allMovies = [];

        for (const genreId of Object.values(genres)) {
          const movies = await fetchMoviesByGenre(genreId);
          allMovies.push(...movies);
        }

        allMovies.forEach(movie => {
          if (movie.genre_ids && movie.genre_ids.length > 0) {
            const primaryGenreId = movie.genre_ids[0];
            const genreListName = genreIdMap[primaryGenreId];
            if (genreListName && !this.addedMovieIds.has(movie.id)) {
              if (this[genreListName]) {
                this[genreListName].push(movie);
                this.addedMovieIds.add(movie.id);
              } else {
                console.error(`La lista de géneros ${genreListName} no existe.`);
              }
            }
          }
        });

        this.combinedMovies = Object.values(this.movies).flat();
        this.sortMoviesByReleaseDate();
        this.updateSelectedDateMovies();

        setTimeout(() => {
          this.imagesLoaded = true;
        }, 800);
      },

      formatDate(date) {
          if (!date) return 'Not specified.';
          const [year, month, day] = date.split('-');
          return `${day}-${month}-${year}`;
        },

      sortMoviesByReleaseDate() {
          if (!this.selectedDate) {
            this.selectedDate = new Date();
          }
          
          const uniqueMovies = {};
          this.combinedMovies.forEach(movie => {
            if (movie.release_date && movie.id) {
              uniqueMovies[movie.id] = movie;
            }
          });
          this.combinedMovies = Object.values(uniqueMovies).sort((a, b) => {
            const dateA = new Date(a.release_date);
            const dateB = new Date(b.release_date);
            return dateA - dateB;
          });
      },

      formatTitle(title) {
        return title.length > 28 ? title.substring(0, 25) + '...' : title;
      },

      prevDate() {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        this.selectedDate = newDate;
        this.currentMoviePage = 1;
        this.updateSelectedDateMovies();
      },
      nextDate() {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        this.selectedDate = newDate;
        this.currentMoviePage = 1;
        this.updateSelectedDateMovies();
      },
      resetToToday() {
        this.selectedDate = new Date();
        this.currentMoviePage = 1;
        this.updateSelectedDateMovies();
      },
      scrollMoviesLeft() {
        if (this.$refs.moviesCarouselContent) {
          const container = this.$refs.moviesCarouselContent;
          container.scrollBy({ left: -500, behavior: 'smooth' });
        }
      },
      scrollMoviesRight() {
        if (this.$refs.moviesCarouselContent) {
          const container = this.$refs.moviesCarouselContent;
          container.scrollBy({ left: 500, behavior: 'smooth' });
        }
      },
      updateSelectedDateMovies() {
        if (!this.selectedDate || !this.combinedMovies || this.combinedMovies.length === 0) {
          this.selectedDateMovies = [];
          return;
        }
        
        const selectedDateStr = this.formatDateToYYYYMMDD(this.selectedDate);

        const movieDates = this.combinedMovies.map(m => m.release_date);

        
        this.selectedDateMovies = this.combinedMovies.filter(movie => 
          movie.release_date === selectedDateStr
        );

      },
      formatDateForDisplay(date) {
        if (!date) return '';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options);
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      },
      updateItemsPerPage() {
        this.itemsPerPage = window.innerWidth <= 1024 ? 20 : 20;
        if (window.innerWidth <= 576) {
          this.moviesPerPage = 1;
        } else if (window.innerWidth <= 992) {
          this.moviesPerPage = 6;
        } else {
          this.moviesPerPage = 8;
        }
      },

      async fetchTrendingTV() {
        const apiKey = process.env.API_KEY;
        const apiLang = 'en-US';
        const baseUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=${apiLang}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        };

        try {
            const pages = [1, 2, 3, 4, 5];
            const fetchPromises = pages.map(page => {
                const url = `${baseUrl}&page=${page}`;
                return fetch(url, options);
            });

            const responses = await Promise.all(fetchPromises);
            const dataPromises = responses.map(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            });

            const allData = await Promise.all(dataPromises);
            const allResults = allData.flatMap(data => data.results);

            this.trendingTVShows = allResults;
            const filteredResults = allResults.filter(show => !show.genre_ids.includes(16));
            this.trendingTVIds = filteredResults.map(show => show.id);
        } catch (error) {
            console.error('Error al obtener series en tendencia:', error);
        }
      },


      async fetchSeriesDetails(seriesId) {
          const apiKey = process.env.API_KEY;
          const apiLang = 'en-US';
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
      },

      async fetchSeriesDetailsForIds() {
          const seriesPromises = this.trendingTVIds.map(id => this.fetchSeriesDetails(id));
          const seriesDetails = await Promise.all(seriesPromises);
          const currentYear = new Date().getFullYear();
          const pastYearsLimit = currentYear - 5;

          const filteredSeriesDetails = seriesDetails
              .filter(series => series !== null)
              .map(series => ({
                  id: series.id,
                  name: series.name,
                  genres: series.genres.map(genre => ({ id: genre.id, name: genre.name })),
                  nextEpisode: series.next_episode_to_air,
                  stillPath: series.still_path,
                  numberOfEpisodes: series.number_of_episodes,
                  numberOfSeasons: series.number_of_seasons,
                  firstAirDate: series.first_air_date,
                  lastEpisode: series.last_episode_to_air,
                  yearEndForDb: series.last_episode_to_air ? new Date(series.last_episode_to_air.air_date).getFullYear() : null
              }))
              .filter(series => series.yearEndForDb >= pastYearsLimit && series.nextEpisode !== undefined && series.nextEpisode !== null);

          this.filteredSeriesDetails = filteredSeriesDetails;
          this.trendingSeriesList = this.filteredSeriesDetails;
      },


      async fetchFavoriteSeries() {
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('series_releases_details')
            .eq('user_email', localStorage.getItem('email'));

          if (error) {
            throw new Error('Error al obtener los datos de la base de datos: ' + error.message);
          }
          this.seriesList = data[0].series_releases_details || [];

        } catch (error) {
          console.error('Error al obtener los datos de la base de datos:', error.message);
        }
      },
      constructImagePath(stillPath) {
            if (stillPath) {
                return `https://image.tmdb.org/t/p/w400${stillPath}`;
            } else {
                return '/static/image_not_found.png';
            }
      },

      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },

      nextTrendingPage() {
        if (this.currentTrendingPage < this.totalTrendingPages) {
          this.currentTrendingPage++;
        }
      },
      prevTrendingPage() {
        if (this.currentTrendingPage > 1) {
          this.currentTrendingPage--;
        }
      },


      prevTrendingPage() {
        if (this.currentTrendingPage > 1) {
            this.currentTrendingPage--;
        }
      },

      nextTrendingPage() {
        if (this.currentTrendingPage < this.totalTrendingPages) {
            this.currentTrendingPage++;
        }
      },



      redirectTv(showId) {
      const url = `https://es.entercinema.com/tv/${showId}`;
      window.open(url, '_blank');
    },

    redirectMovie(id) {
      const url = `https://es.entercinema.com/movie/${id}`;
      window.open(url, '_blank');
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

        formatDateYear(date) {
          if (!date) return '';
          const [year] = date.split('-');
          return `${year}`;
        },
        formatYearRange(firstAirDate, nextEpisodeDate) {
          const firstYear = this.formatDateYear(firstAirDate);
          const nextYear = this.formatDateYear(nextEpisodeDate);
          return firstYear === nextYear ? firstYear : `${firstYear}-${nextYear}`;
        },

        goToHome() {
        this.$router.push({ path: '/' });
        },

        goToSettings() {
        this.$router.push({ path: '/settings' });
        },

        signOut() {
        localStorage.removeItem('email');
        localStorage.removeItem('access_token');
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

        getVisibleMovies(genreName) {
          const currentIndex = this.currentIndexes[genreName];
          return this.movies[genreName].slice(currentIndex, currentIndex + this.itemsPerPage);
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
        goTowatchlist() {
        this.$router.push('/watchlist');
      },

      getLink(item) {
      if (item.details.typeForDb === 'movie') {
          return `https://es.entercinema.com/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
          return `https://es.entercinema.com/tv/${item.details.idForDb}`;
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
    }
}
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(270deg, rgba(9, 39, 57, 0.95), rgba(0, 0, 0, 0.992));
  z-index: 9999;
}

.modern-spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.modern-spinner div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #8BE9FD;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.modern-spinner div:nth-child(1) {
  left: 8px;
  animation: modern-spinner1 0.6s infinite;
}
.modern-spinner div:nth-child(2) {
  left: 8px;
  animation: modern-spinner2 0.6s infinite;
}
.modern-spinner div:nth-child(3) {
  left: 32px;
  animation: modern-spinner2 0.6s infinite;
}
.modern-spinner div:nth-child(4) {
  left: 56px;
  animation: modern-spinner3 0.6s infinite;
}
@keyframes modern-spinner1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes modern-spinner3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes modern-spinner2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

.genre-section {
  margin-bottom: 40px;
  background: black;
  border-radius: 10px;
}

.listing__title {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    margin: 0 auto;
    top: 2rem;
    width: 100%;
    height: 50px;
    line-height: 2.1;
    background: black;
}

.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-button {
  backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: rgba(82, 71, 71, 0);
    border: 1px solid hsla(0, 0%, 100%, .18);
    border-radius: 5px;
    box-shadow: 0 -2px 25px 0 rgb(31 104 135 / 36%);
    color: #8BE9FD;
    cursor: pointer;
    margin: 5px;
    font-size: 24px;
    padding: .5rem 1rem;
}

.carousel-content {
  display: flex;
  overflow: hidden;
  max-width: 90%;
}

.card:hover, 
.card:focus {
  cursor: pointer;
}


.card__image {
  padding: 5px;
  width: 200px;
  border-radius: 15px;
  min-width: 50px;
  min-height: 100px;
}

.movie-poster {
    width: 100%;
    height: auto;
    padding: 2%;
    border-radius: 10px;
}

.movie-title {
  margin: 10px 0;
  color: #8BE9FD;
}

.movie-title:hover {
  color: #ddd;
  cursor: pointer;
}

.movie-info {
  font-size: 12px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  font-size: 14px;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.pagination-controls button {
  backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: rgba(82, 71, 71, 0);
    border: 1px solid hsla(0, 0%, 100%, .18);
    border-radius: 5px;
    box-shadow: 0 -2px 25px 0 rgb(31 104 135 / 36%);
    color: #8BE9FD;
    cursor: pointer;
    margin: 5px;
    padding: .5rem 1rem;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.arrows-header-mobile {
    display: none;
}

.upcoming-series-container {
  max-width: 90%;
  margin: 0 auto;
  position: relative;
}


.info-header {
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: black;
    box-shadow: 0 8px 32px 0 rgba(56, 134, 167, 0.37);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    justify-content: center;
    position: relative;
    top: 21px;
}

.info-header-details {
    display: flex;
    align-items: center;
    background: black;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    justify-content: center;
    height: 20px;
    width:100%;
}


.info-label {
  margin-top: 10px;
  text-align: center;
  width: 80%;
}

.series-header {
    display: flex;
    align-items: center;
    /* border-top-left-radius: 10px; */
    /* border-top-right-radius: 10px; */
    background: black;
    /* box-shadow: 0 8px 32px 0 rgba(56, 134, 167, 0.37); */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 40px;
    position: relative;
    justify-content: center;
}

.arrows-header {
  display: flex;
  align-items: baseline;
  text-align: center;
  background: black;
  font-size: 13px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 10px;
  align-content: center;
  flex-wrap: wrap;
  font-size: 12px;
  letter-spacing: 1px;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

.series-year {
  font-style: italic;
  margin: 0 auto !important;
  font-size: 12px;
}

.series-details-left,
.series-details-right {
  flex: 1;
  position: relative;
}

.series-image-last,
.series-image-next {
  width: 120px;
  height: auto;
  overflow: hidden;
  border-radius: 10px;
}

.series-image-last img,
.series-image-next img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.series-details-left .series-image {
  float: left;
  margin-right: 10px;
}

.series-details-right .series-image {
  float: right;
  margin-left: 10px;
}

.episode-details {
  overflow: hidden;
}

.series-divider {
  height: 120px;
  width: 1px;
  background-color: #ddd;
  margin: 0 20px;
}

.series-title {
  font-size: 12px;
    color: #8BE9FD;
    letter-spacing: 2px;
}

.series-title:hover {
  cursor: pointer;
  color:#ddd;
}

.series-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  font-size: 12px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: rgba(4, 14, 21, 0.07);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 10px;
  position: relative;
}

.episode-details p {
  letter-spacing: 2px;
  text-transform: uppercase;

  margin: 5px 0;
}

.episode-name {
  font-weight: bold;
}

.episode-name-next {
  text-align: left;
}

.card__content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -5px;
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

.avatar-container-else {
    position: relative;
    top: -66.5px;
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

  .subtitle {
    margin: 0 auto;
    width: 90%;
    color: rgb(172, 175, 181);
    font-size: 14px;
    text-align: center;
    position: relative;
    top: -15px;
  }

  .tv-upcoming-title {
    margin: 0 auto;
    width: 90%;
    color: rgb(216 217 219);
    font-size: 14px;
    text-align: center;
    position: relative;
    padding-bottom: 10px;
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

.avatar-container {
  top: 10.5px;
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: relative;
  left: 27px;
  width: 113.574px;
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
  margin-left: 30px;
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
  border-radius: 10px;
}


@media screen and (max-width: 620px) {
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
    margin-left: 2rem;
    top: -26px;
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

  .button-details {
    padding: 0.5rem 1rem;
    background: rgba(82, 71, 71, 0);
    /* box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37); */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    color: #fff;
    margin: 5px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 450;
    color: #8BE9FD;
    position: relative;
    top: -10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    gap: 0.5rem;
    top: 30px;
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


  .upcoming-section {
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
    justify-content: center;
  }

  @media screen and (max-width: 600px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media screen and (min-width: 601px) {
  .movie-grid,
  .tv-show-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media screen and (max-width: 1200px) {
.upcoming-series-container {
  max-width: 95%;
  font-size: 11px;
}
}


@media screen and (max-width: 475px) {

.upcoming-series-container {
  max-width: 95%;
}
}
@media (min-width: 375px) and (max-width: 724px) {
  .series-image img {
    width: 70%;
  }
}

@media (max-width: 724px) {
.arrows-header-mobile {
  display: block;
}

.additional-details {
  text-align: center;
}

  .episode-name-next{
    text-align: center;
  }

  .episode-name .episode-name-next {
    margin: 0 auto;
    text-align: center;
  }
  .series-item {
    flex-direction: column;
  }

  .series-image img {
    margin: 0 auto;
  }
  .series-divider {
    display:none;
  }


  .series-details-left, .series-details-right {
    width: 100%;
  }

  .series-image, .episode-details {
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }

  .series-image-last,
  .series-image-next {
    margin: 0 auto;
  }

  .series-details-left .series-details-right .series-image {
    float: none;
    margin: 0 auto;
  }
  .upcoming-episode-label {
    display: none;
  }

  .arrows-header-mobile {
    display: block;
    text-align: center;
    background: black;
    box-shadow: 0 8px 32px 0 rgba(42, 133, 171, 0.37);
    backdrop-filter: blur(16px);
    padding: 10px;
    height: 45px;
    align-content: center;
    font-size: 12px;
    letter-spacing: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    right: 9px;
    position: relative;
    width: 103.6%;
    margin-bottom: 10px;
    margin-top: 10px;
  }
}




@media (min-width: 200px) and (max-width: 300px) {
  .arrows-header-mobile {
    width: 108%;
  }
}

@media (min-width: 300px) and (max-width: 400px) {
  .arrows-header-mobile {
    width: 106.2%;
  }
}

@media (min-width: 400px) and (max-width: 472px) {
  .arrows-header-mobile {
    width: 104.5%;
  }
}

@media (min-width: 472px) and (max-width: 500px) {
  .arrows-header-mobile {
    width: 104.2%;
  }
}

@media (min-width: 600px) and (max-width: 724px) {
  .arrows-header-mobile {
    width: 103%;
  }
}

  .card-background {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    background: black;
  }

  
h3 {
  text-align: center;
  position: relative;
  height: 70px;
  top: 13px;
}

.carousel {
  display: flex;
  align-items: center;
}

.carousel-content {
  display: flex;
  overflow: hidden;
  flex: 1;
}

.movie-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 50%;
  margin: 10px;
  box-sizing: border-box;
  text-align: center;
}

@media screen and (min-width: 1025px) {
  .movie-card {
    flex: 1 0 25%;
    height: auto;
    max-height: 350px;
  }

  .movie-title,
  .movie-info {
    font-size: 1rem;
  }
}

.movie-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 50%;
  margin: 10px;
  box-sizing: border-box;
  text-align: center;
  height: auto;
}

.movie-poster {
  width: 100%;
  height: auto;
  padding: 2%;
  border-radius: 10px;
}

.movie-poster img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  display: block;
  object-fit: cover;
}

.movie-image {
  width: 100%;
  object-fit: cover;
}

.movie-title,
.movie-info {
  margin-top: 10px;
  text-align: center;
}

.carousel-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

/* Calendar styles */
.calendar-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background: rgba(4, 14, 21, 0.07);
  background-color: rgba(4, 14, 21, 0.07);
  box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  position: relative;
  bottom: 1.3rem;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 10px;
  padding: 10px 15px;
  position: relative;
  top: 1.8rem;
}

.calendar-title {
  font-size: 1.2rem;
  color: #8BE9FD;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.calendar-nav {
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 1rem;
  opacity: 0.9;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  bottom: 1rem;
}

.nav-label {
  font-size: 1.2rem;
  color: #8BE9FD;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.calendar-nav:hover {
  opacity: 1;
  transform: scale(1.1);
}

.day-movies {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  max-height: 450px;
}

.day-title {
  color: #8BE9FD;
  margin-bottom: 15px;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.movies-carousel {
  display: flex;
  align-items: center;
  gap: 10px;
  max-height: 420px;
  position: relative;
}

.movies-carousel-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none; /* For Firefox */
  -ms-overflow-style: none; /* For Edge */
  padding: 10px 5px;
  max-height: 410px;
  flex: 1;
}

.movies-carousel-content::-webkit-scrollbar {
  display: none; /* For Chrome, Safari */
}

.carousel-button {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  z-index: 5;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-button svg {
  width: 24px;
  height: 24px;
}

.pagination-info {
  text-align: center;
  margin-top: 10px;
  color: #8BE9FD;
  font-size: 14px;
}

@media screen and (max-width: 600px) {
  .movies-carousel-content {
    max-height: 410px;
  }
  
  .movie-card {
    max-width: 180px;
    width: 180px;
  }
}

.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  background: rgba(10, 25, 41, 0.7);
  border-radius: 8px;
  overflow: hidden;
  padding: 10px;
  flex: 0 0 auto;
  width: 200px;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.movie-poster img {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.movie-title {
  font-size: 1.2rem;
  margin-top: 10px;
  text-align: center;
}

.no-movies-message {
  padding: 20px;
  color: #8BE9FD;
  font-size: 1rem;
  text-align: center;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.reset-button {
  padding: 8px 16px;
  background: #8BE9FD;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  margin: 0 auto;
  top: 1rem;
  position: relative;
}

.reset-button:hover {
  background: #5ad9ff;
}

.right-arrow {
  float: right;
  position: relative;
  bottom: 6.7rem;
  margin-right: 1rem;
}

.series-title-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.series-title {
  font-size: 12px;
  color: #8BE9FD;
  letter-spacing: 2px;
  text-align: center;
}

.series-year {
  font-style: italic;
  font-size: 12px;
  text-align: center;
  display: block;
  margin: 0 auto;
}
</style>
