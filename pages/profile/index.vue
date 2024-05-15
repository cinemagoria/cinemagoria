<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <div class="user-profile">
        <div class="avatar-container" @click="toggleMenu">
          <span class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToSettings">
              <img src="~/static/icon-settings.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label">Cuenta</span>
            </div>
            <div class="menu-item" @click="signOut">
              <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
              <span class="menu-label">Cerrar sesión</span>
            </div>
          </div>
        </div>
        <!-- <button class="button-logout" @click="signOut">
          <img src="~/static/icon-logout.png" alt="Ícono de Cerrar Sesión" class="logout-icon">
          <span class="txt">Log out</span>
        </button> -->
      </div>
      <br>
      <nav class="navbar" style="margin-top: 4rem;">
      <h1 class="navbar-welcome">¡Bienvenid@ Nuevamente!</h1>
      </nav>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <div class="button-container" style="margin-top: 3rem;">
            <select @change="toggleOrder" class="order-select" style="width: 198.702px;">
                <option value="asc" :selected="orderText === 'Orden Ascendente'">
                    <span class="order-word">Ordenar:</span> <span class="order-option">Últimas adiciones</span>
                </option>
                <option value="desc" :selected="orderText === 'Orden Descendente'">
                    <span class="order-word">Ordenar:</span> <span class="order-option">Primeras adiciones</span>
                </option>
            </select>
          </div>
          <br>
          <h2 v-if="moviesFetched.length > 0" class="text-center" style="color: #acafb5; font-size: 16px; margin-top:10px;">Películas Favoritas</h2>
          
          <div class="movie-grid">
            <div v-for="(movie, index) in moviesToShow" :key="'movie-' + index" class="movie-card">
              <a :href="'https://es--sonarflix.netlify.app/movie/' + movie.details.idForDb">
                <img :src="movie.details.posterForDb" alt="Póster de la Película" class="poster" />
                <h3>{{ movie.details.nameForDb }}</h3>
              </a>
              <p v-if="movie && movie.details && movie.details.starsForDb !== null && movie.details.starsForDb !== undefined && !Array.isArray(movie.details.starsForDb)">Calificación: {{ movie.details.starsForDb.toString().slice(0, 1) + '.' + movie.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Puntaje: No Especificado</p>
              <p>Fecha de Estreno: {{ movie.details.yearStartForDb }}</p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="moviesFetched.length > moviesPerPage">
            <button @click="goToFirstMovies" :disabled="currentPageMovies === 1">|<</button>
            <button @click="prevPageMovies" :disabled="currentPageMovies === 1"><<</button>
            <span>
              <label for="moviePage" style="font-size:13px;">Página</label>
              <input type="number" id="moviePage" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPageMovies" min="1" :max="totalMoviePages">
            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">de {{ totalMoviePages }}</span>
            <button @click="nextPageMovies" :disabled="currentPageMovies === totalMoviePages">>></button>
            <button @click="goToLastMovies" :disabled="currentPageMovies === totalMoviePages">>|</button>
          </div>

        </div>
        <br>
        <div class="column">
          <br>
          <h2 v-if="tvFetched.length > 0" class="text-center" style="color: #acafb5; font-size: 16px;">Series de TV Favoritas</h2>
          <div class="tv-show-grid">
            <div v-for="(tvShow, index) in tvToShow" :key="'tvShow-' + index" class="tv-show-card">
              <a :href="'https://es--sonarflix.netlify.app/tv/' + tvShow.details.idForDb">
                <img :src="tvShow.details.posterForDb" alt="Póster de la Serie de TV" class="poster" />
                <h3>{{ tvShow.details.nameForDb }}</h3>
              </a>
              <p v-if="tvShow && tvShow.details && tvShow.details.starsForDb !== null && tvShow.details.starsForDb !== undefined && !Array.isArray(tvShow.details.starsForDb)">Calificación: {{ tvShow.details.starsForDb.toString().slice(0, 1) + '.' + tvShow.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Puntaje: No Especificado</p>
              <p>Fecha de Emisión: 
                {{ tvShow.details.yearStartForDb === tvShow.details.yearEndForDb ? tvShow.details.yearEndForDb : tvShow.details.yearStartForDb + '-' + tvShow.details.yearEndForDb }}
              </p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="tvFetched.length > tvPerPage">
            <button @click="goToFirstTV" :disabled="currentPageTV === 1">|<</button>
            <button @click="prevPageTV" :disabled="currentPageTV === 1"><<</button>
            <span>
              <label for="tvPage" style="font-size:13px;">Página</label>
              <input type="number" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" id="tvPage" v-model.number="currentPageTV" min="1" :max="totalTVPages">
            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">de {{ totalTVPages }}</span>
            <button @click="nextPageTV" :disabled="currentPageTV === totalTVPages">>></button>
            <button @click="goToLastTV" :disabled="currentPageTV === totalTVPages">>|</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="text-align: center;">Aún no hay favoritos.</p>
      </div>
      <br>
      
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
    console.log(userAvatar);
    return userAvatar;
    
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return '/avatars/avatar-ss0.png';
  }
}

export default {
  data() {
    return {
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
      favorites: [],
      moviesFetched: [],
      tvFetched: [],
      movieKey: '', 
      tvKey: '',
      orderText: 'Order Asc', 
      currentPageMovies: 1,
      currentPageTV: 1,
      moviesPerPage: 6,
      tvPerPage: 6,
      userAvatar: '/avatars/avatar-ss0.png',
      isMenuOpen: false,
    };
  },
  async mounted() {
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkData();
    this.userAvatar = await getUserAvatar(this.userEmail);
  },
  
  methods: {
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
        data.forEach((row) => {
          if (row.favorites_json.movies) {
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movie[movieKey]);
            });
          }

          if (row.favorites_json.tv) {
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvShow[tvKey]);
            });
          }
        });
        this.moviesFetched = moviesFetched.reverse();
        this.tvFetched = tvFetched.reverse();
      } catch (error) {
        console.error('Error', error.message);
      }
    },
    toggleOrder(event) {
      const selectedOption = event.target.value;
      if (selectedOption === 'asc') {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
        this.orderText = 'Order Asc';
      } else if (selectedOption === 'desc') {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
        this.orderText = 'Order Desc';
      }
    },

    changePageMovies(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= Math.ceil(this.moviesFetched.length / this.moviesPerPage)) {
        this.currentPageMovies = pageNumber;
      }
    },
    changePageTV(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= Math.ceil(this.tvFetched.length / this.tvPerPage)) {
        this.currentPageTV = pageNumber;
      }
    },

    goToFirstMovies() {
      this.currentPageMovies = 1;
    },
    goToLastMovies() {
      this.currentPageMovies = Math.ceil(this.moviesFetched.length / this.moviesPerPage);
    },
    prevPageMovies() {
      if (this.currentPageMovies > 1) {
        this.currentPageMovies--;
      }
    },
    nextPageMovies() {
      if (this.currentPageMovies < this.totalMoviePages) {
        this.currentPageMovies++;
      }
    },

    goToFirstTV() {
      this.currentPageTV = 1;
    },
    goToLastTV() {
      this.currentPageTV = Math.ceil(this.tvFetched.length / this.tvPerPage);
    },
    prevPageTV() {
      if (this.currentPageTV > 1) {
        this.currentPageTV--;
      }
    },
    nextPageTV() {
      if (this.currentPageTV < this.totalTVPages) {
        this.currentPageTV++;
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    goToSettings() {
      this.$router.push('/settings');
    },

    signOut() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      window.location.href = 'https://es--sonarflix.netlify.app/login';
    },
  },
  computed: {
    visibleMoviePages() {
      const totalPages = Math.ceil(this.moviesFetched.length / this.moviesPerPage);
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPageMovies - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
    visibleTVPages() {
      const totalPages = Math.ceil(this.tvFetched.length / this.tvPerPage);
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.currentPageTV - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    },
    moviesToShow() {
      const startIndex = (this.currentPageMovies - 1) * this.moviesPerPage;
      const endIndex = startIndex + this.moviesPerPage;
      return this.moviesFetched.slice(startIndex, endIndex);
    },
    tvToShow() {
      const startIndex = (this.currentPageTV - 1) * this.tvPerPage;
      const endIndex = startIndex + this.tvPerPage;
      return this.tvFetched.slice(startIndex, endIndex);
    },
    totalMoviePages() {
      return Math.ceil(this.moviesFetched.length / this.moviesPerPage);
    },
    totalTVPages() {
      return Math.ceil(this.tvFetched.length / this.tvPerPage);
    }
  }
};
</script>


