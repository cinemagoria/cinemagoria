<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <nav class="navbar">
        <h1 class="navbar-title">Welcome Back! <span class="user-email">{{ userEmail }}</span></h1>
        <div class="nav-button-container">
          <button class="button-logout" @click="signOut">
            <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
            <span class="txt">Log out</span>
          </button>
        </div>
      </nav>
      <br>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <div class="button-container" style="margin-top: 3rem;">
            <select @change="toggleOrder" class="order-select">
              <option value="asc" :selected="orderText === 'Order Asc'">
                <span class="order-word">Order:</span> <span class="order-option">Last Added</span>
              </option>
              <option value="desc" :selected="orderText === 'Order Desc'">
                <span class="order-word">Order:</span> <span class="order-option">First Added</span>
              </option>
            </select>
          </div>
          <br>
          <h2 v-if="moviesFetched.length > 0" class="text-center" style="color: #8BE9FD; font-size: 16px; margin-top:10px;">Favorite Movies</h2>

          <div class="movie-grid">
            <div v-for="(movie, index) in moviesToShow" :key="'movie-' + index" class="movie-card">
              <a :href="'https://sonarflix.netlify.app/movie/' + movie.details.idForDb">
                <img :src="movie.details.posterForDb" alt="Movie Poster" class="poster" />
                <h3>{{ movie.details.nameForDb }}</h3>
              </a>
              <p v-if="movie && movie.details && movie.details.starsForDb !== null && movie.details.starsForDb !== undefined && !Array.isArray(movie.details.starsForDb)">Rating: {{ movie.details.starsForDb.toString().slice(0, 1) + '.' + movie.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Rating: Not Specified</p>
              <p>Release Date: {{ movie.details.yearStartForDb }}</p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="moviesFetched.length > moviesPerPage">
            <button @click="goToFirstMovies" :disabled="currentPageMovies === 1">|<</button>
            <button @click="prevPageMovies" :disabled="currentPageMovies === 1"><<</button>
            <span>
              <label for="moviePage" style="font-size:13px;">Page</label>
              <input type="number" id="moviePage" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" v-model.number="currentPageMovies" min="1" :max="totalMoviePages">

            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalMoviePages }}</span>
            <button @click="nextPageMovies" :disabled="currentPageMovies === totalMoviePages">>></button>
            <button @click="goToLastMovies" :disabled="currentPageMovies === totalMoviePages">>|</button>
          </div>
  

        </div>
        <br>
        <div class="column">
          <br>
          <h2 v-if="tvFetched.length > 0" class="text-center" style="color: #8BE9FD; font-size: 16px;">Favorite TV Shows</h2>
          <div class="tv-show-grid">
            <div v-for="(tvShow, index) in tvToShow" :key="'tvShow-' + index" class="tv-show-card">
              <a :href="'https://sonarflix.netlify.app/tv/' + tvShow.details.idForDb">
                <img :src="tvShow.details.posterForDb" alt="TV Show Poster" class="poster" />
                <h3>{{ tvShow.details.nameForDb }}</h3>
              </a>
              <p v-if="tvShow && tvShow.details && tvShow.details.starsForDb !== null && tvShow.details.starsForDb !== undefined && !Array.isArray(tvShow.details.starsForDb)">Rating: {{ tvShow.details.starsForDb.toString().slice(0, 1) + '.' + tvShow.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Rating: Not Specified</p>
              <p>Aired:
                {{ tvShow.details.yearStartForDb === tvShow.details.yearEndForDb ? tvShow.details.yearEndForDb : tvShow.details.yearStartForDb + '-' + tvShow.details.yearEndForDb }}
              </p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="tvFetched.length > tvPerPage">
            <button @click="goToFirstTV" :disabled="currentPageTV === 1">|<</button>
            <button @click="prevPageTV" :disabled="currentPageTV === 1"><<</button>
            <span>
              <label for="tvPage" style="font-size:13px;">Page</label>
              <input type="number" style="border-radius: 7px; text-align: center; padding: 1px 2px 1px 4px; height: 20.9462px; transform: translate(2.83728px, -0.0009155px); width: 43.9908px;" id="tvPage" v-model.number="currentPageTV" min="1" :max="totalTVPages">
            </span>
            <span style="font-size: 13px; text-align: left; transform: translate(0px, 0px); position: relative; left: 4px; top: 0px; transition: none 0s ease 0s;">of {{ totalTVPages }}</span>
            <button @click="nextPageTV" :disabled="currentPageTV === totalTVPages">>></button>
            <button @click="goToLastTV" :disabled="currentPageTV === totalTVPages">>|</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="text-align: center;">No favorites or lists added yet.</p>
      </div>
      <br>

    </section>
  </main>
</template>

<script>
import supabase from '@/services/supabase';

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
    };
  },
  async mounted() {
    console.log(`Enlace unificado: ${this.favId}`);
    const email = localStorage.getItem('email');
    console.log('Email obtenido del localStorage:', email);
    const accessToken = localStorage.getItem('access_token');
    console.log('Token de acceso obtenido del localStorage:', accessToken);
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkData();
  },

  methods: {
    async checkData() {
      try {
        console.log('Iniciando conexión con la base de datos...');
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_email', this.userEmail);

        if (error) {
          throw new Error('Error al conectar con la base de datos: ' + error.message);
        }

        console.log('Datos obtenidos de la base de datos para el usuario actual:', data);
        const moviesFetched = [];
        const tvFetched = [];
        data.forEach((row) => {
          console.log('Usuario:', row.user_email);
          if (row.favorites_json.movies) {
            console.log('Películas favoritas:');
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movie[movieKey]);
            });
            console.log(moviesFetched);
          }

          if (row.favorites_json.tv) {
            console.log('Programas de TV favoritos:');
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvShow[tvKey]);
            });
            console.log(tvFetched);
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

    signOut() {
      localStorage.removeItem('access_token');
      console.log('access_token eliminado del localStorage');
      localStorage.removeItem('email');
      console.log('email eliminado del localStorage');
      window.location.href = 'https://sonarflix.netlify.app/login';
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
.order-word {
    color: #fff;
}

.order-option {
    color: #58A3B2;
}

.navbar {
    background-color: transparent;
    padding: 10px 0;
    margin-top: 3rem;
    text-align: center;
    position: relative;
    max-width: 800px; 
    width: 90%; 
    margin: 0 auto; 
  }

  .navbar-title {
    color: #fff;
    margin: 0 auto;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .user-email {
    color: #8BE9FD;
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

  .button-logout {
    background-color: #000;
    color: #fff;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s;
    font-weight: bold; 
    font-size: 14px; 
    border-radius: 15px;
    position: relative;
  }

  .button-logout:hover {
    background-color: #B22727;
  }

  .logout-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  .order-select {
    background-color: #072E3F;
    color: #58A3B2;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    width: 142.626px;
    height: 34.6172px;
    transform: translate(-1.50976px, 3.8843px);
    transition: none 0s ease 0s;
    border-radius: 15px;
  }

  pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .pagination button {
    background-color: #082D3E;
    color: #FFF;
    width: 40px;
    height: 40px;
    margin: 0 5px 5px;
    border: none;
    border-radius: 50%;
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

@media screen and (max-width: 600px) {
  .button .navbar-title {
    font-size: 12px; 
  }

  .button-logout {
    align-items: flex-start;
    display: inline-block;
    line-height: 16.1px;
    padding: 10px 15px;
    text-align: center;
  }

  .navbar-title {
    line-height: 24px;
    margin: 0px 125.742px 20px;
    text-align: center;
  }
}

@media screen and (max-width: 375px) {
  .button {
    font-size: 12px; 
  }
}

@media screen and (max-width: 767px) {
    .navbar-title {
      margin-bottom: 20px;
    }

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

