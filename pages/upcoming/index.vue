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
      <h1 class="navbar-welcome">Próximos Estrenos</h1>
        <h2 class="subtitle">Información sobre próximas películas y episodios de series de TV.</h2>
        <div>
          <div class="loader" v-if="!imagesLoaded">
            <div class="spinner"></div>
          </div>
          <div class="listing" style="position:relative; top: -20px;">
            <div class="listing__head">
              <h3 class="listing__title">Próximas Películas:</h3>
            </div>
            <div v-if="combinedMovies && combinedMovies.length" class="carousel">
              <button @click="prevSlide" class="carousel__nav carousel__nav--left">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M17.9 23.2L6.1 12 17.9.8"></path>
                </svg>
              </button>
              <div class="carousel__items" ref="carouselItems">
                <div v-for="(movie, index) in combinedMovies" :key="movie.id" class="card" @click="redirectMovie(movie.id)">
                  <div class="card__img lazyloaded">
                    <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" class="lazyload" />
                    <img v-else src="~/static/image_not_found_yet.png" alt="Image Not Found" />
                  </div>
                  <h2 class="card__name">{{ formatTitle(movie.title) }}</h2>
                  <div class="card__rating">
                    <div class="card__vote">{{ formatDate(movie.release_date) }}</div>
                  </div>
                </div>
              </div>
              <button @click="nextSlide" class="carousel__nav carousel__nav--right">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M6.1 23.2L17.9 12 6.1.8"></path>
                </svg>
              </button>
            </div>
            <div v-else>
              <p>No hay próximas películas disponibles.</p>
            </div>
          </div>
        </div>
        <!--  <div>
          <div class="upcoming-series-container" v-for="series in paginatedSeries" :key="series.id">
            <div class="info-header">
              <h3 class="info-label" v-if="seriesList.length > 0">Upcoming TV show episodes based on your watchlist:</h3>
              <h3 class="infoe-label "v-else>It appears that there are currently no TV shows in your watchlist collection with upcoming episodes. Please consider adding new TV series to populate this section with relevant results.</h3>
            </div>
            <div class="series-header">
              <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1"><</button>
              </div>
              <div class="series-title" @click="redirectTv(series.nextEpisode.show_id)">
                {{ series.name }}
              </div>
              <span class="series-year">({{ formatYearRange(series.firstAirDate, series.nextEpisode.air_date) }})</span>
              <div class="pagination-controls">
                <button @click="nextPage" :disabled="currentPage === totalPages">></button>
              </div>
            </div>
            <div class="info-header-details">
              <button class="button-details" @click="redirectTv(series.nextEpisode.show_id)">Full Details</button>
            </div>
            <div class="previos-episode-label" style="color: #8BE9FD; text-align: center; background: black; width: 100%;">
              SEASON {{ series.numberOfSeasons }}
          </div>
            <div class="arrows-header">
                <div class="previous-episode-label">
                  Previous Episode:
                </div>
                <div class="upcoming-episode-label">
                  Upcoming Episode:
                </div>
            </div>
              <li class="series-item">
                <div class="series-details-left">
                  <div class="series-image series-image-last">
                    <img v-if="series.lastEpisode.still_path" :src="`https://image.tmdb.org/t/p/w400${series.lastEpisode.still_path}`" alt="Series Last Episode Image">
                    <img v-else src="~/static/image_not_found.png" alt="Image Not Found">
                  </div>
                  <div class="episode-details">
                    <p class="episode-name episode-name-last">"{{ series.lastEpisode.name }}."</p>
                  </div>
                  <div class="additional-details">
                    <p>Runtime: {{ series.lastEpisode.runtime ? series.lastEpisode.runtime + ' mins.' : 'No especificado.' }}</p>
                    <p>Release Date: {{ formatDate(series.lastEpisode.air_date) }}</p>
                    <p>Overview: {{ series.lastEpisode.overview ? series.lastEpisode.overview : 'No especificado.' }}</p>
                  </div>
                </div>
                <div class="series-divider"></div>
                <div class="series-details-right">
                  <div class="arrows-header-mobile">
                  <div class="previous-episode-label">
                    Upcoming Episode:
                  </div>
                  <div class="upcoming-episode-label">
                    Upcoming Episode:
                  </div>
              </div>
                  <div class="series-image series-image-next">
                    <img v-if="series.nextEpisode.still_path" :src="`https://image.tmdb.org/t/p/w400${series.nextEpisode.still_path}`" alt="Series Next Episode Image">
                    <img v-else src="~/static/image_not_found.png" alt="Image Not Found">
                  </div>
                  <div class="episode-details">
                    <p class="episode-name episode-name-next">"{{ series.nextEpisode.name }}."</p>
                  </div>
                  <div class="additional-details">
                    <p>Runtime: {{ series.nextEpisode.runtime ? series.nextEpisode.runtime + ' mins.' : 'No especificado.' }}</p>
                    <p>Release Date: {{ formatDate(series.nextEpisode.air_date) }}</p>
                    <p>Overview: {{ series.nextEpisode.overview ? series.nextEpisode.overview : 'No especificado.' }}</p>
                  </div>
                </div>
            </li>
          </div>
        </div> -->

        <div v-if="trendingSeriesList.length > 0">
        <div class="upcoming-series-container" v-for="series in paginatedTrendingSeries" :key="series.id">
          <div class="listing__head">
              <h3 class="listing__title" style="top: 2.5rem; padding-top: 0.5rem;">Próximos Episodios de Series de TV:</h3>
          </div>
          <div class="series-header">
            <div class="pagination-controls">
                  <button @click="prevTrendingPage" :disabled="currentTrendingPage === 1"><</button>
            </div>
            <div class="series-title" @click="redirectTv(series.id)">
              {{ series.name }}
            </div>
            <span class="series-year">({{ formatYearRange(series.firstAirDate, series.nextEpisode.air_date) }})</span>
            <div class="pagination-controls">
              <button @click="nextTrendingPage" :disabled="currentTrendingPage === totalTrendingPages">></button>
            </div>
          </div>
        
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
                <p>Duración: {{ series.lastEpisode.runtime ? series.lastEpisode.runtime + ' mins.' : 'No especificado.' }}</p>
                <p>Fecha de estreno: {{ formatDate(series.lastEpisode.air_date) }}</p>
                <p>Sinopsis: {{ series.lastEpisode.overview ? series.lastEpisode.overview : 'No especificado.' }}</p>
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
      this.fetchUpcomingMovies();
      await this.fetchTrendingTV();
      await this.fetchSeriesDetailsForIds();
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
    async fetchUpcomingMovies() {
      const today = new Date().toISOString().split('T')[0];
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
        const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&page=1&primary_release_date.gte=${today}&sort_by=popularity.desc&with_genres=${genreId}`;
        try {
          const movieResponse = await fetch(moviesUrl, movieOptions);
          if (!movieResponse.ok) {
            throw new Error(`Error en la respuesta de la API de películas para género ${genreId}`);
          }
          const movieData = await movieResponse.json();
          return movieData.results || [];
        } catch (error) {
          console.error(`Error al obtener próximas películas para género ${genreId}:`, error);
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

      setTimeout(() => {
        this.imagesLoaded = true;
      }, 1000);
    },

    formatDate(date) {
        if (!date) return 'No especificado.';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
      },

    sortMoviesByReleaseDate() {
        const today = new Date();
        this.combinedMovies.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return Math.abs(today - dateA) - Math.abs(today - dateB);
        });
    },

    formatTitle(title) {
      return title.length > 28 ? title.substring(0, 25) + '...' : title;
    },

    prevSlide(event, genreName) {
      const carousel = event.target.closest('.carousel').querySelector('.carousel__items');
      const slideWidth = carousel.clientWidth;
      carousel.scrollBy({
        left: -slideWidth,
        behavior: 'smooth'
      });
    },
    nextSlide(event, genreName) {
      const carousel = event.target.closest('.carousel').querySelector('.carousel__items');
      const slideWidth = carousel.clientWidth;
      carousel.scrollBy({
        left: slideWidth,
        behavior: 'smooth'
      });
    },
    updateItemsPerPage() {
      this.itemsPerPage = window.innerWidth <= 1024 ? 20 : 20;
    },

    async fetchTrendingTV() {
        const apiKey = process.env.API_KEY;
        const baseUrl = `https://api.themoviedb.org/3/trending/tv/week?&language=es-ES&api_key=${apiKey}`;
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
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=es-ES`;
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

.spinner {
border: 8px solid rgba(129, 216, 234, 0.658);
border-left-color: #000;
border-radius: 50%;
width: 64px;
height: 64px;
animation: spin 1s linear infinite;
}

@keyframes spin {
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
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
max-width: 70%;
margin: 0 auto;
position: relative;
top: -20px;
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
  padding: 10px;
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
}

.series-year {
font-style: italic;
margin-left: 0.4rem;
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
  height: 400px;
}

.movie-image {
  height: 70%;
}

.movie-title,
.movie-info {
  font-size: 1rem;
}
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
</style>