<style scoped>
.avatar-container {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #acafb5;
  border-radius: 5px;
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.menu-label {
  color: #94999d;
  margin-top: 3px;
}

.menu-label:hover {
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
    cursor: move;
  } 

  .navbar-title {
    color: #fff;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .user-email {
    font-weight: bold; 
    font-size: 13px; 
    border-radius: 15px;
    margin-top: 2rem;
    color: #94999d;
    font-size: 13px;
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
    right: 5%; 
    margin-top: 1rem;
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
    background-color: #062F40;
    font-size: 12px; 
    box-shadow: 0 3px 15px 0 rgba(31, 97, 135, 0.37); 
    color: #cfcfcf;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    width: 142.626px;
    height: 34.6172px;
    transform: translate(-1.50976px, 3.8843px);
    transition: none 0s ease 0s;
  }

  .order-select:hover{
    background-color: #084a66; 
  }

  .button:hover{
    background-color: #084a66; 
  }

  pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .pagination button {
    background-color: #082D3E;
    color: #FFF;
    width: 30px;
    height: 30px;
    margin: 0 5px 5px;
    border: none;
    border-radius: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .pagination button.active {
    background-color: #59A2B2;
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
    cursor: move;
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
    max-width: 800px; 
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

  .movie-card img,
  .tv-show-card img {
    width: 60%; 
    border-radius: 15px;
    text-align: center;
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


