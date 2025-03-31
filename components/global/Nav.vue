<template>
  <nav :class="$style.nav">
    <ul class="nolist">
      <li>
        <nuxt-link
          exact
          :to="{ name: 'index' }"
          aria-label="Home"
          @click.native="clearSearchBeforeNavigate">
          <img src="~static/icon-medium.png" alt="Home" style="width: 32px; height: 32px;" />
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'movie' }"
          aria-label="Movies"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round">
              <path d="M3.2 12.8h19.6v9.5c0 .5-.4.9-1 .9H4.1c-.5 0-1-.4-1-.9v-9.5"/>
              <path d="M3.3 13.1l-2-4.4c-.2-.5 0-1 .5-1.2L18 .8c.5-.2 1.1 0 1.3.5l1.8 4-17.5 7.3"/>
              <path d="M15 2.1l-.9 6M8 4.7l-1.2 6.6"/>
            </g>
          </svg>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'tv' }"
          aria-label="TV Shows"
          @click.native="clearSearchBeforeNavigate">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-miterlimit="10">
              <path d="M21.4 23H2.6c-.9 0-1.6-.7-1.6-1.6V8.9c0-.9.7-1.6 1.6-1.6h18.9c.8 0 1.5.7 1.5 1.6v12.6c0 .8-.7 1.5-1.6 1.5"/>
              <path d="M6.4 1L12 7M17.6 1L12 7"/>
            </g>
          </svg>
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'advancedsearch' }"
          aria-label="Advanced Search"
          @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-advancedsearch.png')" alt="Login" style="width: 24px; height: 24px; margin-top: 3px;" />
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="{ name: 'upcoming' }"
          aria-label="upcoming"
          @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-upcoming.png')" alt="Login" style="width: 24px; height: 24px; margin-top: 2px;" />
        </nuxt-link>
      </li> 
      <!-- Ask AI Link -->
      <li>
        <button @click="openAiChat" aria-label="Ask AI" title="Ask AI Assistant">
          <span class="spark-icon" style="cursor: pointer; display: inline-block; vertical-align: middle; position: relative;">
            <!-- Beta Tag -->
            <span style="position: absolute; top: -4px; right: -8px; background-color: #FF5252; color: white; font-size: 8px; padding: 1px 3px; border-radius: 4px; font-weight: bold; z-index: 1;">BETA</span>
            <!-- SVG Spark Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width: 24px; height: 24px; color: white;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </span>
        </button>
      </li>
      <li v-if="!isLoggedIn">
        <nuxt-link exact to="/login" aria-label="Auth" @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-login.png')" alt="Login" style="width: 24px; height: 24px; margin-top: 2px;" />
        </nuxt-link>
      </li>
      <li v-else>
        <nuxt-link exact to="/watchlist" aria-label="watchlist" @click.native="clearSearchBeforeNavigate">
          <img :src="require('~/static/icon-watchlist.png')" alt="watchlist" style="width: 24px; height: 24px; margin-top: 2px;" />
        </nuxt-link>
      </li>

    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      authToken: null,
      authInterval: null
    };
  },
  
  computed: {
    ...mapState('search', ['searchOpen']),
    isLoggedIn() {
      return this.authToken !== null;
    }
  },

  mounted() {
    this.checkAuthStatus();
    this.authInterval = setInterval(this.checkAuthStatus, 100);
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('auth-changed', this.checkAuthStatus);
    
    if (window.location.pathname.includes('auth-success')) {
      this.forceUpdateNavIcons();
    }
  },
  
  beforeDestroy() {
    if (this.authInterval) {
      clearInterval(this.authInterval);
    }
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('auth-changed', this.checkAuthStatus);
  },

  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('access_token');
      if (token !== this.authToken) {
        this.authToken = token;
        this.$forceUpdate();
      }
    },
    
    forceUpdateNavIcons() {
      const token = localStorage.getItem('access_token');
      this.authToken = token;
      this.$forceUpdate();
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.authToken = localStorage.getItem('access_token');
          this.$forceUpdate();
        }, 150 * (i + 1));
      }
    },
    
    handleStorageChange(event) {
      if (event.key === 'access_token') {
        this.authToken = event.newValue;
        this.$forceUpdate();
      }
    },
    
    clearSearchBeforeNavigate() {
      this.$root.$emit('clear-search');
    },
    
    toggleSearch() {
      if (this.$route.name !== 'search') {
        this.$store.commit('search/toggleSearch');
      }
    },
  },
};
</script>

<style lang="scss" module>
@import '~/assets/css/utilities/_variables.scss';

.nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  height: 4.5rem;
  background-color: #000;

  @media (min-width: $breakpoint-large) {
    top: 0;
    right: auto;
    width: 10rem;
    height: 100%;
    border-right: 1px solid $secondary-color;
  }

  ul {
    display: flex;
    height: 100%;

    @media (min-width: $breakpoint-large) {
      flex-direction: column;

    }

    li {
      flex: 1 1 auto;
      height: 100%;

    span {
      margin-left: 3.6rem;
      margin-bottom: 2rem;
    }

      @media (min-width: $breakpoint-large) {
        flex: 0 1 auto;
        height: 10rem;
      }
    }
  }

  button {
    padding: 0;
    margin: 0;
    background: none;
  }

  a,
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    outline: 0;
    transition: all 0.2s;

    &:hover,
    &:focus {
      opacity: 0.8;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '~/assets/css/utilities/_variables.scss';

a.nuxt-link-active {
  &:hover,
  &:focus {
    opacity: 1;
  }

  svg g {
    stroke: $primary-color;
  }
}
</style>
