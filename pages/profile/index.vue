<template>
  <main class="main">
    <section class="profile-section">
      <br>
      <div class="user-profile">
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
      <br>
      <nav class="navbar" style="margin-top: 4rem;">
        <h1 class="navbar-welcome">¡Bienvenid@ nuevamente!</h1>
      </nav>
      <h2 class="text-center" style="color: #acafb5; font-size: 16px; margin-top: 10px; position: relative; text-transform: none; left: -2px; top: -20px;">{{ userName }}</h2>
      <div v-if="moviesFetched.length > 0 || tvFetched.length > 0">
        <div class="column">
          <h2 class="text-center" style="color: #acafb5; font-size: 16px;">{{ filterText }} Favoritas</h2>
          <div class="button-container" style="margin-top: 3rem;">
            <select @change="toggleFilter" class="filter-select">
              <option value="movies">&nbsp;&nbsp;&nbsp;Películas</option>
              <option value="tvShows">&nbsp;&nbsp;&nbsp;Series de TV</option>
            </select>
            <select @change="toggleOrder" class="order-select">
              <option value="asc" :selected="orderText === 'Order Asc'">
                <span class="order-word"></span> <span class="order-option">&nbsp;&nbsp;&nbsp;Últimas adiciones</span>
              </option>
              <option value="desc" :selected="orderText === 'Order Desc'">
                <span class="order-word"></span> <span class="order-option">&nbsp;&nbsp;&nbsp;Primeras adiciones</span>
              </option>
            </select>
          </div>
          <div class="button-container" style="margin-top: 0.2rem;">
            <select @change="filterByGenre" class="genre-select">
              <option value="">&nbsp;&nbsp;&nbsp;Todos los géneros</option>
              <option v-for="genre in uniqueGenres" :key="genre" :value="genre">&nbsp;&nbsp;&nbsp;{{ genre }}</option>
            </select>
            <select @change="filterByYear" class="year-select">
              <option value="">&nbsp;&nbsp;&nbsp;Todos los años</option>
              <option v-for="range in yearRanges" :key="range" :value="range">&nbsp;&nbsp;&nbsp;{{ range }}</option>
            </select>
          </div>
          <div class="movie-grid" style="position: relative; top:-17px; margin-top: 0.3rem;">
            <div v-for="(item, index) in itemsToShow" :key="'item-' + index" class="movie-card">
              <a :href="getLink(item)">
                <img :src="item.details.posterForDb" alt="Poster" class="poster" />
                <h3>{{ item.details.nameForDb }}</h3>
              </a>
              <p>
                {{
                  item.details.yearStartForDb === item.details.yearEndForDb
                  ? item.details.yearEndForDb
                  : (item.details.yearStartForDb + (item.details.yearEndForDb ? `-${item.details.yearEndForDb}` : ''))
                }}
              </p>
              <p v-if="item.details.starsForDb">Puntaje: {{ formatRating(item.details.starsForDb) }}</p>
              <p v-else>Puntaje: No especificado</p>
            </div>
          </div>
          <br>
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
        </div>
      </div>
      <div v-else>
        <p style="text-align: center;">No hay favoritos agregados todavía.</p>
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

    const userName = data[0]?.first_name|| 'undefined';
    return userName;
    
  } catch (error) {
    console.error('Error fetching user first_name:', error);
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
      orderText: 'Order Asc',
      currentPage: 1,
      itemsPerPage: 12,
      userAvatar: '/avatars/avatar-ss0.png',
      userName: '',
      isMenuOpen: false,
      filter: 'movies',
      selectedGenre: '',
      selectedYearRange: '',
      genres: [],
      years: [],
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
    this.userName = await getUserName(this.userEmail);
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
        const genres = new Set();
        const years = new Set();
        data.forEach((row) => {
          if (row.favorites_json.movies) {
            row.favorites_json.movies.forEach((movie) => {
              const movieKey = Object.keys(movie)[0];
              moviesFetched.push(movie[movieKey]);
              genres.add(...movie[movieKey].details.genresForDb.split(', '));
              years.add(movie[movieKey].details.yearStartForDb);
            });
          }

          if (row.favorites_json.tv) {
            row.favorites_json.tv.forEach((tvShow) => {
              const tvKey = Object.keys(tvShow)[0];
              tvFetched.push(tvShow[tvKey]);
              genres.add(...tvShow[tvKey].details.genresForDb.split(', '));
              years.add(tvShow[tvKey].details.yearStartForDb);
            });
          }
        });
        this.moviesFetched = moviesFetched.reverse();
        this.tvFetched = tvFetched.reverse();
        this.genres = Array.from(genres);
        this.years = Array.from(years).sort();
      } catch (error) {
        console.error(error.message);
      }
    },

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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

    getLink(item) {
      if (item.details.typeForDb === 'movie') {
        return `https://es.cinemathe.space/movie/${item.details.idForDb}`;
      } else if (item.details.typeForDb === 'tv') {
        return `https://es.cinemathe.space/tv/${item.details.idForDb}`;
      } else {
        return '#'; 
      }
    }
  },
  computed: {
    filteredItems() {
      const items = this.filter === 'movies' ? this.moviesFetched : this.tvFetched;
      return items.filter(item => {
        const matchesGenre = this.selectedGenre === '' || item.details.genresForDb.includes(this.selectedGenre);
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
      return this.filter === 'tvShows' ? 'Series de TV' : 'Películas';
    }
  },
};
</script>


<style scoped>
.navbar-welcome {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.dropdown-menu {
  position: relative; 
  width: 149.574px;
  top: 100%;
  background: rgba( 82, 71, 71, 0 );
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
  margin-left: 20px;
}

.text-center {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.text-center-grey {
  text-align: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(115, 115, 115) 100%);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
  font-family: 'Roboto', sans-serif;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #084a66; 
}

.menu-label1 {
  color: #94999d;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative; 
  top: 2px;
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
    transform: translateY(-50%);
    right: 20px; 
  }

  .user-profile {
    position: absolute;
    right: 3%; 
    margin-top: 1rem;
  }

  .avatar {
    width: 40px;
    border: 1px solid rgba(255, 255, 255, 0.654);
    height: 40px;
    box-shadow: 0 5px 32px 0 rgba(31, 97, 135, 0.37);
    border-radius: 50%;
    margin-left: 1rem;
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
    width: 172.626px;
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
    width: 168px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    text-align: center;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    border-radius: 5px;
  }

  .filter-select:hover{
    background-color: #084a66; 
  }

  .genre-select {
    width: 168px;
    background: rgba( 82, 71, 71, 0 );
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    text-align: center;
    width: 165.626px;
    margin-right: 2px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    border-radius: 5px;
  }

  .genre-select:hover{
    background-color: #084a66; 
  }

  .year-select {
    width: 172.626px;
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
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border: 1px solid rgba( 255, 255, 255, 0.18 );
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


