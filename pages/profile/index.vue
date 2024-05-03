<template>
  <main class="main">
      <section class="profile-section">
          <br>
          <h1 class="text-white text-center"><b>Welcome Back! {{ userEmail }}</b></h1>
          <br>
          <div v-if="favorites.length > 0">
            <div v-for="(favorite, index) in favorites" :key="index">
              <h2 v-if="favorite.movies && favorite.movies.length > 0">Movies:</h2>
              <div v-if="favorite.movies && favorite.movies.length > 0">
                <ul>
                  <li v-for="(movie, movieIndex) in favorite.movies" :key="movieIndex">{{ movie }}</li>
                </ul>
              </div>
              <h2 v-if="favorite.tv && favorite.tv.length > 0">TV Shows:</h2>
              <div v-if="favorite.tv && favorite.tv.length > 0">
                <ul>
                  <li v-for="(tvShow, tvIndex) in favorite.tv" :key="tvIndex">{{ tvShow }}</li>
                </ul>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No favorites or list added so far.</p>
          </div>
          <br>
          <div class="button-container">
              <button class="button button--icon" @click="signOut">
                  <span class="txt">Sign out</span>
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
      favorites: []
    };
  },
  async mounted() {
    const email = localStorage.getItem('email');
    console.log('Email obtenido del localStorage:', email);
    const accessToken = localStorage.getItem('access_token');
    console.log('Token de acceso obtenido del localStorage:', accessToken);

    this.userEmail = email || '';
    this.accessToken = accessToken || '';
    this.isLoggedIn = accessToken !== null;

    if (!accessToken) {
      window.location.href = 'http://localhost:3000/login';
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('favorites_json')
        .eq('user_email', email);

      if (error) {
        console.error(error);
      } else {
        console.log('Valores de la tabla favorites:', data);
        this.favorites = data.map(favorite => favorite.favorites_json);
      }
    } catch (error) {
      console.error('Error al consultar la tabla favorites:', error.message);
    }
  },
  methods: {
    signOut() {
      localStorage.removeItem('access_token');
      console.log('access_token eliminado del localStorage');
      localStorage.removeItem('email');
      console.log('email eliminado del localStorage');
      window.location.href = 'http://localhost:3000/login';
    }
  }
};
</script>

  
  <style scoped>
    a {
      font-weight: 600;
      color: #80868b;
      text-decoration: none;
    }
  
    a:hover {
      color: #ffffff;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 20px; 
      letter-spacing: 2px;
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
  
    h2 {
      text-align: justify;
      letter-spacing: 2px;
      font-size: 11px;
      text-transform: uppercase;
      margin: 0 auto; 
      max-width: 800px; 
      margin-bottom: 20px; 
    }
  
    .custom-center {
      text-align: center;
    }
  </style>
  