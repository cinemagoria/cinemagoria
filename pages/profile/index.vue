<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <nav class="navbar">
      <h1 class="navbar-title">Bienvend@ Nuevamente! <span class="user-email">{{ userEmail }}</span></h1>
        <div class="nav-button-container">
          <button class="button-logout" @click="signOut">
            <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
            <span class="txt">Cerrar sesión</span>
          </button>
        </div>
      </nav>
      <br>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <div class="button-container" style="margin-top:3rem;">
            <div class="button" @click="toggleOrder">
              <span>Ordenar:</span>&nbsp;&nbsp;
              <span v-if="orderText === 'Order Asc'" style="color: #8BE9FD;">Primeras Adiciones</span>
              <span v-else style="color: #8BE9FD;">Últimas Adiciones</span>
            </div>
          </div>
          <br>
          <h2 v-if="moviesFetched.length > 0" class="text-center" style="color: #8BE9FD; font-size: 16px; margin-top:10px;">Películas Favoritas</h2>
          
          <div class="movie-grid">
            <div v-for="(movie, index) in moviesToShow" :key="'movie-' + index" class="movie-card">
              <a :href="'https://es--sonarflix.netlify.app/movie/' + movie.details.idForDb">
                <img :src="movie.details.posterForDb" alt="Movie Poster" class="poster" />
                <h3>{{ movie.details.nameForDb }}</h3>
              </a>
              <p v-if="movie && movie.details && movie.details.starsForDb !== null && movie.details.starsForDb !== undefined && !Array.isArray(movie.details.starsForDb)">Puntaje: {{ movie.details.starsForDb.toString().slice(0, 1) + '.' + movie.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Puntaje: No especificado</p>
              <p>Fecha de lanzamiento: {{ movie.details.yearStartForDb }}</p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="moviesFetched.length > moviesPerPage">
            <button v-for="page in Math.ceil(moviesFetched.length / moviesPerPage)" :key="page" @click="changePageMovies(page)" :class="{ 'active': currentPageMovies === page }">{{ page }}</button>
          </div>

        </div>
        <br>
        <div class="column">
          <br>
          <h2 v-if="tvFetched.length > 0" class="text-center" style="color: #8BE9FD; font-size: 16px;">Series de TV Favoritas</h2>
          <div class="tv-show-grid">
            <div v-for="(tvShow, index) in tvToShow" :key="'tvShow-' + index" class="tv-show-card">
              <a :href="'https://es--sonarflix.netlify.app/tv/' + tvShow.details.idForDb">
                <img :src="tvShow.details.posterForDb" alt="TV Show Poster" class="poster" />
                <h3>{{ tvShow.details.nameForDb }}</h3>
              </a>
              <p v-if="tvShow && tvShow.details && tvShow.details.starsForDb !== null && tvShow.details.starsForDb !== undefined && !Array.isArray(tvShow.details.starsForDb)">Puntaje: {{ tvShow.details.starsForDb.toString().slice(0, 1) + '.' + tvShow.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Puntaje: No especificado.</p>
              <p>Fecha de lanzamiento: 
                {{ tvShow.details.yearStartForDb === tvShow.details.yearEndForDb ? tvShow.details.yearEndForDb : tvShow.details.yearStartForDb + '-' + tvShow.details.yearEndForDb }}
              </p>
            </div>
          </div>
          <br>
          <div class="pagination" v-if="tvFetched.length > tvPerPage">
            <button v-for="page in Math.ceil(tvFetched.length / tvPerPage)" :key="page" @click="changePageTV(page)" :class="{ 'active': currentPageTV === page }">{{ page }}</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="text-align: center;">No hay favoritos o listas todavía.</p>
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
    const email = localStorage.getItem('email');
    const accessToken = localStorage.getItem('access_token');
    this.userEmail = email || '';
    this.hasAccessToken = accessToken !== null;
    this.isLoggedIn = accessToken !== null;
    this.checkData();
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
    toggleOrder() {
      if (this.orderText === 'Order Asc') {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
        this.orderText = 'Order Desc';
      } else {
        this.moviesFetched.reverse();
        this.tvFetched.reverse();
        this.orderText = 'Order Asc';
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

    signOut() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      window.location.href = 'https://es--sonarflix.netlify.app/login';
    },
  },
  computed: {
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
  }
};
</script>


<style scoped>
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
  .button-logout .button .navbar-title {
    font-size: 12px; 
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