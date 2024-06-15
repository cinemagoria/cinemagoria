<template>
  <div :class="$style.container">
    <div :class="$style.form">
      <form style="width: 100%;" autocomplete="off" @submit.prevent>
        <label class="visuallyhidden" for="search">Search</label>
        <div class="field-wrapper">
          <div :class="$style.field">
            <button 
              v-if="!isRootPage"
              type="button" 
              style="padding: 0; background-color: black; top: -3px; left: 5px; position: relative;"
              aria-label="Go Back" 
              class="button"
              @click="goBack">
              <svg xmlns="http://www.w3.org/2000/svg"
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24">
                <path 
                  fill="none" 
                  stroke="#fff" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-miterlimit="10" 
                  d="M16.5 20.5l-9-8.5 9-8.5">
                </path>
              </svg>
            </button>
            <input
              id="search"
              ref="input"
              v-model.trim="query"
              name="search"
              type="text"
              placeholder="Type to search.."
              @keyup="goToRoute"
              @blur="unFocus"
            >
            <button
              style="-webkit-appearance: button; 
              cursor: pointer; 
              position: absolute;
              right: 2%;
              margin-left: 2rem;"
              v-if="showButton"
              type="button"
              aria-label="Close"
              @click="goBack"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                <g fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5">
                  <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"/>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
    <div :class="$style.userMenu">
      <!---->
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'lodash';
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
      query: this.$route.query.q ? this.$route.query.q : '',
      showLanguageMenu: false,
      selectedLanguage: 'english',
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
      userAvatar: '/avatars/avatar-ss0.png',
      userName: '',
      isMenuOpen: false,
      languageMenuStyle: { position: 'absolute' },
    };
  },
  computed: {
    isRootPage() {
      return this.$route.path === '/';
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
    showButton() {
      return this.$route.name === 'search';
    },
    ...mapState('search', ['fromPage']),
  },
  async mounted() {
    this.goToRoute = debounce(this.goToRoute, 1000);
    this.$refs.input.focus();
    this.showLanguageMenu = false;
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
    this.$root.$on('clear-search', this.clearSearch);
  },
  beforeDestroy() {
    this.$root.$off('clear-search', this.clearSearch);
  },
  methods: {
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu;
      const menu = this.$refs.languageMenu;
      if (menu) {
        menu.style.display = this.showLanguageMenu ? 'block' : 'none';
        this.languageMenuStyle = this.showLanguageMenu ? { position: 'fixed' } : { position: 'absolute' };
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
    goToRoute() {
      if (this.query) {
        this.$router.push({
          name: 'search',
          query: { q: this.query },
        });
      } else {
        this.$router.push({
          path: this.fromPage,
        });
      }
    },
    clearSearch() {
      this.query = '';
    },

    goBack() {
      this.clearSearch();
      this.$router.go(-1);
    },

    unFocus(e) {
      if (this.$route.name !== 'search') {
        const target = e.relatedTarget;
        const fromLink = target && target.tagName.toLowerCase() === 'a' && target.getAttribute('href') === '/search-genre';
        if (!target || (!target.classList.contains('search-toggle') && !fromLink)) {
          this.query = '';
          this.$store.commit('search/closeSearch');
        }
      }
    },
  },
};
</script>

<style lang="scss" module>
@import '~/assets/css/utilities/_variables.scss';
body {
  font-family: 'Roboto', sans-serif;
}
.language-selector {
  position: relative;
  font-family: 'Roboto';
  text-transform: uppercase;
}

.container {
  display: flex;
  width: 100%;
}

.form {
  width: 50%;
  background-color: black;
}

.userMenu {
  width: 50%;
  background-color: black;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
}

.field {
  display: flex;
  align-items: flex-start;
  background-color: black;
}

input[type='text'] {
  flex: 1;
  height: 5rem;
  padding: 2.1rem 1.5rem;
  margin-top: 3px;
  font-size: 1.6rem;
  color: #fff;
  background: none;
  border: 0;
  outline: 0;
}

button {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  background: none;
  margin-top: 20px;
  
}


.avatar-container {
    position: relative;
    top: -53.4px;
    cursor: pointer;
  }

  .language-selector,
  .avatar-container-else {
    width: 50%;
  }

  .world-icon {
    width: 13px;
    height: 13px;
    font-weight: 600;
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


  .user-email {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgb(220, 220, 220) 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 1px 1px 2px rgba(150, 150, 150, 0.5);
    font-family: 'Roboto', sans-serif;
    font-size: 13px; 
    border-radius: 15px;
    margin-top: 2rem;
    margin-left: 13px;
    color: #94999d;
    text-align: center;
  }

  .user-profile {
    position: absolute;
    right: 3%; 
    margin-left: 2rem;
  }

  .user-profile-else {
    width: 25%;
  }

  .profile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    margin-left: 6.5rem;
  }

  .dropdown-menu-else {
    position: relative; 
    top: 100%;
    height: 38px;
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 8px 32px 0 rgba(31, 104, 135, 0.37);
    backdrop-filter: blur( 16px );
    -webkit-backdrop-filter: blur( 16px );
    border-radius: 5px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
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
