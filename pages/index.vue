<template>
  <main class="main">
    <div v-if="isLoggedIn" class="user-profile">
        <div class="avatar-container" @click="toggleMenu">
          <span class="user-email">{{ userEmail }}</span>
          <img :src="userAvatar" alt="User Avatar" class="avatar">
          <div v-if="isMenuOpen" class="dropdown-menu">
            <div class="menu-item" @click="goToSettings">
              <img src="~/static/icon-settings.png" alt="Settings Icon" class="settings-icon">
              <span class="menu-label1">Mi Cuenta</span>
            </div>
            <div class="menu-item" @click="signOut">
              <img src="~/static/icon-logout.png" alt="Logout Icon" class="logout-icon">
              <span class="menu-label2">Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="user-profile-else">
      <div class="avatar-container-else" @click="toggleMenu">
        <img src="/avatars/avatar-ss0.png" alt="User Avatar" class="avatar-else"> 
        <div v-if="isMenuOpen" class="dropdown-menu-else">
          <div class="menu-item" @click="goToLogin">
            <img src="~/static/icon-login.png" alt="Login Icon" class="login-icon">
            <span class="menu-label1">Login</span>
          </div>
        </div>
      </div>
    </div>
    <FeatureDescription />

    <Hero
      :item="featured" />

    <ListingCarousel
      v-if="trendingMovies && trendingMovies.results.length"
      :title="trendingMoviesTitle"
      :view-all-url="trendingMoviesUrl"
      :items="trendingMovies" />

    <ListingCarousel
      v-if="trendingTv && trendingTv.results.length"
      :title="trendingTvTitle"
      :view-all-url="trendingTvUrl"
      :items="trendingTv" />

      <CustomListingCategoriesMovies
    :title="'Categories Movies'"
    :view-all-url="null"/>

    <CustomListingCategoriesSeries
    :title="'Categories Series'"
    :view-all-url="null"/>

  </main>
</template>

<script>
import { getTrending, getMovie, getTvShow, getListItem } from '~/api';
import Hero from '~/components/Hero';
import ListingCarousel from '~/components/ListingCarousel';
import FeatureDescription from '~/components/FeatureDescription';
import CustomListingCategoriesMovies from '~/components/CustomListingCategoriesMovies';
import CustomListingCategoriesSeries from '~/components/CustomListingCategoriesSeries';
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
      userAvatar: '/avatars/avatar-ss0.png',
      userName: '',
      isMenuOpen: false,
    }
  },

  async mounted() {
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

  components: {
    FeatureDescription,
    Hero,
    ListingCarousel,
    CustomListingCategoriesMovies,
    CustomListingCategoriesSeries,
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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
      window.location.href = 'https://es.cinemathe.space/';
    },
  },

  computed: {
    trendingMoviesTitle () {
      return getListItem('movie', 'trending').title;
    },

    trendingMoviesUrl () {
      return { name: 'movie-category-name', params: { name: 'trending' } };
    },

    trendingTvTitle () {
      return getListItem('tv', 'trending').title;
    },

    trendingTvUrl () {
      return { name: 'tv-category-name', params: { name: 'trending' } };
    },
  },

  async asyncData ({ error }) {
    try {
      const trendingMovies = await getTrending('movie');
      const trendingTv = await getTrending('tv');
      let featured;

      const items = [...trendingMovies.results, ...trendingTv.results];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const media = randomItem.title ? 'movie' : 'tv';

      if (media === 'movie') {
        featured = await getMovie(randomItem.id);
      } else {
        featured = await getTvShow(randomItem.id);
      }

      return { trendingMovies, trendingTv, featured };
    } catch {
      error({ statusCode: 504, message: 'Data not available' });
    }
  },
};
</script>
<style scoped>

  .avatar-container {
    position: relative;
    top: -44px;
    cursor: pointer;
  }

  .avatar-container-else {
    position: relative;
    top: -44px;
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
    margin-left: 5rem;
    color: #94999d;
    text-align: center;
  }

  .user-profile {
    position: absolute;
    right: 3%; 
    margin-left: 2rem;
  }

  .user-profile-else {
    position: absolute;
    right: 3%; 
    margin-left: 2rem;
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
    width: 149.574px;
    top: 100%;
    background-color: #062F40;
    box-shadow: 0 3px 15px 0 rgba(31, 97, 135, 0.37); 
    border: 1px solid #acafb5;
    border-radius: 5px;
    z-index: 100;
    display: none;
  }

  .dropdown-menu {
    display: block;
    margin-left: 6.5rem;
  }

  .dropdown-menu-else {
    position: relative; 
    top: 100%;
    height: 38px;
    background-color: #062F40;
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

</style>
