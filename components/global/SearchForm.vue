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
              style="padding: 0; background-color: black; top: -4px; left: 5px; position: relative;"
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
              placeholder="Buscar.."
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
      userEmail: '',
      accessToken: '',
      isLoggedIn: false,
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
  this.userName = await getUserName(this.userEmail);

  if (this.isLoggedIn) {
    this.userName = await getUserName(this.userEmail);
  }
  this.$root.$on('clear-search', this.clearSearch);
  this.$root.$on('update-search-query', this.updateSearchQuery);
},

updateSearchQuery(newQuery) {
  this.query = newQuery;
  this.$nextTick(() => {
    if (this.$refs.input) {
      this.$refs.input.focus();
    }
  });
},

beforeDestroy() {
  this.$root.$off('clear-search', this.clearSearch);
  this.$root.$off('update-search-query', this.updateSearchQuery);
},
  methods: {
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
    
    updateSearchQuery(newQuery) {
      this.query = newQuery;
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus();
        }
      });
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
@use '~/assets/css/utilities/variables' as *;
body {
  font-family: 'Roboto', sans-serif;
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
  border-bottom: 1.5px solid rgba(28, 79, 97, 0.782);
  border-right: 1.5px solid rgba(34, 98, 121, 0.782);
  border-top: 1.5px solid rgba(34, 98, 121, 0.782);
  border-bottom-right-radius: 9px;
  border-top-right-radius: 9px;
}
.field-wrapper {
  display: flex;
  flex-direction: column;
}

.field {
  display: flex;
  align-items: flex-start;
  background-color: black;
  border-bottom: 1.5px solid rgba(28, 79, 97, 0.782);
  border-left: 1.5px solid rgba(28, 79, 97, 0.782);
  border-top: 1.5px solid rgba(34, 98, 121, 0.782);
  border-bottom-left-radius: 9px;
  border-top-left-radius: 9px;
}

input[type='text'] {
  flex: 1;
  height: 5rem;
  padding: 2.1rem 1.5rem;
  margin-top: 2px;
  font-size: 1.6rem;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #79cddf;
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

@media screen and (max-width: 600px) {
  .navbar-title {
    font-size: 12px; 
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
