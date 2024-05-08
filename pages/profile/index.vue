<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <h1 class="text-white text-center"><b>Welcome Back! {{ userEmail }}</b></h1>
      <br>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <h2 v-if="moviesFetched.length > 0" class="text-white text-center">Favorite Movies</h2>
          <div class="movie-grid">
            <div v-for="(movie, index) in moviesFetched" :key="index" class="movie-card">
              <a :href="'https://sonarflix.netlify.app/movie/' + movie.details.idForDb">
                <img :src="movie.details.posterForDb" alt="Movie Poster" class="poster" />
              </a>
              <h3>{{ movie.details.nameForDb }}</h3>
              <p v-if="movie && movie.details && movie.details.starsForDb !== null && movie.details.starsForDb !== undefined && !Array.isArray(movie.details.starsForDb)">Rating: {{ movie.details.starsForDb.toString().slice(0, 1) + '.' + movie.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Rating: Not Specified</p>
              <p>Release Date: {{ movie.details.yearStartForDb }}</p>
            </div>
          </div>
        </div>
        <br>
        <div class="column">
          <h2 v-if="tvFetched.length > 0" class="text-white text-center">Favorite TV Shows</h2>
          <div class="tv-show-grid">
            <div v-for="(tvShow, index) in tvFetched" :key="index" class="tv-show-card">
              <a :href="'https://sonarflix.netlify.app/tv/' + tvShow.details.idForDb">
                <img :src="tvShow.details.posterForDb" alt="TV Show Poster" class="poster" />
              </a>
              <h3>{{ tvShow.details.nameForDb }}</h3>
              <p v-if="tvShow && tvShow.details && tvShow.details.starsForDb !== null && tvShow.details.starsForDb !== undefined && !Array.isArray(tvShow.details.starsForDb)">Rating: {{ tvShow.details.starsForDb.toString().slice(0, 1) + '.' + tvShow.details.starsForDb.toString().charAt(1) }}</p>
              <p v-else>Rating: Not Specified</p>
              <p>Aired: 
                {{ tvShow.details.yearStartForDb === tvShow.details.yearEndForDb ? tvShow.details.yearEndForDb : tvShow.details.yearStartForDb + '-' + tvShow.details.yearEndForDb }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No favorites or list added yet.</p>
      </div>
      <br>
      <div class="button-container">
        <button class="button button--icon" @click="signOut">
          <span class="txt">Log out</span>
        </button>
      </div>
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
      tvKey: '' 
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
        this.moviesFetched = moviesFetched;
        this.tvFetched = tvFetched;
      } catch (error) {
        console.error('Error', error.message);
      }
    },
    signOut() {
      localStorage.removeItem('access_token');
      console.log('access_token eliminado del localStorage');
      localStorage.removeItem('email');
      console.log('email eliminado del localStorage');
      window.location.href = 'https://sonarflix.netlify.app/login';
    },
  }
};
</script>

<style scoped>
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
    font-size: 11px; 
  }

  .button-container {
    display: flex;
    justify-content: center;
    
  }

  .profile-section {
    padding: 10px;
    
  }

  .button {
    border-radius: 10px;
  }

  .column {
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

    .movie-card img,
    .tv-show-card img {
      width: 50%;
    }
  }
</style>